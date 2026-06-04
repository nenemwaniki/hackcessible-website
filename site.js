/* ============================================================
   Hackcessible — shared site chrome
   Injects the liquid-glass pill nav + footer on every page,
   wires the theme toggle, scroll-state, and mobile menu.
   ============================================================ */
(function () {
  // --- Theme: restore preference before paint already handled inline; sync here ---
  var root = document.documentElement;

  var NAV = [
    { href: "index.html", label: "Home" },
    { href: "model.html", label: "The model" },
    { href: "groups.html", label: "Groups" },
    { href: "people.html", label: "People" },
    { href: "contact.html", label: "Contact" }
  ];

  // current page (default index.html)
  var path = location.pathname.split("/").pop() || "index.html";

  var links = NAV.map(function (n) {
    var current = n.href === path ? ' aria-current="page"' : "";
    return '<a class="nav-link" href="' + n.href + '"' + current + ">" + n.label + "</a>";
  }).join("");

  var sunMoon =
    '<button class="theme-toggle" type="button" aria-label="Toggle dark mode" aria-pressed="false">' +
      '<svg class="icon-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>' +
      '<svg class="icon-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>' +
    "</button>";

  var menuBtn =
    '<button class="menu-toggle" type="button" aria-label="Open menu" aria-expanded="false">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>' +
    "</button>";

  var navHTML =
    '<div class="nav-shell">' +
      '<nav class="nav" aria-label="Primary">' +
        '<a class="brand" href="index.html"><span class="mark">H</span><span class="brand-word">Hackcessible</span></a>' +
        '<div class="nav-links" id="navLinks">' + links + "</div>" +
        '<div class="nav-actions">' + sunMoon + menuBtn + "</div>" +
      "</nav>" +
    "</div>";

  // Inject skip link + nav at top of body, spacer after.
  var mount = document.getElementById("site-nav");
  if (mount) {
    mount.innerHTML =
      '<a class="skip" href="#main">Skip to content</a>' + navHTML +
      '<div class="nav-spacer"></div>';
  }

  // --- Footer ---
  var footHTML =
    '<footer class="foot-wrap"><div class="wrap"><div class="foot">' +
      "<div>" +
        "<h3>Hackcessible</h3>" +
        "<p>A clinical-engineering programme hosted by CIME at AKU. Built by students with two Kenyan challengers and their families. Handed to CIME for ongoing stewardship.</p>" +
      "</div>" +
      '<div class="foot-col"><strong>Cohort 2026</strong>' +
        '<a href="groups.html#timekeeper">TimeKeeper</a>' +
        '<a href="groups.html#sawa">Sawa</a>' +
        '<a href="model.html#lessons">What we learned</a>' +
        '<a href="people.html">People</a>' +
      "</div>" +
      '<div class="foot-col"><strong>Programme</strong>' +
        '<a href="model.html">The model</a>' +
        '<a href="contact.html#sponsor">Sponsor</a>' +
        '<a href="contact.html#apply">Apply</a>' +
        '<a href="#top">Back to top &uarr;</a>' +
      "</div>" +
      '<div class="foot-col"><strong>Accessibility</strong>' +
        "<p>This page aims to meet WCAG 2.1 AA: semantic HTML, keyboard navigation, visible focus styles, reduced-motion support, and readable contrast.</p>" +
      "</div>" +
    "</div></div></footer>";

  var footMount = document.getElementById("site-footer");
  if (footMount) footMount.innerHTML = footHTML;

  // --- Behaviour wiring (after injection) ---
  var shell = document.querySelector(".nav-shell");
  var themeBtn = document.querySelector(".theme-toggle");
  var menuToggle = document.querySelector(".menu-toggle");
  var navLinks = document.getElementById("navLinks");

  // Scroll state — the pill "changes" (tighter, more opaque) once you scroll.
  function onScroll() {
    if (!shell) return;
    if (window.scrollY > 12) shell.classList.add("scrolled");
    else shell.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Theme toggle
  function setTheme(mode) {
    if (mode === "dark") root.setAttribute("data-theme", "dark");
    else root.removeAttribute("data-theme");
    try { localStorage.setItem("hk-theme", mode); } catch (e) {}
    if (themeBtn) themeBtn.setAttribute("aria-pressed", String(mode === "dark"));
  }
  if (themeBtn) {
    themeBtn.setAttribute(
      "aria-pressed",
      String(root.getAttribute("data-theme") === "dark")
    );
    themeBtn.addEventListener("click", function () {
      var isDark = root.getAttribute("data-theme") === "dark";
      setTheme(isDark ? "light" : "dark");
    });
  }

  // Mobile menu toggle
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    navLinks.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  }
})();
