/* Hackcessible — experience enhancements. Additive: nothing in site.js is replaced. */
(function () {
  var root = document.documentElement;
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var body = document.body;

  /* ---------------- fixtures ---------------- */
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  var progress = el("div", "scroll-progress");
  progress.setAttribute("aria-hidden", "true");

  var toTop = el("button", "to-top",
    '<svg viewBox="0 0 24 24"><path d="M12 19V5M6 11l6-6 6 6"/></svg>');
  toTop.type = "button";
  toTop.setAttribute("aria-label", "Back to top");

  var toast = el("div", "toast",
    '<svg viewBox="0 0 24 24"><path d="M4 12.5 9 17.5 20 6.5"/></svg><span></span>');
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");

  var lightbox = el("div", "lightbox",
    '<div class="lightbox-stage"><div class="lightbox-media">' +
      '<img alt="">' +
      '<div class="lightbox-nav">' +
        '<button class="lb-btn" type="button" data-lb="prev" aria-label="Previous image"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></button>' +
        '<button class="lb-btn" type="button" data-lb="next" aria-label="Next image"><svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg></button>' +
      '</div>' +
      '<button class="lb-btn lightbox-close" type="button" data-lb="close" aria-label="Close viewer"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
    '</div></div>' +
    '<div class="lightbox-bar"><p></p><small></small></div>');
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", "Image viewer");

  var cmdk = el("div", "cmdk",
    '<div class="cmdk-panel">' +
      '<input type="text" placeholder="Jump to a page or action…" aria-label="Quick jump" autocomplete="off" spellcheck="false">' +
      '<ul class="cmdk-list" role="listbox"></ul>' +
      '<div class="cmdk-hint"><span><kbd>↑</kbd><kbd>↓</kbd> move</span><span><kbd>Enter</kbd> open</span><span><kbd>Esc</kbd> close</span></div>' +
    '</div>');

  body.appendChild(progress);
  body.appendChild(toTop);
  body.appendChild(toast);
  body.appendChild(lightbox);
  body.appendChild(cmdk);

  /* ---------------- scroll: progress, back-to-top, hero parallax ---------------- */
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var y = window.scrollY || 0;
      var max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      var p = Math.min(1, y / max);
      progress.style.transform = "scaleX(" + p + ")";
      progress.classList.toggle("on", y > 8);
      toTop.style.setProperty("--sp", p.toFixed(3));
      toTop.classList.toggle("on", y > innerHeight * 0.7);
      if (!reduce) {
        var img = document.querySelector(".home-hero img");
        if (img) {
          var hero = img.closest(".home-hero");
          var shift = Math.min(40, y * 0.1);
          if (y < hero.offsetHeight + 200) img.style.transform = "translate3d(0," + shift + "px,0) scale(1.12)";
        }
      }
      ticking = false;
    });
  }
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll);
  onScroll();

  toTop.addEventListener("click", function () {
    scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  });

  /* ---------------- nav: sliding pill indicator ---------------- */
  function navIndicator() {
    var links = document.getElementById("navLinks");
    if (!links || links.querySelector(".nav-ind")) return;
    var ind = el("span", "nav-ind");
    ind.setAttribute("aria-hidden", "true");
    links.appendChild(ind);
    var move = function (target) {
      if (!target || innerWidth < 761) return;
      ind.style.width = target.offsetWidth + "px";
      ind.style.height = target.offsetHeight + "px";
      ind.style.transform = "translate(" + target.offsetLeft + "px," + target.offsetTop + "px)";
      links.classList.add("ind-on");
    };
    var rest = function () {
      var cur = links.querySelector('[aria-current="page"]');
      if (cur) move(cur); else links.classList.remove("ind-on");
    };
    links.addEventListener("pointerover", function (e) {
      var a = e.target.closest(".nav-link");
      if (a) move(a);
    });
    links.addEventListener("pointerleave", rest);
    links.addEventListener("focusin", function (e) {
      var a = e.target.closest(".nav-link");
      if (a) move(a);
    });
    addEventListener("resize", rest);
    requestAnimationFrame(rest);
    setTimeout(rest, 400);
  }
  navIndicator();

  /* ---------------- theme toggle: circular view transition ---------------- */
  (function () {
    var btn = document.querySelector(".theme-toggle");
    if (!btn || !document.startViewTransition || reduce) return;
    var original = btn.onclick;
    if (!original) return;
    btn.onclick = function (e) {
      var r = btn.getBoundingClientRect();
      root.style.setProperty("--vt-x", ((r.left + r.width / 2) / innerWidth * 100).toFixed(1) + "%");
      root.style.setProperty("--vt-y", ((r.top + r.height / 2) / innerHeight * 100).toFixed(1) + "%");
      document.startViewTransition(function () { original.call(btn, e); });
    };
  })();

  /* ---------------- cursor spotlight on cards ---------------- */
  addEventListener("pointermove", function (e) {
    var card = e.target.closest(".door,.project-card");
    if (!card) return;
    var r = card.getBoundingClientRect();
    card.style.setProperty("--mx", (e.clientX - r.left) + "px");
    card.style.setProperty("--my", (e.clientY - r.top) + "px");
  }, { passive: true });

  /* ---------------- lazy image fade-in ---------------- */
  document.addEventListener("load", function (e) {
    var t = e.target;
    if (t && t.tagName === "IMG" && t.classList.contains("lz")) t.classList.add("ready");
  }, true);
  function markLazy() {
    document.querySelectorAll(".moments img,.surface-grid img,.person-card img").forEach(function (img) {
      if (img.dataset.lzBound) return;
      img.dataset.lzBound = "1";
      if (img.complete) return;
      img.classList.add("lz");
      img.addEventListener("load", function () { img.classList.add("ready"); });
      img.addEventListener("error", function () { img.classList.add("ready"); });
    });
  }

  /* ---------------- hero scroll cue ---------------- */
  function heroCue() {
    var hero = document.querySelector(".home-hero");
    if (!hero || hero.querySelector(".hero-cue")) return;
    hero.appendChild(el("div", "hero-cue", '<span>Scroll</span><i></i>'));
  }

  /* ---------------- moments lightbox ---------------- */
  var lbImg = lightbox.querySelector("img");
  var lbCap = lightbox.querySelector(".lightbox-bar p");
  var lbCount = lightbox.querySelector(".lightbox-bar small");
  var shots = [];
  var at = 0;
  var lastFocus = null;

  function collect() {
    shots = [].slice.call(document.querySelectorAll(".moments figure")).map(function (f) {
      var img = f.querySelector("img");
      var cap = f.querySelector("figcaption");
      return { src: img.currentSrc || img.src, alt: img.alt || "", cap: cap ? cap.textContent : "" };
    });
  }
  function paint() {
    var s = shots[at];
    if (!s) return;
    lbImg.src = s.src;
    lbImg.alt = s.alt;
    lbCap.textContent = s.cap;
    lbCount.textContent = (at + 1) + " / " + shots.length;
  }
  function openLb(i) {
    collect();
    if (!shots.length) return;
    at = i;
    paint();
    lastFocus = document.activeElement;
    lightbox.classList.add("open");
    body.style.overflow = "hidden";
    lightbox.querySelector('[data-lb="next"]').focus();
  }
  function closeLb() {
    lightbox.classList.remove("open");
    body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function step(d) {
    if (!shots.length) return;
    at = (at + d + shots.length) % shots.length;
    paint();
  }
  document.addEventListener("click", function (e) {
    var fig = e.target.closest(".moments figure");
    if (fig && !e.target.closest("a")) {
      var figs = [].slice.call(document.querySelectorAll(".moments figure"));
      openLb(figs.indexOf(fig));
      return;
    }
    var lb = e.target.closest("[data-lb]");
    if (lb) {
      var k = lb.dataset.lb;
      if (k === "close") closeLb();
      if (k === "prev") step(-1);
      if (k === "next") step(1);
      return;
    }
    if (e.target === lightbox || e.target.classList.contains("lightbox-stage")) closeLb();
  });

  /* ---------------- quick jump palette ---------------- */
  var cmdInput = cmdk.querySelector("input");
  var cmdList = cmdk.querySelector(".cmdk-list");
  var actions = [
    { t: "Home", s: "Page", i: "H", go: "index.html" },
    { t: "Cohort 2026", s: "Page", i: "C", go: "cohorts.html" },
    { t: "People", s: "Page", i: "P", go: "people.html" },
    { t: "Contact", s: "Page", i: "@", go: "contact.html" },
    { t: "Sponsor a cohort", s: "Action", i: "★", go: "contact.html#sponsor" },
    { t: "Join the student interest list", s: "Action", i: "＋", go: "contact.html#interest" },
    { t: "TimeKeeper case study", s: "Case", i: "1", go: "cohorts.html#timekeeper" },
    { t: "Sawa case study", s: "Case", i: "2", go: "cohorts.html#sawa" },
    { t: "Toggle dark mode", s: "Action", i: "◐", run: function () { var b = document.querySelector(".theme-toggle"); if (b) b.click(); } },
    { t: "Email nbi.cime@aku.edu", s: "Action", i: "✉", run: function () { location.href = "mailto:nbi.cime@aku.edu"; } }
  ];
  var shown = actions.slice();
  var pick = 0;

  function renderCmd() {
    cmdList.innerHTML = shown.map(function (a, i) {
      return '<li role="option" data-i="' + i + '" aria-selected="' + (i === pick) + '"><i>' + a.i + '</i>' + a.t + '<small>' + a.s + '</small></li>';
    }).join("") || '<li aria-selected="false" style="cursor:default;color:var(--muted)">No matches</li>';
  }
  function filter(q) {
    q = q.trim().toLowerCase();
    shown = q ? actions.filter(function (a) { return (a.t + " " + a.s).toLowerCase().indexOf(q) > -1; }) : actions.slice();
    pick = 0;
    renderCmd();
  }
  function openCmd() {
    filter("");
    cmdInput.value = "";
    cmdk.classList.add("open");
    setTimeout(function () { cmdInput.focus(); }, 40);
  }
  function closeCmd() { cmdk.classList.remove("open"); }
  function runCmd(a) {
    if (!a) return;
    closeCmd();
    if (a.run) return a.run();
    var link = document.createElement("a");
    link.href = a.go;
    link.style.display = "none";
    body.appendChild(link);
    link.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, view: window }));
    setTimeout(function () { link.remove(); }, 0);
  }
  cmdInput.addEventListener("input", function () { filter(cmdInput.value); });
  cmdList.addEventListener("click", function (e) {
    var li = e.target.closest("li[data-i]");
    if (li) runCmd(shown[+li.dataset.i]);
  });
  cmdList.addEventListener("pointerover", function (e) {
    var li = e.target.closest("li[data-i]");
    if (li) { pick = +li.dataset.i; renderCmd(); }
  });
  cmdk.addEventListener("click", function (e) { if (e.target === cmdk) closeCmd(); });

  addEventListener("keydown", function (e) {
    var k = e.key.toLowerCase();
    if ((e.metaKey || e.ctrlKey) && k === "k") {
      e.preventDefault();
      cmdk.classList.contains("open") ? closeCmd() : openCmd();
      return;
    }
    if (e.key === "Escape") {
      if (lightbox.classList.contains("open")) return closeLb();
      if (cmdk.classList.contains("open")) return closeCmd();
    }
    if (lightbox.classList.contains("open")) {
      if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
      return;
    }
    if (cmdk.classList.contains("open")) {
      if (e.key === "ArrowDown") { e.preventDefault(); pick = Math.min(shown.length - 1, pick + 1); renderCmd(); }
      if (e.key === "ArrowUp") { e.preventDefault(); pick = Math.max(0, pick - 1); renderCmd(); }
      if (e.key === "Enter") { e.preventDefault(); runCmd(shown[pick]); }
    }
  });

  /* ---------------- toast on interest submit ---------------- */
  var toastText = toast.querySelector("span");
  var toastTimer;
  function say(msg) {
    toastText.textContent = msg;
    toast.classList.add("on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("on"); }, 3600);
  }
  document.addEventListener("submit", function (e) {
    if (e.target && e.target.id === "interestForm") say("Opening your email with the details filled in");
  });

  /* ---------------- re-run DOM-dependent bits after SPA swaps ---------------- */
  function mount() { heroCue(); markLazy(); navIndicator(); }
  mount();
  var main = document.getElementById("main");
  if (main && window.MutationObserver) {
    var mo = new MutationObserver(function () { setTimeout(mount, 60); onScroll(); });
    mo.observe(main, { childList: true });
  }
})();
