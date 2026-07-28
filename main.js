/* ======================================
   Personal Portfolio — Dark Sci-Fi
   Starfield + Spaceship + Animations
   ====================================== */

(function () {
  "use strict";

  /* ====================================
     1. Starfield Canvas
     Layered particles: slow drift
  ==================================== */
  var canvas = document.getElementById("starfield");
  var ctx = canvas.getContext("2d");
  var stars = [];
  var STAR_COUNT = 180;
  var w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  /* Generate stars */
  for (var i = 0; i < STAR_COUNT; i++) {
    stars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.6 + 0.4,
      speed: Math.random() * 0.25 + 0.05,
      opacity: Math.random() * 0.6 + 0.25,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinklePhase: Math.random() * Math.PI * 2
    });
  }

  function drawStars() {
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < STAR_COUNT; i++) {
      var s = stars[i];
      /* Move upward slowly */
      s.y -= s.speed;
      s.twinklePhase += s.twinkleSpeed;
      if (s.y < -5) { s.y = h + 5; s.x = Math.random() * w; }
      /* Twinkle */
      var alpha = s.opacity * (0.5 + 0.5 * Math.sin(s.twinklePhase));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(200,220,255," + alpha.toFixed(2) + ")";
      ctx.fill();
    }
    requestAnimationFrame(drawStars);
  }
  drawStars();

  /* ====================================
     2. Spaceship Trail Particles
  ==================================== */
  var trailCanvas = document.createElement("canvas");
  trailCanvas.id = "trail-canvas";
  Object.assign(trailCanvas.style, {
    position: "fixed", top: "0", left: "0",
    width: "100%", height: "100%",
    zIndex: "0", pointerEvents: "none"
  });
  document.body.appendChild(trailCanvas);
  var tCtx = trailCanvas.getContext("2d");
  var tw, th;
  var trails = [];

  function resizeTrail() {
    tw = trailCanvas.width = window.innerWidth;
    th = trailCanvas.height = window.innerHeight;
  }
  resizeTrail();
  window.addEventListener("resize", resizeTrail);

  var shipEl = document.getElementById("spaceship");
  var lastShipX = 0, lastShipY = 0;

  function getShipPos() {
    if (!shipEl) return { x: -100, y: -100 };
    var rect = shipEl.getBoundingClientRect();
    return { x: rect.left + rect.width * 0.15, y: rect.top + rect.height / 2 };
  }

  function drawTrails() {
    tCtx.clearRect(0, 0, tw, th);
    var pos = getShipPos();
    /* Emit trail particle every frame */
    if (lastShipX > 0) {
      trails.push({
        x: pos.x, y: pos.y,
        life: 1, decay: 0.025 + Math.random() * 0.015,
        r: Math.random() * 1.6 + 0.6
      });
    }
    lastShipX = pos.x; lastShipY = pos.y;

    /* Draw & age trails */
    for (var i = trails.length - 1; i >= 0; i--) {
      var t = trails[i];
      t.life -= t.decay;
      if (t.life <= 0) { trails.splice(i, 1); continue; }
      tCtx.beginPath();
      tCtx.arc(t.x, t.y, t.r, 0, Math.PI * 2);
      tCtx.fillStyle = "rgba(77,201,246," + (t.life * 0.35).toFixed(2) + ")";
      tCtx.fill();
    }
    /* Limit trail count */
    if (trails.length > 60) trails.splice(0, trails.length - 60);
    requestAnimationFrame(drawTrails);
  }
  drawTrails();

  /* ====================================
     3. Page-Load Staggered Fade-In
  ==================================== */
  function triggerStaggered() {
    var items = document.querySelectorAll(".fade-stagger");
    items.forEach(function (el) {
      var delay = parseInt(el.getAttribute("data-delay")) || 0;
      setTimeout(function () {
        el.classList.add("in");
      }, delay * 120 + 60);
    });
  }
  /* Kick off after a short pause for paint */
  setTimeout(triggerStaggered, 150);

  /* ====================================
     4. Scroll Reveal
  ==================================== */
  function setupReveal() {
    var targets = document.querySelectorAll(
      ".glass-card, .skill-group, .section-title"
    );
    /* Skip hero-card (handled by stagger) */
    targets.forEach(function (el) {
      if (!el.classList.contains("fade-stagger")) {
        el.classList.add("reveal");
      }
    });
  }

  function checkReveal() {
    var reveals = document.querySelectorAll(".reveal");
    var wh = window.innerHeight;
    reveals.forEach(function (el) {
      var top = el.getBoundingClientRect().top;
      if (top < wh - 60) {
        el.classList.add("visible");
      }
    });
  }

  setupReveal();
  window.addEventListener("scroll", checkReveal, { passive: true });
  setTimeout(checkReveal, 200);

  /* ====================================
     5. Navbar Scroll State & Active Link
  ==================================== */
  var navbar = document.getElementById("navbar");
  var navLinks = document.querySelectorAll(".nav-links a");

  function onScrollNav() {
    /* Scrolled class */
    if (window.scrollY > 10) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
    /* Active link */
    var currentId = "";
    var sections = document.querySelectorAll("section[id]");
    sections.forEach(function (sec) {
      var rect = sec.getBoundingClientRect();
      if (rect.top <= 120) {
        currentId = sec.getAttribute("id");
      }
    });
    navLinks.forEach(function (link) {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#" + currentId) {
        link.classList.add("active");
      }
    });
  }
  window.addEventListener("scroll", onScrollNav, { passive: true });

  /* ====================================
     6. Smooth Anchor Scrolling
  ==================================== */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = this.getAttribute("href").slice(1);
      var target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.pageYOffset - navbar.offsetHeight;
      window.scrollTo({ top: top, behavior: "smooth" });
    });
  });
})();
