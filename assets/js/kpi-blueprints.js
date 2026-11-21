/*
 * Read-only KPI blueprint adapter for the homepage "Try it" demo.
 *
 * KPI definitions are copied verbatim from the DataDashOS app's Service Business
 * KPI Pack (Simmitri-Inc/datadashos: src/services/business-os/kpiLibrary.ts) and
 * industry medians (p50) from src/services/business-os/industryBenchmarks.ts.
 * Keep these in sync with the app when those files change.
 *
 * Pure client-side lookup: no storage, no network, no AI.
 */
(() => {
  // Subset of KPIDefinition fields needed by the demo, keyed by slug.
  const KPI_LIBRARY = {
    revenue: {
      name: "Revenue",
      description: "Total revenue generated in the period. This is the top-line measure of business income.",
      unit: "currency", cadence: "weekly", leading: false, direction: "higher_is_better", defaultTarget: null,
    },
    gross_profit: {
      name: "Gross Profit",
      description: "Revenue minus direct costs (COGS). Measures profitability before overhead.",
      unit: "currency", cadence: "weekly", leading: false, direction: "higher_is_better", defaultTarget: null,
    },
    net_profit: {
      name: "Net Profit",
      description: "Total profit after all expenses including overhead, taxes, and interest.",
      unit: "currency", cadence: "monthly", leading: false, direction: "higher_is_better", defaultTarget: null,
    },
    cash_balance: {
      name: "Cash Balance",
      description: "Total cash available in bank accounts. Critical for operational stability.",
      unit: "currency", cadence: "weekly", leading: false, direction: "higher_is_better", defaultTarget: null,
    },
    runway_months: {
      name: "Runway",
      description: "Months of operation possible with current cash reserves at current burn rate.",
      unit: "months", cadence: "monthly", leading: false, direction: "higher_is_better", defaultTarget: 6,
    },
    avg_deal_size: {
      name: "Avg Deal Size",
      description: "Average value of closed deals. Higher values indicate premium positioning or larger clients.",
      unit: "currency", cadence: "monthly", leading: false, direction: "higher_is_better", defaultTarget: null,
    },
    gross_margin_pct: {
      name: "Gross Margin %",
      description: "Percentage of revenue retained after direct costs. Key profitability indicator.",
      unit: "percentage", cadence: "monthly", leading: false, direction: "higher_is_better", defaultTarget: 40,
    },
    contribution_margin_pct: {
      name: "Contribution Margin %",
      description: "Revenue minus variable costs as a percentage. Shows per-unit profitability.",
      unit: "percentage", cadence: "monthly", leading: false, direction: "higher_is_better", defaultTarget: 50,
    },
    revenue_per_labor_hour: {
      name: "Revenue per Labor Hour",
      description: "Revenue generated per hour of labor. Measures team efficiency and pricing power.",
      unit: "currency", cadence: "weekly", leading: false, direction: "higher_is_better", defaultTarget: 100,
    },
    cac: {
      name: "Customer Acquisition Cost",
      description: "Average cost to acquire a new customer. Lower is better for efficiency.",
      unit: "currency", cadence: "monthly", leading: false, direction: "lower_is_better", defaultTarget: 500,
    },
    ar_days: {
      name: "AR Days",
      description: "Average days to collect payment after invoicing. Lower means faster cash collection.",
      unit: "days", cadence: "monthly", leading: true, direction: "lower_is_better", defaultTarget: 30,
    },
    cash_conversion_cycle: {
      name: "Cash Conversion Cycle",
      description: "Days between paying for inputs and receiving cash from customers.",
      unit: "days", cadence: "monthly", leading: true, direction: "lower_is_better", defaultTarget: 45,
    },
    pipeline_coverage: {
      name: "Pipeline Coverage",
      description: "Ratio of pipeline value to revenue target. Higher coverage means more predictable revenue.",
      unit: "ratio", cadence: "weekly", leading: true, direction: "higher_is_better", defaultTarget: 3,
    },
    leads: {
      name: "Leads",
      description: "Number of new qualified leads generated. Leading indicator of future revenue.",
      unit: "count", cadence: "weekly", leading: true, direction: "higher_is_better", defaultTarget: 20,
    },
    lead_to_appointment_pct: {
      name: "Lead → Appointment %",
      description: "Percentage of leads that convert to sales appointments. Measures lead quality and follow-up.",
      unit: "percentage", cadence: "weekly", leading: true, direction: "higher_is_better", defaultTarget: 40,
    },
    appointment_to_close_pct: {
      name: "Appointment → Close %",
      description: "Percentage of appointments that result in closed deals. Measures sales effectiveness.",
      unit: "percentage", cadence: "weekly", leading: true, direction: "higher_is_better", defaultTarget: 30,
    },
    close_rate_pct: {
      name: "Close Rate %",
      description: "Overall percentage of leads that become customers. End-to-end sales efficiency.",
      unit: "percentage", cadence: "monthly", leading: false, direction: "higher_is_better", defaultTarget: 15,
    },
    jobs_delivered: {
      name: "Jobs Delivered",
      description: "Number of projects or jobs completed in the period. Measures operational throughput.",
      unit: "count", cadence: "weekly", leading: false, direction: "higher_is_better", defaultTarget: 5,
    },
    on_time_delivery_pct: {
      name: "On-Time Delivery %",
      description: "Percentage of jobs delivered on or before deadline. Critical for client satisfaction.",
      unit: "percentage", cadence: "weekly", leading: false, direction: "higher_is_better", defaultTarget: 95,
    },
    rework_rate_pct: {
      name: "Rework Rate %",
      description: "Percentage of work requiring corrections. Lower is better for efficiency.",
      unit: "percentage", cadence: "monthly", leading: false, direction: "lower_is_better", defaultTarget: 5,
    },
    utilization_pct: {
      name: "Utilization %",
      description: "Percentage of available hours that are billable. Measures team productivity.",
      unit: "percentage", cadence: "weekly", leading: true, direction: "higher_is_better", defaultTarget: 75,
    },
  };

  // Median (p50) values from INDUSTRY_BENCHMARKS for KPIs that share a slug.
  const INDUSTRY_MEDIANS = {
    construction: { gross_margin_pct: 25, close_rate_pct: 25, ar_days: 42 },
    home_services: { gross_margin_pct: 40, close_rate_pct: 38, ar_days: 25 },
    professional_services: { gross_margin_pct: 45, utilization_pct: 65, close_rate_pct: 28, ar_days: 45 },
    healthcare: { gross_margin_pct: 50, close_rate_pct: 45, ar_days: 42 },
    technology: { gross_margin_pct: 68, close_rate_pct: 18, ar_days: 38, runway_months: 12 },
    other: { gross_margin_pct: 45, close_rate_pct: 28, ar_days: 38 },
  };

  // Homepage industry options → app industry keys. `null` = no blueprint in the app.
  const INDUSTRIES = {
    construction_trades: { label: "Construction & trades", appKey: "construction" },
    home_services: { label: "Home services", appKey: "home_services" },
    professional_services: { label: "Professional services", appKey: "professional_services" },
    retail_ecommerce: { label: "Retail & e-commerce", appKey: null },
    healthcare: { label: "Healthcare", appKey: "healthcare" },
    manufacturing: { label: "Manufacturing", appKey: null },
    technology: { label: "Technology", appKey: "technology" },
    other: { label: "Other", appKey: "other" },
  };

  const EMPLOYEE_RANGES = {
    "1-10": { label: "1–10", count: 5, anchors: ["cash_balance", "runway_months"] },
    "11-50": { label: "11–50", count: 6, anchors: ["ar_days", "cash_balance"] },
    "51-200": { label: "51–200", count: 6, anchors: ["utilization_pct", "contribution_margin_pct"] },
    "201-500": { label: "201–500", count: 6, anchors: ["contribution_margin_pct", "pipeline_coverage"] },
    "500+": { label: "500+", count: 6, anchors: ["contribution_margin_pct", "net_profit"] },
  };

  const GOALS = {
    grow_revenue: {
      label: "Grow revenue",
      priority: ["revenue", "leads", "pipeline_coverage", "close_rate_pct", "avg_deal_size", "gross_margin_pct"],
    },
    improve_profit: {
      label: "Improve profit",
      priority: ["gross_margin_pct", "net_profit", "contribution_margin_pct", "revenue_per_labor_hour", "cac", "ar_days"],
    },
    win_customers: {
      label: "Win more customers",
      priority: ["leads", "lead_to_appointment_pct", "appointment_to_close_pct", "close_rate_pct", "cac", "avg_deal_size"],
    },
    run_operations: {
      label: "Run operations smoother",
      priority: ["on_time_delivery_pct", "jobs_delivered", "utilization_pct", "rework_rate_pct", "cash_conversion_cycle", "ar_days"],
    },
  };

  // Which KPIs from the pack each app industry leans on, and which don't fit it.
  const INDUSTRY_FOCUS = {
    construction: {
      focus: ["gross_margin_pct", "jobs_delivered", "on_time_delivery_pct", "ar_days", "rework_rate_pct"],
      exclude: [],
    },
    home_services: {
      focus: ["lead_to_appointment_pct", "appointment_to_close_pct", "jobs_delivered", "gross_margin_pct", "rework_rate_pct"],
      exclude: ["pipeline_coverage"],
    },
    professional_services: {
      focus: ["utilization_pct", "revenue_per_labor_hour", "ar_days", "gross_margin_pct", "pipeline_coverage"],
      exclude: ["jobs_delivered"],
    },
    healthcare: {
      focus: ["ar_days", "utilization_pct", "gross_margin_pct", "close_rate_pct"],
      exclude: ["jobs_delivered", "pipeline_coverage", "rework_rate_pct"],
    },
    technology: {
      focus: ["gross_margin_pct", "pipeline_coverage", "cac", "runway_months", "close_rate_pct"],
      exclude: ["jobs_delivered", "rework_rate_pct", "revenue_per_labor_hour"],
    },
  };

  // General small-business set for industries without an app blueprint (and "Other").
  const GENERAL_FOCUS = {
    focus: ["revenue", "gross_margin_pct", "net_profit", "cash_balance", "cac", "cash_conversion_cycle"],
    exclude: ["utilization_pct", "revenue_per_labor_hour", "lead_to_appointment_pct", "appointment_to_close_pct", "pipeline_coverage", "jobs_delivered"],
  };

  // Currency/count defaults in the app are placeholders that the onboarding profile
  // replaces, so they are not meaningful as a sample target for an unknown business.
  const SCALE_DEPENDENT_UNITS = ["currency", "count"];

  const formatTarget = (kpi, value) => {
    const op = kpi.direction === "lower_is_better" ? "≤" : "≥";
    switch (kpi.unit) {
      case "percentage": return `${op} ${value}%`;
      case "days": return `${op} ${value} days`;
      case "months": return `${op} ${value} months`;
      case "ratio": return `${op} ${value}×`;
      default: return null;
    }
  };

  const firstSentence = (text) => {
    const match = text.match(/^.*?[.!?](\s|$)/);
    return (match ? match[0] : text).trim();
  };

  const toCard = (slug, appKey) => {
    const kpi = KPI_LIBRARY[slug];
    const median = appKey && INDUSTRY_MEDIANS[appKey] ? INDUSTRY_MEDIANS[appKey][slug] : undefined;
    let target = null;
    let targetSource = null;
    if (median !== undefined) {
      target = formatTarget(kpi, median);
      targetSource = "industry median";
    } else if (kpi.defaultTarget !== null && !SCALE_DEPENDENT_UNITS.includes(kpi.unit)) {
      target = formatTarget(kpi, kpi.defaultTarget);
      targetSource = "blueprint default";
    }
    return {
      slug,
      name: kpi.name,
      definition: firstSentence(kpi.description),
      target,
      targetSource,
      cadence: kpi.cadence,
      leading: kpi.leading,
    };
  };

  /**
   * Map (industry, employee range, top goal) to 5–6 sample KPIs.
   * The goal decides the first three; industry focus and team size fill the rest.
   */
  const getSampleKpis = (industryId, employeesId, goalId) => {
    const industry = INDUSTRIES[industryId];
    const size = EMPLOYEE_RANGES[employeesId];
    const goal = GOALS[goalId];
    if (!industry || !size || !goal) return null;

    const appKey = industry.appKey;
    const hasBlueprint = Boolean(appKey && INDUSTRY_FOCUS[appKey]);
    const profile = hasBlueprint ? INDUSTRY_FOCUS[appKey] : GENERAL_FOCUS;
    const allowed = (slug) => KPI_LIBRARY[slug] && !profile.exclude.includes(slug);

    const picked = [];
    const add = (slug) => {
      if (picked.length < size.count && allowed(slug) && !picked.includes(slug)) picked.push(slug);
    };

    const goalList = goal.priority.filter(allowed);
    goalList.slice(0, 3).forEach(add);

    const anchor = size.anchors.find((slug) => allowed(slug) && !picked.includes(slug));
    for (const slug of profile.focus) {
      if (picked.length >= size.count - (anchor ? 1 : 0)) break;
      add(slug);
    }
    if (anchor) add(anchor);

    goalList.forEach(add);
    Object.keys(KPI_LIBRARY).forEach(add);

    return {
      industryLabel: industry.label,
      employeesLabel: size.label,
      goalLabel: goal.label,
      hasBlueprint,
      benchmarkKey: appKey && INDUSTRY_MEDIANS[appKey] ? appKey : null,
      kpis: picked.map((slug) => toCard(slug, appKey)),
    };
  };

  window.DataDashKpiBlueprints = Object.freeze({
    INDUSTRIES,
    EMPLOYEE_RANGES,
    GOALS,
    getSampleKpis,
  });
})();
