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

  var scrim = $('#navScrim');
  function setMenu(open) {
    menu.classList.toggle('is-open', open);
    if (scrim) scrim.classList.toggle('is-open', open);
    document.body.classList.toggle('nav-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  if (burger && menu) {
    burger.addEventListener('click', function () { setMenu(!menu.classList.contains('is-open')); });
    if (scrim) scrim.addEventListener('click', function () { setMenu(false); });
    $$('.nav-link, .nav-cta', menu).forEach(function (link) {
      link.addEventListener('click', function () { setMenu(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) setMenu(false);
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
        ctx.fillStyle = 'rgba(120, 96, 54,' + (alpha * 0.8).toFixed(3) + ')';
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
  var letterIndex = 0;

  /* query fresh each time — thumbs whose scan is missing remove themselves */
  function letterThumbs() { return $$('.letter-thumb'); }
  function showLetter(i) {
    var thumbs = letterThumbs();
    if (!thumbs.length) return;
    letterIndex = (i + thumbs.length) % thumbs.length;
    lightboxImg.src = thumbs[letterIndex].getAttribute('data-letter');
  }
  document.addEventListener('click', function (e) {
    var thumb = e.target.closest && e.target.closest('.letter-thumb');
    if (!thumb) return;
    showLetter(letterThumbs().indexOf(thumb));
    openModal(lightbox);
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

  /* ── Scroll parallax for mounted plates ── */
  var parallaxEls = $$('[data-parallax]');
  if (parallaxEls.length && !reducedMotion && 'requestAnimationFrame' in window) {
    var pTick = false;
    function parallax() {
      var vh = window.innerHeight;
      parallaxEls.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        var factor = parseFloat(el.getAttribute('data-parallax')) || 0.1;
        var off = ((r.top + r.height / 2) - vh / 2) * -factor;
        el.style.setProperty('--py', off.toFixed(1) + 'px');
      });
      pTick = false;
    }
    window.addEventListener('scroll', function () {
      if (!pTick) { pTick = true; requestAnimationFrame(parallax); }
    }, { passive: true });
    window.addEventListener('resize', parallax);
    parallax();
  }

  /* ── Living scene: parallax the hero scenery on scroll + pointer ── */
  var sceneLayers = $$('.hero-scene .layer:not(.scene-mist):not(.foliage-fore)');
  if (sceneLayers.length && !reducedMotion) {
    var smx = 0, smy = 0, ssy = 0, sPending = false;
    function applyScene() {
      sceneLayers.forEach(function (l) {
        var d = parseFloat(l.getAttribute('data-depth')) || 0.1;
        var tx = (smx * d * 60).toFixed(1);
        var ty = (smy * d * 42 + ssy * d).toFixed(1);
        l.style.transform = 'translate(' + tx + 'px,' + ty + 'px)';
      });
      sPending = false;
    }
    function queueScene() { if (!sPending) { sPending = true; requestAnimationFrame(applyScene); } }
    window.addEventListener('scroll', function () { ssy = window.scrollY * 0.16; queueScene(); }, { passive: true });
    if (window.matchMedia('(pointer: fine)').matches) {
      window.addEventListener('pointermove', function (e) {
        smx = e.clientX / window.innerWidth - 0.5;
        smy = e.clientY / window.innerHeight - 0.5;
        queueScene();
      }, { passive: true });
    }
    applyScene();
  }

  /* ── Birdsong — synthesised in the browser (Web Audio), off by default ── */
  var song = (function () {
    var ctx = null, master = null, on = false, timer = null;
    function ensure() {
      if (!ctx) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        ctx = new AC();
        master = ctx.createGain();
        master.gain.value = 0.5;
        var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 6500;
        master.connect(lp).connect(ctx.destination);
      }
      if (ctx.state === 'suspended') ctx.resume();
      return ctx;
    }
    function chirp(delay) {
      if (!ensure()) return;
      var t0 = ctx.currentTime + (delay || 0);
      var notes = 2 + Math.floor(Math.random() * 4);
      var base = 1700 + Math.random() * 1700;
      var gap = 0.055 + Math.random() * 0.05;
      for (var i = 0; i < notes; i++) {
        var t = t0 + i * gap;
        var f = base * (1 + (Math.random() * 0.2 - 0.08)) - i * 70;
        var o = ctx.createOscillator(); o.type = 'sine';
        o.frequency.setValueAtTime(f * 0.82, t);
        o.frequency.exponentialRampToValueAtTime(f * 1.32, t + 0.018);
        o.frequency.exponentialRampToValueAtTime(f * 0.92, t + 0.05);
        var g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(0.16, t + 0.008);
        g.gain.exponentialRampToValueAtTime(0.0006, t + 0.06);
        var o2 = ctx.createOscillator(); o2.type = 'triangle'; o2.frequency.setValueAtTime(f * 2, t);
        var g2 = ctx.createGain();
        g2.gain.setValueAtTime(0.0001, t);
        g2.gain.linearRampToValueAtTime(0.03, t + 0.008);
        g2.gain.exponentialRampToValueAtTime(0.0004, t + 0.045);
        o.connect(g).connect(master); o2.connect(g2).connect(master);
        o.start(t); o.stop(t + 0.09); o2.start(t); o2.stop(t + 0.07);
      }
    }
    function schedule() {
      clearTimeout(timer);
      if (!on) return;
      timer = setTimeout(function () {
        if (on && !document.hidden) chirp();
        schedule();
      }, 2200 + Math.random() * 5200);
    }
    return {
      isOn: function () { return on; },
      set: function (v) {
        on = v;
        if (on) { ensure(); chirp(0.05); schedule(); }
        else { clearTimeout(timer); }
      },
      chirp: function () { if (on) chirp(); }
    };
  })();

  var soundBtn = $('#soundToggle');
  if (soundBtn) {
    var stored = null;
    try { stored = localStorage.getItem('sk-birdsong'); } catch (e) {}
    function paintSound() {
      soundBtn.classList.toggle('is-on', song.isOn());
      soundBtn.setAttribute('aria-pressed', song.isOn() ? 'true' : 'false');
    }
    soundBtn.addEventListener('click', function () {
      song.set(!song.isOn());
      try { localStorage.setItem('sk-birdsong', song.isOn() ? 'on' : 'off'); } catch (e) {}
      paintSound();
    });
    /* Honour a returning visitor who had it on — but only start after a gesture */
    if (stored === 'on' && !reducedMotion) {
      var arm = function () {
        song.set(true); paintSound();
        window.removeEventListener('pointerdown', arm); window.removeEventListener('keydown', arm);
      };
      window.addEventListener('pointerdown', arm); window.addEventListener('keydown', arm);
    }
    paintSound();
  }

  /* ── Perched bird takes flight (on tap, and now and then) ── */
  var perch = $('#perchBird');
  if (perch && !reducedMotion) {
    var perchBusy = false;
    function launch() {
      if (perchBusy) return;
      perchBusy = true;
      perch.classList.add('takeoff');
      song.chirp();
      setTimeout(function () {
        perch.classList.remove('takeoff');
        perch.style.opacity = '0';
        setTimeout(function () { perch.style.opacity = ''; perchBusy = false; }, 7000 + Math.random() * 7000);
      }, 3400);
    }
    var fig = perch.closest('.hero-figure');
    if (fig) fig.addEventListener('click', launch);
    setInterval(function () { if (Math.random() < 0.5) launch(); }, 16000);
  }

  /* ── Section flyover — a bird crosses as each marked section appears ── */
  var flySections = $$('.section');
  if ('IntersectionObserver' in window && !reducedMotion) {
    var flyObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && entry.target.querySelector(':scope > .flyover')) {
          entry.target.classList.add('seen');
          song.chirp();
          flyObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    flySections.forEach(function (s) { if (s.querySelector(':scope > .flyover')) flyObs.observe(s); });
  }

  /* ── Scroll-guide bird glides down the page as you scroll ── */
  var guide = $('#scrollGuide');
  if (guide && !reducedMotion && window.matchMedia('(min-width: 961px)').matches) {
    var gIdle = null, gPending = false;
    function moveGuide() {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      var vh = window.innerHeight;
      var y = vh * 0.12 + p * vh * 0.7;
      var x = Math.sin(p * Math.PI * 6) * 42;
      var rot = Math.cos(p * Math.PI * 6) * 12;
      guide.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px) rotate(' + rot.toFixed(1) + 'deg)';
      gPending = false;
    }
    window.addEventListener('scroll', function () {
      guide.classList.add('active');
      if (!gPending) { gPending = true; requestAnimationFrame(moveGuide); }
      clearTimeout(gIdle);
      gIdle = setTimeout(function () { guide.classList.remove('active'); }, 1400);
    }, { passive: true });
    moveGuide();
  }

  /* ── Cinematic intro veil ── */
  var veil = $('#introVeil');
  if (veil) {
    if (reducedMotion) {
      document.documentElement.classList.add('reduce-motion');
      if (veil.parentNode) veil.remove();
    } else {
      var lifted = false;
      function lift() {
        if (lifted) return; lifted = true;
        veil.classList.add('lift');
        setTimeout(function () { if (veil.parentNode) veil.remove(); }, 1300);
      }
      window.addEventListener('load', function () { setTimeout(lift, 260); });
      setTimeout(lift, 2600); /* safety */
    }
  }

  /* ── Daybreak: the hero scene brightens as you scroll through it ── */
  var sceneDay = $('#sceneDay');
  if (sceneDay && !reducedMotion) {
    var dTick = false;
    function daybreak() {
      var p = Math.min(Math.max(window.scrollY / (window.innerHeight * 0.9), 0), 1);
      sceneDay.style.opacity = (p * 0.9).toFixed(3);
      dTick = false;
    }
    window.addEventListener('scroll', function () { if (!dTick) { dTick = true; requestAnimationFrame(daybreak); } }, { passive: true });
    daybreak();
  }

  /* ── Falling petals & leaves (subtle foreground life) ── */
  var petals = $('#petals');
  if (petals && !reducedMotion && petals.getContext) {
    var pc = petals.getContext('2d');
    var pdpr = Math.min(window.devicePixelRatio || 1, 2);
    var flakes = [], pw = 0, ph = 0, pRun = true;
    var COL = ['rgba(176,106,92,', 'rgba(201,162,76,', 'rgba(111,125,78,', 'rgba(207,154,139,'];
    function sizeP() {
      pw = petals.width = window.innerWidth * pdpr;
      ph = petals.height = window.innerHeight * pdpr;
      petals.style.width = window.innerWidth + 'px';
      petals.style.height = window.innerHeight + 'px';
    }
    function mk() {
      return { x: Math.random() * pw, y: Math.random() * -ph, r: (4 + Math.random() * 6) * pdpr,
        vy: (0.3 + Math.random() * 0.6) * pdpr, vx: (Math.random() - 0.5) * 0.3 * pdpr,
        a: 0.16 + Math.random() * 0.28, rot: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.03,
        sw: Math.random() * 6.28, col: COL[Math.floor(Math.random() * COL.length)] };
    }
    function initP() { flakes = []; var n = Math.min(18, Math.floor(window.innerWidth / 90)); for (var i = 0; i < n; i++) { var f = mk(); f.y = Math.random() * ph; flakes.push(f); } }
    function drawP() {
      if (!pRun) return;
      pc.clearRect(0, 0, pw, ph);
      flakes.forEach(function (f) {
        f.sw += 0.02; f.x += f.vx + Math.sin(f.sw) * 0.3 * pdpr; f.y += f.vy; f.rot += f.vr;
        if (f.y > ph + 20) { var nf = mk(); nf.y = -20; for (var k in nf) f[k] = nf[k]; }
        pc.save(); pc.translate(f.x, f.y); pc.rotate(f.rot);
        pc.beginPath(); pc.ellipse(0, 0, f.r, f.r * 0.55, 0, 0, 6.28);
        pc.fillStyle = f.col + f.a.toFixed(2) + ')'; pc.fill(); pc.restore();
      });
      requestAnimationFrame(drawP);
    }
    sizeP(); initP(); requestAnimationFrame(drawP);
    window.addEventListener('resize', function () { sizeP(); initP(); });
    document.addEventListener('visibilitychange', function () { pRun = !document.hidden; if (pRun) requestAnimationFrame(drawP); });
  }

  /* ── Cursor companion — a little bird that trails the pointer ── */
  var flit = $('#cursorFlit');
  if (flit && !reducedMotion && window.matchMedia('(pointer: fine)').matches && window.innerWidth > 960) {
    var fx = window.innerWidth / 2, fy = window.innerHeight / 2, tx = fx, ty = fy, fShown = false, fHide = null;
    window.addEventListener('pointermove', function (e) {
      tx = e.clientX + 26; ty = e.clientY + 12;
      if (!fShown) { fShown = true; flit.classList.add('show'); }
      clearTimeout(fHide);
      fHide = setTimeout(function () { fShown = false; flit.classList.remove('show'); }, 2500);
    }, { passive: true });
    (function flitLoop() {
      fx += (tx - fx) * 0.08; fy += (ty - fy) * 0.08;
      var ang = Math.atan2(ty - fy, tx - fx) * 0.18;
      flit.style.transform = 'translate(' + fx.toFixed(1) + 'px,' + fy.toFixed(1) + 'px) rotate(' + ang.toFixed(3) + 'rad)';
      requestAnimationFrame(flitLoop);
    })();
  }

  /* ── Footer year ── */
  var year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
