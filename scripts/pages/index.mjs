import { shot, faqList, faqJsonLd, arrow } from "../lib/components.mjs";
import { waitlistForm } from "../lib/forms.mjs";
import { absUrl } from "../lib/config.mjs";

export const HOME_FAQ = [
  ["What is DataDashOS?", "DataDashOS is a KPI-first operating system for growing businesses. Instead of starting with dashboards, it starts by deciding which numbers define success for your business, then builds a weekly rhythm of review and action around them."],
  ["Who is it for?", "Owner-led and growing businesses that want one shared scorecard and a weekly rhythm for improving it."],
  ["Does it replace my existing software?", "No. It sits on top of your accounting, CRM and marketing tools."],
  ["How is it different from a BI dashboard?", "BI shows data. DataDashOS starts by defining what to measure, then turns the numbers into weekly decisions and owned actions."],
  ["How does the AI coach use my data?", "Its recommendations are grounded in your own KPIs and reviews, so advice stays tied to measurable results."],
  ["Can I use it today?", "We're opening early access in waves. Join the waitlist to get a spot."],
];

export const STEPS = [
  ["Define", "KPIs built for your business", "Tell DataDashOS about your industry, model, goals and stage. It recommends the KPIs a business like yours should run on, with clear definitions, owners and targets. You never start from a blank dashboard."],
  ["Track", "One scorecard for the whole business", "Every KPI, every department, one scorecard. See status, targets and trends at a glance. Connect your tools, import a CSV, or enter values by hand."],
  ["Manage", "Weekly reviews that turn numbers into action", "A weekly AI review explains what changed and why, then recommends what to do. Every recommendation becomes an action with an owner, tracked against the KPI it's meant to move."],
  ["Adapt", "KPIs that grow with you", "Your business changes, and your KPIs should change with it. DataDashOS spots room for improvement, flags what's slipping, and recommends new KPIs as you grow."],
];

const icon = {
  drift: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 7h6v13H4zM14 4h6v16h-6zM10 11h4v9h-4z"/></svg>',
  scattered: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="6" cy="7" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="8" cy="18" r="2.5"/><circle cx="18" cy="17" r="2.5"/></svg>',
  meetings: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 19h16M7 16V9m5 7V5m5 11v-4"/></svg>',
  own: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/></svg>',
  evidence: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 19V5m0 14h16"/><path d="M8 15l3-4 3 2 4-6"/></svg>',
  early: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3a7 7 0 017 7c0 4-3 6-5 8H10c-2-2-5-4-5-8a7 7 0 017-7z"/><path d="M9 21h6"/></svg>',
  repeat: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 12h4l3-7 4 14 3-7h2"/></svg>',
};

export default {
  out: "index.html",
  nav: "home",
  title: "DataDashOS — The KPI-first operating system for your business",
  description: "DataDashOS defines the KPIs your business should run on, tracks them, helps you hit them, and adapts them as you grow.",
  ogTitle: "KPIs first. Everything else follows.",
  scripts: ["assets/js/kpi-blueprints.js", "assets/js/kpi-demo.js", "assets/js/forms.js"],
  styles: ["assets/css/kpi-demo.css"],
  jsonld: [
    {
      "@type": "Organization",
      "@id": absUrl("#organization"),
      name: "DataDashOS",
      url: absUrl(""),
      logo: absUrl("assets/img/favicon.svg"),
    },
    {
      "@type": "WebSite",
      "@id": absUrl("#website"),
      url: absUrl(""),
      name: "DataDashOS",
      publisher: { "@id": absUrl("#organization") },
      inLanguage: "en-US",
    },
    {
      "@type": "SoftwareApplication",
      name: "DataDashOS",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description: "DataDashOS defines the KPIs your business should run on, tracks them, helps you hit them, and adapts them as you grow.",
      url: absUrl(""),
      publisher: { "@id": absUrl("#organization") },
    },
  ],
  body: ({ P }) => `
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero-stage" aria-hidden="true">
        <div class="aurora aurora-a"></div>
        <div class="aurora aurora-b"></div>
        <svg class="orbital" viewBox="0 0 560 560">
          <circle class="ring-a" cx="280" cy="280" r="210" stroke-dasharray="4 10"/>
          <circle class="ring-b" cx="280" cy="280" r="160" stroke-dasharray="2 14"/>
          <circle cx="280" cy="280" r="110" stroke-dasharray="1 18"/>
          <circle class="star" cx="280" cy="70" r="3"/>
          <circle class="star" cx="470" cy="280" r="2.5"/>
          <circle class="star" cx="120" cy="180" r="2"/>
          <circle class="star" cx="400" cy="420" r="2.5"/>
        </svg>
      </div>

      <div class="wrap hero-grid">
        <div class="hero-copy">
          <p class="brand-mark mask-reveal">
            <img class="brand-mark-icon" src="${P}assets/img/illustrations/scorecard-mark.svg" width="48" height="48" alt="">
            DataDash<span>OS</span>
          </p>
          <h1 id="hero-title" class="mask-reveal">KPIs first. <span class="gold-word">Everything else follows.</span></h1>
          <p class="hero-lede">DataDashOS defines the KPIs your business should run on, tracks them, helps you hit them, and adapts them as you grow.</p>
          <p class="hook-line">Hard work without a scorecard is just a hamster wheel.</p>
          <div class="cta-group">
            <a class="btn btn-shimmer" href="#kpi-demo" data-scroll-demo>Build my KPI scorecard ${arrow}</a>
            <a class="btn btn-ghost" href="${P}how-it-works.html">See how it works</a>
          </div>
        </div>

        <div class="hero-visual">
          <div class="product-frame">
            ${shot(P, "kpi-scorecard", { eager: true, caption: "KPI scorecard", sizes: "(max-width: 960px) 100vw, 580px" })}
          </div>
        </div>
      </div>
    </section>

    <section id="problem" aria-labelledby="problem-title">
      <div class="wrap">
        <div class="navy-panel reveal">
          <div class="section-head">
            <p class="eyebrow">The problem</p>
            <h2 id="problem-title">You can't improve what you never defined.</h2>
            <p>Most businesses never sit down and decide which few numbers define success. So everyone works hard, and no one agrees on what winning looks like.</p>
          </div>
          <p class="problem-head">
            <span>Sound familiar?</span>
            <span>What it's costing you</span>
          </p>
          <div class="tile-grid tile-grid-3">
            <article class="tile navy-tile">
              <div class="tile-icon" aria-hidden="true">${icon.drift}</div>
              <h3>Definitions drift</h3>
              <p>Teams disagree on what a lead, a sale or a margin means, so no report is trusted.</p>
            </article>
            <article class="tile navy-tile">
              <div class="tile-icon" aria-hidden="true">${icon.scattered}</div>
              <h3>Data is scattered</h3>
              <p>Accounting, CRM, marketing and spreadsheets each hold part of the truth. Nobody sees the whole scorecard.</p>
            </article>
            <article class="tile navy-tile">
              <div class="tile-icon" aria-hidden="true">${icon.meetings}</div>
              <h3>Insights die in meetings</h3>
              <p>Without owners and follow-through, the same problems come back every week.</p>
            </article>
          </div>
          <p class="panel-note">Another dashboard won't fix that. The wrong metrics, beautifully charted, are still the wrong metrics.</p>
        </div>
      </div>
    </section>

    <section id="idea" aria-labelledby="idea-title">
      <div class="wrap">
        <div class="navy-panel reveal">
          <div class="section-head">
            <p class="eyebrow">The big idea</p>
            <h2 id="idea-title">Define success in numbers before you do anything else.</h2>
            <p>Before you hire, spend on marketing or buy another tool, decide what winning looks like. KPIs turn vision into targets, targets into weekly actions, and actions into results.</p>
          </div>
          <div class="idea-grid">
            <ul class="idea-points">
              <li class="idea-point"><div class="mark" aria-hidden="true">${icon.own}</div><strong>Everyone knows exactly what they own.</strong></li>
              <li class="idea-point"><div class="mark" aria-hidden="true">${icon.evidence}</div><strong>Decisions run on evidence, not opinion.</strong></li>
              <li class="idea-point"><div class="mark" aria-hidden="true">${icon.early}</div><strong>Problems surface early, while they're cheap to fix.</strong></li>
              <li class="idea-point"><div class="mark" aria-hidden="true">${icon.repeat}</div><strong>Growth becomes repeatable, because you know what drives it.</strong></li>
            </ul>
            <figure class="illus-block">
              <img src="${P}assets/img/illustrations/kpi-operating-rhythm.svg" width="1120" height="280" alt="Illustration of the KPI-first sequence: Define, Track, Manage, Adapt" loading="lazy" decoding="async">
            </figure>
          </div>
        </div>
      </div>
    </section>

    <section id="kpi-demo" aria-labelledby="kpi-demo-title" tabindex="-1">
      <div class="wrap">
        <div class="navy-panel reveal">
          <div class="section-head">
            <p class="eyebrow">Try it: Build your sample KPIs</p>
            <h2 id="kpi-demo-title">See your KPIs in 30 seconds.</h2>
            <p>Tell us a little about your business and we'll show you the KPIs a business like yours should run on.</p>
          </div>
          <div class="kpi-demo"
               data-kpi-demo
               data-waitlist="#waitlist"
               data-prefill-industry="#waitlist-industry"
               data-prefill-employees="#waitlist-employees"
               data-prefill-goal="#demo-goal"
               data-prefill-focus="#waitlist-name">
            <noscript><p class="kpi-demo-noscript">Turn on JavaScript to try the KPI demo, or <a href="#waitlist">join the waitlist</a>.</p></noscript>
          </div>
        </div>
      </div>
    </section>

    <div class="divider" aria-hidden="true"></div>

    <section id="how" aria-labelledby="how-title">
      <div class="wrap">
        <div class="navy-panel reveal">
          <div class="section-head">
            <p class="eyebrow">How it works</p>
            <h2 id="how-title"><span class="step-name">Define</span>. <span class="step-name">Track</span>. <span class="step-name">Manage</span>. <span class="step-name">Adapt</span>.</h2>
          </div>
          <div class="timeline">
${STEPS.map(
  ([name, sub, text], i) => `            <div class="step" data-step="0${i + 1}">
              <h3><span class="step-num">${i + 1}.</span> <span class="step-name">${name}</span> — ${sub}</h3>
              <p>${text}</p>
            </div>`
).join("\n")}
          </div>
          <p class="panel-cta"><a class="btn btn-ghost" href="${P}how-it-works.html">See how it works ${arrow}</a></p>
        </div>
      </div>
    </section>

    <section id="inside" aria-labelledby="inside-title">
      <div class="wrap">
        <div class="navy-panel reveal">
          <div class="section-head">
            <h2 id="inside-title">What's Inside</h2>
          </div>
          <table class="module-table">
            <thead>
              <tr><th scope="col">Module</th><th scope="col">What it does</th></tr>
            </thead>
            <tbody>
              <tr><th scope="row">KPI scorecard</th><td>Industry blueprints, targets, trends, notes and forecasts.</td></tr>
              <tr><th scope="row">Dashboards</th><td>Executive, marketing, sales and operations views with period-over-period comparisons.</td></tr>
              <tr><th scope="row">Weekly reviews</th><td>AI-written summaries, recommendations and tracked action items.</td></tr>
              <tr><th scope="row">AI business coach</th><td>Coach chat and decision briefs grounded in your own KPIs, with specialist perspectives from finance to customer experience.</td></tr>
              <tr><th scope="row">Data connections</th><td>Built to connect with QuickBooks Online, GoHighLevel and Google Ads, plus CSV import.</td></tr>
              <tr><th scope="row">Teams &amp; admin</th><td>Workspaces, roles, invitations, audit logs and custom branding.</td></tr>
            </tbody>
          </table>

          <div class="shot-grid">
            ${shot(P, "marketing-dashboard", { caption: "Marketing dashboard", sizes: "(max-width: 960px) 100vw, 360px" })}
            ${shot(P, "sales-dashboard", { caption: "Sales dashboard", sizes: "(max-width: 960px) 100vw, 360px" })}
            ${shot(P, "operations-dashboard", { caption: "Operations dashboard", sizes: "(max-width: 960px) 100vw, 360px" })}
          </div>
          <div class="shot-wide">
            ${shot(P, "executive-dashboard", { caption: "Executive dashboard", sizes: "(max-width: 1200px) 100vw, 1080px" })}
          </div>
        </div>
      </div>
    </section>

    <section id="compare" aria-labelledby="compare-title">
      <div class="wrap">
        <div class="navy-panel reveal">
          <div class="section-head">
            <h2 id="compare-title">Why KPI-First Beats Dashboard-First</h2>
          </div>
          <table class="compare-table">
            <thead>
              <tr><th scope="col">Dashboard-first tools</th><th scope="col">DataDashOS</th></tr>
            </thead>
            <tbody>
              <tr><td>Show whatever data you connect</td><td>Start with what success means for you</td></tr>
              <tr><td>Built for analysts</td><td>Built for owners and leaders</td></tr>
              <tr><td>Leave interpretation to you</td><td>Explain what changed and what to do</td></tr>
              <tr><td>Static metrics</td><td>KPIs that adapt as you grow</td></tr>
              <tr><td>Reports</td><td>A weekly rhythm of review, action and accountability</td></tr>
            </tbody>
          </table>
          <p class="panel-note"><strong>Unify performance, not software.</strong> DataDashOS sits on top of the tools you already run. Nothing to rip out.</p>
        </div>
      </div>
    </section>

    <section id="who" aria-labelledby="who-title">
      <div class="wrap">
        <div class="navy-panel reveal">
          <div class="section-head">
            <h2 id="who-title">Who It's For</h2>
          </div>
          <ul class="who-list">
            <li><strong>Owners and CEOs</strong> who want one clear view of business health and a coach in their corner.</li>
            <li><strong>Leadership teams</strong> who want accountability built on shared numbers.</li>
            <li><strong>Growing businesses</strong> that have outgrown spreadsheets but don't want a BI project.</li>
          </ul>
        </div>
      </div>
    </section>

    <section id="operators" aria-labelledby="operators-title">
      <div class="wrap">
        <div class="navy-panel reveal">
          <h2 id="operators-title">Built by Operators</h2>
          <p class="panel-lede">DataDashOS was built by people who've run a business for decades and lived this problem: plenty of software, plenty of effort, and no shared scorecard. So we built the operating rhythm we wished we'd had.</p>
          <!-- PLACEHOLDER: Add a named founder, photo and one verified result here. -->
        </div>
      </div>
    </section>

    <section id="faq" aria-labelledby="faq-title">
      <div class="wrap">
        <div class="navy-panel reveal">
          <div class="section-head">
            <h2 id="faq-title">FAQ</h2>
          </div>
          ${faqList(HOME_FAQ)}
        </div>
      </div>
    </section>

    <section id="waitlist" aria-labelledby="waitlist-title" tabindex="-1">
      <div class="wrap">
        <div class="cta-band reveal">
          <h2 id="waitlist-title">Know your numbers. Run your business.</h2>
          <p>Join the waitlist and be among the first to run your business KPI-first.</p>
          ${waitlistForm(P)}
        </div>
      </div>
    </section>`,
};
