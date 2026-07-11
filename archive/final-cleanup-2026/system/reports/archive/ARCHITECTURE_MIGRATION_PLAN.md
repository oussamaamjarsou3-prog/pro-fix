# Architecture Migration Plan — CarSpecio Content Separation

**Date:** 2026-06-23  
**Scope:** Separate vehicle facts from multilingual editorial content  
**Status:** Planning — Awaiting Approval Before Implementation  
**Prerequisite:** `ARCHITECTURE_ALIGNMENT_REVIEW.md`

---

## 1. Executive Summary

This plan defines the exact steps, files, and sequencing required to migrate from the current monolithic car-data model to the original Carspecio architecture:

- `system/cars/*.json` — vehicle facts only
- `system/car-content/*.json` — multilingual editorial content only
- `system/locales/*.json` — UI translations only
- `system/countries/*.json` — country-specific settings only

**No production code is modified until this plan is approved.**

---

## 2. Current Architecture Audit

### 2.1 What Exists Today

```
system/
  data/
    rs7-2026.json              158 KB (facts + 4 languages embedded)
    bmw-m5-2026.json           31 KB (facts only, flat safety)
    audi-rs3-2026.json         31 KB
    mercedes-amg-gt-2026.json  31 KB
    nissan-gtr-2026.json       31 KB
    porsche-911-2026.json      31 KB
  locales/
    es.json, en.json, fr.json, ar.json
  registry/
    car-registry.json          points to dataFile only
  schemas/
    master-car-schema.json
```

### 2.2 Content Model (RS7)

| Section | Location | Type |
|---------|----------|------|
| Identity, specs, performance, dimensions, pricing, features, versions, images, gallery, relatedCars | `system/data/*.json` | Facts |
| review, drivingExperience, exteriorDesign, interior, technology, safety, runningCosts, ownership | `system/data/*.json` | Narrative (embedded multilingual) |
| pageText, interiorText | `system/data/*.json` | Legacy multilingual |
| content.pros/cons | `system/data/*.json` | Legacy flat |
| basicInfo.description, tagline, highlights | `system/data/*.json` | Editorial (Spanish-only) |
| seo.title, seo.description | `system/data/*.json` | Editorial (Spanish-only) |

### 2.3 Problems

1. **File bloat:** RS7 is 5x larger than peers (158 KB vs 31 KB).
2. **Wasted transfer:** Every page load fetches 4 languages, displays 1.
3. **Mixed concerns:** Content editors navigate specs/pricing to edit reviews.
4. **Unsafe AI generation:** AI tools generating inside monolithic files risk hallucinating specs.
5. **No countries layer:** `country-registry.json` exists but no `countries/` directory.

---

## 3. Target Architecture

### 3.1 Directory Structure

```
system/
  cars/
    audi-rs7-2026.json          ~40 KB facts
    bmw-m5-2026.json            ~30 KB
    ...
  car-content/
    audi-rs7-2026-es.json       ~30 KB Spanish editorial
    audi-rs7-2026-en.json       ~30 KB English editorial
    audi-rs7-2026-fr.json       ~30 KB French editorial
    audi-rs7-2026-ar.json       ~30 KB Arabic editorial
  locales/
    es.json, en.json, fr.json, ar.json   UI translations
  countries/
    spain.json                  EUR, km/L, ITV rules
    uk.json                     GBP, mpg, MOT rules
    france.json                 EUR, km/L, bonus/malus
    germany.json                EUR, km/L, TUV rules
    usa.json                    USD, mpg, EPA rules
  schemas/
    car-schema.json             Facts schema
    car-content-schema.json     Editorial schema
  validators/
    car-validator.js            Validates cars/ files
    car-content-validator.js    Validates car-content/ files
  registry/
    car-registry.json           dataFile + contentFile pointers
```

### 3.2 Content Separation Rules

**Stays in `system/cars/{id}.json` (facts):**

- `id`, `slug`, `brandId`, `categoryId`, `modelYear`, `generation`
- `bodyStyle`, `doors`, `seats`, `drivetrain`, `enginePosition`
- `status`, `launchDate`, `productionYears`
- `basicInfo.name`, `basicInfo.fullModelName`, `basicInfo.badge`
- `specs`, `performance`, `dimensions`, `fuelEconomy`, `pricing`
- `features`, `versions`, `images`, `gallery`
- `seo.keywords`, `relatedCars`, `comparisons`
- `powertrain` (type — description is editorial, see undecided)
- `content.pros`, `content.cons` (legacy backward compat)

**Moves to `system/car-content/{id}-{lang}.json` (editorial):**

- `review`, `drivingExperience`, `exteriorDesign`, `interior`
- `technology`, `safety`, `runningCosts`, `ownership`

**Undecided / Phase 2:**

- `basicInfo.description`, `basicInfo.longDescription`, `basicInfo.tagline`, `basicInfo.highlights`
- `seo.title`, `seo.description`
- `powertrain.description`

These are currently Spanish-only and should eventually be multilingual, but they are out of scope for this migration to minimize risk.

---

## 4. Files Affected

### 4.1 Files to Create

| File | Purpose |
|------|---------|
| `system/cars/` | New directory |
| `system/car-content/` | New directory |
| `system/countries/` | New directory |
| `system/schemas/car-schema.json` | Facts-only schema |
| `system/schemas/car-content-schema.json` | Editorial schema |
| `system/validators/car-content-validator.js` | Editorial validation |
| `system/scripts/migrate-car-content.js` | One-time migration script |

### 4.2 Files to Modify

| File | Change |
|------|--------|
| `system/schemas/master-car-schema.json` | Deprecate narrative definitions |
| `system/generators/car-page-generator.js` | Read from `cars/` + `car-content/` |
| `system/validators/car-validator.js` | Validate facts only |
| `system/build.js` | Copy `cars/` and `car-content/` to output |
| `js/car-renderer.js` | Fetch facts + content separately |
| `system/registry/car-registry.json` | Add `contentFile` field |

### 4.3 Files to Migrate (Split)

| Source | Destinations |
|--------|-------------|
| `system/data/rs7-2026.json` | `system/cars/audi-rs7-2026.json` + `system/car-content/audi-rs7-2026-{es,en,fr,ar}.json` |
| `system/data/bmw-m5-2026.json` | `system/cars/bmw-m5-2026.json` (no content yet) |
| `system/data/audi-rs3-2026.json` | `system/cars/audi-rs3-2026.json` (no content yet) |
| `system/data/mercedes-amg-gt-2026.json` | `system/cars/mercedes-amg-gt-2026.json` (no content yet) |
| `system/data/nissan-gtr-2026.json` | `system/cars/nissan-gtr-2026.json` (no content yet) |
| `system/data/porsche-911-2026.json` | `system/cars/porsche-911-2026.json` (no content yet) |

### 4.4 Files to Archive (After Verification)

| File | Destination |
|------|-------------|
| `system/data/*.json` (all 6 car files) | `system/data/archive/` |
| `system/scripts/migrate-car-content.js` | `system/scripts/archive/` |

---

## 5. Migration Stages

### Stage 0: Preparation (No production changes)

1. **Create directories:**
   - `system/cars/`
   - `system/car-content/`
   - `system/countries/`
   - `system/data/archive/`

2. **Create schemas:**
   - `system/schemas/car-schema.json`
   - `system/schemas/car-content-schema.json`

3. **Create country stubs:**
   - `system/countries/spain.json`
   - `system/countries/uk.json`
   - `system/countries/france.json`
   - `system/countries/germany.json`
   - `system/countries/usa.json`

4. **Update registry:**
   - Add `contentFile` field to each car in `car-registry.json`
   - RS7: `"contentFile": "system/car-content/audi-rs7-2026-{lang}.json"`
   - Others: `"contentFile": null`

5. **Write migration script:**
   - `system/scripts/migrate-car-content.js`
   - Reads `system/data/{car}.json`
   - Extracts facts → `system/cars/{car}.json`
   - Extracts narrative per language → `system/car-content/{car}-{lang}.json`
   - Preserves all data exactly

**Validation:** Existing build continues to pass.

### Stage 1: Dual-Path Renderer Support

**Goal:** Browser handles both old embedded format and new separated format.

1. **Modify `js/car-renderer.js`:**
   - Check registry for `contentFile` pointer
   - If `contentFile` exists:
     - Fetch `cars/{id}.json` (facts) + `car-content/{id}-{lang}.json` (content)
     - Merge in memory → render
   - If `contentFile` is null:
     - Fetch old `data/{id}.json` (monolith) → render as before

2. **Modify `js/car-renderer-registry.js`:**
   - No changes needed — `_getLocalized()` already handles language-key lookups

3. **Test:**
   - Build site
   - Verify old cars (BMW, Porsche) render correctly (Path B)

### Stage 2: RS7 Pilot Migration

1. **Run migration script:**
   - `node system/scripts/migrate-car-content.js --car=audi-rs7-2026`
   - Creates 5 files (1 facts + 4 content)

2. **Verify integrity:**
   - Compare merged output against original `rs7-2026.json`
   - Every field must match exactly

3. **Modify `system/generators/car-page-generator.js`:**
   - Read facts from `cars/`
   - If `contentFile` exists, read default (ES) content and merge
   - Inject into template

4. **Build and validate:**
   - `npm run build` → 0 errors
   - `npm run validate` → 0 errors

5. **Browser test:**
   - Load RS7 page in Spanish (default)
   - Switch to English, French, Arabic
   - Confirm all 8 sections update correctly
   - Network tab: confirm ~30 KB content file fetched on switch

6. **Archive:**
   - Move `system/data/rs7-2026.json` → `system/data/archive/`

### Stage 3: Remaining Cars

1. **Run migration script for 5 remaining cars**
2. **Build + validate all 6 cars**
3. **Browser test all 6 cars**
4. **Archive old data files**

### Stage 4: Cleanup

1. **Remove Path B fallback** from renderer
2. **Update validators:**
   - `car-validator.js` → facts only, warn on embedded narrative
   - `car-content-validator.js` → full editorial validation
3. **Deprecate `master-car-schema.json`**
4. **Archive migration scripts**
5. **Update documentation**
6. **Final build + validate + Lighthouse**

---

## 6. Dual-Path Support Strategy

### 6.1 How It Works

```javascript
// Pseudocode for car-renderer.js loadCarData()

async function loadCarData(carId) {
  const entry = findCarInRegistry(carId);
  
  if (entry.contentFile) {
    // Path A: New architecture
    const facts = await fetch(entry.dataFile);
    const lang = getCurrentLang();
    const content = await fetch(
      entry.contentFile.replace('{lang}', lang)
    );
    return { ...facts, ...content };
  } else {
    // Path B: Old architecture (backward compat)
    return await fetch(entry.dataFile); // old data/{id}.json
  }
}
```

### 6.2 Fallback Behavior

| Scenario | Behavior |
|----------|----------|
| New car with content file | Fetch facts + content, merge, render |
| New car, content file missing for a language | Fall back to ES content file |
| Old car without contentFile pointer | Fetch old monolithic file, render as before |
| Old car with embedded narrative | `_getLocalized()` extracts current language |
| Old car with flat narrative | Renders Spanish-only (existing behavior) |

### 6.3 Registry Update

```json
{
  "id": "audi-rs7-2026",
  "slug": "rs7",
  "brandId": "audi",
  "dataFile": "system/cars/audi-rs7-2026.json",
  "contentFile": "system/car-content/audi-rs7-2026-{lang}.json"
}
```

For unmigrated cars:

```json
{
  "id": "bmw-m5-2026",
  "dataFile": "system/data/bmw-m5-2026.json",
  "contentFile": null
}
```

---

## 7. Renderer Changes

### 7.1 `js/car-renderer.js`

**Current:** Fetches one JSON, stores in `window.__currentCarData`, re-renders from same data on `i18n:ready`.

**New:**
- Fetches facts → `window.__currentCarFacts` (cached)
- Fetches content → `window.__currentCarContent`
- Merges → `window.__currentCarData`
- On `i18n:ready`:
  - Re-fetch only content JSON for new language (~30 KB)
  - Update `window.__currentCarContent`
  - Re-merge and re-render
  - Facts JSON is NOT re-fetched

**Language switch pseudocode:**

```javascript
document.addEventListener('i18n:ready', async (e) => {
  const newLang = e.detail.lang;
  const carId = window.__currentCarId;
  
  // Only fetch content file
  const content = await fetch(`system/car-content/${carId}-${newLang}.json`);
  window.__currentCarContent = await content.json();
  
  // Merge with cached facts
  window.__currentCarData = {
    ...window.__currentCarFacts,
    ...window.__currentCarContent
  };
  
  window.carRenderer.renderSections(window.__currentCarData);
});
```

### 7.2 `js/car-renderer-registry.js`

**No changes required.** `_getLocalized()` already resolves language keys. The merged carData will have narrative sections at the top level, and `_getLocalized()` handles them correctly.

---

## 8. Generator Changes

### 8.1 `system/generators/car-page-generator.js`

**Current:** Reads `system/data/{car}.json`, injects into template.

**New:**
- Read facts from `system/cars/{car}.json`
- If `contentFile` exists, read default (ES) content from `car-content/`
- Merge and inject into template
- If `contentFile` is null, read old `system/data/{car}.json`

**SEO:** Inline default language (ES) content into HTML. Alternate languages fetched at runtime.

### 8.2 Other Generators

| Generator | Impact |
|-----------|--------|
| `search-index-generator.js` | None — does not index narrative |
| `sitemap-generator.js` | None — uses registry |
| `compare-data-generator.js` | None — uses facts only |
| `mega-menu-generator.js` | None — uses registry |
| `guide-generator.js` | None — independent system |

---

## 9. Validator Changes

### 9.1 `system/validators/car-validator.js`

**Current:** Validates entire monolithic file including narrative sections.

**New:** Validates only facts in `system/cars/*.json`.

- Remove multilingual section checks
- Remove legacy format warnings for narrative
- Add: warn if narrative keys found in `cars/*.json`
- Keep all fact validation (specs, pricing, dimensions)
- Keep legacy `content.pros/cons`, `pageText`, `interiorText` validation

### 9.2 `system/validators/car-content-validator.js` (New)

Validates `system/car-content/*.json`:

- Check `carId` matches registered car
- Check `lang` is supported
- Validate narrative sections against `car-content-schema.json`
- Warn if car has content for some languages but not all
- Warn if content file exists but is empty

### 9.3 Registry Validator

No changes needed.

---

## 10. Build System Changes

### 10.1 `system/build.js`

**Add to asset copying:**

```javascript
copyDir(path.join(projectDir, 'system/cars'),
        path.join(projectDir, 'html', 'system', 'cars'));
copyDir(path.join(projectDir, 'system/car-content'),
        path.join(projectDir, 'html', 'system', 'car-content'));
copyDir(path.join(projectDir, 'system/countries'),
        path.join(projectDir, 'html', 'system', 'countries'));
```

**Note:** Keep old `system/data/` copy until Stage 4 cleanup.

### 10.2 Output Directory

```
html/
  system/
    js/
    locales/
    registry/
    cars/              NEW
    car-content/       NEW
    countries/         NEW
```

---

## 11. Countries Directory

### 11.1 Purpose

Separate country-specific settings from language translations:

- **Language** (`locales/es.json`): How to say "Buy now" in Spanish
- **Country** (`countries/spain.json`): Currency is EUR, fuel per liter, km/h

### 11.2 Example: `countries/spain.json`

```json
{
  "id": "spain",
  "currency": "EUR",
  "currencySymbol": "€",
  "units": {
    "speed": "km/h",
    "distance": "km",
    "fuelEconomy": "L/100km",
    "volume": "L"
  },
  "fuelPrices": {
    "petrol": { "value": 1.65, "currency": "EUR", "unit": "L" },
    "diesel": { "value": 1.55, "currency": "EUR", "unit": "L" }
  },
  "taxes": { "vat": 0.21 },
  "inspection": { "name": "ITV", "frequencyYears": 2 }
}
```

### 11.3 Scope

- **This migration:** Create directory structure and stubs only
- **Phase 2:** Integrate with renderer for pricing display, unit conversion

---

## 12. Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Migration script loses data | Low | Critical | Backups; diff before delete; field-by-field verify |
| Renderer regression on language switch | Medium | High | Test all 4 languages on RS7 |
| Old cars break during dual-path | Medium | High | Test all 5 old cars build + render |
| Build fails due to missing files | Medium | High | Run full build after each stage |
| Content file missing for language | Low | Medium | Fallback to ES built into renderer |
| Schema validation gaps | Low | Medium | Test validator against all cars + content |
| Performance regression | Low | Low | Content file ~30 KB, cached, non-blocking |
| File count explosion | Certain | Low | 6 cars x 5 files = 30 files initially |
| Team confusion | Medium | Low | Document paths; clear naming |

---

## 13. Effort Estimate

### 13.1 Breakdown

| Task | Hours |
|------|-------|
| Stage 0: Preparation (dirs, schemas, countries, registry, script) | 7 |
| Stage 1: Dual-Path Renderer | 4 |
| Stage 2: RS7 Pilot (migrate, test, archive) | 6.5 |
| Stage 3: Remaining Cars | 3.5 |
| Stage 4: Cleanup (remove fallback, validators, docs) | 5 |
| **Total** | **~26 hours (~3-4 dev days)** |

### 13.2 Resources

- **1 developer** for implementation
- **1 QA/tester** for browser testing
- **Calendar time:** 1 week

---

## 14. Testing Plan

### 14.1 Automated Tests

| Test | Stage | Command |
|------|-------|---------|
| Build passes | All | `npm run build` |
| Car validator | All | `node system/validators/car-validator.js` |
| Content validator | 2-4 | `node system/validators/car-content-validator.js` |
| Registry validator | All | `node system/validators/registry-validator.js` |
| Link validator | 4 | `node system/validators/link-validator.js` |

### 14.2 Manual Browser Tests

| Test | Stage | Pass Criteria |
|------|-------|---------------|
| RS7 loads Spanish | 2 | All 8 sections visible, Spanish text |
| RS7 switch English | 2 | Content updates, no page reload, ~30 KB fetch |
| RS7 switch French | 2 | Content updates, no page reload |
| RS7 switch Arabic | 2 | Content updates, no page reload |
| BMW loads Spanish | 3 | Renders correctly (Path B fallback) |
| BMW loads English | 3 | Renders correctly (Path B fallback) |
| Porsche, GT-R, RS3, Mercedes | 3 | All render correctly in all 4 languages |
| Language switch on old cars | 3 | `pageText` system works unchanged |

### 14.3 Performance Tests

| Test | Stage | Target |
|------|-------|--------|
| RS7 initial load | 2 | < 100 KB total JSON (facts + content) |
| RS7 language switch | 2 | < 35 KB additional fetch |
| Lighthouse LCP | 4 | No regression from current baseline |
| Lighthouse CLS | 4 | No regression |

---

## 15. Rollback Strategy

If any stage fails catastrophically:

1. **Revert code changes** in affected files (renderer, generator, build)
2. **Restore old data files** from `system/data/archive/`
3. **Restore registry** to pre-migration state (remove `contentFile` fields)
4. **Run build + validate** to confirm baseline restored

**All stages keep old files in `system/data/archive/` until Stage 4.**

---

## 16. Post-Migration Cleanup

After Stage 4 is verified:

1. Delete `system/data/archive/` (after backup)
2. Delete `system/scripts/migrate-car-content.js`
3. Delete `system/scripts/archive/migrate-rs7-multilingual.js` (if still present)
4. Remove deprecated `master-car-schema.json` or rename to `-legacy`
5. Update `system/README.md` with new architecture documentation
6. Update contributor guidelines

---

## 17. Approval Gate

**This plan requires explicit approval before any code changes.**

### Checklist for Approval

- [ ] Target architecture (`cars/`, `car-content/`, `locales/`, `countries/`) approved
- [ ] Content separation rules approved (what stays, what moves)
- [ ] Dual-path strategy approved (backward compat during transition)
- [ ] Effort estimate acceptable (~3-4 dev days)
- [ ] Calendar time acceptable (~1 week)
- [ ] Risk assessment reviewed and acceptable
- [ ] Testing plan sufficient
- [ ] Rollback strategy sufficient
- [ ] No new car content population until migration complete

### Approved By

_________________________  Date: _______________

### Implementation Start Date

_________________________ (to be filled after approval)

---

## Appendix A: Detailed File-by-File Migration Map

### RS7 (audi-rs7-2026) — Full Migration (Has narrative content)

**Source:** `system/data/rs7-2026.json` (158 KB)

**Destinations:**
- `system/cars/audi-rs7-2026.json` (~40 KB)
  - Keep: id, slug, brandId, categoryId, modelYear, generation
  - Keep: bodyStyle, doors, seats, drivetrain, enginePosition
  - Keep: status, launchDate, productionYears
  - Keep: basicInfo.name, fullModelName, badge
  - Keep: specs, performance, dimensions, fuelEconomy, pricing
  - Keep: features, versions, images, gallery, seo.keywords
  - Keep: relatedCars, powertrain, content.pros/cons
  - Remove: review, drivingExperience, exteriorDesign, interior, technology, safety, runningCosts, ownership
  - Keep (Phase 2): basicInfo.description, longDescription, tagline, highlights, seo.title, seo.description

- `system/car-content/audi-rs7-2026-es.json` (~30 KB)
  - Move: review.es, drivingExperience.es, exteriorDesign.es, interior.es, technology.es, safety.es, runningCosts.es, ownership.es
  - Add: carId, lang

- `system/car-content/audi-rs7-2026-en.json` (~30 KB)
  - Same sections, English content

- `system/car-content/audi-rs7-2026-fr.json` (~30 KB)
  - Same sections, French content

- `system/car-content/audi-rs7-2026-ar.json` (~30 KB)
  - Same sections, Arabic content

### BMW M5 (bmw-m5-2026) — Facts Only (No narrative yet)

**Source:** `system/data/bmw-m5-2026.json` (31 KB)

**Destination:** `system/cars/bmw-m5-2026.json` (~31 KB)
- Move entire file as-is (no narrative sections exist yet)
- No content files created
- Registry contentFile = null

### Other Cars (audi-rs3, mercedes-amg-gt, nissan-gtr, porsche-911)

Same pattern as BMW M5:
- Move entire file to `system/cars/`
- No content files
- Registry contentFile = null

---

## Appendix B: Countries Directory Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["id", "currency", "units"],
  "properties": {
    "id": { "type": "string" },
    "currency": { "type": "string", "pattern": "^[A-Z]{3}$" },
    "currencySymbol": { "type": "string" },
    "units": {
      "type": "object",
      "properties": {
        "speed": { "enum": ["km/h", "mph"] },
        "distance": { "enum": ["km", "miles"] },
        "fuelEconomy": { "enum": ["L/100km", "mpg", "km/L"] },
        "volume": { "enum": ["L", "gal"] },
        "weight": { "enum": ["kg", "lbs"] }
      }
    },
    "fuelPrices": {
      "type": "object",
      "properties": {
        "petrol": { "type": "object", "properties": { "value": "number", "currency": "string", "unit": "string" } },
        "diesel": { "type": "object" },
        "electric": { "type": "object" }
      }
    },
    "taxes": {
      "type": "object",
      "properties": {
        "vat": { "type": "number" },
        "registrationTax": { "type": "object" }
      }
    },
    "inspection": {
      "type": "object",
      "properties": {
        "name": { "type": "string" },
        "frequencyYears": { "type": "integer" }
      }
    }
  }
}
```

---

## Appendix C: Content File Structure Example

```json
{
  "carId": "audi-rs7-2026",
  "lang": "en",
  "review": {
    "summary": "The Audi RS7 is a high-performance...",
    "fullText": "...",
    "verdict": "buy",
    "bestFor": ["..."],
    "scoreBreakdown": { "performance": 9.8, "comfort": 9.0 }
  },
  "drivingExperience": {
    "handling": { "summary": "...", "steeringFeel": "..." },
    "performanceFeel": { "acceleration": "...", "braking": "..." },
    "dailyDriving": { "comfort": "...", "visibility": "..." }
  },
  "exteriorDesign": { "summary": "...", "stylingNotes": [...] },
  "interior": { "summary": "...", "frontSeats": {...}, "rearSeats": {...} },
  "technology": { "headUnit": {...}, "connectivity": [...] },
  "safety": { "airbags": [...], "driverAssist": [...], "structural": "..." },
  "runningCosts": { "insuranceGroups": {...}, "roadTax": {...} },
  "ownership": { "ownerReviews": [...], "commonIssues": [...] }
}
```

---

*End of plan. Awaiting approval before implementation.*
