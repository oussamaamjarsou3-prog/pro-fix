# Architecture Reality Audit — CarSpecio

**Date:** 2026-06-23
**Auditor:** Cascade (read-only inspection)
**Scope:** Determine actual runtime architecture (old vs new vs hybrid)

---

## 1. Directory Structure

| Directory | Exists | Contains Real Data | Notes |
|-----------|--------|-------------------|-------|
| `system/data` | Yes | Yes — 6 car JSON files (rs7, m5, rs3, amg-gt, gtr, 911) + guides + master | Source of truth for ALL cars |
| `system/cars` | **No** | N/A | Directory does not exist |
| `system/car-content` | **No** | N/A | Directory does not exist |
| `system/locales` | Yes | Yes — 4 language files (es, en, fr, ar) | UI translations only |
| `system/countries` | Yes | Yes — 5 country stubs | Stubs created in Stage 0 |
| `system/schemas` | Yes | Yes — 6 schema files | master-car-schema is authoritative |
| `system/data/archive` | **No** | N/A | Directory does not exist |

**Tree:**
```
system/
  data/
    rs7-2026.json              (162 KB — facts + embedded multilingual content)
    bmw-m5-2026.json           (31 KB — facts only)
    audi-rs3-2026.json         (31 KB — facts only)
    mercedes-amg-gt-2026.json  (31 KB — facts only)
    nissan-gtr-2026.json       (31 KB — facts only)
    porsche-911-2026.json      (31 KB — facts only)
  cars/                         — MISSING
  car-content/                  — MISSING
  countries/                    — 5 stubs (spain, uk, france, germany, usa)
  locales/                      — 4 UI translation files
  schemas/
    master-car-schema.json      (used by validator)
    car-schema.json             (unreferenced by any code)
    car-content-schema.json     (unreferenced by any code)
    brand-schema.json
    category-schema.json
    guide-schema.json
  registry/
    car-registry.json           (modified: contentFile field added)
```

---

## 2. Source of Truth

| Car | Old File (`system/data`) | New File (`system/cars`) | Content Files (`system/car-content`) | Source of Truth |
|-----|--------------------------|--------------------------|--------------------------------------|-----------------|
| Audi RS7 | `system/data/rs7-2026.json` (exists, 162 KB) | None | None | **Old file** |
| BMW M5 | `system/data/bmw-m5-2026.json` (exists, 31 KB) | None | None | **Old file** |
| Audi RS3 | `system/data/audi-rs3-2026.json` (exists, 31 KB) | None | None | **Old file** |
| Mercedes AMG GT | `system/data/mercedes-amg-gt-2026.json` (exists, 31 KB) | None | None | **Old file** |
| Nissan GT-R | `system/data/nissan-gtr-2026.json` (exists, 31 KB) | None | None | **Old file** |
| Porsche 911 | `system/data/porsche-911-2026.json` (exists, 31 KB) | None | None | **Old file** |

**Duplicate copies:** None. No files have been migrated. There is no duplicate data.

**Authoritative file for every car:** `system/data/{car-id}-{year}.json`

---

## 3. Registry Analysis

Inspecting `system/registry/car-registry.json`:

| Car | dataFile | contentFile | dataFile Exists? | contentFile Exists? | Status |
|-----|----------|-------------|------------------|---------------------|--------|
| Audi RS7 | `system/data/rs7-2026.json` | `system/car-content/audi-rs7-2026-{lang}.json` | Yes | **No** (directory missing) | Broken contentFile pointer |
| Audi RS3 | `system/data/audi-rs3-2026.json` | `null` | Yes | N/A | OK |
| BMW M5 | `system/data/bmw-m5-2026.json` | `null` | Yes | N/A | OK |
| Mercedes AMG GT | `system/data/mercedes-amg-gt-2026.json` | `null` | Yes | N/A | OK |
| Nissan GT-R | `system/data/nissan-gtr-2026.json` | `null` | Yes | N/A | OK |
| Porsche 911 | `system/data/porsche-911-2026.json` | `null` | Yes | N/A | OK |

**Finding:** The RS7 `contentFile` path is a dead reference. No code reads this field at runtime. The `{lang}` placeholder is not resolved by any generator or renderer.

---

## 4. Renderer Analysis

### Files inspected:
- `js/car-renderer.js`
- `js/car-renderer-registry.js`

### A. What does the renderer fetch?

**Only `system/data` files.**

```javascript
// js/car-renderer.js:52
const response = await fetch(this.carDataFile);
```

The `carDataFile` path is set from the HTML page template, which comes from `car.dataFile` in the registry. There is **zero code** that fetches from `system/cars` or `system/car-content`.

### B. Is dual-path support implemented?

**No.**

There is no conditional logic in `car-renderer.js` or `car-renderer-registry.js` that checks for:
- A separate facts file
- A content file pointer
- A `contentFile` registry field

The renderer loads ONE JSON file and renders everything from it.

### C. Language switching behavior

**Reuses embedded content only.**

The `i18n:ready` event listener (lines 439-444) triggers `renderSections(window.__currentCarData)`, which calls `_getLocalized(carData.{section}, lang)`. This looks up language keys **inside the already-loaded carData object**. It does NOT fetch external content files.

### D. Current runtime flow

```
1. HTML page loads with carDataFile = '../system/data/rs7-2026.json'
2. CarRenderer.fetch() loads the monolithic JSON
3. All content (facts + all 4 languages) is in memory
4. renderSections() uses _getLocalized() to pick the right language
5. On language switch: re-render from the same in-memory object
```

---

## 5. Build System Analysis

### File inspected:
- `system/build.js`
- `system/generators/car-page-generator.js`

### Directories copied to `html/` output:

| Directory | Copied? | Used at build time? | Required for build? |
|-----------|---------|---------------------|---------------------|
| `css/` | Yes | Yes | Yes |
| `js/` | Yes | Yes | Yes |
| `images/` | Yes | Yes | Yes |
| `system/js/` | Yes | Yes | Yes |
| `system/locales/` | Yes | Yes | Yes |
| `system/registry/` | Yes | Yes | Yes |
| `system/data/` | **No** | Yes (generator reads it) | Yes |
| `system/cars/` | **No** | No | No |
| `system/car-content/` | **No** | No | No |
| `system/countries/` | **No** | No | No |

### Generator behavior (`car-page-generator.js`):

```javascript
// Lines 89-97
const dataFile = car.dataFile || `system/data/${car.id}.json`;
const dataPath = path.join(__dirname, '../..', dataFile);
```

The generator reads from `car.dataFile` ONLY. It does NOT:
- Check `car.contentFile`
- Load content files
- Write separate fact/content files

**Build system conclusion:** `system/cars` and `system/car-content` are completely invisible to the build. Only `system/data` matters.

---

## 6. Schema Analysis

### Files:
- `system/schemas/master-car-schema.json` (64 KB)
- `system/schemas/car-schema.json` (4.8 KB)
- `system/schemas/car-content-schema.json` (9.8 KB)

| Schema | Used by validator? | Referenced in build? | Referenced in renderer? | Status |
|--------|-------------------|----------------------|-------------------------|--------|
| `master-car-schema.json` | Yes | Indirectly | No | **Authoritative** |
| `car-schema.json` | **No** | **No** | **No** | Dead file |
| `car-content-schema.json` | **No** | **No** | **No** | Dead file |

**Finding:** The two new schemas created in Stage 0 are not referenced by any production code. The validator hardcodes `master-car-schema.json`:

```javascript
// system/validators/car-validator.js:15
const schemaPath = path.join(__dirname, '../schemas/master-car-schema.json');
```

---

## 7. Validator Analysis

### File inspected:
- `system/validators/car-validator.js`

### What is validated:
- Every `car.dataFile` path from registry
- Required fields from `master-car-schema.json`
- `basicInfo`, `specs`, `performance`, `dimensions`, `pricing`, `images`, `seo`, `content`
- Multilingual section format (legacy flat vs language keys)

### What is ignored:
- `car.contentFile` (not checked for existence, not validated)
- `car-schema.json` (not loaded)
- `car-content-schema.json` (not loaded)
- `system/cars/` directory (not scanned)
- `system/car-content/` directory (not scanned)

### New architecture enforced?

**No.** The validator warns about legacy flat format but does NOT enforce the separated architecture:

```javascript
// Lines 145-146
warnings.push(`Car ${car.id} section "${section}" uses legacy flat format (recommended: wrap in language keys)`);
```

It is a recommendation, not enforcement.

---

## 8. Duplication & Migration Status

| Issue | Finding | Evidence |
|-------|---------|----------|
| Duplicate data | **None** | No files exist in `system/cars` or `system/car-content` |
| Unused files | **Yes** | `car-schema.json`, `car-content-schema.json` are unreferenced |
| Stale files | **No** | All `system/data` files are current and used |
| Partially migrated files | **None** | Zero cars migrated |
| Broken registry references | **Yes** | RS7 `contentFile` points to non-existent directory |
| Folders created but unused | **Yes** | `system/countries/` has 5 stubs; no code reads them |
| Migration script status | **Never run** | `migrate-car-content.js` exists but produced no output files |
| Archive directory | **Missing** | `system/data/archive/` does not exist |

---

## 9. Final Verdict

### **A. OLD ARCHITECTURE**

`system/data` remains the sole source of truth for all 6 cars.

**Evidence summary:**
- `system/cars/` does not exist
- `system/car-content/` does not exist
- Build system reads exclusively from `system/data/`
- Renderer loads exclusively from `system/data/`
- Validator validates exclusively `system/data/` files
- No production code references `car-schema.json`, `car-content-schema.json`, or `contentFile`
- RS7 still stores all 4 languages embedded in `system/data/rs7-2026.json` (confirmed at line 2534)

**What Stage 0 actually accomplished:**
- Created 2 unreferenced schema files
- Created 5 country stubs (unread by any code)
- Added `contentFile` field to registry (unread by any code, broken path for RS7)
- Wrote a migration script (never executed)
- Failed to create `system/cars/`, `system/car-content/`, `system/data/archive/` directories

**What the runtime system actually does:**
- Loads monolithic car JSON from `system/data/`
- Renders all sections from the single loaded object
- Language switching picks the right language from embedded keys

---

## 10. Recommendation

### Should migration continue?

**Yes, but with corrections.**

The Stage 0 artifacts are harmless but incomplete. The registry has a broken `contentFile` pointer that should either be removed or fulfilled. The new schemas are harmless dead files.

### Should migration be rolled back?

**No rollback needed.** The changes made so far do not break anything. The build still passes. The only "broken" element is the RS7 `contentFile` pointer, which is ignored by all code.

### Risk of duplicate sources of truth?

**Currently zero.** No duplicate data exists because no migration was executed. The risk will emerge in Stage 2 if migration is run: at that point `system/data/rs7-2026.json` must be archived and `system/cars/` + `system/car-content/` must become the new sources. Until then, there is no conflict.

### What must be fixed before any further content population?

1. **Create missing directories.** `system/cars/`, `system/car-content/`, and `system/data/archive/` must exist before the migration script can run.
2. **Fix or remove the broken RS7 `contentFile` pointer.** The path `system/car-content/audi-rs7-2026-{lang}.json` references a directory that does not exist. Either:
   - Remove the field until migration is complete, OR
   - Create the directory and run the migration script immediately.
3. **Do not populate new car content in the old monolithic format.** Any new narrative content added to `system/data/*.json` will increase migration debt.
4. **Implement dual-path renderer BEFORE running migration.** If the migration script splits RS7 data but the renderer still loads from `system/data/`, the migrated files will be orphaned. The renderer must be updated first (Stage 1) to:
   - Check for `contentFile`
   - Load facts from `system/cars/` if available
   - Fall back to `system/data/` for unmigrated cars

---

## Appendix: Evidence Index

| Claim | File | Lines |
|-------|------|-------|
| `system/cars/` missing | `list_dir` call | N/A — error returned |
| `system/car-content/` missing | `list_dir` call | N/A — error returned |
| RS7 has embedded multilingual content | `system/data/rs7-2026.json` | 2534 |
| Renderer loads only `this.carDataFile` | `js/car-renderer.js` | 52 |
| No `contentFile` references in renderer | `grep_search` across `js/` | 0 matches |
| Generator loads only `car.dataFile` | `system/generators/car-page-generator.js` | 89-97 |
| Build does not copy `system/cars` | `system/build.js` | 148-154 |
| Validator uses `master-car-schema.json` | `system/validators/car-validator.js` | 15 |
| `car-schema.json` unreferenced | `grep_search` across `*.js` | 0 matches in production code |
| Registry has `contentFile` for RS7 | `system/registry/car-registry.json` | 19 |
| Country stubs exist but unused | `system/countries/` | 5 files |
