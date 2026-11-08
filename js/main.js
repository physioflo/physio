/* Physiotherapie Voithofer – dezente Interaktionen, keine Tracker, keine externen Anfragen */
(function () {
  var doc = document.documentElement;
  var header = document.querySelector('.header');
  var burger = document.querySelector('.burger');
  var nav = document.getElementById('nav');
  var fab = document.querySelector('.call-fab');
  var mark = document.querySelector('[data-parallax]');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Start-Animation: 1,4 s Logo, danach Ausblenden */
  var splashOn = doc.classList.contains('splash-on');
  if (splashOn) {
    setTimeout(function () { doc.classList.add('splash-done'); }, 1400);
    setTimeout(function () { doc.classList.remove('splash-on', 'splash-done'); }, 1950);
  }

  /* Mobiles Menü */
  function setMenu(open) {
    doc.classList.toggle('menu-open', open);
    if (burger) {
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    }
  }
  if (burger && nav) {
    burger.addEventListener('click', function () { setMenu(!doc.classList.contains('menu-open')); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
    window.addEventListener('resize', function () { if (window.innerWidth > 1020) setMenu(false); });
  }

  /* Scroll-Zustand (Header, Parallax, Anruf-Button) */
  var ticking = false;
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('is-scrolled', y > 8);
    if (mark && !reduce && window.innerWidth > 900) mark.style.setProperty('--py', (y * 0.08).toFixed(1) + 'px');
    if (fab) fab.classList.toggle('is-visible', y > 420);
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* Einblenden beim Scrollen */
  var items = document.querySelectorAll('[data-reveal], .step');
  function startReveal() {
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('is-in'); });
  }
  }
  if (splashOn) { setTimeout(startReveal, 1350); } else { startReveal(); }

  /* Jahr im Footer */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
