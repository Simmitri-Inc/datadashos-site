// Static site build: renders every page module in scripts/pages/ through the shared layout
// and writes the public config. Output files are committed because GitHub Pages serves the repo as-is.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { ROOT, config, absUrl } from "./lib/config.mjs";
import { renderPage, urlPathFor } from "./lib/layout.mjs";

const pagesDir = path.join(ROOT, "scripts/pages");

async function loadPages() {
  const files = fs.readdirSync(pagesDir, { recursive: true }).filter((f) => f.endsWith(".mjs")).sort();
  const pages = [];
  for (const f of files) {
    const mod = await import(pathToFileURL(path.join(pagesDir, f)).href);
    const exported = mod.default;
    if (!exported) continue;
    pages.push(...(Array.isArray(exported) ? exported : [exported]));
  }
  return pages;
}

function writeFile(rel, contents) {
  const full = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, contents);
}

function publicConfigJs() {
  const pub = {
    siteUrl: config.siteUrl,
    contactEmail: config.contactEmail,
    formEndpoint: config.forms.endpoint,
    turnstileSiteKey: config.forms.turnstileSiteKey,
    analytics: config.analytics,
  };
  return `/* Generated from site.config.json by scripts/build.mjs — edit that file, not this one. */
window.DATADASHOS_CONFIG = ${JSON.stringify(pub, null, 2)};
`;
}

const pages = await loadPages();
const seen = new Set();
for (const page of pages) {
  if (seen.has(page.out)) throw new Error(`Duplicate page output: ${page.out}`);
  seen.add(page.out);
  writeFile(page.out, renderPage(page));
}
writeFile("assets/js/config.js", publicConfigJs());

const today = new Date().toISOString().slice(0, 10);
const indexable = pages.filter((p) => !p.noindex).sort((a, b) => urlPathFor(a.out).localeCompare(urlPathFor(b.out)));
writeFile(
  "sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexable
  .map(
    (p) => `  <url>
    <loc>${absUrl(urlPathFor(p.out))}</loc>
    <lastmod>${today}</lastmod>
  </url>`
  )
  .join("\n")}
</urlset>
`
);
writeFile(
  "robots.txt",
  `# DataDashOS crawl policy. Pages that should stay out of search use a noindex meta tag
# (they are not blocked here, so crawlers can read that tag).
User-agent: *
Allow: /

Sitemap: ${absUrl("sitemap.xml")}
`
);

export { pages };
console.log(`Built ${pages.length} pages.`);
