import { test } from "node:test";
import assert from "node:assert/strict";
import { validateLead, emailType, normalizePhone } from "../src/validate.js";
import { verifyTwilioSignature, unsubscribeToken, verifyUnsubscribeToken } from "../src/crypto.js";

const base = {
  form_type: "waitlist",
  name: "Sam Sample",
  email: "sam@example.com",
  company: "Sample Co",
  industry: "construction_trades",
  employees: "11-50",
  email_consent: "yes",
};

test("valid waitlist lead", () => {
  const { data, errors } = validateLead(base);
  assert.equal(errors, undefined);
  assert.equal(data.email_type, "work");
  assert.equal(data.sms_consent, false);
});

test("email consent is required", () => {
  const { errors } = validateLead({ ...base, email_consent: "" });
  assert.ok(errors.email_consent);
});

test("rejects values outside the option lists", () => {
  const { errors } = validateLead({ ...base, industry: "space", employees: "9000" });
  assert.ok(errors.industry && errors.employees);
});

test("SMS consent only counts with a number", () => {
  assert.equal(validateLead({ ...base, sms_consent: "yes" }).data.sms_consent, false);
  const { data } = validateLead({ ...base, sms_consent: "yes", phone: "(555) 010-2030" });
  assert.equal(data.sms_consent, true);
  assert.equal(data.phone, "+15550102030");
});

test("enterprise requires job title and interest", () => {
  const { errors } = validateLead({ ...base, form_type: "enterprise" });
  assert.ok(errors.job_title && errors.interest);
  const ok = validateLead({ ...base, form_type: "enterprise", job_title: "COO", interest: "both", meeting_requested: "yes", meeting_times: "Tue am" });
  assert.equal(ok.data.meeting_times, "Tue am");
});

test("personal email domains are tagged, not blocked", () => {
  assert.equal(emailType("a@gmail.com"), "personal");
  assert.equal(emailType("a@Outlook.com"), "personal");
  assert.equal(emailType("a@icloud.com"), "personal");
  assert.equal(emailType("a@acme.io"), "work");
  assert.equal(validateLead({ ...base, email: "x@yahoo.com" }).data.email_type, "personal");
});

test("phone normalization", () => {
  assert.equal(normalizePhone(""), "");
  assert.equal(normalizePhone("+44 20 7946 0958"), "+442079460958");
  assert.equal(normalizePhone("12"), null);
  assert.equal(normalizePhone("call me"), null);
});

test("unsubscribe tokens verify and resist tampering", async () => {
  const t = await unsubscribeToken("secret", "lead-1");
  assert.equal(await verifyUnsubscribeToken("secret", t), "lead-1");
  assert.equal(await verifyUnsubscribeToken("other", t), null);
  assert.equal(await verifyUnsubscribeToken("secret", t.replace("lead-1", "lead-2")), null);
});

test("Twilio signature (example from Twilio's docs)", async () => {
  const params = new URLSearchParams({
    CallSid: "CA1234567890ABCDE",
    Caller: "+12349013030",
    Digits: "1234",
    From: "+12349013030",
    To: "+18005551212",
  });
  const url = "https://mycompany.com/myapp.php?foo=1&bar=2";
  assert.equal(await verifyTwilioSignature("12345", url, params, "0/KCTR6DLpKmkAf8muzZqo1nDgQ="), true);
  assert.equal(await verifyTwilioSignature("12345", url, params, "bad"), false);
});
