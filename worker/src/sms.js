import { verifyTwilioSignature } from "./crypto.js";

const STOP_WORDS = new Set(["STOP", "STOPALL", "UNSUBSCRIBE", "CANCEL", "END", "QUIT", "OPTOUT", "OPT-OUT", "REVOKE"]);
const START_WORDS = new Set(["START", "UNSTOP", "YES", "Y"]);
const HELP_WORDS = new Set(["HELP", "INFO"]);

export const SMS_OPTIN_TEXT =
  "DataDashOS: Reply YES to confirm texts about early access and your account. Msg frequency varies. Msg & data rates may apply. Reply STOP to opt out, HELP for help.";

const twiml = (message) =>
  new Response(
    `<?xml version="1.0" encoding="UTF-8"?><Response>${message ? `<Message>${message.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</Message>` : ""}</Response>`,
    { headers: { "Content-Type": "text/xml; charset=utf-8" } }
  );

/**
 * Sends one text. Refuses unless the number's current consent state allows it:
 * the opt-in text needs status "consented"; anything else needs "confirmed". Opted-out numbers never get texts.
 */
export async function sendSms(env, cfg, db, { to, body, kind }) {
  const row = await db
    .prepare("SELECT sms_status FROM leads WHERE sms_phone = ? ORDER BY updated_at DESC LIMIT 1")
    .bind(to)
    .first();
  const optedOut = await db
    .prepare("SELECT 1 FROM leads WHERE sms_phone = ? AND sms_status = 'opted_out' LIMIT 1")
    .bind(to)
    .first();
  const needed = kind === "optin" ? "consented" : "confirmed";
  if (optedOut || !row || row.sms_status !== needed) return { ok: false, skipped: true };

  if (!env.TWILIO_ACCOUNT_SID || !env.TWILIO_AUTH_TOKEN || !(env.TWILIO_MESSAGING_SERVICE_SID || env.TWILIO_FROM_NUMBER)) {
    if (cfg.isDev) {
      console.log(`\n--- SMS (dev, not sent) ---\nTo: ${to}\n${body}\n--- END SMS ---\n`);
      return { ok: true, dev: true };
    }
    console.error("Twilio is not configured; SMS not sent.");
    return { ok: false };
  }
  const form = new URLSearchParams({ To: to, Body: body });
  if (env.TWILIO_MESSAGING_SERVICE_SID) form.set("MessagingServiceSid", env.TWILIO_MESSAGING_SERVICE_SID);
  else form.set("From", env.TWILIO_FROM_NUMBER);
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${env.TWILIO_ACCOUNT_SID}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${env.TWILIO_ACCOUNT_SID}:${env.TWILIO_AUTH_TOKEN}`)}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form,
  });
  if (!res.ok) console.error("Twilio error", res.status, await res.text());
  return { ok: res.ok };
}

/** Twilio inbound-message webhook. STOP takes effect immediately, before anything else is sent. */
export async function handleInboundSms(request, env, cfg, db) {
  const raw = await request.text();
  const params = new URLSearchParams(raw);
  const url = env.TWILIO_WEBHOOK_URL || request.url;
  const valid = await verifyTwilioSignature(env.TWILIO_AUTH_TOKEN, url, params, request.headers.get("X-Twilio-Signature"));
  if (!valid && !(cfg.isDev && !env.TWILIO_AUTH_TOKEN)) return new Response("Forbidden", { status: 403 });

  const from = params.get("From") || "";
  const keyword = (params.get("Body") || "").trim().split(/\s+/)[0].toUpperCase();
  const now = new Date().toISOString();
  if (!from) return twiml("");

  if (STOP_WORDS.has(keyword)) {
    await db.batch([
      db
        .prepare("UPDATE leads SET sms_status = 'opted_out', sms_opted_out_at = ?, updated_at = ? WHERE sms_phone = ?")
        .bind(now, now, from),
      db.prepare("INSERT INTO sms_events (phone, keyword, created_at) VALUES (?, ?, ?)").bind(from, "STOP", now),
    ]);
    // Twilio's built-in opt-out handling sends the STOP confirmation reply, so none is added here.
    return twiml("");
  }

  if (HELP_WORDS.has(keyword)) {
    await db.prepare("INSERT INTO sms_events (phone, keyword, created_at) VALUES (?, ?, ?)").bind(from, "HELP", now).run();
    return twiml(
      `DataDashOS: texts about early access and your account. Help: ${cfg.contactEmail}. Msg & data rates may apply. Reply STOP to opt out.`
    );
  }

  if (START_WORDS.has(keyword)) {
    const res = await db
      .prepare(
        "UPDATE leads SET sms_status = 'confirmed', sms_confirmed_at = ?, updated_at = ? WHERE sms_phone = ? AND sms_consent_at IS NOT NULL AND sms_status IN ('pending_confirmation', 'opted_out')"
      )
      .bind(now, now, from)
      .run();
    await db.prepare("INSERT INTO sms_events (phone, keyword, created_at) VALUES (?, ?, ?)").bind(from, keyword === "Y" ? "YES" : keyword, now).run();
    if (res.meta && res.meta.changes > 0) {
      return twiml("DataDashOS: You're subscribed to texts about early access and your account. Reply STOP to opt out, HELP for help.");
    }
  }
  return twiml("");
}
