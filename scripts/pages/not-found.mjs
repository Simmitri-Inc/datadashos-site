import { arrow } from "../lib/components.mjs";
import { config } from "../lib/config.mjs";

// GitHub Pages serves 404.html for any missing path, at any depth, so links resolve against <base>.
// deployBasePath must be "/" once the custom domain is live (SETUP.md).
export default {
  out: "404.html",
  title: "Page not found — DataDashOS",
  description: "This page doesn't exist. Try the KPI demo, the KPI Library or the homepage.",
  noindex: true,
  baseHref: config.deployBasePath,
  body: ({ P }) => `
    <section class="hero page-hero-section section-last">
      <div class="wrap narrow status-page">
        <p class="eyebrow">404</p>
        <h1 class="page-title">We couldn't find that page.</h1>
        <p class="hero-lede">It may have moved. Try the KPI demo, or browse the KPI Library.</p>
        <div class="cta-group">
          <a class="btn" href="${P}#kpi-demo">Build my KPI scorecard ${arrow}</a>
          <a class="btn btn-ghost" href="${P}kpi-library/">Browse the KPI Library</a>
        </div>
      </div>
    </section>`,
};
