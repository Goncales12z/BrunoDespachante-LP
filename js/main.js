/* Bruno Despachante Veicular - animações e interações */
(function(){
  'use strict';

  /* ===== Configuração do cliente (confirme os dados antes de publicar) ===== */
  var CFG = {
    wa: '5521964607863',
    defaultMsg: 'Olá, Bruno! Vim pelo seu site e gostaria de um orçamento.'
  };

  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var A = window.anime;
  var canAnim = !!A && !reduce;
  if (!canAnim) root.classList.remove('anim');

  /* ===== Links do WhatsApp ===== */
  function waLink(msg){ return 'https://wa.me/' + CFG.wa + '?text=' + encodeURIComponent(msg || CFG.defaultMsg); }
  [].forEach.call(document.querySelectorAll('[data-wa]'), function(a){
    a.href = waLink(a.getAttribute('data-wa'));
    a.target = '_blank';
    a.rel = 'noopener';
  });

  /* ===== Abas "O que você precisa resolver?" ===== */
  var tabs = [].slice.call(document.querySelectorAll('.tab'));
  function showCase(id, userAction){
    tabs.forEach(function(t){
      var on = t.getAttribute('data-case') === id;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
    });
    [].forEach.call(document.querySelectorAll('.panel'), function(p){
      p.hidden = (p.id !== 'panel-' + id);
    });
    var panel = document.getElementById('panel-' + id);
    if (canAnim && userAction) {
      A.remove('#panel-' + id + ' .panel-li');
      A({
        targets: '#panel-' + id + ' .panel-li',
        opacity: [0, 1], translateX: [-16, 0],
        delay: A.stagger(70), duration: 460, easing: 'easeOutQuad'
      });
    }
    if (userAction && window.innerWidth < 900 && panel) {
      panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }
  tabs.forEach(function(t, i){
    t.addEventListener('click', function(){ showCase(t.getAttribute('data-case'), true); });
    t.addEventListener('keydown', function(e){
      var k = e.key, n = -1;
      if (k === 'ArrowDown' || k === 'ArrowRight') n = (i + 1) % tabs.length;
      else if (k === 'ArrowUp' || k === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
      else if (k === 'Home') n = 0;
      else if (k === 'End') n = tabs.length - 1;
      if (n > -1) { e.preventDefault(); tabs[n].focus(); showCase(tabs[n].getAttribute('data-case'), true); }
    });
  });

  /* ===== Banda de pneu (chevrons) desenhada em SVG ===== */
  var treads = [].slice.call(document.querySelectorAll('.tread'));
  function buildTreads(){
    treads.forEach(function(svg){
      var w = Math.max(320, Math.round(svg.getBoundingClientRect().width || 800));
      var step = 22, n = Math.ceil(w / step) + 1, d = 'M0 3';
      for (var i = 0; i < n; i++) d += ' L' + (i * step + step / 2) + ' 19 L' + ((i + 1) * step) + ' 3';
      svg.setAttribute('viewBox', '0 0 ' + w + ' 22');
      var p = svg.querySelector('path');
      p.setAttribute('d', d);
      var len = p.getTotalLength();
      p._len = len;
      if (canAnim && !svg._drawn) { p.style.strokeDasharray = len; p.style.strokeDashoffset = len; }
    });
  }
  function drawTread(svg){
    var p = svg.querySelector('path'); svg._drawn = true;
    if (!canAnim || !p._len) return;
    A({ targets: p, strokeDashoffset: [p._len, 0], duration: 1800, easing: 'easeInOutSine' });
  }

  /* ===== Efeitos que respondem à rolagem ===== */
  var progLine = document.querySelector('.progress-line');
  var progCar  = document.querySelector('.progress-car');
  var hint     = document.querySelector('.scroll-hint');
  var hero     = document.querySelector('.hero');
  var heroTl   = null;

  var wayList = document.querySelector('.way-list');
  var roadEl  = document.querySelector('.way-road');
  var carEl   = document.querySelector('.car');
  var stops   = [].slice.call(document.querySelectorAll('.stop'));
  var wayH = 0, stopY = [], stopState = [], wayTl = null;

  function layoutWay(){
    if (!wayList || !stops.length) return;
    var lr = wayList.getBoundingClientRect();
    var centers = stops.map(function(s){
      var d = s.querySelector('.stop-dot').getBoundingClientRect();
      return d.top - lr.top + d.height / 2;
    });
    var first = centers[0], last = centers[centers.length - 1];
    wayH = Math.max(1, last - first);
    stopY = centers.map(function(c){ return c - first; });
    roadEl.style.top = (first - 30) + 'px';
    roadEl.style.height = (wayH + 60) + 'px';
    if (canAnim) {
      A.remove(carEl);
      wayTl = A.timeline({ autoplay: false, easing: 'linear' });
      wayTl.add({ targets: carEl, translateY: [0, wayH], duration: 1000 });
    } else {
      root.classList.add('no-road');
      stops.forEach(function(s){ s.classList.add('on'); });
      carEl.style.display = 'none';
    }
  }

  function updateWay(vh){
    if (!canAnim || !wayTl) return;
    var r = roadEl.getBoundingClientRect();
    var p = (vh * 0.6 - (r.top + 30)) / wayH;
    p = Math.max(0, Math.min(1, p));
    wayTl.seek(p * 1000);
    var carY = p * wayH;
    stops.forEach(function(s, i){
      var on = carY >= stopY[i] - 1 && p > 0;
      if (on !== stopState[i]) {
        stopState[i] = on;
        s.classList.toggle('on', on);
        if (on) A({ targets: s.querySelector('.stop-dot'), scale: [1.9, 1], duration: 520, easing: 'easeOutBack' });
      }
    });
  }

  var ticking = false;
  function onScroll(){ if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  function update(){
    ticking = false;
    var y = window.pageYOffset || 0, vh = window.innerHeight;
    var dh = Math.max(1, document.documentElement.scrollHeight - vh);
    var gp = Math.max(0, Math.min(1, y / dh));
    progLine.style.clipPath = 'inset(0 ' + (100 - gp * 100) + '% 0 0)';
    progCar.style.left = (gp * 100) + '%';
    if (hint) hint.classList.toggle('gone', y > 60);
    if (canAnim && heroTl && hero) {
      var hh = hero.offsetHeight || 1;
      heroTl.seek(Math.max(0, Math.min(1, y / hh)) * 1000);
    }
    updateWay(vh);
  }

  /* ===== Carimbos e contadores ao entrar na tela ===== */
  function stamp(el){
    var rot = parseFloat(el.getAttribute('data-rot') || '0');
    if (!canAnim) { el.style.opacity = 1; return; }
    A({ targets: el, opacity: [0, 1], scale: [1.9, 1], rotate: [(rot - 16) + 'deg', rot + 'deg'], duration: 620, easing: 'easeOutBack' });
  }
  function count(el){
    var to = parseFloat(el.getAttribute('data-count')), dec = parseInt(el.getAttribute('data-dec') || '0', 10);
    if (!canAnim) return;
    var o = { v: 0 };
    A({
      targets: o, v: to, duration: 1600, easing: 'easeOutExpo',
      update: function(){ el.textContent = o.v.toFixed(dec).replace('.', ','); },
      complete: function(){ el.textContent = to.toFixed(dec).replace('.', ','); }
    });
  }
  function reveal(el){
    if (el.hasAttribute('data-stamp')) stamp(el);
    if (el.hasAttribute('data-count')) count(el);
    if (el.classList.contains('tread')) drawTread(el);
  }
  function setupReveal(){
    var els = [].slice.call(document.querySelectorAll('[data-stamp],[data-count],.tread'));
    if (canAnim) {
      els.forEach(function(el){
        if (el.hasAttribute('data-count')) el.textContent = '0';
      });
    }
    if (!('IntersectionObserver' in window)) {
      els.forEach(function(el){
        el.style.opacity = 1;
        if (el.hasAttribute('data-count')) {
          var dec = parseInt(el.getAttribute('data-dec') || '0', 10);
          el.textContent = parseFloat(el.getAttribute('data-count')).toFixed(dec).replace('.', ',');
        }
        if (el.classList.contains('tread')) drawTread(el);
      });
      return;
    }
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        reveal(e.target);
      });
    }, { threshold: 0.4 });
    els.forEach(function(el){ io.observe(el); });
  }

  /* ===== Abertura do hero (um único momento orquestrado) ===== */
  function heroIntro(){
    var tl = A.timeline({ easing: 'easeOutExpo' });
    tl.add({ targets: '.hero-mark-in', opacity: [0, 0.1], duration: 1400, easing: 'easeOutQuad' }, 0)
      .add({ targets: '.hero-line > span', translateY: ['110%', '0%'], duration: 1000, delay: A.stagger(130) }, 100)
      .add({ targets: '.hero-sub, .hero-cta > *', opacity: [0, 1], translateY: [18, 0], duration: 800, delay: A.stagger(100) }, 700)
      .add({ targets: '.hero-block', opacity: [0, 1], translateX: ['-14%', '0%'], duration: 900 }, 500)
      .add({ targets: '.hero-photo-clip', clipPath: ['inset(0 100% 0 0)', 'inset(0 0% 0 0)'], duration: 1000, easing: 'easeInOutCubic' }, 650)
      .add({ targets: '.sticker', opacity: [0, 1], scale: [2.3, 1], rotate: ['-34deg', '-10deg'], duration: 640, easing: 'easeOutBack' }, 1500)
      .add({ targets: '.scroll-hint', opacity: [0, 1], duration: 700, easing: 'easeOutQuad' }, 1500);
    // pista de rolagem: rodinha do mouse
    A({ targets: '.mouse-wheel', translateY: [0, 14], opacity: [1, 0], duration: 1400, easing: 'easeInOutQuad', loop: true });
    // parallax do hero ligado à rolagem
    heroTl = A.timeline({ autoplay: false, easing: 'linear' });
    heroTl.add({ targets: '.hero-mark', translateY: [0, -130], rotate: [0, -5], duration: 1000 }, 0)
          .add({ targets: '.hero-photo', translateY: [0, -34], duration: 1000 }, 0);
    // botão flutuante pulsando
    A({ targets: '.fab-ring', scale: [1, 1.75], opacity: [0.55, 0], duration: 1800, easing: 'easeOutQuad', loop: true, delay: 2200 });
  }

  /* ===== Parallax leve com o mouse (só em telas com ponteiro) ===== */
  function pointerParallax(){
    if (!canAnim || !hero || !window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    hero.addEventListener('mousemove', function(e){
      var r = hero.getBoundingClientRect();
      var nx = (e.clientX - r.left) / r.width - 0.5, ny = (e.clientY - r.top) / r.height - 0.5;
      hero.style.setProperty('--px', (nx * 40).toFixed(1) + 'px');
      hero.style.setProperty('--py', (ny * 26).toFixed(1) + 'px');
    });
  }

  /* ===== Início ===== */
  function init(){
    try {
      showCase('comprei', false);
      buildTreads();
      layoutWay();
      setupReveal();
      if (canAnim) { heroIntro(); pointerParallax(); }
      update();
    } catch (err) {
      root.classList.remove('anim');
      if (window.console) console.error(err);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function(){ layoutWay(); onScroll(); });
  window.addEventListener('load', function(){ layoutWay(); onScroll(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function(){ layoutWay(); onScroll(); });
  init();
})();
