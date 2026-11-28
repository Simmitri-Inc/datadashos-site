(() => {
  // GitHub Pages can't send frame-ancestors / X-Frame-Options, so refuse to render inside another site's frame.
  if (window.top !== window.self) {
    try {
      window.top.location.href = window.location.href;
    } catch (_) {
      document.documentElement.style.display = "none";
    }
  }

  document.documentElement.classList.add("js-ready");

  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  const mobileCta = document.querySelector(".mobile-cta");
  const yearEls = document.querySelectorAll("[data-year]");

  const cfg = window.DATADASHOS_CONFIG || {};
  const contactEmail = (cfg.contactEmail || "hello@datadashos.com").trim();

  document.querySelectorAll("[data-pending-notice]").forEach((el) => {
    if (new URLSearchParams(window.location.search).get("status") === "pending") el.hidden = false;
  });

  const statusViews = document.querySelectorAll("[data-status-view]");
  if (statusViews.length) {
    const wanted = new URLSearchParams(window.location.search).get("status") || "ok";
    const match = [...statusViews].some((v) => v.dataset.statusView === wanted) ? wanted : "ok";
    statusViews.forEach((v) => {
      v.hidden = v.dataset.statusView !== match;
    });
  }

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

  const darkHero = document.querySelector(".has-dark-hero .hero:not(.page-hero-section)");
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 12);
    if (darkHero) {
      const heroBottom = darkHero.offsetTop + darkHero.offsetHeight - header.offsetHeight;
      header.classList.toggle("is-over-hero", window.scrollY < heroBottom);
    }
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  let lastFocus = null;
  const setNavOpen = (open) => {
    if (!toggle || !nav) return;
    const wasOpen = nav.classList.contains("is-open");
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.style.overflow = open ? "hidden" : "";
    if (open && !wasOpen) {
      lastFocus = document.activeElement;
      const first = nav.querySelector("a");
      if (first) first.focus();
    } else if (!open && wasOpen) {
      (lastFocus || toggle).focus?.();
      lastFocus = null;
    }
  };

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      setNavOpen(!nav.classList.contains("is-open"));
    });
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setNavOpen(false));
    });
    document.addEventListener("keydown", (e) => {
      if (!nav.classList.contains("is-open")) return;
      if (e.key === "Escape") {
        setNavOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const focusables = [toggle, ...nav.querySelectorAll("a")];
      const i = focusables.indexOf(document.activeElement);
      if (e.shiftKey) {
        if (i <= 0) {
          e.preventDefault();
          focusables[focusables.length - 1].focus();
        }
      } else if (i === focusables.length - 1 || i === -1) {
        e.preventDefault();
        focusables[0].focus();
      }
    });
    document.addEventListener("pointerdown", (e) => {
      if (!nav.classList.contains("is-open")) return;
      if (nav.contains(e.target) || toggle.contains(e.target)) return;
      setNavOpen(false);
    });
  }

  // Hide sticky mobile CTA when a lead form is in view or focused (so submit isn't covered).
  if (mobileCta && "IntersectionObserver" in window) {
    const formZones = document.querySelectorAll("#waitlist, #early-access, form[data-form-type]");
    let formInView = false;
    let formFocused = false;
    const syncMobileCta = () => {
      mobileCta.classList.toggle("is-hidden", formInView || formFocused);
    };
    if (formZones.length) {
      const fio = new IntersectionObserver(
        (entries) => {
          formInView = entries.some((e) => e.isIntersecting);
          syncMobileCta();
        },
        { threshold: 0.12 }
      );
      formZones.forEach((el) => fio.observe(el));
      document.querySelectorAll("form[data-form-type]").forEach((form) => {
        form.addEventListener("focusin", () => {
          formFocused = true;
          syncMobileCta();
        });
        form.addEventListener("focusout", () => {
          requestAnimationFrame(() => {
            formFocused = Boolean(form.querySelector(":focus"));
            syncMobileCta();
          });
        });
      });
    }
  }

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
})();
