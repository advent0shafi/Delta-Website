#!/usr/bin/env bash
# One-time server preparation for deltaenergysolution.com on the ERP VPS.
#
#   sudo bash server-setup.sh 'ssh-ed25519 AAAA...'
#
# The argument is the public half of the GitHub Actions deploy key. It is
# deliberately not committed to this repository: it arrives in the
# operator's hands and is pasted in by them.
#
# This script touches nothing the ERP runs on. It does not edit, restart,
# reload or recreate any container, and it writes no file into the ERP's
# checkout. Idempotent: safe to run again. It does three things:
#
#   1. A `deploy` user that owns /srv/delta-site and nothing else. GitHub
#      Actions logs in as this user. It cannot traverse /root, so it cannot
#      read the ERP's .env or anything else that lives there.
#   2. Issue the `deltasite` certificate into the ERP's existing certbot
#      volume. The ERP's port-80 block is the default server on that port
#      and already answers /.well-known/acme-challenge/ for any hostname;
#      the script proves that end to end for both names before asking
#      Let's Encrypt for anything. The ERP's certbot loop renews it from
#      then on. Its own certificate, not extra names on `delta`, so the two
#      can never fail together.
#   3. Prove the site's nginx block is valid before anyone deploys it. A
#      throwaway container from the same image as delta-nginx, on the same
#      network, with the same environment and the same mounts, renders the
#      ERP's template plus ours and runs `nginx -t`. The running container
#      is not involved. If this fails, nothing is handed over.
#
# The two changes the ERP itself has to carry — a read-only mount of
# /srv/delta-site on its nginx service, and this repo's
# deploy/nginx/deltasite.conf.template in its templates directory — go in
# through the ERP's own repository and its own deploy. A container cannot
# gain a mount without being recreated, so the recreate happens inside a
# routine ERP deploy, which recreates and reloads anyway. This script prints
# exactly what that change is.
#
# Why not serve from a directory nginx already mounts and skip the recreate?
# Every one of those directories lives under /root. The CI deploy key would
# need to traverse /root to write there, and with that comes read access to
# whatever under /root is world-readable, the ERP's .env included. Not worth
# a second of downtime saved.
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
TEMPLATE_URL="https://raw.githubusercontent.com/advent0shafi/Delta-Website/main/deploy/nginx/deltasite.conf.template"

say()     { printf '\n\033[1m== %s\033[0m\n' "$*"; }
die()     { printf '\n\033[31mABORT: %s\033[0m\n' "$*" >&2; exit 1; }
code()    { curl -sS -o /dev/null -m 15 -w '%{http_code}' "$1" 2>/dev/null || true; }
erp_ok()  { [ "$(code "https://app.$DOMAIN/")" = 200 ]; }
inspect() { docker inspect "$NGINX_CONTAINER" --format "$1"; }
mount_src() {
  inspect '{{range .Mounts}}{{if eq .Destination "'"$1"'"}}{{.Source}}{{end}}{{end}}'
}

[ "$(id -u)" = 0 ] || die "run as root"
[ -n "$PUBKEY" ] || die "pass the GitHub Actions public key as the first argument"
[[ "$PUBKEY" == ssh-ed25519\ * ]] || die "that does not look like an ssh-ed25519 public key"
[ -f "$TEMPLATE_SRC" ] || die "$TEMPLATE_SRC is missing; run this from a checkout of Delta-Website"
docker inspect "$NGINX_CONTAINER" >/dev/null 2>&1 || die "container $NGINX_CONTAINER not found"

TEMPLATES="$(mount_src /etc/nginx/templates)"
CERTBOT_CONF="$(mount_src /etc/letsencrypt)"
CERTBOT_WWW="$(mount_src /var/www/certbot)"
[ -d "$TEMPLATES" ]    || die "nginx templates mount not found on $NGINX_CONTAINER"
[ -d "$CERTBOT_CONF" ] || die "letsencrypt mount not found on $NGINX_CONTAINER"
[ -d "$CERTBOT_WWW" ]  || die "certbot webroot mount not found on $NGINX_CONTAINER"
ERP_DIR="$(inspect '{{index .Config.Labels "com.docker.compose.project.working_dir"}}')"

erp_ok || die "app.$DOMAIN is not answering 200 before we have started. Fix that first."
echo "erp compose dir: ${ERP_DIR:-unknown}"
echo "templates:       $TEMPLATES"

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
# The whole point of the user: prove it cannot get into /root.
sudo -u "$DEPLOY_USER" test -x /root 2>/dev/null && die "$DEPLOY_USER can traverse /root. Refusing to continue; fix /root's permissions first."

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
say "3. nginx -t on the ERP's template plus ours, in a throwaway container"
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
cp "$TEMPLATES"/*.template "$TMP/"
cp "$TEMPLATE_SRC" "$TMP/deltasite.conf.template"
# Same image, same env, same mounts (templates swapped for our temp copy),
# same network so the ERP's upstream names resolve. Nothing here is the
# running container.
inspect '{{range .Config.Env}}{{println .}}{{end}}' > "$TMP/env"
IMG="$(inspect '{{.Config.Image}}')"
NET="$(inspect '{{range $k, $_ := .NetworkSettings.Networks}}{{$k}}{{println}}{{end}}' | head -1)"
VOLS=()
while IFS=: read -r src dst; do
  [ -n "$dst" ] || continue
  [ "$dst" = /etc/nginx/templates ] && continue
  VOLS+=(-v "$src:$dst:ro")
done < <(inspect '{{range .Mounts}}{{.Source}}:{{.Destination}}{{println}}{{end}}')
if ! docker run --rm --network "$NET" --env-file "$TMP/env" \
      -v "$TMP:/etc/nginx/templates:ro" -v "$SITE_ROOT:$SITE_ROOT:ro" "${VOLS[@]}" \
      "$IMG" nginx -t; then
  die "the rendered config failed nginx -t. Nothing was changed. Read the error above: if it names deltasite.conf, the fault is in this repo's template and it must not be merged into the ERP."
fi
echo "rendered config is valid: $(sha256sum "$TEMPLATE_SRC" | cut -c1-16) deltasite.conf.template"

# --- 4 ------------------------------------------------------------------
say "done — hand the ERP its two-line change"
cat <<EOF
  Nothing running was touched. Ready on this server:
    $SITE_ROOT               owned by $DEPLOY_USER, empty until the first deploy
    live/$CERT_NAME          certificate for $DOMAIN and www, renewed by the ERP's certbot loop
    deltasite.conf.template  validated against the ERP's own config (sha256 $(sha256sum "$TEMPLATE_SRC" | cut -c1-16))

  Now, in the Delta-MVP repository, on a branch, then merge:
    backend/deploy/docker-compose.yml   under services.nginx.volumes, add:
        - $SITE_ROOT:$SITE_ROOT:ro
    backend/deploy/nginx/templates/deltasite.conf.template   copy verbatim from:
        $TEMPLATE_URL
      (sha256 of the validated file: $(sha256sum "$TEMPLATE_SRC" | cut -c1-16)...)

  Merging deploys it; nginx is recreated inside that deploy, as on any deploy
  that changes it. After that deploy finishes, push to Delta-Website main or
  run its Deploy workflow. That order matters: the workflow smoke-tests
  /about/ and fails if the mount is not there yet.
EOF
