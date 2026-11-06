/* Menú desplegable móvil con código QR (tarjeta de presentación).
   Toma los enlaces del <nav> del encabezado, así que no se duplican.
   Requiere qrcode.min.js (cargado antes) y las reglas .menu-* de milton-v3.css. */
(function () {
  var QR_URL = 'https://miltondavila.com/';
  var tr = function (s) { return window.MDI18n ? window.MDI18n.t(s) : s; };   // traductor ES/EN (assets/i18n.js)
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
    btn.setAttribute('aria-label', tr(open ? 'Cerrar menú' : 'Abrir menú'));
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

/* Barra «¿Qué necesitas resolver?»: se entiende como una pregunta.
   En celular: ejemplos que rotan en el texto de ayuda, ejemplos tocables, Enter envía y la caja crece al escribir. */
(function () {
  var campo = document.querySelector('.askband form.ask textarea[name="q"]');
  if (!campo) return;
  var form = campo.form;
  var largo = campo.getAttribute('placeholder');
  var tr = function (s) { return window.MDI18n ? window.MDI18n.t(s) : s; };   // traductor ES/EN (assets/i18n.js)
  var ejemplos = [
    'Ej.: Mis clientes no me encuentran en Google',
    'Ej.: Pierdo clientes por responder tarde',
    'Ej.: Mi equipo copia datos de un sistema a otro',
    'Ej.: Quiero usar IA, pero no sé cómo',
    'Ej.: Quiero construir algo propio para mi empresa'
  ];
  var i = 0, timer = null;
  var movil = function () { return window.innerWidth <= 900; };
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function crecer() {
    if (!movil()) { campo.style.height = ''; return; }
    campo.style.height = 'auto';
    campo.style.height = Math.min(Math.max(campo.scrollHeight, 112), 200) + 'px';
  }
  function poner() {
    campo.setAttribute('placeholder', tr(movil() ? ejemplos[i % ejemplos.length] : largo));
  }
  function rotar() {
    clearInterval(timer);
    if (!movil() || reduce) return;
    timer = setInterval(function () {
      if (document.activeElement === campo || campo.value) return;
      i++; poner();
    }, 3500);
  }
  function ajustar() { poner(); crecer(); rotar(); }

  campo.addEventListener('input', crecer);
  campo.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
      e.preventDefault();
      if (form.requestSubmit) form.requestSubmit(); else form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    }
  });
  Array.prototype.forEach.call(document.querySelectorAll('.askband .ask-ej button[data-q]'), function (b) {
    b.addEventListener('click', function () {
      campo.value = b.getAttribute('data-q');
      crecer();
      campo.focus();
    });
  });
  window.addEventListener('resize', ajustar);
  ajustar();
})();

/* Escritorio: botón de código QR junto a «Hablemos» → ventana «¡Pásalo a móvil!» con el QR de la página que estás viendo */
(function () {
  var nav = document.querySelector('.top nav');
  if (!nav) return;
  var tr = function (s) { return window.MDI18n ? window.MDI18n.t(s) : s; };   // traductor ES/EN (assets/i18n.js)
  var scan = function (el) { if (window.MDI18n) window.MDI18n.scan(el); };
  var QR_ICON = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="3.5" width="6.5" height="6.5" rx="1.2"/><rect x="14" y="3.5" width="6.5" height="6.5" rx="1.2"/><rect x="3.5" y="14" width="6.5" height="6.5" rx="1.2"/><path d="M14 14h2.5v2.5H14zM18 14h2.5M14 19v1.5M17.5 17.5H20.5V20.5M17.5 20.5v0"/></svg>';
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'qr-btn';
  btn.setAttribute('aria-label', 'Pásalo a tu móvil con un código QR');
  btn.setAttribute('aria-haspopup', 'dialog');
  btn.title = 'Pásalo a móvil';
  btn.innerHTML = QR_ICON;
  nav.appendChild(btn);

  var box = null, last = null;

  function paginaActual() {
    var c = document.querySelector('link[rel="canonical"]');
    return (c && c.href) || (location.origin + location.pathname);
  }

  function construir() {
    box = document.createElement('div');
    box.className = 'qr-modal';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-labelledby', 'qr-titulo');
    box.hidden = true;
    var url = paginaActual();
    var svg = '';
    if (window.qrcode) {
      var q = window.qrcode(0, 'M');
      q.addData(url);
      q.make();
      svg = q.createSvgTag({ cellSize: 6, margin: 0, scalable: true });
    }
    box.innerHTML =
      '<div class="qr-card">' +
      '<button type="button" class="qr-x" aria-label="Cerrar">&times;</button>' +
      '<h3 id="qr-titulo">¡Pásalo a móvil!</h3>' +
      '<div class="qr-code" role="img" aria-label="Código QR que abre esta página en tu celular">' + svg + '</div>' +
      '<p>Abre la cámara de tu celular y apunta al código. Se abre esta misma página.</p>' +
      '</div>';
    document.body.appendChild(box);
    scan(box);
    box.addEventListener('click', function (e) { if (e.target === box) cerrar(); });
    box.querySelector('.qr-x').addEventListener('click', cerrar);
  }

  function abrir() {
    if (!box) construir();
    last = document.activeElement;
    box.hidden = false;
    document.documentElement.classList.add('qr-open');
    box.querySelector('.qr-x').focus();
  }
  function cerrar() {
    if (!box || box.hidden) return;
    box.hidden = true;
    document.documentElement.classList.remove('qr-open');
    if (last && last.focus) last.focus();
  }

  btn.addEventListener('click', abrir);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') cerrar(); });
})();

