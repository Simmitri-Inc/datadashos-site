/* Queues Plausible events fired before the Plausible script has loaded. Plausible sets no cookies. */
window.plausible =
  window.plausible ||
  function () {
    (window.plausible.q = window.plausible.q || []).push(arguments);
  };
