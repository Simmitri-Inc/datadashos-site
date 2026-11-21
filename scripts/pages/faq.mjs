import { faqList, faqJsonLd, arrow } from "../lib/components.mjs";
import { HOME_FAQ } from "./index.mjs";

export default {
  out: "faq.html",
  nav: "faq",
  title: "FAQ — DataDashOS, the KPI-first operating system",
  description: "Answers to common questions about DataDashOS: what it is, who it's for, how it works with your software, how the AI coach uses your data, and how to get early access.",
  ogImage: "assets/og/faq.png",
  breadcrumbs: [
    { name: "Home", path: "" },
    { name: "FAQ", path: "faq.html" },
  ],
  jsonld: [faqJsonLd(HOME_FAQ)],
  body: ({ P, waitlistHref }) => `
    <section class="hero page-hero-section" aria-labelledby="faq-title">
      <div class="wrap narrow">
        <h1 id="faq-title" class="page-title">FAQ</h1>
      </div>
    </section>

    <section aria-label="Frequently asked questions">
      <div class="wrap narrow">
        ${faqList(HOME_FAQ)}
      </div>
    </section>

    <section class="section-last" aria-labelledby="faq-cta-title">
      <div class="wrap">
        <div class="cta-band reveal">
          <h2 id="faq-cta-title">Know your numbers. Run your business.</h2>
          <p>Join the waitlist and be among the first to run your business KPI-first.</p>
          <p><a class="btn btn-shimmer" href="${waitlistHref}">Join the waitlist ${arrow}</a></p>
        </div>
      </div>
    </section>`,
};
