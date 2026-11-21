import { esc } from "./layout.mjs";

// Illustrations for the KPI Library. They are drawn, not captured, and deliberately show no numbers:
// trends and status only, so nothing reads as a real result.

const STATUS = {
  on: { label: "On target", cls: "st-on" },
  watch: { label: "Watch", cls: "st-watch" },
  off: { label: "Off target", cls: "st-off" },
};
const PATTERN = ["on", "watch", "on", "off", "on", "watch"];

function seeded(seed) {
  let s = seed >>> 0 || 1;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function hash(str) {
  let h = 2166136261;
  for (const ch of str) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return h >>> 0;
}

/** Small trend line: up for "on", flat for "watch", down for "off". */
export function sparkline(key, trend = "on", { w = 72, h = 24 } = {}) {
  const rand = seeded(hash(key));
  const slope = trend === "on" ? -0.55 : trend === "off" ? 0.55 : 0;
  const n = 8;
  const pts = [];
  for (let i = 0; i < n; i++) {
    const base = h / 2 + slope * (i - (n - 1) / 2) * (h / n);
    const y = Math.max(3, Math.min(h - 3, base + (rand() - 0.5) * (h * 0.35)));
    pts.push(`${((i * (w - 4)) / (n - 1) + 2).toFixed(1)},${y.toFixed(1)}`);
  }
  return `<svg class="spark spark-${trend}" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" aria-hidden="true" focusable="false"><polyline points="${pts.join(" ")}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

export function sampleScorecard(ind, offset = 0) {
  const rows = ind.kpis
    .map(([kpi], i) => {
      const st = PATTERN[(i + offset) % PATTERN.length];
      return `            <li class="sc-row">
              <span class="sc-name">${esc(kpi)}</span>
              ${sparkline(ind.slug + kpi, st)}
              <span class="sc-status ${STATUS[st].cls}">${STATUS[st].label}</span>
            </li>`;
    })
    .join("\n");
  return `<figure class="sc-figure">
          <div class="sc-card">
            <div class="sc-head">
              <span class="sc-title">${esc(ind.name)} scorecard</span>
              <span class="sample-badge">Sample data</span>
            </div>
            <ul class="sc-rows" aria-label="Sample ${esc(ind.name.toLowerCase())} KPIs and their status">
${rows}
            </ul>
          </div>
          <figcaption class="caption-sample">Illustration · Sample data</figcaption>
        </figure>`;
}

export function guessingVsMeasured(ind) {
  const guess = ind.scenarioKpis
    .map(
      (k) => `              <li><span class="ba-name">${esc(k)}</span><span class="ba-unknown" aria-label="unknown">?</span></li>`
    )
    .join("\n");
  const measured = ind.scenarioKpis
    .map(
      (k) =>
        `              <li><span class="ba-name">${esc(k)}</span>${sparkline("m" + ind.slug + k, "on", { w: 64, h: 22 })}<span class="sc-status st-on">Tracked</span></li>`
    )
    .join("\n");
  return `<figure class="ba-figure">
          <div class="ba-grid">
            <div class="ba-panel ba-before">
              <p class="ba-label">Guessing</p>
              <ul>
${guess}
              </ul>
            </div>
            <div class="ba-arrow" aria-hidden="true">→</div>
            <div class="ba-panel ba-after">
              <p class="ba-label">Measured</p>
              <ul>
${measured}
              </ul>
            </div>
          </div>
          <figcaption class="caption-sample">Illustration · Example scenario</figcaption>
        </figure>`;
}

const C = {
  text: "#ffffff",
  muted: "rgba(232,238,248,0.72)",
  panel: "rgba(255,255,255,0.05)",
  green: "#1d9270",
  blue: "#5b8cff",
  gold: "#e0c078",
};

const t = (x, y, s, { size = 15, weight = 700, fill = C.text } = {}) =>
  `<text x="${x}" y="${y}" text-anchor="middle" font-size="${size}" font-weight="${weight}" fill="${fill}">${esc(s)}</text>`;
const rect = (x, y, w, h, stroke, dash = "") =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="${C.panel}" stroke="${stroke}" stroke-width="1.6"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
const line = (x1, y1, x2, y2, color, marker) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="2" marker-end="url(#${marker})"/>`;
const marker = (id, color) =>
  `<marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="${color}"/></marker>`;

const ROLLUP_TITLE = "Portfolio roll-up: each company keeps a private dashboard; shared KPI definitions feed one group scorecard";
const ROLLUP_DESC =
  "Company A, Company B and Company C each keep their own software and a private dashboard. All three use the same shared KPI definitions, which roll up into one group scorecard, an authorised shared view for leadership.";

export function rollupDiagram() {
  const companies = ["Company A", "Company B", "Company C"];
  const stacked = `<svg class="rollup-diagram" viewBox="0 0 400 520" role="img" aria-labelledby="ru-s-t ru-s-d" font-family="Manrope, system-ui, sans-serif">
            <title id="ru-s-t">${esc(ROLLUP_TITLE)}</title>
            <desc id="ru-s-d">${esc(ROLLUP_DESC)}</desc>
            <defs>${marker("ru-s-g", C.green)}${marker("ru-s-b", C.blue)}</defs>
${companies
  .map((c, i) => {
    const x = 10 + i * 130;
    return `            ${rect(x, 10, 120, 110, C.green)}
            ${t(x + 60, 56, c, { size: 16 })}
            ${t(x + 60, 80, "Private", { size: 13, weight: 600, fill: C.muted })}
            ${t(x + 60, 98, "dashboard", { size: 13, weight: 600, fill: C.muted })}
            ${line(x + 60, 122, 140 + i * 60, 196, C.green, "ru-s-g")}`;
  })
  .join("\n")}
            ${rect(70, 200, 260, 110, C.blue)}
            ${t(200, 250, "Shared KPI", { size: 18 })}
            ${t(200, 274, "definitions", { size: 18 })}
            ${line(200, 312, 200, 372, C.blue, "ru-s-b")}
            ${rect(50, 376, 300, 130, C.gold)}
            ${t(200, 432, "Group scorecard", { size: 20 })}
            ${t(200, 460, "Authorised shared view", { size: 14, weight: 600, fill: C.muted })}
          </svg>`;
  return `<figure class="rollup-figure">
          ${stacked}
          <figcaption class="caption-sample">Illustration · Example scenario</figcaption>
        </figure>`;
}
