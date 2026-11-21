import { config } from "../lib/config.mjs";
import { esc } from "../lib/layout.mjs";

const email = `<a data-contact-mailto data-contact-email href="mailto:${esc(config.contactEmail)}">${esc(config.contactEmail)}</a>`;

export default {
  out: "terms.html",
  title: "Terms of Service (Draft) — DataDashOS",
  description:
    "Draft terms for using the DataDashOS pre-launch website, KPI demo, waitlist and early-access program, including the text message terms.",
  noindex: true,
  draft: true,
  breadcrumbs: [
    { name: "Home", path: "" },
    { name: "Terms of Service", path: "terms.html" },
  ],
  body: ({ P }) => `
    <section class="hero page-hero-section" aria-labelledby="terms-title">
      <div class="wrap legal-prose">
        <p class="eyebrow">Legal</p>
        <h1 id="terms-title" class="page-title">Terms of Service</h1>
        <p class="hero-lede">Draft — last updated November 21, 2026. These terms cover your use of the DataDashOS website, the KPI demo, the waitlist and the enterprise early-access program before launch.</p>
        <!-- PLACEHOLDER (lawyer): legal entity name, address, governing law and venue. -->
      </div>
    </section>

    <section class="section-last">
      <div class="wrap legal-prose">
        <h2>Using this site</h2>
        <p>By using this website you agree to these terms. If you don't agree, please don't use the site.</p>

        <h2>DataDashOS is in development</h2>
        <p>DataDashOS hasn't launched. Features described on this site, including everything on the Enterprise page, are in development and may change, arrive later than planned, or not be offered. Joining the waitlist or the enterprise early-access program doesn't guarantee access, a launch date, specific features or pricing, and doesn't create a contract to provide the product.</p>

        <h2>Sample data and example scenarios</h2>
        <p>Product images, scorecards and dashboards on this site show sample data. Use cases are labelled "Example scenario" and are illustrations, not results from real customers. Industry KPI guides are general information.</p>

        <h2>The KPI demo</h2>
        <p>The demo suggests sample KPIs based on a few answers. It's for illustration only and isn't financial, legal, medical or other professional advice. Make business decisions based on your own judgment and qualified advice.</p>

        <h2>Waitlist and early access</h2>
        <ul>
          <li>Give accurate information and only sign up yourself, using an email address you control.</li>
          <li>We may contact you about early access as described in our <a href="${P}privacy.html">Privacy Policy</a>.</li>
          <li>You can leave at any time using the unsubscribe link in any email, or by emailing ${email}.</li>
          <li>We may close the waitlist or remove entries that look fake or abusive.</li>
        </ul>

        <h2 id="text-messages">Text messages</h2>
        <p>If you enter a mobile number and tick the box agreeing to texts, you agree to receive text messages from DataDashOS about early access and your account.</p>
        <ul>
          <li><strong>Program:</strong> DataDashOS early-access and account messages.</li>
          <li><strong>Confirmation:</strong> the first message asks you to reply YES. We send nothing else until you do.</li>
          <li><strong>Frequency:</strong> message frequency varies.</li>
          <li><strong>Cost:</strong> message and data rates may apply.</li>
          <li><strong>Opt out:</strong> reply STOP at any time to stop all texts. You'll get one message confirming you've opted out.</li>
          <li><strong>Help:</strong> reply HELP, or email ${email}.</li>
          <li><strong>Consent is optional:</strong> agreeing to texts is not a condition of signing up or of any purchase.</li>
          <li>Carriers are not liable for delayed or undelivered messages.</li>
          <li>See the <a href="${P}privacy.html#text-messages">Text messages section of our Privacy Policy</a> for how we handle your number.</li>
        </ul>

        <h2>Acceptable use</h2>
        <p>Don't misuse the site: no automated sign-ups or scraping, no attempts to break, overload or get around our forms or bot checks, no submitting someone else's details, and nothing unlawful.</p>

        <h2>Our content</h2>
        <p>The site, its text, design, illustrations and the DataDashOS name and logo belong to DataDashOS or its licensors. You may share links to the site, but please don't copy or reuse its content without permission.</p>

        <h2>Links to other sites</h2>
        <p>We may link to other websites. We're not responsible for their content or practices.</p>

        <h2>No warranties</h2>
        <p>The site and demo are provided "as is" and "as available", without warranties of any kind, to the extent the law allows. We don't promise the site will always be available or error-free.</p>

        <h2>Limitation of liability</h2>
        <p>To the extent the law allows, DataDashOS isn't liable for indirect, incidental or consequential losses arising from your use of this pre-launch site, the demo or the waitlist.</p>
        <!-- PLACEHOLDER (lawyer): liability cap, governing law, dispute resolution. -->

        <h2>Changes</h2>
        <p>We may update these terms. We'll post changes here and update the date above.</p>

        <h2>Contact</h2>
        <p>${email}</p>
      </div>
    </section>`,
};
