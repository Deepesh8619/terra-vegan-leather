document.addEventListener('DOMContentLoaded', function () {
  var nav = document.getElementById('nav');
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');
  var stickyCta = document.getElementById('stickyCta');
  var heroBg = document.querySelector('.hero-bg');
  var numbersBg = document.querySelector('.numbers-bg');

  // Parallax on hero and numbers backgrounds
  function parallax() {
    var scrollY = window.scrollY;
    if (heroBg) heroBg.style.transform = 'translateY(' + (scrollY * 0.3) + 'px)';
    if (numbersBg) {
      var rect = numbersBg.parentElement.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        var offset = (rect.top - window.innerHeight) * 0.15;
        numbersBg.style.transform = 'translateY(' + offset + 'px)';
      }
    }
  }

  // Nav scroll
  function onScroll() {
    var scrollY = window.scrollY;
    nav.classList.toggle('scrolled', scrollY > 60);
    if (stickyCta) stickyCta.classList.toggle('show', scrollY > window.innerHeight * 1.5);
    parallax();
    checkFadeIn();
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile nav toggle
  navToggle.addEventListener('click', function () {
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { navLinks.classList.remove('open'); });
  });

  // Active nav link on scroll
  var sections = document.querySelectorAll('section[id]');
  var navAnchors = document.querySelectorAll('.nav-link');
  var activeTimeout;
  window.addEventListener('scroll', function () {
    clearTimeout(activeTimeout);
    activeTimeout = setTimeout(function () {
      var scrollY = window.scrollY + 140;
      sections.forEach(function (sec) {
        if (scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight) {
          var id = sec.getAttribute('id');
          navAnchors.forEach(function (a) {
            a.classList.toggle('active', a.getAttribute('href') === '#' + id);
          });
        }
      });
    }, 50);
  }, { passive: true });

  // Scroll-triggered animations with stagger
  var animEls = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .scale-in');

  function checkFadeIn() {
    var wh = window.innerHeight;
    animEls.forEach(function (el) {
      if (!el.classList.contains('visible')) {
        var rect = el.getBoundingClientRect();
        if (rect.top < wh - 50) el.classList.add('visible');
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
    }, { threshold: 0.05, rootMargin: '0px 0px -50px 0px' });
    animEls.forEach(function (el) { obs.observe(el); });
  }
  window.addEventListener('scroll', checkFadeIn, { passive: true });
  checkFadeIn();

  // Counter animation with easeOutExpo
  var counted = false;
  var counters = document.querySelectorAll('.num-value[data-count]');
  function animateCounters() {
    if (counted) return;
    counters.forEach(function (el) {
      var target = parseInt(el.getAttribute('data-count'), 10);
      var duration = 2200;
      var start = performance.now();
      function tick(now) {
        var t = Math.min((now - start) / duration, 1);
        t = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
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

  // Magnetic hover on CTA buttons
  document.querySelectorAll('.btn-primary, .nav-cta').forEach(function (btn) {
    btn.addEventListener('mousemove', function (e) {
      var rect = btn.getBoundingClientRect();
      var x = (e.clientX - rect.left - rect.width / 2) * 0.15;
      var y = (e.clientY - rect.top - rect.height / 2) * 0.15;
      btn.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(1.03)';
    });
    btn.addEventListener('mouseleave', function () {
      btn.style.transform = '';
    });
  });

  // Tilt effect on material cards
  document.querySelectorAll('.mat-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = 'translateY(-4px) perspective(800px) rotateX(' + (y * -3) + 'deg) rotateY(' + (x * 3) + 'deg)';
    });
    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
    });
  });

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var href = a.getAttribute('href');
      if (href.length > 1) {
        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          var offset = nav.offsetHeight + 16;
          var top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      }
    });
  });

  // Cursor trail on hero (subtle)
  var hero = document.querySelector('.hero');
  if (hero && window.innerWidth > 768) {
    hero.addEventListener('mousemove', function (e) {
      var dot = document.createElement('div');
      dot.style.cssText = 'position:absolute;width:6px;height:6px;border-radius:50%;background:rgba(0,0,0,0.06);pointer-events:none;z-index:1;left:' + (e.clientX - hero.getBoundingClientRect().left) + 'px;top:' + (e.clientY - hero.getBoundingClientRect().top + window.scrollY) + 'px;transition:transform 0.8s,opacity 0.8s;';
      hero.appendChild(dot);
      requestAnimationFrame(function () {
        dot.style.transform = 'scale(4)';
        dot.style.opacity = '0';
      });
      setTimeout(function () { dot.remove(); }, 900);
    });
  }

  // Initial scroll trigger
  onScroll();
});
