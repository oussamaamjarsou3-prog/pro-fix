# Multilingual Architecture Audit — Phase 4A/4B New Sections

**Scope:** review, drivingExperience, exteriorDesign, interior, technology, safety, runningCosts, ownership  
**Constraint:** No code changes performed; audit only.  
**Date:** June 2026

---

## 1. Current JSON Structure

All eight new sections are defined in `master-car-schema.json` as **flat objects with string properties**. Example:

```json
"review": {
    "summary": "string",
    "fullText": "string",
    "verdict": "string"
}
```

There is **no language-key indirection**. The schema does not define `review.es.summary`, `review.en.summary`, etc. The current RS7 data follows this flat structure and contains Spanish text at the top level.

**Verdict:** JSON is **not** multilingual-ready.

---

## 2. Renderer Behavior

`car-renderer-registry.js` reads narrative text directly from the car data object:

```javascript
// review renderer
const r = carData.review;
if (r.fullText) html += '<p>' + r.fullText + '</p>';

// drivingExperience renderer
const d = carData.drivingExperience;
if (d.handling.summary) html += '<p>' + d.handling.summary + '</p>';
```

- No `lang` parameter is accepted.
- No fallback logic (`carData.review?.[lang] || carData.review?.['es']`).
- `renderSections()` is called **once** inside `loadCarData()` during initial page load.

**Verdict:** Renderer is **not** multilingual-ready.

---

## 3. Language Switching Behavior

`i18n.js` `loadLanguage()` performs the following on switch:

1. Fetches new locale JSON.
2. Calls `applyTranslations()` — updates `data-i18n`, `data-i18n-placeholder`, `data-i18n-list`, toggles `.lang-block` visibility, updates meta tags, title, `lang`/`dir` attributes.
3. Calls `applyPageText()` — re-renders legacy `pageText` content (timeline, FAQ, pros/cons, profile data, used-guide cards) for the new language.
4. Calls `updateCalculator()` — refreshes cost calculator formatting.
5. Dispatches `i18n:ready` event.

**What is missing:**
- `renderSections()` is **never** re-invoked.
- No listener exists in `car-renderer.js` for `i18n:ready`.
- The new registry sections are **statically rendered once in Spanish** and never updated when the user switches to EN/FR/AR.

**Verdict:** Language switcher **does not affect** the new sections.

---

## 4. Validator Support

`car-validator.js` performs the following checks related to the new architecture:

- `powertrain` presence (warning only).
- `powertrain.type` enum validity (error if invalid).

It **does not** inspect:
- `review`, `drivingExperience`, `exteriorDesign`, `interior`, `technology`, `runningCosts`, `ownership` structure.
- Whether `safety` follows the old or new format.
- Whether narrative fields contain language keys.

**Verdict:** Validator is **blind** to the new sections.

---

## 5. Search-Index Impact

`search-index-generator.js` indexes cars using:

- `basicInfo.name`, `basicInfo.fullModelName`
- `brand.name`, `category.name`
- `pricing.current.value`
- `performance.power.value`
- `seo.description`

It **does not** read `review.summary`, `drivingExperience.handling.summary`, or any other new section.

**Verdict:** Zero impact on search.

---

## 6. Build Impact

The build pipeline runs:
- CSS bundling
- Car page generator (pre-injects data, does not read new sections)
- Guide page generator
- Search index generator
- Sitemap generator
- Validators

None of these generators consume the new sections for output generation.

**Verdict:** Zero impact on build.

---

## 7. Backward Compatibility

### Safe cases
- Cars **without** the new sections: sections remain `hidden` (no empty UI blocks).
- Cars with old `pageText` only: legacy `applyPageText()` continues to work.

### Risk case: `safety`
The old RS7 `safety` structure (pre-Phase 4A) was:
```json
"safety": {
    "ratings": { "euroNCAP": { ... }, "iihs": { ... } },
    "airbags": { "front": 2, "side": 2, ... },
    "driverAssist": [ { "id": "...", "name": "...", "description": "..." }, ... ],
    "structural": [ "string", "string" ]
}
```

The new renderer expects:
```json
"safety": {
    "ratings": { "overall": 5, "adultOccupant": 93, ... },
    "airbags": [ "Conductor", "Pasajero", ... ],
    "driverAssist": [ "Adaptive cruise control...", "Audi pre sense...", ... ],
    "structural": "string"
}
```

**Compatibility analysis:**

| Field | Old format | Renderer handling | Result on old data |
|-------|-----------|-------------------|-------------------|
| `ratings` | Nested objects | Iterates keys, checks `typeof v === 'number'` | Skipped safely (objects are not numbers) |
| `airbags` | Numeric object `{front: 2}` | Checks `.length` then `.join(', ')` | Skipped safely (objects have no `.length`) |
| `driverAssist` | Array of objects | Checks `.length` then `.map(a => '<li>' + a + '</li>')` | **Broken** — renders `[object Object]` for each item |
| `structural` | Array of strings | Outputs directly into `<p>` | Acceptable — coerces to comma-separated string |

**Verdict:** `driverAssist` in old `safety` format will produce garbage HTML if the new renderer runs against it. This is a **regression risk** for any car that has the old `safety` object populated. The other 7 sections are fully backward-compatible because they didn't exist before.

---

## 8. Multilingual-Readiness Matrix

| Section | Multilingual-ready | Why |
|---------|-------------------|-----|
| review | ❌ No | Flat strings, no lang lookup, no re-render on switch |
| drivingExperience | ❌ No | Same |
| exteriorDesign | ❌ No | Same |
| interior | ❌ No | Same |
| technology | ❌ No | Same |
| safety | ❌ No | Same |
| runningCosts | ❌ No | Same |
| ownership | ❌ No | Same |

**All 8 sections are Spanish-only.**

**Comparison with legacy system:**

| System | Multilingual? | Mechanism |
|--------|--------------|-----------|
| `pageText` | ✅ Yes | `pageText.es`, `pageText.en`, `pageText.fr`, `pageText.ar` — renderer picks current lang with ES fallback |
| `interiorText` | ✅ Yes | `interiorText.es`, `interiorText.en`, etc. — same pattern |
| New Phase 4A sections | ❌ No | Flat strings, no lang key |

---

## 9. Required Changes to Achieve Multilingual Support

### 9.1 Schema update
Define a `LocalizedString` pattern or document the convention that narrative fields must support:

```json
"review": {
    "es": { "summary": "...", "fullText": "..." },
    "en": { "summary": "...", "fullText": "..." },
    "fr": { "summary": "...", "fullText": "..." },
    "ar": { "summary": "...", "fullText": "..." }
}
```

Alternatively, define all leaf string properties as:
```json
"summary": { "oneOf": [{ "type": "string" }, { "type": "object" }] }
```
This allows gradual migration but is less strict.

### 9.2 Renderer update (8 section renderers)
Each renderer needs:
1. Accept or read current language.
2. Perform keyed lookup: `const r = carData.review?.[lang] || carData.review?.['es'] || carData.review;`
3. Handle both old flat strings and new multilingual objects during migration period.

### 9.3 Re-render on language switch
Two options:

**Option A — Hook into i18n:ready (minimal renderer change)**
```javascript
document.addEventListener('i18n:ready', () => {
    if (window.carRenderer && window.__preloadedCarData) {
        window.carRenderer.renderSections(window.__preloadedCarData);
    }
});
```

**Option B — Modify i18n.js to call renderer (one-line change)**
Inside `loadLanguage()`, after `applyPageText()`:
```javascript
if (window.carRenderer && typeof window.carRenderer.renderSections === 'function') {
    window.carRenderer.renderSections(carData);
}
```

Option A is cleaner because it doesn't introduce a coupling from i18n to the renderer.

### 9.4 Data migration
All narrative strings in every car must be wrapped in language objects. For RS7 alone (~1,530 words), expanding to 4 languages means ~6,120 words of content. At scale (100 cars), this is ~153,000 words of editorial content.

### 9.5 Safety backward-compatibility fix
The `safety` renderer should detect the old format and handle it gracefully:

```javascript
// Old driverAssist = array of objects
if (s.driverAssist && s.driverAssist.length && typeof s.driverAssist[0] === 'object') {
    // render using .name or .description
} else if (s.driverAssist && s.driverAssist.length) {
    // render new array-of-strings format
}
```

---

## 10. Migration Cost Estimate

| Task | Effort | Notes |
|------|--------|-------|
| Schema update | 15 min | Add `LocalizedString` pattern or relax string types |
| Update 8 renderers | 1–2 hours | Add lang lookup + fallback logic |
| Re-render hook | 15 min | `i18n:ready` listener in `car-renderer.js` |
| Safety backward-compat | 30 min | Guard against old `driverAssist` format |
| RS7 data migration (pilot) | 2–3 hours | Wrap existing ES strings + write EN/FR/AR translations |
| Validator updates | 15 min | Optional; no strict validation needed if optional fields |
| **Total engineering** | **~4 hours** | |
| **Content per car (×4 languages)** | **~6,000 words** | 1,500 ES words × 4 langs |
| **Content for 100 cars** | **~600,000 words** | Editorial-quality, multilingual |

---

## 11. Recommendation

### Phase 4B should STOP until multilingual architecture is fixed.

**Reasoning:**

1. **Migration debt:** Every Spanish-only string added now must be restructured later. The cost of fixing 1 car is small; fixing 100 cars is massive.
2. **User experience:** A visitor switching to EN/FR/AR will see Spanish narrative content mixed with translated UI. This is a broken experience.
3. **Safety regression:** The `safety` renderer may produce broken output on old-format data. This needs a guard before any car with the old safety object is rendered.
4. **The fix is small:** ~4 hours of engineering to make the renderer multilingual-ready.

### Proposed fix order

1. **Fix `safety` renderer backward compatibility** — guard against old `driverAssist` array-of-objects.
2. **Update schema** — document multilingual convention for narrative fields.
3. **Update 8 renderers** — add `lang` lookup with ES fallback.
4. **Add re-render hook** — listen to `i18n:ready` and call `renderSections()`.
5. **Migrate RS7 pilot** — wrap existing Spanish content into `review.es`, `drivingExperience.es`, etc.
6. **Write EN/FR/AR for RS7** — complete the pilot with full multilingual coverage.
7. **Resume Phase 4B** — now safe to populate remaining cars using the multilingual structure.

### Alternative (if speed is critical)

Accept Spanish-only new sections for now, but:
- Document the limitation explicitly on the site.
- Do not scale beyond the RS7 pilot until the fix is applied.
- This still requires the `safety` backward-compatibility guard to prevent regressions on other cars.

---

*Audit complete. No code changes made.*
