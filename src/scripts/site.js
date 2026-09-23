(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Mobile menu */
  var burger = document.querySelector(".burger");
  var menu = document.getElementById("mobile-menu");
  if (burger && menu) {
    var setMenu = function (open) {
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
      menu.hidden = !open;
      document.body.style.overflow = open ? "hidden" : "";
    };
    burger.addEventListener("click", function () {
      setMenu(burger.getAttribute("aria-expanded") !== "true");
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !menu.hidden) setMenu(false);
    });
  }

  /* Marquee: duplicate track so the loop is seamless */
  document.querySelectorAll("[data-marquee] .marquee__track").forEach(function (track) {
    track.innerHTML += track.innerHTML;
    track.setAttribute("aria-hidden", "false");
  });

  /* Scroll reveal via IntersectionObserver */
  var targets = document.querySelectorAll(
    ".h2, .lead, .tile, .svc, .case, .step, .facts, .fit__col, .week, .about__photo, .contact__text, .ccard, .claim, .pricecol, .stat, .founder__quote, .mind__grid > div, .timeline, .promo__card"
  );
  if (!reduce && "IntersectionObserver" in window) {
    targets.forEach(function (el) { el.classList.add("reveal"); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting || en.boundingClientRect.top < 0) {
          en.target.classList.add("is-in");
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: "0px 0px -5% 0px", threshold: 0 });
    targets.forEach(function (el) { io.observe(el); });
  }

  /* Objections slider: dots switch slides, auto-advance unless reduced motion */
  document.querySelectorAll("[data-slider]").forEach(function (root) {
    var slides = root.querySelectorAll("[data-slide]");
    var dots = root.querySelectorAll("[data-dot]");
    if (!slides.length) return;
    var current = 0, timer = null;
    var show = function (i) {
      current = (i + slides.length) % slides.length;
      slides.forEach(function (s, k) { s.hidden = k !== current; });
      dots.forEach(function (d, k) { d.setAttribute("aria-selected", String(k === current)); });
    };
    var start = function () {
      if (reduce) return;
      stop();
      timer = window.setInterval(function () { show(current + 1); }, 6000);
    };
    var stop = function () { if (timer) { window.clearInterval(timer); timer = null; } };
    dots.forEach(function (d, k) { d.addEventListener("click", function () { show(k); start(); }); });
    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    root.addEventListener("focusin", stop);
    root.addEventListener("focusout", start);
    start();
  });

  /* Active nav link */
  var links = document.querySelectorAll(".nav__links a");
  var sections = Array.prototype.map.call(links, function (a) {
    var href = a.getAttribute("href") || "";
    return href.charAt(0) === "#" ? document.getElementById(href.slice(1)) : null;
  }).filter(Boolean);
  if (sections.length && "IntersectionObserver" in window) {
    var navIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + en.target.id);
        });
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    sections.forEach(function (s) { navIo.observe(s); });
  }

  /* Contact form: validate, compose message, open Telegram or copy */
  var form = document.querySelector("[data-tg-form]");
  if (form) {
    var hint = form.querySelector("[data-hint]");
    var compose = function () {
      var ok = true;
      form.querySelectorAll(".field").forEach(function (f) {
        var input = f.querySelector("[required]");
        if (!input) return;
        var bad = !input.value.trim();
        f.classList.toggle("is-invalid", bad);
        if (bad && ok) { input.focus(); ok = false; }
      });
      if (!ok) return null;
      var company = form.company.value.trim();
      var needs = Array.prototype.map.call(form.querySelectorAll('input[name="need"]:checked'), function (c) { return c.value; }).join(", ");
      return "Привет, Гео! Меня зовут " + form.name.value.trim() + "." +
        (company ? " Компания: " + company + "." : "") +
        (needs ? " Нужно: " + needs + "." : "") +
        "\n\n" + form.message.value.trim();
    };
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var text = compose();
      if (text) window.open("https://t.me/mr_geos?text=" + encodeURIComponent(text), "_blank", "noopener");
    });
    var copyBtn = form.querySelector("[data-copy]");
    if (copyBtn) copyBtn.addEventListener("click", function () {
      var text = compose();
      if (!text) return;
      var done = function () { if (hint) hint.textContent = "Текст скопирован. Отправьте его в Telegram @mr_geos или на +7 916 814-04-06."; };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done, function () { window.prompt("Скопируйте текст:", text); });
      } else {
        window.prompt("Скопируйте текст:", text);
      }
    });
    form.querySelectorAll("[required]").forEach(function (input) {
      input.addEventListener("input", function () { input.closest(".field").classList.remove("is-invalid"); });
    });
  }
})();
