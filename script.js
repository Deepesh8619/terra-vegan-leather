document.addEventListener('DOMContentLoaded', function() {
  initHeroAnim();
  initHeroBg();
  initScrollFades();
  initCounters();
  initSmoothScroll();
  initNavScroll();
  initNavToggle();
  initContactForm();
});

function initHeroBg() {
  var img = document.querySelector('.hero-bg img');
  if (!img) return;
  if (img.complete) img.classList.add('loaded');
  else img.addEventListener('load', function() { img.classList.add('loaded'); });
}

function initHeroAnim() {
  var els = document.querySelectorAll('[data-anim]');
  els.forEach(function(el, i) {
    setTimeout(function() { el.classList.add('visible'); }, 400 + i * 180);
  });
  // fallback: force all content visible after 3s
  setTimeout(function() {
    document.querySelectorAll('[data-anim], [data-fade]').forEach(function(el) {
      el.classList.add('visible');
    });
  }, 3000);
}

function initScrollFades() {
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('[data-fade]').forEach(function(el) { observer.observe(el); });
}

function initCounters() {
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        var target = parseInt(el.dataset.count, 10);
        if (isNaN(target)) return;
        animateCount(el, target);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(function(c) { observer.observe(c); });
}

function animateCount(el, target) {
  var duration = target > 100 ? 2000 : 1400;
  var start = performance.now();
  var format = target >= 1000;

  (function tick(now) {
    var t = Math.min((now - start) / duration, 1);
    var ease = 1 - Math.pow(1 - t, 3);
    var val = Math.round(target * ease);
    el.textContent = format ? val.toLocaleString() : val;
    if (t < 1) requestAnimationFrame(tick);
  })(start);
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function(a) {
    a.addEventListener('click', function(e) {
      var id = a.getAttribute('href');
      if (id === '#') return;
      var target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        var navOpen = document.querySelector('.nav-links.open');
        if (navOpen) navOpen.classList.remove('open');
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

function initNavScroll() {
  var nav = document.getElementById('nav');
  if (!nav) return;
  var ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(function() {
        nav.classList.toggle('scrolled', window.scrollY > 60);
        ticking = false;
      });
      ticking = true;
    }
  });
}

function initNavToggle() {
  var toggle = document.getElementById('navToggle');
  var links = document.querySelector('.nav-links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', function() {
    links.classList.toggle('open');
  });
}

function initContactForm() {
  var form = document.getElementById('contactForm');
  var note = document.getElementById('contactNote');
  if (!form || !note) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    note.textContent = 'Request received. Our sourcing team will respond within 48 hours with your sample kit tracking or formal quote.';
    form.reset();
  });
}
