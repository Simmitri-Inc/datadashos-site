// Renders one 1200x630 Open Graph image per page into assets/og/, using headless Chrome so the
// site's own font is used. Run after adding or renaming pages: `CHROME_PATH=/path/to/chrome npm run og`.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import sharp from "sharp";
import { chromium } from "playwright-core";
import { ROOT } from "./lib/config.mjs";
import { ogImageFor, esc } from "./lib/layout.mjs";

const pagesDir = path.join(ROOT, "scripts/pages");
const pages = [];
for (const f of fs.readdirSync(pagesDir).filter((f) => f.endsWith(".mjs")).sort()) {
  const mod = await import(pathToFileURL(path.join(pagesDir, f)).href);
  pages.push(...[].concat(mod.default));
}

const headline = (p) =>
  p.ogHeadline || (p.ogTitle || p.title).replace(/\s+\|\s+DataDashOS.*$/, "").replace(/\s+—\s+DataDashOS$/, "");
const eyebrow = (p) => {
  if (p.out.startsWith("kpi-library/")) return "KPI Library";
  if (p.out === "enterprise.html") return "Enterprise · Early access";
  if (p.draft) return "Draft — pending legal review";
  return "The KPI-first operating system";
};

const font = fs.readFileSync(path.join(ROOT, "assets/fonts/manrope-latin.woff2")).toString("base64");
const html = (p) => `<!doctype html><html><head><style>
@font-face { font-family: Manrope; src: url(data:font/woff2;base64,${font}) format("woff2"); font-weight: 500 800; }
* { margin: 0; box-sizing: border-box; }
body { width: 1200px; height: 630px; font-family: Manrope, sans-serif; color: #fff; overflow: hidden;
  background: radial-gradient(700px 400px at 85% 10%, rgba(61,139,255,.35), transparent 60%),
              radial-gradient(600px 360px at 10% 100%, rgba(196,163,90,.28), transparent 60%),
              linear-gradient(145deg, #0b1b33, #163057); }
.wrap { position: absolute; inset: 64px 72px; display: flex; flex-direction: column; }
.logo { font-size: 34px; font-weight: 800; letter-spacing: -0.02em; }
.logo span { color: #5b8cff; }
.eyebrow { margin-top: auto; font-size: 22px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: #e0c078; display: flex; align-items: center; gap: 14px; }
.eyebrow::before { content: ""; width: 44px; height: 2px; background: #e0c078; }
h1 { margin-top: 18px; font-size: ${headline(p).length > 48 ? 58 : 68}px; line-height: 1.08; letter-spacing: -0.03em; font-weight: 800; max-width: 940px; }
.foot { margin-top: 34px; display: flex; gap: 12px; }
.pill { font-size: 20px; font-weight: 700; padding: 8px 16px; border-radius: 999px; border: 1px solid rgba(255,255,255,.25); color: rgba(232,238,248,.9); }
.pill.g { border-color: rgba(29,146,112,.7); color: #b9f1dc; }
.bars { position: absolute; right: 72px; top: 64px; display: flex; gap: 10px; align-items: flex-end; height: 90px; }
.bars i { width: 16px; border-radius: 6px; background: linear-gradient(#5b8cff, #2f6bff); }
.bars i:nth-child(odd) { background: linear-gradient(#4fd1a5, #1d9270); }
</style></head><body>
<div class="bars"><i style="height:38%"></i><i style="height:55%"></i><i style="height:48%"></i><i style="height:72%"></i><i style="height:88%"></i></div>
<div class="wrap">
  <div class="logo">DataDash<span>OS</span></div>
  <div class="eyebrow">${esc(eyebrow(p))}</div>
  <h1>${esc(headline(p))}</h1>
  <div class="foot"><span class="pill">KPIs first. Everything else follows.</span>${
    p.out === "enterprise.html" ? '<span class="pill g">Early access</span>' : ""
  }</div>
</div></body></html>`;

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || "/usr/local/bin/google-chrome",
  args: ["--no-sandbox"],
});
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
for (const p of pages) {
  const out = path.join(ROOT, ogImageFor(p));
  fs.mkdirSync(path.dirname(out), { recursive: true });
  await page.setContent(html(p), { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  const png = await page.screenshot({ type: "png" });
  await sharp(png).png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(out);
  console.log("wrote", path.relative(ROOT, out));
}
await browser.close();
