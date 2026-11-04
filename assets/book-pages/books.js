/* Progressive enhancement for the book pages. Reading and navigation work without it. */
(function () {
  'use strict';
  var page = document.querySelector('.book-page');
  if (!page || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  var items = page.querySelectorAll('.bp-section-head, .bp-thinker, .bp-flight-stop, .bp-scenario, .bp-sample');
  if (!items.length) return;
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('bp-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08 });
  items.forEach(function (item) { item.classList.add('bp-reveal'); observer.observe(item); });
  page.classList.add('bp-motion-ready');
})();
