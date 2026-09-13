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
# The ERP is affected in exactly one way: step 6 recreates delta-nginx, and
# for a second or two every hostname on this box refuses connections. That
# drops in-flight requests and any OnlyOffice editing sessions, which
# reconnect on their own. Run it when nobody is mid-document.
#
# Order, and why it is this order:
#
#   1. A `deploy` user that owns /srv/delta-site and nothing else. GitHub
#      Actions logs in as this user. Even a leaked key cannot reach the ERP.
#   2. Issue the `deltasite` certificate FIRST. The ERP's port-80 block is
#      the default server on that port and already serves
#      /.well-known/acme-challenge/ for any hostname, which the script proves
#      end to end before asking Let's Encrypt. So the certificate exists
#      before nginx changes, and the whole setup is one restart, not two.
#      Its own certificate, not extra names on `delta`: the two can never
#      fail together.
#   3. A docker-compose.override.yml beside the ERP's compose file, mounting
#      /srv/delta-site read-only into nginx. The ERP's own file is never
#      edited. The compose project, tool version and config files are read
#      off the running container rather than assumed, because guessing a
#      different project name would create a second nginx that fights the
#      first for port 443.
#   4. The site's nginx block into the templates directory.
#   5. `nginx -t` on the rendered config in a throwaway container on the
#      compose network, so the ERP's upstream names resolve. A block naming
#      a certificate file that is not on disk stops nginx from starting, and
#      in this stack that takes the ERP down with it. Nothing running is
#      touched until this passes; on failure the block is removed again.
#   6. Recreate delta-nginx with --no-deps. The one restart.
#   7. Verify: the mount is inside the container, the site answers over TLS,
#      www redirects, and app. still answers 200.
set -euo pipefail

PUBKEY="${1:-}"
DOMAIN=deltaenergysolution.com
CERT_NAME=deltasite
EMAIL=deltampm@gmail.com
SITE_ROOT=/srv/delta-site
DEPLOY_USER=deploy
NGINX_CONTAINER=delta-nginx
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEMPLATE_SRC="$HERE/nginx/deltasite.conf.template"

say()    { printf '\n\033[1m== %s\033[0m\n' "$*"; }
die()    { printf '\n\033[31mABORT: %s\033[0m\n' "$*" >&2; exit 1; }
code()   { curl -sS -o /dev/null -m 15 -w '%{http_code}' "$1" 2>/dev/null || true; }
erp_ok() { [ "$(code "https://app.$DOMAIN/")" = 200 ]; }
label()  { docker inspect "$NGINX_CONTAINER" --format "{{index .Config.Labels \"$1\"}}"; }
mount_src() {
  docker inspect "$NGINX_CONTAINER" \
    --format '{{range .Mounts}}{{if eq .Destination "'"$1"'"}}{{.Source}}{{end}}{{end}}'
}

[ "$(id -u)" = 0 ] || die "run as root"
[ -n "$PUBKEY" ] || die "pass the GitHub Actions public key as the first argument"
[[ "$PUBKEY" == ssh-ed25519\ * ]] || die "that does not look like an ssh-ed25519 public key"
[ -f "$TEMPLATE_SRC" ] || die "$TEMPLATE_SRC is missing; run this from a checkout of Delta-Website"
docker inspect "$NGINX_CONTAINER" >/dev/null 2>&1 || die "container $NGINX_CONTAINER not found"

# --- read the ERP's compose identity off the running container ---------
PROJECT="$(label com.docker.compose.project)"
SERVICE="$(label com.docker.compose.service)"
ERP="$(label com.docker.compose.project.working_dir)"
CFG_FILES="$(label com.docker.compose.project.config_files)"
COMPOSE_VER="$(label com.docker.compose.version)"
[ -n "$PROJECT" ] && [ -n "$SERVICE" ] && [ -d "$ERP" ] \
  || die "$NGINX_CONTAINER does not carry compose labels I can work from"

case "$COMPOSE_VER" in
  1.*) command -v docker-compose >/dev/null || die "stack was started with docker-compose v1, which is not installed"
       DC=(docker-compose -p "$PROJECT") ;;
  *)   docker compose version >/dev/null 2>&1 || die "docker compose v2 is not available"
       DC=(docker compose -p "$PROJECT") ;;
esac
IFS=',' read -ra CFGS <<< "$CFG_FILES"
for f in "${CFGS[@]}"; do
  [[ "$f" = /* ]] || f="$ERP/$f"
  [ -f "$f" ] || die "compose file $f (from the container's labels) is missing"
  DC+=(-f "$f")
done

TEMPLATES="$(mount_src /etc/nginx/templates)"
CERTBOT_CONF="$(mount_src /etc/letsencrypt)"
CERTBOT_WWW="$(mount_src /var/www/certbot)"
[ -d "$TEMPLATES" ]    || die "nginx templates mount not found on $NGINX_CONTAINER"
[ -d "$CERTBOT_CONF" ] || die "letsencrypt mount not found on $NGINX_CONTAINER"
[ -d "$CERTBOT_WWW" ]  || die "certbot webroot mount not found on $NGINX_CONTAINER"

erp_ok || die "app.$DOMAIN is not answering 200 before we have started. Fix that first."

echo "project=$PROJECT service=$SERVICE compose=${COMPOSE_VER:-?} dir=$ERP"
echo "templates=$TEMPLATES"

# --- 1 ------------------------------------------------------------------
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

# --- 2 ------------------------------------------------------------------
say "2. certificate $CERT_NAME, issued before nginx is touched"
mkdir -p "$CERTBOT_WWW/.well-known/acme-challenge"
for host in "$DOMAIN" "www.$DOMAIN"; do
  probe="probe-$$-$RANDOM"
  echo "$probe" > "$CERTBOT_WWW/.well-known/acme-challenge/$probe"
  got="$(curl -sS -m 15 "http://$host/.well-known/acme-challenge/$probe" 2>/dev/null || true)"
  rm -f "$CERTBOT_WWW/.well-known/acme-challenge/$probe"
  [ "$got" = "$probe" ] || die "the running nginx does not serve the ACME webroot for http://$host/ (got: ${got:-nothing}). Certificate issuance would fail."
done
echo "ACME path verified for both hostnames"
if [ -f "$CERTBOT_CONF/live/$CERT_NAME/fullchain.pem" ]; then
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

# --- 3 ------------------------------------------------------------------
say "3. compose override: mount $SITE_ROOT into $SERVICE, read-only"
OVERRIDE="$ERP/docker-compose.override.yml"
if [ -f "$OVERRIDE" ]; then
  grep -q "$SITE_ROOT:$SITE_ROOT:ro" "$OVERRIDE" \
    || die "$OVERRIDE already exists. Add this under services.$SERVICE.volumes by hand:  - $SITE_ROOT:$SITE_ROOT:ro"
else
  cat > "$OVERRIDE" <<EOF
# Added by Delta-Website/deploy/server-setup.sh. Mounts the marketing site
# into nginx. Delete this file and recreate nginx to undo.
services:
  $SERVICE:
    volumes:
      - $SITE_ROOT:$SITE_ROOT:ro
EOF
fi
# Only default discovery picks the override up on its own. Pass it explicitly
# so this script does not depend on how the stack was started.
printf '%s\n' "${CFGS[@]}" | grep -qx "$OVERRIDE" || DC+=(-f "$OVERRIDE")
cd "$ERP"
"${DC[@]}" config --services | grep -qx "$SERVICE" || die "compose does not know a service called $SERVICE with these files"
"${DC[@]}" config | grep -q "$SITE_ROOT" || die "the override was not merged into the compose config"
if [ "$CFG_FILES" != "$ERP/docker-compose.yml" ]; then
  echo "note: the ERP was started with: $CFG_FILES"
  echo "      when you next run compose for the ERP yourself, add:  -f $OVERRIDE"
fi

# --- 4 ------------------------------------------------------------------
say "4. site nginx block"
cp "$TEMPLATE_SRC" "$TEMPLATES/deltasite.conf.template"

# --- 5 ------------------------------------------------------------------
say "5. nginx -t on the rendered config, in a throwaway container"
if ! "${DC[@]}" run --rm --no-deps --name "${NGINX_CONTAINER}-preflight" "$SERVICE" nginx -t; then
  rm -f "$TEMPLATES/deltasite.conf.template"
  die "rendered nginx config failed nginx -t. The site block has been removed again; the running nginx was never touched. Read the error above: if it names deltasite.conf, the fault is in this repo's template."
fi

# --- 6 ------------------------------------------------------------------
say "6. recreate $SERVICE (the one restart: the ERP blips for a second here)"
"${DC[@]}" up -d --no-deps "$SERVICE"
sleep 3

# --- 7 ------------------------------------------------------------------
say "7. verify"
ROLLBACK="rm -f $TEMPLATES/deltasite.conf.template $OVERRIDE && cd $ERP && ${DC[*]} up -d --no-deps $SERVICE"
erp_ok || die "app.$DOMAIN stopped answering after the restart. Roll back with:
  $ROLLBACK"
docker inspect "$NGINX_CONTAINER" --format '{{range .Mounts}}{{.Destination}} {{end}}' | grep -q "$SITE_ROOT" \
  || die "$SITE_ROOT is not mounted inside $NGINX_CONTAINER. The ERP is fine; the site would 404 forever. Roll back with:
  $ROLLBACK"
c="$(code "https://$DOMAIN/")"
[ "$c" = 200 ] || [ "$c" = 404 ] || die "https://$DOMAIN/ returned $c (000 means TLS failed). Roll back with:
  $ROLLBACK"
[ "$(code "https://www.$DOMAIN/")" = 301 ] || echo "note: www did not return 301. Not fatal; check it later."
[ "$(code "http://$DOMAIN/")" = 301 ]      || echo "note: http did not return 301. Not fatal; check it later."

say "done"
cat <<EOF
  https://$DOMAIN/        answers over TLS: $c  (404 is expected until the first deploy lands)
  https://app.$DOMAIN/    still answers 200
  next: push to main. GitHub Actions builds and uploads the site; nothing on this server restarts.
EOF
