# DataDashOS site — setup

The marketing site is static HTML on **GitHub Pages**. The waitlist and enterprise forms post to a small
**Cloudflare Worker** (`worker/`), which stores leads in **Cloudflare D1** (never in this repo), checks
**Turnstile**, sends email through **Resend** and texts through **Twilio**.

Everything you're likely to change lives in **`site.config.json`**: contact email, lead alert email, form
endpoint, Turnstile site key, rate limits and analytics. After editing it, run `npm run build` and commit.

Nothing below is done yet. Until it is, the forms show "This form isn't connected yet. Email us at …".

---

## 0. Local development

```bash
npm install                 # site build tools (sharp for images)
npm run build               # regenerate HTML, sitemap, robots.txt and assets/js/config.js
npm run serve               # http://127.0.0.1:8081

cd worker
npm install
cp .dev.vars.example .dev.vars
npm run db:migrate:local
npm run dev                 # http://127.0.0.1:8787 — emails and texts print to this terminal
```

On `127.0.0.1`/`localhost` the site automatically posts to `http://127.0.0.1:8787` and uses Cloudflare's
always-pass Turnstile test key. `cd worker && npm test` runs the unit tests.

---

## 1. Domain

1. Buy or confirm ownership of `datadashos.com` (placeholder used everywhere in the repo).
2. Add the domain to a free **Cloudflare** account and switch its nameservers to Cloudflare (the registrar's
   dashboard has a "nameservers" setting). Wait for Cloudflare to show the zone as **Active**.
3. Point the site at GitHub Pages: in Cloudflare DNS add
   - `CNAME www → simmitri-inc.github.io` (your GitHub Pages host), and
   - four `A` records for the apex (`@`) → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
   Leave these **DNS only** (grey cloud) for now.
4. In GitHub → repo **Settings → Pages → Custom domain**, enter `datadashos.com`, save (GitHub commits a
   `CNAME` file), wait for the certificate, then tick **Enforce HTTPS**.
5. If you want a different domain, change `siteUrl`, `analytics.domain`, `forms.allowedOrigins` and the
   email addresses in `site.config.json`, then `npm run build`.

> Until the custom domain is live, the canonical URLs, sitemap and Open Graph tags point at
> `https://datadashos.com`, which won't resolve yet. That's expected.

## 2. Cloudflare Worker and D1 database

1. Install Wrangler's login: `cd worker && npx wrangler login` (opens the browser).
2. Create the database: `npx wrangler d1 create datadashos-leads`. Copy the printed `database_id` into
   `worker/wrangler.toml` (replace the all-zeros **PLACEHOLDER**).
3. Create the tables: `npm run db:migrate:remote`.
4. Set the secrets (each command prompts for the value; nothing is written to the repo):
   ```bash
   npx wrangler secret put UNSUBSCRIBE_SECRET    # any long random string: `openssl rand -base64 32`
   npx wrangler secret put IP_HASH_SALT          # another long random string
   npx wrangler secret put TURNSTILE_SECRET_KEY  # from step 3
   npx wrangler secret put RESEND_API_KEY        # from step 4
   ```
5. Before the custom domain is live, allow the GitHub Pages origin and send confirm links back to it:
   in `worker/wrangler.toml` set `EXTRA_ALLOWED_ORIGINS = "https://simmitri-inc.github.io"` and
   `SITE_URL = "https://simmitri-inc.github.io/datadashos-site"`. Clear both once `datadashos.com` works.
6. Deploy: `npm run deploy`. Note the `*.workers.dev` URL it prints.
7. Give it a proper hostname: uncomment the `routes` line in `wrangler.toml` (`forms.datadashos.com`),
   deploy again, and keep `forms.endpoint` in `site.config.json` as `https://forms.datadashos.com`.
   (If you skip this, put the `workers.dev` URL in `forms.endpoint` instead.)
8. Check it: `curl https://forms.datadashos.com/api/health` should return `{"ok":true}`.

## 3. Turnstile (bot check)

1. Cloudflare dashboard → **Turnstile → Add widget**. Name it "DataDashOS forms", add hostnames
   `datadashos.com`, `www.datadashos.com` (and `simmitri-inc.github.io` while you're on GitHub Pages),
   mode **Managed**.
2. Copy the **site key** into `forms.turnstileSiteKey` in `site.config.json` (replacing
   `YOUR_TURNSTILE_SITE_KEY`), then `npm run build` and commit.
3. Copy the **secret key** into the Worker: `npx wrangler secret put TURNSTILE_SECRET_KEY`.

## 4. Email (Resend)

1. Create an account at [resend.com](https://resend.com) and add the domain `datadashos.com`.
2. Add the DNS records Resend shows (SPF `TXT`, DKIM `TXT`/`CNAME`, and the return-path `MX`) in Cloudflare
   DNS, then click **Verify**.
3. Add a DMARC record: `TXT _dmarc → v=DMARC1; p=none; rua=mailto:hello@datadashos.com` (tighten to
   `p=quarantine` once mail flows cleanly).
4. Create an API key with **Sending access** for that domain and store it:
   `npx wrangler secret put RESEND_API_KEY`.
5. Make sure the inboxes exist: `hello@datadashos.com` (contact, reply-to and sender) and
   `leads@datadashos.com` (lead alerts). Cloudflare **Email Routing** can forward both to an existing inbox
   for free. To change them, edit `contactEmail`, `leadAlertEmail` and `emailFrom` in `site.config.json`
   and redeploy the Worker.

What gets sent: a confirmation link (single use, expires in 48 hours) → once clicked, a "You're confirmed"
email to the person and a lead alert to `leadAlertEmail`. Every email has an unsubscribe link and
one-click `List-Unsubscribe` headers. Set `forms.sendUnconfirmedAlerts` to `true` if you also want an
alert (marked **[UNCONFIRMED]**) the moment someone submits.

## 5. Text messages (Twilio) — optional until you want to text people

The forms already record SMS consent (wording, time, number, page URL). No texts go out until this is set up.

1. Create a [Twilio](https://www.twilio.com) account and upgrade it from trial.
2. Buy a number: a **toll-free** number is usually quickest for a small sender; a local **10DLC** number
   needs A2P registration.
3. Register it (required by US carriers before messages are delivered):
   - **Toll-free:** Console → Messaging → Regulatory Compliance → **Toll-Free Verification**.
   - **10DLC:** Console → Messaging → Regulatory Compliance → **A2P 10DLC** → register your **Brand**
     (needs your EIN and business address) and then a **Campaign** (use case "Account notifications" or
     "Marketing", depending on what you'll send).
   For both, use the sample message below, link the live Privacy Policy and Terms (with the **Text messages**
   section), and describe opt-in as "web form with an unticked, optional checkbox, confirmed by a reply YES
   text". Approval can take a while; carriers reject applications whose privacy policy is missing or still in draft.
4. Create a **Messaging Service**, add the number, and under **Opt-Out Management** keep Twilio's default
   STOP/START/HELP handling switched on.
5. In the Messaging Service → **Integration**, set "Send a webhook" to
   `https://forms.datadashos.com/api/sms/inbound` (POST).
6. Store the credentials:
   ```bash
   npx wrangler secret put TWILIO_ACCOUNT_SID
   npx wrangler secret put TWILIO_AUTH_TOKEN
   npx wrangler secret put TWILIO_MESSAGING_SERVICE_SID
   ```
   If the webhook URL Twilio calls differs from what the Worker sees (e.g. a proxy), also set
   `TWILIO_WEBHOOK_URL` to the exact URL configured in Twilio, or signature checks will fail.

How it behaves: after someone confirms their email, and only if they entered a number **and** ticked the
SMS box, the Worker sends one text: *"DataDashOS: Reply YES to confirm texts about early access and your
account. Msg frequency varies. Msg & data rates may apply. Reply STOP to opt out, HELP for help."* Nothing
else can be sent to that number until they reply YES. STOP (and UNSUBSCRIBE, CANCEL, END, QUIT…) marks the
number opted out immediately, and every STOP/HELP/YES is logged.

## 6. Analytics (Plausible)

1. Create a [Plausible](https://plausible.io) site for `datadashos.com` (paid after the trial; or self-host).
2. In Plausible → Site settings → **Goals**, add custom-event goals with these exact names:
   `Waitlist Form Viewed`, `Waitlist Form Started`, `Waitlist Form Submitted`,
   `Enterprise Form Viewed`, `Enterprise Form Started`, `Enterprise Form Submitted`.
3. If you use a different domain or self-host, update `analytics` in `site.config.json`. Set
   `analytics.enabled` to `false` to switch analytics off entirely.

Plausible sets no cookies, so the site needs no cookie banner.

## 7. Go-live checklist

1. Lawyer reviews `privacy.html` and `terms.html`; remove `draft: true` from `scripts/pages/privacy.mjs`
   and `terms.mjs` (this also removes the banner and the `noindex`), then `npm run build`.
2. Submit a real test on each form; confirm the email arrives, the link works, the alert reaches
   `leads@`, and unsubscribe works.
3. Ask a teammate to test the SMS opt-in, YES and STOP once Twilio is approved.

---

## Lead data: access, export and deletion

Leads exist only in D1. To look at, export or delete them (e.g. for a deletion request):

```bash
cd worker
npx wrangler d1 execute datadashos-leads --remote --command "SELECT * FROM leads ORDER BY created_at DESC LIMIT 50"
npx wrangler d1 export datadashos-leads --remote --output leads-export.sql   # keep exports out of the repo
npx wrangler d1 execute datadashos-leads --remote --command "DELETE FROM leads WHERE email_norm = 'person@example.com'"
```

Unconfirmed leads are deleted automatically 7 days after their confirmation link expires (daily cron).
Never commit exports; `leads-export*.sql` and `.dev.vars` are git-ignored.
