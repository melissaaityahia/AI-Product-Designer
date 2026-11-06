// Menu mobile, diaporamas, carrousels et étapes du process
(function () {
  // Toujours arriver en haut de page (titre + image), sauf lien vers une ancre
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  // Le haut de page est ramené dans la vue, y compris quand le site est affiché
  // dans un cadre (iframe) dont la page parente garde sa position de défilement.
  var userMoved = false;
  ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach(function (ev) {
    window.addEventListener(ev, function () { userMoved = true; }, { once: true, passive: true });
  });
  function toTop() {
    if (location.hash || userMoved) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    var first = document.querySelector('.site-header') || document.body;
    try { first.scrollIntoView({ block: 'start', behavior: 'instant' }); } catch (e) { first.scrollIntoView(true); }
  }
  toTop();
  window.addEventListener('load', toTop);
  window.addEventListener('pageshow', function (e) { if (e.persisted) { userMoved = false; toTop(); } });
  // Bouton retour en haut
  var top = document.querySelector('.to-top');
  if (top) {
    var onScroll = function () { top.hidden = window.scrollY < 600; };
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
    top.addEventListener('click', function (e) { e.preventDefault(); window.scrollTo({ top: 0 }); var h = document.querySelector('main h1'); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); } });
  }
  // Menu
  var t = document.querySelector('.menu-toggle'), m = document.getElementById('menu');
  if (t && m) {
    t.addEventListener('click', function () {
      var o = t.getAttribute('aria-expanded') === 'true';
      t.setAttribute('aria-expanded', String(!o)); m.classList.toggle('open', !o);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && m.classList.contains('open')) { m.classList.remove('open'); t.setAttribute('aria-expanded', 'false'); t.focus(); }
    });
  }

  // Diaporamas : une image à la fois, flèches + points
  document.querySelectorAll('.slider').forEach(function (s) {
    var track = s.querySelector('.slider-track'), slides = s.querySelectorAll('.slide'), dots = s.querySelectorAll('.dot');
    var prev = s.querySelector('.arrow--prev'), next = s.querySelector('.arrow--next');
    function index() { return Math.round(track.scrollLeft / track.clientWidth); }
    function go(i) { i = Math.max(0, Math.min(slides.length - 1, i)); track.scrollTo({ left: i * track.clientWidth }); }
    function update() {
      var i = index();
      dots.forEach(function (d, k) { d.setAttribute('aria-current', k === i ? 'true' : 'false'); });
      slides.forEach(function (sl, k) { sl.setAttribute('aria-hidden', k === i ? 'false' : 'true'); sl.inert = k !== i; });
      prev.disabled = i === 0; next.disabled = i === slides.length - 1;
    }
    prev.addEventListener('click', function () { go(index() - 1); });
    next.addEventListener('click', function () { go(index() + 1); });
    dots.forEach(function (d, k) { d.addEventListener('click', function () { go(k); }); });
    track.addEventListener('scroll', function () { window.requestAnimationFrame(update); }, { passive: true });
    s.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { go(index() - 1); e.preventDefault(); }
      if (e.key === 'ArrowRight') { go(index() + 1); e.preventDefault(); }
    });
    if (slides.length < 2) { prev.hidden = next.hidden = true; s.querySelector('.dots').hidden = true; }
    update();
  });

  // Carrousels : défilement horizontal par groupe d'images
  document.querySelectorAll('.carousel').forEach(function (c) {
    var track = c.querySelector('.carousel-track'), prev = c.querySelector('.arrow--prev'), next = c.querySelector('.arrow--next');
    function update() {
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
      c.querySelector('.carousel-nav').hidden = track.scrollWidth <= track.clientWidth + 2;
    }
    prev.addEventListener('click', function () { track.scrollBy({ left: -track.clientWidth * 0.8 }); });
    next.addEventListener('click', function () { track.scrollBy({ left: track.clientWidth * 0.8 }); });
    track.addEventListener('scroll', function () { window.requestAnimationFrame(update); }, { passive: true });
    window.addEventListener('resize', update);
    update();
  });

  // Étapes : barre fixe compacte une fois le stepper dépassé
  var proc = document.querySelector('.sec--process'), header = document.querySelector('.site-header');
  if (proc) {
    var stuck = false;
    var headerH = function () { return header ? header.offsetHeight : 0; };
    var measure = function () { if (!stuck) { proc.style.minHeight = ''; proc.style.minHeight = proc.offsetHeight + 'px'; } };
    var setStuck = function (on) {
      if (on === stuck) return;
      stuck = on; proc.classList.toggle('is-stuck', on);
      document.documentElement.classList.toggle('has-stuck-steps', on);
    };
    var ticking = false;
    var check = function () { ticking = false; setStuck(proc.getBoundingClientRect().bottom <= headerH()); };
    var onScroll = function () { if (!ticking) { ticking = true; window.requestAnimationFrame(check); } };
    measure(); check();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('load', function () { measure(); check(); });
    window.addEventListener('resize', function () { measure(); check(); });
    if (header) proc.style.setProperty('--header-h', headerH() + 'px');
  }

  // Étapes : met en évidence l'étape de la section visible
  var links = Array.prototype.slice.call(document.querySelectorAll('.process a[href^="#section-"]'));
  if (links.length && 'IntersectionObserver' in window) {
    var targets = links.map(function (a) { return document.querySelector(a.getAttribute('href')); }).filter(Boolean);
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var id = '#' + en.target.id, hit = false;
        links.forEach(function (a) {
          var on = a.getAttribute('href') === id && !hit;
          if (on) hit = true;
          if (on) a.setAttribute('aria-current', 'step'); else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    targets.forEach(function (t) { io.observe(t); });
  }
})();
