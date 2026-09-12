#!/usr/bin/env bash
# One-time server setup for deltaenergysolution.com on the ERP VPS.
#
#   sudo bash server-setup.sh 'ssh-ed25519 AAAA...'
#
# The argument is the public half of the GitHub Actions deploy key. It is
# deliberately not committed to this repository: it arrives in the operator's
# hands and is pasted in by them.
#
# Idempotent. Safe to run again: every step checks before it acts, and the
# script stops the moment the ERP stops answering.
#
# What it does, in order, and why the order matters:
#
#   1. A `deploy` user that owns /srv/delta-site and nothing else. GitHub
#      Actions logs in as this user. Even a leaked key cannot reach the ERP.
#   2. A docker-compose.override.yml beside the ERP's compose file, mounting
#      /srv/delta-site read-only into delta-nginx. Compose merges override
#      files on its own, so the ERP's own file is never edited.
#   3. The bootstrap nginx block, HTTP only, so the ACME challenge can be
#      answered before any certificate exists.
#   4. Recreate delta-nginx to pick up the mount. This is the one moment the
#      ERP blips: a second or two of connection refused.
#   5. Issue the `deltasite` certificate. Its own certificate rather than
#      extra names on `delta`, so the two can never fail together.
#   6. Swap in the real nginx block, but test the rendered config in a
#      throwaway container first. A block that names a certificate file
#      which is not on disk stops nginx from starting, and in this stack
#      that takes the ERP down with it. `nginx -t` in a throwaway container
#      catches that with nothing at risk.
#   7. Restart nginx and verify that both the site and the ERP answer.
set -euo pipefail

PUBKEY="${1:-}"
DOMAIN=deltaenergysolution.com
CERT_NAME=deltasite
EMAIL=deltampm@gmail.com
SITE_ROOT=/srv/delta-site
DEPLOY_USER=deploy
ERP=/root/Delta-MVP/backend
TEMPLATES="$ERP/deploy/nginx/templates"
CERTBOT_CONF="$ERP/deploy/data/certbot/conf"
CERTBOT_WWW="$ERP/deploy/data/certbot/www"
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

say()    { printf '\n\033[1m== %s\033[0m\n' "$*"; }
die()    { printf '\n\033[31mABORT: %s\033[0m\n' "$*" >&2; exit 1; }
code()   { curl -sS -o /dev/null -m 15 -w '%{http_code}' "$1" 2>/dev/null || true; }
erp_ok() { [ "$(code "https://app.$DOMAIN/")" = 200 ]; }

[ "$(id -u)" = 0 ] || die "run as root"
[ -n "$PUBKEY" ] || die "pass the GitHub Actions public key as the first argument"
[[ "$PUBKEY" == ssh-ed25519\ * ]] || die "that does not look like an ssh-ed25519 public key"
[ -d "$TEMPLATES" ] || die "$TEMPLATES not found: is the ERP stack where this script expects?"
docker compose version >/dev/null 2>&1 || die "docker compose v2 is not available"
erp_ok || die "app.$DOMAIN is not answering 200 before we have started. Fix that first."

say "1. deploy user and $SITE_ROOT"
id -u "$DEPLOY_USER" >/dev/null 2>&1 || useradd -m -s /bin/bash "$DEPLOY_USER"
mkdir -p "$SITE_ROOT/releases"
chown -R "$DEPLOY_USER:$DEPLOY_USER" "$SITE_ROOT"
chmod 755 "$SITE_ROOT" "$SITE_ROOT/releases"
install -d -m 700 -o "$DEPLOY_USER" -g "$DEPLOY_USER" "/home/$DEPLOY_USER/.ssh"
AK="/home/$DEPLOY_USER/.ssh/authorized_keys"
touch "$AK"; chown "$DEPLOY_USER:$DEPLOY_USER" "$AK"; chmod 600 "$AK"
grep -qF "$PUBKEY" "$AK" || echo "no-agent-forwarding,no-port-forwarding,no-X11-forwarding $PUBKEY" >> "$AK"
command -v rsync >/dev/null || { apt-get update -qq && apt-get install -y -qq rsync; }

say "2. compose override: mount $SITE_ROOT into nginx, read-only"
cd "$ERP"
docker compose config --services | grep -qx nginx || die "no service named 'nginx' in $ERP/docker-compose.yml"
OVERRIDE="$ERP/docker-compose.override.yml"
if [ -f "$OVERRIDE" ]; then
  grep -q "$SITE_ROOT:$SITE_ROOT:ro" "$OVERRIDE" \
    || die "$OVERRIDE already exists. Add this under services.nginx.volumes by hand:  - $SITE_ROOT:$SITE_ROOT:ro"
else
  cat > "$OVERRIDE" <<EOF
# Added by Delta-Website/deploy/server-setup.sh. Compose merges this into
# docker-compose.yml on its own. Delete this file to undo.
services:
  nginx:
    volumes:
      - $SITE_ROOT:$SITE_ROOT:ro
EOF
fi

say "3. bootstrap nginx block (HTTP only)"
cp "$HERE/nginx/deltasite-bootstrap.conf.template" "$TEMPLATES/deltasite.conf.template"

say "4. recreate nginx with the new mount (the ERP blips for a second here)"
docker compose up -d nginx
sleep 3
erp_ok || die "app.$DOMAIN stopped answering after nginx was recreated. Roll back with:
  rm $TEMPLATES/deltasite.conf.template $OVERRIDE && cd $ERP && docker compose up -d nginx"
c="$(code "http://$DOMAIN/")"
[ "$c" = 200 ] || [ "$c" = 404 ] || die "http://$DOMAIN/ returned $c, expected 200 or 404"

say "5. certificate: $CERT_NAME"
if [ -d "$CERTBOT_CONF/live/$CERT_NAME" ]; then
  echo "already issued, skipping"
else
  docker run --rm \
    -v "$CERTBOT_CONF:/etc/letsencrypt" \
    -v "$CERTBOT_WWW:/var/www/certbot" \
    certbot/certbot certonly --webroot -w /var/www/certbot \
    --cert-name "$CERT_NAME" -d "$DOMAIN" -d "www.$DOMAIN" \
    --email "$EMAIL" --agree-tos --no-eff-email --non-interactive
fi
[ -f "$CERTBOT_CONF/live/$CERT_NAME/fullchain.pem" ] || die "certificate is not on disk after issuance"

say "6. real nginx block: testing the rendered config before it goes live"
cp "$HERE/nginx/deltasite.conf.template" "$TEMPLATES/deltasite.conf.template"
if ! docker compose run --rm --no-deps nginx nginx -t; then
  cp "$HERE/nginx/deltasite-bootstrap.conf.template" "$TEMPLATES/deltasite.conf.template"
  die "rendered nginx config failed nginx -t. Bootstrap block restored; the running nginx was never touched."
fi

say "7. restart nginx and verify"
docker compose restart nginx
sleep 3
erp_ok || die "app.$DOMAIN stopped answering after the restart"
c="$(code "https://$DOMAIN/")"
[ "$c" = 200 ] || [ "$c" = 404 ] || die "https://$DOMAIN/ returned $c (000 means TLS failed)"
[ "$(code "https://www.$DOMAIN/")" = 301 ] || echo "note: www did not return 301. Not fatal; check it later."

say "done"
cat <<EOF
  https://$DOMAIN/        answers over TLS: $c  (404 is expected until the first deploy lands)
  https://app.$DOMAIN/    still answers 200
  next: push to main. GitHub Actions builds and uploads the site; nothing on this server restarts.
EOF
