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
        '<div class="nav-links" id="navLinks"><div class="nav-indicator" id="navIndicator"></div>' + links + "</div>" +
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
      
      // Update indicator position if menu opens
      if (open && activeLink) {
        setTimeout(function() { moveNavIndicator(activeLink); }, 300);
      }
    });
    navLinks.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // --- Sliding Nav Indicator ---
  var navIndicator = document.getElementById("navIndicator");
  var navAnchors = navLinks ? navLinks.querySelectorAll(".nav-link") : [];
  var activeLink = navLinks ? navLinks.querySelector('[aria-current="page"]') : null;

  function moveNavIndicator(el) {
    if (!navIndicator || !el) return;
    navIndicator.style.opacity = '1';
    navIndicator.style.width = el.offsetWidth + 'px';
    navIndicator.style.height = el.offsetHeight + 'px';
    navIndicator.style.transform = 'translate(' + el.offsetLeft + 'px, ' + el.offsetTop + 'px)';
  }

  // Set initial position
  if (activeLink) {
    // Small delay to ensure layout is ready
    setTimeout(function() { moveNavIndicator(activeLink); }, 100);
    // Also update on window resize
    window.addEventListener('resize', function() {
      moveNavIndicator(activeLink);
    }, { passive: true });
  }

  // Hover interactions
  navAnchors.forEach(function(a) {
    a.addEventListener('mouseenter', function() {
      moveNavIndicator(a);
    });
  });

  if (navLinks) {
    navLinks.addEventListener('mouseleave', function() {
      if (activeLink) {
        moveNavIndicator(activeLink);
      } else {
        navIndicator.style.opacity = '0';
      }
    });
  }

  // --- SPA-Lite Navigation ---
  var main = document.querySelector('main') || document.body;
  var isNavigating = false;

  function navigate(url, addHistory) {
    if (isNavigating || url === location.pathname) return;
    if (addHistory === undefined) addHistory = true;

    isNavigating = true;

    // 1. Exit transition
    main.classList.add('page-exit');

    // 2. Fetch new content
    setTimeout(function() {
      fetch(url)
        .then(function(response) { 
          if (!response.ok) throw new Error('Network response was not ok');
          return response.text(); 
        })
        .then(function(html) {
          var parser = new DOMParser();
          var doc = parser.parseFromString(html, 'text/html');
          var newMain = doc.querySelector('main');
          var newTitle = doc.querySelector('title');

          if (newTitle) document.title = newTitle.innerText;
          if (newMain) {
            main.innerHTML = newMain.innerHTML;
            
            // Re-initialize scripts in new main
            var scripts = main.querySelectorAll('script');
            scripts.forEach(function(oldScript) {
              var newScript = document.createElement('script');
              Array.from(oldScript.attributes).forEach(function(attr) {
                newScript.setAttribute(attr.name, attr.value);
              });
              newScript.appendChild(document.createTextNode(oldScript.innerHTML));
              oldScript.parentNode.replaceChild(newScript, oldScript);
            });
          }

          if (addHistory) {
            history.pushState({ url: url }, '', url);
          }

          if (url.indexOf('#') === -1) {
            window.scrollTo(0, 0);
          } else {
            var hash = url.split('#')[1];
            setTimeout(function() {
              var el = document.getElementById(hash);
              if (el) el.scrollIntoView();
            }, 0);
          }

          isNavigating = false;

          // 3. Entry transition
          main.classList.remove('page-exit');
          main.classList.add('page-enter-start');

          // Update active link in nav
          var currentPath = location.pathname.split("/").pop() || "index.html";
          navAnchors.forEach(function(a) {
            var href = a.getAttribute('href');
            if (href === currentPath) {
              a.setAttribute('aria-current', 'page');
              activeLink = a;
            } else {
              a.removeAttribute('aria-current');
            }
          });
          
          if (activeLink) moveNavIndicator(activeLink);

          requestAnimationFrame(function() {
            requestAnimationFrame(function() {
              main.classList.remove('page-enter-start');
            });
          });
        })
        .catch(function(err) {
          console.error('Navigation failed:', err);
          isNavigating = false;
          window.location.href = url; // Fallback
        });
    }, 300);
  }

  // Intercept internal links
  document.addEventListener('click', function(e) {
    var link = e.target.closest('a');
    if (!link) return;

    var href = link.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    
    // Ignore special clicks (cmd/ctrl)
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    e.preventDefault();
    navigate(href);
  });

  // Handle back/forward
  window.addEventListener('popstate', function() {
    var url = location.pathname.split("/").pop() || "index.html";
    if (location.search || location.hash) {
      url += location.search + location.hash;
    }
    navigate(url, false);
  });
})();
