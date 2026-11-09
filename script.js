(function () {
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');
  burger.addEventListener('click', function () {
    var aberto = menu.classList.toggle('aberto');
    burger.setAttribute('aria-expanded', aberto ? 'true' : 'false');
  });
  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) {
      menu.classList.remove('aberto');
      burger.setAttribute('aria-expanded', 'false');
    }
  });

  // Horário de Manaus (UTC-4), independente do fuso do visitante
  var dias = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  var p = {};
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: 'America/Manaus', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false })
      .formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
  } catch (e) { return; }
  var dia = dias[p.weekday];
  var min = (parseInt(p.hour, 10) % 24) * 60 + parseInt(p.minute, 10);
  var fecha = dia === 0 ? 19 : 20;
  var aberto = min >= 9 * 60 && min < fecha * 60;

  document.querySelectorAll('.horas div').forEach(function (el) {
    if (el.dataset.dias.split(',').indexOf(String(dia)) > -1) el.classList.add('hoje');
  });
  var agora = document.querySelector('[data-agora]');
  agora.textContent = aberto ? 'Aberto agora, fecha às ' + fecha + 'h.' : 'Fechado agora. Abre às 9h.';
  if (aberto) {
    agora.classList.add('on');
    var s = document.querySelector('[data-status]');
    s.classList.add('on');
    s.querySelector('span').textContent = 'Aberto agora, ordem de chegada';
  }
})();
