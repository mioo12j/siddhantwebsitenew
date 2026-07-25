/* ═══════════════════════════════════════════════════════════════
   Siddhant Kumar — Official Website
   Interactions & animation. Vanilla JS, no dependencies.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ── Reveal on scroll ── */
  var revealables = $$('.rv, .rv-left, .rv-right');
  if ('IntersectionObserver' in window && !reducedMotion) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealables.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ── Navigation ── */
  var nav = $('#nav');
  var burger = $('#navBurger');
  var menu = $('#navMenu');
  var progress = $('#scrollProgress');
  var toTop = $('#toTop');

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var y = window.scrollY;
      nav.classList.toggle('is-scrolled', y > 40);
      toTop.classList.toggle('is-visible', y > 900);
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      if (progress && max > 0) progress.style.transform = 'scaleX(' + Math.min(y / max, 1) + ')';
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    $$('.nav-link, .nav-cta', menu).forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    });
  }

  /* ── Scroll-spy ── */
  var spyLinks = $$('.nav-link');
  var spyMap = {};
  spyLinks.forEach(function (link) {
    var id = (link.getAttribute('href') || '').replace('#', '');
    if (id) spyMap[id] = link;
  });
  if ('IntersectionObserver' in window) {
    var spyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = spyMap[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          spyLinks.forEach(function (l) { l.classList.remove('is-active'); });
          link.classList.add('is-active');
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    Object.keys(spyMap).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) spyObserver.observe(section);
    });
  }

  /* ── Role rotator ── */
  var roleWord = $('#roleWord');
  if (roleWord && !reducedMotion) {
    var roles = ['poet', 'software developer', 'founder', 'student', 'builder', 'researcher', 'storyteller'];
    var roleIndex = 0;
    setInterval(function () {
      roleWord.classList.add('is-out');
      setTimeout(function () {
        roleIndex = (roleIndex + 1) % roles.length;
        roleWord.textContent = roles[roleIndex];
        roleWord.classList.remove('is-out');
      }, 420);
    }, 2600);
  }

  /* ── Count-up numbers ── */
  var counters = $$('.count[data-target]');
  function runCounter(el) {
    var target = parseInt(el.getAttribute('data-target'), 10) || 0;
    if (reducedMotion) { el.textContent = target; return; }
    var start = null;
    var dur = Math.min(2200, 700 + target * 12);
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { countObserver.observe(el); });
  } else {
    counters.forEach(function (el) { el.textContent = el.getAttribute('data-target'); });
  }

  /* ── Marquees: clone content for a seamless loop, pace by px/s ── */
  $$('[data-marquee]').forEach(function (marquee) {
    var track = $('.marquee-track', marquee);
    if (!track) return;
    track.innerHTML += track.innerHTML;
    var speed = parseFloat(marquee.getAttribute('data-speed')) || 50;
    function pace() {
      var width = track.scrollWidth / 2;
      if (width > 0) track.style.setProperty('--marquee-dur', (width / speed) + 's');
    }
    pace();
    window.addEventListener('resize', pace);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(pace);
  });

  /* ── Hero dust: drifting gold particles ── */
  var dust = $('#heroDust');
  if (dust && !reducedMotion && dust.getContext) {
    var ctx = dust.getContext('2d');
    var particles = [];
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var running = true;

    function sizeDust() {
      var rect = dust.parentElement.getBoundingClientRect();
      dust.width = rect.width * dpr;
      dust.height = rect.height * dpr;
    }
    function makeParticles() {
      particles = [];
      var count = Math.min(70, Math.floor(dust.width / dpr / 18));
      for (var i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * dust.width,
          y: Math.random() * dust.height,
          r: (Math.random() * 1.4 + 0.4) * dpr,
          vx: (Math.random() - 0.5) * 0.12 * dpr,
          vy: -(Math.random() * 0.22 + 0.05) * dpr,
          a: Math.random() * 0.5 + 0.1,
          tw: Math.random() * Math.PI * 2
        });
      }
    }
    function drawDust(ts) {
      if (!running) return;
      ctx.clearRect(0, 0, dust.width, dust.height);
      particles.forEach(function (p) {
        p.x += p.vx;
        p.y += p.vy;
        p.tw += 0.02;
        if (p.y < -6) { p.y = dust.height + 6; p.x = Math.random() * dust.width; }
        if (p.x < -6) p.x = dust.width + 6;
        if (p.x > dust.width + 6) p.x = -6;
        var alpha = p.a * (0.6 + 0.4 * Math.sin(p.tw));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(220, 190, 110,' + alpha.toFixed(3) + ')';
        ctx.fill();
      });
      requestAnimationFrame(drawDust);
    }
    sizeDust();
    makeParticles();
    requestAnimationFrame(drawDust);
    window.addEventListener('resize', function () { sizeDust(); makeParticles(); });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        var visible = entries[0].isIntersecting;
        if (visible && !running) { running = true; requestAnimationFrame(drawDust); }
        else if (!visible) running = false;
      }).observe(dust);
    }
  }

  /* ── 3D tilt (fine pointers only) ── */
  if (window.matchMedia('(pointer: fine)').matches && !reducedMotion) {
    $$('.tilt').forEach(function (el) {
      var rect = null;
      el.addEventListener('pointerenter', function () { rect = el.getBoundingClientRect(); });
      el.addEventListener('pointermove', function (e) {
        if (!rect) rect = el.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width - 0.5;
        var py = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.transform = 'perspective(700px) rotateY(' + (px * 9) + 'deg) rotateX(' + (-py * 9) + 'deg) translateY(-6px)';
      });
      el.addEventListener('pointerleave', function () {
        rect = null;
        el.style.transform = '';
      });
    });
  }

  /* ── Voice reader modal ── */
  var voiceModal = $('#voiceModal');
  var vmPhoto = $('#vmPhoto');
  var vmName = $('#vmName');
  var vmRole = $('#vmRole');
  var vmBody = $('#vmBody');
  var lastFocus = null;

  function openModal(modal) {
    lastFocus = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    var closeBtn = $('.modal-close', modal);
    if (closeBtn) closeBtn.focus();
  }
  function closeModal(modal) {
    modal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function openVoice(card) {
    var full = $('.voice-full', card);
    var excerpt = $('.voice-excerpt', card);
    var photo = $('.voice-photo', card);
    var name = $('.voice-id cite', card);
    var role = $('.voice-id span', card);

    vmBody.innerHTML = full ? full.innerHTML : ('<p' + (excerpt.getAttribute('lang') === 'hi' ? ' lang="hi"' : '') + '>' + excerpt.innerHTML + '</p>');
    vmName.textContent = name ? name.textContent : '';
    vmRole.textContent = role ? role.textContent : '';
    vmPhoto.innerHTML = '';
    if (photo && photo.tagName === 'IMG') {
      var img = photo.cloneNode(false);
      img.className = '';
      vmPhoto.appendChild(img);
    } else {
      vmPhoto.textContent = (vmName.textContent || 'S').trim().split(/\s+/).map(function (w) { return w[0]; }).slice(0, 2).join('');
    }
    openModal(voiceModal);
  }

  $$('.voice').forEach(function (card) {
    card.addEventListener('click', function () { openVoice(card); });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openVoice(card);
      }
    });
  });

  /* ── Letters lightbox ── */
  var lightbox = $('#lightbox');
  var lightboxImg = $('#lightboxImg');
  var letterThumbs = $$('.letter-thumb');
  var letterIndex = 0;

  function showLetter(i) {
    letterIndex = (i + letterThumbs.length) % letterThumbs.length;
    lightboxImg.src = letterThumbs[letterIndex].getAttribute('data-letter');
  }
  letterThumbs.forEach(function (thumb, i) {
    thumb.addEventListener('click', function () {
      showLetter(i);
      openModal(lightbox);
    });
  });
  var lbPrev = $('#lbPrev');
  var lbNext = $('#lbNext');
  if (lbPrev) lbPrev.addEventListener('click', function () { showLetter(letterIndex - 1); });
  if (lbNext) lbNext.addEventListener('click', function () { showLetter(letterIndex + 1); });

  /* modal shared closing */
  $$('.modal, .lightbox').forEach(function (modal) {
    $$('[data-close]', modal).forEach(function (el) {
      el.addEventListener('click', function () { closeModal(modal); });
    });
  });
  document.addEventListener('keydown', function (e) {
    if (voiceModal && !voiceModal.hidden) {
      if (e.key === 'Escape') closeModal(voiceModal);
    }
    if (lightbox && !lightbox.hidden) {
      if (e.key === 'Escape') closeModal(lightbox);
      if (e.key === 'ArrowLeft') showLetter(letterIndex - 1);
      if (e.key === 'ArrowRight') showLetter(letterIndex + 1);
    }
  });

  /* ── "Stay updated" links prefill the contact subject ── */
  $$('[data-subject]').forEach(function (link) {
    link.addEventListener('click', function () {
      var subject = $('#cfSubject');
      var message = $('#cfMessage');
      if (subject) subject.value = link.getAttribute('data-subject');
      if (message && !message.value) message.value = 'Please keep me posted.';
    });
  });

  /* ── Contact form (async submit, graceful fallback) ── */
  var form = $('#contactForm');
  var success = $('#formSuccess');
  if (form && window.fetch) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var button = $('button[type="submit"]', form);
      var label = $('span', button);
      var original = label.textContent;
      label.textContent = 'Sending…';
      button.disabled = true;
      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      }).then(function (res) {
        if (!res.ok) throw new Error('send failed');
        form.reset();
        success.hidden = false;
      }).catch(function () {
        form.submit(); /* fall back to a normal post */
      }).finally(function () {
        label.textContent = original;
        button.disabled = false;
      });
    });
  }

  /* ── Footer year ── */
  var year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
