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
    ".h2, .lead, .tile, .svc, .case, .step, .facts, .fit__col, .form, .week, .about__photo, .contact__text"
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

  /* Active nav link */
  var links = document.querySelectorAll(".nav__links a");
  var sections = Array.prototype.map.call(links, function (a) {
    return document.querySelector(a.getAttribute("href"));
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

  /* Contact form: validate, compose Telegram message, open t.me */
  var form = document.querySelector("[data-tg-form]");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      form.querySelectorAll(".field").forEach(function (f) {
        var input = f.querySelector("[required]");
        if (!input) return;
        var bad = !input.value.trim();
        f.classList.toggle("is-invalid", bad);
        if (bad && ok) { input.focus(); ok = false; }
      });
      if (!ok) return;

      var name = form.name.value.trim();
      var company = form.company.value.trim();
      var needs = Array.prototype.map.call(
        form.querySelectorAll('input[name="need"]:checked'),
        function (c) { return c.value; }
      ).join(", ");
      var msg = form.message.value.trim();

      var text = "Привет, Гео! Меня зовут " + name + "." +
        (company ? " Компания: " + company + "." : "") +
        (needs ? " Нужно: " + needs + "." : "") +
        "\n\n" + msg;

      window.open("https://t.me/mr_geos?text=" + encodeURIComponent(text), "_blank", "noopener");
    });
    form.querySelectorAll("[required]").forEach(function (input) {
      input.addEventListener("input", function () {
        input.closest(".field").classList.remove("is-invalid");
      });
    });
  }
})();
