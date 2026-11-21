export default {
  out: "privacy.html",
  title: 'Privacy Policy (Draft) — DataDashOS',
  description: 'Draft privacy policy for the DataDashOS pre-launch waitlist: what we collect, how we use it, and how to request deletion.',
  noindex: true,
  draft: true,
  body: () => `
    <section class="hero" style="min-height:auto;padding-bottom:20px" aria-labelledby="privacy-title">
      <div class="wrap legal-prose">
        <p class="eyebrow">Legal</p>
        <h1 id="privacy-title" style="font-size:clamp(1.8rem,4vw,2.6rem)">Privacy Policy</h1>
        <p class="hero-lede" style="margin-top:12px">Last updated: November 21, 2026. This draft describes how DataDashOS handles information collected on this marketing site before product launch.</p>
      </div>
    </section>

    <section style="padding-bottom:60px">
      <div class="wrap legal-prose">
        <h2>Who we are</h2>
        <p>DataDashOS operates this website and the early-access waitlist. Contact us at <a data-contact-mailto data-contact-email>hello@datadashos.com</a>.</p>

        <h2>What the waitlist collects</h2>
        <p>When you join the waitlist, we may collect:</p>
        <ul>
          <li>Full name</li>
          <li>Work email address</li>
          <li>Company name</li>
          <li>Industry</li>
          <li>Number of employees</li>
          <li>Annual revenue (optional)</li>
          <li>Answers from the on-site KPI demo, if you used it (industry, team size, and top goal)</li>
        </ul>
        <p>We also receive basic technical information that your browser or our form provider may send, such as IP address, approximate location derived from IP, user agent, and the page you submitted from. These help us prevent spam and understand demand.</p>

        <h2>How we use this information</h2>
        <ul>
          <li>To confirm your waitlist signup and contact you about early access</li>
          <li>To prioritize onboarding waves using industry and company size</li>
          <li>To improve the marketing site and demo experience</li>
          <li>To protect the form against abuse</li>
        </ul>
        <p>We do not sell your personal information.</p>

        <h2>Who processes the data</h2>
        <p>Waitlist submissions are sent to our form provider (Formspree, once configured) and may be stored in that provider’s systems and in our email inbox. Our hosting provider (GitHub Pages) serves this static site and may process standard web server logs.</p>

        <h2>Retention</h2>
        <p>We keep waitlist information while we are running early access and for a reasonable period afterward so we can honor opt-out requests and operate the launch. You can ask us to delete your information sooner.</p>

        <h2>Your choices</h2>
        <p>You can request access to, correction of, or deletion of your waitlist information by emailing <a data-contact-mailto data-contact-email>hello@datadashos.com</a>. Include the email address you used to sign up so we can find your record.</p>

        <h2>Children</h2>
        <p>This site and waitlist are intended for business users. We do not knowingly collect personal information from children.</p>

        <h2>Changes</h2>
        <p>We may update this draft as the product launches and after legal review. The date at the top will change when we publish a revision.</p>

        <h2>Contact</h2>
        <p>Questions about privacy: <a data-contact-mailto data-contact-email>hello@datadashos.com</a>.</p>
      </div>
    </section>
  `,
};
