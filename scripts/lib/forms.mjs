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

export const INTEREST_OPTIONS = [
  ["orchestration", "Private AI orchestration"],
  ["server_setup", "Private AI server setup"],
  ["both", "Both"],
];

export const EMAIL_CONSENT_TEXT =
  "I agree to receive emails from DataDashOS about early access. I can unsubscribe at any time.";
export const SMS_CONSENT_TEXT =
  "I agree to receive text messages from DataDashOS about early access and my account. Message frequency varies. Message and data rates may apply. Reply STOP to opt out, HELP for help. Consent is not a condition of signing up.";
export const PENDING_MESSAGE = "Almost there — check your inbox and click the link to confirm.";

/** Honeypot, timing field and the bot-check slot. Bots that fill the honeypot are dropped silently. */
const antiSpam = (id) => `<div class="hp" aria-hidden="true">
              <label for="${id}-website">Website</label>
              <input id="${id}-website" type="text" name="website" tabindex="-1" autocomplete="off">
            </div>
            <input type="hidden" name="started_at" value="">`;

const consentBlock = (id, P) => `<div class="field">
              <input id="${id}-phone" name="phone" type="tel" maxlength="20" placeholder=" " autocomplete="tel" inputmode="tel" aria-describedby="${id}-phone-error">
              <label for="${id}-phone">Mobile number (optional)</label>
              <div class="error" id="${id}-phone-error">Enter a valid mobile number, or leave it blank.</div>
            </div>
            <div class="check-wrap">
              <label class="check">
                <input type="checkbox" name="email_consent" value="yes" required aria-describedby="${id}-email-consent-error">
                <span>${EMAIL_CONSENT_TEXT} <a href="${P}privacy.html">Privacy Policy</a></span>
              </label>
              <div class="error" id="${id}-email-consent-error">Please tick this box so we can email you about early access.</div>
            </div>
            <div class="check-wrap">
              <label class="check">
                <input type="checkbox" name="sms_consent" value="yes" aria-describedby="${id}-sms-consent-error">
                <span>${SMS_CONSENT_TEXT}</span>
              </label>
              <div class="error" id="${id}-sms-consent-error">Add your mobile number above to get texts, or untick this box.</div>
            </div>
            <div class="turnstile-slot" data-turnstile></div>`;

const formFooter = (P) => `<p class="form-legal">We'll only use this to contact you about early access. <a href="${P}privacy.html">Privacy Policy</a></p>
            <div class="form-status" role="status" aria-live="polite" hidden></div>
            <div class="form-error" role="alert" hidden></div>`;

export function enterpriseForm(P) {
  return `<form class="lead-form" id="enterprise-form" novalidate data-form-type="enterprise" data-analytics-name="Enterprise">
            ${antiSpam("ent")}
            <div class="field">
              <input id="ent-name" name="name" type="text" required maxlength="120" placeholder=" " autocomplete="name">
              <label for="ent-name">Full name</label>
              <div class="error">Please enter your name.</div>
            </div>
            <div class="field">
              <input id="ent-email" name="email" type="email" required maxlength="200" placeholder=" " autocomplete="email">
              <label for="ent-email">Work email</label>
              <div class="error">Enter a valid email.</div>
            </div>
            <div class="field-row">
              <div class="field">
                <input id="ent-company" name="company" type="text" required maxlength="160" placeholder=" " autocomplete="organization">
                <label for="ent-company">Company name</label>
                <div class="error">Please enter your company name.</div>
              </div>
              <div class="field">
                <input id="ent-title" name="job_title" type="text" required maxlength="120" placeholder=" " autocomplete="organization-title">
                <label for="ent-title">Job title</label>
                <div class="error">Please enter your job title.</div>
              </div>
            </div>
            <div class="field-row">
              <div class="field">
                <select id="ent-industry" name="industry" required>
                  ${options(INDUSTRY_OPTIONS, "Select industry")}
                </select>
                <label for="ent-industry">Industry</label>
                <div class="error">Choose an industry.</div>
              </div>
              <div class="field">
                <select id="ent-employees" name="employees" required>
                  ${options(EMPLOYEE_OPTIONS, "Select size")}
                </select>
                <label for="ent-employees">Number of employees</label>
                <div class="error">Choose a team size.</div>
              </div>
            </div>
            <fieldset class="field-choice" aria-describedby="ent-interest-error">
              <legend>Interested in</legend>
              <div class="choice-row">
${INTEREST_OPTIONS.map(
  ([v, l]) => `                <label class="choice"><input type="radio" name="interest" value="${v}" required> <span>${l}</span></label>`
).join("\n")}
              </div>
              <div class="error" id="ent-interest-error">Choose what you're interested in.</div>
            </fieldset>
            <div class="field">
              <textarea id="ent-notes" name="notes" maxlength="2000" placeholder=" "></textarea>
              <label for="ent-notes">Anything we should know? (optional)</label>
            </div>
            <label class="check">
              <input type="checkbox" name="meeting_requested" value="yes" data-reveal-target="#ent-meeting-times">
              <span>I'd like to request a meeting with the team</span>
            </label>
            <div class="field" id="ent-meeting-times" hidden>
              <input id="ent-times" name="meeting_times" type="text" maxlength="300" placeholder=" ">
              <label for="ent-times">Preferred days/times (optional)</label>
            </div>
            ${consentBlock("ent", P)}
            <button class="btn btn-shimmer btn-block" type="submit">Request early access <span class="arrow" aria-hidden="true">→</span></button>
            <p class="form-note">DataDashOS Enterprise is in development. Early-access partners will be contacted directly.</p>
            ${formFooter(P)}
          </form>`;
}

export function waitlistForm(P) {
  return `<form class="lead-form" id="waitlist-form" novalidate data-form-type="waitlist" data-analytics-name="Waitlist" data-success-url="${P}thank-you.html?status=pending">
            ${antiSpam("waitlist")}
            <input type="hidden" id="demo-industry" name="demo_industry" value="">
            <input type="hidden" id="demo-employees" name="demo_employees" value="">
            <input type="hidden" id="demo-goal" name="demo_goal" value="">
            <div class="field">
              <input id="waitlist-name" name="name" type="text" required maxlength="120" placeholder=" " autocomplete="name">
              <label for="waitlist-name">Full name</label>
              <div class="error">Please enter your name.</div>
            </div>
            <div class="field">
              <input id="waitlist-email" name="email" type="email" required maxlength="200" placeholder=" " autocomplete="email">
              <label for="waitlist-email">Work email</label>
              <div class="error">Enter a valid email.</div>
            </div>
            <div class="field">
              <input id="waitlist-company" name="company" type="text" required maxlength="160" placeholder=" " autocomplete="organization">
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
            ${consentBlock("waitlist", P)}
            <button class="btn btn-shimmer btn-block" type="submit">Join the waitlist <span class="arrow" aria-hidden="true">→</span></button>
            <p class="form-note">No spam. We'll reach out when your spot opens.</p>
            ${formFooter(P)}
          </form>`;
}
