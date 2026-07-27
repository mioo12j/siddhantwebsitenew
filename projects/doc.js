/* ═══════════════════════════════════════════════════════════════════
   doc.js — runtime behaviour for project documentation pages.

   · theme toggle (persisted, honours prefers-color-scheme)
   · reading progress indicator
   · sticky TOC scroll-spy + TOC filter
   · copy-code, download-code, expand-code
   · in-page find bar (Ctrl/Cmd+F takeover, ⎋ to close)
   · lazy image loading with SVG fallback on network failure
   · print helper, back-to-top, toast notifications
════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var qs = function (s, c) { return (c || document).querySelector(s); };
  var qsa = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── toast ─────────────────────────────────────────────────── */
  var toastEl = null, toastTimer = null;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.id = 'toast';
      toastEl.setAttribute('role', 'status');
      toastEl.setAttribute('aria-live', 'polite');
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 2200);
  }

  /* ── theme ─────────────────────────────────────────────────── */
  (function () {
    var btn = qs('#themeToggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var light = document.documentElement.getAttribute('data-theme') === 'light';
      var next = light ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('sk-doc-theme', next); } catch (e) { /* private mode */ }
      btn.setAttribute('aria-label', next === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
      var m = qs('meta[name="theme-color"]');
      if (m) m.setAttribute('content', next === 'light' ? '#fbfaf7' : '#060c1a');
    });
  })();

  /* ── reading progress ──────────────────────────────────────── */
  (function () {
    var bar = qs('#readprog'), mini = qs('#tocProgBar'), pct = qs('#tocProgPct');
    var btt = qs('#backToTop'), ticking = false;
    function update() {
      var doc = document.documentElement;
      var total = doc.scrollHeight - window.innerHeight;
      var p = total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0;
      if (bar) bar.style.width = (p * 100).toFixed(2) + '%';
      if (mini) mini.style.width = (p * 100).toFixed(2) + '%';
      if (pct) pct.textContent = Math.round(p * 100) + '% read';
      if (btt) btt.classList.toggle('visible', window.scrollY > 700);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
    if (btt) btt.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    });
  })();

  /* ── TOC scroll-spy ────────────────────────────────────────── */
  (function () {
    var links = qsa('.toc-nav a[href^="#"]');
    if (!links.length) return;
    var map = {};
    var targets = [];
    links.forEach(function (a) {
      var id = decodeURIComponent(a.getAttribute('href').slice(1));
      var el = document.getElementById(id);
      if (!el) return;
      (map[id] = map[id] || []).push(a);
      targets.push(el);
    });
    if (!targets.length) return;

    var current = null;
    function setActive(id) {
      if (id === current) return;
      current = id;
      links.forEach(function (a) { a.classList.remove('active'); a.removeAttribute('aria-current'); });
      (map[id] || []).forEach(function (a) {
        a.classList.add('active');
        a.setAttribute('aria-current', 'true');
        var nav = a.closest('.toc-nav');
        if (nav && nav.scrollHeight > nav.clientHeight) {
          var top = a.offsetTop - nav.clientHeight / 2;
          if (Math.abs(nav.scrollTop - top) > 60) nav.scrollTo({ top: top, behavior: reduced ? 'auto' : 'smooth' });
        }
      });
    }

    var obs = new IntersectionObserver(function () {
      /* pick the last heading whose top is above the reading line */
      var line = window.innerHeight * 0.28;
      var best = targets[0];
      for (var i = 0; i < targets.length; i++) {
        if (targets[i].getBoundingClientRect().top <= line) best = targets[i];
      }
      /* at the very bottom, activate the final section */
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4)
        best = targets[targets.length - 1];
      setActive(best.id);
    }, { rootMargin: '-25% 0px -65% 0px', threshold: [0, 1] });
    targets.forEach(function (t) { obs.observe(t); });

    var raf = false;
    window.addEventListener('scroll', function () {
      if (raf) return; raf = true;
      requestAnimationFrame(function () {
        raf = false;
        var line = window.innerHeight * 0.28, best = targets[0];
        for (var i = 0; i < targets.length; i++)
          if (targets[i].getBoundingClientRect().top <= line) best = targets[i];
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4)
          best = targets[targets.length - 1];
        setActive(best.id);
      });
    }, { passive: true });
  })();

  /* ── TOC filter ────────────────────────────────────────────── */
  (function () {
    qsa('.toc-search input').forEach(function (input) {
      var nav = input.closest('.doc-toc-wrap, .toc-mobile');
      if (!nav) return;
      var items = qsa('.toc-nav li', nav);
      input.addEventListener('input', function () {
        var q = input.value.trim().toLowerCase();
        items.forEach(function (li) {
          var t = (li.textContent || '').toLowerCase();
          li.style.display = (!q || t.indexOf(q) !== -1) ? '' : 'none';
        });
      });
    });
  })();

  /* ── copy / download / expand code ─────────────────────────── */
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise(function (res, rej) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;top:-2000px;left:-2000px;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); res(); } catch (e) { rej(e); }
      document.body.removeChild(ta);
    });
  }

  qsa('.code-btn[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var block = btn.closest('.codeblock');
      var code = block && block.querySelector('pre code');
      if (!code) return;
      copyText(code.innerText).then(function () {
        var label = btn.querySelector('.lbl');
        var old = label ? label.textContent : '';
        btn.classList.add('done');
        if (label) label.textContent = 'Copied';
        toast('Code copied to clipboard');
        setTimeout(function () { btn.classList.remove('done'); if (label) label.textContent = old; }, 1800);
      }).catch(function () { toast('Copy failed — select the code manually'); });
    });
  });

  qsa('.code-btn[data-download]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var block = btn.closest('.codeblock');
      var code = block && block.querySelector('pre code');
      if (!code) return;
      var name = btn.getAttribute('data-download') || 'source.txt';
      var blob = new Blob([code.innerText], { type: 'text/plain;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url; a.download = name;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
      toast('Downloading ' + name);
    });
  });

  qsa('.code-expand').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var block = btn.closest('.codeblock');
      var open = block.classList.toggle('tall');
      btn.textContent = open ? 'Collapse' : 'Expand full listing';
      btn.setAttribute('aria-expanded', String(open));
    });
  });

  /* download every listing on the page as one bundle */
  (function () {
    var btn = qs('#downloadAll');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var parts = [];
      var title = (qs('h1') && qs('h1').innerText.trim()) || 'Project';
      parts.push('/* ' + title + ' — complete source bundle\n   ' + location.href + '\n   © Siddhant Kumar. Educational use permitted with attribution. */\n');
      qsa('.codeblock').forEach(function (b) {
        var nm = b.getAttribute('data-file') || 'snippet';
        var code = b.querySelector('pre code');
        if (!code) return;
        parts.push('\n\n/* ══════════════ ' + nm + ' ══════════════ */\n\n' + code.innerText);
      });
      if (parts.length < 2) { toast('No source listings on this page'); return; }
      var slug = (location.pathname.split('/').pop() || 'project').replace(/\.html?$/, '');
      var blob = new Blob([parts.join('')], { type: 'text/plain;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url; a.download = slug + '-source.txt';
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
      toast('Source bundle downloaded');
    });
  })();

  /* ── print ─────────────────────────────────────────────────── */
  (function () {
    var btn = qs('#printBtn');
    if (!btn) return;
    btn.addEventListener('click', function () {
      qsa('details').forEach(function (d) { d.dataset.wasOpen = d.open ? '1' : '0'; d.open = true; });
      window.print();
    });
    window.addEventListener('afterprint', function () {
      qsa('details').forEach(function (d) {
        if (d.dataset.wasOpen === '0' && !d.classList.contains('keep-open')) d.open = false;
        delete d.dataset.wasOpen;
      });
    });
  })();

  /* ── in-page find ──────────────────────────────────────────── */
  (function () {
    var bar = qs('#findbar');
    if (!bar) return;
    var input = qs('input', bar), count = qs('.fcount', bar);
    var prevBtn = qs('[data-find-prev]', bar), nextBtn = qs('[data-find-next]', bar), closeBtn = qs('[data-find-close]', bar);
    var scope = qs('.doc-body');
    var hits = [], idx = -1;

    function clear() {
      qsa('.search-hit', scope).forEach(function (m) {
        var p = m.parentNode;
        p.replaceChild(document.createTextNode(m.textContent), m);
        p.normalize();
      });
      hits = []; idx = -1;
      count.textContent = '';
    }

    function run(term) {
      clear();
      if (!term || term.length < 2) return;
      var needle = term.toLowerCase();
      var walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT, {
        acceptNode: function (n) {
          if (!n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
          var p = n.parentNode;
          if (!p || /^(SCRIPT|STYLE|SVG|NOSCRIPT)$/.test(p.nodeName)) return NodeFilter.FILTER_REJECT;
          if (p.closest && p.closest('svg')) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      });
      var nodes = [], n;
      while ((n = walker.nextNode())) nodes.push(n);

      nodes.forEach(function (node) {
        var txt = node.nodeValue, low = txt.toLowerCase(), at = low.indexOf(needle);
        if (at === -1) return;
        var frag = document.createDocumentFragment(), last = 0;
        while (at !== -1) {
          if (at > last) frag.appendChild(document.createTextNode(txt.slice(last, at)));
          var mk = document.createElement('mark');
          mk.className = 'search-hit';
          mk.textContent = txt.slice(at, at + term.length);
          frag.appendChild(mk);
          hits.push(mk);
          last = at + term.length;
          at = low.indexOf(needle, last);
        }
        if (last < txt.length) frag.appendChild(document.createTextNode(txt.slice(last)));
        node.parentNode.replaceChild(frag, node);
      });

      if (hits.length) { idx = 0; focusHit(); } else count.textContent = '0 / 0';
    }

    function focusHit() {
      hits.forEach(function (h) { h.classList.remove('current'); });
      if (idx < 0 || !hits.length) return;
      var h = hits[idx];
      h.classList.add('current');
      /* open any collapsed ancestor so the hit is visible */
      var d = h.closest('details');
      while (d) { d.open = true; d = d.parentElement && d.parentElement.closest('details'); }
      h.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' });
      count.textContent = (idx + 1) + ' / ' + hits.length;
    }

    function open() {
      bar.classList.add('open');
      input.focus(); input.select();
    }
    function close() { bar.classList.remove('open'); clear(); input.value = ''; }

    var deb;
    input.addEventListener('input', function () {
      clearTimeout(deb);
      deb = setTimeout(function () { run(input.value.trim()); }, 200);
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); if (!hits.length) return; idx = (idx + (e.shiftKey ? -1 : 1) + hits.length) % hits.length; focusHit(); }
      if (e.key === 'Escape') { e.preventDefault(); close(); }
    });
    if (nextBtn) nextBtn.addEventListener('click', function () { if (hits.length) { idx = (idx + 1) % hits.length; focusHit(); } });
    if (prevBtn) prevBtn.addEventListener('click', function () { if (hits.length) { idx = (idx - 1 + hits.length) % hits.length; focusHit(); } });
    if (closeBtn) closeBtn.addEventListener('click', close);
    var openBtn = qs('#findToggle');
    if (openBtn) openBtn.addEventListener('click', function () { bar.classList.contains('open') ? close() : open(); });

    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') { e.preventDefault(); open(); }
      if (e.key === '/' && document.activeElement === document.body) { e.preventDefault(); open(); }
      if (e.key === 'Escape' && bar.classList.contains('open')) close();
    });
  })();

  /* ── images: lazy + graceful fallback ──────────────────────── */
  qsa('figure.photo img').forEach(function (img) {
    img.addEventListener('error', function () {
      var fig = img.closest('figure.photo');
      if (!fig) return;
      var fb = fig.querySelector('template.fallback');
      if (fb) {
        var holder = document.createElement('div');
        holder.className = 'photo-fallback';
        holder.appendChild(fb.content.cloneNode(true));
        img.replaceWith(holder);
        var cap = fig.querySelector('figcaption');
        if (cap) {
          var note = cap.querySelector('.credit');
          if (note) note.innerHTML = 'Reference photograph unavailable offline — the diagram above is an original illustration. ' + note.innerHTML;
        }
      } else {
        fig.style.display = 'none';
      }
    }, { once: true });
  });

  /* ── keyboard shortcuts: previous / next project ───────────── */
  document.addEventListener('keydown', function (e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    var t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
    if (e.key === 'ArrowLeft') { var p = qs('.pagenav a.prev:not(.disabled)'); if (p) location.href = p.href; }
    if (e.key === 'ArrowRight') { var n = qs('.pagenav a.next:not(.disabled)'); if (n) location.href = n.href; }
  });

  /* ── year stamp ────────────────────────────────────────────── */
  qsa('.yr').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
