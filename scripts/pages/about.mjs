import { arrow } from "../lib/components.mjs";
import { config } from "../lib/config.mjs";

export default {
  out: "about.html",
  nav: "about",
  title: "About DataDashOS — Built by operators, for operators",
  description: "DataDashOS was built by business operators who learned the hard way that every business should start with its KPIs.",
  breadcrumbs: [
    { name: "Home", path: "" },
    { name: "About", path: "about.html" },
  ],
  jsonld: [{ "@type": "AboutPage", name: "About DataDashOS", description: "DataDashOS was built by business operators who learned the hard way that every business should start with its KPIs." }],
  body: ({ P, waitlistHref }) => `
    <section class="hero page-hero-section" aria-labelledby="about-title">
      <div class="wrap narrow">
        <p class="eyebrow">About</p>
        <h1 id="about-title" class="page-title">We built the system we wish we'd started with.</h1>
        <p class="hero-lede">DataDashOS exists because running a business without clear KPIs is exhausting, expensive and avoidable.</p>
      </div>
    </section>

    <section aria-labelledby="why-title">
      <div class="wrap narrow">
        <div class="section-head reveal">
          <h2 id="why-title">Why We Built DataDashOS</h2>
        </div>
        <div class="prose-stack reveal">
          <p>We spent years running a real business. We had accounting software, a CRM, marketing tools and plenty of spreadsheets. What we didn't have was agreement on which numbers actually mattered.</p>
          <p>So meetings ran on opinions. Problems showed up late. Good ideas died without an owner.</p>
          <p>When we finally defined our KPIs first, everything changed. Priorities got clear. Accountability got real. Growth got repeatable. DataDashOS turns that lesson into a system any business can run.</p>
        </div>
      </div>
    </section>

    <section aria-labelledby="believe-title">
      <div class="wrap mid">
        <div class="navy-panel reveal">
          <div class="section-head">
            <h2 id="believe-title">What We Believe</h2>
          </div>
          <ul class="belief-list">
            <li><strong>KPIs come first.</strong> Strategy, hiring and spending should follow from what success looks like in numbers.</li>
            <li><strong>Owners, not analysts.</strong> Business performance shouldn't need a data team to understand.</li>
            <li><strong>Insight is worthless without action.</strong> Every recommendation needs an owner and a result.</li>
            <li><strong>Your KPIs should grow with you.</strong> What matters at 10 people isn't what matters at 100.</li>
            <li><strong>Honesty over hype.</strong> Our product screens show sample data, and we never present it as customer results.</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- PLACEHOLDER: "The Team" section — founder name, photo and a two-sentence bio. Named people build far more trust than "our team". -->

    <section aria-labelledby="talk-title" class="section-last">
      <div class="wrap">
        <div class="cta-band reveal">
          <h2 id="talk-title">Talk With Us</h2>
          <p>Want to see DataDashOS in action or share what your business needs? Join the waitlist or email us at <a data-contact-mailto data-contact-email href="mailto:${config.contactEmail}">${config.contactEmail}</a>.</p>
          <p><a class="btn btn-shimmer" href="${waitlistHref}">Join the waitlist ${arrow}</a></p>
        </div>
      </div>
    </section>`,
};
