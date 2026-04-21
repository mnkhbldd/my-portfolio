(function () {
  "use strict";

  var THEME_KEY = "mt-portfolio-theme";
  var fullName = "Munkhbold Tsegmed";

  function getTheme() {
    return document.documentElement.getAttribute("data-theme") || "dark";
  }

  function updateGithubStatsTheme() {
    var dark = getTheme() === "dark";
    var themeParam = dark ? "github_dark" : "github";
    var imgs = document.querySelectorAll(".github-stats img");
    imgs.forEach(function (img) {
      var src = img.getAttribute("src");
      if (!src || src.indexOf("github-profile-summary-cards") === -1) return;
      img.src = src.replace(/theme=[^&]+/, "theme=" + themeParam);
    });
  }

  function updateSkillIconsTheme() {
    var dark = getTheme() === "dark";
    var themeParam = dark ? "dark" : "light";
    document.querySelectorAll(".skill-stack__icon").forEach(function (img) {
      var src = img.getAttribute("src");
      if (!src || src.indexOf("skillicons.dev") === -1) return;
      img.src = src.replace(/theme=[^&]+/, "theme=" + themeParam);
    });
  }

  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (_) {}
    initParticles();
    updateGithubStatsTheme();
    updateSkillIconsTheme();
    if (window.AOS) {
      window.AOS.refresh();
    }
  }

  function initTheme() {
    var stored = null;
    try {
      stored = localStorage.getItem(THEME_KEY);
    } catch (_) {}
    var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    var theme = stored === "light" || stored === "dark" ? stored : prefersDark ? "dark" : "light";
    setTheme(theme);

    var btn = document.querySelector(".theme-toggle");
    if (btn) {
      btn.addEventListener("click", function () {
        setTheme(getTheme() === "dark" ? "light" : "dark");
      });
    }
  }

  function initParticles() {
    if (typeof particlesJS !== "function") return;
    var el = document.getElementById("particles-js");
    if (!el) return;
    el.innerHTML = "";
    var dark = getTheme() === "dark";
    var lineColor = dark ? "#c9a962" : "#134e4a";
    var particleColor = dark ? "#94a3b8" : "#64748b";

    particlesJS("particles-js", {
      particles: {
        number: { value: dark ? 55 : 42, density: { enable: true, value_area: 900 } },
        color: { value: particleColor },
        shape: { type: "circle" },
        opacity: { value: 0.35, random: true },
        size: { value: 2.2, random: true },
        line_linked: {
          enable: true,
          distance: 140,
          color: lineColor,
          opacity: 0.12,
          width: 1,
        },
        move: {
          enable: true,
          speed: 0.65,
          direction: "none",
          random: true,
          straight: false,
          out_mode: "out",
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: true, mode: "grab" },
          onclick: { enable: false },
          resize: true,
        },
        modes: {
          grab: { distance: 160, line_linked: { opacity: 0.2 } },
        },
      },
      retina_detect: true,
    });
  }

  function initNav() {
    var header = document.querySelector(".site-header");
    var nav = document.querySelector(".nav");
    var toggle = document.querySelector(".nav__toggle");
    var links = document.querySelectorAll(".nav__link");

    function onScroll() {
      if (!header) return;
      header.classList.toggle("is-scrolled", window.scrollY > 24);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        var open = !nav.classList.contains("is-open");
        nav.classList.toggle("is-open", open);
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      });
    }

    links.forEach(function (link) {
      link.addEventListener("click", function () {
        if (nav && nav.classList.contains("is-open")) {
          nav.classList.remove("is-open");
          if (toggle) {
            toggle.setAttribute("aria-expanded", "false");
            toggle.setAttribute("aria-label", "Open menu");
          }
        }
      });
    });
  }

  function typewriterName() {
    var el = document.getElementById("hero-name");
    if (!el) return;

    var reduced =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      el.textContent = fullName;
      el.classList.add("hero__name--no-cursor");
      return;
    }

    var i = 0;
    el.textContent = "";
    function tick() {
      if (i <= fullName.length) {
        el.textContent = fullName.slice(0, i);
        i++;
        window.setTimeout(tick, i > 4 ? 55 : 90);
      }
    }
    window.setTimeout(tick, 400);
  }

  function initTimelineFill(containerId, fillId) {
    var container = document.getElementById(containerId);
    var fill = document.getElementById(fillId);
    if (!container || !fill) return;

    var items = container.querySelectorAll(".timeline__item");
    if (!items.length) return;

    function update() {
      var total = items.length;
      var visible = 0;
      items.forEach(function (item, index) {
        var rect = item.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.82) {
          visible = index + 1;
        }
      });
      var pct = total ? (visible / total) * 100 : 0;
      fill.style.height = Math.min(100, pct) + "%";
    }

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  function initAOS() {
    if (!window.AOS) return;
    window.AOS.init({
      duration: 780,
      easing: "ease-out-cubic",
      once: true,
      offset: 60,
      delay: 0,
    });
  }

  function initYear() {
    var y = document.getElementById("year");
    if (y) y.textContent = String(new Date().getFullYear());
  }

  document.addEventListener("DOMContentLoaded", function () {
    initTheme();
    initNav();
    typewriterName();
    initTimelineFill("timeline-edu", "timeline-edu-fill");
    initTimelineFill("timeline-work", "timeline-work-fill");
    initAOS();
    initYear();
  });
})();
