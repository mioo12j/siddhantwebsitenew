/* Shared behaviour for Journal article pages */
(function () {
  var nav = document.getElementById('topnav');
  if (nav) addEventListener('scroll', function () { nav.classList.toggle('scrolled', scrollY > 40); }, { passive: true });

  var bar = document.getElementById('readProgress');
  function prog() { var t = document.documentElement.scrollHeight - innerHeight; if (bar) bar.style.width = (t > 0 ? scrollY / t * 100 : 0) + '%'; }
  addEventListener('scroll', prog, { passive: true }); addEventListener('resize', prog); prog();

  var btt = document.getElementById('backToTop');
  if (btt) {
    addEventListener('scroll', function () { btt.classList.toggle('visible', scrollY > 600); }, { passive: true });
    btt.addEventListener('click', function () { scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();
})();

/* ── 3D TILT on article media + cards ───────────────────────── */
(function () {
  function tilt3D(selector, opts) {
    opts = opts || {};
    var max = opts.max || 8, depth = opts.depth || 7;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.querySelectorAll(selector).forEach(function (el) {
      el.style.willChange = 'transform';
      el.style.transition = 'transform 0.3s cubic-bezier(0.22,1,0.36,1)';
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = 'perspective(1000px) rotateY(' + (px * max) + 'deg) rotateX(' + (-py * max) + 'deg) translateZ(' + depth + 'px)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
  }
  tilt3D('.hero-fig', { max: 6, depth: 8 });
  tilt3D('figure.inline', { max: 5, depth: 6 });
  tilt3D('.related-links a', { max: 8, depth: 6 });
})();
