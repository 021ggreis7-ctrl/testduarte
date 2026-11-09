(function () {
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');
  function fechar() {
    menu.classList.remove('aberto');
    burger.setAttribute('aria-expanded', 'false');
  }
  burger.addEventListener('click', function () {
    var aberto = menu.classList.toggle('aberto');
    burger.setAttribute('aria-expanded', aberto ? 'true' : 'false');
  });
  menu.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') fechar();
  });
  // destaca o horário de hoje
  var hoje = String(new Date().getDay());
  document.querySelectorAll('.horas div').forEach(function (el) {
    if (el.dataset.dias.split(',').indexOf(hoje) > -1) el.classList.add('hoje');
  });
})();
