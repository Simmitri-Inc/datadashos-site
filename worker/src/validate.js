export const INDUSTRIES = [
  "construction_trades",
  "home_services",
  "professional_services",
  "retail_ecommerce",
  "healthcare",
  "manufacturing",
  "technology",
  "other",
];
export const EMPLOYEES = ["1-10", "11-50", "51-200", "201-500", "500+"];
export const REVENUES = ["under_1m", "1m_5m", "5m_20m", "20m_plus"];
export const INTERESTS = ["orchestration", "server_setup", "both"];
// Must match GOALS in assets/js/kpi-blueprints.js.
export const DEMO_GOALS = ["grow_revenue", "improve_profit", "win_customers", "run_operations"];

const PERSONAL_DOMAINS = new Set([
  "gmail.com", "googlemail.com",
  "yahoo.com", "yahoo.co.uk", "yahoo.ca", "yahoo.com.au", "ymail.com", "rocketmail.com",
  "outlook.com", "hotmail.com", "hotmail.co.uk", "live.com", "msn.com", "passport.com",
  "icloud.com", "me.com", "mac.com",
  "aol.com", "proton.me", "protonmail.com", "pm.me",
  "gmx.com", "gmx.net", "gmx.de", "mail.com", "zohomail.com", "yandex.com", "yandex.ru",
  "hey.com", "fastmail.com", "tutanota.com", "tuta.io",
  "comcast.net", "verizon.net", "att.net", "sbcglobal.net", "cox.net", "charter.net", "bellsouth.net",
]);

export function emailType(email) {
  const domain = String(email).split("@").pop().toLowerCase();
  return PERSONAL_DOMAINS.has(domain) ? "personal" : "work";
}

const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[a-z]{2,}$/i;

/** Normalises to E.164. Bare 10-digit numbers are treated as US/Canada (+1). Returns null if invalid. */
export function normalisePhone(raw) {
  const s = String(raw || "").trim();
  if (!s) return "";
  if (!/^[+\d\s().-]+$/.test(s)) return null;
  const digits = s.replace(/\D/g, "");
  if (s.startsWith("+")) return digits.length >= 8 && digits.length <= 15 ? `+${digits}` : null;
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return null;
}

const str = (v, max) => {
  if (v === undefined || v === null) return "";
  const s = String(v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim();
  return s.length > max ? null : s;
};
const yes = (v) => v === true || v === "yes" || v === "on" || v === "true";

/**
 * Server-side validation. Mirrors the browser checks; the server is the one that counts.
 * Returns { data } or { errors: { field: message } }.
 */
export function validateLead(body) {
  const errors = {};
  const formType = body.form_type;
  if (formType !== "waitlist" && formType !== "enterprise") return { errors: { form_type: "Unknown form." } };

  const take = (field, max, { required = false, list = null, message } = {}) => {
    const v = str(body[field], max);
    if (v === null) errors[field] = "Too long.";
    else if (required && !v) errors[field] = message || "Required.";
    else if (v && list && !list.includes(v)) errors[field] = "Choose an option from the list.";
    return v || "";
  };

  const data = {
    form_type: formType,
    name: take("name", 120, { required: true, message: "Please enter your name." }),
    email: take("email", 200, { required: true, message: "Enter a valid email." }),
    company: take("company", 160, { required: true, message: "Please enter your company name." }),
    industry: take("industry", 40, { required: true, list: INDUSTRIES }),
    employees: take("employees", 20, { required: true, list: EMPLOYEES }),
    revenue: "",
    job_title: "",
    interest: "",
    notes: "",
    meeting_requested: false,
    meeting_times: "",
    demo_industry: "",
    demo_employees: "",
    demo_goal: "",
    page_url: take("page_url", 500),
    phone: "",
    sms_consent: false,
    email_consent: yes(body.email_consent),
  };

  if (data.email && !EMAIL_RE.test(data.email)) errors.email = "Enter a valid email.";
  if (!data.email_consent) errors.email_consent = "Email consent is required.";

  const phone = normalisePhone(str(body.phone, 30) ?? "x");
  if (phone === null) errors.phone = "Enter a valid mobile number, or leave it blank.";
  else data.phone = phone;
  // SMS consent only counts when a number was entered.
  data.sms_consent = Boolean(data.phone) && yes(body.sms_consent);

  if (formType === "waitlist") {
    data.revenue = take("revenue", 20, { list: REVENUES });
    data.demo_industry = take("demo_industry", 40, { list: INDUSTRIES });
    data.demo_employees = take("demo_employees", 20, { list: EMPLOYEES });
    data.demo_goal = take("demo_goal", 40, { list: DEMO_GOALS });
  } else {
    data.job_title = take("job_title", 120, { required: true, message: "Please enter your job title." });
    data.interest = take("interest", 20, { required: true, list: INTERESTS });
    data.notes = take("notes", 2000);
    data.meeting_requested = yes(body.meeting_requested);
    data.meeting_times = data.meeting_requested ? take("meeting_times", 300) : "";
  }

  if (Object.keys(errors).length) return { errors };
  data.email_norm = data.email.toLowerCase();
  data.email_type = emailType(data.email);
  return { data };
}
