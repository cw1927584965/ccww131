/* ======================================
   Personal Portfolio — Interaction Script
   ====================================== */

(function () {
  "use strict";

  /* ---- Navbar scroll state ---- */
  var navbar = document.getElementById("navbar");
  var navLinks = document.querySelectorAll(".nav-links a");

  function onScroll() {
    // Toggle scrolled class
    var scrolled = window.scrollY > 10;
    if (scrolled) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    // Highlight active nav link based on scroll position
    var currentId = "";
    var sections = document.querySelectorAll("section[id]");
    sections.forEach(function (section) {
      var rect = section.getBoundingClientRect();
      if (rect.top <= 120) {
        currentId = section.getAttribute("id");
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#" + currentId) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- Scroll reveal ---- */
  function initReveal() {
    var revealElements = document.querySelectorAll(
      ".skill-card, .project-card, .about-text p, .about-info, .contact-item"
    );

    revealElements.forEach(function (el) {
      el.classList.add("reveal");
    });
  }

  function checkReveal() {
    var reveals = document.querySelectorAll(".reveal");
    var windowHeight = window.innerHeight;
    reveals.forEach(function (el) {
      var top = el.getBoundingClientRect().top;
      if (top < windowHeight - 80) {
        el.classList.add("visible");
      }
    });
  }

  initReveal();
  window.addEventListener("scroll", checkReveal, { passive: true });
  window.addEventListener("resize", checkReveal, { passive: true });
  // Initial check after a tick for paint
  setTimeout(checkReveal, 100);

  /* ---- Smooth anchor scroll offset (accounts for fixed navbar) ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var targetId = this.getAttribute("href").slice(1);
      var target = document.getElementById(targetId);
      if (!target) return;
      e.preventDefault();
      var navHeight = navbar.offsetHeight;
      var top = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
      window.scrollTo({ top: top, behavior: "smooth" });
    });
  });
})();
