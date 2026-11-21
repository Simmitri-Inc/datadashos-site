import { shot, placeholderShot, arrow } from "../lib/components.mjs";

const step = ({ id, n, name, headline, intro, bullets, media, reverse }) => `
    <section id="step-${n}" aria-labelledby="step${n}-title">
      <div class="wrap">
        <div class="step-block navy-panel reveal${reverse ? " reverse" : ""}${media ? "" : " step-block-text"}">
          <div>
            <p class="step-kicker">Step ${n}: <span class="step-name">${name}</span></p>
            <h2 id="step${n}-title">${headline}</h2>
            <p class="step-intro">${intro}</p>
            <ul class="check-list">
${bullets.map((b) => `              <li>${b}</li>`).join("\n")}
            </ul>
          </div>
          ${media ? `<div class="step-media">${media}</div>` : ""}
        </div>
      </div>
    </section>`;

export default {
  out: "how-it-works.html",
  nav: "how",
  title: "How DataDashOS Works — Define, Track, Manage, Adapt",
  description: "See how DataDashOS defines your KPIs, tracks them in one scorecard, turns weekly reviews into action, and adapts your KPIs as you grow.",
  ogImage: "assets/og/how-it-works.png",
  breadcrumbs: [
    { name: "Home", path: "" },
    { name: "How it works", path: "how-it-works.html" },
  ],
  jsonld: [
    {
      "@type": "HowTo",
      name: "How DataDashOS works",
      description: "See how DataDashOS defines your KPIs, tracks them in one scorecard, turns weekly reviews into action, and adapts your KPIs as you grow.",
      step: [
        { "@type": "HowToStep", position: 1, name: "Define", text: "Start with the right KPIs, not a blank dashboard." },
        { "@type": "HowToStep", position: 2, name: "Track", text: "Every KPI, every department, one scorecard." },
        { "@type": "HowToStep", position: 3, name: "Manage", text: "Turn numbers into decisions, every week." },
        { "@type": "HowToStep", position: 4, name: "Adapt", text: "Your KPIs grow as your business does." },
      ],
    },
  ],
  body: ({ P, waitlistHref }) => `
    <section class="hero page-hero-section" aria-labelledby="product-title">
      <div class="wrap mid">
        <p class="eyebrow">Product</p>
        <h1 id="product-title" class="page-title">One system. Four steps. A business that runs on what matters.</h1>
        <p class="hero-lede">DataDashOS gives every business the operating rhythm great companies share: know your numbers, review them every week, act, and improve.</p>
        <div class="cta-group">
          <a class="btn btn-shimmer" href="${waitlistHref}">Join the waitlist ${arrow}</a>
        </div>
        <figure class="illus-block reveal">
          <img src="${P}assets/img/illustrations/kpi-operating-rhythm.svg" width="1120" height="280" alt="Illustration of Define, Track, Manage, Adapt — the KPI-first operating rhythm" loading="lazy" decoding="async">
        </figure>
      </div>
    </section>
${step({
  n: 1,
  name: "Define",
  headline: "Start with the right KPIs, not a blank dashboard.",
  intro: "Guided onboarding asks about your industry, business model, goals and stage. Industry blueprints then recommend the KPIs that matter most for a business like yours.",
  bullets: [
    "Clear definitions, so everyone measures the same thing",
    "Targets for every KPI",
    "An owner for every number",
    "Your own custom KPIs alongside the recommended ones",
  ],
  media: placeholderShot("guided-onboarding", "Guided onboarding"),
})}
${step({
  n: 2,
  name: "Track",
  headline: "Every KPI, every department, one scorecard.",
  intro: "See the health of your whole business at a glance, from the executive view down to marketing, sales, operations and finance.",
  bullets: [
    "Status, targets and trends on every KPI",
    "Prior-period and year-over-year comparisons",
    "Custom dashboard layouts and templates",
    "Data from connected tools, CSV import or manual entry",
  ],
  media: `${shot(P, "executive-dashboard", { caption: "Executive dashboard" })}
          ${placeholderShot("app-kpi-scorecard", "KPI scorecard (captured from the DataDashOS app)")}`,
  reverse: true,
})}
${step({
  n: 3,
  name: "Manage",
  headline: "Turn numbers into decisions, every week.",
  intro: "Each week, DataDashOS reviews your KPIs and explains what changed and why. Your AI business coach recommends what to do next, and every recommendation becomes a tracked action with an owner.",
  bullets: [
    "AI-written weekly reviews",
    "An AI business coach grounded in your own KPIs",
    "Specialist perspectives across sales, marketing, finance, operations and customer experience",
    "Action items tracked against the KPI they're meant to move",
  ],
  media: `${shot(P, "sales-dashboard", { caption: "Sales dashboard" })}
          ${placeholderShot("app-ai-coach", "AI business coach (captured from the DataDashOS app)")}`,
})}
${step({
  n: 4,
  name: "Adapt",
  headline: "Your KPIs grow as your business does.",
  intro: "What matters at 10 people isn't what matters at 100. DataDashOS spots room for improvement, flags KPIs that are slipping, and recommends new ones as your business changes.",
  bullets: [
    "Improvement opportunities surfaced automatically",
    "Early warnings when KPIs drift off target",
    "New KPI recommendations as your business evolves",
    "Forecasts to see where you're heading",
  ],
  reverse: true,
})}

    <section id="tools" aria-labelledby="tools-title">
      <div class="wrap">
        <div class="step-block navy-panel reveal">
          <div>
            <p class="eyebrow">Works With Your Tools</p>
            <h2 id="tools-title">Unify performance, not software.</h2>
            <p class="step-intro">DataDashOS sits on top of the tools you already use. It's built to connect with QuickBooks Online, GoHighLevel and Google Ads, with CSV import for everything else. More connections are on the way.</p>
          </div>
          <div class="step-media">${shot(P, "data-source-controls", { caption: "Data-source controls" })}</div>
        </div>
      </div>
    </section>

    <section aria-labelledby="teams-title">
      <div class="wrap mid">
        <div class="navy-panel reveal">
          <div class="section-head">
            <h2 id="teams-title">Built for Teams</h2>
          </div>
          <ul class="who-list">
            <li>Shared workspaces for your whole leadership team</li>
            <li>Roles and permissions for who sees what</li>
            <li>Audit logs for accountability</li>
            <li>Custom branding for your workspace</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="section-last" aria-labelledby="ready-title">
      <div class="wrap">
        <div class="cta-band reveal">
          <h2 id="ready-title">Ready to run your business KPI-first?</h2>
          <p>Join the waitlist and be among the first to get access.</p>
          <p><a class="btn btn-shimmer" href="${waitlistHref}">Join the waitlist ${arrow}</a></p>
        </div>
      </div>
    </section>`,
};
