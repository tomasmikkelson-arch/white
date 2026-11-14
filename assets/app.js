(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── шапка: тінь після прокрутки
  var bar = document.querySelector('.topbar');
  var onScroll = function () { bar.classList.toggle('is-scrolled', window.scrollY > 8); };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // ── меню: біла «пігулка» їде під пункт, на який навели, і стоїть під активним розділом
  var nav = document.querySelector('.topnav');
  var pill = nav && nav.querySelector('.topnav__pill');
  var links = nav ? Array.prototype.slice.call(nav.querySelectorAll('a')) : [];
  var active = null;
  function moveTo(a) {
    if (!pill) return;
    if (!a) { pill.classList.remove('is-on'); return; }
    pill.style.width = a.offsetWidth + 'px';
    pill.style.transform = 'translateX(' + a.offsetLeft + 'px)';
    pill.classList.add('is-on');
  }
  links.forEach(function (a) {
    a.addEventListener('mouseenter', function () { moveTo(a); });
    a.addEventListener('focus', function () { moveTo(a); });
  });
  if (nav) nav.addEventListener('mouseleave', function () { moveTo(active); });

  var sections = links.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  var ticking = false;
  function spy() {
    ticking = false;
    var pick = null;
    sections.forEach(function (s, i) {
      if (s && s.getBoundingClientRect().top < window.innerHeight * 0.45) pick = links[i];
    });
    if (pick !== active) {
      links.forEach(function (a) { a.classList.toggle('is-active', a === pick); });
      active = pick;
      if (!nav.matches(':hover')) moveTo(active);
    }
  }
  if (links.length) {
    spy();
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(spy); } }, { passive: true });
  }
  window.addEventListener('resize', function () { moveTo(active); });

  if (!('IntersectionObserver' in window) || reduce) return;
  root.classList.add('js');

  // ── стовпчики графіка виростають по черзі
  document.querySelectorAll('.bar i').forEach(function (i, n) { i.style.setProperty('--d', n * 70); });

  // ── поява елементів
  var io = new IntersectionObserver(function (entries) {
    var n = 0;
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target;
      el.style.transitionDelay = (n++ * 80) + 'ms';
      el.classList.add('is-in');
      setTimeout(function () { el.style.transitionDelay = ''; }, 900);
      io.unobserve(el);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  document.querySelectorAll('.reveal, .stats').forEach(function (el) { io.observe(el); });
})();
