/* Menú desplegable móvil con código QR (tarjeta de presentación).
   Toma los enlaces del <nav> del encabezado, así que no se duplican.
   Requiere qrcode.min.js (cargado antes) y las reglas .menu-* de milton-v3.css. */
(function () {
  var QR_URL = 'https://miltondavila.com/';
  var nav = document.querySelector('.top nav');
  var bar = document.querySelector('.top .sh');
  if (!nav || !bar) return;

  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'menu-btn';
  btn.setAttribute('aria-label', 'Abrir menú');
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', 'menu-panel');
  btn.innerHTML = '<span></span><span></span><span></span>';

  var panel = document.createElement('div');
  panel.id = 'menu-panel';
  panel.className = 'menu-panel';
  panel.hidden = true;

  var links = document.createElement('div');
  links.className = 'menu-links';
  Array.prototype.forEach.call(nav.querySelectorAll('a:not(.btn)'), function (a) {
    var c = a.cloneNode(true);
    c.removeAttribute('class');
    links.appendChild(c);
  });
  panel.appendChild(links);

  var card = document.createElement('div');
  card.className = 'menu-card';
  var code = document.createElement('div');
  code.className = 'menu-qr';
  code.setAttribute('role', 'img');
  code.setAttribute('aria-label', 'Código QR que abre miltondavila.com');
  if (window.qrcode) {
    var q = window.qrcode(0, 'M');
    q.addData(QR_URL);
    q.make();
    code.innerHTML = q.createSvgTag({ cellSize: 4, margin: 0, scalable: true });
  }
  var cap = document.createElement('p');
  cap.innerHTML = '<b>Mi tarjeta de presentación</b><span>Escanéalo para abrir miltondavila.com</span>';
  card.appendChild(code);
  card.appendChild(cap);
  panel.appendChild(card);

  bar.appendChild(btn);
  bar.parentNode.appendChild(panel);

  function set(open) {
    panel.hidden = !open;
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    document.documentElement.classList.toggle('menu-open', open);
  }

  btn.addEventListener('click', function () { set(panel.hidden); });
  panel.addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) { set(false); btn.focus(); } });
  document.addEventListener('click', function (e) {
    if (!panel.hidden && !panel.contains(e.target) && !btn.contains(e.target)) set(false);
  });
  window.addEventListener('resize', function () { if (window.innerWidth > 900) set(false); });
})();

/* Celular: texto corto en la barra «¿Qué necesitas resolver?» para que no se corte */
(function () {
  var campo = document.querySelector('.askband form.ask input[name="q"]');
  if (!campo) return;
  var largo = campo.getAttribute('placeholder');
  function ajustar() {
    campo.setAttribute('placeholder', window.innerWidth <= 520 ? '¿Qué está pasando en tu negocio?' : largo);
  }
  ajustar();
  window.addEventListener('resize', ajustar);
})();
