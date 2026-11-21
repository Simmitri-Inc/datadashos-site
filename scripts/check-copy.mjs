// Verifies that every piece of visitor-facing copy in new-site-copy.md appears verbatim on the built site.
// Bracketed build notes, meta labels ("Headline:", "CTA:") and field specs are skipped.
import fs from "node:fs";
import path from "node:path";
import { ROOT, config } from "./lib/config.mjs";

const decode = (s) =>
  s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

const norm = (s) => decode(s).replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"').replace(/\s+/g, " ").replace(/ ([.,;:!?])/g, "$1").trim();

function htmlFiles(dir) {
  return fs
    .readdirSync(dir, { recursive: true })
    .filter((f) => f.endsWith(".html") && !f.startsWith("node_modules") && !f.includes("/node_modules/") && !f.startsWith("worker"))
    .map((f) => path.join(dir, f));
}

const pageText = (html) =>
  norm(
    html
      .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, " ")
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<meta\b[^>]*>/g, (m) => {
        const c = m.match(/content="([^"]*)"/);
        return ` ${c ? c[1] : ""} `;
      })
      .replace(/<[^>]+>/g, " ")
  );

const corpus = [
  ...htmlFiles(ROOT).map((f) => pageText(fs.readFileSync(f, "utf8"))),
  ...["assets/js/kpi-demo.js", "assets/js/kpi-blueprints.js", "assets/js/main.js", "assets/js/forms.js"]
    .filter((f) => fs.existsSync(path.join(ROOT, f)))
    .map((f) => norm(fs.readFileSync(path.join(ROOT, f), "utf8"))),
].join(" \u241E ");

const LABEL = /^(Title|Description|Social title|Headline|Subheadline|Hook line|Primary CTA|Secondary CTA|Body|Fields|Button|Results heading|Results body|Results disclaimer|Follow-up CTA|Form fields|CTA|Note|Lede|Eyebrow|Pain point|Why KPIs matter|Example scenario|How DataDashOS helps|Form option|Brand blurb|Contact|Social|Bottom line|Mobile sticky CTA)\s*:\s*/i;

const md = fs.readFileSync(path.join(ROOT, "new-site-copy.md"), "utf8");
const lines = md.split("\n");
const segments = [];
let section = "";
let skipSection = false;
for (const raw of lines) {
  let line = raw.trim();
  if (!line) continue;
  if (/^#{1,3}\s/.test(line)) {
    section = line.replace(/^#+\s*/, "");
    skipSection = /^(Page Template|Industry Grid)/.test(section) || /^Meta$/.test(section);
    continue;
  }
  if (skipSection) continue;
  if (/^\|\s*-+/.test(line)) continue;
  line = line.replace(/\*\\\[DataDashOS contact email\\\]\*/g, config.contactEmail);
  if (/^\*\*Form option:\*\*/.test(line)) {
    for (const q of line.matchAll(/"([^"]+)"/g)) segments.push({ section, text: q[1] });
    segments.push({ section, text: "Preferred days/times (optional)" });
    continue;
  }
  if (/^\*\\\[/.test(line) || /^\\\[/.test(line)) continue;
  line = line.replace(/\*\\\[[^\]]*\\\]\*/g, "").replace(/\\\[[^\]]*\\\]/g, "");
  line = line.replace(/^\s*(-|\d+\.)\s+/, "");
  const cells = line.startsWith("|") ? line.split("|").map((c) => c.trim()).filter(Boolean) : [line];
  for (let cell of cells) {
    cell = cell.replace(/\\/g, "");
    for (let part of cell.split(/\*\*/)) {
      part = part.replace(/\*/g, "").trim();
      part = part.replace(LABEL, "").trim();
      if (!part || part.length < 3 || /:$/.test(part)) continue;
      if (/^\(.*\)$/.test(part)) continue;
      // Field specs such as "Industry (dropdown, ...)" describe form controls, not copy.
      if (/\((dropdown|optional dropdown)/.test(part)) {
        const opts = part.match(/: (.*)\)$/);
        if (opts) opts[1].split(/,\s*/).forEach((o) => segments.push({ section, text: o.trim() }));
        part = part.replace(/\s*\(.*$/, "");
      }
      if (part.includes(" · ") && /Grow revenue|Private AI|Construction/.test(part)) {
        part.replace(/^.*?\(|\)$/g, "").split(" · ").forEach((o) => segments.push({ section, text: o.replace(/^Interested in:\s*/, "").trim() }));
        continue;
      }
      segments.push({ section, text: part });
    }
  }
}

// kpi-library-update.md is plain text: one table cell per line, section titles as "KPI Library: X".
const UPDATE_FILE = "kpi-library-update.md";
if (fs.existsSync(path.join(ROOT, UPDATE_FILE))) {
  const STRUCTURE = /^(KPI Library( \(Hub Page\)|: .*)|Meta \/ SEO|Hero|Industry Grid|KPI|Shared KPI|What it tells you|Why it matters)$/;
  let section = "";
  let inTemplate = false;
  for (const raw of fs.readFileSync(path.join(ROOT, UPDATE_FILE), "utf8").split("\n")) {
    let line = raw.trim().replace(/^•\s*/, "");
    if (!line) continue;
    if (/^KPI Library/.test(line)) section = `${UPDATE_FILE}: ${line}`;
    if (/^Page Template/.test(line)) inTemplate = true;
    if (inTemplate) {
      if (/^\[Note for build/.test(line)) inTemplate = false;
      continue;
    }
    if (STRUCTURE.test(line) || /^\[.*\]$/.test(line)) continue;
    line = line.replace(/\s*\[[^\]]*\]/g, "").replace(LABEL, "").replace(/:$/, "").trim();
    if (/^Cards linking to each industry page: /.test(line)) {
      line.replace(/^.*?: /, "").split(" · ").forEach((name) => segments.push({ section, text: name }));
      continue;
    }
    if (/^Not sure where to start\? /.test(line)) {
      line.split(/(?<=\?) /).forEach((text) => segments.push({ section, text }));
      continue;
    }
    segments.push({ section, text: line });
  }
}

const IGNORE = [
  /^Homepage copy for all businesses/,
  /^Cards linking to each industry page/,
  /^Primary CTA$/,
];

const missing = segments.filter(({ text }) => {
  if (IGNORE.some((r) => r.test(text))) return false;
  const t = norm(text).replace(/ →$/, "");
  return !corpus.includes(t);
});

if (missing.length) {
  console.log(`Copy check: ${missing.length} of ${segments.length} segments not found verbatim:`);
  for (const m of missing) console.log(`  [${m.section}] ${m.text}`);
  process.exitCode = 1;
} else {
  console.log(`Copy check: all ${segments.length} segments found verbatim.`);
}
