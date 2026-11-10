// Ayaan Sulman: portfolio. Small, dependency-free enhancements.
(function () {
  "use strict";

  var root = document.documentElement;
  var media = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  // ---- Theme toggle -------------------------------------------------------
  function currentTheme() {
    var set = root.getAttribute("data-theme");
    if (set === "light" || set === "dark") return set;
    return media && media.matches ? "dark" : "light";
  }

  function syncToggle() {
    var dark = currentTheme() === "dark";
    document.querySelectorAll(".theme-toggle").forEach(function (btn) {
      btn.setAttribute("aria-pressed", dark ? "true" : "false");
      btn.setAttribute("title", dark ? "Switch to light theme" : "Switch to dark theme");
    });
    var meta = document.querySelectorAll('meta[name="theme-color"]');
    meta.forEach(function (m) { m.setAttribute("content", dark ? "#0D1526" : "#F6F7F9"); m.removeAttribute("media"); });
  }

  document.querySelectorAll(".theme-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      syncToggle();
    });
  });

  if (media) {
    var onChange = function () { if (!root.hasAttribute("data-theme")) syncToggle(); };
    if (media.addEventListener) media.addEventListener("change", onChange);
    else if (media.addListener) media.addListener(onChange);
  }
  syncToggle();

  // ---- Copy email ---------------------------------------------------------
  document.querySelectorAll(".copy-email").forEach(function (btn) {
    var label = btn.textContent;
    var status = btn.parentNode.querySelector(".copy-status");
    var timer;

    btn.addEventListener("click", function () {
      var email = btn.getAttribute("data-email");
      var done = function (ok) {
        btn.textContent = ok ? "Copied" : "Address selected";
        if (status) status.textContent = ok ? "Email address copied" : "";
        clearTimeout(timer);
        timer = setTimeout(function () {
          btn.textContent = label;
          if (status) status.textContent = "";
        }, 2000);
      };

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email).then(function () { done(true); }, function () { fallback(); });
      } else {
        fallback();
      }

      function fallback() {
        // Select the address so the visitor can copy it themselves.
        var link = btn.parentNode.querySelector(".email-link");
        if (link && window.getSelection) {
          var range = document.createRange();
          range.selectNodeContents(link);
          var sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
        }
        done(false);
      }
    });
  });

  // ---- Footer year --------------------------------------------------------
  document.querySelectorAll(".year").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
