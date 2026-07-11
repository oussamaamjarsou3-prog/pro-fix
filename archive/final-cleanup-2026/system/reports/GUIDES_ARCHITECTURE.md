# CarSpecio — Guides System Architecture Report

**Date:** 20 Juin 2026  
**Status:** Awaiting Approval Before Implementation  
**Scope:** Full Guides subsystem (landing page + individual guide pages)

---

## 1. Executive Summary

New **scalable Guides system** following the exact same philosophy as existing Car Pages:

| Pattern | Cars (Existing) | Guides (Proposed) |
|---------|----------------|-------------------|
| Data | `system/data/*.json` | `system/data/guides/*.json` |
| Registry | `system/registry/car-registry.json` | `system/registry/guide-registry.json` |
| Template | `system/templates/car-template.html` | `system/templates/guide-template.html` |
| Generator | `system/generators/car-page-generator.js` | `system/generators/guide-generator.js` |
| Output | `html/[car].html` | `html/guias/[slug].html` + `html/guias/index.html` |
| Build | `node system/build.js` | Same — auto-included |

**Translation:** UI labels via `data-i18n` (locales). Guide editorial content supports `es`, `en`, `fr`, `ar` inside each JSON.

---

## 2. New Files

```
system/
  data/guides/                  # NEW — one JSON per guide
  registry/guide-registry.json  # NEW
  templates/guide-template.html # NEW
  templates/guide-index-template.html # NEW
  generators/guide-generator.js       # NEW
  generators/guide-index-generator.js # NEW
  schemas/guide-schema.json           # NEW
  validators/guide-validator.js       # NEW
css/guide-page.css                    # NEW
```

---

## 3. Guide JSON Schema

### 3.1 Example: `system/data/guides/cambiar-aceite.json`

```json
{
  "$schema": "../../schemas/guide-schema.json",
  "id": "cambiar-aceite",
  "slug": "cambiar-aceite",
  "category": "maintenance",
  "author": "CarSpecio Editorial",
  "publishedAt": "2026-06-15",
  "updatedAt": "2026-06-20",
  "heroImage": "../images/guides/cambiar-aceite-hero.jpg",
  "readingTime": 8,
  "difficulty": "beginner",
  "status": "active",
  "content": {
    "es": {
      "title": "Cuándo cambiar el aceite del coche",
      "excerpt": "Descubre cada cuánto hay que cambiar el aceite...",
      "intro": "El aceite es la sangre del motor...",
      "sections": [
        {
          "id": "frecuencia",
          "title": "¿Cada cuánto cambiar el aceite?",
          "content": "<p>La norma general es cada <strong>15.000 km o 1 año</strong>...</p>",
          "image": "../images/guides/aceite-frecuencia.jpg",
          "callout": { "type": "tip", "text": "Si usas aceite sintético de larga duración..." }
        }
      ],
      "faq": [
        { "question": "¿Puedo conducir con el aceite en el mínimo?", "answer": "No es recomendable..." }
      ],
      "seo": {
        "title": "Cuándo cambiar el aceite del coche | Guía CarSpecio",
        "description": "Descubre cada cuánto cambiar el aceite...",
        "keywords": ["cambiar aceite", "mantenimiento coche"]
      }
    },
    "en": {
      "title": "When to Change Your Car Oil",
      "excerpt": "Discover how often to change your oil...",
      "intro": "Oil is the lifeblood of your engine...",
      "sections": [
        {
          "id": "frecuencia",
          "title": "How often should you change your oil?",
          "content": "<p>The general rule is every <strong>15,000 km or 1 year</strong>...</p>",
          "image": "../images/guides/aceite-frecuencia.jpg",
          "callout": { "type": "tip", "text": "If you use long-life synthetic oil..." }
        }
      ],
      "faq": [
        { "question": "Can I drive with oil at the minimum level?", "answer": "It is not recommended..." }
      ],
      "seo": {
        "title": "When to Change Your Car Oil | CarSpecio Guide",
        "description": "Discover how often to change your oil...",
        "keywords": ["change oil", "car maintenance"]
      }
    },
    "fr": { ... },
    "ar": { ... }
  },
  "summaryBox": {
    "es": { "title": "Resumen rápido", "items": ["Intervalo: 15.000 km / 1 año", "Aceite: 5W-30", "Coste: 80-150 €"] },
    "en": { "title": "Quick Summary", "items": ["Interval: 15,000 km / 1 year", "Oil: 5W-30", "Cost: 80-150 €"] },
    "fr": { ... },
    "ar": { ... }
  },
  "tags": ["oil", "maintenance", "engine", "synthetic"],
  "relatedGuides": ["cambiar-frenos", "cambiar-bateria"],
  "relatedCars": ["audi-rs7-2026", "bmw-m5-2026"]
}
```

### 3.2 Validation Rules

| Field | Required | Constraints |
|-------|----------|-------------|
| `id`, `slug` | Yes | `^[a-z0-9-]+$` |
| `content` | Yes | Object with keys `es`, `en`, `fr`, `ar` |
| `content.{lang}.title` | Yes | 10-120 chars |
| `content.{lang}.excerpt` | Yes | 20-300 chars |
| `content.{lang}.sections` | Yes | Array, min 1, each needs `id`, `title`, `content` |
| `content.{lang}.seo` | Yes | `title`, `description`, `keywords` |
| `category` | Yes | Any non-empty string. Existence validated dynamically by `guide-validator.js` against `guide-registry.json` |
| `status` | Yes | `active` / `draft` / `archived` |
| `difficulty` | No | `beginner` / `intermediate` / `advanced` |
| `tags` | No | Array of strings. Used for auto-related-guides matching |
| `relatedGuides` | No | Manual override. If omitted, auto-generated by generator |
| `relatedCars` | No | Must reference valid `car-registry` IDs |

---

## 4. Guide Registry

### 4.1 `system/registry/guide-registry.json`

```json
{
  "version": "1.0.0",
  "lastUpdated": "2026-06-20",
  "baseUrl": "https://carspecio.com",
  "categories": [
    { "id": "car-buying", "icon": "🚗" },
    { "id": "maintenance", "icon": "🔧" },
    { "id": "breakdowns", "icon": "⚠️" },
    { "id": "fuel-consumption", "icon": "⛽" },
    { "id": "tires", "icon": "🛞" },
    { "id": "insurance", "icon": "🛡️" },
    { "id": "itv", "icon": "📋" },
    { "id": "taxation", "icon": "💶" },
    { "id": "electric-cars", "icon": "🔋" },
    { "id": "hybrid-cars", "icon": "⚡" },
    { "id": "driving", "icon": "🚦" },
    { "id": "seasonal", "icon": "❄️" }
  ],
  "guides": [
    {
      "id": "cambiar-aceite",
      "slug": "cambiar-aceite",
      "categoryId": "maintenance",
      "status": "active",
      "dataFile": "system/data/guides/cambiar-aceite.json",
      "htmlFile": "guias/cambiar-aceite.html",
      "featured": true,
      "order": 1
    }
  ]
}
```

**Registry responsibilities:**
- Categories master list (`id` + `icon` only; display names come from locales)
- Guide index (lightweight, `dataFile` points to full content)
- `status` controls build inclusion
- `order` controls display order within category
- `featured` highlights on landing page

---

## 5. Template Architecture

### 5.1 Inherited Components (from car-template.html)

```html
<!-- Shared: Header, Logo, Nav, Mega Menu, Country Selector, Language Selector, Footer -->
<!-- Zero duplication — copied verbatim or extracted to shared partials later -->
```

### 5.2 Guide-Specific Sections

```html
<!-- Breadcrumb -->
<nav class="guide-breadcrumb">
  <a href="index.html">Inicio</a> ›
  <a href="guias/index.html">Guias</a> ›
  <a href="guias/index.html#{{categorySlug}}">{{categoryName}}</a> ›
  <span>{{guideTitle}}</span>
</nav>

<!-- Hero -->
<section class="guide-hero" style="background-image: url('{{heroImage}}')">
  <span class="guide-category-badge">{{categoryName}}</span>
  <h1>{{guideTitle}}</h1>
  <p>{{author}} • {{publishedAt}} • {{readingTime}} min lectura</p>
</section>

<!-- Summary Box -->
<aside class="guide-summary-box"><h3>{{summaryTitle}}</h3><ul>{{summaryItems}}</ul></aside>

<!-- TOC -->
<nav class="guide-toc"><h4>Contenido</h4><ol>{{tocItems}}</ol></nav>

<!-- Content -->
<article class="guide-content">
  <div class="guide-intro">{{intro}}</div>
  {{#each sections}}
  <section id="{{id}}">
    <h2>{{title}}</h2>
    {{#if image}}<img src="{{image}}">{{/if}}
    <div>{{{content}}}</div>
    {{#if callout}}<div class="callout callout--{{type}}">{{text}}</div>{{/if}}
  </section>
  {{/each}}
</article>

<!-- FAQ -->
<section class="guide-faq"><h2>Preguntas frecuentes</h2><div class="faq-list">{{faqItems}}</div></section>

<!-- Related Guides -->
<section class="guide-related"><h2>Guias relacionadas</h2><div class="guide-cards">{{relatedGuideCards}}</div></section>

<!-- Related Cars -->
<section class="guide-related-cars"><h2>Coches relacionados</h2><div class="car-mini-cards">{{relatedCarCards}}</div></section>

<!-- CTA -->
<section class="guide-cta"><h2>Necesitas mas ayuda?</h2><a href="contacto.html" class="hero-btn">Contactar</a></section>
```

### 5.3 Template Engine

**No external engine.** Simple string replacement (same pattern as `car-page-generator.js`):

```js
const guideDataJson = JSON.stringify(guideData).replace(/</g, '\\u003c');
page = page.replace(/\{\{guideTitle\}\}/g, guideData.title);
page = page.replace(/\{\{categoryName\}\}/g, category.name);
// etc.
```

---

## 6. Generators

### 6.1 `system/generators/guide-generator.js`

**Inputs:** `guide-template.html`, `guide-registry.json`, `car-registry.json`, `data/guides/*.json`
**Output:** `html/guias/[slug].html`

**Algorithm:**
1. Load template
2. Load registries (guide + car)
3. Build `guideIndexMap` from all guide data (slug → tags, category, keywords)
4. Create `html/guias/` if missing
5. For each active guide:
   - Load full data from `dataFile`
   - Validate against schema
   - **Resolve related guides:**
     - If `relatedGuides` array exists and is non-empty → use it (manual override)
     - Else → auto-calculate:
       1. Same category: +3 points
       2. Shared tags: +2 points per tag
       3. Shared SEO keywords: +1 point per keyword
       4. Sort by score, pick top 3, exclude self
   - Resolve related cars (lookup in car-registry)
   - Generate TOC from `sections[].id + title`
   - Inject SEO (title, meta, OG, canonical, JSON-LD Article)
   - Inject `window.__preloadedGuideData`
   - Replace all `{{placeholders}}`
   - Write output
6. Log summary

### 6.2 `system/generators/guide-index-generator.js`

**Inputs:** `guide-registry.json`
**Output:** `html/guias/index.html`

**Generates:**
- Hero: "Guias CarSpecio"
- 12 category cards with icons
- Per-category guide cards (title, excerpt, readingTime, difficulty badge)
- Featured section (`featured: true`)

### 6.3 `system/generators/guide-search-index-generator.js`

**Recommendation:** Append to existing `js/search-index.js` with `type: 'guide'` discriminator. Avoids two search systems.

---

## 7. SEO Auto-Generation

| Element | Guide Page Source | Landing Page Value |
|---------|-------------------|-------------------|
| `<title>` | `seo.title` | `"Guias y consejos para coches | CarSpecio"` |
| `<meta description>` | `seo.description` | `"Descubre nuestras guias practicas..."` |
| `<link canonical>` | `carspecio.com/guias/{slug}.html` | `carspecio.com/guias/` |
| `og:type` | `"article"` | `"website"` |
| `og:image` | `heroImage` | Default brand image |
| **JSON-LD** | `Article` schema (author, datePublished, dateModified) | `WebSite` schema |

---

## 8. Translation Strategy

### 8.1 UI Text + Category Names → Locales

New keys in `system/locales/es.json`:

```json
{
  "guides": {
    "pageTitle": "Guías y consejos para coches",
    "heroTitle": "Guías CarSpecio",
    "readingTime": "{minutes} min lectura",
    "difficultyBeginner": "Fácil",
    "difficultyIntermediate": "Medio",
    "difficultyAdvanced": "Avanzado",
    "tocTitle": "Contenido",
    "faqTitle": "Preguntas frecuentes",
    "relatedGuidesTitle": "Guías relacionadas",
    "relatedCarsTitle": "Coches relacionados",
    "ctaTitle": "¿Necesitas más ayuda?",
    "ctaButton": "Contactar con CarSpecio",
    "categoriesTitle": "Categorías",
    "featuredTitle": "Guías destacadas",
    "categories": {
      "car-buying": "Compra de Coches",
      "maintenance": "Mantenimiento",
      "breakdowns": "Averías y Problemas",
      "fuel-consumption": "Combustible y Consumo",
      "tires": "Neumáticos",
      "insurance": "Seguros",
      "itv": "ITV",
      "taxation": "Fiscalidad",
      "electric-cars": "Coches Eléctricos",
      "hybrid-cars": "Coches Híbridos",
      "driving": "Conducción",
      "seasonal": "Invierno y Verano"
    }
  }
}
```

### 8.2 Editorial Content → Guide JSON

**Multi-language inside JSON.** All editorial content lives under `content.{lang}` keys (`es`, `en`, `fr`, `ar`). The generator reads the active language and injects the correct content block.

**Rationale:** Same translation architecture as car pages (locales for UI, data for content), but guide data itself supports all 4 languages natively.

---

## 9. Bidirectional Guide ↔ Car Relations

#### Guide → Car (already in guide JSON)
```json
"relatedCars": ["audi-rs7-2026", "bmw-m5-2026"]
```

#### Car → Guide (generated automatically)

During build, `car-page-generator.js` loads `guide-registry.json`, builds a reverse index:

```js
// Build reverse index: carId -> [guides]
const carToGuides = {};
guideRegistry.guides.forEach(guide => {
  const guideData = loadGuideData(guide);
  guideData.relatedCars?.forEach(carId => {
    if (!carToGuides[carId]) carToGuides[carId] = [];
    carToGuides[carId].push({
      id: guide.id,
      slug: guide.slug,
      title: guideData.content.es.title,
      category: guide.categoryId,
      excerpt: guideData.content.es.excerpt
    });
  });
});
```

Then inject into each car page template:
```html
<section class="car-related-guides">
  <h2 data-i18n="guides.relatedGuidesTitle">Guías relacionadas</h2>
  <div class="guide-mini-cards">{{relatedGuideCards}}</div>
</section>
```

**This requires a small modification to `system/generators/car-page-generator.js`.**

---

## 10. Build Integration

### 10.1 Updated `system/build.js`

```js
const generators = [
  // Existing
  { name: 'Car Page Generator', script: 'car-page-generator.js' },
  { name: 'Mega Menu Generator', script: 'mega-menu-generator.js' },
  { name: 'Compare Data Generator', script: 'compare-data-generator.js' },
  { name: 'Search Index Generator', script: 'search-index-generator.js' },
  { name: 'Sitemap Generator', script: 'sitemap-generator.js' },
  // NEW
  { name: 'Guide Generator', script: 'guide-generator.js' },
  { name: 'Guide Index Generator', script: 'guide-index-generator.js' }
];

const validators = [
  // Existing
  { name: 'Car Data Validator', script: 'car-validator.js' },
  { name: 'Car Registry Validator', script: 'registry-validator.js' },
  // NEW
  { name: 'Guide Data Validator', script: 'guide-validator.js' }
];
```

### 10.2 Updated `sitemap-generator.js`

Add after car pages:
```js
guideRegistry.guides.forEach(guide => {
  if (guide.status === 'active') {
    sitemapEntries.push({
      loc: `${BASE_URL}/${guide.htmlFile}`,
      lastmod: guide.updatedAt || new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.7
    });
  }
});
```

---

## 11. CSS Architecture

### 11.1 `css/guide-page.css`

Same dark theme, glass morphism, consistent spacing as `car-page.css`.

```css
.guide-hero { /* background image hero */ }
.guide-breadcrumb { /* breadcrumb nav */ }
.guide-toc { /* sticky sidebar, collapsible on mobile */ }
.guide-content { /* article body */ }
.guide-summary-box { /* highlight box */ }
.callout--tip { }
.callout--warning { }
.guide-related { /* related guide cards grid */ }
.guide-related-cars { /* mini car cards */ }
.guide-cta { }

/* Landing */
.guide-categories-grid { /* 12 category cards */ }
.guide-card { }
.guide-card--featured { }
```

### 11.2 Responsive

- **Desktop:** TOC sidebar sticky, 2-column layout
- **Tablet:** TOC collapsible, single column
- **Mobile:** TOC hidden (jump-to-section dropdown), full width

---

## 12. Compatibility

| Area | Impact |
|------|--------|
| Car pages | **Minor** — `car-page-generator.js` modified to inject "Related Guides" section |
| Compare page | **Zero** |
| Registry | **Zero** — new file only |
| Build | **Minimal** — append to arrays |
| CSS | **Zero** — new file, no existing changes |
| JS | **Minimal** — new search entries only |

**Shared assets reused:** `variables.css`, `mega-menu-base.css`, `mega-menu-full.css`, `mega-menu-data.js`, `mega-menu.js`, `i18n.js`, `script.js`.

---

## 13. Workflow: Adding a Guide

```bash
# 1. Create guide data
$ vim system/data/guides/nueva-guia.json

# 2. Add entry to registry
$ vim system/registry/guide-registry.json

# 3. Build
$ node system/build.js

# 4. Done — html/guias/nueva-guia.html auto-generated
```

**Everything auto-generated:** SEO, TOC, related guides, related cars, breadcrumb, FAQ, summary box.

---

## 14. Implementation Phases

### Phase 1: Core (Proposed)
- Schema + Registry (multilingual + category IDs only)
- Locales updates (category names + UI keys for all 4 languages)
- Template (guide + landing)
- Generator (guide + index)
- CSS
- 3 sample guides (cambiar-aceite, cambiar-frenos, cambiar-bateria)
- Build integration
- Sitemap + Search Index updates
- Guide validator
- **Bidirectional links** (update `car-page-generator.js` to inject Related Guides)

### Phase 2: Future Enhancements
- Guide ratings/comments
- PDF export
- Reading progress bar
- Share buttons per section

### Phase 3: Scale
- Author profiles
- Guide series (multi-part)
- Video embeds
- Interactive diagrams

---

## 15. Open Questions

| # | Question | Recommendation |
|---|----------|-----------------|
| 1 | Registry folder: `registry/` (existing) or `registries/` (request)? | Use `registry/` for consistency |
| 2 | Search index: append or separate file? | Append with `type: 'guide'` |
| 3 | Landing template: separate file or inline? | Separate file |
| 4 | Related cars: lookup at build time or cache? | Build-time lookup (same as cars) |
| 5 | Landing cards: excerpt or title only? | Excerpt + readingTime + difficulty |
| 6 | Hero image required? | Optional — fallback CSS gradient |
| 7 | Section images required? | Optional — skip if missing |

---

## 16. Estimates

| File | Lines |
|------|-------|
| `guide-schema.json` | ~120 |
| `guide-registry.json` | ~80 + N*15 |
| `guide-template.html` | ~350 |
| `guide-index-template.html` | ~180 |
| `guide-generator.js` | ~180 |
| `guide-index-generator.js` | ~130 |
| `guide-page.css` | ~350 |
| `guide-validator.js` | ~70 |
| **Total** | **~1,460 lines** |

---

## 17. Scalability Verification

### Adding a New Category in the Future

**Required changes:**
1. Add category entry to `system/registry/guide-registry.json` (just `id` + `icon`)
2. Add category name to `system/locales/{es,en,fr,ar}.json` under `guides.categories.{newId}`
3. Create guide JSON files using the new `category` value

**Files NOT touched:**
- `system/schemas/guide-schema.json` — no enum to update
- `system/generators/guide-generator.js` — reads categories dynamically from registry
- `system/generators/guide-index-generator.js` — loops registry categories dynamically
- `system/templates/guide-template.html` — injects category name via locale lookup
- `system/validators/guide-validator.js` — validates against live registry, not hardcoded list

**Result:** Adding a category is a registry + locale + data task. No code changes.

---

## 18. Final Impact Report

### Files Created (NEW)

| File | Lines | Purpose |
|------|-------|---------|
| `system/schemas/guide-schema.json` | ~130 | JSON Schema (no hardcoded category enum) |
| `system/registry/guide-registry.json` | ~60 + N*15 | Lightweight index |
| `system/templates/guide-template.html` | ~380 | Reusable guide page |
| `system/templates/guide-index-template.html` | ~200 | Landing page (`/guias/`) |
| `system/generators/guide-generator.js` | ~220 | Per-guide page builder |
| `system/generators/guide-index-generator.js` | ~140 | Landing page builder |
| `system/validators/guide-validator.js` | ~80 | Schema + registry validation |
| `css/guide-page.css` | ~380 | Guide-specific styles |
| `system/data/guides/cambiar-aceite.json` | ~100 | Sample guide data |
| `system/data/guides/cambiar-frenos.json` | ~80 | Sample guide data |
| `system/data/guides/cambiar-bateria.json` | ~80 | Sample guide data |
| **Total new** | **~1,870** | — |

### Files Modified (EXISTING)

| File | Change | Risk |
|------|--------|------|
| `system/build.js` | Append 2 generators + 1 validator to arrays | Zero — additive only |
| `system/generators/sitemap-generator.js` | Add guide loop after car loop | Low — isolated addition |
| `system/generators/search-index-generator.js` | Append guide entries with `type: 'guide'` | Low — isolated addition |
| `system/generators/car-page-generator.js` | Inject "Related Guides" section + reverse index | **Medium** — touches existing car pages |
| `system/locales/es.json` | Add `guides` namespace + `guides.categories` | Low — new keys only |
| `system/locales/en.json` | Add `guides` namespace + `guides.categories` | Low — new keys only |
| `system/locales/fr.json` | Add `guides` namespace + `guides.categories` | Low — new keys only |
| `system/locales/ar.json` | Add `guides` namespace + `guides.categories` | Low — new keys only |

### Files Untouched (NO CHANGE)

| File | Reason |
|------|--------|
| `html/index.html` | No references to guides needed |
| `html/compare.html` | Independent page |
| `html/contacto.html` | Independent page |
| `html/reviews.html` | Independent page |
| `html/diagnostico.html` | Independent page |
| `html/herramientas.html` | Independent page |
| `html/article.html` | Independent page |
| `css/variables.css` | Shared, no guide-specific variables needed |
| `css/car-page.css` | Car pages only |
| `css/home.css` | Homepage only |
| `css/compare.css` | Compare page only |
| `js/mega-menu-data.js` | Shared data, no changes |
| `js/mega-menu.js` | Shared component, no changes |
| `js/i18n.js` | Supports dynamic keys, no structural change |
| `js/script.js` | Shared, no changes |
| `system/registry/car-registry.json` | Read-only reference |
| `system/schemas/master-car-schema.json` | Unrelated |
| `system/templates/car-template.html` | Read-only reference for copying shared components |
| `system/validators/car-validator.js` | Unrelated |
| `system/validators/registry-validator.js` | Validates car registry only |

### Rollback Plan

If implementation needs to be reverted:

1. **Remove new files:** Delete all files in "Files Created" list
2. **Revert modified files:** Use git to restore `build.js`, `sitemap-generator.js`, `search-index-generator.js`, `car-page-generator.js`, and all 4 locale files
3. **Delete generated output:** Remove `html/guias/` directory
4. **Test:** Run `node system/build.js` and verify car pages still build correctly

**Estimated rollback time:** < 5 minutes with git. < 15 minutes manual.

---

## 19. Final Schema — `system/schemas/guide-schema.json`

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://carspecio.com/schemas/guide-schema.json",
  "title": "Guide Data Schema",
  "description": "Schema for CarSpecio guide content files",
  "type": "object",
  "required": ["id", "slug", "category", "author", "publishedAt", "updatedAt", "status", "content"],
  "properties": {
    "id": {
      "type": "string",
      "pattern": "^[a-z0-9-]+$"
    },
    "slug": {
      "type": "string",
      "pattern": "^[a-z0-9-]+$"
    },
    "category": {
      "type": "string",
      "minLength": 1
    },
    "author": { "type": "string", "minLength": 1 },
    "publishedAt": { "type": "string", "format": "date" },
    "updatedAt": { "type": "string", "format": "date" },
    "heroImage": { "type": "string" },
    "readingTime": { "type": "integer", "minimum": 1, "maximum": 120 },
    "difficulty": {
      "type": "string",
      "enum": ["beginner", "intermediate", "advanced"]
    },
    "status": {
      "type": "string",
      "enum": ["active", "draft", "archived"]
    },
    "content": {
      "type": "object",
      "required": ["es", "en", "fr", "ar"],
      "properties": {
        "es": { "$ref": "#/definitions/langContent" },
        "en": { "$ref": "#/definitions/langContent" },
        "fr": { "$ref": "#/definitions/langContent" },
        "ar": { "$ref": "#/definitions/langContent" }
      }
    },
    "summaryBox": {
      "type": "object",
      "properties": {
        "es": { "$ref": "#/definitions/langSummary" },
        "en": { "$ref": "#/definitions/langSummary" },
        "fr": { "$ref": "#/definitions/langSummary" },
        "ar": { "$ref": "#/definitions/langSummary" }
      }
    },
    "tags": {
      "type": "array",
      "items": { "type": "string", "minLength": 1 }
    },
    "relatedGuides": {
      "type": "array",
      "items": { "type": "string", "pattern": "^[a-z0-9-]+$" }
    },
    "relatedCars": {
      "type": "array",
      "items": { "type": "string", "pattern": "^[a-z0-9-]+$" }
    }
  },
  "definitions": {
    "langContent": {
      "type": "object",
      "required": ["title", "excerpt", "intro", "sections", "seo"],
      "properties": {
        "title": { "type": "string", "minLength": 10, "maxLength": 120 },
        "excerpt": { "type": "string", "minLength": 20, "maxLength": 300 },
        "intro": { "type": "string", "minLength": 1 },
        "sections": {
          "type": "array",
          "minItems": 1,
          "items": {
            "type": "object",
            "required": ["id", "title", "content"],
            "properties": {
              "id": { "type": "string", "pattern": "^[a-z0-9-]+$" },
              "title": { "type": "string" },
              "content": { "type": "string" },
              "image": { "type": "string" },
              "callout": {
                "type": "object",
                "properties": {
                  "type": { "type": "string", "enum": ["tip", "warning", "note"] },
                  "text": { "type": "string" }
                }
              }
            }
          }
        },
        "faq": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["question", "answer"],
            "properties": {
              "question": { "type": "string" },
              "answer": { "type": "string" }
            }
          }
        },
        "seo": {
          "type": "object",
          "required": ["title", "description", "keywords"],
          "properties": {
            "title": { "type": "string" },
            "description": { "type": "string" },
            "keywords": { "type": "array", "items": { "type": "string" } }
          }
        }
      }
    },
    "langSummary": {
      "type": "object",
      "required": ["title", "items"],
      "properties": {
        "title": { "type": "string" },
        "items": {
          "type": "array",
          "items": { "type": "string" }
        }
      }
    }
  }
}
```

---

## 20. Approval Checklist

- [x] Architecture approved
- [x] Schema approved (multilingual: es/en/fr/ar, no hardcoded categories)
- [x] 12 categories approved (English IDs, names in locales)
- [x] Translation strategy approved (UI in locales, content in JSON with 4 languages)
- [x] Bidirectional relations approved (Guide→Car + Car→Guide)
- [x] Auto-related-guides approved (category + tags + keywords scoring)
- [x] Scalability verified (new category = registry + locale + data only)
- [x] Impact report approved (files created, modified, untouched, rollback)
- [x] Ready for Phase 1 implementation
