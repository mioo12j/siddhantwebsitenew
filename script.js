/* ═══════════════════════════════════════════════════════════════
   Guardians in the Gale — interactions
   Vanilla JS. No dependencies.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ── Reveal on scroll ── */
  var revealables = $$('.rv');
  if ('IntersectionObserver' in window && !reducedMotion) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in-view'); ro.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealables.forEach(function (el) { ro.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ── Nav, progress, to-top ── */
  var nav = $('#nav');
  var bar = $('#progressBar');
  var toTop = $('#toTop');
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var y = window.scrollY;
      nav.classList.toggle('is-scrolled', y > 40);
      toTop.classList.toggle('is-visible', y > 900);
      var max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar && max > 0) bar.style.transform = 'scaleX(' + Math.min(y / max, 1) + ')';
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  });

  var burger = $('#navBurger');
  var menu = $('#navMenu');
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    $$('a', menu).forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* scroll-spy */
  var spyLinks = $$('.nav-link');
  var spyMap = {};
  spyLinks.forEach(function (l) {
    var id = (l.getAttribute('href') || '').replace('#', '');
    if (id) spyMap[id] = l;
  });
  if ('IntersectionObserver' in window) {
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var link = spyMap[e.target.id];
        if (link && e.isIntersecting) {
          spyLinks.forEach(function (l) { l.classList.remove('is-active'); });
          link.classList.add('is-active');
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    Object.keys(spyMap).forEach(function (id) {
      var s = document.getElementById(id);
      if (s) so.observe(s);
    });
  }

  /* ── Counters ── */
  var counters = $$('.count[data-target]');
  function runCounter(el) {
    var target = parseInt(el.getAttribute('data-target'), 10) || 0;
    if (reducedMotion) { el.textContent = target; return; }
    var start = null;
    var dur = target > 100 ? 1600 : 1100;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { runCounter(e.target); co.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { co.observe(el); });
  } else {
    counters.forEach(function (el) { el.textContent = el.getAttribute('data-target'); });
  }

  /* ── Marquee ── */
  $$('[data-marquee]').forEach(function (m) {
    var track = $('.marquee-track', m);
    if (!track) return;
    track.innerHTML += track.innerHTML;
    var speed = parseFloat(m.getAttribute('data-speed')) || 45;
    function pace() {
      var w = track.scrollWidth / 2;
      if (w > 0) track.style.setProperty('--marquee-dur', (w / speed) + 's');
    }
    pace();
    window.addEventListener('resize', pace);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(pace);
  });

  /* ── Wind canvas: streaks racing through the gale ── */
  var wind = $('#windCanvas');
  if (wind && !reducedMotion && wind.getContext) {
    var ctx = wind.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var streaks = [];
    var running = true;

    function sizeWind() {
      var r = wind.parentElement.getBoundingClientRect();
      wind.width = r.width * dpr;
      wind.height = r.height * dpr;
    }
    function makeStreaks() {
      streaks = [];
      var n = Math.min(60, Math.floor(wind.width / dpr / 22));
      for (var i = 0; i < n; i++) {
        var deep = Math.random() < 0.5;
        streaks.push({
          x: Math.random() * wind.width,
          y: Math.random() * wind.height,
          vx: (deep ? 1.1 : 2.2) * (0.6 + Math.random()) * dpr,
          vy: -(deep ? 0.16 : 0.3) * (0.6 + Math.random()) * dpr,
          len: (deep ? 22 : 46) * (0.7 + Math.random()) * dpr,
          a: deep ? 0.1 : 0.2,
          gold: Math.random() < 0.28
        });
      }
    }
    function drawWind() {
      if (!running) return;
      ctx.clearRect(0, 0, wind.width, wind.height);
      streaks.forEach(function (s) {
        s.x += s.vx;
        s.y += s.vy;
        if (s.x - s.len > wind.width) { s.x = -s.len; s.y = Math.random() * wind.height; }
        if (s.y < -20) s.y = wind.height + 20;
        var k = s.len / Math.sqrt(s.vx * s.vx + s.vy * s.vy);
        var grad = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * k, s.y - s.vy * k);
        var col = s.gold ? '212,182,110' : '150,175,220';
        grad.addColorStop(0, 'rgba(' + col + ',' + s.a + ')');
        grad.addColorStop(1, 'rgba(' + col + ',0)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.1 * dpr;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.vx * k, s.y - s.vy * k);
        ctx.stroke();
      });
      requestAnimationFrame(drawWind);
    }
    sizeWind();
    makeStreaks();
    requestAnimationFrame(drawWind);
    window.addEventListener('resize', function () { sizeWind(); makeStreaks(); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        var vis = entries[0].isIntersecting;
        if (vis && !running) { running = true; requestAnimationFrame(drawWind); }
        else if (!vis) running = false;
      }).observe(wind);
    }
  }

  /* ── 3D book: pointer tilt (fine pointers) ── */
  var scene = $('#bookScene');
  var book = $('#book3d');
  if (scene && book && window.matchMedia('(pointer: fine)').matches && !reducedMotion) {
    var hero = $('.hero');
    hero.addEventListener('pointermove', function (e) {
      var r = scene.getBoundingClientRect();
      var cx = r.left + r.width / 2;
      var cy = r.top + r.height / 2;
      var px = Math.max(-1, Math.min(1, (e.clientX - cx) / (r.width * 1.4)));
      var py = Math.max(-1, Math.min(1, (e.clientY - cy) / (r.height * 1.1)));
      book.style.animation = 'none';
      book.style.transform =
        'rotateY(' + (-24 + px * 26) + 'deg) rotateX(' + (4 - py * 14) + 'deg)';
    });
    hero.addEventListener('pointerleave', function () {
      book.style.transform = '';
      book.style.animation = '';
    });
  }

  /* ── Reviews carousel ── */
  var track = $('#reviewsTrack');
  var dotsWrap = $('#revDots');
  if (track) {
    var cards = $$('.review', track);
    var dots = cards.map(function (_, i) {
      var b = document.createElement('button');
      b.setAttribute('aria-label', 'Go to review ' + (i + 1));
      b.addEventListener('click', function () { goTo(i); });
      dotsWrap.appendChild(b);
      return b;
    });
    function cardStep() { return cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : track.clientWidth; }
    function current() { return Math.round(track.scrollLeft / cardStep()); }
    function goTo(i) {
      i = Math.max(0, Math.min(cards.length - 1, i));
      track.scrollTo({ left: i * cardStep(), behavior: reducedMotion ? 'auto' : 'smooth' });
    }
    function paint() {
      var i = current();
      dots.forEach(function (d, j) { d.classList.toggle('is-active', j === i); });
    }
    track.addEventListener('scroll', function () { requestAnimationFrame(paint); }, { passive: true });
    $('#revPrev').addEventListener('click', function () { goTo(current() - 1); });
    $('#revNext').addEventListener('click', function () { goTo(current() + 1); });
    paint();

    /* gentle auto-advance, paused on interaction */
    if (!reducedMotion) {
      var auto = setInterval(function () {
        if (document.hidden) return;
        var i = current();
        goTo(i >= cards.length - 1 ? 0 : i + 1);
      }, 6500);
      ['pointerdown', 'wheel', 'keydown', 'touchstart'].forEach(function (evt) {
        track.addEventListener(evt, function () { clearInterval(auto); }, { once: true, passive: true });
      });
    }
  }

  /* ── Letters lightbox ── */
  var lightbox = $('#lightbox');
  var lightboxImg = $('#lightboxImg');
  var letterIndex = 0;
  var lastFocus = null;

  function thumbs() { return $$('.letter'); }
  function showLetter(i) {
    var t = thumbs();
    if (!t.length) return;
    letterIndex = (i + t.length) % t.length;
    lightboxImg.src = t[letterIndex].getAttribute('data-letter');
  }
  function openLb() {
    lastFocus = document.activeElement;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    $('.lb-close', lightbox).focus();
  }
  function closeLb() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('.letter');
    if (!t) return;
    showLetter(thumbs().indexOf(t));
    openLb();
  });
  $('#lbPrev').addEventListener('click', function () { showLetter(letterIndex - 1); });
  $('#lbNext').addEventListener('click', function () { showLetter(letterIndex + 1); });
  $$('[data-close]', lightbox).forEach(function (el) { el.addEventListener('click', closeLb); });
  document.addEventListener('keydown', function (e) {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') showLetter(letterIndex - 1);
    if (e.key === 'ArrowRight') showLetter(letterIndex + 1);
  });

  /* ── Year ── */
  var year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
