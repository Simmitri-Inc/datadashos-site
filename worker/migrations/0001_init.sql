-- Leads live only in Cloudflare D1, never in the git repo.

CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  form_type TEXT NOT NULL CHECK (form_type IN ('waitlist', 'enterprise')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'unsubscribed')),

  name TEXT NOT NULL,
  email TEXT NOT NULL,
  email_norm TEXT NOT NULL,
  email_type TEXT NOT NULL CHECK (email_type IN ('work', 'personal')),
  company TEXT NOT NULL,
  job_title TEXT,
  industry TEXT NOT NULL,
  employees TEXT NOT NULL,
  revenue TEXT,
  interest TEXT,
  notes TEXT,
  meeting_requested INTEGER NOT NULL DEFAULT 0,
  meeting_times TEXT,
  demo_industry TEXT,
  demo_employees TEXT,
  demo_goal TEXT,
  page_url TEXT,

  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,

  email_consent_text TEXT NOT NULL,
  email_consent_at TEXT NOT NULL,
  confirm_token_hash TEXT,
  confirm_expires_at TEXT,
  confirmed_at TEXT,
  unsubscribed_at TEXT,
  alert_sent_at TEXT,

  sms_phone TEXT,
  sms_status TEXT NOT NULL DEFAULT 'none'
    CHECK (sms_status IN ('none', 'consented', 'pending_confirmation', 'confirmed', 'opted_out')),
  sms_consent_text TEXT,
  sms_consent_at TEXT,
  sms_consent_page_url TEXT,
  sms_optin_sent_at TEXT,
  sms_confirmed_at TEXT,
  sms_opted_out_at TEXT,

  UNIQUE (email_norm, form_type)
);

CREATE INDEX IF NOT EXISTS idx_leads_confirm ON leads (confirm_token_hash);
CREATE INDEX IF NOT EXISTS idx_leads_phone ON leads (sms_phone);

CREATE TABLE IF NOT EXISTS rate_limits (
  key TEXT PRIMARY KEY,
  window_start INTEGER NOT NULL,
  count INTEGER NOT NULL
);

-- Inbound SMS keywords (STOP/HELP/YES/START), kept as an opt-out audit trail.
CREATE TABLE IF NOT EXISTS sms_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  phone TEXT NOT NULL,
  keyword TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sms_events_phone ON sms_events (phone);
