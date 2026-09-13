# Deploying to deltaenergysolution.com

## The design

Static files, served by the nginx the ERP already runs, from a read-only
mount at `/srv/delta-site`. A deploy is a file copy: GitHub Actions builds
the site, uploads it into a fresh release directory, and swaps one symlink.
Nothing on the server restarts. nginx is never reloaded. The deploy user can
write to `/srv/delta-site` and nowhere else, cannot traverse `/root`, and so
cannot reach the ERP's checkout or its secrets.

The apex gets its own certificate, `deltasite`, issued before nginx is
touched and renewed by the certbot loop that is already running.

The two things the ERP's nginx needs — a mount line and a template file —
are carried by the ERP's own repository and applied by the ERP's own deploy.
A container cannot gain a mount without being recreated, so the one recreate
this needs happens inside a routine ERP deploy, which recreates and reloads
anyway. The marketing site never restarts anything on that server, at setup
or afterwards.

No container for the site, no host nginx, no pm2. There is no process to
run.

## Why the recreate cannot be avoided, and why it is not ours

The alternative is to serve the site from a directory nginx already mounts,
which needs no recreate. Every such directory lives under `/root`. Writing
there from CI means the deploy key can traverse `/root`, and with that comes
read access to whatever under `/root` is world-readable, the ERP's `.env`
included. A second of downtime avoided is not worth handing a CI key a path
to the database password. So the site lives at `/srv/delta-site`, the ERP
declares the mount, and the recreate rides on an ERP deploy.

## What the server is

| | |
| --- | --- |
| IP | `200.97.163.238` (Hostinger, host `srv1814139`, Ubuntu) |
| DNS | apex A record → that IP; `www` CNAME → apex. Nothing to change. |
| Ports 80/443 | owned by the **`delta-nginx` container**. No host nginx, no `/etc/nginx`. |
| ERP stack | `/root/Delta-MVP/backend/deploy/docker-compose.yml`, project `delta-onlyoffice`, always run with `--env-file .env`. (`backend/docker-compose.yml` one level up is an old dev file nothing uses.) |
| ERP deploy | GitHub Actions → SSH → `deploy.sh`: `git reset --hard`, `docker compose up -d --build`, `nginx -s reload`. Never `git clean`, never re-clones. |
| nginx config | one envsubst template, `default.conf.template`, rendered into `/etc/nginx/conf.d` when the container starts. It sorts before `deltasite.conf` and stays nginx's default server. |
| Certificates | `delta` covers `app.` `api.` `office.`; `deltasite` covers the apex and `www` |
| Renewal | the certbot container loops `certbot renew --webroot` every 12h and renews both. Only the ERP's `deploy.sh` reloads nginx afterwards (see below). |

## One-time setup, in order

### Step 1 — on the VPS, as root

```bash
git clone https://github.com/advent0shafi/Delta-Website.git /root/delta-site-setup
bash /root/delta-site-setup/deploy/server-setup.sh 'ssh-ed25519 AAAA...'
```

The argument is the public half of the GitHub Actions deploy key, kept out
of this repository on purpose.

The script touches nothing the ERP runs on: no container is edited,
restarted, reloaded or recreated, and no file is written into the ERP's
checkout. It creates the `deploy` user and proves it cannot traverse
`/root`; issues the `deltasite` certificate after proving the challenge path
answers for both hostnames; and runs `nginx -t` in a throwaway container
built from the same image, environment, mounts and network as the running
`delta-nginx`, with the ERP's template and ours together. If that fails,
nothing is handed over.

### Step 2 — in the Delta-MVP repository

The Delta-MVP session prepared branch `marketing-site-nginx` (local to that
machine, not pushed). Two commits on top of its main, to be merged
**separately, in this order**, each getting its own deploy:

1. `cae0863` — `deploy.sh` runs `nginx -t` in a throwaway container before
   `up -d --build`, and stops the deploy if it fails. Skipped with a warning
   when frontend, backend or onlyoffice is not running, since `nginx -t`
   resolves upstream names and a cold start would otherwise be blocked.
   Changes no container config.

   It must land first and on its own: `deploy.sh` does `git reset --hard`
   on itself mid-run, and bash keeps executing the copy it already opened,
   so the deploy that introduces the check runs without it.

2. Once, on the server, from `/root/Delta-MVP/backend/deploy`:
   ```bash
   docker compose --env-file .env run --rm --no-deps nginx nginx -t
   ```
   Proves the check's exact command on real Docker. The ERP session has no
   Docker where it runs and could not do this itself.

3. Run this repo's `server-setup.sh` (step 1 above) if not already done.
   The certificate must exist before the next merge.

4. `e2e446e` — the mount line under `services.nginx.volumes`, this repo's
   `deltasite.conf.template` copied verbatim (the ERP session re-copies it
   after any change here; compare with `cmp`), and comment-only updates to
   the ERP's own template header. This deploy recreates nginx, and the new
   check now runs first.

What the ERP session verified before handing over: its CI's compose check
passes with the mount read-only; the image's envsubst leaves the template
byte-identical; and a real nginx with both templates served the apex, the
prerendered `/about/`, the `www` and `http` redirects, the ACME path, the
right certificate per SNI, and left `app`, `api` and `office` unchanged.

### Step 3 — push to this repository's `main`

Or run the Deploy workflow from the Actions tab. The order matters: the
workflow smoke-tests `/about/` and fails if the mount is not there yet.

## What a deploy does

`.github/workflows/deploy.yml`, on every push to `main`:

1. `npm ci`, `npm run build`, `npm run seo:check`. The placeholder failure
   on the About page is downgraded to a warning by `SEO_ALLOW_PLACEHOLDER`,
   by the owner's decision. Every other check still fails the build.
2. rsync `dist/` to `/srv/delta-site/releases/<timestamp>-<sha>/`.
3. Point the `current` symlink at it with an atomic rename. Keep the last
   five releases, delete the rest.
4. Fetch `/about/` and check for its own heading. If `try_files` ever loses
   the `$uri/index.html` step, nginx serves the homepage shell there
   instead, and this catches it.

Concurrency is serialised, so two pushes in quick succession deploy in order
rather than racing. The secrets `DEPLOY_SSH_KEY` and `DEPLOY_KNOWN_HOSTS`
are set on the repository, with the server's host key pinned.

## Rollback

Instant, no restart, on the server:

```bash
cd /srv/delta-site && ls -1dt releases/
ln -s releases/<an older one> current.new && mv -Tf current.new current
```

Or re-run the Deploy workflow on an older commit from the Actions tab.

## Undo everything

Revert the Delta-MVP commit from step 2 and let its deploy run. Then, on
the server:

```bash
userdel -r deploy && rm -rf /srv/delta-site
```

The certificate can stay; certbot keeps renewing it harmlessly.

## What can take what down

| What fails | Marketing site | ERP |
| --- | --- | --- |
| A bad site deploy | Old release keeps serving; rollback is one symlink | Untouched. Site deploys never restart anything. |
| An ERP container crashes | Still serving | That container is down |
| `delta-nginx` config broken | Unreachable | Unreachable, though still running |
| Host down | Down | Down |

The nginx row is the reason step 1 validates the rendered config before
step 2 exists, and the reason an `nginx -t` in `deploy.sh` is recommended.

## Living beside the ERP

Confirmed against the ERP repository by the session that maintains it:

- **Nothing in the ERP relies on the bare domain.** Its canonical URL,
  allowed hosts and CORS all name `app.` only. Today the apex falls through
  to the app by accident, behind the wrong certificate.
- **Certificate renewal has a gap, and it is the ERP's gap too.** Certbot
  renews both certificates, but only the last line of the ERP's `deploy.sh`
  reloads nginx afterwards. Renewal happens thirty days before expiry, and
  the ERP deploys on every push, so in practice it is covered. If that ever
  goes quiet, a daily graceful reload on the host closes it for both:

  ```
  0 4 * * * cd /root/Delta-MVP/backend/deploy && docker compose --env-file .env exec -T nginx nginx -s reload
  ```

- **The ERP already has a public, indexed marketing site** at
  `app.deltaenergysolution.com`: a landing page, a solar savings calculator,
  a sitemap. Once this site is live the two compete in search for the same
  business. Either the app's landing page stops being indexed or it
  redirects its marketing content to the apex. A decision for the owner.

## Before this counts as launched

- The About page carries invented milestone dates, a credentials list and
  project figures. The gate that would have stopped this is bypassed by the
  owner's decision. They are published under the business's name until
  replaced with real ones or removed.
- The contact form sends nothing. Every quote request it takes is lost. The
  Delta-MVP session has been asked to study a per-customer lead-capture API
  in the ERP; until something exists, the form needs a stopgap.
- Submit `https://deltaenergysolution.com/sitemap.xml` in Google Search
  Console.
- Add the Google Business Profile URL to `CONTACT.sameAs` in
  `site.config.js`.
