export const INDUSTRY_OPTIONS = [
  ["construction_trades", "Construction &amp; trades"],
  ["home_services", "Home services"],
  ["professional_services", "Professional services"],
  ["retail_ecommerce", "Retail &amp; e-commerce"],
  ["healthcare", "Healthcare"],
  ["manufacturing", "Manufacturing"],
  ["technology", "Technology"],
  ["other", "Other"],
];

export const EMPLOYEE_OPTIONS = [
  ["1-10", "1–10"],
  ["11-50", "11–50"],
  ["51-200", "51–200"],
  ["201-500", "201–500"],
  ["500+", "500+"],
];

export const REVENUE_OPTIONS = [
  ["under_1m", "Under $1M"],
  ["1m_5m", "$1M–$5M"],
  ["5m_20m", "$5M–$20M"],
  ["20m_plus", "$20M+"],
];

const options = (list, placeholder) =>
  [`<option value="">${placeholder}</option>`, ...list.map(([v, l]) => `<option value="${v}">${l}</option>`)].join("\n                  ");

export function waitlistForm(P) {
  return `<form class="lead-form" id="waitlist-form" novalidate data-source="homepage">
            <div class="hp" aria-hidden="true">
              <label>Company website<input type="text" name="company_website" tabindex="-1" autocomplete="off"></label>
            </div>
            <input type="hidden" id="demo-industry" name="demo_industry" value="">
            <input type="hidden" id="demo-employees" name="demo_employees" value="">
            <input type="hidden" id="demo-goal" name="demo_goal" value="">
            <div class="field">
              <input id="waitlist-name" name="name" type="text" required placeholder=" " autocomplete="name">
              <label for="waitlist-name">Full name</label>
              <div class="error">Please enter your name.</div>
            </div>
            <div class="field">
              <input id="waitlist-email" name="email" type="email" required placeholder=" " autocomplete="email">
              <label for="waitlist-email">Work email</label>
              <div class="error">Enter a valid email.</div>
            </div>
            <div class="field">
              <input id="waitlist-company" name="company" type="text" required placeholder=" " autocomplete="organization">
              <label for="waitlist-company">Company name</label>
              <div class="error">Please enter your company name.</div>
            </div>
            <div class="field-row">
              <div class="field">
                <select id="waitlist-industry" name="industry" required>
                  ${options(INDUSTRY_OPTIONS, "Select industry")}
                </select>
                <label for="waitlist-industry">Industry</label>
                <div class="error">Choose an industry.</div>
              </div>
              <div class="field">
                <select id="waitlist-employees" name="employees" required>
                  ${options(EMPLOYEE_OPTIONS, "Select size")}
                </select>
                <label for="waitlist-employees">Number of employees</label>
                <div class="error">Choose a team size.</div>
              </div>
            </div>
            <div class="field">
              <select id="waitlist-revenue" name="revenue">
                  ${options(REVENUE_OPTIONS, "Select (optional)")}
              </select>
              <label for="waitlist-revenue">Annual revenue (optional)</label>
            </div>
            <button class="btn btn-shimmer" type="submit" style="width:100%">Join the waitlist <span class="arrow" aria-hidden="true">→</span></button>
            <p class="form-note">No spam. We'll reach out when your spot opens.</p>
            <p class="form-legal">By joining, you agree to our <a href="${P}privacy.html">Privacy Policy</a>.</p>
            <div class="form-error" role="alert" hidden>Something went wrong — please try again, or email <span data-contact-email>hello@datadashos.com</span>.</div>
          </form>`;
}
