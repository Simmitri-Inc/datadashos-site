import siteConfig from "../../site.config.json";
import { validateLead } from "./validate.js";
import { randomToken, sha256Hex, unsubscribeToken, verifyUnsubscribeToken } from "./crypto.js";
import { sendEmail, confirmRequestEmail, confirmedEmail, leadAlertEmail } from "./email.js";
import { sendSms, handleInboundSms, SMS_OPTIN_TEXT } from "./sms.js";

const EMAIL_CONSENT_TEXT =
  "I agree to receive emails from DataDashOS about early access. I can unsubscribe at any time.";
const SMS_CONSENT_TEXT =
  "I agree to receive text messages from DataDashOS about early access and my account. Message frequency varies. Message and data rates may apply. Reply STOP to opt out, HELP for help. Consent is not a condition of signing up.";
const MIN_FILL_MS = 3000;
const MAX_BODY_BYTES = 16 * 1024;

function loadConfig(env) {
  const siteUrl = (env.SITE_URL || siteConfig.siteUrl).replace(/\/+$/, "");
  const extra = (env.EXTRA_ALLOWED_ORIGINS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return {
    isDev: env.ENVIRONMENT === "development",
    unsubscribeSecret: env.UNSUBSCRIBE_SECRET || (env.ENVIRONMENT === "development" ? "dev-only-unsubscribe-secret" : ""),
    siteUrl,
    siteHost: new URL(siteUrl).host,
    contactEmail: siteConfig.contactEmail,
    leadAlertEmail: env.LEAD_ALERT_EMAIL || siteConfig.leadAlertEmail,
    emailFrom: env.EMAIL_FROM || siteConfig.emailFrom,
    confirmLinkHours: siteConfig.forms.confirmLinkHours,
    rateLimit: siteConfig.forms.rateLimit,
    sendUnconfirmedAlerts: siteConfig.forms.sendUnconfirmedAlerts,
    allowedOrigins: new Set([...siteConfig.forms.allowedOrigins, ...extra]),
  };
}

const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer",
  "Cache-Control": "no-store",
};

function corsHeaders(request, cfg) {
  const origin = request.headers.get("Origin");
  if (!origin || !cfg.allowedOrigins.has(origin)) return null;
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

const json = (body, status, extra = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...SECURITY_HEADERS, ...extra },
  });

const redirect = (to) => new Response(null, { status: 303, headers: { Location: to, ...SECURITY_HEADERS } });

/** Fixed-window counter in D1. Returns true when the key is over its limit. */
async function overLimit(db, key, max, windowSeconds) {
  const now = Math.floor(Date.now() / 1000);
  const row = await db
    .prepare(
      `INSERT INTO rate_limits (key, window_start, count) VALUES (?1, ?2, 1)
       ON CONFLICT(key) DO UPDATE SET
         count = CASE WHEN rate_limits.window_start <= ?2 - ?3 THEN 1 ELSE rate_limits.count + 1 END,
         window_start = CASE WHEN rate_limits.window_start <= ?2 - ?3 THEN ?2 ELSE rate_limits.window_start END
       RETURNING count`
    )
    .bind(key, now, windowSeconds)
    .first();
  return row.count > max;
}

async function verifyTurnstile(env, cfg, token, ip) {
  if (!env.TURNSTILE_SECRET_KEY) return cfg.isDev;
  if (!token) return false;
  const form = new FormData();
  form.append("secret", env.TURNSTILE_SECRET_KEY);
  form.append("response", token);
  if (ip) form.append("remoteip", ip);
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: form });
    const out = await res.json();
    return out.success === true;
  } catch (err) {
    console.error("Turnstile verify failed", err);
    return false;
  }
}

async function readBody(request) {
  const length = Number(request.headers.get("Content-Length") || 0);
  if (length > MAX_BODY_BYTES) return null;
  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) return null;
  const type = request.headers.get("Content-Type") || "";
  try {
    if (type.includes("application/json")) return JSON.parse(text);
    if (type.includes("application/x-www-form-urlencoded")) return Object.fromEntries(new URLSearchParams(text));
  } catch {
    return null;
  }
  return null;
}

async function handleLead(request, env, cfg, ctx) {
  const cors = corsHeaders(request, cfg);
  if (!cors) return json({ ok: false, error: "origin_not_allowed" }, 403);
  const reply = (body, status = 200) => json(body, status, cors);
  // Bots get the same answer as people, so they can't tell they were dropped.
  const silentOk = () => reply({ ok: true, status: "pending" });

  if (!env.TURNSTILE_SECRET_KEY && !cfg.isDev) return reply({ ok: false, error: "server_misconfigured" }, 503);

  const body = await readBody(request);
  if (!body || typeof body !== "object") return reply({ ok: false, error: "bad_request" }, 400);

  if (body.website) return silentOk();
  const startedAt = Number(body.started_at);
  if (!startedAt || Date.now() - startedAt < MIN_FILL_MS) return silentOk();

  const db = env.DB;
  const ip = request.headers.get("CF-Connecting-IP") || "";
  const ipKey = `ip:${(await sha256Hex(`${env.IP_HASH_SALT || ""}|${ip}`)).slice(0, 32)}`;
  const { windowSeconds, maxPerIp, maxPerEmail } = cfg.rateLimit;
  if (await overLimit(db, ipKey, maxPerIp, windowSeconds)) return reply({ ok: false, error: "rate_limited" }, 429);

  if (!(await verifyTurnstile(env, cfg, body["cf-turnstile-response"], ip))) return silentOk();

  const { data, errors } = validateLead(body);
  if (errors) return reply({ ok: false, error: "invalid", fields: errors }, 400);

  const emailKey = `email:${(await sha256Hex(data.email_norm)).slice(0, 32)}`;
  if (await overLimit(db, emailKey, maxPerEmail, windowSeconds)) return reply({ ok: false, error: "rate_limited" }, 429);

  const existing = await db
    .prepare("SELECT id, status FROM leads WHERE email_norm = ? AND form_type = ?")
    .bind(data.email_norm, data.form_type)
    .first();
  // Already confirmed: say nothing different (no list-membership leak) and send nothing.
  if (existing && existing.status === "confirmed") return reply({ ok: true, status: "pending" });

  const now = new Date();
  const nowIso = now.toISOString();
  const confirmToken = randomToken();
  const lead = {
    id: existing ? existing.id : crypto.randomUUID(),
    ...data,
    status: "pending",
    created_at: nowIso,
    updated_at: nowIso,
    email_consent_text: EMAIL_CONSENT_TEXT,
    email_consent_at: nowIso,
    confirm_token_hash: await sha256Hex(confirmToken),
    confirm_expires_at: new Date(now.getTime() + cfg.confirmLinkHours * 3600 * 1000).toISOString(),
    sms_phone: data.phone || null,
    sms_status: data.sms_consent ? "consented" : "none",
    sms_consent_text: data.sms_consent ? SMS_CONSENT_TEXT : null,
    sms_consent_at: data.sms_consent ? nowIso : null,
    sms_consent_page_url: data.sms_consent ? data.page_url : null,
  };

  const cols = [
    "id", "form_type", "status", "name", "email", "email_norm", "email_type", "company", "job_title", "industry",
    "employees", "revenue", "interest", "notes", "meeting_requested", "meeting_times", "demo_industry",
    "demo_employees", "demo_goal", "page_url", "created_at", "updated_at", "email_consent_text", "email_consent_at",
    "confirm_token_hash", "confirm_expires_at", "sms_phone", "sms_status",
    "sms_consent_text", "sms_consent_at", "sms_consent_page_url",
  ];
  const values = cols.map((c) => {
    const v = lead[c];
    if (c === "meeting_requested") return v ? 1 : 0;
    return v === "" || v === undefined ? null : v;
  });
  const updates = cols
    .filter((c) => c !== "id" && c !== "created_at")
    .map((c) => `${c} = excluded.${c}`)
    .concat(["confirmed_at = NULL", "unsubscribed_at = NULL", "alert_sent_at = NULL"])
    .join(", ");
  await db
    .prepare(
      `INSERT INTO leads (${cols.join(", ")}) VALUES (${cols.map(() => "?").join(", ")})
       ON CONFLICT(email_norm, form_type) DO UPDATE SET ${updates}`
    )
    .bind(...values)
    .run();

  const origin = new URL(request.url).origin;
  const confirmUrl = `${origin}/api/confirm?token=${confirmToken}`;
  const unsubscribeUrl = `${origin}/api/unsubscribe?token=${await unsubscribeToken(cfg.unsubscribeSecret, lead.id)}`;
  const msg = confirmRequestEmail(cfg, lead, confirmUrl, unsubscribeUrl);
  ctx.waitUntil(
    (async () => {
      await sendEmail(env, cfg, { to: lead.email, ...msg, unsubscribeUrl });
      if (cfg.sendUnconfirmedAlerts) {
        const alert = leadAlertEmail(cfg, lead, { confirmed: false, unsubscribeUrl });
        await sendEmail(env, cfg, { to: cfg.leadAlertEmail, ...alert, unsubscribeUrl, replyTo: lead.email });
      }
    })()
  );
  return reply({ ok: true, status: "pending" });
}

async function handleConfirm(request, env, cfg, ctx) {
  const token = new URL(request.url).searchParams.get("token") || "";
  const page = `${cfg.siteUrl}/confirmed.html`;
  if (!token || token.length > 100) return redirect(`${page}?status=invalid`);
  const db = env.DB;
  const lead = await db.prepare("SELECT * FROM leads WHERE confirm_token_hash = ?").bind(await sha256Hex(token)).first();
  if (!lead) return redirect(`${page}?status=invalid`);
  if (lead.confirm_expires_at < new Date().toISOString()) return redirect(`${page}?status=expired`);

  const nowIso = new Date().toISOString();
  // Single use: the token hash is cleared in the same statement that confirms the lead.
  const res = await db
    .prepare(
      `UPDATE leads SET status = 'confirmed', confirmed_at = ?, confirm_token_hash = NULL, confirm_expires_at = NULL,
       alert_sent_at = ?, updated_at = ?
       WHERE id = ? AND confirm_token_hash IS NOT NULL`
    )
    .bind(nowIso, nowIso, nowIso, lead.id)
    .run();
  if (!res.meta || res.meta.changes !== 1) return redirect(`${page}?status=invalid`);

  const confirmed = { ...lead, status: "confirmed", confirmed_at: nowIso };
  const unsubscribeUrl = `${new URL(request.url).origin}/api/unsubscribe?token=${await unsubscribeToken(cfg.unsubscribeSecret, lead.id)}`;
  ctx.waitUntil(
    (async () => {
      const alert = leadAlertEmail(cfg, confirmed, { confirmed: true, unsubscribeUrl });
      await sendEmail(env, cfg, { to: cfg.leadAlertEmail, ...alert, unsubscribeUrl, replyTo: confirmed.email });
      const welcome = confirmedEmail(cfg, confirmed, unsubscribeUrl);
      await sendEmail(env, cfg, { to: confirmed.email, ...welcome, unsubscribeUrl });
      if (confirmed.sms_phone && confirmed.sms_status === "consented") {
        const sent = await sendSms(env, cfg, db, { to: confirmed.sms_phone, body: SMS_OPTIN_TEXT, kind: "optin" });
        if (sent.ok) {
          const t = new Date().toISOString();
          await db
            .prepare("UPDATE leads SET sms_status = 'pending_confirmation', sms_optin_sent_at = ?, updated_at = ? WHERE id = ? AND sms_status = 'consented'")
            .bind(t, t, confirmed.id)
            .run();
        }
      }
    })()
  );
  return redirect(page);
}

const unsubscribePage = (token) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Unsubscribe — DataDashOS</title>
<style>body{font-family:system-ui,sans-serif;background:#f4f6fb;color:#0b1b33;display:grid;place-items:center;min-height:100vh;margin:0;padding:16px}main{background:#fff;border-radius:14px;padding:28px;max-width:420px;text-align:center}button{background:#2f6bff;color:#fff;border:0;border-radius:10px;padding:12px 22px;font-size:16px;font-weight:700;cursor:pointer}</style></head>
<body><main><h1>Unsubscribe from DataDashOS emails?</h1><form method="post" action="/api/unsubscribe?token=${encodeURIComponent(token)}"><button type="submit">Unsubscribe</button></form></main></body></html>`;

async function handleUnsubscribe(request, env, cfg) {
  const token = new URL(request.url).searchParams.get("token") || "";
  const page = `${cfg.siteUrl}/unsubscribed.html`;
  if (!token || token.length > 100) return redirect(`${page}?status=invalid`);
  // GET only shows a button, so link scanners can't unsubscribe people by prefetching.
  if (request.method === "GET") {
    return new Response(unsubscribePage(token), {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'",
        ...SECURITY_HEADERS,
      },
    });
  }
  const id = await verifyUnsubscribeToken(cfg.unsubscribeSecret, token);
  if (!id) return redirect(`${page}?status=invalid`);
  const nowIso = new Date().toISOString();
  // Unsubscribes the address from every form, not just the one this email was about.
  const res = await env.DB.prepare(
    `UPDATE leads SET status = 'unsubscribed', unsubscribed_at = ?, confirm_token_hash = NULL, updated_at = ?
     WHERE email_norm = (SELECT email_norm FROM leads WHERE id = ?)`
  )
    .bind(nowIso, nowIso, id)
    .run();
  if (!res.meta || res.meta.changes === 0) return redirect(`${page}?status=invalid`);
  return redirect(page);
}

export default {
  async fetch(request, env, ctx) {
    const cfg = loadConfig(env);
    const { pathname } = new URL(request.url);
    if (!cfg.unsubscribeSecret) return json({ ok: false, error: "server_misconfigured" }, 503);
    try {
      if (pathname === "/api/lead") {
        if (request.method === "OPTIONS") {
          const cors = corsHeaders(request, cfg);
          return new Response(null, { status: cors ? 204 : 403, headers: cors || {} });
        }
        if (request.method === "POST") return await handleLead(request, env, cfg, ctx);
      }
      if (pathname === "/api/confirm" && request.method === "GET") return await handleConfirm(request, env, cfg, ctx);
      if (pathname === "/api/unsubscribe" && (request.method === "GET" || request.method === "POST")) {
        return await handleUnsubscribe(request, env, cfg);
      }
      if (pathname === "/api/sms/inbound" && request.method === "POST") return await handleInboundSms(request, env, cfg, env.DB);
      if (pathname === "/api/health") return json({ ok: true }, 200);
      return json({ ok: false, error: "not_found" }, 404);
    } catch (err) {
      console.error(err);
      const cors = corsHeaders(request, cfg) || {};
      return json({ ok: false, error: "server_error" }, 500, cors);
    }
  },

  /** Daily cleanup: unconfirmed leads are deleted 7 days after their link expires; old rate-limit rows go too. */
  async scheduled(_event, env) {
    const cutoff = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString();
    const rlCutoff = Math.floor(Date.now() / 1000) - 24 * 3600;
    await env.DB.batch([
      env.DB.prepare("DELETE FROM leads WHERE status = 'pending' AND confirm_expires_at < ?").bind(cutoff),
      env.DB.prepare("DELETE FROM rate_limits WHERE window_start < ?").bind(rlCutoff),
    ]);
  },
};
