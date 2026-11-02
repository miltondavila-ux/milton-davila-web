# Decisiones aprobadas de Milton — sitio v3

Puntos de respaldo: `respaldos/punto-2026-11-01/` (inicial) y **`respaldos/punto-2026-11-01b/`** (vigente: textos, agenda, OG, manifest). Cada uno con `CHECKSUMS.txt`.
Verificador automático: `python3 docs/verificar-decisiones.py` (debe terminar en 0 fallos).

## Reglas de trabajo (de Milton)
1. Hacer **solo lo que pide**. Si se ve otra cosa por arreglar, avisar y esperar su OK.
2. Antes de tocar una sección, confirmar que es la que él nombró.
3. **Máximo 6 tarjetas por sección.**
4. Contacto solo por el kit (barra de mensaje → QR/WhatsApp/SMS/llamada/email). Sin formularios.
5. No mostrar precios. Sesión de 10 min sin costo; 20 y 60 min "pueden tener costo, se ve al agendar".
6. Fotos sin recortes feos; las imágenes con IA respetan su cara y sus gestos.
7. `milton-v2.html`, `index.html` y `about.html` originales no se tocan.
8. No volver a correr `apply_seo.py` (no tiene los cambios del 1-nov y borraría textos).

## Textos aprobados (home `milton-v3.html`)
| Sección | Texto aprobado |
|---|---|
| HERO · etiqueta (arriba del titular) | Tecnología a la medida de tu empresa |
| HERO · titular | Tu negocio necesita **una solución tecnológica que funcione.** |
| HERO · párrafo 1 | Si tus clientes no te encuentran, si no apareces en las respuestas de la inteligencia artificial, si no les contestas a tiempo o si tu equipo pierde horas en tareas manuales, yo lo resuelvo. |
| HERO · párrafo 2 (negrita) | Empezamos con una conversación de 10 minutos, sin costo. |
| Barra de mensaje | Centrada: "Hablemos de tu necesidad" / "¿Qué necesitas resolver?" |
| Problema 06 | **Quiero construir algo propio para mi empresa** — Si puedes explicar lo que necesitas, diseñamos el sistema o la herramienta a la medida. |
| Problemas (6) | "¿Qué está frenando tu negocio?" — "No tienes que saber de tecnología. Solo elige el problema que más se parezca al tuyo." |
| Sección 4 (pausa) | Hoy mismo alguien está buscando lo que tú vendes.<br>**¿Te va a encontrar a ti?** — botón "Quiero que me encuentren →" |
| Sectores (6 tarjetas) | Real Estate · Seguros · Abogados · Salud (médicos, clínicas y hospitales) · Empresas y negocios · Marca personal. Línea final: "¿No ves tu sector? Escríbeme…" |
| Sesiones | **Habla conmigo y descubre tu siguiente paso.** — "No importa si aún no sabes qué necesitas. Me cuentas cómo está tu negocio y lo vemos juntos." |
| Cifras | +3.000 · 20+ años · 4 plataformas ("propias: 10MinutesWebsite, La Solución Web, El HUB y SEO Total") · IA aplicada |
| FAQ | 10 preguntas (HTML = schema FAQPage). Incluye "¿Qué es un CRM…?" y "¿Cuánto cuesta trabajar con Milton?" |

## Imágenes aprobadas
- HERO: `assets/fotos/ia/hero-sonrisa-qr` (brazos cruzados, QR en la camiseta).
- Sección 4: `assets/fotos/ia/reunion-qr` (sala de reuniones, QR en la camiseta).
- Sesiones: `assets/fotos/playa/camisa-blanca-manos-cintura`.
- Cierre: `assets/fotos/ia/creador-contenido`. Escenario: `assets/fotos/evento/escenario-01`.

## Agenda (TidyCal)
- Sesión de 10 min: botón "Agendar" → https://tidycal.com/miltondavila/10-minutos-con-milton-davila en **ventana flotante** (`assets/agenda-modal.js`; carga el embed.js oficial de TidyCal solo al pulsar "Agendar"; Ctrl/Cmd+clic o sin JS abre pestaña nueva). Requiere en `publicar/_headers`: `frame-src https://tidycal.com` y `script-src … https://asset-tidycal.b-cdn.net` (ya agregados).
- Sesión de 20 min: https://tidycal.com/miltondavila/20-minutos-con-milton (ventana flotante).
- Sesión de 60 min: https://tidycal.com/miltondavila/consulta-1-hora-con-milton (ventana flotante).

## Eliminado por decisión de Milton
- Sección de servicios ("Sistemas que hacen que tu empresa funcione mejor", 6 tarjetas) y, con ella, el catálogo de servicios del schema.
- Sección "Contenido para que lo hagas tú mismo" (el blog va en el menú).

## Confirmado por Milton
- 2026-11-01: la sesión de **10 minutos es sin costo** (confirmado). Las de 20 y 60 min "pueden tener costo".

## SEO / compartir / app (actualizado 2026-11-01)
- `<title>` home: **Milton Dávila | Sistemas, IA y automatización para empresas**.
- Descripción: "Diseño sistemas, CRM, automatizaciones e inteligencia artificial para que tu empresa atienda mejor, ahorre tiempo y aparezca en Google y en ChatGPT."
- Imagen OG home regenerada (`assets/og/og-home.jpg`, 1200×630): foto del HERO con QR + titular actual. Alt de OG/Twitter actualizado.
- Schema: ProfessionalService/Person/WebPage actualizados (sin catálogo de servicios). About: descripción con "sistemas y CRM".
- Manifest (`assets/manifest-v3.webmanifest`): nombre/descr. nuevos + capturas `assets/screenshots/home-movil.png` (1080×1920) y `home-escritorio.png` (1280×720). Iconos de teléfono (180/192/512/maskable) y favicon: sin cambios (logo M).
- `publicar/llms.txt` y `publicar/sitemap.xml` actualizados.

## Pendientes conocidos (no resueltos todavía)
- TidyCal (actualizado 2026-11-01 por Claude con permiso de Milton): 10 min → título "Conversación de 10 minutos con Milton Dávila" + descripción general; 20 min → duración 20 y encabezado corregido; 60 min → título "Sesión de estrategia de 60 minutos con Milton Dávila" + descripción general. Se conservaron los "Detalles importantes" (Zoom, WhatsApp). No se tocaron otros tipos de reserva (Co Sponsorship, Consultoría de IA, Seguros, Primera Cita, Configuración Total), que siguen visibles en tidycal.com/miltondavila.
- Datos por confirmar: "+3.000", "20+ años / Desde 1997", reseñas 5,0 / 249, enlace de calendario con pago, blog.miltondavila.com activo.
