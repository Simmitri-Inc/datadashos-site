import { arrow } from "../lib/components.mjs";
import { breadcrumbNav, esc } from "../lib/layout.mjs";
import { INDUSTRIES, relatedFor } from "../lib/kpi-library-data.mjs";
import { sampleScorecard, guessingVsMeasured, rollupDiagram } from "../lib/kpi-visuals.mjs";
import { STEPS } from "./index.mjs";

const HUB_CRUMBS = [
  { name: "Home", path: "" },
  { name: "KPI Library", path: "kpi-library/" },
];

const icon = (paths, size = 26) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths}</svg>`;

const hub = {
  out: "kpi-library/index.html",
  nav: "kpi",
  title: "KPI Library — The KPIs Every Business Should Track, by Industry | DataDashOS",
  description:
    "Free guides to the KPIs that matter most in your industry, with real-world use cases. Find your industry and see your sample scorecard.",
  ogImage: "assets/og/kpi-library.png",
  breadcrumbs: HUB_CRUMBS,
  jsonld: [
    {
      "@type": "CollectionPage",
      name: "KPI Library",
      hasPart: INDUSTRIES.map((ind) => ({ "@type": "WebPage", name: ind.headline.replace(/\.$/, "") })),
    },
  ],
  body: ({ P }) => `
    <section class="hero page-hero-section" aria-labelledby="kpi-hub-title">
      <div class="wrap mid">
        ${breadcrumbNav(P, HUB_CRUMBS)}
        <p class="eyebrow">KPI Library</p>
        <h1 id="kpi-hub-title" class="page-title">The KPIs that matter in your industry.</h1>
        <p class="hero-lede">Every industry wins differently. Pick yours to see the numbers top businesses run on, and how they use them.</p>
      </div>
    </section>

    <section aria-label="Industries">
      <div class="wrap">
        <ul class="industry-grid">
${INDUSTRIES.map(
  (ind) => `          <li>
            <a class="industry-card" href="${P}kpi-library/${ind.slug}/">
              <span class="industry-icon">${icon(ind.icon)}</span>
              <span class="industry-name">${esc(ind.name)}</span>
              <span class="arrow" aria-hidden="true">→</span>
            </a>
          </li>`
).join("\n")}
        </ul>
      </div>
    </section>

    <section class="section-last" aria-label="Try the demo">
      <div class="wrap mid">
        <div class="cta-band reveal">
          <p class="cta-band-line">Not sure where to start?</p>
          <a class="btn btn-shimmer" href="${P}#kpi-demo">See your KPIs in 30 seconds ${arrow}</a>
        </div>
      </div>
    </section>`,
};

function industryPage(ind, index) {
  const crumbs = [...HUB_CRUMBS, { name: ind.name, path: `kpi-library/${ind.slug}/` }];
  const isPortfolio = !ind.demoKey;
  const ctaHref = (P) => (isPortfolio ? `${P}enterprise.html` : `${P}?industry=${ind.demoKey}#kpi-demo`);
  return {
    out: `kpi-library/${ind.slug}/index.html`,
    nav: "kpi",
    title: `KPIs for ${ind.name} | DataDashOS KPI Library`,
    description: `${ind.pain} The core KPIs for ${ind.name.toLowerCase()}, what each one tells you, and an example scenario.`,
    ogImage: `assets/og/kpi-${ind.slug}.png`,
    breadcrumbs: crumbs,
    body: ({ P }) => `
    <section class="hero page-hero-section kpi-hero" aria-labelledby="kpi-title">
      <div class="wrap">
        ${breadcrumbNav(P, crumbs)}
        <div class="kpi-hero-grid">
          <div>
            <p class="eyebrow">KPI Library</p>
            <h1 id="kpi-title" class="page-title">${esc(ind.headline)}</h1>
            <p class="hero-lede">${esc(ind.pain)}</p>
            <div class="cta-group">
              <a class="btn btn-shimmer" href="${ctaHref(P)}">${esc(ind.cta)} ${arrow}</a>
            </div>
          </div>
          <div class="kpi-hero-visual">
            ${isPortfolio ? rollupDiagram() : sampleScorecard(ind, index)}
          </div>
        </div>
      </div>
    </section>

    <section aria-labelledby="why-title">
      <div class="wrap mid">
        <div class="navy-panel reveal">
          <div class="section-head">
            <h2 id="why-title">Why KPIs matter</h2>
            <p>${esc(ind.why)}</p>
          </div>
        </div>
      </div>
    </section>

    <section aria-labelledby="core-title">
      <div class="wrap">
        <div class="navy-panel reveal">
          <div class="section-head">
            <h2 id="core-title">The core KPIs</h2>
          </div>
          <div class="table-scroll">
            <table class="compare-table kpi-table">
              <thead>
                <tr><th scope="col">KPI</th><th scope="col">What it tells you</th><th scope="col">Why it matters</th></tr>
              </thead>
              <tbody>
${ind.kpis.map(([k, w, y]) => `                <tr><th scope="row">${esc(k)}</th><td>${esc(w)}</td><td>${esc(y)}</td></tr>`).join("\n")}
              </tbody>
            </table>
          </div>
${isPortfolio ? `          <div class="kpi-extra-visual">${sampleScorecard(ind, index)}</div>` : ""}
        </div>
      </div>
    </section>

    <section aria-labelledby="scenario-title">
      <div class="wrap">
        <div class="navy-panel reveal scenario-panel">
          <div class="section-head">
            <p class="scenario-label">Example scenario</p>
            <h2 id="scenario-title" class="visually-hidden">Example scenario</h2>
            <p>${esc(ind.scenario)}</p>
          </div>
          ${guessingVsMeasured(ind)}
        </div>
      </div>
    </section>

    <section aria-labelledby="helps-title">
      <div class="wrap mid">
        <div class="navy-panel reveal">
          <div class="section-head">
            <h2 id="helps-title">How DataDashOS helps</h2>
${isPortfolio ? `            <p>${esc(ind.helps)}</p>` : ""}
          </div>
${
  isPortfolio
    ? ""
    : `          <ul class="helps-list">
${STEPS.map(([name, sub]) => `            <li><strong>${name}</strong> — ${sub}</li>`).join("\n")}
          </ul>`
}
          <p class="panel-cta"><a class="btn btn-shimmer" href="${ctaHref(P)}">${esc(ind.cta)} ${arrow}</a></p>
        </div>
      </div>
    </section>

    <section class="section-last" aria-labelledby="related-title">
      <div class="wrap mid">
        <h2 id="related-title" class="related-title">More from the KPI Library</h2>
        <ul class="related-links">
${relatedFor(ind.slug)
  .map(
    (r) => `          <li><a href="${P}kpi-library/${r.slug}/"><span class="industry-icon">${icon(r.icon, 20)}</span>${esc(r.name)}</a></li>`
  )
  .join("\n")}
          <li><a href="${P}kpi-library/"><span class="industry-icon">${icon('<path d="M4 6h16M4 12h16M4 18h16"/>', 20)}</span>All industries</a></li>
        </ul>
      </div>
    </section>`,
  };
}

export default [hub, ...INDUSTRIES.map(industryPage)];
