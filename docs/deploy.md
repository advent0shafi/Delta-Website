# Deploying to deltaenergysolution.com

## What the server actually is

| | |
| --- | --- |
| IP | `200.97.163.238` (Hostinger, host `srv1814139`, Ubuntu) |
| DNS | apex A record → that IP; `www` CNAME → apex. Nothing to change. |
| Ports 80/443 | owned by the **`delta-nginx` container**, not by the host |
| Host nginx | not installed. `/etc/nginx` does not exist. |
| Stack | `/root/Delta-MVP/backend/docker-compose.yml` — nginx, frontend (Next.js :3001), backend (:8000), postgres, onlyoffice, certbot |
| nginx config | envsubst templates in `deploy/nginx/templates`, rendered into `/etc/nginx/conf.d` at container start |
| Certificate | one cert named `delta`, covering `app.` `api.` `office.` |
| Renewal | the certbot container loops `certbot renew --webroot -w /var/www/certbot` every 12h |

Host `certbot` and a host nginx server block are both wrong here. Ignore any
advice that starts with `certbot --nginx`.

## Why the apex is broken today

No server block declares `default_server`, so nginx falls back to the first
block in file order. On port 443 that is the `app.` block — which is exactly
what a request to the bare domain gets: the Next.js app, behind a certificate
that does not name the apex. Hence the browser warning.

Giving the apex its own server block fixes that. The app's blocks are never
opened.

## The certificate decision

The apex gets **its own certificate**, named `deltasite`, not three extra
names bolted onto `delta`.

Reissuing `delta` with five names would put `app.`, `api.` and `office.` at
risk of a failure that currently cannot touch them. Two certificates cannot
fail together, and the renewal loop already in place renews both without any
change.

## Runbook

Order matters. An nginx block naming a certificate file that is not on disk
does not degrade — nginx refuses to start, and in this stack that takes the
app down too. So: HTTP first, certificate second, HTTPS third.

### 1. Build the site on the server

No Node on the host and none needed — build in a throwaway container.

```bash
cd /root
git clone https://github.com/advent0shafi/Delta-Website.git delta-site
cd delta-site
docker run --rm -v "$PWD":/app -w /app node:20-alpine \
  sh -c "npm ci && npm run build"
```

`dist/` is the entire site. Static files, no process, no database.

### 2. Put the build where nginx can reach it

```bash
mkdir -p /root/Delta-MVP/backend/deploy/data/www/delta-site
rsync -a --delete /root/delta-site/dist/ \
  /root/Delta-MVP/backend/deploy/data/www/delta-site/
```

If `rsync` is missing: `cp -a /root/delta-site/dist/. /root/Delta-MVP/backend/deploy/data/www/delta-site/`

### 3. Mount it into the nginx container

In `/root/Delta-MVP/backend/docker-compose.yml`, under the nginx service's
`volumes:`, add one line beside the existing mounts:

```yaml
      - ./deploy/data/www/delta-site:/srv/delta-site:ro
```

Read-only, and at `/srv` rather than `/usr/share/nginx` so it cannot shadow
anything the image ships.

### 4. Install the bootstrap block, HTTP only

```bash
cp /root/delta-site/deploy/nginx/deltasite-bootstrap.conf.template \
   /root/Delta-MVP/backend/deploy/nginx/templates/deltasite.conf.template
cd /root/Delta-MVP/backend
docker compose up -d nginx
```

Recreating nginx picks up the new mount and re-renders the templates. Expect
one or two seconds where every site refuses connections, the app included.

Check both before going further:

```bash
curl -sI http://deltaenergysolution.com/ | head -1        # expect 200
curl -sI https://app.deltaenergysolution.com/ | head -1   # expect 200, unchanged
```

### 5. Issue the certificate

```bash
cd /root/Delta-MVP/backend
docker compose config --services          # confirm the certbot service name
docker compose run --rm --entrypoint certbot certbot certonly \
  --webroot -w /var/www/certbot \
  --cert-name deltasite \
  -d deltaenergysolution.com -d www.deltaenergysolution.com \
  --email deltampm@gmail.com --agree-tos --no-eff-email
```

`--cert-name deltasite` is what keeps this separate from `delta`. Without it
certbot names the certificate after the first domain, which still works but
makes the two harder to tell apart later.

### 6. Switch to the real block

```bash
cp /root/delta-site/deploy/nginx/deltasite.conf.template \
   /root/Delta-MVP/backend/deploy/nginx/templates/deltasite.conf.template
cd /root/Delta-MVP/backend
docker compose restart nginx
```

A restart is enough here — only the template changed, and the entrypoint
re-renders on start.

### 7. Verify

```bash
curl -sI https://deltaenergysolution.com/ | head -1            # 200
curl -sI https://www.deltaenergysolution.com/ | head -2        # 301 to apex
curl -sI https://deltaenergysolution.com/about/ | head -1      # 200, not a fallback
curl -sI https://app.deltaenergysolution.com/ | head -1        # 200, untouched
```

The `/about/` check is the one that matters. A 200 that returns the homepage
means `try_files` missed the `$uri/index.html` step and the prerendered HTML
is being thrown away.

### Rollback

```bash
rm /root/Delta-MVP/backend/deploy/nginx/templates/deltasite.conf.template
cd /root/Delta-MVP/backend && docker compose restart nginx
```

The apex goes back to hitting the app block. Nothing else is affected at any
point in this runbook.

## Redeploying later

Steps 1 and 2 only:

```bash
cd /root/delta-site && git pull
docker run --rm -v "$PWD":/app -w /app node:20-alpine sh -c "npm ci && npm run build"
rsync -a --delete dist/ /root/Delta-MVP/backend/deploy/data/www/delta-site/
```

No nginx restart. The files are served straight off the mount.

## Before this counts as launched

- `npm run seo:check` still fails on `ABOUT.isPlaceholder`. The milestone
  dates, the credentials list and the project figures on `/about/` are
  invented. That gate exists to stop exactly this reaching a real domain.
- Submit `https://deltaenergysolution.com/sitemap.xml` in Google Search
  Console.
- Add the Google Business Profile URL to `CONTACT.sameAs` in
  `site.config.js`. `seo:check` warns on every run without it.
