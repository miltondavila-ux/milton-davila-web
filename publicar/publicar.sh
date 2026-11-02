#!/usr/bin/env bash
# Publica la versión 3 como sitio principal. NO se ejecuta solo: corre este archivo cuando quieras publicar.
# Uso (desde la carpeta del proyecto):   bash publicar/publicar.sh
set -euo pipefail
cd "$(dirname "$0")/.."

[ -f index.html ] && cp index.html index.anterior.html && echo "Respaldo: index.anterior.html"
[ -f about.html ] && cp about.html about.anterior.html && echo "Respaldo: about.anterior.html"

# Páginas: se renombran y se ajustan los enlaces internos
sed -e 's#href="milton-v3.html#href="/#g' -e 's#href="about-v3.html#href="about.html#g' milton-v3.html > index.html
sed -e 's#href="milton-v3.html#href="/#g' -e 's#href="about-v3.html#href="about.html#g' about-v3.html > about.html

# Archivos de sitio
cp publicar/robots.txt robots.txt
cp publicar/sitemap.xml sitemap.xml
cp publicar/llms.txt llms.txt
cp publicar/404.html 404.html
cp publicar/_headers _headers
cp assets/icons/favicon.ico favicon.ico
cp assets/manifest-v3.webmanifest manifest.webmanifest
# El manifest en la raíz necesita rutas de íconos desde la raíz
sed -i.bak 's#"icons/#"assets/icons/#g' manifest.webmanifest && rm -f manifest.webmanifest.bak
sed -i.bak 's#assets/manifest-v3.webmanifest#manifest.webmanifest#' index.html about.html && rm -f index.html.bak about.html.bak

# Optimización: un solo CSS y un solo JS, minificados (requiere Node.js; si no está, se omite)
if command -v npx >/dev/null 2>&1; then
  npx -y clean-css-cli -o assets/site.min.css assets/milton-v3.css assets/contact-widget.css assets/ask-section.css
  npx -y terser assets/contact-widget-v3.js --compress --mangle -o assets/contact-widget.min.js
  python3 - <<'PY'
import re
for f in ("index.html","about.html"):
    s=open(f,encoding="utf-8").read()
    s=re.sub(r'<link rel="stylesheet" href="assets/milton-v3.css">\n<link rel="stylesheet" href="assets/contact-widget.css">\n<link rel="stylesheet" href="assets/ask-section.css">','<link rel="stylesheet" href="assets/site.min.css">',s)
    s=s.replace("assets/contact-widget-v3.js","assets/contact-widget.min.js")
    open(f,"w",encoding="utf-8").write(s)
PY
else
  echo "Aviso: Node.js no está instalado; se publica sin minificar (funciona igual)."
fi

echo "Listo. Revisa index.html y about.html, y sube la carpeta a tu hosting."
