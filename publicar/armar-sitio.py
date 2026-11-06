#!/usr/bin/env python3
"""Arma la carpeta lista para publicar a partir de milton-v3.html y about-v3.html.
Solo copia los archivos que el sitio usa (no sube docs/, respaldos/ ni fotos sin usar).
Uso (desde la raíz del proyecto):   python3 publicar/armar-sitio.py <carpeta-destino>
Requiere Node.js (npx) para minificar el CSS y el JS del kit de contacto.
"""
import os, re, shutil, subprocess, sys

R = os.getcwd()
D = os.path.abspath(sys.argv[1])
if os.path.exists(D):
    shutil.rmtree(D)
os.makedirs(D + "/assets")


def sh(cmd):
    subprocess.run(cmd, shell=True, check=True, cwd=R)


def convertir(src, dst):
    s = open(src, encoding="utf-8").read()
    s = s.replace('href="milton-v3.html', 'href="/').replace('href="about-v3.html', 'href="about.html')
    s = s.replace("assets/manifest-v3.webmanifest", "manifest.webmanifest")
    open(dst, "w", encoding="utf-8").write(s)


convertir("milton-v3.html", D + "/index.html")
convertir("about-v3.html", D + "/about.html")
for origen, destino in [("publicar/robots.txt", "robots.txt"), ("publicar/sitemap.xml", "sitemap.xml"),
                        ("publicar/llms.txt", "llms.txt"), ("publicar/404.html", "404.html"),
                        ("assets/icons/favicon.ico", "favicon.ico"),
                        ("assets/icons/apple-touch-icon.png", "apple-touch-icon.png"),
                        ("assets/icons/apple-touch-icon.png", "apple-touch-icon-precomposed.png")]:
    shutil.copy(origen, D + "/" + destino)

manifest = open("assets/manifest-v3.webmanifest", encoding="utf-8").read()
manifest = manifest.replace('"icons/', '"assets/icons/').replace('"screenshots/', '"assets/screenshots/')
open(D + "/manifest.webmanifest", "w", encoding="utf-8").write(manifest)

# CSS y JS del kit de contacto, minificados
sh(f'npx -y clean-css-cli -o "{D}/assets/site.min.css" assets/milton-v3.css assets/contact-widget.css assets/ask-section.css')
sh(f'npx -y terser assets/contact-widget-v3.js --compress --mangle -o "{D}/assets/contact-widget.min.js"')
for f in ("index.html", "about.html"):
    p = f"{D}/{f}"
    s = open(p, encoding="utf-8").read()
    s = re.sub(r'<link rel="stylesheet" href="assets/milton-v3.css">\s*<link rel="stylesheet" href="assets/contact-widget.css">\s*<link rel="stylesheet" href="assets/ask-section.css">',
               '<link rel="stylesheet" href="assets/site.min.css">', s)
    s = s.replace("assets/contact-widget-v3.js", "assets/contact-widget.min.js")
    open(p, "w", encoding="utf-8").write(s)

# Copiar solo lo que se usa
refs = set()
fuentes = [D + "/index.html", D + "/about.html", D + "/manifest.webmanifest", D + "/assets/site.min.css",
           D + "/assets/contact-widget.min.js", "assets/agenda-modal.js", "assets/menu-v3.js", "assets/i18n.js"]
for p in fuentes:
    t = open(p, encoding="utf-8").read()
    refs |= set(re.findall(r"assets/[A-Za-z0-9_\-./]+\.(?:webp|png|jpg|jpeg|svg|ico|woff2|json|js|css|webmanifest)", t))
for css in ("assets/milton-v3.css", "assets/contact-widget.css", "assets/ask-section.css"):
    t = open(css, encoding="utf-8").read()
    for u in re.findall(r'url\(["\']?([^)"\']+)', t):
        if not u.startswith(("data:", "http")):
            refs.add(os.path.normpath(os.path.join(os.path.dirname(css), u)))
refs |= {"assets/qrcode.min.js", "assets/agenda-modal.js", "assets/menu-v3.js",
         "assets/screenshots/home-movil.png", "assets/screenshots/home-escritorio.png"}
faltan = []
for r in sorted(refs):
    r = r.split("?")[0]
    if r in ("assets/site.min.css", "assets/contact-widget.min.js") or r.startswith("assets/manifest"):
        continue
    if os.path.exists(r):
        os.makedirs(os.path.dirname(f"{D}/{r}"), exist_ok=True)
        shutil.copy(r, f"{D}/{r}")
    else:
        faltan.append(r)
print("archivos:", sum(len(f) for _, _, f in os.walk(D)), "| faltantes:", faltan)
sys.exit(1 if faltan else 0)
