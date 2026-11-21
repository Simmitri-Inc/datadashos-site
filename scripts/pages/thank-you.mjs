import { arrow } from "../lib/components.mjs";
import { absUrl } from "../lib/config.mjs";

const share = encodeURIComponent(absUrl(""));

export default {
  out: "thank-you.html",
  title: "You're on the list — DataDashOS",
  description: "Thanks for joining the DataDashOS waitlist. We're opening early access in waves, and we'll email you as soon as your spot is ready.",
  noindex: true,
  ogImage: "assets/og/thank-you.png",
  body: ({ P }) => `
    <section class="hero page-hero-section" aria-labelledby="thanks-title">
      <div class="wrap narrow">
        <p class="pending-notice" data-pending-notice hidden role="status">Almost there — check your inbox and click the link to confirm.</p>
        <h1 id="thanks-title" class="page-title">You're on the list.</h1>
        <p class="hero-lede">Thanks for joining the DataDashOS waitlist. We're opening early access in waves, and we'll email you as soon as your spot is ready.</p>
      </div>
    </section>

    <section aria-labelledby="next-title">
      <div class="wrap narrow">
        <div class="section-head reveal">
          <h2 id="next-title">What Happens Next</h2>
        </div>
        <ol class="next-steps reveal">
          <li><strong>Check your inbox.</strong> You'll get a confirmation email in the next few minutes.</li>
          <li><strong>We review your details.</strong> Your industry and team size help us set up the right KPI blueprint for you.</li>
          <li><strong>You get access.</strong> When your spot opens, we'll send your invite and a quick onboarding guide.</li>
        </ol>
      </div>
    </section>

    <section class="section-last" aria-labelledby="wait-title">
      <div class="wrap narrow">
        <div class="section-head reveal">
          <h2 id="wait-title">While You Wait</h2>
        </div>
        <p class="reveal"><strong>Start thinking KPI-first.</strong> Ask yourself one question: if you could only track three numbers for your business, which would they be? That's where DataDashOS starts.</p>
        <p class="reveal spaced"><strong>Want to jump the line?</strong> Share DataDashOS with another business owner who's tired of running on gut feel.</p>
        <div class="share-row reveal">
          <button type="button" class="btn btn-ghost" data-share-copy="${absUrl("")}">Copy link</button>
          <a class="btn btn-ghost" href="https://www.linkedin.com/sharing/share-offsite/?url=${share}" rel="noopener" target="_blank">LinkedIn</a>
          <a class="btn btn-ghost" href="mailto:?subject=DataDashOS%20%E2%80%94%20the%20KPI-first%20operating%20system&amp;body=${share}">Email</a>
        </div>
        <p class="reveal spaced"><a class="btn btn-shimmer" href="${P}how-it-works.html">See how DataDashOS works ${arrow}</a></p>
      </div>
    </section>`,
};
