const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const LABELS = {
  construction_trades: "Construction & trades",
  home_services: "Home services",
  professional_services: "Professional services",
  retail_ecommerce: "Retail & e-commerce",
  healthcare: "Healthcare",
  manufacturing: "Manufacturing",
  technology: "Technology",
  building_supply_distribution: "Building supply & distribution",
  other: "Other",
  under_1m: "Under $1M",
  "1m_5m": "$1M–$5M",
  "5m_20m": "$5M–$20M",
  "20m_plus": "$20M+",
  orchestration: "Private AI orchestration",
  server_setup: "Private AI server setup",
  both: "Both",
  grow_revenue: "Grow revenue",
  improve_profit: "Improve profit",
  win_customers: "Win more customers",
  run_operations: "Run operations smoother",
};
const label = (v) => LABELS[v] || v || "—";

/**
 * Sends through Resend. Without RESEND_API_KEY in development, the message is logged instead,
 * so the confirm and unsubscribe links can be followed locally.
 */
export async function sendEmail(env, cfg, { to, subject, text, html, unsubscribeUrl, replyTo }) {
  const headers = {};
  if (unsubscribeUrl) {
    headers["List-Unsubscribe"] = `<${unsubscribeUrl}>, <mailto:${cfg.contactEmail}?subject=unsubscribe>`;
    headers["List-Unsubscribe-Post"] = "List-Unsubscribe=One-Click";
  }
  if (!env.RESEND_API_KEY) {
    if (cfg.isDev) {
      console.log(`\n--- EMAIL (dev, not sent) ---\nTo: ${to}\nSubject: ${subject}\n${text}\n--- END EMAIL ---\n`);
      return { ok: true, dev: true };
    }
    console.error("RESEND_API_KEY is not set; email not sent:", subject);
    return { ok: false };
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: cfg.emailFrom, to: [to], subject, text, html, headers, reply_to: replyTo || cfg.contactEmail }),
  });
  if (!res.ok) console.error("Resend error", res.status, await res.text());
  return { ok: res.ok };
}

const shell = (bodyHtml, footerHtml) => `<!doctype html><html><body style="margin:0;background:#f4f6fb;font-family:Arial,Helvetica,sans-serif;color:#0b1b33">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:14px;padding:28px">
<tr><td style="font-size:20px;font-weight:bold;padding-bottom:16px">DataDash<span style="color:#2f6bff">OS</span></td></tr>
<tr><td style="font-size:15px;line-height:1.6">${bodyHtml}</td></tr>
<tr><td style="font-size:12px;line-height:1.5;color:#52627a;padding-top:24px;border-top:1px solid #e6eaf2">${footerHtml}</td></tr>
</table></td></tr></table></body></html>`;

const footer = (cfg, unsubscribeUrl, reason) => ({
  html: `${esc(reason)}<br><a href="${esc(unsubscribeUrl)}" style="color:#2f6bff">Unsubscribe</a> · <a href="${esc(cfg.siteUrl)}/privacy.html" style="color:#2f6bff">Privacy Policy</a> · ${esc(cfg.contactEmail)}`,
  text: `${reason}\nUnsubscribe: ${unsubscribeUrl}\nPrivacy Policy: ${cfg.siteUrl}/privacy.html\nContact: ${cfg.contactEmail}`,
});

const button = (href, text) =>
  `<p style="margin:24px 0"><a href="${esc(href)}" style="display:inline-block;background:#2f6bff;color:#ffffff;text-decoration:none;font-weight:bold;padding:12px 22px;border-radius:10px">${esc(text)}</a></p>`;

export function confirmRequestEmail(cfg, lead, confirmUrl, unsubscribeUrl) {
  const what = lead.form_type === "enterprise" ? "DataDashOS Enterprise early access" : "the DataDashOS waitlist";
  const f = footer(cfg, unsubscribeUrl, `You're receiving this because this address was entered on ${cfg.siteHost}.`);
  const hours = cfg.confirmLinkHours;
  return {
    subject: "Confirm your email for DataDashOS early access",
    text: `Hi ${lead.name},\n\nPlease confirm your email to finish signing up for ${what}:\n${confirmUrl}\n\nThis link works once and expires in ${hours} hours. If you didn't sign up, ignore this email and we won't contact you again.\n\n${f.text}`,
    html: shell(
      `<p>Hi ${esc(lead.name)},</p><p>Please confirm your email to finish signing up for ${esc(what)}.</p>${button(confirmUrl, "Confirm my email")}<p style="font-size:13px;color:#52627a">This link works once and expires in ${hours} hours. If you didn't sign up, ignore this email and we won't contact you again.</p>`,
      f.html
    ),
  };
}

export function confirmedEmail(cfg, lead, unsubscribeUrl) {
  const f = footer(cfg, unsubscribeUrl, "You're receiving this because you confirmed your email for DataDashOS early access.");
  const extra =
    lead.form_type === "enterprise" && lead.meeting_requested ? "Thanks — we'll email you to set up a time." : "";
  return {
    subject: "You're confirmed — DataDashOS early access",
    text: `Hi ${lead.name},\n\nYou're confirmed. We'll only use your email to contact you about early access.${extra ? `\n\n${extra}` : ""}\n\n${f.text}`,
    html: shell(
      `<p>Hi ${esc(lead.name)},</p><p><strong>You're confirmed.</strong> We'll only use your email to contact you about early access.</p>${extra ? `<p>${esc(extra)}</p>` : ""}`,
      f.html
    ),
  };
}

export function leadAlertEmail(cfg, lead, { confirmed, unsubscribeUrl }) {
  const rows = [
    ["Form", lead.form_type],
    ["Status", confirmed ? "CONFIRMED (double opt-in)" : "UNCONFIRMED — email not yet verified"],
    ["Name", lead.name],
    ["Email", lead.email],
    ["Email type", lead.email_type],
    ["Company", lead.company],
    ...(lead.form_type === "enterprise" ? [["Job title", lead.job_title]] : []),
    ["Industry", label(lead.industry)],
    ["Employees", lead.employees],
    ...(lead.form_type === "waitlist"
      ? [
          ["Annual revenue", label(lead.revenue)],
          ["Demo: industry", label(lead.demo_industry)],
          ["Demo: employees", lead.demo_employees || "—"],
          ["Demo: goal", label(lead.demo_goal)],
        ]
      : [
          ["Interested in", label(lead.interest)],
          ["Notes", lead.notes || "—"],
          ["Meeting requested", lead.meeting_requested ? "Yes" : "No"],
          ["Preferred days/times", lead.meeting_times || "—"],
        ]),
    ["Mobile", lead.sms_phone || "—"],
    ["SMS consent", lead.sms_consent_at ? `Yes (${lead.sms_consent_at})` : "No"],
    ["Email consent", `${lead.email_consent_at} — "${lead.email_consent_text}"`],
    ["Confirmed at", lead.confirmed_at || "—"],
    ["Page", lead.page_url || "—"],
    ["Submitted", lead.created_at],
    ["Lead ID", lead.id],
  ];
  const tag = confirmed ? "" : "[UNCONFIRMED] ";
  const f = footer(
    cfg,
    unsubscribeUrl,
    "Internal lead alert. The link below unsubscribes this lead (use it to action an opt-out request)."
  );
  return {
    subject: `${tag}New ${lead.form_type} lead: ${lead.name} (${lead.company})`,
    text: `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${f.text}`,
    html: shell(
      `<table role="presentation" cellpadding="6" cellspacing="0" style="width:100%;font-size:14px;border-collapse:collapse">${rows
        .map(
          ([k, v]) =>
            `<tr><td style="color:#52627a;vertical-align:top;border-bottom:1px solid #eef1f6;white-space:nowrap">${esc(k)}</td><td style="border-bottom:1px solid #eef1f6">${esc(v)}</td></tr>`
        )
        .join("")}</table>`,
      f.html
    ),
  };
}
