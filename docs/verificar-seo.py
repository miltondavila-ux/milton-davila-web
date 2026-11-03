#!/usr/bin/env python3
"""Revisa SEO, AEO, datos estructurados, imágenes OG e íconos de app de milton-v3.html y about-v3.html.
Uso (desde la raíz del proyecto):   python3 docs/verificar-seo.py
Para medir imágenes necesita Pillow (si no está, omite solo esas medidas).
"""
import json, os, re, struct, sys
from html.parser import HTMLParser

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = "https://miltondavila.com"
fails, warns, ok = [], [], 0


def check(cond, msg):
    global ok
    if cond:
        ok += 1
    else:
        fails.append(msg)


def aviso(cond, msg):
    if not cond:
        warns.append(msg)


def rd(p):
    return open(os.path.join(ROOT, p), encoding="utf-8").read()


def img_size(path):
    full = os.path.join(ROOT, path)
    with open(full, "rb") as f:
        head = f.read(32)
    if head[:8] == b"\x89PNG\r\n\x1a\n":
        return struct.unpack(">II", head[16:24])
    try:
        from PIL import Image
        return Image.open(full).size
    except Exception:
        return None


class Estructura(HTMLParser):
    def __init__(s):
        super().__init__()
        s.h, s.imgs, s.links, s.ids, s.title = [], [], [], [], ""
        s._t = False

    def handle_starttag(s, t, a):
        a = dict(a)
        if "id" in a:
            s.ids.append(a["id"])
        if t in ("h1", "h2", "h3", "h4"):
            s.h.append(int(t[1]))
        if t == "img":
            s.imgs.append(a)
        if t == "a":
            s.links.append(a)


PAGES = [("milton-v3.html", SITE + "/", "og-home.jpg"), ("about-v3.html", SITE + "/about.html", "og-about-2.jpg")]
canon_by_page = {}

for fname, canon, og in PAGES:
    s = rd(fname)
    n = fname.replace("-v3.html", "")
    P = Estructura()
    P.feed(s)
    title = re.search(r"<title>(.*?)</title>", s).group(1)
    desc = re.search(r'<meta name="description" content="(.*?)"', s).group(1)

    check(30 <= len(title) <= 62, f"[{n}] título de {len(title)} caracteres (ideal 30–60)")
    check(110 <= len(desc) <= 165, f"[{n}] descripción de {len(desc)} caracteres (ideal 110–160)")
    check('<html lang="es">' in s, f"[{n}] falta lang=\"es\"")
    check('name="viewport"' in s and 'name="theme-color"' in s, f"[{n}] faltan viewport o theme-color")
    check(re.search(r'<link rel="canonical" href="%s">' % re.escape(canon), s) is not None, f"[{n}] canonical distinto de {canon}")
    check("www.miltondavila.com" not in s, f"[{n}] quedó una URL con www")
    check('content="index, follow' in s, f"[{n}] robots no indexable")
    check(P.h.count(1) == 1, f"[{n}] debe haber un solo h1 (hay {P.h.count(1)})")
    saltos = [(a, b) for a, b in zip(P.h, P.h[1:]) if b - a > 1]
    check(not saltos, f"[{n}] saltos de nivel en los encabezados: {saltos[:3]}")
    check(all(i.get("alt") is not None for i in P.imgs), f"[{n}] imágenes sin alt")
    check(all(i.get("width") and i.get("height") for i in P.imgs), f"[{n}] imágenes sin width/height (causan saltos al cargar)")
    ext_mal = [l.get("href") for l in P.links if l.get("target") == "_blank" and "noopener" not in (l.get("rel") or "")]
    check(not ext_mal, f"[{n}] enlaces _blank sin rel=noopener: {ext_mal[:3]}")
    check(all((l.get("href") or "").strip() for l in P.links), f"[{n}] hay enlaces vacíos")
    for l in P.links:
        h = l.get("href") or ""
        if h.startswith("#") and len(h) > 1:
            check(h[1:] in P.ids, f"[{n}] ancla rota {h}")
    check(len(P.ids) == len(set(P.ids)), f"[{n}] ids repetidos")

    check('<meta name="google-site-verification" content="0oY5QsV_KrcmhCDnGydMDdyDD-YTuLB7_HaIJm8OBhQ">' in s, f"[{n}] falta la etiqueta de verificación de Google Search Console")
    check('<meta name="msvalidate.01" content="533679B07f70B69C407E124DB9011B4A">' in s, f"[{n}] falta la etiqueta de verificación de Bing")
    check("googletagmanager.com/gtag/js?id=G-GLQKNHSCNW" in s and "gtag('config', 'G-GLQKNHSCNW')" in s, f"[{n}] falta Google Analytics (G-GLQKNHSCNW)")
    # Open Graph y Twitter
    def meta(attr, name):
        m = re.search(r'<meta %s="%s" content="(.*?)"' % (attr, re.escape(name)), s)
        return m.group(1) if m else None
    for k in ("og:type", "og:site_name", "og:locale", "og:url", "og:title", "og:description", "og:image", "og:image:width", "og:image:height", "og:image:alt"):
        check(meta("property", k), f"[{n}] falta {k}")
    for k in ("twitter:card", "twitter:title", "twitter:description", "twitter:image", "twitter:image:alt"):
        check(meta("name", k), f"[{n}] falta {k}")
    check(meta("property", "og:url") == canon, f"[{n}] og:url distinto del canonical")
    check(meta("property", "og:title") == title and meta("name", "twitter:title") == title, f"[{n}] og/twitter title distinto del <title>")
    check(meta("property", "og:description") == desc and meta("name", "twitter:description") == desc, f"[{n}] og/twitter description distinto de la meta description")
    check(meta("property", "og:image") == f"{SITE}/assets/og/{og}", f"[{n}] og:image inesperada")
    check(meta("property", "og:image:alt") == meta("name", "twitter:image:alt"), f"[{n}] alt de OG y Twitter distintos")
    sz = img_size(f"assets/og/{og}")
    if sz:
        check(sz == (1200, 630), f"[{n}] la imagen OG mide {sz}, debe ser 1200×630")
    aviso(os.path.getsize(os.path.join(ROOT, f"assets/og/{og}")) < 300_000, f"[{n}] la imagen OG pesa más de 300 KB")

    # JSON-LD
    bloques = re.findall(r'<script type="application/ld\+json">(.*?)</script>', s, re.S)
    check(len(bloques) == 1, f"[{n}] debe haber 1 bloque JSON-LD")
    graf = json.loads(bloques[0])["@graph"]
    ids = {x.get("@id") for x in graf if x.get("@id")}
    tipos = [x["@type"] for x in graf]
    for x in graf:
        txt = json.dumps(x, ensure_ascii=False)
        for ref in re.findall(r'\{"@id": "([^"]+)"\}', txt):
            check(ref in ids, f"[{n}] el schema referencia {ref} que no existe")
        if x["@type"] == "ProfessionalService":
            check("serviceType" not in x and "availableLanguage" not in x, f"[{n}] ProfessionalService con propiedades que Schema.org no reconoce (serviceType/availableLanguage)")
        check("mailto:" not in txt, f"[{n}] el email del schema debe ir sin mailto:")
        check("www.miltondavila.com" not in txt, f"[{n}] URL con www en el schema")
        check("estratega" not in txt.lower() and "ingeniero" not in txt.lower(), f"[{n}] palabra no aprobada en el schema")
    for t in ("WebSite", "ProfessionalService", "Person"):
        check(t in tipos, f"[{n}] falta {t} en el schema")
    check(("AboutPage" in tipos and "BreadcrumbList" in tipos) if n == "about" else ("WebPage" in tipos and "FAQPage" in tipos), f"[{n}] faltan tipos de página en el schema")
    for x in graf:
        if x["@type"] in ("WebPage", "AboutPage"):
            check(x.get("url") == canon, f"[{n}] la URL del schema no coincide con el canonical")
            check(x.get("name") == title, f"[{n}] el name del schema no coincide con el título")
            check(x.get("description") == desc, f"[{n}] la description del schema no coincide con la meta")
            check(re.match(r"\d{4}-\d{2}-\d{2}$", x.get("dateModified", "")), f"[{n}] dateModified inválida")
        if x["@type"] in ("ProfessionalService", "Person"):
            check(re.match(r"\+\d{10,15}$", x.get("telephone", "")), f"[{n}] teléfono del schema no está en formato internacional")
            check(x.get("sameAs") and all(u.startswith("https://") for u in x["sameAs"]), f"[{n}] sameAs incompleto")
    if n == "milton":
        faq = [x for x in graf if x["@type"] == "FAQPage"][0]
        vis = [(re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", q)).strip(), re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", a)).strip())
               for q, a in re.findall(r"<summary>(.*?)</summary><p>(.*?)</p>", s, re.S)]
        sch = [(q["name"], q["acceptedAnswer"]["text"]) for q in faq["mainEntity"]]
        check(vis == sch, f"[{n}] las preguntas frecuentes visibles no son idénticas a las del schema")

# sitemap, robots, llms
sm = rd("publicar/sitemap.xml")
for _, canon, og in PAGES:
    check(f"<loc>{canon}</loc>" in sm, f"sitemap sin {canon}")
    check(f"{SITE}/assets/og/{og}" in sm, f"sitemap sin la imagen {og}")
check("www.miltondavila.com" not in sm, "el sitemap tiene www")
check(f"Sitemap: {SITE}/sitemap.xml" in rd("publicar/robots.txt"), "robots.txt no apunta al sitemap")
ll = rd("publicar/llms.txt")
check("www.miltondavila.com" not in ll, "llms.txt tiene www")
check("hub.lasolucionweb.net" in ll, "llms.txt no menciona El HUB")

# manifest e íconos
mf = json.loads(rd("assets/manifest-v3.webmanifest"))
for k in ("name", "short_name", "description", "start_url", "scope", "display", "theme_color", "background_color", "lang", "id"):
    check(mf.get(k), f"manifest sin {k}")
check(mf.get("name") == "Milton Dávila", "el nombre de la app debe ser Milton Dávila")
for ic in mf["icons"]:
    p = ("assets/" + ic["src"] if not ic["src"].startswith("assets/") else ic["src"]).split("?")[0]
    sz = img_size(p)
    check(os.path.exists(os.path.join(ROOT, p)), f"manifest: no existe {p}")
    if sz:
        check("%dx%d" % sz == ic["sizes"], f"manifest: {p} mide {sz}, declara {ic['sizes']}")
for sc in mf.get("screenshots", []):
    p = ("assets/" + sc["src"]).split("?")[0]
    sz = img_size(p)
    check(os.path.exists(os.path.join(ROOT, p)), f"manifest: no existe {p}")
    if sz:
        check("%dx%d" % sz == sc["sizes"], f"manifest: {p} mide {sz}, declara {sc['sizes']}")
for p, esperado in (("assets/icons/apple-touch-icon.png", (180, 180)), ("assets/icons/favicon-32.png", (32, 32)), ("assets/icons/favicon-16.png", (16, 16))):
    sz = img_size(p)
    check(os.path.exists(os.path.join(ROOT, p)), f"no existe {p}")
    if sz:
        check(sz == esperado, f"{p} mide {sz}, debe medir {esperado}")
check(os.path.exists(os.path.join(ROOT, "assets/icons/favicon.ico")), "falta favicon.ico")
for n in ("milton-v3.html", "about-v3.html"):
    check('rel="apple-touch-icon" sizes="180x180" href="assets/icons/apple-touch-icon.png?v=2"' in rd(n), f"[{n}] el ícono de iPhone debe llevar ?v=2 para que Safari lo descargue de nuevo")
src_build = rd("publicar/armar-sitio.py")
check("apple-touch-icon-precomposed.png" in src_build and '"apple-touch-icon.png")' in src_build, "el armado debe copiar apple-touch-icon.png a la raíz")

print(f"Correctos: {ok} | Fallos: {len(fails)} | Avisos: {len(warns)}")
for f in fails:
    print("  FALLO:", f)
for w in warns:
    print("  AVISO:", w)
sys.exit(1 if fails else 0)
