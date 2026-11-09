(function () {
  'use strict';
  var NUM = '5592986406309';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  function wa(msg) { return 'https://wa.me/' + NUM + '?text=' + encodeURIComponent(msg); }

  /* GALERIA: para adicionar fotos reais, envie os arquivos para a raiz do repositório
     e liste os nomes aqui. Exemplo: { src: 'foto1.jpg', alt: 'Corte degradê' } */
  var FOTOS = [];

  /* Links do WhatsApp com mensagem */
  $$('.card[data-servico]').forEach(function (c) {
    $('[data-wa]', c).href = wa('Olá! Gostaria de saber mais sobre o serviço de ' + c.dataset.servico + ' da Barbearia Duarte.');
  });
  $$('[data-msg]').forEach(function (a) { a.href = wa(a.dataset.msg); });

  /* Menu mobile */
  var burger = $('#burger'), menu = $('#menu');
  function menuEstado(abrir) {
    menu.classList.toggle('aberto', abrir);
    burger.setAttribute('aria-expanded', abrir ? 'true' : 'false');
    burger.setAttribute('aria-label', abrir ? 'Fechar menu' : 'Abrir menu');
  }
  burger.addEventListener('click', function () { menuEstado(!menu.classList.contains('aberto')); });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) menuEstado(false); });
  document.addEventListener('click', function (e) {
    if (menu.classList.contains('aberto') && !e.target.closest('#topo')) menuEstado(false);
  });

  /* Cabeçalho ao rolar e botão de topo */
  var topo = $('#topo'), subir = $('#subir');
  function aoRolar() {
    var y = window.pageYOffset;
    topo.classList.toggle('rolou', y > 20);
    subir.hidden = y < 700;
  }
  window.addEventListener('scroll', aoRolar, { passive: true });
  aoRolar();
  subir.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  /* Animação de entrada */
  var itens = $$('.rev');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('vis'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    itens.forEach(function (el, i) { el.style.transitionDelay = (i % 4) * 70 + 'ms'; io.observe(el); });
  } else { itens.forEach(function (el) { el.classList.add('vis'); }); }

  /* Horário de Manaus (UTC-4), independente do fuso do visitante */
  try {
    var dias = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }, p = {};
    new Intl.DateTimeFormat('en-US', { timeZone: 'America/Manaus', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false })
      .formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
    var dia = dias[p.weekday], min = (parseInt(p.hour, 10) % 24) * 60 + parseInt(p.minute, 10);
    var fecha = dia === 0 ? 19 : 20, aberto = min >= 540 && min < fecha * 60;
    $$('.horas div').forEach(function (el) {
      if (el.dataset.dias.split(',').indexOf(String(dia)) > -1) el.classList.add('hoje');
    });
    var ag = $('[data-agora]');
    ag.textContent = aberto ? 'Aberto agora, fecha às ' + fecha + 'h (horário de Manaus).' : 'Fechado agora (horário de Manaus). Abre às 9h.';
    ag.classList.toggle('on', aberto);
  } catch (e) {}

  /* Galeria e ampliação */
  if (FOTOS.length) {
    var grade = $('#grade'), idx = 0;
    $('#vazio').hidden = true;
    grade.hidden = false;
    FOTOS.forEach(function (f, i) {
      var li = document.createElement('li'), b = document.createElement('button'), im = document.createElement('img');
      b.type = 'button'; b.setAttribute('aria-label', 'Ampliar foto ' + (i + 1));
      im.src = f.src; im.alt = f.alt || 'Foto da Barbearia Duarte'; im.loading = 'lazy';
      b.appendChild(im); li.appendChild(b); grade.appendChild(li);
      b.addEventListener('click', function () { abrir(i); });
    });
    var lb = $('#lb'), lbImg = $('#lb-img'), foco = null;
    var mostrar = function () { lbImg.src = FOTOS[idx].src; lbImg.alt = FOTOS[idx].alt || ''; };
    var abrir = function (i) { foco = document.activeElement; idx = i; mostrar(); lb.hidden = false; document.body.classList.add('trava'); $('#lb-x').focus(); };
    var fechar = function () { lb.hidden = true; document.body.classList.remove('trava'); if (foco) foco.focus(); };
    var ir = function (d) { idx = (idx + d + FOTOS.length) % FOTOS.length; mostrar(); };
    $('#lb-x').addEventListener('click', fechar);
    $('#lb-p').addEventListener('click', function () { ir(-1); });
    $('#lb-pr').addEventListener('click', function () { ir(1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) fechar(); });
    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') fechar();
      if (e.key === 'ArrowLeft') ir(-1);
      if (e.key === 'ArrowRight') ir(1);
    });
    var x0 = null;
    lb.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 50) ir(dx < 0 ? 1 : -1);
    });
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') menuEstado(false); });
})();
