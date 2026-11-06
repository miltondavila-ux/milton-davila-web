/* Traductor ES → EN en la misma página (sin páginas duplicadas, sin servicios externos, sin costo).
   El HTML siempre sale en español; al elegir inglés se reemplazan los textos en su lugar usando
   assets/i18n/en.json (clave = frase en español, valor = frase en inglés).
   - "Unidad" = texto de un elemento (con etiquetas en línea como <a>, <b>) o un nodo de texto suelto.
   - Las etiquetas en línea se escriben en el diccionario como <a1>…</a1> (número = orden de aparición)
     y se restauran con sus atributos originales (href, target…).
   - Atributos traducidos: alt, title, aria-label, placeholder. También <title> y meta description.
   - La elección se guarda en localStorage ('md-lang').
   - Ventanas creadas por JavaScript: llaman MDI18n.scan(elemento) justo después de crearse. */
(function (root, factory) {
  var api = factory(root);
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.MDI18n = api;
})(typeof window !== 'undefined' ? window : this, function (win) {
  var INLINE = { a: 1, b: 1, strong: 1, em: 1, i: 1, span: 1, small: 1, br: 1, abbr: 1, u: 1, sup: 1, sub: 1, mark: 1, svg: 1, wbr: 1, time: 1 };
  var SKIP = { script: 1, style: 1, noscript: 1, iframe: 1, svg: 1, code: 1, pre: 1, textarea: 1, select: 1, option: 1, head: 1 };
  var ATTRS = ['alt', 'title', 'aria-label', 'placeholder'];
  var dict = null, current = 'es', store = [], attrStore = [], metaStore = null;

  function norm(s) { return s.replace(/\s+/g, ' ').trim(); }
  /* forAttrs: los atributos de un <textarea> o <select> (p. ej. placeholder) sí se traducen; su contenido no */
  function isSkipped(el, forAttrs) {
    for (var n = el; n && n.nodeType === 1; n = n.parentNode) {
      var own = forAttrs && n === el && (n.localName === 'textarea' || n.localName === 'select');
      if ((SKIP[n.localName] && n.localName !== 'svg' && !own) || n.hasAttribute('data-no-i18n')) return true;
    }
    return false;
  }
  function hasText(el) {
    for (var c = el.firstChild; c; c = c.nextSibling) if (c.nodeType === 3 && c.nodeValue.trim()) return true;
    return false;
  }
  function inlineOnly(el) {
    for (var c = el.firstElementChild; c; c = c.nextElementSibling) {
      if (!INLINE[c.localName]) return false;
      if (c.localName !== 'svg' && !inlineOnly(c)) return false;
    }
    return true;
  }
  /* Clave de una unidad: texto con etiquetas en línea numeradas. Devuelve {key, els} (els[n] = elemento original n). */
  function keyOf(el) {
    var els = [null], out = '';
    (function walk(node) {
      for (var c = node.firstChild; c; c = c.nextSibling) {
        if (c.nodeType === 3) out += c.nodeValue;
        else if (c.nodeType === 1) {
          var t = c.localName, n = els.push(c) - 1;
          if (t === 'svg' || t === 'br' || t === 'wbr') out += '<' + t + n + '/>';
          else { out += '<' + t + n + '>'; walk(c); out += '</' + t + n + '>'; }
        }
      }
    })(el);
    return { key: norm(out), els: els };
  }
  /* Recorre un elemento (por defecto, el body) y devuelve las unidades: {el|node, key, els, kind} */
  function collect(doc, start) {
    var units = [];
    (function walk(el) {
      if (isSkipped(el)) return;
      if (hasText(el) && inlineOnly(el)) {
        var k = keyOf(el);
        if (k.key.replace(/<[^>]+>/g, '').trim()) units.push({ kind: 'el', el: el, key: k.key, els: k.els });
        return;
      }
      for (var c = el.firstChild; c; c = c.nextSibling) {
        if (c.nodeType === 1) walk(c);
        else if (c.nodeType === 3 && c.nodeValue.trim()) units.push({ kind: 'text', node: c, key: norm(c.nodeValue) });
      }
    })(start || doc.body);
    return units;
  }
  function collectAttrs(doc, start) {
    var list = [], base = start || doc.body;
    var all = [base].concat(Array.prototype.slice.call(base.querySelectorAll('*')));
    for (var i = 0; i < all.length; i++) {
      var el = all[i];
      if (isSkipped(el, true)) continue;
      for (var a = 0; a < ATTRS.length; a++) {
        var v = el.getAttribute(ATTRS[a]);
        if (v && v.trim()) list.push({ el: el, attr: ATTRS[a], key: norm(v) });
      }
    }
    return list;
  }
  function collectMeta(doc) {
    var m = [{ kind: 'title', key: norm(doc.title || '') }];
    var d = doc.querySelector('meta[name="description"]');
    if (d) m.push({ kind: 'desc', el: d, key: norm(d.getAttribute('content') || '') });
    return m;
  }

  /* Construye los nodos traducidos a partir de "texto <a1>más</a1>" y los elementos originales */
  function build(tr, els) {
    var frag = document.createDocumentFragment(), stack = [frag], re = /<(\/?)([a-z]+)(\d+)(\/?)>/g, last = 0, m;
    while ((m = re.exec(tr))) {
      if (m.index > last) stack[stack.length - 1].appendChild(document.createTextNode(tr.slice(last, m.index)));
      last = re.lastIndex;
      var closing = m[1] === '/', selfc = m[4] === '/', orig = els[+m[3]];
      if (closing) { if (stack.length > 1) stack.pop(); continue; }
      if (!orig || orig.localName !== m[2]) return null;
      var copy = orig.cloneNode(selfc || m[2] === 'svg');
      if (!selfc && m[2] !== 'svg') { while (copy.firstChild) copy.removeChild(copy.firstChild); }
      stack[stack.length - 1].appendChild(copy);
      if (!selfc && m[2] !== 'svg') stack.push(copy);
    }
    if (last < tr.length) stack[stack.length - 1].appendChild(document.createTextNode(tr.slice(last)));
    return stack.length === 1 ? frag : null;
  }

  /* Traduce el contenido de `start` (por defecto, todo el body) usando el diccionario */
  function translateTree(start) {
    collect(document, start).forEach(function (u) {
      var tr = dict[u.key];
      if (!tr || tr === u.key) return;
      if (u.kind === 'text') {
        store.push({ node: u.node, orig: u.node.nodeValue });
        var lead = u.node.nodeValue.match(/^\s*/)[0], trail = u.node.nodeValue.match(/\s*$/)[0];
        u.node.nodeValue = lead + tr + trail;
      } else {
        var frag = build(tr, u.els);
        if (!frag) { if (win.console) console.warn('i18n: etiquetas no coinciden en', u.key); return; }
        store.push({ el: u.el, kids: Array.prototype.slice.call(u.el.childNodes) });
        while (u.el.firstChild) u.el.removeChild(u.el.firstChild);
        u.el.appendChild(frag);
      }
    });
    collectAttrs(document, start).forEach(function (x) {
      var tr = dict[x.key];
      if (tr && tr !== x.key) { attrStore.push({ el: x.el, attr: x.attr, orig: x.el.getAttribute(x.attr) }); x.el.setAttribute(x.attr, tr); }
    });
  }
  function applyEn() {
    store = []; attrStore = [];
    translateTree();
    metaStore = { title: document.title, desc: null };
    var t = dict[norm(document.title)];
    if (t) document.title = t;
    var d = document.querySelector('meta[name="description"]');
    if (d) { metaStore.desc = d.getAttribute('content'); var dd = dict[norm(metaStore.desc || '')]; if (dd) d.setAttribute('content', dd); }
  }
  function revert() {
    store.slice().reverse().forEach(function (s) {
      if (s.node) s.node.nodeValue = s.orig;
      else { while (s.el.firstChild) s.el.removeChild(s.el.firstChild); s.kids.forEach(function (k) { s.el.appendChild(k); }); }
    });
    attrStore.forEach(function (a) { a.el.setAttribute(a.attr, a.orig); });
    if (metaStore) {
      document.title = metaStore.title;
      var d = document.querySelector('meta[name="description"]');
      if (d && metaStore.desc != null) d.setAttribute('content', metaStore.desc);
    }
    store = []; attrStore = []; metaStore = null;
  }

  function paintButton() {
    var b = document.getElementById('langToggle');
    if (!b) return;
    var en = current === 'en';
    b.setAttribute('aria-pressed', en ? 'true' : 'false');
    b.setAttribute('aria-label', en ? 'Cambiar a español' : 'Switch to English');
    b.setAttribute('title', en ? 'Español' : 'English');
    b.querySelector('.lt').textContent = en ? 'ES' : 'EN';
    b.querySelector('.flag-es').style.display = en ? 'block' : 'none';
    b.querySelector('.flag-us').style.display = en ? 'none' : 'block';
  }
  function load(cb) {
    if (dict) return cb();
    var x = new XMLHttpRequest();
    x.open('GET', 'assets/i18n/en.json', true);
    x.onload = function () { try { dict = JSON.parse(x.responseText); } catch (e) { dict = {}; } cb(); };
    x.onerror = function () { dict = {}; cb(); };
    x.send();
  }
  function done() { document.documentElement.classList.remove('i18n-pending'); paintButton(); }

  function set(lang, save) {
    if (lang === current && save !== 'force') { done(); return; }
    if (win.ContactKit && win.ContactKit.close) win.ContactKit.close();
    if (lang === 'en') {
      load(function () {
        if (current === 'en') revert();
        current = 'en'; applyEn();
        document.documentElement.lang = 'en';
        done();
      });
    } else {
      revert(); current = 'es'; document.documentElement.lang = 'es'; done();
    }
    if (save) { try { localStorage.setItem('md-lang', lang); } catch (e) {} }
  }

  /* Traduce una cadena suelta (mensajes hechos por JavaScript). */
  function t(s, args) {
    var out = (current === 'en' && dict && dict[s]) || s;
    if (args) out = out.replace(/\{(\d+)\}/g, function (_, i) { return args[+i]; });
    return out;
  }
  /* Traduce una ventana o fragmento creado por JavaScript (solo si el idioma actual es inglés) */
  function scan(el) {
    if (current !== 'en' || !dict || !el) return;
    translateTree(el);
  }

  function init() {
    var b = document.getElementById('langToggle');
    if (b) b.addEventListener('click', function () { set(current === 'en' ? 'es' : 'en', true); });
    var saved = null;
    try { saved = localStorage.getItem('md-lang'); } catch (e) {}
    if (saved === 'en') set('en', false); else done();
  }

  var api = { collect: collect, collectAttrs: collectAttrs, collectMeta: collectMeta, keyOf: keyOf, t: t, scan: scan, set: set, lang: function () { return current; } };
  if (typeof document !== 'undefined' && typeof window !== 'undefined' && win === window) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
    setTimeout(function () { document.documentElement.classList.remove('i18n-pending'); }, 2500);
  }
  return api;
});
