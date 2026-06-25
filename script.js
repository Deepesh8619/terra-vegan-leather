document.addEventListener('DOMContentLoaded', function () {
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const stickyCta = document.getElementById('stickyCta');

  // Nav scroll shadow
  window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 40);
    if (stickyCta) stickyCta.classList.toggle('show', window.scrollY > window.innerHeight * 1.5);
  });

  // Mobile nav toggle
  navToggle.addEventListener('click', function () {
    navLinks.classList.toggle('open');
  });

  // Close mobile nav on link click
  navLinks.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      navLinks.classList.remove('open');
    });
  });

  // Active nav link on scroll
  var sections = document.querySelectorAll('section[id]');
  var navAnchors = document.querySelectorAll('.nav-link');
  window.addEventListener('scroll', function () {
    var scrollY = window.scrollY + 120;
    sections.forEach(function (sec) {
      if (scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight) {
        var id = sec.getAttribute('id');
        navAnchors.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + id);
        });
      }
    });
  });

  // Fade-in on scroll (Intersection Observer)
  var fadeEls = document.querySelectorAll('.fade-in');
  function checkFadeIn() {
    var wh = window.innerHeight;
    fadeEls.forEach(function (el) {
      if (!el.classList.contains('visible')) {
        var rect = el.getBoundingClientRect();
        if (rect.top < wh - 40) el.classList.add('visible');
      }
    });
  }
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });
    fadeEls.forEach(function (el) { obs.observe(el); });
  }
  window.addEventListener('scroll', checkFadeIn);
  checkFadeIn();

  // Counter animation
  var counted = false;
  var counters = document.querySelectorAll('.num-value[data-count]');
  function animateCounters() {
    if (counted) return;
    counters.forEach(function (el) {
      var target = parseInt(el.getAttribute('data-count'), 10);
      var duration = 1800;
      var start = performance.now();
      function tick(now) {
        var t = Math.min((now - start) / duration, 1);
        t = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(target * t);
        if (t < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
    counted = true;
  }
  if (counters.length) {
    var cObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateCounters(); cObs.disconnect(); }
      });
    }, { threshold: 0.3 });
    counters.forEach(function (el) { cObs.observe(el); });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var href = a.getAttribute('href');
      if (href.length > 1) {
        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
});
