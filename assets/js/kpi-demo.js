/*
 * "Try it" KPI demo widget. Mounts into any element with [data-kpi-demo].
 * Requires kpi-blueprints.js to be loaded first.
 *
 * Optional mount attributes:
 *   data-waitlist          selector of the section to scroll to (default "#waitlist")
 *   data-prefill-industry  selector of the waitlist industry <select>
 *   data-prefill-employees selector of the waitlist employees <select>
 *   data-prefill-goal      selector of a hidden/demo goal field
 *   data-prefill-focus     selector of the field to focus after scrolling
 */
(() => {
  const B = window.DataDashKpiBlueprints;
  const mounts = document.querySelectorAll("[data-kpi-demo]");
  if (!B || !mounts.length) return;

  const prefersReducedMotion = () =>
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const el = (tag, attrs = {}, children = []) => {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([key, value]) => {
      if (value === null || value === undefined || value === false) return;
      if (key === "text") node.textContent = value;
      else if (key === "className") node.className = value;
      else node.setAttribute(key, value === true ? "" : value);
    });
    (Array.isArray(children) ? children : [children]).forEach((child) => {
      if (child) node.append(child);
    });
    return node;
  };

  const QUESTIONS = [
    { name: "industry", legend: "Industry", options: B.INDUSTRIES, error: "Choose your industry." },
    { name: "employees", legend: "Number of employees", options: B.EMPLOYEE_RANGES, error: "Choose your team size." },
    { name: "goal", legend: "Top goal", options: B.GOALS, error: "Choose your top goal." },
  ];

  const CADENCE = { weekly: "Weekly", monthly: "Monthly" };

  let instance = 0;

  mounts.forEach((mount) => {
    instance += 1;
    const uid = `kpi-demo-${instance}`;

    const form = el("form", { className: "kpi-demo-form", novalidate: true, "aria-label": "Sample KPI questions" });

    QUESTIONS.forEach((q, qi) => {
      const errorId = `${uid}-${q.name}-error`;
      const fieldset = el("fieldset", { className: "kpi-q", "aria-describedby": errorId });
      fieldset.append(
        el("legend", {}, [
          el("span", { className: "kpi-q-num", "aria-hidden": "true", text: String(qi + 1) }),
          el("span", { text: q.legend }),
        ])
      );
      const options = el("div", { className: "kpi-options" });
      Object.entries(q.options).forEach(([value, opt]) => {
        const id = `${uid}-${q.name}-${value.replace(/[^a-z0-9]/gi, "")}`;
        options.append(
          el("div", { className: "kpi-option" }, [
            el("input", { type: "radio", id, name: q.name, value, required: true }),
            el("label", { for: id, text: opt.label }),
          ])
        );
      });
      fieldset.append(options, el("p", { className: "kpi-q-error", id: errorId, text: "" }));
      form.append(fieldset);
    });

    const submit = el("button", { className: "btn btn-navy kpi-demo-submit", type: "submit" }, [
      document.createTextNode("Show my KPIs "),
      el("span", { className: "arrow", "aria-hidden": "true", text: "→" }),
    ]);
    form.append(el("div", { className: "kpi-demo-actions" }, submit));

    const headingId = `${uid}-results-title`;
    const results = el("div", { className: "kpi-results", hidden: true });
    const status = el("p", { className: "kpi-sr-only", role: "status" });

    mount.replaceChildren(form, status, results);

    const readAnswers = () => {
      const data = new FormData(form);
      return { industry: data.get("industry"), employees: data.get("employees"), goal: data.get("goal") };
    };

    const validate = (answers) => {
      let firstInvalid = null;
      QUESTIONS.forEach((q) => {
        const fieldset = form.querySelector(`[name="${q.name}"]`).closest("fieldset");
        const error = fieldset.querySelector(".kpi-q-error");
        const ok = Boolean(answers[q.name]);
        fieldset.classList.toggle("is-invalid", !ok);
        error.textContent = ok ? "" : q.error;
        if (!ok && !firstInvalid) firstInvalid = fieldset.querySelector("input");
      });
      return firstInvalid;
    };

    const renderResults = (answers, { moveFocus }) => {
      const result = B.getSampleKpis(answers.industry, answers.employees, answers.goal);
      if (!result) return;

      const heading = el("h3", { id: headingId, className: "kpi-results-title", tabindex: "-1", text: "Your sample KPI scorecard" });
      const summary = el("p", {
        className: "kpi-results-summary",
        text: "Here are five KPIs businesses like yours use to measure success, with a typical target for each.",
      });
      const context = el("p", {
        className: "kpi-results-context",
        text: `${result.industryLabel} · ${result.employeesLabel} employees · Goal: ${result.goalLabel}`,
      });

      const list = el("ol", { className: "kpi-cards", "aria-labelledby": headingId });
      result.kpis.forEach((kpi, index) => {
        const meta = [CADENCE[kpi.cadence], kpi.leading ? "Leading indicator" : null].filter(Boolean).join(" · ");
        const card = el("li", { className: "kpi-card" }, [
          el("div", { className: "kpi-card-top" }, [
            el("span", { className: "kpi-card-rank", "aria-hidden": "true", text: String(index + 1).padStart(2, "0") }),
            el("span", { className: "kpi-card-meta", text: meta }),
          ]),
          el("h4", { className: "kpi-card-name", text: kpi.name }),
          el("p", { className: "kpi-card-def", text: kpi.definition }),
        ]);
        if (kpi.target) {
          card.append(
            el("p", { className: "kpi-card-target" }, [
              el("span", { className: "kpi-card-target-label", text: "Example target" }),
              el("strong", { text: kpi.target }),
              kpi.targetSource === "industry median"
                ? el("span", { className: "kpi-card-target-src", text: "industry median" })
                : null,
            ])
          );
        }
        list.append(card);
      });

      const cta = el("button", { className: "btn btn-shimmer kpi-results-cta", type: "button" }, [
        document.createTextNode("Get my full scorecard — join the waitlist "),
        el("span", { className: "arrow", "aria-hidden": "true", text: "→" }),
      ]);
      cta.addEventListener("click", () => goToWaitlist(answers));

      results.replaceChildren(
        heading,
        summary,
        context,
        list,
        el("p", { className: "kpi-results-disclaimer", text: "Sample KPIs based on your answers. Your full scorecard is tailored to your actual data." }),
        el("div", { className: "kpi-results-actions" }, cta)
      );
      results.hidden = false;
      mount.classList.add("has-results");
      status.textContent = `Your sample KPI scorecard is ready: ${result.kpis.map((k) => k.name).join(", ")}.`;

      if (moveFocus) {
        heading.focus({ preventScroll: true });
        results.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
      }
    };

    const goToWaitlist = (answers) => {
      const target = document.querySelector(mount.dataset.waitlist || "#waitlist");
      const setSelect = (selector, value) => {
        const select = selector && document.querySelector(selector);
        if (!select) return;
        if ([...select.options].some((o) => o.value === value)) {
          select.value = value;
          select.dispatchEvent(new Event("change", { bubbles: true }));
        }
      };
      setSelect(mount.dataset.prefillIndustry, answers.industry);
      setSelect(mount.dataset.prefillEmployees, answers.employees);

      const setValue = (selector, value) => {
        const field = selector && document.querySelector(selector);
        if (!field || value == null) return;
        field.value = value;
        field.dispatchEvent(new Event("change", { bubbles: true }));
      };
      setValue(mount.dataset.prefillGoal, answers.goal);
      setValue("#demo-industry", answers.industry);
      setValue("#demo-employees", answers.employees);
      setValue("#demo-goal", answers.goal);

      if (!target) return;
      target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
      const focusEl = mount.dataset.prefillFocus && document.querySelector(mount.dataset.prefillFocus);
      if (focusEl) focusEl.focus({ preventScroll: true });
    };

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const answers = readAnswers();
      const firstInvalid = validate(answers);
      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }
      renderResults(answers, { moveFocus: true });
    });

    form.addEventListener("change", () => {
      const answers = readAnswers();
      QUESTIONS.forEach((q) => {
        if (!answers[q.name]) return;
        const fieldset = form.querySelector(`[name="${q.name}"]`).closest("fieldset");
        fieldset.classList.remove("is-invalid");
        fieldset.querySelector(".kpi-q-error").textContent = "";
      });
      if (!results.hidden && answers.industry && answers.employees && answers.goal) {
        renderResults(answers, { moveFocus: false });
      }
    });
  });
})();
