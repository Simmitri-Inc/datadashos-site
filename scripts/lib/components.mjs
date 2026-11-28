import { esc } from "./layout.mjs";

/** Product screens (illustrative mocks with sample data); web sizes are built by scripts/images.mjs. */
export const SCREENS = {
  "kpi-scorecard": { w: 1600, h: 1000, alt: "DataDashOS KPI scorecard showing sample revenue, margin and win-rate KPIs with targets and trends" },
  "executive-dashboard": { w: 2400, h: 1500, alt: "DataDashOS executive dashboard showing sample KPI cards and revenue charts" },
  "sales-dashboard": { w: 2400, h: 1500, alt: "DataDashOS sales dashboard showing sample revenue, win-rate and pipeline metrics" },
  "marketing-dashboard": { w: 2400, h: 1500, alt: "DataDashOS marketing dashboard showing sample traffic, conversion and campaign metrics" },
  "operations-dashboard": { w: 2400, h: 1500, alt: "DataDashOS operations dashboard showing sample performance and incident metrics" },
  "data-source-controls": { w: 1600, h: 1000, alt: "DataDashOS data-source controls showing sample connections for accounting, CRM and ads" },
  "ai-coach-chat": { w: 1600, h: 1000, alt: "DataDashOS AI business coach chat answering a question about sample KPIs" },
};

export function shot(P, name, { caption, eager = false, sizes = "(max-width: 960px) 100vw, 560px", frameClass = "shot-frame", badge = true } = {}) {
  const s = SCREENS[name];
  const loading = eager ? 'fetchpriority="high"' : 'loading="lazy"';
  const badgeHtml = badge ? `<span class="sample-badge">Sample data</span>` : "";
  let captionHtml = "";
  if (caption === false) {
    captionHtml = "";
  } else if (caption) {
    captionHtml = `<figcaption class="shot-caption">${caption}${badge ? ` <span class="caption-sample">· Sample data</span>` : ""}</figcaption>`;
  } else if (badge) {
    captionHtml = `<figcaption class="shot-caption caption-sample">Sample data</figcaption>`;
  }
  return `<figure class="shot-figure">
            <div class="${frameClass}">
              <picture>
                <source type="image/webp" srcset="${P}assets/img/screens/${name}-800.webp 800w, ${P}assets/img/screens/${name}-1600.webp 1600w" sizes="${sizes}">
                <img src="${P}assets/img/screens/${name}-1600.png" width="1600" height="1000" alt="${esc(s.alt)}" ${loading} decoding="async">
              </picture>
              ${badgeHtml}
            </div>
            ${captionHtml}
          </figure>`;
}

/** Visible slot for a product screen that has not been captured yet. */
export function placeholderShot(id, label) {
  return `<figure class="shot-figure" data-screen-placeholder="${id}">
            <!-- PLACEHOLDER: ${esc(label)} — replace with a real capture (see SETUP.md, "Product screenshots"). -->
            <div class="shot-placeholder-frame" role="img" aria-label="${esc(label)} screenshot coming soon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M3 9h18M8 21h8"/></svg>
              <strong>Screenshot coming soon</strong>
              <span>${esc(label)}</span>
            </div>
            <figcaption class="shot-caption">Coming soon</figcaption>
          </figure>`;
}

export function faqList(items) {
  return `<div class="faq-list">
${items
  .map(
    ([q, a]) => `          <details class="faq-item">
            <summary>${esc(q)} <span class="chev" aria-hidden="true">▾</span></summary>
            <div class="answer">${esc(a)}</div>
          </details>`
  )
  .join("\n")}
        </div>`;
}

export const faqJsonLd = (items) => ({
  "@type": "FAQPage",
  mainEntity: items.map(([q, a]) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
});

export const arrow = '<span class="arrow" aria-hidden="true">→</span>';
