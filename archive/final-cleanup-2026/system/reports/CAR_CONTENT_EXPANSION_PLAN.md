# CarSpecio Car Content Architecture Expansion Plan

**Scope:** `car-template.html`, `car-page-generator.js`, `master-car-schema.json`, all 6 car JSONs  
**Goal:** Transform car pages from spec sheets into complete automotive knowledge pages  
**Status:** Audit-only; no files modified

---

## 1. Current Sections Inventory

### 1.1 Template Sections (`car-template.html`)

| # | Section ID | Status | Data Source | Render Method |
|---|-----------|--------|-------------|---------------|
| 1 | `car-hero` | Active | `basicInfo` + `images.hero` | Generator replaces `background-image` |
| 2 | `quick-info` | Active | `performance` + `countryPricing` | `car-renderer.js` |
| 3 | `specs` | Active | `specs.*` | `car-renderer.js` |
| 4 | `gallery` | **Empty shell** | `images.gallery` — missing from all JSONs | No renderer function |
| 5 | `price-section` | Active | `pricing` + `countryPricing` | `country-manager.js` |
| 6 | `cost-calculator` | Active | `fuelEconomy.drivingStyles` | Inline JS |
| 7 | `depreciation` | Active | `countryPricing.depAnnual` | `country-manager.js` |
| 8 | `versions` | Active | `versions[]` | `car-renderer.js` |
| 9 | `options` | Active | `options[]` | Partial — table body empty |
| 10 | `timeline` | Active | `content.timeline` + `pageText.timeline` | `car-renderer.js` |
| 11 | `pros-cons` | **Empty 5/6** | `pageText.pros/cons` | `car-renderer.js` |
| 12 | `rating` | **Empty 5/6** | `rating` object | `car-renderer.js` |
| 13 | `problems` | Active | `problems[]` | `car-renderer.js` |
| 14 | `rival-comparison` | Active | `comparisons[]` | Static + JS |
| 15 | `quiz` | Active | `comparisons[]` | Static + JS |
| 16 | `used-guide` | **Empty 5/6** | `pageText.usedGuide` | `car-renderer.js` |
| 17 | `faq` | **Empty 5/6** | `pageText.faq` | `car-renderer.js` |
| 18 | `related-guides` | Active 5/6 | Guide registry lookup | Generator |

**Active = renders real data for at least one car (rs7)**  
**Empty = template exists but no data populates it for most cars**

### 1.2 Schema vs Reality Delta

The `master-car-schema.json` defines ~120 properties. Only ~35 are used by the renderer.

| Schema Section | Used? | In Data? |
|----------------|-------|----------|
| `specs.suspension` | No | Yes (all 6) |
| `specs.brakes` | No | Yes (all 6) |
| `specs.steering` | No | Yes (all 6) |
| `specs.wheels` | No | Yes (all 6) |
| `specs.electrical` | No | No |
| `performance.powerToWeight` | No | No |
| `performance.braking` | No | No |
| `performance.handling` | No | No |
| `dimensions.cargoCapacity` | No | No |
| `dimensions.fuelTank` | No | No |
| `fuelEconomy.range` | No | No |
| `fuelEconomy.emissions` | No | No |
| `fuelEconomy.electric` | No | No |
| `features.*` (5 categories) | No | No |
| `safety.*` (ratings, airbags, ADAS) | No | No |
| `images.gallery` | No | No |
| `images.thumbnails` | No | No |
| `content.review` | No | No |
| `comparisons` | Yes | 1/6 |
| `relatedModels` | No | No |
| `rating` | Yes | 1/6 |
| `metadata` | No | No |

---

## 2. Missing Automotive Content Sections

Cross-referenced against Car and Driver, Edmunds, MotorTrend, What Car?, Auto Express:

| Section | Present? | Competitive Standard |
|---------|----------|---------------------|
| Engine deep-dive narrative | Partial | Yes — all sites |
| Driving experience / dynamics | **Missing** | Yes — all sites |
| Interior quality & design deep-dive | Partial | Yes — all sites |
| Exterior design analysis | **Missing** | Yes — all sites |
| Technology & infotainment deep-dive | **Missing** | Yes — all sites |
| Safety ratings (NCAP, IIHS) | **Missing** | Yes — all sites |
| Driver assistance systems list | **Missing** | Yes — all sites |
| CO2 emissions & environmental | **Missing** | Partial |
| Cargo space / practicality | **Missing** | Yes — all sites |
| Reliability score / verdict | **Missing** | Yes |
| Target buyer profile | **Missing** | Partial |
| Buying recommendation / verdict | **Missing** | Yes |
| Model history / generations | **Missing** | Partial |
| Full review text | **Missing** | Yes |
| Video embed | **Missing** | Partial |
| Color options | **Missing** | Yes |
| Warranty information | **Missing** | Yes |
| Real owner reviews / quotes | **Missing** | Yes |

---

## 3. Recommended New Schema Fields

### 3.1 P1 — Must-Have

#### `content.review` (structured)
```json
"content": {
  "review": {
    "summary": "string (2-3 sentence verdict)",
    "fullText": "string (long-form)",
    "verdict": "string (buy/don't buy/consider)",
    "bestFor": ["string (profile keys)"],
    "scoreBreakdown": {
      "performance": "number",
      "comfort": "number",
      "practicality": "number",
      "runningCosts": "number",
      "reliability": "number"
    }
  }
}
```
**Multilingual:** via `pageText.review.{lang}`  
**Migration:** Existing `content.review` string -> `.summary`. Backward-compatible.  
**Renderer:** `renderReview()` — new section.

---

#### `drivingExperience` (new top-level)
```json
"drivingExperience": {
  "handling": {
    "summary": "string",
    "steeringFeel": "string",
    "bodyRoll": "string",
    "gripLevels": "string",
    "rideQuality": "string"
  },
  "performanceFeel": {
    "acceleration": "string",
    "braking": "string",
    "sound": "string",
    "transmission": "string"
  },
  "dailyDriving": {
    "comfort": "string",
    "visibility": "string",
    "parking": "string",
    "motorway": "string"
  }
}
```
**Multilingual:** via `pageText.drivingExperience.{lang}`  
**Renderer:** `renderDrivingExperience()` — collapses if absent.

---

#### `interior` (structured, replaces ad-hoc `interiorCards`)
```json
"interior": {
  "qualityRating": "number (1-10)",
  "spaceRating": "number (1-10)",
  "infotainmentRating": "number (1-10)",
  "summary": "string",
  "frontSeats": { "comfort": "string", "adjustment": "string", "material": "string" },
  "rearSeats": { "legroom": "string", "headroom": "string", "comfort": "string" },
  "boot": {
    "capacity": "number (L)",
    "seatsDownCapacity": "number (L)",
    "practicality": "string"
  },
  "infotainment": {
    "screenSize": "string",
    "system": "string",
    "connectivity": ["string"],
    "soundSystem": "string"
  },
  "cards": [ { "id": "string", "icon": "string", "category": "string" } ]
}
```
**Migration:** `interiorCards[]` + `interiorText{}` -> `interior.cards` + `interior.{lang}`.  
**Renderer:** `renderInterior()` replaces existing grid logic.

---

#### `safety` (populate existing schema)
Schema already defines full `safety` object with `ratings`, `airbags`, `driverAssist`, `structural`. Zero cars use it.  
**Action:** Populate data + build `renderSafety()` with NCAP stars visual and ADAS checklist.

---

#### `exteriorDesign` (new top-level)
```json
"exteriorDesign": {
  "summary": "string",
  "stylingNotes": ["string"],
  "aerodynamics": { "dragCoefficient": "number", "activeAero": "boolean" },
  "lighting": { "headlights": "string", "taillights": "string", "signature": "string" },
  "wheels": { "standard": "string", "optional": ["string"] },
  "colors": [ { "name": "string", "hex": "string", "type": "string", "priceExtra": "number" } ]
}
```
**Multilingual:** via `pageText.exteriorDesign.{lang}`  
**Renderer:** `renderExteriorDesign()`.

---

#### `relatedCars` (template section)
Schema already has `relatedModels[]`. No template section exists.  
**Action:** Add `<section id="related-cars">` + `renderRelatedCars()` pulling from registry.

---

#### `gallery` (populate existing schema)
Schema already has `images.gallery[]`. No data, no renderer.  
**Action:** Populate `images.gallery` in JSONs + build `renderGallery()` with masonry/carousel.

---

### 3.2 P2 — Valuable

#### `technology`
```json
"technology": {
  "headUnit": { "screenSize": "string", "system": "string", "wirelessCarPlay": "boolean" },
  "connectivity": ["string"],
  "audio": { "system": "string", "speakers": "number", "watts": "number" },
  "driverDisplays": { "instrumentCluster": "string", "headUpDisplay": "boolean" }
}
```

#### `runningCosts`
```json
"runningCosts": {
  "insuranceGroups": { "es": "string", "uk": "string" },
  "roadTax": { "es": { "value": "number", "currency": "string", "note": "string" } },
  "servicing": { "intervalKm": "number", "costMinor": {}, "costMajor": {} },
  "tyres": { "front": { "size": "string", "costPerTyre": {} }, "rear": {} },
  "warranty": { "years": "number", "km": "number" }
}
```

#### `modelHistory`
```json
"modelHistory": {
  "generations": [ { "generation": "string", "years": "string", "notable": "string", "image": "string" } ],
  "evolution": "string"
}
```

#### `video`
```json
"video": {
  "reviewVideo": { "youtubeId": "string", "title": "string" },
  "walkaroundVideo": { "youtubeId": "string", "title": "string" }
}
```

#### `ownership`
```json
"ownership": {
  "ownerReviews": [ { "quote": "string", "author": "string", "location": "string", "rating": "number" } ],
  "commonIssues": [ { "issue": "string", "frequency": "string", "cost": "string" } ],
  "satisfactionRating": "number"
}
```

### 3.3 P3 — Future

| Field | Purpose |
|-------|---------|
| `charging` (EV/HEV) | Electric charging specs |
| `autonomy` | Self-driving capabilities |
| `recalls` | Safety recall history |
| `resaleData` | Actual market resale values |
| `competitorSpecs` | Side-by-side spec table |
| `fleetData` | Company car costs |
| `motorsport` | Racing pedigree |
| `awards` | Industry awards |

---

## 4. Scalability Analysis

### 4.1 Current Bottlenecks

| Bottleneck | Current | Breaks At |
|------------|---------|-----------|
| Inline `__preloadedCarData` | rs7 = ~48 KB per HTML | Storage bloat at 500+ cars |
| HTML file size | ~47 KB per car | Acceptable to ~1,000 |
| Generator | Single-pass string replacement | Linear — OK to 1,000 |
| Renderer | All methods in one file | Maintainability at ~500 |
| Image assets | Hero + placeholder only | Storage cost at scale |

### 4.2 Scaling Strategies

**100+ cars:** No changes needed. Add lazy-loading for below-fold.

**500+ cars:**
1. Remove inline `__preloadedCarData` — fetch JSON client-side with service worker cache.
2. Section-level lazy loading via `IntersectionObserver`.
3. Image pipeline: 3 breakpoints (800w / 1200w / 1920w) with `srcset`.
4. Build-time validation: `ajv` against schema for every car.

**1000+ cars:**
1. Move from static generation to on-demand rendering (EJS/Nunjucks at request time).
2. Database layer (SQLite local, PostgreSQL production).
3. CDN edge caching.
4. Proper search index (Lunr.js or Algolia).

### 4.3 Schema Stability Contract

Establish `SECTION_RENDERERS` registry:

```javascript
const SECTION_RENDERERS = {
  'engine': renderEngine,
  'interior': renderInterior,
  'safety': renderSafety,
  'driving-experience': renderDrivingExperience,
  'exterior-design': renderExteriorDesign,
  'technology': renderTechnology,
  'gallery': renderGallery,
  'related-cars': renderRelatedCars,
  'review': renderReview,
};
// Signature: function renderSection(carData, container, lang) -> void
// If carData.sectionKey absent, returns early (no-op).
```

**Rule:** New sections register in `SECTION_RENDERERS`. No existing code changes.

---

## 5. Migration Strategy

### 5.1 Guiding Principles

1. Backward compatibility — partial data cars keep working.
2. Opt-in rendering — new sections only appear when data exists.
3. Incremental adoption — cars upgraded one at a time.
4. Optional fields only — no breaking schema changes.

### 5.2 Phase-by-Phase

#### Phase 1: Foundation (No data changes)
| Step | Action | Risk |
|------|--------|------|
| 1.1 | Add template sections with `hidden` or comment placeholders | None |
| 1.2 | Add renderer methods with early-return guards | None |
| 1.3 | Update schema with new optional fields | None |
| 1.4 | Add `SECTION_RENDERERS` registry | Low |

#### Phase 2: rs7 Pilot
| Step | Action |
|------|--------|
| 2.1 | Populate `rs7-2026.json` with all P1 fields |
| 2.2 | Generate, verify, Lighthouse test |
| 2.3 | Document field population guide |

#### Phase 3: Batch Population (5 remaining cars)
| Step | Action |
|------|--------|
| 3.1 | Populate `pageText` for all 5 cars |
| 3.2 | Add hero images for all 5 cars |
| 3.3 | Populate `safety`, `interior`, `drivingExperience` |
| 3.4 | Generate all, run test suite |

#### Phase 4: New Cars (Scalable)
| Step | Action |
|------|--------|
| 4.1 | Car entry template with P1 required checklist |
| 4.2 | Validation script for data completeness |
| 4.3 | Require `pageText.es` + `rating` + `heroImage` before `active` |
| 4.4 | Add cars using complete template |

### 5.3 Graceful Degradation Rules

Every new renderer must implement:

```javascript
function renderSection(carData, container, lang) {
  // Rule 1: Hide section if data missing
  if (!carData.sectionKey) { container.hidden = true; return; }

  // Rule 2: Use language fallback
  const data = carData.sectionKey[lang] || carData.sectionKey['es'] || {};

  // Rule 3: Default text for missing sub-fields
  const title = data.title || t('sections.defaultTitle', lang);

  // Rule 4: Never throw
  try { /* render */ } catch (e) {
    console.warn(`[Renderer] ${sectionName} failed:`, e);
    container.innerHTML = `<p class="render-error">${t('errors.renderFailed', lang)}</p>`;
  }
}
```

### 5.4 Field Remapping

| Old Path | New Path | Migration |
|----------|----------|-----------|
| `interiorCards[]` | `interior.cards[]` | Copy array; add new fields |
| `interiorText.{lang}` | `interior.{lang}.cards` | Remap keys |
| `content.pros[]` | `content.review.pros[]` | Move; keep backward compat |
| `content.cons[]` | `content.review.cons[]` | Move; keep backward compat |
| `problems[]` (strings) | `problems[]` (objects) | Renderer supports both |
| `dimensions.weight` (rs3) | `dimensions.curbWeight` | Rename in rs3 JSON |

---

## 6. Priority Ranking

### P1 — Must-Have

| # | Section | Why | Effort | Depends On |
|---|---------|-----|--------|------------|
| 1 | `pageText` for all cars | 5/6 cars have empty Pros/Cons/FAQ/Timeline | High | Content writing |
| 2 | Hero images for all cars | 5/6 show placeholder.svg | Medium | Image sourcing |
| 3 | `content.review` | No buying recommendation | Medium | Content writing |
| 4 | `drivingExperience` | No driving dynamics | Medium | Content writing |
| 5 | `interior` (structured) | No depth beyond rs7 | Medium | Content + schema |
| 6 | `safety` | Schema exists, zero data | Medium | Data research |
| 7 | `relatedCars` | No cross-linking | Low | Template + renderer |
| 8 | `gallery` | Empty shell on all pages | Low | Images + renderer |
| 9 | `rating` for all cars | Score bars at 0% on 5/6 | Low | Data entry |
| 10 | `exteriorDesign` | No design analysis | Medium | Content writing |

### P2 — Valuable

| # | Section | Why | Effort |
|---|---------|-----|--------|
| 11 | `technology` | Infotainment is key differentiator | Medium |
| 12 | `runningCosts` | Beyond calculator: insurance, tyres, warranty | Medium |
| 13 | `modelHistory` | Enthusiast depth, SEO long-tail | Medium |
| 14 | `video` | Engagement, time-on-page | Low |
| 15 | `ownership` | Real quotes, trust building | Medium |
| 16 | `content.timeline` for all cars | Maintenance schedules empty 5/6 | Low |
| 17 | `comparisons` for all cars | Only rs7 has rivals | Low |
| 18 | `dimensions.cargoCapacity` | Practicality is buyer concern | Low |
| 19 | `fuelEconomy.emissions` | Environmental awareness | Low |
| 20 | `features.*` (exterior/interior/tech/comfort/performance) | Option differentiator | High |

### P3 — Future

| # | Section | Why | Effort |
|---|---------|-----|--------|
| 21 | `charging` (EV/HEV) | Future-proof for electric | Low |
| 22 | `autonomy` | Self-driving marketing angle | Medium |
| 23 | `recalls` | Trust/transparency | Medium |
| 24 | `resaleData` | Real market data integration | High |
| 25 | `competitorSpecs` | Side-by-side tables | High |
| 26 | `fleetData` | B2B fleet sales | Medium |
| 27 | `motorsport` | Brand heritage content | Low |
| 28 | `awards` | Social proof | Low |
| 29 | `metadata` | Audit trail, content governance | Low |
| 30 | `regionalVariants` | Market-specific differences | Medium |

---

## Appendix: Reference Files

| File | Role |
|------|------|
| `system/templates/car-template.html` | Source template with 18 sections |
| `system/generators/car-page-generator.js` | Builds static HTML per car |
| `js/car-renderer.js` | Client-side data population (~35 fields used) |
| `system/schemas/master-car-schema.json` | Full schema (~120 properties) |
| `system/data/rs7-2026.json` | Reference-quality complete car |
| `system/data/*-2026.json` (x5) | Partial data cars |
