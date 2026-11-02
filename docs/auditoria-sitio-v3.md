> **Actualización 2026-11-01:** esta auditoría describe el estado del 30-oct. Los cambios posteriores (textos, imágenes, agenda TidyCal, título/descripción, imagen OG, manifest con capturas, llms.txt) están en `docs/decisiones-v3.md`, que es la referencia vigente.

# Sitio v3 · Auditoría, SEO/AEO y cómo publicar

**Fecha:** 30 oct 2026 · **Páginas:** `milton-v3.html` (inicio) y `about-v3.html` (quién está detrás)
**Estado:** listo para publicar. No se ha publicado ni subido a GitHub ningún cambio de estas páginas.

## Resultado de las auditorías

| Prueba | Resultado |
|---|---|
| Auditoría estática propia (estructura, SEO, enlaces, imágenes, schema vs. texto visible, accesibilidad, legibilidad) | **0 fallos** en las dos páginas |
| Lighthouse (Google) sobre la versión de **producción**, móvil y escritorio, las dos páginas | **100 / 100 / 100 / 100** (rendimiento, accesibilidad, buenas prácticas, SEO) |
| Validación estricta de schema.org (JSON-LD, ninguna propiedad descartada) | **Correcta** |
| Anchos de pantalla probados: 320, 375, 768, 1024, 1280, 1920 px | **Sin desbordes** |
| Áreas táctiles (mínimo 44 px) y foco con teclado | Correctas |
| Política de seguridad estricta (CSP) | **Sin violaciones**; el kit de contacto y los QR funcionan |
| Pedidos a terceros (Google Fonts, analítica, etc.) | **Ninguno** (tipografía Lato alojada en el sitio) |

## Qué incluye

- **Textos** reescritos en lenguaje simple (frases cortas, sin jerga; SEO, AEO y CRM se explican donde aparecen).
- **Preguntas frecuentes** (9) visibles en el inicio, con el mismo texto en el schema `FAQPage` (AEO).
- **schema.org** en JSON-LD: `WebSite`, `ProfessionalService` (sin catálogo de servicios: la sección de servicios se eliminó el 2026-11-01), `Person`, `WebPage`, `FAQPage`; en la otra página `AboutPage`, `BreadcrumbList`. Sin `aggregateRating` propio (Google penaliza las reseñas "autoservidas"; las reseñas siguen visibles en la página).
- **Open Graph y Twitter Cards** con imagen 1200×630 por página (`assets/og/`), texto alternativo, `og:locale es_US`.
- **Favicon y íconos de pantalla de inicio** (`assets/icons/`): `favicon.ico` (16/32/48/64), PNG 16 y 32, `apple-touch-icon` 180 (iPhone), 192 y 512 (Android) y versión **maskable** 512. Manifest `assets/manifest-v3.webmanifest` (nombre, colores, íconos, atajo).
- **Imágenes responsivas** (`srcset`/`sizes`, WebP), dimensiones declaradas (sin saltos de diseño), la imagen principal con precarga.
- **Accesibilidad**: enlace "Saltar al contenido", contraste AA (azul oscurecido de `#0076df` a `#0069c9`), foco visible, `prefers-reduced-motion`, áreas táctiles de 44 px, enlaces subrayados dentro de párrafos.
- **Sin JavaScript** los botones abren WhatsApp directo con el mismo mensaje.
- **Archivos de sitio** en `publicar/`: `robots.txt` (con buscadores de IA permitidos), `sitemap.xml` (con imágenes), `llms.txt`, `404.html`, `_headers` (seguridad y caché) y `publicar.sh`.

## Cómo publicar (cuando lo decidas)

```bash
bash publicar/publicar.sh
```

Hace respaldo de `index.html` y `about.html` actuales (`*.anterior.html`), convierte `milton-v3.html` en `index.html` y `about-v3.html` en `about.html`, copia robots/sitemap/llms/404/favicon/manifest/_headers a la raíz y minifica CSS y JS (si hay Node.js). Después sube la carpeta al hosting.

Se probó el script completo en una copia temporal con resultado correcto.

## Después de publicar (pasos que dependen de ti o del hosting)

1. **Google Search Console** y **Bing Webmaster Tools**: verificar el dominio y enviar `https://www.miltondavila.com/sitemap.xml`.
2. **Google Business Profile**: reclamar/actualizar la ficha (enlazar el sitio, mismo teléfono y correo). Es la base del SEO local y de que las IA citen el negocio.
3. Probar la dirección real en el **Rich Results Test** (search.google.com/test/rich-results) y en el **Facebook Sharing Debugger**, que solo funcionan con la web pública.
4. **Encabezados HTTP**: el archivo `_headers` aplica en Cloudflare Pages/Netlify. En otro hosting, copiar los mismos valores en su panel.
5. **Dominio del blog**: `blog.miltondavila.com` debe estar activo (el menú y el pie ya apuntan ahí).
6. **Enlaces "Agendar"** de las sesiones privadas: hoy abren el kit de contacto con un mensaje; cuando exista el calendario con pago, sustituir cada enlace.

## Datos que conviene que Milton confirme

- "+3.000 agentes, profesionales y clientes" (viene del sitio anterior).
- "20+ años" / "Desde 1997" (sale de la trayectoria; el sitio anterior decía "10+" y "30+").
- Reseñas: 5,0 con 249 reseñas en Google (cifra tomada del sitio anterior; actualizar si cambia).
- Redes: se usan Facebook `SoyMiltonDavila`, Instagram `soymiltondavila` y YouTube `10minuteswebsite`.
- Imágenes generadas con IA (`assets/fotos/ia/`): conviene no presentarlas como eventos o clientes reales.
- `pareja-parque.webp` tiene baja resolución (512 px de ancho); se ve bien en pantalla normal pero algo suave en pantallas de alta densidad.
