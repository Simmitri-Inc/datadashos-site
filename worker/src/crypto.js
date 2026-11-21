const enc = new TextEncoder();

const toHex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
const toBase64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)));

/** 256-bit URL-safe random token. Only its SHA-256 hash is stored. */
export function randomToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function sha256Hex(value) {
  return toHex(await crypto.subtle.digest("SHA-256", enc.encode(value)));
}

export async function hmacSha1Base64(key, message) {
  const k = await crypto.subtle.importKey("raw", enc.encode(key), { name: "HMAC", hash: "SHA-1" }, false, ["sign"]);
  return toBase64(await crypto.subtle.sign("HMAC", k, enc.encode(message)));
}

async function hmacSha256B64url(key, message) {
  const k = await crypto.subtle.importKey("raw", enc.encode(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", k, enc.encode(message));
  return toBase64(sig).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Stable, unforgeable unsubscribe token for a lead: "<id>.<HMAC>". Works in every email ever sent to them. */
export async function unsubscribeToken(secret, leadId) {
  return `${leadId}.${await hmacSha256B64url(secret, `unsubscribe:${leadId}`)}`;
}

export async function verifyUnsubscribeToken(secret, token) {
  const [id, sig] = String(token).split(".");
  if (!id || !sig) return null;
  const expected = (await unsubscribeToken(secret, id)).split(".")[1];
  return timingSafeEqual(sig, expected) ? id : null;
}

export function timingSafeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/**
 * Twilio request validation: HMAC-SHA1 over the full webhook URL followed by every POST
 * parameter (sorted by name, name+value concatenated), keyed with the auth token.
 */
export async function verifyTwilioSignature(authToken, url, params, signature) {
  if (!authToken || !signature) return false;
  const keys = [...new Set(params.keys())].sort();
  const data = keys.reduce((acc, k) => acc + params.getAll(k).map((v) => k + v).join(""), url);
  return timingSafeEqual(await hmacSha1Base64(authToken, data), signature);
}
