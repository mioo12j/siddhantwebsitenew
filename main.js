/* ═══════════════════════════════════════════════════════════
   SIDDHANT KUMAR — Ultra-Premium Portfolio
   Main JavaScript — All Interactions & Animations
════════════════════════════════════════════════════════════ */

'use strict';

/* ────────────────────────────────────────
   UTILITY HELPERS
──────────────────────────────────────── */
const qs  = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const clamp = (v, mn, mx) => Math.min(mx, Math.max(mn, v));
const lerp  = (a, b, t) => a + (b - a) * t;
const rand  = (min, max) => Math.random() * (max - min) + min;

/* ────────────────────────────────────────
   LOADER
──────────────────────────────────────── */
(function initLoader() {
  const loader = qs('#loader');
  if (!loader) return;

  const hide = () => {
    loader.classList.add('hidden');
    loader.addEventListener('transitionend', () => loader.remove(), { once: true });
  };

  if (document.readyState === 'complete') {
    setTimeout(hide, 1800);
  } else {
    window.addEventListener('load', () => setTimeout(hide, 1800));
  }
})();

/* ────────────────────────────────────────
   CUSTOM CURSOR
──────────────────────────────────────── */
(function initCursor() {
  const cursor = qs('#cursor');
  const trail  = qs('#cursor-trail');
  if (!cursor || !trail) return;

  // Skip the custom cursor on touch / coarse-pointer devices — there is no
  // hovering pointer to follow, and it just adds two stray dots.
  const fine = window.matchMedia('(pointer: fine)').matches;
  if (!fine) {
    cursor.style.display = 'none';
    trail.style.display = 'none';
    return;
  }

  let mx = -100, my = -100;
  let tx = -100, ty = -100;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    trail.style.opacity  = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    trail.style.opacity  = '1';
  });

  (function animateTrail() {
    tx = lerp(tx, mx, 0.12);
    ty = lerp(ty, my, 0.12);
    trail.style.left = tx + 'px';
    trail.style.top  = ty + 'px';
    requestAnimationFrame(animateTrail);
  })();
})();

/* ────────────────────────────────────────
   SCROLL PROGRESS
──────────────────────────────────────── */
(function initScrollProgress() {
  const bar = qs('#scroll-progress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (total > 0 ? (scrolled / total) * 100 : 0) + '%';
  }, { passive: true });
})();

/* ────────────────────────────────────────
   NAVBAR — SCROLL & ACTIVE
──────────────────────────────────────── */
(function initNavbar() {
  const navbar = qs('#navbar');
  const toggle = qs('#navToggle');
  const menu   = qs('#navMenu');
  const links  = qsa('.nav-link');
  if (!navbar) return;

  // Scroll glass effect
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // Mobile toggle
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open);
    });

    // Close on link click
    qsa('a', menu).forEach(a => {
      a.addEventListener('click', () => {
        menu.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Active section tracking
  const sections = qsa('section[id]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach(l => l.classList.toggle('active', l.dataset.section === id));
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => observer.observe(s));

  // Smooth scroll for anchor links
  qsa('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return; // FIX: Prevent invalid selector error
      
      const target = qs(href);
      if (target) {
        e.preventDefault();
        const offset = navbar.offsetHeight + 8;
        const top    = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
})();

/* ────────────────────────────────────────
   REVEAL ON SCROLL
──────────────────────────────────────── */
(function initReveal() {
  const els = qsa('.reveal-up, .reveal-left, .reveal-right');
  if (!els.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
})();

/* ────────────────────────────────────────
   STAR CANVAS — HERO BACKGROUND
──────────────────────────────────────── */
(function initStarCanvas() {
  const canvas = qs('#starCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, stars = [];
  const NUM_STARS = 220;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    buildStars();
  }

  function buildStars() {
    stars = Array.from({ length: NUM_STARS }, () => ({
      x:    rand(0, W),
      y:    rand(0, H),
      r:    rand(0.3, 1.6),
      base: rand(0.3, 1),
      speed:rand(0.0003, 0.0015),
      phase:rand(0, Math.PI * 2),
      color: Math.random() > 0.85
        ? `rgba(201,168,76,`
        : `rgba(200,220,255,`
    }));
  }

  let t = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    t += 0.016;

    stars.forEach(s => {
      const alpha = s.base * (0.5 + 0.5 * Math.sin(t * s.speed * 1000 + s.phase));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.color + alpha + ')';
      ctx.fill();
    });

    // Occasional shooting star
    if (Math.random() < 0.002) drawShootingStar();

    requestAnimationFrame(draw);
  }

  function drawShootingStar() {
    const x1 = rand(0, W * 0.7);
    const y1 = rand(0, H * 0.5);
    const len = rand(80, 180);
    const angle = rand(20, 40) * (Math.PI / 180);
    const x2 = x1 + Math.cos(angle) * len;
    const y2 = y1 + Math.sin(angle) * len;

    const grad = ctx.createLinearGradient(x1, y1, x2, y2);
    grad.addColorStop(0, 'rgba(255,255,255,0)');
    grad.addColorStop(0.4, 'rgba(255,255,255,0.7)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');

    ctx.save();
    ctx.strokeStyle = grad;
    ctx.lineWidth   = 1;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });
  draw();
})();

/* ────────────────────────────────────────
   WAVE CANVAS — HERO BOTTOM WAVE
──────────────────────────────────────── */
(function initWaveCanvas() {
  const canvas = qs('#waveCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  let offset = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    offset += 0.006;

    for (let w = 0; w < 3; w++) {
      const amp  = 16 - w * 4;
      const freq = 0.012 + w * 0.003;
      const off  = offset * (1 + w * 0.3);
      const alpha = 0.6 - w * 0.15;

      ctx.beginPath();
      ctx.moveTo(0, H);

      for (let x = 0; x <= W; x += 3) {
        const y = H * 0.45
          + Math.sin(x * freq + off) * amp
          + Math.sin(x * freq * 1.7 + off * 1.3) * (amp * 0.5);
        ctx.lineTo(x, y);
      }

      ctx.lineTo(W, H);
      ctx.closePath();

      const grad = ctx.createLinearGradient(0, 0, W, 0);
      grad.addColorStop(0,   `rgba(18,34,96,0)`);
      grad.addColorStop(0.3, `rgba(18,34,96,${alpha})`);
      grad.addColorStop(0.7, `rgba(30,58,122,${alpha * 0.7})`);
      grad.addColorStop(1,   `rgba(18,34,96,0)`);

      ctx.fillStyle = grad;
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });
  draw();
})();

/* ────────────────────────────────────────
   PHILOSOPHY CANVAS — FLOATING PARTICLES
──────────────────────────────────────── */
(function initPhilosophyCanvas() {
  const canvas = qs('#philosophyCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  const NUM = 60;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    buildParticles();
  }

  function buildParticles() {
    particles = Array.from({ length: NUM }, () => ({
      x:  rand(0, W),
      y:  rand(0, H),
      vy: rand(-0.15, -0.04),
      vx: rand(-0.04, 0.04),
      r:  rand(0.5, 2),
      a:  rand(0.1, 0.5),
      color: Math.random() > 0.6 ? '#c9a84c' : '#a0b8e0'
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      p.y += p.vy;
      p.x += p.vx;
      if (p.y < -10) { p.y = H + 10; p.x = rand(0, W); }
      if (p.x < -10 || p.x > W + 10) { p.x = rand(0, W); }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.a;
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });
  draw();
})();

/* ────────────────────────────────────────
   FOOTER CANVAS — STARS
──────────────────────────────────────── */
(function initFooterCanvas() {
  const canvas = qs('#footerCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, stars = [];
  const NUM = 80;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    stars = Array.from({ length: NUM }, () => ({
      x: rand(0, W), y: rand(0, H),
      r: rand(0.3, 1.2),
      a: rand(0.1, 0.6),
      speed: rand(0.0005, 0.002),
      phase: rand(0, Math.PI * 2)
    }));
  }

  let t = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    t += 0.016;
    stars.forEach(s => {
      const alpha = s.a * (0.5 + 0.5 * Math.sin(t * s.speed * 1000 + s.phase));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(180,200,240,${alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });
  draw();
})();

/* ────────────────────────────────────────
   TYPEWRITER — HERO ROLES
──────────────────────────────────────── */
(function initTypewriter() {
  const el = qs('#typewriter');
  if (!el) return;

  const roles = ['Student', 'Writer', 'Thinker', 'Poet', 'Author', 'Developer'];
  let ri = 0, ci = 0, deleting = false, pause = 0;

  function tick() {
    const word = roles[ri];

    if (pause > 0) { pause--; setTimeout(tick, 60); return; }

    if (!deleting && ci <= word.length) {
      el.textContent = word.slice(0, ci++);
      if (ci > word.length) { pause = 50; deleting = true; }
      setTimeout(tick, 95);
    } else if (deleting && ci >= 0) {
      el.textContent = word.slice(0, ci--);
      if (ci < 0) {
        deleting = false;
        ri = (ri + 1) % roles.length;
        pause = 8;
        ci = 0; // FIX: Reset ci to prevent word.slice(0, -1) glitch
      }
      setTimeout(tick, 55);
    }
  }

  // Start after loader animation
  setTimeout(tick, 2200);
})();

/* ────────────────────────────────────────
   STAT COUNTER ANIMATION
──────────────────────────────────────── */
(function initCounters() {
  const counters = qsa('.stat-number[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = +el.dataset.target;
      const suffix = target >= 15 ? '+' : ''; // Simplified ternary
      const dur    = 1600;
      const start  = performance.now();
      observer.unobserve(el);

      function step(now) {
        const p = clamp((now - start) / dur, 0, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(ease * target) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})()

/* ────────────────────────────────────────
   PREMIUM TESTIMONIALS CAROUSEL
──────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('testimonialsTrack');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const dotsWrap = document.getElementById('carouselDots');
  
  if (!track) return;

  const cards = track.querySelectorAll('.testimonial-card');
  const total = cards.length;
  let current = 0;
  let autoTimer;

  // 1. Build interactive dots
  if (dotsWrap) {
    dotsWrap.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => { goTo(i); startAuto(); });
      dotsWrap.appendChild(dot);
    }
  }

  // 2. Update UI state (Dots + Active Card Fade/Scale)
  function updateState() {
    if (dotsWrap) {
      const dots = dotsWrap.querySelectorAll('.carousel-dot');
      dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
    }
    
    cards.forEach((card, index) => {
      // Auto-collapse open reviews when sliding away
      const textWrap = card.querySelector('.testimonial-text-wrap');
      if (textWrap && index !== current) {
        textWrap.classList.remove('expanded');
        textWrap.classList.add('collapsed');
      }

      // Add the active class to un-fade and scale up the current card
      if (index === current) {
        card.classList.add('active-slide');
      } else {
        card.classList.remove('active-slide');
      }
    });
  }

  // 3. Slide Logic
  function goTo(index) {
    if (index < 0) index = total - 1;
    if (index >= total) index = 0;
    current = index;
    track.style.transform = `translateX(-${current * 100}%)`;
    updateState();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(next, 8000); 
  }

  function stopAuto() {
    clearInterval(autoTimer);
  }

  if (nextBtn) nextBtn.addEventListener('click', () => { stopAuto(); next(); startAuto(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { stopAuto(); prev(); startAuto(); });

  // 4. Mobile Swipe Logic
  let startX = 0;
  track.addEventListener('touchstart', e => { 
    startX = e.touches[0].clientX; 
    stopAuto(); 
  }, { passive: true });
  
  track.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (dx < -50) next();
    if (dx > 50) prev();
    startAuto();
  });

  // 5. Pause carousel when reading long reviews
  track.addEventListener('click', (e) => {
    if (e.target.closest('.read-more-overlay')) stopAuto(); 
    if (e.target.classList.contains('read-less-btn')) startAuto(); 
  });

  // Init
  goTo(0);
  startAuto();
});
/* ────────────────────────────────────────
   BOOK CARD — 3D TILT
──────────────────────────────────────── */
(function initBookTilt() {
  qsa('.book-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect  = card.getBoundingClientRect();
      const cx    = rect.left + rect.width  / 2;
      const cy    = rect.top  + rect.height / 2;
      const dx    = (e.clientX - cx) / (rect.width  / 2);
      const dy    = (e.clientY - cy) / (rect.height / 2);
      const rotX  = dy * -5;
      const rotY  = dx * 6;
      card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.01)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();
/* ────────────────────────────────────────
   CONTACT FORM (FormSubmit AJAX)
──────────────────────────────────────── */
(function initContactForm() {
  const form    = qs('#contactForm');
  const success = qs('#formSuccess');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault(); // Stops the page from refreshing

    const name    = qs('#contactName', form)?.value?.trim() || '';
    const email   = qs('#contactEmail', form)?.value?.trim() || '';
    const subject = qs('#contactSubject', form)?.value?.trim() || 'New Portfolio Contact';
    const message = qs('#contactMessage', form)?.value?.trim() || '';

    if (!name || !email || !message) return; // Basic validation

    const btn = qs('button[type="submit"]', form);
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<span>Sending...</span>`;
    }

    // Send the data in the background using FormSubmit API
    fetch('https://formsubmit.co/ajax/sid@siddhantkumar.in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        email: email,
        _subject: subject,
        message: message,
        _template: 'box'
      })
    })
    .then(response => response.json())
    .then(data => {
      form.reset();
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = `<span>Send Message</span><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8h12M10 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
      }
      
      // FIX: Use the CSS class instead of the hidden attribute
      if (success) { 
        success.classList.add('show'); 
      }
      
      // Hide it after 5 seconds
      setTimeout(() => { 
        if (success) success.classList.remove('show'); 
      }, 5000);
      
    })
    .catch(error => {
      console.error('Error:', error);
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = `<span>Error. Try Again.</span>`;
      }
    });
  });
})();
/* ────────────────────────────────────────
   RESUME DOWNLOAD (placeholder)
──────────────────────────────────────── */
(function initResume() {
  const btn = qs('#downloadResume');
  if (!btn) return;

  btn.addEventListener('click', e => {
    e.preventDefault();
    // In production: replace href with actual PDF link
    const link = document.createElement('a');
    link.href     = '#';
    link.download = 'Siddhant_Kumar_Resume.pdf';
    link.click();
  });
})();

/* ────────────────────────────────────────
   PARALLAX — HERO MONOGRAM
──────────────────────────────────────── */
(function initParallax() {
  const mono = qs('.hero-monogram');
  if (!mono) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    mono.style.transform = `translateY(calc(-50% + ${scrollY * 0.2}px))`;
  }, { passive: true });
})();

/* ────────────────────────────────────────
   GLOWING BORDER ON SCROLL — Quote Cards
──────────────────────────────────────── */
(function initQuoteGlow() {
  const cards = qsa('.quote-card');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const card = entry.target;
      if (entry.isIntersecting) {
        setTimeout(() => card.style.borderColor = 'rgba(201,168,76,0.18)', 200);
      }
    });
  }, { threshold: 0.3 });
  cards.forEach(c => observer.observe(c));
})();

/* ────────────────────────────────────────
   SECTION LABEL LINE ANIMATION
──────────────────────────────────────── */
(function initSectionLabels() {
  const labels = qsa('.section-label');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  labels.forEach(l => { l.style.opacity = '0'; l.style.transition = 'opacity 0.8s 0.2s'; observer.observe(l); });
})();

/* ────────────────────────────────────────
   HERO NAME — LETTER STAGGER
──────────────────────────────────────── */
(function initHeroNameStagger() {
  const nameFirst = qs('.name-first');
  const nameLast  = qs('.name-last');

  function wrapLetters(el) {
    if (!el) return;
    const text = el.textContent;
    el.innerHTML = [...text].map((ch, i) =>
      ch === ' '
        ? ' '
        : `<span class="letter" style="display:inline-block;opacity:0;transform:translateY(30px);transition:opacity 0.5s ${(i * 0.04 + 2.0).toFixed(2)}s ease,transform 0.5s ${(i * 0.04 + 2.0).toFixed(2)}s ease">${ch}</span>`
    ).join('');
  }

  wrapLetters(nameFirst);
  wrapLetters(nameLast);

  // Trigger after loader
  setTimeout(() => {
    qsa('.letter').forEach(l => {
      l.style.opacity   = '1';
      l.style.transform = 'translateY(0)';
    });
  }, 2000);
})();

/* ────────────────────────────────────────
   TIMELINE — GLOW DOT ON HOVER
──────────────────────────────────────── */
(function initTimelineHover() {
  qsa('.timeline-item').forEach(item => {
    const dot = qs('.timeline-dot', item);
    const content = qs('.timeline-content', item);
    if (!dot || !content) return;

    content.addEventListener('mouseenter', () => {
      dot.style.boxShadow = '0 0 20px rgba(201,168,76,0.8), 0 0 40px rgba(201,168,76,0.3)';
      dot.style.transform = 'scale(1.4)';
      dot.style.transition = 'all 0.3s ease';
    });
    content.addEventListener('mouseleave', () => {
      dot.style.boxShadow = '';
      dot.style.transform = '';
    });
  });
})();

/* ────────────────────────────────────────
   SCROLL VELOCITY — SUBTLE DISTORTION
──────────────────────────────────────── */
(function initScrollVelocity() {
  let lastY  = 0;
  let vel    = 0;
  let frames = 0;

  window.addEventListener('scroll', () => {
    vel = window.scrollY - lastY;
    lastY = window.scrollY;
    frames = 8;
  }, { passive: true });

  const heroContent = qs('.hero-content');

  function tick() {
    if (frames > 0 && heroContent) {
      frames--;
      const skew = clamp(vel * 0.015, -1.5, 1.5);
      heroContent.style.transform = `skewY(${skew}deg)`;
      heroContent.style.transition = 'transform 0.4s ease-out';
    } else if (heroContent && frames === 0) {
      heroContent.style.transform = '';
      frames = -1;
    }
    requestAnimationFrame(tick);
  }
  tick();
})();

/* ────────────────────────────────────────
   INIT: Ensure all reveal els start
──────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Trigger initial check for elements in viewport on load
  setTimeout(() => {
    qsa('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.95) {
        el.classList.add('visible');
      }
    });
  }, 2200);
});

/* ────────────────────────────────────────
   BOOK NOTIFICATION MODAL & FORMSUBMIT
──────────────────────────────────────── */
(function initBookModal() {
  const modal = qs('#notifyModal');
  const backdrop = qs('#modalBackdrop');
  const closeBtn = qs('#modalClose');
  const form = qs('#notifyForm');
  const buttons = qsa('.js-notify-btn');
  
  if (!modal || !form) return;

  const titleEl = qs('#modalBookName');
  const inputBookTitle = qs('#formBookTitle');
  const inputSubject = qs('#formSubject');
  const submitBtn = qs('#notifySubmitBtn');
  const successMsg = qs('#notifySuccess');

  // Helper function to open the modal with specific text
  const openModal = (subject, bookNameText) => {
    titleEl.textContent = bookNameText;
    inputBookTitle.value = bookNameText;
    inputSubject.value = subject; // This goes to your email subject line

    form.reset();
    successMsg.style.display = 'none';
    submitBtn.style.display = 'inline-flex';
    modal.classList.add('active');
  };

  // 1. Open Modal via Button Clicks (For specific books).
  //    (The intrusive auto-popup on page load was removed — the waitlist
  //     now opens only when a visitor actively asks to be notified.)
  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const bookName = btn.getAttribute('data-book');
      openModal(`Waitlist: ${bookName}`, bookName);
    });
  });

  // 3. Close Modal Functions (The "Cross" / Background / ESC key)
  const closeModal = () => modal.classList.remove('active');
  
  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // 4. Handle FormSubmit via AJAX (Seamless UX)
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    submitBtn.innerHTML = `<span>Sending...</span>`;
    submitBtn.style.opacity = '0.7';
    submitBtn.style.pointerEvents = 'none';

    // Submit using fetch to FormSubmit's AJAX endpoint
    fetch('https://formsubmit.co/ajax/sid@siddhantkumar.in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: qs('#notifyName').value,
        email: qs('#notifyEmail').value,
        message: qs('#notifyMessage').value,
        Regarding: inputBookTitle.value,
        _subject: inputSubject.value,
        _template: 'table'
      })
    })
    .then(response => response.json())
    .then(data => {
      submitBtn.style.display = 'none';
      successMsg.style.display = 'flex';
      
      // Auto-close modal after 2.5 seconds
      setTimeout(closeModal, 2500);
      
      setTimeout(() => {
        submitBtn.innerHTML = `<span>Send Request</span>`;
        submitBtn.style.opacity = '1';
        submitBtn.style.pointerEvents = 'all';
      }, 3000);
    })
    .catch(error => {
      console.error('Error:', error);
      submitBtn.innerHTML = `<span>Error. Try Again.</span>`;
      submitBtn.style.opacity = '1';
      submitBtn.style.pointerEvents = 'all';
    });
  });
})();

/* ────────────────────────────────────────
   BACK TO TOP
──────────────────────────────────────── */
(function initBackToTop() {
  const btn = qs('#backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 700);
  }, { passive: true });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ────────────────────────────────────────
   FOOTER YEAR — keep copyright current
──────────────────────────────────────── */
(function initFooterYear() {
  const el = qs('#footerYear');
  if (el) el.textContent = new Date().getFullYear();
})();

/* ────────────────────────────────────────
   LAZY IMAGE FADE-IN
   JS adds the fade class so images stay visible if JS never runs.
──────────────────────────────────────── */
(function initImgFade() {
  qsa('img[loading="lazy"]').forEach(img => {
    if (img.complete) return; // already painted — leave it alone
    img.classList.add('img-fade');
    const done = () => img.classList.add('img-loaded');
    img.addEventListener('load',  done, { once: true });
    img.addEventListener('error', done, { once: true });
  });
})();