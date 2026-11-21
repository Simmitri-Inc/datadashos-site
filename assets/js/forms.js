(() => {
  const forms = document.querySelectorAll("form[data-form-type]");
  if (!forms.length) return;

  const cfg = window.DATADASHOS_CONFIG || {};
  const isLocal = ["127.0.0.1", "localhost"].includes(window.location.hostname);
  const endpoint = (isLocal ? "http://127.0.0.1:8787" : cfg.formEndpoint || "").replace(/\/+$/, "");
  // Cloudflare's always-pass test key is used only on localhost.
  const siteKey = isLocal ? "1x00000000000000000000AA" : cfg.turnstileSiteKey || "";
  const configured = Boolean(endpoint) && Boolean(siteKey) && !/^YOUR_/.test(siteKey);
  const contactEmail = cfg.contactEmail || "hello@datadashos.com";
  const pageLoadedAt = Date.now();

  const PENDING = "Almost there — check your inbox and click the link to confirm.";
  const MEETING = "Thanks — we'll email you to set up a time.";

  const track = (event) => {
    if (typeof window.plausible === "function") window.plausible(event);
  };

  let turnstileLoading = null;
  const loadTurnstile = () => {
    if (!configured) return Promise.resolve(null);
    if (window.turnstile) return Promise.resolve(window.turnstile);
    if (turnstileLoading) return turnstileLoading;
    turnstileLoading = new Promise((resolve) => {
      window.__ddTurnstileReady = () => resolve(window.turnstile);
      const s = document.createElement("script");
      s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=__ddTurnstileReady";
      s.async = true;
      s.defer = true;
      s.onerror = () => resolve(null);
      document.head.appendChild(s);
    });
    return turnstileLoading;
  };

  const digits = (s) => s.replace(/\D/g, "");

  forms.forEach((form) => {
    const name = form.dataset.analyticsName || "Lead";
    const formType = form.dataset.formType;
    const status = form.querySelector(".form-status");
    const failure = form.querySelector(".form-error");
    const submitBtn = form.querySelector('button[type="submit"]');
    const slot = form.querySelector("[data-turnstile]");
    const startedField = form.querySelector('input[name="started_at"]');
    if (startedField) startedField.value = String(pageLoadedAt);
    let widgetId = null;
    let started = false;

    const ensureWidget = async () => {
      const ts = await loadTurnstile();
      if (!ts || !slot || widgetId !== null) return;
      widgetId = ts.render(slot, { sitekey: siteKey, theme: "dark", size: "flexible", action: formType });
    };

    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            track(`${name} Form Viewed`);
            io.disconnect();
          }
        },
        { threshold: 0.35 }
      );
      io.observe(form);
    }

    const onStart = () => {
      if (started) return;
      started = true;
      track(`${name} Form Started`);
      ensureWidget();
    };
    form.addEventListener("focusin", onStart);
    form.addEventListener("input", onStart);

    const wrapOf = (field) => field.closest(".field, .check-wrap, .field-choice");
    const setInvalid = (field, invalid) => {
      const wrap = wrapOf(field);
      if (wrap) wrap.classList.toggle("is-invalid", invalid);
      if (invalid) field.setAttribute("aria-invalid", "true");
      else field.removeAttribute("aria-invalid");
    };

    const validate = () => {
      let first = null;
      const mark = (field, invalid) => {
        setInvalid(field, invalid);
        if (invalid && !first) first = field;
      };
      form.querySelectorAll("input[required]:not([type=radio]), select[required], textarea[required]").forEach((f) => {
        if (f.type === "checkbox") mark(f, !f.checked);
        else if (f.type === "email") mark(f, !f.value.trim() || !f.checkValidity());
        else mark(f, !f.value.trim());
      });
      const radios = form.querySelectorAll("input[type=radio][required]");
      if (radios.length) mark(radios[0], ![...radios].some((r) => r.checked));

      const phone = form.querySelector('input[name="phone"]');
      const sms = form.querySelector('input[name="sms_consent"]');
      if (phone) {
        const v = phone.value.trim();
        const bad = v && (!/^[+\d\s().-]+$/.test(v) || digits(v).length < 8 || digits(v).length > 15);
        mark(phone, Boolean(bad));
      }
      if (sms && phone) mark(sms, sms.checked && !phone.value.trim());
      return first;
    };

    form.addEventListener("change", (e) => {
      const wrap = e.target.closest(".is-invalid");
      if (wrap) validate();
    });

    const showError = (msg) => {
      if (!failure) return;
      failure.textContent = msg;
      failure.hidden = false;
    };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (failure) failure.hidden = true;
      const first = validate();
      if (first) {
        first.focus();
        return;
      }
      if (!configured) {
        showError(`This form isn't connected yet. Email us at ${contactEmail}.`);
        return;
      }

      const data = Object.fromEntries(new FormData(form).entries());
      if (!data["cf-turnstile-response"]) {
        await ensureWidget();
        showError("Please complete the quick check above the button, then submit again.");
        return;
      }
      const payload = {
        ...data,
        form_type: formType,
        started_at: Number(data.started_at) || pageLoadedAt,
        page_url: window.location.origin + window.location.pathname,
      };

      if (submitBtn) submitBtn.disabled = true;
      try {
        const res = await fetch(`${endpoint}/api/lead`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
        });
        const out = await res.json().catch(() => ({}));
        if (res.ok && out.ok) {
          track(`${name} Form Submitted`);
          if (form.dataset.successUrl) {
            window.location.href = form.dataset.successUrl;
            return;
          }
          const lines = [PENDING];
          if (data.meeting_requested) lines.push(MEETING);
          [...form.children].forEach((el) => {
            if (el !== status) el.hidden = true;
          });
          status.innerHTML = "";
          lines.forEach((line) => {
            const p = document.createElement("p");
            p.textContent = line;
            status.appendChild(p);
          });
          status.hidden = false;
          status.setAttribute("tabindex", "-1");
          status.focus();
          return;
        }
        if (res.status === 400 && out.fields) {
          let firstBad = null;
          Object.keys(out.fields).forEach((field) => {
            const el = form.querySelector(`[name="${field}"]`);
            if (el) {
              setInvalid(el, true);
              if (!firstBad) firstBad = el;
            }
          });
          if (firstBad) firstBad.focus();
          else showError(`Please check the form and try again, or email ${contactEmail}.`);
        } else if (res.status === 429) {
          showError("Too many attempts. Please wait a few minutes and try again.");
        } else {
          showError(`Something went wrong — please try again, or email ${contactEmail}.`);
        }
      } catch (_) {
        showError(`Something went wrong — please try again, or email ${contactEmail}.`);
      } finally {
        if (submitBtn) submitBtn.disabled = false;
        if (window.turnstile && widgetId !== null) window.turnstile.reset(widgetId);
      }
    });
  });
})();
