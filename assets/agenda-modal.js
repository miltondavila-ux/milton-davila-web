/* Abre el calendario de TidyCal en una ventana flotante.
   Uso: <a href="https://tidycal.com/usuario/sesion" data-agenda>…</a>
   El código oficial de TidyCal (embed.js) se carga SOLO al pulsar el botón.
   Sin JavaScript, o con Ctrl/Cmd+clic, el enlace se abre en una pestaña nueva. */
(function () {
  var EMBED_JS = 'https://asset-tidycal.b-cdn.net/js/embed.js';
  var box, body, lastFocus, scriptState = 0; // 0 sin cargar, 1 cargando, 2 listo
  var tr = function (s) { return window.MDI18n ? window.MDI18n.t(s) : s; };   // traductor ES/EN (assets/i18n.js)

  function build() {
    box = document.createElement('div');
    box.className = 'agenda-modal';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', 'Agendar sesión');
    box.hidden = true;
    box.innerHTML =
      '<div class="agenda-card">' +
      '<button type="button" class="agenda-close" aria-label="Cerrar">&times;</button>' +
      '<div class="agenda-body"><div class="agenda-load">Cargando calendario…</div></div>' +
      '<a class="agenda-out" target="_blank" rel="noopener noreferrer">Abrir en una pestaña nueva</a>' +
      '</div>';
    document.body.appendChild(box);
    if (window.MDI18n) window.MDI18n.scan(box);
    body = box.querySelector('.agenda-body');
    box.addEventListener('click', function (e) { if (e.target === box) close(); });
    box.querySelector('.agenda-close').addEventListener('click', close);
  }

  function quitarAviso() {
    var l = body && body.querySelector('.agenda-load.over');
    if (l) l.remove();
  }

  // TidyCal avisa su altura real cuando ya dibujó el calendario («[iFrameSizer]id:alto:ancho:tipo»)
  window.addEventListener('message', function (e) {
    if (e.origin !== 'https://tidycal.com' || typeof e.data !== 'string' || e.data.indexOf('[iFrameSizer]') !== 0) return;
    var alto = parseInt(e.data.split(':')[1], 10);
    if (alto > 600 && alto < 4000) quitarAviso();   // antes de dibujarse reporta una altura enorme y falsa
  });

  function mount(path) {
    var div = document.createElement('div');
    div.className = 'tidycal-embed';
    div.dataset.path = path;
    body.appendChild(div);
    function init() {
      if (!body.querySelector('iframe') && window.TidyCal) window.TidyCal.init(div);
      var l = body.querySelector('.agenda-load');
      var fr = body.querySelector('iframe');
      if (l && fr) {
        l.classList.add('over');          // el aviso se queda encima hasta que el calendario se dibuje
        setTimeout(quitarAviso, 20000);   // por si TidyCal tarda o no avisa
      }
    }
    if (window.TidyCal) { scriptState = 2; init(); return; }
    if (scriptState === 0) {
      scriptState = 1;
      var s = document.createElement('script');
      s.src = EMBED_JS;
      s.async = true;
      s.onload = function () { scriptState = 2; setTimeout(init, 0); };
      s.onerror = function () { scriptState = 0; body.innerHTML = '<div class="agenda-load">' + tr('No se pudo cargar el calendario. Usa el enlace de abajo.') + '</div>'; };
      document.head.appendChild(s);
    }
  }

  function open(url) {
    if (!box) build();
    lastFocus = document.activeElement;
    var u = new URL(url);
    body.innerHTML = '<div class="agenda-load">' + tr('Cargando calendario…') + '</div>';
    box.querySelector('.agenda-out').href = url;
    box.hidden = false;
    document.documentElement.classList.add('agenda-open');
    box.querySelector('.agenda-close').focus();
    mount(u.pathname.replace(/^\//, ''));
  }

  function close() {
    if (!box || box.hidden) return;
    box.hidden = true;
    body.innerHTML = '';
    document.documentElement.classList.remove('agenda-open');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[data-agenda]');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
    e.preventDefault();
    open(a.href);
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
})();
