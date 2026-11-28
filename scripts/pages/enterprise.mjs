import { arrow, faqList, faqJsonLd } from "../lib/components.mjs";
import { enterpriseForm } from "../lib/forms.mjs";
import { dataFlowDiagram } from "../lib/data-flow-diagram.mjs";

const SECURITY_FAQ = [
  ["Where does my data live?", "On your own servers or private cloud. DataDashOS's KPI layer only sees structured KPI data, never your raw records."],
  ["Who can see it?", "Only the people you authorize. Role-based access controls who sees which KPIs, and every action is logged."],
  ["Can we use our own AI model?", "Yes. Connect AI models running on your own servers, outside models, or both."],
  ["Do outside AI providers see our data?", "Only the KPI summaries you choose to send. No customer details, financials or raw files."],
  ["What happens if we leave?", "Your data never left your environment, so there's nothing to extract. Your KPI definitions and history can be exported."],
];

const pillars = [
  ["Your AI, on your servers", "Your own AI agents connect to your CRM, ERP, finance and operations systems inside your environment. Raw data never has to leave it.", '<rect x="4" y="4" width="16" height="6" rx="1.5"/><rect x="4" y="14" width="16" height="6" rx="1.5"/><path d="M8 7h.01M8 17h.01"/>'],
  ["Outside AI, without sharing your data", "Want the power of leading AI models? DataDashOS sends them only structured KPI summaries, never raw records, customer details or account data.", '<path d="M4 12h10M10 6l6 6-6 6"/><path d="M20 4v16"/>'],
  ["One KPI layer over everything", "Every agent, internal or external, reports into the same KPI definitions, owners and targets. So all your AI is measured against what actually matters.", '<path d="M3 7l9-4 9 4-9 4z"/><path d="M3 12l9 4 9-4M3 17l9 4 9-4"/>'],
  ["Governance built in", "Role-based access, human approval for key decisions, escalation paths and permanent audit logs. You always know what your AI did and why.", '<path d="M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6z"/><path d="M9 12l2 2 4-4"/>'],
];

export const earlyAccessBadge = '<span class="badge-early">Early access</span>';

export default {
  out: "enterprise.html",
  nav: "enterprise",
  title: "DataDashOS Enterprise — Private AI, governed by your KPIs",
  description: "Run AI on your own servers, use outside AI models without sharing your data, and govern it all through one KPI-first layer. Request early access.",
  scripts: ["assets/js/forms.js"],
  jsonld: [faqJsonLd(SECURITY_FAQ)],
  breadcrumbs: [
    { name: "Home", path: "" },
    { name: "Enterprise", path: "enterprise.html" },
  ],
  body: ({ P }) => `
    <section class="hero page-hero-section" aria-labelledby="ent-hero-title">
      <div class="wrap mid">
        <p class="eyebrow">Enterprise · Early access</p>
        <p>${earlyAccessBadge}</p>
        <h1 id="ent-hero-title" class="page-title">Your data stays yours. Your AI answers to your KPIs.</h1>
        <p class="hero-lede">DataDashOS Enterprise is a private orchestration layer that connects to AI running on your own servers, and to outside AI models without handing them your data.</p>
        <div class="cta-group">
          <a class="btn" href="#early-access">Request early access ${arrow}</a>
        </div>
      </div>
    </section>

    <section aria-labelledby="ent-problem-title">
      <div class="wrap mid">
        <div class="navy-panel reveal">
          <div class="section-head">
            <p class="eyebrow">The enterprise problem</p>
            <h2 id="ent-problem-title">More AI. Less control.</h2>
            <p>AI tools are multiplying across every department. But most send your data to someone else's servers, work outside your definitions of success, and leave no clear record of what they did. For regulated or privacy-conscious companies, that's a deal-breaker.</p>
          </div>
        </div>
      </div>
    </section>

    <section aria-labelledby="ent-how-title">
      <div class="wrap">
        <div class="navy-panel reveal">
          <div class="section-head">
            <h2 id="ent-how-title">How It Works</h2>
            <p>${earlyAccessBadge}</p>
          </div>
          <div class="tile-grid">
${pillars
  .map(
    ([h, p, icon]) => `            <article class="tile navy-tile">
              <div class="tile-icon" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">${icon}</svg></div>
              <h3>${h}</h3>
              <p>${p}</p>
            </article>`
  )
  .join("\n")}
          </div>
        </div>
      </div>
    </section>

    <section id="data-flow" aria-labelledby="ent-flow-title">
      <div class="wrap">
        <div class="navy-panel reveal">
          <div class="section-head">
            <p class="eyebrow">Where Your Data Goes</p>
            <h2 id="ent-flow-title">See exactly what stays and what moves.</h2>
          </div>
          ${dataFlowDiagram()}
          <div class="table-scroll">
            <table class="compare-table data-table">
              <thead>
                <tr><th scope="col">Stays in your environment</th><th scope="col">Can be shared with outside AI (your choice)</th></tr>
              </thead>
              <tbody>
                <tr><td>Customer records and contact details</td><td>KPI summaries (for example, "close rate: 31%")</td></tr>
                <tr><td>Financial and bank data</td><td>Rounded totals and trends</td></tr>
                <tr><td>Employee and payroll data</td><td>Anonymised performance patterns</td></tr>
                <tr><td>Raw files, emails and documents</td><td>Nothing else</td></tr>
              </tbody>
            </table>
          </div>
          <p class="panel-note">You decide what's shared, and you can turn outside AI off entirely.</p>
        </div>
      </div>
    </section>

    <section aria-labelledby="ent-server-title">
      <div class="wrap">
        <div class="step-block navy-panel reveal step-block-text">
          <div>
            <p class="eyebrow">Private AI Server Setup</p>
            <h2 id="ent-server-title">Don't have the infrastructure? We'll build it.</h2>
            <p class="step-intro">Our team can set up a dedicated server for your business so you can run AI locally, on hardware you own and control. We handle the setup, connect it to DataDashOS, and get your KPIs running.</p>
            <ul class="check-list">
              <li>Server setup and configuration</li>
              <li>Local AI models installed and ready</li>
              <li>Connected securely to DataDashOS</li>
              <li>Your data stays on your hardware</li>
            </ul>
            <p class="panel-note">Pricing and scope: by consultation</p>
          </div>
        </div>
      </div>
    </section>

    <section aria-labelledby="ent-who-title">
      <div class="wrap mid">
        <div class="navy-panel reveal">
          <div class="section-head">
            <h2 id="ent-who-title">Who It's For</h2>
          </div>
          <ul class="who-list">
            <li>Enterprises with strict data-privacy or security requirements</li>
            <li>Regulated industries: finance, healthcare, insurance, logistics, manufacturing</li>
            <li>Multi-company groups and portfolio operators who need one view across entities</li>
          </ul>
        </div>
      </div>
    </section>

    <section aria-labelledby="ent-faq-title">
      <div class="wrap mid">
        <div class="navy-panel reveal">
          <div class="section-head">
            <h2 id="ent-faq-title">Security FAQ</h2>
          </div>
          ${faqList(SECURITY_FAQ)}
        </div>
      </div>
    </section>

    <section aria-labelledby="ent-benefits-title">
      <div class="wrap mid">
        <div class="navy-panel reveal">
          <div class="section-head">
            <h2 id="ent-benefits-title">Early-Partner Benefits</h2>
          </div>
          <ul class="belief-list">
            <li><strong>Priority setup:</strong> first in line for onboarding and server builds</li>
            <li><strong>Shape the product:</strong> direct input on the roadmap</li>
            <li><strong>Early-partner terms:</strong> locked-in pricing for early partners</li>
            <li><strong>Direct access:</strong> a dedicated line to the founding team</li>
          </ul>
        </div>
      </div>
    </section>

    <section id="early-access" class="section-last" aria-labelledby="ent-form-title" tabindex="-1">
      <div class="wrap">
        <div class="cta-band reveal">
          <p>${earlyAccessBadge}</p>
          <h2 id="ent-form-title">We're building DataDashOS Enterprise with a small group of early partners.</h2>
          <p>Join early access to shape the product, get priority onboarding and lock in early-partner terms.</p>
          ${enterpriseForm(P)}
        </div>
      </div>
    </section>`,
};
