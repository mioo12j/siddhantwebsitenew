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
