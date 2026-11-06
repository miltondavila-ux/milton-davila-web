/* Contact kit: ventana de contacto con QR (escritorio) o botones directos (móvil).
   Requiere: qrcode.min.js (cargado antes) y contact-widget.css.
   Edita SOLO el objeto CONFIG. */
(function () {
  var CONFIG = {
    callPhone: '13052062675',
    callLabel: '+1 (305) 206-2675',
    textPhone: '13052062675',
    textLabel: '+1 (305) 206-2675',
    email: 'info@miltondavila.net',          // dirección real: aquí llegan los correos
    emailLabel: 'info@miltondavila.com',     // lo que se muestra al visitante
    defaultMessage: 'Hola Milton, quiero conversar sobre un problema de mi negocio',
    emailSubject: 'Consulta para Milton Dávila',
    thankYouUrl: '',                 // p. ej. '/thank-you/'; vacío = no redirigir
    thankYouDelayMs: 1200,
    mobileMaxWidth: 900,
    title: 'HABLEMOS DE LO QUE NECESITAS',
    readyTitle: 'ENCONTREMOS EL SIGUIENTE PASO',
    qrIntro: 'Elige una opción para continuar desde tu celular.',
    qrIntroReady: 'Tu mensaje está preparado. Elige cómo quieres enviarlo.',
    mobileIntro: 'Elige cómo quieres hablar con Milton.',
    mobileIntroReady: 'Elige cómo quieres enviar tu mensaje.',
    contactPageUrl: '',
    askSelector: 'form.ask',
    formSelector: '#never-contact-form',
    names: { call: 'LLAMAR', sms: 'SMS', wa: 'WHATSAPP', mail: 'EMAIL' }
  };

  var C = CONFIG;
  var tr = function (s) { return window.MDI18n ? window.MDI18n.t(s) : s; };   // traductor ES/EN (assets/i18n.js)
  var scan = function (el) { if (window.MDI18n) window.MDI18n.scan(el); };
  var mkLinks = function (msg) { return {
    call: 'tel:+' + C.callPhone,
    sms: 'sms:+' + C.textPhone + '?&body=' + encodeURIComponent(msg),
    wa: 'https://wa.me/' + C.textPhone + '?text=' + encodeURIComponent(msg),
    mail: 'mailto:' + C.email + '?subject=' + encodeURIComponent(tr(C.emailSubject)) + '&body=' + encodeURIComponent(msg)
  }; };
  var links = mkLinks(C.defaultMessage), custom = null;
  var icons = {
    call: '<svg viewBox="0 0 24 24"><path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z"/></svg>',
    sms: '<svg viewBox="0 0 24 24"><path d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-5 4v-4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/></svg>',
    wa: '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm5 14c-.2.6-1.2 1.2-1.7 1.2-.5.1-1 .2-3.3-.7-2.8-1.2-4.5-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8s.7-2 .9-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .6l-.4.6-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.7-.1l1.9.9c.3.1.5.2.5.3.1.2.1.8-.1 1.4z"/></svg>',
    mail: '<svg viewBox="0 0 24 24"><path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm9 7L4.5 7v1.6L12 13.6l7.5-5V7z"/></svg>',
    map: '<svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>'
  };
  var names = C.names;
  var sub = { call: C.callLabel, sms: C.textLabel, wa: C.textLabel, mail: C.emailLabel || C.email };

  var box = document.createElement('div');
  box.className = 'cw'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true');
  document.body.appendChild(box);

  var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\n/g, '<br>'); };

  /* 7. Decide: ¿móvil (botones directos) o escritorio (QR)? */
  /* El navegador integrado de escritorio puede reportar pointer coarse/hover none.
     No usamos esas señales porque provocaban WhatsApp directo en computadoras.
     Móvil = agente móvil real o viewport pequeño; desktop = QR y selector de canales. */
  var isMobile = function () {
    return window.innerWidth <= 600 || /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  };

  function qr(text) {
    if (!window.qrcode) return '';
    var q = qrcode(0, 'M'); q.addData(text); q.make();
    return q.createSvgTag({ cellSize: 4, margin: 0, scalable: true });
  }

  function qrCard(key, link, label) {
    return '<div class="cw-q"><div class="code">' + qr(link) + '</div><b>' + icons[key] + tr(names[key]) + '</b><small>' + label + '</small></div>';
  }

  /* 3. HTML de la ventana principal («YOUR MESSAGE IS READY» / «CONTACT US») */
  function render() {
    var keys = ['call', 'sms', 'wa', 'mail'];
    var L = custom ? mkLinks(custom) : links, h;
    var head = custom
      ? '<h3>' + C.readyTitle + '</h3><div class="cw-msg" data-no-i18n>' + esc(custom) + '</div><p>'
      : '<h3>' + C.title + '</h3><p>';
    if (isMobile()) {
      h = head + (custom ? C.mobileIntroReady : C.mobileIntro) + '</p><div class="cw-list">' + keys.map(function (k) {
        return '<a class="cw-opt" href="' + L[k] + '"' + (k === 'wa' ? ' target="_blank" rel="noopener"' : '') + '>' + icons[k] + '<span>' + tr(names[k]) + '<small>' + sub[k] + '</small></span></a>';
      }).join('') + '</div>';
    } else {
      h = head + (custom ? C.qrIntroReady : C.qrIntro) + '</p><div class="cw-qr' + (custom ? ' three' : '') + '">' + keys.map(function (k) {
        return qrCard(k, L[k], sub[k]);
      }).join('') + '</div>';
      if (custom) h += '<p class="cw-hint">Or <a href="' + L.wa + '" target="_blank" rel="noopener">open WhatsApp Web</a>.</p>';
      else if (C.contactPageUrl) h += '<p class="cw-hint">Or <a href="' + C.contactPageUrl + '">send us a message here</a>.</p>';
    }
    box.innerHTML = '<div class="cw-box"><button class="cw-x" aria-label="Close">&times;</button>' + h + '</div>';
    scan(box);
  }

  var thanks = false;
  function open(e, msg, goThanks) {
    if (e && e.preventDefault) e.preventDefault();
    custom = msg || null; thanks = !!goThanks; links = mkLinks(tr(C.defaultMessage)); render(); box.classList.add('on');
  }
  function close() { box.classList.remove('on'); }
  function showSingle(title, intro, key, link, label) {
    box.innerHTML = '<div class="cw-box"><button class="cw-x" aria-label="Close">&times;</button><h3>' + title + '</h3><p>' + intro + '</p><div class="cw-qr one">' + qrCard(key, link, label) + '</div></div>';
    scan(box);
    custom = null; thanks = false; box.classList.add('on');
  }

  box.addEventListener('click', function (e) { if (e.target === box || e.target.className === 'cw-x') close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  box.addEventListener('click', function (ev) {
    if (C.thankYouUrl && thanks && ev.target.closest && ev.target.closest('.cw-opt, .cw-hint a'))
      setTimeout(function () { location.href = C.thankYouUrl; }, C.thankYouDelayMs);
  });

  /* 6. Detección automática de enlaces tel: / sms: / mailto: / WhatsApp / Google Maps.
        Solo actúa en escritorio; en móvil el enlace funciona normal. */
  document.addEventListener('click', function (e) {
    if (isMobile()) return;
    var a = e.target.closest && e.target.closest('a[href^="tel:"],a[href^="mailto:"],a[href^="sms:"],a[href*="wa.me/"],a[href*="google.com/maps"],a[href*="maps.google"],a[href*="maps.app.goo.gl"]');
    if (!a || a.closest('.cw') || a.hasAttribute('data-no-qr')) return;
    e.preventDefault();
    var h = a.getAttribute('href'), label = a.textContent.trim();
    if (/^tel:/.test(h)) showSingle('CALL', 'Scan this code with your phone to call.', 'call', h, label);
    else if (/^mailto:/.test(h)) showSingle('EMAIL', 'Scan this code to write to us from your phone.', 'mail', h, label);
    else if (/maps/.test(h)) showSingle('OPEN IN MAPS', 'Scan this code to open the location on your phone.', 'map', a.href, label);
    else open();   // sms: y wa.me → ventana completa con todas las opciones
  });

  /* Enlaces o botones que quieran abrir la ventana a propósito */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[data-contact],a[data-mdv2-contact]');
    if (a) open(e, a.getAttribute('data-message') || null);
  });

  /* Formulario de contacto: compone el mensaje y abre la ventana */
  document.addEventListener('submit', function (e) {
    var f = e.target.closest && e.target.closest(C.formSelector);
    if (!f) return;
    e.preventDefault();
    var v = function (n) { return f.elements[n].value.trim(); }, err = document.getElementById('ferr');
    if (!v('first') || !v('last') || !v('phone') || !/^\S+@\S+\.\S+$/.test(v('email'))) {
      if (err) err.textContent = 'Please complete all fields with a valid phone and email.';
      return;
    }
    if (err) err.textContent = '';
    open(null, 'Hello, my name is ' + v('first') + ' ' + v('last') + '. Please contact me.\nPhone: ' + v('phone') + '\nEmail: ' + v('email'), true);
  });

  /* Barra «¿qué buscas?»: el texto escrito es el mensaje */
  document.addEventListener('submit', function (e) {
    var f = e.target.closest && e.target.closest(C.askSelector);
    if (!f) return;
    e.preventDefault();
    open(null, f.querySelector('input,textarea').value.trim() || tr(C.defaultMessage));
  });

  window.addEventListener('resize', function () { if (box.classList.contains('on') && !box.querySelector('.cw-qr.one')) render(); });
  window.ContactKit = { open: open, close: close };
})();

