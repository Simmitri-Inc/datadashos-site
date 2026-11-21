(() => {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  const form = document.querySelector("#waitlist-form");
  const yearEls = document.querySelectorAll("[data-year]");

  const cfg = window.DATADASHOS_CONFIG || {};
  const contactEmail = (cfg.contactEmail || "hello@datadashos.com").trim();
  const formEndpoint = "";

  document.querySelectorAll("[data-pending-notice]").forEach((el) => {
    if (new URLSearchParams(window.location.search).get("status") === "pending") el.hidden = false;
  });

  document.querySelectorAll("[data-reveal-target]").forEach((box) => {
    const target = document.querySelector(box.getAttribute("data-reveal-target"));
    if (!target) return;
    box.setAttribute("aria-controls", target.id);
    const sync = () => {
      target.hidden = !box.checked;
      box.setAttribute("aria-expanded", box.checked ? "true" : "false");
    };
    box.addEventListener("change", sync);
    sync();
  });

  document.querySelectorAll("[data-scroll-demo]").forEach((link) => {
    link.addEventListener("click", () => {
      const target = document.querySelector(link.getAttribute("href"));
      if (target) setTimeout(() => target.focus({ preventScroll: true }), 400);
    });
  });

  yearEls.forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });

  document.querySelectorAll("[data-contact-email]").forEach((el) => {
    el.textContent = contactEmail;
  });
  document.querySelectorAll("a[data-contact-mailto]").forEach((el) => {
    el.setAttribute("href", `mailto:${contactEmail}`);
    if (!el.textContent.trim() || el.hasAttribute("data-contact-email")) {
      el.textContent = contactEmail;
    }
  });

  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  document.querySelectorAll(".tile").forEach((tile) => {
    tile.addEventListener("pointermove", (e) => {
      const rect = tile.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      tile.style.setProperty("--mx", `${x}px`);
      tile.style.setProperty("--my", `${y}px`);
      const rx = ((y / rect.height) - 0.5) * -4;
      const ry = ((x / rect.width) - 0.5) * 4;
      tile.style.transform = `translateY(-6px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    tile.addEventListener("pointerleave", () => {
      tile.style.transform = "";
    });
  });

  const revealEls = document.querySelectorAll(".reveal, .timeline, .stat");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-in"));
  }

  document.querySelectorAll("[data-count]").forEach((el) => {
    const target = Number(el.getAttribute("data-count") || "0");
    const suffix = el.getAttribute("data-suffix") || "";
    const prefix = el.getAttribute("data-prefix") || "";
    const parent = el.closest(".stat") || el;
    const run = () => {
      const start = performance.now();
      const dur = 1100;
      const tick = (now) => {
        const t = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - t, 3);
        const value = Math.round(target * eased);
        el.textContent = `${prefix}${value}${suffix}`;
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if ("IntersectionObserver" in window) {
      const cio = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          run();
          cio.disconnect();
        }
      });
      cio.observe(parent);
    } else {
      run();
    }
  });

  // Share helpers on thank-you page
  document.querySelectorAll("[data-share-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const url = btn.getAttribute("data-share-copy") || window.location.origin + "/";
      try {
        await navigator.clipboard.writeText(url);
        btn.textContent = "Link copied";
        setTimeout(() => {
          btn.textContent = "Copy link";
        }, 2000);
      } catch (_) {
        window.prompt("Copy this link:", url);
      }
    });
  });

  // Waitlist form
  if (form) {
    const started = Date.now();
    const failure = form.querySelector(".form-error");
    const submitBtn = form.querySelector('button[type="submit"]');
    const note = form.querySelector(".form-note");

    if (formEndpoint) {
      form.dataset.endpoint = formEndpoint;
      if (note) {
        note.textContent = "No spam. We'll reach out when your spot opens.";
      }
    }

    const selectedLabel = (select) =>
      select && select.value ? select.options[select.selectedIndex].text : "";

    const showError = (message) => {
      if (!failure) return;
      failure.hidden = false;
      failure.textContent = message;
    };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const hp = form.querySelector('input[name="company_website"]');
      if (hp && hp.value) return;
      if (Date.now() - started < 1200) return;

      let valid = true;
      form.querySelectorAll("[required]").forEach((field) => {
        const wrap = field.closest(".field");
        const ok = field.checkValidity();
        if (wrap) wrap.classList.toggle("is-invalid", !ok);
        if (!ok) valid = false;
      });
      if (!valid) return;

      if (!formEndpoint) {
        showError(`The waitlist isn't connected yet. Email us at ${contactEmail}.`);
        return;
      }

      const industrySelect = form.querySelector("#waitlist-industry");
      const employeesSelect = form.querySelector("#waitlist-employees");
      const revenueSelect = form.querySelector("#waitlist-revenue");
      const payload = {
        name: form.querySelector("#waitlist-name")?.value?.trim() || "",
        email: form.querySelector("#waitlist-email")?.value?.trim() || "",
        company: form.querySelector("#waitlist-company")?.value?.trim() || "",
        industry: industrySelect?.value || "",
        industry_label: selectedLabel(industrySelect),
        employees: employeesSelect?.value || "",
        employees_label: selectedLabel(employeesSelect),
        revenue: revenueSelect?.value || "",
        revenue_label: selectedLabel(revenueSelect),
        demo_industry: form.querySelector("#demo-industry")?.value || "",
        demo_employees: form.querySelector("#demo-employees")?.value || "",
        demo_goal: form.querySelector("#demo-goal")?.value || "",
        source: form.dataset.source || "homepage",
        _subject: "DataDashOS waitlist signup",
      };

      if (failure) failure.hidden = true;
      if (submitBtn) submitBtn.disabled = true;

      try {
        const res = await fetch(formEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`Waitlist request failed: ${res.status}`);
        const params = new URLSearchParams();
        if (payload.industry) params.set("industry", payload.industry);
        if (payload.employees) params.set("size", payload.employees);
        params.set("joined", "1");
        const qs = params.toString();
        window.location.href = `thank-you.html${qs ? `?${qs}` : ""}`;
      } catch (_) {
        showError(
          `Something went wrong — please try again, or email ${contactEmail}.`
        );
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }
})();
