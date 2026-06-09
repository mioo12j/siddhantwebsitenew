/* ================================================
   GUARDIANS IN THE GALE — Premium JavaScript
   Author: Siddhant Kumar | Design: siddhant
   ================================================ */

// ── MONOCHROMATIC BLUE WATERCOLOR SKY (WEBGL) ───────────────────
(function initSky() {
  const canvas = document.getElementById('skyCanvas');
  if (!canvas) return;

  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) {
    canvas.style.background = '#0a0e1a';
    return;
  }

  const vsSource = `
    attribute vec2 position;
    void main() {
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

  // Fragment Shader: Generates the Watercolor/Oil Blue Sky & Mountains
  const fsSource = `
    precision highp float;
    uniform vec2 u_resolution;
    uniform float u_time;

    // Random hash
    vec2 hash(vec2 p) {
        p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
        return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
    }

    // Simplex Noise
    float noise(vec2 p) {
        const float K1 = 0.366025404;
        const float K2 = 0.211324865;
        vec2 i = floor(p + (p.x + p.y) * K1);
        vec2 a = p - i + (i.x + i.y) * K2;
        vec2 o = (a.x > a.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec2 b = a - o + K2;
        vec2 c = a - 1.0 + 2.0 * K2;
        vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);
        vec3 n = h * h * h * h * vec3(dot(a, hash(i + 0.0)), dot(b, hash(i + o)), dot(c, hash(i + 1.0)));
        return dot(n, vec3(70.0));
    }

    // Fractal Brownian Motion for swirling fluids
    float fbm(vec2 uv) {
        float f = 0.0;
        vec2 p = uv;
        float w = 0.5;
        for(int i = 0; i < 4; i++) {
            f += w * noise(p);
            p *= 2.0;
            w *= 0.5;
        }
        return f;
    }

    void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        vec2 p = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
        
        float t = u_time * 0.08; // Slower, calmer movement

        // 1. Fluid Sky Flow
        vec2 flow = vec2(fbm(p * 1.5 + vec2(t, t * 0.5)), fbm(p * 1.2 - vec2(t * 0.3, t)));
        
        // Add large gentle swirls
        float dCenter = length(p);
        float aCenter = atan(p.y, p.x);
        flow += vec2(sin(aCenter + t), cos(aCenter + t)) * exp(-dCenter * 1.5) * 1.5;

        // 2. Watercolor/Oil Texture
        // Stretch the noise to look like broad, wet brush strokes
        vec2 brush_uv = p * 3.5 + flow * 2.0;
        float strokeVal = fbm(brush_uv * vec2(2.5, 1.0));
        strokeVal += fbm(brush_uv * 8.0) * 0.2; // Fine canvas grit

        // 3. The Blue Palette
        vec3 navy = vec3(0.02, 0.06, 0.18);
        vec3 midnight = vec3(0.08, 0.2, 0.45);
        vec3 skyBlue = vec3(0.2, 0.45, 0.75);
        vec3 paleBlue = vec3(0.5, 0.75, 0.9);

        // Blend the colors based on the stroke math
        float colorMix = smoothstep(0.1, 0.9, strokeVal + flow.x * 0.2);
        
        vec3 skyColor = mix(navy, midnight, smoothstep(0.0, 0.4, colorMix));
        skyColor = mix(skyColor, skyBlue, smoothstep(0.3, 0.7, colorMix));
        skyColor = mix(skyColor, paleBlue, smoothstep(0.6, 1.0, colorMix));

        // 4. Hand-Painted Mountains
        // Base sine waves distorted by noise for organic, painted silhouettes
        float mntNoise = fbm(vec2(uv.x * 5.0, 0.0)) * 0.15;
        
        // Layer 1 (Background Mountains)
        float height1 = 0.28 + 0.08 * sin(uv.x * 6.0) + mntNoise;
        // Layer 2 (Foreground Mountains)
        float height2 = 0.15 + 0.12 * cos(uv.x * 4.0 + 2.0) + fbm(vec2(uv.x * 8.0, 0.0)) * 0.1;

        // Mountain brush texture (vertical strokes)
        float mntStroke = fbm(p * vec2(1.5, 6.0)); 
        
        vec3 mntColor1 = mix(vec3(0.03, 0.08, 0.22), vec3(0.06, 0.15, 0.35), mntStroke);
        vec3 mntColor2 = mix(vec3(0.01, 0.03, 0.1), vec3(0.03, 0.07, 0.18), mntStroke);

        // Soft, bleeding watercolor edges for the mountains
        // Using smoothstep creates the illusion of wet paint blending into the sky
        vec3 finalColor = skyColor;
        
        float edge1 = smoothstep(height1, height1 - 0.06, uv.y + mntStroke * 0.03);
        finalColor = mix(finalColor, mntColor1, edge1);

        float edge2 = smoothstep(height2, height2 - 0.04, uv.y + mntStroke * 0.04);
        finalColor = mix(finalColor, mntColor2, edge2);

        // 5. Presentation adjustments
        // Dark vignette to keep focus centered and text readable
        float vignette = length(uv - vec2(0.5));
        finalColor *= smoothstep(1.2, 0.3, vignette);
        
        // Master dimming to ensure white text pops
        finalColor *= 0.85;

        gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  function createShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  const vs = createShader(gl.VERTEX_SHADER, vsSource);
  const fs = createShader(gl.FRAGMENT_SHADER, fsSource);
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1.0, -1.0,  1.0, -1.0, -1.0,  1.0,
    -1.0,  1.0,  1.0, -1.0,  1.0,  1.0
  ]), gl.STATIC_DRAW);

  const positionLocation = gl.getAttribLocation(program, "position");
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
  const timeLocation = gl.getUniformLocation(program, "u_time");

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  const ro = new ResizeObserver(() => resize());
  ro.observe(canvas);
  resize();

  function render(time) {
    gl.useProgram(program);
    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
    gl.uniform1f(timeLocation, time * 0.001);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
})();

// ── NAVIGATION ──────────────────────────────────
(function initNav() {
  const nav = document.getElementById('mainNav');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinks.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
})();

// ── REVEAL ON SCROLL ─────────────────────────────
(function initReveal() {
  const items = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  items.forEach((el, i) => {
    const parent = el.parentElement;
    const siblings = parent.querySelectorAll(':scope > .reveal');
    siblings.forEach((s, j) => {
      s.style.transitionDelay = `${j * 0.08}s`;
    });
    obs.observe(el);
  });
})();

// ── SMOOTH PARALLAX (pointer only, reduced-motion aware) ─
(function initParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const hero = document.querySelector('.hero');
  if (!hero) return;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const canvas = document.getElementById('skyCanvas');
    if (canvas) canvas.style.transform = `translateY(${y * 0.25}px)`;
    const silhouette = document.querySelector('.hero__silhouette');
    if (silhouette) silhouette.style.transform = `translateY(${y * 0.12}px)`;
  }, { passive: true });
})();

// ── CAROUSEL ─────────────────────────────────────
(function initCarousel() {
  const track = document.getElementById('carouselTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsWrap = document.getElementById('carouselDots');
  if (!track) return;

  const slides = track.querySelectorAll('.carousel__slide');
  let current = 0;
  let autoTimer;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = `carousel__dot${i === 0 ? ' active' : ''}`;
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Go to review ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  function goTo(idx) {
    current = (idx + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsWrap.querySelectorAll('.carousel__dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function startAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(current + 1), 5500);
  }

  prevBtn.addEventListener('click', () => { goTo(current - 1); startAuto(); });
  nextBtn.addEventListener('click', () => { goTo(current + 1); startAuto(); });

  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) { dx < 0 ? goTo(current + 1) : goTo(current - 1); startAuto(); }
  }, { passive: true });

  startAuto();
})();

// ── GALLERY LIGHTBOX ─────────────────────────────
(function initGallery() {
  const lightbox  = document.getElementById('lightbox');
  const lbImg     = document.getElementById('lightboxImg');
  const lbClose   = document.getElementById('lightboxClose');
  const lbPrev    = document.getElementById('lightboxPrev');
  const lbNext    = document.getElementById('lightboxNext');
  const lbCounter = document.getElementById('lightboxCounter');
  if (!lightbox) return;

  const items = document.querySelectorAll('.gallery__item');

  // Flatten EVERY image in the gallery into one list so multi-page
  // letters (e.g. letter 7, parts 1 & 2) are each viewable individually.
  const images = [];
  const itemStart = []; // index of each item's first image in `images`
  items.forEach(item => {
    const imgs = item.querySelectorAll('.gallery__img');
    itemStart.push(images.length);
    imgs.forEach(img => images.push({ src: img.src, alt: img.alt }));
  });

  if (!images.length) return;
  let current = 0;

  function paint() {
    const img = images[current];
    if (!img || !img.src) return;
    lbImg.src = img.src;
    lbImg.alt = img.alt || 'Gallery image';
    if (lbCounter) lbCounter.textContent = `${current + 1} / ${images.length}`;
  }

  function open(idx) {
    current = idx;
    paint();
    lightbox.hidden = false;
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    lightbox.focus();
  }

  function close() {
    lightbox.hidden = true;
    lightbox.style.display = 'none';
    lbImg.src = '';
    document.body.style.overflow = '';
  }

  function navigate(dir) {
    current = (current + dir + images.length) % images.length;
    paint();
  }

  items.forEach((item, i) => {
    item.addEventListener('click', () => open(itemStart[i]));
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(itemStart[i]); }
    });
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', `View gallery image ${i + 1}`);
  });

  lbClose.addEventListener('click', close);
  lbPrev.addEventListener('click',  () => navigate(-1));
  lbNext.addEventListener('click',  () => navigate(1));

  lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });

  document.addEventListener('keydown', e => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft')  navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });
})();

// ── SMOOTH ANCHOR SCROLL ─────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });
});
// ── CONTACT FORM (FormSubmit AJAX, single handler) ───────
(function initContact() {
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('submitBtn');
  if (!form || !submitBtn) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent redirect to FormSubmit "Thank You" page

    const name    = form.querySelector('#contactName')?.value.trim() || '';
    const email   = form.querySelector('#contactEmail')?.value.trim() || '';
    const message = form.querySelector('#contactMessage')?.value.trim() || '';
    if (!name || !email || !message) return; // Basic validation

    const original = submitBtn.innerText;
    submitBtn.innerText = 'Sending…';
    submitBtn.disabled = true;

    fetch('https://formsubmit.co/ajax/sid@siddhantkumar.in', {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(form)
    })
      .then(response => response.json())
      .then(() => {
        form.reset();
        if (success) success.style.display = 'block';
        submitBtn.innerText = original;
        submitBtn.disabled = false;
        setTimeout(() => { if (success) success.style.display = 'none'; }, 5000);
      })
      .catch(() => {
        submitBtn.innerText = 'Error — try again';
        submitBtn.disabled = false;
        setTimeout(() => { submitBtn.innerText = original; }, 3000);
      });
  });
})();

// ── MONOCHROMATIC BLUE WATERCOLOR SKY (WEBGL) ───────────────────
(function initSky() {
  // Find ALL canvases with the class 'webgl-sky' (works for hero and footer!)
  const canvases = document.querySelectorAll('.webgl-sky');
  if (canvases.length === 0) return;

  canvases.forEach(canvas => {
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      canvas.style.background = '#0a0e1a';
      return;
    }

    const vsSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // Fragment Shader
    const fsSource = `
      precision mediump float; // Changed to mediump for better browser compatibility
      uniform vec2 u_resolution;
      uniform float u_time;

      vec2 hash(vec2 p) {
          p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
          return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
      }

      float noise(vec2 p) {
          const float K1 = 0.366025404;
          const float K2 = 0.211324865;
          vec2 i = floor(p + (p.x + p.y) * K1);
          vec2 a = p - i + (i.x + i.y) * K2;
          vec2 o = (a.x > a.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec2 b = a - o + K2;
          vec2 c = a - 1.0 + 2.0 * K2;
          vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);
          vec3 n = h * h * h * h * vec3(dot(a, hash(i + 0.0)), dot(b, hash(i + o)), dot(c, hash(i + 1.0)));
          return dot(n, vec3(70.0));
      }

      float fbm(vec2 uv) {
          float f = 0.0;
          vec2 p = uv;
          float w = 0.5;
          for(int i = 0; i < 4; i++) {
              f += w * noise(p);
              p *= 2.0;
              w *= 0.5;
          }
          return f;
      }

      void main() {
          vec2 uv = gl_FragCoord.xy / u_resolution.xy;
          vec2 p = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
          
          float t = u_time * 0.08; 

          vec2 flow = vec2(fbm(p * 1.5 + vec2(t, t * 0.5)), fbm(p * 1.2 - vec2(t * 0.3, t)));
          float dCenter = length(p);
          float aCenter = atan(p.y, p.x);
          flow += vec2(sin(aCenter + t), cos(aCenter + t)) * exp(-dCenter * 1.5) * 1.5;

          vec2 brush_uv = p * 3.5 + flow * 2.0;
          float strokeVal = fbm(brush_uv * vec2(2.5, 1.0));
          strokeVal += fbm(brush_uv * 8.0) * 0.2;

          vec3 navy = vec3(0.02, 0.06, 0.18);
          vec3 midnight = vec3(0.08, 0.2, 0.45);
          vec3 skyBlue = vec3(0.2, 0.45, 0.75);
          vec3 paleBlue = vec3(0.5, 0.75, 0.9);

          float colorMix = smoothstep(0.1, 0.9, strokeVal + flow.x * 0.2);
          vec3 skyColor = mix(navy, midnight, smoothstep(0.0, 0.4, colorMix));
          skyColor = mix(skyColor, skyBlue, smoothstep(0.3, 0.7, colorMix));
          skyColor = mix(skyColor, paleBlue, smoothstep(0.6, 1.0, colorMix));

          float mntNoise = fbm(vec2(uv.x * 5.0, 0.0)) * 0.15;
          float height1 = 0.28 + 0.08 * sin(uv.x * 6.0) + mntNoise;
          float height2 = 0.15 + 0.12 * cos(uv.x * 4.0 + 2.0) + fbm(vec2(uv.x * 8.0, 0.0)) * 0.1;

          float mntStroke = fbm(p * vec2(1.5, 6.0)); 
          vec3 mntColor1 = mix(vec3(0.03, 0.08, 0.22), vec3(0.06, 0.15, 0.35), mntStroke);
          vec3 mntColor2 = mix(vec3(0.01, 0.03, 0.1), vec3(0.03, 0.07, 0.18), mntStroke);

          vec3 finalColor = skyColor;
          float edge1 = smoothstep(height1, height1 - 0.06, uv.y + mntStroke * 0.03);
          finalColor = mix(finalColor, mntColor1, edge1);
          float edge2 = smoothstep(height2, height2 - 0.04, uv.y + mntStroke * 0.04);
          finalColor = mix(finalColor, mntColor2, edge2);

          float vignette = length(uv - vec2(0.5));
          finalColor *= smoothstep(1.2, 0.3, vignette);
          finalColor *= 0.85;

          gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    function createShader(type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = createShader(gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl.FRAGMENT_SHADER, fsSource);
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1.0, -1.0,  1.0, -1.0, -1.0,  1.0,
      -1.0,  1.0,  1.0, -1.0,  1.0,  1.0
    ]), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const timeLocation = gl.getUniformLocation(program, "u_time");

    function resize() {
      // Use parent element's dimensions to ensure canvas sizes correctly
      const parent = canvas.parentElement;
      canvas.width = parent.offsetWidth || window.innerWidth;
      canvas.height = parent.offsetHeight || window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }

    const ro = new ResizeObserver(() => resize());
    ro.observe(canvas.parentElement || document.body);
    resize();

    function render(time) {
      gl.useProgram(program);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(timeLocation, time * 0.001);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
  });
})();

// ── READING PROGRESS BAR ─────────────────────────
(function initProgress() {
  const bar = document.getElementById('readProgress');
  if (!bar) return;
  const update = () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (total > 0 ? (window.scrollY / total) * 100 : 0) + '%';
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  update();
})();

// ── BACK TO TOP ──────────────────────────────────
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 600);
  }, { passive: true });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// ── GENTLE FADE-IN FOR LAZY IMAGES ───────────────
// JS adds the fade class so images stay visible if JS never runs.
(function initImgFade() {
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    if (img.complete) return; // already painted — leave it alone
    img.classList.add('img-fade');
    const done = () => img.classList.add('img-loaded');
    img.addEventListener('load',  done, { once: true });
    img.addEventListener('error', done, { once: true });
  });
})();
/* ── 3D TILT — mouse-driven perspective on cards ─────────────── */
(function () {
  function tilt3D(selector, opts) {
    opts = opts || {};
    var max = opts.max || 9, depth = opts.depth || 8;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.querySelectorAll(selector).forEach(function (el) {
      el.style.willChange = 'transform';
      el.style.transition = 'transform 0.3s cubic-bezier(0.22,1,0.36,1)';
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = 'perspective(900px) rotateY(' + (px * max) + 'deg) rotateX(' + (-py * max) + 'deg) translateZ(' + depth + 'px)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
  }
  document.addEventListener('DOMContentLoaded', function () {
    tilt3D('.hero__book-frame', { max: 14, depth: 14 });
    tilt3D('.featured__cover-frame', { max: 12, depth: 10 });
    tilt3D('.poem-card', { max: 8 });
    tilt3D('.review-card', { max: 6, depth: 5 });
    tilt3D('.gallery__item', { max: 7 });
  });
})();
