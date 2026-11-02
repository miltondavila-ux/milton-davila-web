#!/usr/bin/env python3
"""Verifica que milton-v3.html conserve las decisiones aprobadas (ver docs/decisiones-v3.md).
Uso:  python3 docs/verificar-decisiones.py   (desde la raíz del proyecto)
"""
import html, json, os, re, sys
from html.parser import HTMLParser

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src = open(os.path.join(ROOT, "milton-v3.html"), encoding="utf-8").read()
fails, ok = [], 0


def check(cond, msg):
    global ok
    if cond:
        ok += 1
    else:
        fails.append(msg)


def text(fragment):
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", "", fragment))).strip()


body = text(src[src.index("<body"):])

# Textos aprobados
for t in [
    "Tecnología a la medida de tu empresa",
    "Quiero construir algo propio para mi empresa",
    "Tu negocio necesita una solución tecnológica que funcione.",
    "Si tus clientes no te encuentran, si no apareces en las respuestas de la inteligencia artificial, si no les contestas a tiempo o si tu equipo pierde horas en tareas manuales, yo lo resuelvo.",
    "Empezamos con una conversación de 10 minutos, sin costo.",
    "¿Qué necesitas resolver?",
    "¿Qué está frenando tu negocio?",
    "No tienes que saber de tecnología. Solo elige el problema que más se parezca al tuyo.",
    "Hoy mismo alguien está buscando lo que tú vendes.",
    "¿Te va a encontrar a ti?",
    "Quiero que me encuentren",
    "Habla conmigo y descubre tu siguiente paso.",
    "No importa si aún no sabes qué necesitas. Me cuentas cómo está tu negocio y lo vemos juntos.",
    "4 plataformas",
    "propias: 10MinutesWebsite, La Solución Web, El HUB y SEO Total",
    "¿Qué es un CRM y para qué sirve?",
    "¿Cuánto cuesta trabajar con Milton?",
    "Desplegamos y acompañamos",
    "Cuéntame cómo trabajas y lo construyo: sistemas, integraciones y agentes de IA hechos para tu operación.",
    "Lo instalo dentro de tu operación, lo medimos y lo mejoramos contigo.",
    "Sí. Me conecto a tu CRM, correo, teléfono, calendarios y bases de datos, y construyo lo que falte para que tu equipo deje de copiar datos a mano.",
]:
    check(t in body, f"Falta el texto aprobado: {t[:70]}")

# Imágenes aprobadas
for img in ["ia/hero-sonrisa-qr", "ia/reunion-qr", "playa/camisa-blanca-manos-cintura", "ia/creador-contenido"]:
    check(f"assets/fotos/{img}" in src, f"Falta la imagen aprobada: {img}")
    check(os.path.exists(os.path.join(ROOT, f"assets/fotos/{img}.webp")), f"No existe el archivo: {img}.webp")
for viejo in ["hero-brazos-cruzados", "reunion-grupo-03", "camisa-blanca-sonrisa"]:
    check(viejo not in src, f"Reapareció una imagen anterior: {viejo}")

check('tidycal.com/miltondavila/10-minutos-con-milton-davila' in src, 'Falta el enlace de agenda de 10 minutos')
check('data-agenda' in src and 'assets/agenda-modal.js' in src, 'Falta la ventana flotante de agenda')
check(os.path.exists(os.path.join(ROOT, 'assets/agenda-modal.js')), 'Falta assets/agenda-modal.js')
check('tidycal.com/miltondavila/20-minutos-con-milton' in src, 'Falta el enlace de agenda de 20 minutos')
check('tidycal.com/miltondavila/consulta-1-hora-con-milton' in src, 'Falta el enlace de agenda de 60 minutos')
check('<title>Milton Dávila | Sistemas, IA y automatización para empresas</title>' in src, 'Título SEO distinto al aprobado')
check('Tu negocio necesita una solución tecnológica que funcione' in src[:src.index('</head>')], 'El alt de la imagen OG no coincide con el titular')
check(os.path.exists(os.path.join(ROOT, 'assets/og/og-home.jpg')), 'Falta la imagen OG')
# Menú móvil con QR (tarjeta de presentación)
about_src = open(os.path.join(ROOT, "about-v3.html"), encoding="utf-8").read()
check(os.path.exists(os.path.join(ROOT, 'assets/menu-v3.js')), 'Falta assets/menu-v3.js (menú móvil con QR)')
check("Soy ingeniero de implementación (forward deployed engineer): trabajo dentro de tu empresa para construir, conectar y poner en marcha las herramientas que necesita." in about_src, 'Falta la presentación aprobada en Sobre mí')
check('assets/menu-v3.js' in src and 'assets/menu-v3.js' in about_src, 'Falta cargar menu-v3.js en la home o en Sobre mí')
check("https://miltondavila.com/" in open(os.path.join(ROOT, 'assets/menu-v3.js'), encoding="utf-8").read(), 'El QR del menú no apunta a https://miltondavila.com/')
check(os.path.exists(os.path.join(ROOT, 'assets/screenshots/home-movil.png')), 'Falta la captura móvil del manifest')
# Eliminado
check('id="soluciones"' not in src, "Reapareció la sección de servicios (#soluciones)")
check("Contenido para que lo hagas tú" not in body, "Reapareció la sección de contenido/blog")
check("hasOfferCatalog" not in src, "Reapareció el catálogo de servicios en el schema")

# Máximo 6 tarjetas por sección
for sec in re.finditer(r'<section[^>]*?(?:id="([^"]+)")?[^>]*>(.*?)</section>', src, re.S):
    n = len(re.findall(r'<article class="card|<a [^>]*class="rubro"', sec.group(2)))
    check(n <= 6, f"Sección {sec.group(1) or '(sin id)'} tiene {n} tarjetas (máximo 6)")
rub = src[src.index('id="rubros"'):]
rub = rub[:rub.index("</section>")]
check(len(re.findall(r'class="rubro"', rub)) == 6, "Rubros no tiene exactamente 6 tarjetas")

# Estructura
class P(HTMLParser):
    void = {"img", "meta", "link", "br", "input", "hr", "source"}

    def __init__(s):
        super().__init__()
        s.st, s.err = [], []

    def handle_starttag(s, t, a):
        if t not in s.void:
            s.st.append(t)

    def handle_endtag(s, t):
        if not s.st or s.st[-1] != t:
            s.err.append((t, s.getpos()))
        else:
            s.st.pop()


p = P()
p.feed(src)
check(not p.err and not p.st, f"HTML mal anidado: {p.err[:2]} {p.st[:2]}")
check(src.count("</html>") == 1 and src.rstrip().endswith("</html>"), "Hay contenido duplicado o después de </html>")
ids = re.findall(r'\bid="([^"]+)"', src)
check(len(ids) == len(set(ids)), "Hay ids repetidos")
check(len(re.findall(r"<h1", src)) == 1, "Debe haber un solo <h1>")
check(len(re.findall(r'<img(?![^>]*\balt=)[^>]*>', src)) == 0, "Hay imágenes sin alt")

# Anclas internas
for h in set(re.findall(r'href="#([^"]+)"', src)):
    check(h in ids, f"Ancla rota: #{h}")

# FAQ visible = schema
vis = [(text(q), text(a)) for q, a in re.findall(r"<summary>(.*?)</summary><p>(.*?)</p>", src, re.S)]
schema = []
for b in re.findall(r'<script type="application/ld\+json">(.*?)</script>', src, re.S):
    d = json.loads(b)
    stack = [d]
    while stack:
        o = stack.pop()
        if isinstance(o, dict):
            if o.get("@type") == "FAQPage":
                schema = [(q["name"], q["acceptedAnswer"]["text"]) for q in o["mainEntity"]]
            stack.extend(o.values())
        elif isinstance(o, list):
            stack.extend(o)
check(vis == schema and len(vis) == 10, f"FAQ visible ({len(vis)}) distinta del schema ({len(schema)})")

# Contacto: cada botón con mensaje debe tener el mismo texto en el enlace de WhatsApp
from urllib.parse import unquote
for a in re.finditer(r"<a [^>]*data-contact[^>]*>", src):
    dm = re.search(r'data-message="([^"]*)"', a.group(0))
    hr = re.search(r'href="([^"]*)"', a.group(0)).group(1)
    if dm:
        check(unquote(hr.split("text=")[-1]) == dm.group(1), f"Mensaje distinto en botón: {dm.group(1)[:40]}")

print(f"Correctos: {ok} | Fallos: {len(fails)}")
for f in fails:
    print("  FALLO:", f)
sys.exit(1 if fails else 0)
