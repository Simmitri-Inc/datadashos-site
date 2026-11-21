import { config } from "../lib/config.mjs";
import { esc } from "../lib/layout.mjs";

const email = `<a data-contact-mailto data-contact-email href="mailto:${esc(config.contactEmail)}">${esc(config.contactEmail)}</a>`;
const hours = config.forms.confirmLinkHours;

export default {
  out: "privacy.html",
  title: "Privacy Policy (Draft) — DataDashOS",
  description:
    "Draft privacy policy for the DataDashOS pre-launch waitlist: what we collect, how we use it, email and text consent, and how to request deletion.",
  noindex: true,
  draft: true,
  breadcrumbs: [
    { name: "Home", path: "" },
    { name: "Privacy Policy", path: "privacy.html" },
  ],
  body: () => `
    <section class="hero page-hero-section" aria-labelledby="privacy-title">
      <div class="wrap legal-prose">
        <p class="eyebrow">Legal</p>
        <h1 id="privacy-title" class="page-title">Privacy Policy</h1>
        <p class="hero-lede">Draft — last updated November 21, 2026. This policy explains how DataDashOS handles information collected on this website and through the early-access waitlist and enterprise early-access forms, before the product launches.</p>
        <!-- PLACEHOLDER (lawyer): legal entity name, registered address and governing jurisdiction. -->
      </div>
    </section>

    <section class="section-last">
      <div class="wrap legal-prose">
        <h2>Who we are</h2>
        <p>DataDashOS ("we", "us") runs this website, the waitlist and the enterprise early-access program. Questions about this policy or your information: ${email}.</p>

        <h2>Information we collect</h2>
        <p><strong>Information you give us in our forms.</strong> Depending on the form:</p>
        <ul>
          <li>Full name, work email address and company name</li>
          <li>Industry, number of employees and, if you choose, annual revenue</li>
          <li>For enterprise early access: job title, what you're interested in, anything you tell us in the notes field, and whether you'd like a meeting and your preferred days/times</li>
          <li>Your answers from the on-site KPI demo (industry, number of employees and top goal), if you used it before joining</li>
          <li>Your mobile number, if you choose to give it</li>
        </ul>
        <p><strong>Consent records.</strong> When you tick a consent box we record the exact wording you agreed to, when you agreed, and the page you were on. For email we also record when you clicked the confirmation link. For text messages we record your number and every STOP, HELP, YES or START reply.</p>
        <p><strong>Technical information.</strong> To stop spam and abuse, our form service uses your IP address to limit repeated submissions; we keep it only as a one-way, salted hash for a short time. Cloudflare Turnstile checks that a person, not a bot, is using the form. Our hosting providers keep standard server logs.</p>
        <p><strong>The KPI demo.</strong> The demo runs in your browser. Your answers aren't sent to us unless you submit a form.</p>

        <h2>How we use it</h2>
        <ul>
          <li>To confirm your email and contact you about early access</li>
          <li>To follow up on enterprise early-access requests, including setting up a meeting if you asked for one</li>
          <li>To plan onboarding using your industry and company size</li>
          <li>To send text messages, only if you opted in (see <a href="#text-messages">Text messages</a>)</li>
          <li>To understand, in aggregate, how the site and forms are used, and to improve them</li>
          <li>To protect the forms against spam and abuse</li>
        </ul>

        <h2>We don't sell your data</h2>
        <p>We don't sell, rent or trade your personal information, and we don't share it with advertisers. We don't use advertising trackers or pixels.</p>

        <h2>Who processes it for us</h2>
        <p>We use a small number of service providers who process information on our behalf, only to provide their service to us:</p>
        <ul>
          <li><strong>GitHub Pages</strong>: hosts this website</li>
          <li><strong>Cloudflare</strong>: receives form submissions, stores waitlist records, and runs the Turnstile bot check</li>
          <li><strong>Resend</strong>: sends our emails</li>
          <li><strong>Twilio</strong>: sends and receives text messages, if you opted in</li>
          <li><strong>Plausible Analytics</strong>: counts page views and form events without cookies</li>
        </ul>
        <p>These providers may process information in the United States and other countries. We may also disclose information if the law requires it.</p>

        <h2>Email</h2>
        <p>We only email you if you tick the box "I agree to receive emails from DataDashOS about early access. I can unsubscribe at any time." We then send a confirmation link, which works once and expires after ${hours} hours. Until you click it, we won't email you about early access. If you don't confirm, we delete the request about a week after the link expires.</p>
        <p>Every email we send includes an unsubscribe link. You can also unsubscribe by emailing ${email}.</p>

        <h2 id="text-messages">Text messages</h2>
        <p>Text messages are optional and separate from email. We only text you if you enter a mobile number <em>and</em> tick the box agreeing to texts. Consent is not a condition of signing up.</p>
        <ul>
          <li><strong>What we send:</strong> messages about early access and your account. The first message asks you to reply YES to confirm; we send nothing else until you do.</li>
          <li><strong>How often:</strong> message frequency varies.</li>
          <li><strong>Cost:</strong> message and data rates may apply.</li>
          <li><strong>Opting out:</strong> reply STOP at any time. We stop immediately and record your opt-out. Reply START to opt back in.</li>
          <li><strong>Help:</strong> reply HELP, or email ${email}.</li>
          <li><strong>Sharing:</strong> we don't share or sell your mobile number or text-message consent with anyone for their own marketing. Mobile opt-in data is never shared with third parties except the provider that delivers our texts.</li>
          <li>Carriers are not liable for delayed or undelivered messages.</li>
        </ul>

        <h2>Analytics and cookies</h2>
        <p>We use Plausible Analytics to count visits and a few form events (for example, "form started" and "form submitted"). Plausible doesn't use cookies or collect personal information, and doesn't follow you across other sites. This site doesn't set cookies of its own. Cloudflare Turnstile is designed to work without tracking cookies. If this changes, we'll update this policy and ask for consent where required.</p>

        <h2>How long we keep it</h2>
        <ul>
          <li>Unconfirmed sign-ups: deleted automatically about 7 days after the confirmation link expires</li>
          <li>Confirmed sign-ups: kept until you unsubscribe and ask us to delete them, or until early access ends and we no longer need them</li>
          <li>Consent and opt-out records: kept as long as needed to show we had permission and to honor opt-outs</li>
          <li>Rate-limiting records: a day or less</li>
        </ul>
        <!-- PLACEHOLDER (lawyer): confirm retention periods. -->

        <h2>Your choices and deletion requests</h2>
        <p>You can ask us to show you, correct or delete the information we hold about you, or to stop contacting you, by emailing ${email}. We'll confirm when it's done. Depending on where you live, you may have further rights under local law, including the right to complain to a data protection authority.</p>

        <h2>Protecting your information</h2>
        <p>We take reasonable steps to protect your information, including limiting who can access waitlist records, encrypting connections to this site and our form service, and storing confirmation tokens and IP addresses only as one-way hashes. No method of transmission or storage is completely risk-free.</p>

        <h2>Children</h2>
        <p>This site is for businesses and isn't directed to children under 16. We don't knowingly collect their information.</p>

        <h2>Changes to this policy</h2>
        <p>We'll post any changes here and update the date above. If a change is significant, we'll tell people on the waitlist by email.</p>

        <h2>Contact</h2>
        <p>${email}</p>
      </div>
    </section>`,
};
