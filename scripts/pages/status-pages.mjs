import { arrow } from "../lib/components.mjs";
import { config } from "../lib/config.mjs";
import { esc } from "../lib/layout.mjs";

// Landing pages for links in emails. The Worker redirects here with ?status=expired|invalid on failure.
const view = (status, h1, body, cta, hidden) => `
          <div data-status-view="${status}"${hidden ? " hidden" : ""}>
            <h1 class="page-title">${h1}</h1>
            <p class="hero-lede">${body}</p>
            ${cta}
          </div>`;

const shell = (inner) => `
    <section class="hero page-hero-section section-last" aria-live="polite">
      <div class="wrap narrow status-page">
${inner}
      </div>
    </section>`;

const email = `<a data-contact-mailto data-contact-email href="mailto:${esc(config.contactEmail)}">${esc(config.contactEmail)}</a>`;

export default [
  {
    out: "confirmed.html",
    title: "You're confirmed — DataDashOS",
    description: "Your email is confirmed for DataDashOS early access.",
    noindex: true,
    body: ({ P }) =>
      shell(
        view(
          "ok",
          "You're confirmed",
          "Thanks for confirming your email. We'll only use it to contact you about early access.",
          `<div class="cta-group"><a class="btn btn-shimmer" href="${P}kpi-library/">Explore the KPI Library ${arrow}</a></div>`
        ) +
          view(
            "expired",
            "This link has expired",
            `Confirmation links work once and expire after ${config.forms.confirmLinkHours} hours. Sign up again and we'll send you a new one.`,
            `<div class="cta-group"><a class="btn btn-shimmer" href="${P}#waitlist">Join the waitlist ${arrow}</a></div>`,
            true
          ) +
          view(
            "invalid",
            "This link isn't valid",
            `It may have been used already. If you confirmed before, you're all set. Questions? Email ${email}.`,
            `<div class="cta-group"><a class="btn btn-ghost" href="${P}">Back to home</a></div>`,
            true
          )
      ),
  },
  {
    out: "unsubscribed.html",
    title: "You're unsubscribed — DataDashOS",
    description: "You've been unsubscribed from DataDashOS emails.",
    noindex: true,
    body: ({ P }) =>
      shell(
        view(
          "ok",
          "You're unsubscribed",
          "You won't get any more emails from DataDashOS about early access.",
          `<div class="cta-group"><a class="btn btn-ghost" href="${P}">Back to home</a></div>`
        ) +
          view(
            "invalid",
            "This unsubscribe link isn't valid",
            `Email ${email} and we'll remove you right away.`,
            `<div class="cta-group"><a class="btn btn-ghost" href="${P}">Back to home</a></div>`,
            true
          )
      ),
  },
];
