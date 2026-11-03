(function () {
  'use strict';
  var PHONE_WA = '79036371057';
  var mobile = window.matchMedia('(max-width: 760px)').matches;
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- время в Орле (UTC+3) ---------- */
  function orelNow() {
    var d = new Date();
    return new Date(d.getTime() + d.getTimezoneOffset() * 60000 + 3 * 3600000);
  }

  /* ---------- открыто / закрыто: ежедневно 10:00–00:00 ---------- */
  function status() {
    var t = orelNow(), h = t.getHours();
    var open = h >= 10;
    var txt = open ? 'Открыто до 00:00' : 'Откроемся в 10:00';
    ['status', 'status2'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.textContent = id === 'status2' ? (open ? 'сейчас открыто' : 'сейчас закрыто, откроемся в 10:00') : txt;
      el.classList.toggle('is-open', open);
    });
  }
  status();
  setInterval(status, 60000);

  /* ---------- новогодний блок: 1 октября – 31 декабря ---------- */
  (function season() {
    var t = orelNow(), m = t.getMonth();
    var on = m >= 9;
    document.querySelectorAll('[data-season]').forEach(function (el) { el.hidden = !on; });
    var y = document.getElementById('nyYear');
    if (y) y.textContent = t.getFullYear() + 1;
  })();

  /* ---------- шапка ---------- */
  var top = document.getElementById('top');
  function onScroll() { top.classList.toggle('is-solid', window.scrollY > 40); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var burger = document.getElementById('burger'), nav = document.getElementById('nav');
  burger.addEventListener('click', function () {
    var open = !nav.classList.contains('is-open');
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open);
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') { nav.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); }
  });

  /* ---------- видео: лёгкие на телефоне, играют только на экране ---------- */
  var vids = [].slice.call(document.querySelectorAll('video[data-v]'));
  vids.forEach(function (v) {
    v.muted = true;
    v.setAttribute('muted', '');
  });
  function load(v) {
    if (v.dataset.loaded) return;
    v.dataset.loaded = '1';
    v.src = 'video/' + v.dataset.v + (mobile ? '-m' : '') + '.mp4';
  }
  if (!calm && 'IntersectionObserver' in window) {
    var vio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting) {
          load(v);
          var p = v.play();
          if (p && p.catch) p.catch(function () {});
        } else if (!v.paused) {
          v.pause();
        }
      });
    }, { rootMargin: '200px 0px' });
    vids.forEach(function (v) { vio.observe(v); });
  }

  /* ---------- появление блоков ---------- */
  var rev = [].slice.call(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window && !calm) {
    var rio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); rio.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    rev.forEach(function (el) { rio.observe(el); });
  } else {
    rev.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- пакеты и калькулятор ---------- */
  var PK = {
    adult: [
      { id: 'a1', name: 'Банкет «Всё включено»', price: 1700, items: ['Отдельный зал на 3 часа', 'Меню: салат и горячее на выбор с картофельными дольками, хлебная корзина', 'Сервировка и официант', 'Музыкальное сопровождение', 'Торжественный вынос торта'] },
      { id: 'a2', name: 'Банкет «Всё включено maxi»', price: 2500, items: ['Отдельный зал на 5 часов', 'Меню: салат на выбор, жульен с курицей и грибами в хлебном горшочке, горячее с картофельными дольками, хлебная корзина и закуски', 'Сервировка и официанты', 'Музыкальное сопровождение'] },
      { id: 'a3', name: 'Банкет «Ультра всё включено»', price: 2900, items: ['Можно приносить свою еду, закуски и напитки', 'Без обязательного депозита на алкоголь'], note: 'Полный состав пакета расскажет администратор' },
      { id: 'a4', name: 'Банкет «Ультра всё включено maxi»', price: 3300, items: ['Можно приносить свою еду, закуски и напитки', 'Без обязательного депозита на алкоголь'], note: 'Полный состав пакета расскажет администратор' }
    ],
    kids: [
      { id: 'k1', name: 'Детский «Всё включено»', price: 1500, items: ['Можно приносить любимые блюда и напитки именинника', 'Удобная рассадка для взрослых', 'Всё необходимое для сервировки'] },
      { id: 'k2', name: 'Детский «Ультра всё включено»', price: 1900, items: ['Зал для детского торжества без ограничений: «у нас можно всё»'], note: 'Полный состав пакета расскажет администратор' },
      { id: 'k3', name: 'Детский праздник «Собери всех»', fixed: 14900, items: ['Отдельный зал на 3 часа с официантом', 'Игровая программа с аниматором на 2 часа и дискотека', 'Аквагрим и мини-ленточное шоу', 'Композиция из шаров, чаепитие', 'Фонтан-фейерверк и свечи в торт'], note: 'Цена за праздник целиком' },
      { id: 'k4', name: 'Аниматор на выезд', fixed: 4500, unit: '60 минут', items: ['Аниматоры, которые влюбляют в себя с первой минуты', 'Без шаблонных и скучных конкурсов'] }
    ]
  };
  var tab = 'adult', sel = 'a1';
  var pkEl = document.getElementById('pk');
  var guests = document.getElementById('guests');
  var gOut = document.getElementById('guestsOut');
  var nf = function (n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); };
  function plural(n, a, b, c) {
    var m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return a;
    if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return b;
    return c;
  }
  function find(id) {
    return PK.adult.concat(PK.kids).filter(function (p) { return p.id === id; })[0];
  }
  function render() {
    pkEl.innerHTML = '';
    PK[tab].forEach(function (p) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'card';
      b.setAttribute('role', 'radio');
      b.setAttribute('aria-checked', p.id === sel ? 'true' : 'false');
      b.dataset.id = p.id;
      var price = p.fixed ? nf(p.fixed) + ' ₽' + (p.unit ? ' <small>/ ' + p.unit + '</small>' : '') : 'от ' + nf(p.price) + ' ₽ <small>за гостя</small>';
      b.innerHTML = '<span class="card__tick" aria-hidden="true"></span><h3>' + p.name + '</h3><p class="card__p">' + price + '</p><ul>' +
        p.items.map(function (i) { return '<li>' + i + '</li>'; }).join('') + '</ul>' + (p.note ? '<p class="card__note">' + p.note + '</p>' : '');
      b.addEventListener('click', function () { sel = p.id; render(); });
      pkEl.appendChild(b);
    });
    calc();
  }
  function calc() {
    var p = find(sel), n = +guests.value;
    gOut.textContent = n;
    guests.style.setProperty('--p', ((n - guests.min) / (guests.max - guests.min) * 100) + '%');
    var total = p.fixed ? p.fixed : p.price * n;
    var noGuests = !!p.unit;
    ['guests'].forEach(function (id) { document.getElementById(id).hidden = noGuests; });
    document.querySelector('.sum__row').hidden = noGuests;
    document.querySelector('.sum__scale').hidden = noGuests;
    document.getElementById('sumLabel').textContent = p.name;
    document.getElementById('sumTotal').textContent = (p.fixed ? '' : '≈ ') + nf(total) + ' ₽';
    document.getElementById('sumCalc').textContent = p.fixed
      ? (p.unit ? 'за ' + p.unit : 'за праздник, ' + n + ' ' + plural(n, 'гость', 'гостя', 'гостей') + ' — количество детей уточните')
      : n + ' ' + plural(n, 'гость', 'гостя', 'гостей') + ' × ' + nf(p.price) + ' ₽';
    var msg = 'Здравствуйте! Хочу узнать свободную дату. ' + p.name + ', ' + n + ' ' + plural(n, 'гость', 'гостя', 'гостей') + '.';
    document.getElementById('waBtn').href = 'https://wa.me/' + PHONE_WA + '?text=' + encodeURIComponent(msg);
  }
  guests.addEventListener('input', calc);

  function setTab(t) {
    tab = t;
    sel = PK[t][0].id;
    document.querySelectorAll('.tab').forEach(function (b) {
      var on = b.dataset.tab === t;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-selected', on);
    });
    render();
  }
  document.querySelectorAll('.tab').forEach(function (b) {
    b.addEventListener('click', function () { setTab(b.dataset.tab); });
  });
  document.querySelectorAll('.price[data-tab]').forEach(function (a) {
    a.addEventListener('click', function () { setTab(a.dataset.tab); });
  });
  render();
})();
