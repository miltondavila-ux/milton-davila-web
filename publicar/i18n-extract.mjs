// Extrae todos los textos traducibles de las páginas y los compara con assets/i18n/en.json
// (clave = frase en español, valor = frase en inglés).
// Uso, desde la raíz del proyecto:
//   node publicar/i18n-extract.mjs          → muestra faltantes y errores de etiquetas
//   node publicar/i18n-extract.mjs --write  → escribe publicar/i18n-missing.json con las frases por traducir
// Requiere `linkedom` SOLO para desarrollo (no se sube al sitio): npm i linkedom en cualquier carpeta
// y, si no está en ./node_modules, indicar esa carpeta con la variable I18N_DEPS.
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

const req = createRequire(path.resolve(process.env.I18N_DEPS || '.') + '/');
const { parseHTML } = req('linkedom');

const core = { exports: {} };
new Function('module', fs.readFileSync('assets/i18n.js', 'utf8'))(core);
const I = core.exports;

const PAGES = ['milton-v3.html', 'about-v3.html'];
const keys = new Map();
const add = (k, f) => { if (!k) return; if (!keys.has(k)) keys.set(k, new Set()); keys.get(k).add(f); };
for (const f of PAGES) {
  const { document } = parseHTML(fs.readFileSync(f, 'utf8'));
  I.collect(document).forEach((u) => add(u.key, f));
  I.collectAttrs(document).forEach((u) => add(u.key, f));
  I.collectMeta(document).forEach((u) => add(u.key, f));
}

// Textos que crea el JavaScript (assets/contact-widget-v3.js, menu-v3.js, agenda-modal.js).
// Si agregas uno nuevo en esos archivos, agrégalo también aquí.
[
  'Abrir menú', 'Cerrar menú', 'Cerrar',
  'Hola Milton, quiero conversar sobre un problema de mi negocio', 'Consulta para Milton Dávila',
  'HABLEMOS DE LO QUE NECESITAS', 'ENCONTREMOS EL SIGUIENTE PASO',
  'Elige una opción para continuar desde tu celular.', 'Tu mensaje está preparado. Elige cómo quieres enviarlo.',
  'Elige cómo quieres hablar con Milton.', 'Elige cómo quieres enviar tu mensaje.', 'LLAMAR',
  'Ej.: Mis clientes no me encuentran en Google', 'Ej.: Pierdo clientes por responder tarde',
  'Ej.: Mi equipo copia datos de un sistema a otro', 'Ej.: Quiero usar IA, pero no sé cómo',
  'Ej.: Quiero construir algo propio para mi empresa',
  'Pásalo a tu móvil con un código QR', 'Pásalo a móvil', 'Código QR que abre miltondavila.com',
  'Mi tarjeta de presentación', 'Escanéalo para abrir miltondavila.com',
  '¡Pásalo a móvil!', 'Código QR que abre esta página en tu celular',
  'Abre la cámara de tu celular y apunta al código. Se abre esta misma página.',
  'Agendar sesión', 'Cargando calendario…', 'Abrir en una pestaña nueva',
  'No se pudo cargar el calendario. Usa el enlace de abajo.',
].forEach((k) => add(k, 'js'));

let en = {};
try { en = JSON.parse(fs.readFileSync('assets/i18n/en.json', 'utf8')); } catch {}
const tokens = (s) => (s.match(/<\/?[a-z]+\d+\/?>/g) || []).sort().join('');
// sin letras (números, teléfonos, símbolos), correos y nombres de marca iguales en ambos idiomas
const skipOk = (k) => !/[A-Za-zÁÉÍÓÚáéíóúñÑ]{2,}/.test(k.replace(/<[^>]+>/g, '')) || /^[\w.+-]+@[\w.-]+$/.test(k);
const missing = [...keys.keys()].filter((k) => !(k in en) && !skipOk(k));
const bad = Object.keys(en).filter((k) => tokens(k) !== tokens(en[k]));
const unused = Object.keys(en).filter((k) => !keys.has(k));
if (unused.length && unused.length < 25) console.log('  sobrantes:', unused.map((k) => k.slice(0, 50)).join(' | '));
console.log(`textos: ${keys.size} · traducidos: ${[...keys.keys()].filter((k) => k in en).length} · faltan: ${missing.length} · etiquetas mal: ${bad.length} · sobrantes: ${unused.length}`);
bad.forEach((k) => console.log('  ETIQUETAS:', k.slice(0, 90)));
if (process.argv.includes('--write')) {
  fs.writeFileSync('publicar/i18n-missing.json', JSON.stringify(Object.fromEntries(missing.map((k) => [k, ''])), null, 1));
  console.log('escrito publicar/i18n-missing.json');
} else missing.slice(0, 15).forEach((k) => console.log('  falta:', k.slice(0, 100)));
process.exitCode = missing.length || bad.length ? 1 : 0;
