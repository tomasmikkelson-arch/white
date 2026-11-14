(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!('IntersectionObserver' in window) || reduce) return;
  root.classList.add('js');

  // шапка з тінню після прокрутки
  var bar = document.querySelector('.topbar');
  var onScroll = function () { bar.classList.toggle('is-scrolled', window.scrollY > 8); };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // стовпчики графіка виростають по черзі
  document.querySelectorAll('.bars li').forEach(function (li, i) { li.querySelector('i').style.setProperty('--d', i * 70); });

  // поява елементів (з невеликою затримкою в межах одного ряду)
  var items = document.querySelectorAll('.reveal, .stats');
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
  items.forEach(function (el) { io.observe(el); });
})();
