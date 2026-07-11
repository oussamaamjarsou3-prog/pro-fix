# Sistema de Noticias — Guía de Arquitectura

## Estructura de archivos

```
pro-fix/
├── system/
│   ├── data/
│   │   └── noticias/                    ← 1. AQUÍ CREAS EL JSON
│   │       ├── audi-rs3-competition-limited-2026.json
│   │       ├── audi-rs7-performance-2026.json
│   │       ├── bmw-m5-phev-record.json
│   │       └── ... (7 archivos)
│   └── generators/
│       ├── news-index-generator.js      ← 2. Genera el índice
│       └── news-article-generator.js    ← 3. Genera las páginas HTML
│
├── js/
│   ├── news-index.js                    ← Auto-generado (NO editar)
│   └── news-dynamic.js                  ← Renderer dinámico
│
├── html/
│   ├── js/
│   │   ├── news-index.js                ← Copia para el servidor
│   │   └── news-dynamic.js              ← Copia para el servidor
│   ├── noticias.html                    ← Página listing (dinámica)
│   └── noticias/
│       ├── audi-rs3-competition-limited-2026.html  ← Auto-generado
│       ├── audi-rs7-performance-2026.html
│       └── ... (7 páginas)
```

## Flujo para añadir una noticia nueva

### Paso 1 — Crear el JSON

Crea un archivo en `system/data/noticias/tu-noticia.json` con esta estructura:

```json
{
    "id": "tu-noticia",
    "slug": "tu-noticia",
    "source": "autocar",
    "category": "lanzamientos",
    "date": "2026-07-01",
    "readingTime": 5,
    "image": "../images/ruta-a-imagen.png",
    "tags": ["marca", "modelo", "tag3"],
    "relatedCars": [
        { "slug": "modelo", "name": "Nombre Modelo", "image": "../images/..." }
    ],
    "relatedNews": ["otra-noticia-1", "otra-noticia-2"],
    "translations": {
        "es": { "title": "...", "subtitle": "...", "excerpt": "...", "sections": [...], ... },
        "en": { ... },
        "fr": { ... },
        "ar": { ... }
    }
}
```

### Campos del JSON

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | string | Identificador único |
| `slug` | string | URL slug (igual que id normalmente) |
| `source` | string | Fuente de la noticia (autocar, autoblog, etc.) |
| `category` | string | Categoría: lanzamientos, rendimiento, eléctricos, tecnología |
| `date` | string | Fecha en formato YYYY-MM-DD |
| `readingTime` | number | Minutos de lectura |
| `image` | string | Ruta de imagen (usar `../images/...`) |
| `tags` | array | Tags de la noticia |
| `relatedCars` | array | Coches relacionados con slug, name, image |
| `relatedNews` | array | Slugs de noticias relacionadas |
| `translations` | object | Traducciones en es, en, fr, ar |

### Campos de cada traducción

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `title` | string | Título del artículo |
| `subtitle` | string | Subtítulo |
| `excerpt` | string | Resumen corto (para la card) |
| `imageCaption` | string | Caption de la imagen principal |
| `sections` | array | Secciones del artículo (id, heading, paragraphs) |
| `inBrief` | array | Lista de puntos clave |
| `previousModel` | object | Modelo anterior (name, year, summary) |
| `whatChanged` | array | Cambios (title, text) |
| `newTechnology` | array | Párrafos de tecnología |
| `marketContext` | string | Contexto de mercado |
| `pricing` | object | Precio (price, market, availability, note) |
| `prosCons` | object | Pros y contras (pros[], cons[]) |
| `opinion` | string | Opinión de CarSpecio |
| `stats` | array | Estadísticas (value, label) |
| `timeline` | array | Hitos (date, title, desc) |
| `keyFact` | string | Dato clave |
| `quote` | object | Cita (text, cite) |

### Paso 2 — Ejecutar los generadores

```bash
node system/generators/news-index-generator.js
node system/generators/news-article-generator.js
```

Esto hace automáticamente:
- `news-index-generator.js` → Lee todos los JSONs y genera `js/news-index.js` + `html/js/news-index.js`
- `news-article-generator.js` → Genera `html/noticias/tu-noticia.html` (página completa)

### Paso 3 — Listo

La noticia aparece automáticamente en `noticias.html`. No necesitas tocar `noticias.html` nunca.

## Qué hace cada componente

- **`noticias.html`** — Solo tiene `<div class="news-grid" data-dynamic="news-grid"></div>`. Las cards se renderizan vía JS.
- **`news-dynamic.js`** — Lee `CARSPECIO_NEWS_INDEX`, renderiza las cards, maneja filtros y multi-idioma.
- **`news-index.js`** — Array JS con datos ligeros de cada noticia. **Auto-generado, no editar.**
- **`news-article-generator.js`** — Genera el HTML completo de cada página desde el JSON.

## Reglas importantes

- **Nunca edites** `js/news-index.js` o `html/js/news-index.js` manualmente — se sobreescriben
- **Nunca edites** `html/noticias/*.html` manualmente — se sobreescriben al regenerar
- **Solo edita** los JSONs en `system/data/noticias/`
- Si cambias un JSON, ejecuta ambos generadores para actualizar todo
- Las imágenes deben estar en `images/` con ruta `../images/...` en el JSON

## Fuentes soportadas

| source key | Icono | Nombre |
|-----------|-------|--------|
| autocar | 🇬🇧 | Autocar |
| car-and-driver | 🇺🇸 | Car and Driver |
| motor-trend | 🇺🇸 | Motor Trend |
| motor1 | 🌍 | Motor1.com |
| autoblog | 🇺🇸 | Autoblog |
| audi-media-center | 🇩🇪 | Audi Media Center |
| top-gear | 🇬🇧 | Top Gear |
| auto-express | 🇬🇧 | Auto Express |
| carsguide | 🇦🇺 | CarsGuide |
| carbuzz | 🇺🇸 | CarBuzz |
