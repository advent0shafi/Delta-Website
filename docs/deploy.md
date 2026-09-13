# Deploying to deltaenergysolution.com

## The design

Static files, served by the nginx the ERP already runs, from a read-only
mount at `/srv/delta-site`. A deploy is a file copy: GitHub Actions builds
the site, uploads it into a fresh release directory, and swaps one symlink.
Nothing on the server restarts. nginx is never reloaded. The deploy user can
write to `/srv/delta-site` and nowhere else, so a leaked key cannot reach
the ERP.

The apex gets its own certificate, `deltasite`, renewed by the certbot loop
that is already running. The one nginx change this needs is made once, and
the rendered config is tested in a throwaway container before it goes live.

No new container. The site has no process to run, and a second nginx behind
the first would only add a hop.

## What the server is

| | |
| --- | --- |
| IP | `200.97.163.238` (Hostinger, host `srv1814139`, Ubuntu) |
| DNS | apex A record → that IP; `www` CNAME → apex. Nothing to change. |
| Ports 80/443 | owned by the **`delta-nginx` container**. No host nginx, no `/etc/nginx`. |
| Stack | `/root/Delta-MVP/backend/docker-compose.yml`: nginx, frontend (Next.js :3001), backend (:8000), postgres, onlyoffice, certbot |
| nginx config | envsubst templates in `deploy/nginx/templates`, rendered into `/etc/nginx/conf.d` when the container starts |
| Certificates | `delta` covers `app.` `api.` `office.`; `deltasite` covers the apex and `www` |
| Renewal | the certbot container loops `certbot renew --webroot` every 12h, and renews both |

## One-time setup

On the VPS, as root:

```bash
git clone https://github.com/advent0shafi/Delta-Website.git /root/delta-site-setup
bash /root/delta-site-setup/deploy/server-setup.sh 'ssh-ed25519 AAAA...'
```

The argument is the public half of the GitHub Actions deploy key. It is kept
out of this repository on purpose; whoever runs the script pastes it in.

The script is idempotent and stops the moment the ERP stops answering. In
order it: creates the `deploy` user; issues the `deltasite` certificate
**before touching nginx**, because the ERP's port-80 block already answers
the ACME challenge for any hostname (the script proves this end to end
first); drops a `docker-compose.override.yml` beside the ERP's compose file
so that file is never edited; installs the site's nginx block; runs
`nginx -t` on the rendered config in a throwaway container on the compose
network; recreates `delta-nginx` once; and verifies that the mount is inside
the container, the site answers over TLS, and `app.` still answers 200.

The ERP is affected in exactly one way: that single recreate, a second or
two of refused connections on every hostname. OnlyOffice editing sessions
drop and reconnect on their own. Run it when nobody is mid-document.

The script reads the compose project name, tool version and config files off
the running container rather than assuming them. Guessing a different
project would create a second nginx fighting the first for port 443.

The two secrets the workflow needs, `DEPLOY_SSH_KEY` and
`DEPLOY_KNOWN_HOSTS`, are already set on the repository. The host key is
pinned, so the runner refuses to talk to anything impersonating the box.

Then push to `main`, or run the Deploy workflow by hand from the Actions tab.

## What a deploy does

`.github/workflows/deploy.yml`, on every push to `main`:

1. `npm ci`, `npm run build`, `npm run seo:check`. The check is the launch
   gate. It fails while `content/about.js` is placeholder, and a failing
   gate stops the deploy before anything is uploaded.
2. rsync `dist/` to `/srv/delta-site/releases/<timestamp>-<sha>/`.
3. Point the `current` symlink at it with an atomic rename. Keep the last
   five releases, delete the rest.
4. Fetch `/about/` and check for its own heading. If `try_files` ever loses
   the `$uri/index.html` step, nginx serves the homepage shell there
   instead, and this catches it.

Concurrency is serialised, so two pushes in quick succession deploy in order
rather than racing.

## Rollback

Instant, no restart, on the server:

```bash
cd /srv/delta-site && ls -1dt releases/
ln -s releases/<an older one> current.new && mv -Tf current.new current
```

Or re-run the Deploy workflow on an older commit from the Actions tab.

## Undo everything

```bash
cd /root/Delta-MVP/backend
rm deploy/nginx/templates/deltasite.conf.template docker-compose.override.yml
docker compose up -d nginx
userdel -r deploy && rm -rf /srv/delta-site
```

The certificate can stay; certbot will keep renewing it harmlessly.

## What can take what down

| What fails | Marketing site | ERP |
| --- | --- | --- |
| A bad site deploy | Old release keeps serving; rollback is one symlink | Untouched. Deploys never restart anything. |
| An ERP container crashes | Still serving | That container is down |
| `delta-nginx` config broken | Unreachable | Unreachable, though still running |
| Host down | Down | Down |

The nginx row is why the setup script runs `nginx -t` in a throwaway
container before restarting the real one. After setup, no routine operation
on either side touches that config again.

## Before this counts as launched

- **The pipeline is blocked by the About page.** `seo:check` fails on
  `ABOUT.isPlaceholder`: the milestone dates, the credentials list and the
  project figures are invented. Either supply real ones or remove those
  sections so the page carries only confirmed facts. Until then the workflow
  stops at the gate, by design.
- **The contact form sends nothing.** It validates two fields and shows a
  success message. No email, no API call, no WhatsApp. Every lead it takes is
  lost. Wire it before launch; a WhatsApp handoff needs no backend.
- Submit `https://deltaenergysolution.com/sitemap.xml` in Google Search
  Console.
- Add the Google Business Profile URL to `CONTACT.sameAs` in
  `site.config.js`. `seo:check` warns on every run without it.
