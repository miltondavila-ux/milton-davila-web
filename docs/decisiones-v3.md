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

## Posicionamiento "forward deployed engineer" (aprobado 2026-11-02)
- Aplicado: proceso con 4º paso "Desplegamos y acompañamos — Lo instalo dentro de tu operación, lo medimos y lo mejoramos contigo."; FAQ "¿Se pueden conectar las herramientas que ya uso?" → "Sí. Me conecto a tu CRM, correo, teléfono, calendarios y bases de datos, y construyo lo que falte para que tu equipo deje de copiar datos a mano." (HTML = schema); Sobre mí abre con "Soy ingeniero de implementación (forward deployed engineer): trabajo dentro de tu empresa para construir, conectar y poner en marcha las herramientas que necesita."
- NO aplicado (Milton lo descartó): nuevo primer párrafo de la portada. Portada intacta.
- Tarjeta "Quiero construir algo propio para mi empresa" ahora es la 1.ª de 6 (Milton dijo "ejecuta lo que creas conveniente"). Texto: "Cuéntame cómo trabajas y lo construyo: sistemas, integraciones y agentes de IA hechos para tu operación." Se evitó "no existe en el mercado" porque Milton dijo que su experiencia es sobre todo con realtors y soluciones que ya existen.
- Pendiente de decidir: título/descripción de Sobre mí ("Estratega de IA y SEO"); FAQ "¿Qué hace Milton Dávila?" (dice "estratega"); canonical/OG/sitemap usan www pero www redirige a miltondavila.com.
- Capacidades que Milton confirmó: plataformas propias 10MinutesWebsite, Hub.lasolucionweb.net, SEO Total Artículos, SEO Total Redes, Blog AI, creador de páginas web posicionables, creador de agentes de IA para WhatsApp, etc.
- Íconos de app (iPhone y Android): logo 6 (Isotipo original, M de colores) sobre azul marino #071a49, elegido por Milton. Archivos: apple-touch-icon.png (180), icon-192.png, icon-512.png, icon-maskable-512.png. Favicon del navegador sin cambios. Los anteriores (M sobre blanco) están en el scratchpad de la sesión del 2026-11-02.
- Menú móvil con QR (assets/menu-v3.js): QR a https://miltondavila.com/, como tarjeta de presentación.

## Cambios del 2026-11-02 (pendientes de publicar)
- Eslogan del pie (home y Sobre mí): "Soluciones digitales construidas alrededor de lo que tu negocio necesita." (antes decía "del problema real de tu negocio").
- Sobre mí · «Detrás de la marca»: 3 fotos, `familia/pareja-parque` (la de naranja), `familia/sofa-con-hijos` y, ancha abajo, `familia/corriendo-playa` (la familia corriendo en la playa; Milton la mandó). Milton autorizó usar fotos con sus hijos. `acuario-familia` quedó sin usar en la página.
- Sobre mí · portada (APROBADA por Milton, "eso!"): foto ancha `playa/atardecer-agachado-ancho` COMPLETA a todo el ancho (sin recortar), con texto en blanco y degradado azul marino solo a la izquierda. NO usar velo blanco (Milton: "ese blanco no ayuda"). En celular (decidido por Milton, "trabájala"): la foto va ARRIBA, en formato 4:5 centrada en él (se recortan los lados de la arena, se ve su cuerpo entero y el sol), y se funde en azul marino con el texto blanco debajo.
- Nombre de la app instalable (manifest `name`): "Milton Dávila".

## Decisiones del 2026-11-02 (tarde, pendientes de publicar)
- Posicionamiento: ya no se usa «estratega». Título de Sobre mí: «Quién es Milton Dávila | Ingeniero de implementación en Miami». FAQ «¿Qué hace Milton Dávila?», schema (jobTitle/description) y llms.txt hablan de ingeniero de implementación.
- URL oficial SIN www: https://miltondavila.com (www redirige). Canonical, OG, schema, sitemap, robots y llms.txt actualizados.
- Correo enmascarado: se MUESTRA info@miltondavila.com pero los enlaces mailto y el botón EMAIL del kit envían a info@miltondavila.net (el buzón real). Si alguien escribe el .com a mano rebota: crear un reenvío info@miltondavila.com → info@miltondavila.net en el hosting de correo.
- Los clientes de Milton son pequeños negocios/profesionales: las pruebas (casos) deben ser de ese tamaño.

- Home · portada en CELULAR (pedido de Milton): se comporta igual que la de Sobre mí: foto arriba en 4:5 centrada en él (QR visible), se funde en azul marino y el texto va en blanco debajo. En escritorio no cambia.

- Celular (auditoría 2026-11-02, pendiente de publicar): botones todos de 50 px de alto, letra 700 más pequeña y con menos espaciado, sin partirse en 2 líneas; barra «¿Qué necesitas resolver?» con campo a todo el ancho y texto corto «¿Qué está pasando en tu negocio?» solo en celular (en escritorio sigue el texto largo); cifras en 2 columnas; etiquetas (kicker) más grandes y con barras más cortas. Revisado a 360, 390 px: sin desbordes, sin botones de menos de 44 px, todas las imágenes con alt.

- Sección «Conoce mi HUB» (pedida por Milton 2026-11-02) en la home (antes de Sesiones privadas) y en Sobre mí (antes de Opiniones): título «Conoce mi HUB.», botón «Conocer mi HUB →» a https://hub.lasolucionweb.net, imagen `fotos/hub/hub-aplicaciones` (maqueta del panel «Mis aplicaciones» que Milton mandó, SIN fondo: recortada con transparencia a pedido suyo; sombra suave por CSS). El HUB reúne las aplicaciones de Milton: crear artículos, automatizar redes sociales, crear agentes de IA para atender clientes.

## Tono de comunicación (2026-11-02, pedido de Milton)
- «Forward deployed engineer» NO se nombra ni se dice «soy ingeniero». Es la vara del nivel: lenguaje elevado, técnico y directo, orientado a ejecución y resultados (referencia de tono: iqthink.com: frases cortas, «de la estrategia al lanzamiento», «cosas que funcionan»).
- Sobre mí · portada: «Diseño, construyo y despliego sistemas, integraciones e IA dentro de tu empresa, de la estrategia a la operación. Más de veinte años haciendo que las cosas funcionen.»
- Título Sobre mí: «Quién es Milton Dávila | Sistemas e IA a la medida». Cargo (schema): «Sistemas, IA y automatización para empresas». FAQ «¿Qué hace Milton Dávila?», descripciones, schema, llms.txt, sitemap y manifest actualizados con el mismo lenguaje.
- Regla: si se cambia un texto, se cambia también en SEO/AEO (title, meta, OG, Twitter, schema, FAQ, llms.txt, sitemap, manifest).

## Auditoría total (2026-11-02, pendiente de publicar)
- Verificadores: `python3 docs/verificar-decisiones.py` (textos/imágenes aprobados) y `python3 docs/verificar-seo.py` (SEO, AEO, schema, OG, íconos; necesita Pillow). Ambos deben terminar en 0 fallos antes de publicar.
- Responsive: probado a 320, 360, 390, 430, 600, 768, 900, 901, 1024, 1280, 1440 y 1920 px en las dos páginas: sin desbordes, sin imágenes deformadas, sin texto cortado, sin botones bajos.
- Portadas en celular usan fotos ya recortadas 4:5 (`*-m-640.webp`, `*-m-900.webp`) con `<picture>` y precarga por tamaño de pantalla (mejor LCP).
- Ventana de contacto: compacta en pantallas bajas (≤700 px de alto) y bloquea el scroll de fondo. Ventana de agenda: el aviso «Cargando calendario…» se queda hasta que TidyCal dibuja el calendario.
- OG de Sobre mí nueva: `assets/og/og-about-2.jpg` (nombre nuevo para forzar a WhatsApp/LinkedIn/Facebook a actualizar la vista previa). Capturas de la app (`assets/screenshots/`) regeneradas con el diseño actual.
- Schema: email sin `mailto:`, `url` del HUB en la marca, `serviceType` en el negocio.
- Texto reducido en Sobre mí (portada, «Una historia de evolución», intro de plataformas).

## Verificación y analítica (2026-11-02)
- Google Search Console: `<meta name="google-site-verification" content="0oY5QsV_KrcmhCDnGydMDdyDD-YTuLB7_HaIJm8OBhQ">` en el `<head>` de las dos páginas (Google exige `<head>`, no `<body>`).
- Google Analytics 4: etiqueta gtag `G-GLQKNHSCNW` en el `<head>` de las dos páginas.
- Bing Webmaster: `<meta name="msvalidate.01" content="533679B07f70B69C407E124DB9011B4A">` en el `<head>` de las dos páginas.
- Formato de las sesiones (confirmado por Milton): 10 min y 20 min son por LLAMADA TELEFÓNICA; solo la de 60 min es por ZOOM.

## TidyCal optimizado (2026-11-02, autorizado por Milton, hecho desde la vista lateral)
- 10 min (`10-minutos-con-milton-davila`): «Sesión express de 10 minutos con Milton Dávila»; primer párrafo: «Una llamada corta para contarme qué está frenando tu negocio y ver cómo puedo ayudarte.»
- 20 min (`20-minutos-con-milton`): «Sesión de preguntas de 20 minutos con Milton Dávila»; encabezado «Sesión de preguntas de 20 minutos»; párrafo sobre sistemas/CRM, automatización, IA, web y Google/ChatGPT.
- 60 min (`consulta-1-hora-con-milton`): «Sesión de estrategia de 60 minutos con Milton Dávila»; «revisamos tu operación, definimos qué construir y sales con pasos concretos».
- Los nombres de la página (URL) no se tocaron. Quedan sin tocar los otros 5 tipos de reserva.

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
