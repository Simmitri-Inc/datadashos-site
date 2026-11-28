import { config, absUrl } from "./config.mjs";

export const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** Relative prefix from a page's output path to the site root, e.g. "kpi-library/healthcare/index.html" -> "../../". */
export const prefixFor = (outPath) => {
  const depth = outPath.split("/").length - 1;
  return depth === 0 ? "./" : "../".repeat(depth);
};

/** Public URL path for an output file: "index.html" -> "", "kpi-library/index.html" -> "kpi-library/". */
export const urlPathFor = (outPath) => outPath.replace(/(^|\/)index\.html$/, "$1");

const NAV = [
  { href: "how-it-works.html", label: "How it works", key: "how" },
  { href: "kpi-library/", label: "KPI Library", key: "kpi" },
  { href: "enterprise.html", label: "Enterprise", key: "enterprise" },
  { href: "faq.html", label: "FAQ", key: "faq" },
  { href: "about.html", label: "About", key: "about" },
];

const header = (P, page) => `
  <header class="site-header">
    <div class="wrap">
      <a class="logo" href="${P}" aria-label="DataDashOS home">DataDash<span>OS</span></a>
      <button class="nav-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="site-nav"><span></span></button>
      <nav class="nav" id="site-nav" aria-label="Primary">
${NAV.map(
  (n) =>
    `        <a href="${P}${n.href}"${page.nav === n.key ? ' aria-current="page"' : ""}>${n.label}</a>`
).join("\n")}
        <a class="btn" href="${page.waitlistHref}">Join the waitlist <span class="arrow" aria-hidden="true">→</span></a>
      </nav>
    </div>
  </header>`;

const footer = (P, page) => `
  <footer class="site-footer">
    <div class="wrap">
      <div class="footer-grid-4">
        <div>
          <p class="footer-brand">DataDash<span>OS</span></p>
          <p><strong>DataDashOS</strong> — the KPI-first operating system. KPIs first. Everything else follows.</p>
          <p class="footer-contact">Contact: <a data-contact-mailto data-contact-email href="mailto:${esc(config.contactEmail)}">${esc(config.contactEmail)}</a></p>
          <!-- PLACEHOLDER: Social links (LinkedIn · X) — add when accounts exist. -->
        </div>
        <nav class="footer-col" aria-labelledby="footer-product">
          <h2 id="footer-product">Product</h2>
          <a href="${P}how-it-works.html">How it works</a>
          <a href="${P}faq.html">FAQ</a>
          <a href="${P}kpi-library/">KPI Library</a>
          <a href="${P}kpi-library/building-supply-distribution/">Building supply &amp; distribution</a>
          <a href="${P}enterprise.html">Enterprise</a>
          <a href="${page.waitlistHref}">Join the waitlist</a>
        </nav>
        <nav class="footer-col" aria-labelledby="footer-company">
          <h2 id="footer-company">Company</h2>
          <a href="${P}about.html">About</a>
          <a data-contact-mailto href="mailto:${esc(config.contactEmail)}">Contact</a>
        </nav>
        <nav class="footer-col" aria-labelledby="footer-legal">
          <h2 id="footer-legal">Legal</h2>
          <a href="${P}privacy.html">Privacy policy</a>
          <a href="${P}terms.html">Terms of service</a>
        </nav>
      </div>
      <div class="footer-bottom">
        <span>© 2026 DataDashOS. All rights reserved. Product screens show sample data.</span>
      </div>
    </div>
  </footer>
  <div class="mobile-cta"><a class="btn" href="${page.waitlistHref}">Join the waitlist</a></div>`;

export const breadcrumbJsonLd = (crumbs) => ({
  "@type": "BreadcrumbList",
  itemListElement: crumbs.map((c, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: c.name,
    item: absUrl(c.path),
  })),
});

export const breadcrumbNav = (P, crumbs) => `
        <nav class="breadcrumbs" aria-label="Breadcrumb">
          <ol>
${crumbs
  .map((c, i) =>
    i === crumbs.length - 1
      ? `            <li><span aria-current="page">${esc(c.name)}</span></li>`
      : `            <li><a href="${P}${c.path}">${esc(c.name)}</a></li>`
  )
  .join("\n")}
          </ol>
        </nav>`;

/** "kpi-library/healthcare/index.html" -> "assets/og/kpi-library-healthcare.png"; "index.html" -> "assets/og/home.png". */
export function ogImageFor(page) {
  if (page.ogImage) return page.ogImage;
  const slug = page.out.replace(/(^|\/)index\.html$/, "").replace(/\.html$/, "").replace(/\/+$/, "").replace(/\//g, "-");
  return `assets/og/${slug || "home"}.png`;
}

export function renderPage(page) {
  const P = prefixFor(page.out);
  const urlPath = urlPathFor(page.out);
  const canonical = absUrl(urlPath);
  const ctx = {
    P,
    page,
    waitlistHref: page.out === "index.html" ? "#waitlist" : `${P}#waitlist`,
  };
  page.waitlistHref = ctx.waitlistHref;
  const body = page.body(ctx);
  const ogImage = absUrl(ogImageFor(page));
  const robots = page.noindex ? "noindex, follow" : "index, follow, max-image-preview:large, max-snippet:-1";

  const graph = [];
  if (page.breadcrumbs && page.breadcrumbs.length > 1) graph.push(breadcrumbJsonLd(page.breadcrumbs));
  if (page.jsonld) graph.push(...page.jsonld);
  const jsonld = graph.length
    ? `
  <script type="application/ld+json">
${JSON.stringify({ "@context": "https://schema.org", "@graph": graph }, null, 2)
  .split("\n")
  .map((l) => "  " + l)
  .join("\n")}
  </script>`
    : "";

  const a = config.analytics;
  const analyticsTag = a.enabled
    ? `\n  <script defer data-domain="${esc(a.domain)}"${
        new URL(a.apiHost).host === "plausible.io" ? "" : ` data-api="${esc(a.apiHost.replace(/\/+$/, ""))}/api/event"`
      } src="${esc(a.scriptSrc)}"></script>`
    : "";
  const local = ["assets/js/config.js", ...(a.enabled ? ["assets/js/analytics.js"] : []), "assets/js/main.js", ...(page.scripts || [])];
  const scripts = local.map((s) => `  <script src="${P}${s}" defer></script>`).join("\n") + analyticsTag;
  const styles = ["assets/css/styles.css", ...(page.styles || [])]
    .map((s) => `  <link rel="stylesheet" href="${P}${s}">`)
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(page.title)}</title>
  <meta name="description" content="${esc(page.description)}">
  <meta name="robots" content="${robots}">
  <meta name="theme-color" content="#070f1c">
  <meta name="referrer" content="strict-origin-when-cross-origin">
${page.csp === false ? "" : `  <meta http-equiv="Content-Security-Policy" content="${esc(cspFor(page))}">\n`}${page.baseHref ? `  <base href="${esc(page.baseHref)}">\n` : ""}  <link rel="canonical" href="${canonical}">

  <meta property="og:type" content="website">
  <meta property="og:site_name" content="DataDashOS">
  <meta property="og:locale" content="en_US">
  <meta property="og:url" content="${canonical}">
  <meta property="og:title" content="${esc(page.ogTitle || page.title)}">
  <meta property="og:description" content="${esc(page.ogDescription || page.description)}">
  <meta property="og:image" content="${ogImage}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${esc(page.ogImageAlt || page.ogTitle || page.title)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(page.ogTitle || page.title)}">
  <meta name="twitter:description" content="${esc(page.ogDescription || page.description)}">
  <meta name="twitter:image" content="${ogImage}">

  <link rel="icon" href="${P}assets/img/favicon.svg" type="image/svg+xml">
  <link rel="preload" href="${P}assets/fonts/manrope-latin.woff2" as="font" type="font/woff2" crossorigin>
${styles}${page.head ? "\n" + page.head(ctx) : ""}${jsonld}
</head>
<body${page.bodyClass ? ` class="${page.bodyClass}"` : ""}>
${page.draft ? '  <div class="draft-banner" role="note">DRAFT — pending legal review</div>\n' : ""}  <a class="skip-link" href="#main">Skip to content</a>
${header(P, page)}

  <main id="main">
${body}
  </main>
${footer(P, page)}

${scripts}
</body>
</html>
`;
}

export function cspFor(page, { forHeader = false } = {}) {
  const endpointOrigin = (() => {
    try {
      return new URL(config.forms.endpoint).origin;
    } catch {
      return "";
    }
  })();
  const analytics = config.analytics.enabled ? new URL(config.analytics.apiHost).origin : "";
  const analyticsScript = config.analytics.enabled ? new URL(config.analytics.scriptSrc).origin : "";
  const turnstile = "https://challenges.cloudflare.com";
  const dev = forHeader ? "" : "http://127.0.0.1:8787 http://localhost:8787";
  return [
    "default-src 'self'",
    `script-src 'self' ${turnstile} ${analyticsScript}`.trim(),
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    `connect-src 'self' ${endpointOrigin} ${analytics} ${turnstile} ${dev}`.replace(/\s+/g, " ").trim(),
    `frame-src ${turnstile}`,
    "object-src 'none'",
    "base-uri 'self'",
    `form-action 'self' ${endpointOrigin}`.trim(),
    // Only honoured as an HTTP header, not in a <meta> tag.
    ...(forHeader ? ["frame-ancestors 'none'", "upgrade-insecure-requests"] : []),
  ].join("; ");
}
