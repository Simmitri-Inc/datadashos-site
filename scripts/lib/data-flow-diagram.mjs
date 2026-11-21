// "Where Your Data Goes" diagram: Your environment → DataDashOS KPI layer → Outside AI models (optional).
// Two inline SVG layouts (wide and stacked) share one accessible description; CSS shows one per breakpoint.

const C = {
  navy: "#0b1b33",
  panel: "#13284a",
  line: "rgba(255,255,255,0.18)",
  text: "#ffffff",
  muted: "#c9d4e5",
  blue: "#3d8bff",
  green: "#1d9270",
  gold: "#e0c078",
};

const title = "Where your data goes";
const desc =
  "Diagram, left to right. Your environment: your systems (CRM, ERP, finance, operations) connect to your own AI agents on your servers. " +
  "Arrow to the DataDashOS KPI layer: definitions, targets, governance and audit log. " +
  "Arrow labelled 'KPI summaries only' to outside AI models, which are optional. Raw data never crosses that line.";

const defs = (id) => `
    <defs>
      <marker id="${id}-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0 0L10 5L0 10z" fill="${C.muted}"/>
      </marker>
      <marker id="${id}-arrow-gold" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0 0L10 5L0 10z" fill="${C.gold}"/>
      </marker>
    </defs>`;

const box = (x, y, w, h, { stroke = C.line, dash = "", fill = C.panel } = {}) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="${fill}" stroke="${stroke}" stroke-width="1.5"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;

const chip = (x, y, w, label, color) =>
  `<g><rect x="${x}" y="${y}" width="${w}" height="34" rx="10" fill="rgba(255,255,255,0.06)" stroke="${color}" stroke-opacity="0.55"/><text x="${x + w / 2}" y="${y + 22}" text-anchor="middle" font-size="14" fill="${C.text}">${label}</text></g>`;

const heading = (x, y, label, color, size = 18) =>
  `<text x="${x}" y="${y}" text-anchor="middle" font-size="${size}" font-weight="800" fill="${color}">${label}</text>`;

const sub = (x, y, label) => `<text x="${x}" y="${y}" text-anchor="middle" font-size="13" fill="${C.muted}">${label}</text>`;

function wide() {
  const id = "dfw";
  return `<svg class="flow-diagram flow-wide" viewBox="0 0 1120 420" role="img" aria-labelledby="${id}-t ${id}-d" xmlns="http://www.w3.org/2000/svg" font-family="Manrope, 'Segoe UI', sans-serif">
    <title id="${id}-t">${title}</title>
    <desc id="${id}-d">${desc}</desc>${defs(id)}
    <!-- Your environment -->
    ${box(20, 40, 400, 340, { stroke: C.green })}
    ${heading(220, 78, "Your environment", C.text, 20)}
    <rect x="50" y="122" width="340" height="96" rx="14" fill="rgba(29,146,112,0.12)" stroke="${C.green}" stroke-opacity="0.6"/>
    ${heading(220, 146, "Your systems", C.text, 15)}
    ${chip(62, 164, 74, "CRM", C.green)}${chip(144, 164, 74, "ERP", C.green)}${chip(226, 164, 74, "Finance", C.green)}${chip(308, 164, 72, "Ops", C.green)}
    <line x1="220" y1="220" x2="220" y2="262" stroke="${C.muted}" stroke-width="2" marker-end="url(#${id}-arrow)"/>
    <rect x="50" y="268" width="340" height="86" rx="14" fill="rgba(29,146,112,0.12)" stroke="${C.green}" stroke-opacity="0.6"/>
    ${heading(220, 304, "Your own AI agents", C.text, 15)}
    ${sub(220, 326, "on your servers")}

    <!-- Arrow to KPI layer -->
    <line x1="424" y1="210" x2="486" y2="210" stroke="${C.muted}" stroke-width="2.5" marker-end="url(#${id}-arrow)"/>

    <!-- KPI layer -->
    ${box(492, 108, 300, 204, { stroke: C.blue })}
    ${heading(642, 150, "DataDashOS", C.text, 20)}
    ${heading(642, 174, "KPI layer", C.blue, 17)}
    ${chip(522, 196, 116, "Definitions", C.blue)}${chip(646, 196, 116, "Targets", C.blue)}
    ${chip(522, 240, 116, "Governance", C.blue)}${chip(646, 240, 116, "Audit log", C.blue)}

    <!-- Boundary + labelled arrow -->
    <line x1="840" y1="40" x2="840" y2="380" stroke="${C.gold}" stroke-width="1.5" stroke-dasharray="6 6" stroke-opacity="0.7"/>
    <line x1="796" y1="210" x2="884" y2="210" stroke="${C.gold}" stroke-width="2.5" marker-end="url(#${id}-arrow-gold)"/>
    <rect x="770" y="236" width="140" height="30" rx="15" fill="${C.navy}" stroke="${C.gold}" stroke-opacity="0.8"/>
    <text x="840" y="256" text-anchor="middle" font-size="13" font-weight="800" fill="${C.gold}">KPI summaries only</text>

    <!-- Outside AI -->
    ${box(890, 110, 210, 200, { dash: "8 7", stroke: C.muted, fill: "rgba(255,255,255,0.03)" })}
    ${heading(995, 196, "Outside AI", C.text, 18)}
    ${heading(995, 220, "models", C.text, 18)}
    ${sub(995, 246, "(optional)")}
  </svg>`;
}

function stacked() {
  const id = "dfs";
  return `<svg class="flow-diagram flow-stacked" viewBox="0 0 400 860" role="img" aria-labelledby="${id}-t ${id}-d" xmlns="http://www.w3.org/2000/svg" font-family="Manrope, 'Segoe UI', sans-serif">
    <title id="${id}-t">${title}</title>
    <desc id="${id}-d">${desc}</desc>${defs(id)}
    ${box(10, 10, 380, 330, { stroke: C.green })}
    ${heading(200, 46, "Your environment", C.text, 20)}
    <rect x="30" y="86" width="340" height="96" rx="14" fill="rgba(29,146,112,0.12)" stroke="${C.green}" stroke-opacity="0.6"/>
    ${heading(200, 110, "Your systems", C.text, 15)}
    ${chip(42, 128, 74, "CRM", C.green)}${chip(124, 128, 74, "ERP", C.green)}${chip(206, 128, 74, "Finance", C.green)}${chip(288, 128, 72, "Ops", C.green)}
    <line x1="200" y1="184" x2="200" y2="222" stroke="${C.muted}" stroke-width="2" marker-end="url(#${id}-arrow)"/>
    <rect x="30" y="228" width="340" height="86" rx="14" fill="rgba(29,146,112,0.12)" stroke="${C.green}" stroke-opacity="0.6"/>
    ${heading(200, 264, "Your own AI agents", C.text, 15)}
    ${sub(200, 286, "on your servers")}

    <line x1="200" y1="344" x2="200" y2="390" stroke="${C.muted}" stroke-width="2.5" marker-end="url(#${id}-arrow)"/>

    ${box(30, 396, 340, 196, { stroke: C.blue })}
    ${heading(200, 436, "DataDashOS", C.text, 20)}
    ${heading(200, 460, "KPI layer", C.blue, 17)}
    ${chip(50, 484, 146, "Definitions", C.blue)}${chip(204, 484, 146, "Targets", C.blue)}
    ${chip(50, 528, 146, "Governance", C.blue)}${chip(204, 528, 146, "Audit log", C.blue)}

    <line x1="10" y1="640" x2="390" y2="640" stroke="${C.gold}" stroke-width="1.5" stroke-dasharray="6 6" stroke-opacity="0.7"/>
    <line x1="200" y1="596" x2="200" y2="684" stroke="${C.gold}" stroke-width="2.5" marker-end="url(#${id}-arrow-gold)"/>
    <rect x="216" y="625" width="148" height="30" rx="15" fill="${C.navy}" stroke="${C.gold}" stroke-opacity="0.8"/>
    <text x="290" y="645" text-anchor="middle" font-size="13" font-weight="800" fill="${C.gold}">KPI summaries only</text>

    ${box(70, 690, 260, 160, { dash: "8 7", stroke: C.muted, fill: "rgba(255,255,255,0.03)" })}
    ${heading(200, 760, "Outside AI models", C.text, 18)}
    ${sub(200, 786, "(optional)")}
  </svg>`;
}

export const dataFlowDiagram = () => `<figure class="flow-figure">
            ${wide()}
            ${stacked()}
          </figure>`;
