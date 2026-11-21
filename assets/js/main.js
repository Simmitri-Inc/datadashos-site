(() => {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  const form = document.querySelector("#waitlist-form");
  const yearEls = document.querySelectorAll("[data-year]");

  yearEls.forEach((el) => {
    el.textContent = String(new Date().getFullYear());
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

  // Spotlight + gentle tilt on interactive tiles
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

  // Reveal on scroll
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

  // Animated counters
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

  // Waitlist form with honeypot + client validation.
  // POSTs JSON to data-endpoint when set; otherwise falls back to a mailto draft.
  if (form) {
    const started = Date.now();
    const endpoint = (form.dataset.endpoint || "").trim();
    const success = form.querySelector(".form-success");
    const failure = form.querySelector(".form-error");
    const note = form.querySelector(".form-note");
    const submitBtn = form.querySelector('button[type="submit"]');

    if (endpoint) {
      if (note && note.dataset.noteEndpoint) note.textContent = note.dataset.noteEndpoint;
      if (success && success.dataset.successEndpoint) success.textContent = success.dataset.successEndpoint;
    }

    const selectedLabel = (select) =>
      select && select.value ? select.options[select.selectedIndex].text : "";

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

      const industrySelect = form.querySelector("#waitlist-industry");
      const employeesSelect = form.querySelector("#waitlist-employees");
      const payload = {
        name: form.querySelector("#waitlist-name")?.value?.trim() || "",
        email: form.querySelector("#waitlist-email")?.value?.trim() || "",
        industry: industrySelect?.value || "",
        employees: employeesSelect?.value || "",
        source: "homepage",
      };

      if (failure) failure.hidden = true;

      if (!endpoint) {
        const subject = encodeURIComponent("DataDashOS waitlist signup");
        const body = encodeURIComponent(
          `Waitlist signup\n\nName: ${payload.name}\nEmail: ${payload.email}` +
            `\nIndustry: ${selectedLabel(industrySelect) || "—"}` +
            `\nNumber of employees: ${selectedLabel(employeesSelect) || "—"}`
        );
        if (success) success.classList.add("is-visible");
        window.location.href = `mailto:hello@simmitri.com?subject=${subject}&body=${body}`;
        return;
      }

      if (submitBtn) submitBtn.disabled = true;
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`Waitlist request failed: ${res.status}`);
        if (success) success.classList.add("is-visible");
        form.reset();
      } catch (err) {
        if (failure) failure.hidden = false;
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }
})();
