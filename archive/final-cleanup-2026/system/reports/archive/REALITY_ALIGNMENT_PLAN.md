# Reality Alignment Plan — CarSpecio Architecture

**Date:** 2026-06-23
**Status:** Read-only audit complete. No code changes yet.
**Source of truth:** `ARCHITECTURE_REALITY_AUDIT.md`

---

## 1. Verification of Audit Claims

Every claim in `ARCHITECTURE_REALITY_AUDIT.md` was re-checked against the actual repository files.

| # | Claim | Verification Method | Result |
|---|-------|---------------------|--------|
| 1 | `system/cars/` does not exist | `list_dir` call | **CONFIRMED** — directory error returned |
| 2 | `system/car-content/` does not exist | `list_dir` call | **CONFIRMED** — directory error returned |
| 3 | `system/data/archive/` does not exist | `list_dir` call | **CONFIRMED** — directory error returned |
| 4 | All 6 cars live in `system/data/` | `list_dir` on `system/data/` | **CONFIRMED** — 6 JSON files present |
| 5 | Renderer fetches only `system/data/` | `js/car-renderer.js:52` | **CONFIRMED** — `fetch(this.carDataFile)` only |
| 6 | Template hardcodes `system/data/` path | `system/templates/car-template.html:717` | **CONFIRMED** — `const carDataFile = '../system/data/rs7-2026.json';` |
| 7 | Generated HTML uses `system/data/` | `html/rs7.html:764` | **CONFIRMED** — same hardcoded path |
| 8 | Generator reads only `car.dataFile` | `system/generators/car-page-generator.js:89-97` | **CONFIRMED** — `loadCarData(car)` uses `car.dataFile` exclusively |
| 9 | Validator checks only `system/data/` | `system/validators/car-validator.js:15,29-30` | **CONFIRMED** — loads `master-car-schema.json`, validates `car.dataFile` paths |
| 10 | Registry validator ignores `contentFile` | `system/validators/registry-validator.js:56-61` | **CONFIRMED** — checks `dataFile` existence only; `contentFile` not in required fields list |
| 11 | Search index generator uses `car.dataFile` | `system/generators/search-index-generator.js:33-41` | **CONFIRMED** — `loadCarData` reads from `car.dataFile` |
| 12 | Compare data generator uses `car.dataFile` | `system/generators/compare-data-generator.js:15-23` | **CONFIRMED** — `loadCarData` reads from `car.dataFile` |
| 13 | `contentFile` unused in any JS/HTML | `grep_search` across `*.js` and `*.html` | **CONFIRMED** — 0 matches in production code (only in `migrate-car-content.js` and `node_modules`) |
| 14 | `car-schema.json` unreferenced | `grep_search` across `*.js`, `*.html`, `*.json` | **CONFIRMED** — 0 matches in production code |
| 15 | `car-content-schema.json` unreferenced | `grep_search` across `*.js`, `*.html`, `*.json` | **CONFIRMED** — 0 matches in production code |
| 16 | Country stubs exist but unread | `grep_search` for `"countries/"` in `*.js`, `*.html` | **CONFIRMED** — 0 matches |
| 17 | Build does not copy `system/cars/` or `system/car-content/` | `system/build.js:148-154` | **CONFIRMED** — only `css`, `js`, `images`, `system/js`, `system/locales`, `system/registry` copied |
| 18 | `i18n.js` does not reference content files | `grep_search` in `js/i18n.js` | **CONFIRMED** — 0 matches |
| 19 | RS7 `contentFile` is a dead pointer | `system/registry/car-registry.json:19` | **CONFIRMED** — path references non-existent directory |
| 20 | HTML output registry matches source | `html/system/registry/car-registry.json` | **CONFIRMED** — identical `contentFile` entries |

**Conclusion:** Every claim in the audit is factually correct. The runtime architecture is unambiguously the old monolithic model.

---

## 2. Currently Active Production Files

Files that are actually read, executed, or copied during the build:

### Build-time active files
| File | Role |
|------|------|
| `system/build.js` | Orchestrates entire build |
| `system/config.js` | Exports `BASE_URL`, `SUPPORTED_LANGS`, `DEFAULT_LANG` |
| `system/schemas/master-car-schema.json` | Referenced by `car-validator.js` (loaded, not strictly schema-validated via ajv) |
| `system/schemas/brand-schema.json` | Referenced by `brand-validator.js` |
| `system/schemas/category-schema.json` | Referenced indirectly |
| `system/schemas/guide-schema.json` | Referenced by `guide-validator.js` |
| `system/locales/*.json` (4 files) | Loaded by generators and copied to `html/system/locales/` |
| `system/registry/*.json` (5 files) | Loaded by all generators/validators; copied to `html/system/registry/` |
| `system/templates/car-template.html` | Used by `car-page-generator.js` to emit 6 car pages |
| `system/data/*.json` (6 car files + guides) | Loaded by generators and validators |
| `system/generators/*.js` (7 scripts) | Executed during build |
| `system/validators/*.js` (3 scripts) | Executed during build |
| `css/*.css` | Bundled and copied to `html/css/` |
| `js/*.js` | Copied to `html/js/` |
| `images/*` | Copied to `html/images/` |

### Runtime active files (browser)
| File | Role |
|------|------|
| `html/*.html` (6 car pages + others) | Loaded by browser |
| `html/js/*.js` | Client-side scripts (copies of `js/*.js`) |
| `html/css/*.css` | Stylesheets |
| `html/system/locales/*.json` | UI translations fetched at runtime |
| `html/system/registry/*.json` | Registry available if fetched |
| `html/system/data/*.json` | **Not copied** — car data is pre-injected into HTML by generator |

### Critical observation
`system/data/` files are **not copied** to `html/system/data/`. The generator pre-injects the entire car JSON as `window.__preloadedCarData` directly into each HTML page. This means the browser never fetches `system/data/rs7-2026.json` at runtime for the generated pages — it uses the preloaded inline script. The `fetch(this.carDataFile)` path in `car-renderer.js` is only a fallback for non-generated or dev contexts.

---

## 3. Stage 0 Artifacts — Usage Status

| Artifact | Status | Why |
|----------|--------|-----|
| `system/schemas/car-schema.json` | **Dead** | No code references it |
| `system/schemas/car-content-schema.json` | **Dead** | No code references it |
| `system/countries/*.json` (5 files) | **Stubs / Unread** | No code references `countries/` directory |
| `system/scripts/migrate-car-content.js` | **Never run** | Exists but produced no output files |
| `system/registry/car-registry.json` `contentFile` field | **Dead pointer (RS7) / Harmless null (others)** | No code reads this field |
| Missing directories: `system/cars/`, `system/car-content/`, `system/data/archive/` | **Not created** | `mkdir` commands failed silently or were not executed |

**Impact assessment:** None of these artifacts break the build or runtime. The RS7 `contentFile` pointer is harmless because no code evaluates it. The dead schema files are harmless. The missing directories are the only real gap — the migration script cannot run without them.

---

## 4. Minimum Code Changes for Dual-Path Support

**Constraint:** No car data is moved. `system/data/` remains the sole source of truth until migration is explicitly run later.

**Goal:** The renderer, generator, and validator must support BOTH:
- **Path A (New):** Facts in `system/cars/`, editorial in `system/car-content/`, merged at load time
- **Path B (Old):** Everything in `system/data/`, exactly as today

### 4.1 Files to Change

Only **4 files** need modification. No new files are required.

#### File 1: `js/car-renderer.js`

**What to change:** Add optional content file loading and merging into `loadCarData()`.

**Current behavior:**
```javascript
constructor(carDataFile) {
    this.carDataFile = carDataFile;
}
async loadCarData() {
    // fetch carDataFile
    // render everything from that single object
}
```

**Required behavior:**
```javascript
constructor(carDataFile, contentFile = null) {
    this.carDataFile = carDataFile;
    this.contentFile = contentFile;
}
async loadCarData() {
    // fetch carDataFile (same as today)
    let carData = ...
    
    // NEW: if contentFile provided, attempt to fetch and merge
    if (this.contentFile) {
        try {
            const contentResponse = await fetch(this.contentFile.replace('{lang}', this._getLang()));
            if (contentResponse.ok) {
                const contentData = await contentResponse.json();
                // Merge content into carData, excluding metadata fields
                const { carId, lang, ...editorial } = contentData;
                carData = { ...carData, ...editorial };
            }
        } catch (e) {
            // Content file missing or unreachable — silently fall back to embedded
            console.warn('[CarRenderer] Content file not loaded:', this.contentFile, e.message);
        }
    }
    
    // Continue with existing render logic unchanged
}
```

**Why this is safe:** For all 6 cars today, `contentFile` is either `null` or points to a non-existent file. The `try/catch` ensures the renderer falls back to the monolithic `carData` object with zero disruption.

---

#### File 2: `system/generators/car-page-generator.js`

**What to change:** Inject `contentFile` variable into generated HTML, and optionally load from `system/cars/` for facts.

**Current code (lines 150-157):**
```javascript
const dataFilePath = car.dataFile ? `../${car.dataFile}` : `../system/data/${car.id}.json`;
const carDataJson = JSON.stringify(carData).replace(/</g, '\\u003c');
page = page.replace(
    /const carDataFile = '[^']*';/,
    `const carDataFile = '${dataFilePath}';\n        window.__preloadedCarData = ${carDataJson};`
);
```

**Required behavior:**
```javascript
// Determine facts source
const factsPath = car.dataFile ? `../${car.dataFile}` : `../system/data/${car.id}.json`;

// Determine content source
let contentPath = null;
if (car.contentFile) {
    // Use default language path for static pre-injection
    const resolvedContentFile = car.contentFile.replace('{lang}', DEFAULT_LANG);
    const contentAbsolutePath = path.join(__dirname, '../..', resolvedContentFile);
    if (fs.existsSync(contentAbsolutePath)) {
        contentPath = `../${resolvedContentFile}`;
    }
}

const carDataJson = JSON.stringify(carData).replace(/</g, '\\u003c');

// Inject both paths and preloaded data
page = page.replace(
    /const carDataFile = '[^']*';/,
    `const carDataFile = '${factsPath}';\n        const carContentFile = ${contentPath ? `'${contentPath}'` : 'null'};\n        window.__preloadedCarData = ${carDataJson};`
);
```

**Also change line 717 of template** (or the replacement regex) so the renderer instantiation uses `carContentFile`:

Template or generator injection:
```javascript
page = page.replace(
    /window\.carRenderer = new CarRenderer\(carDataFile\);/,
    `window.carRenderer = new CarRenderer(carDataFile, carContentFile);`
);
```

**Why this is safe:** Until content files exist, `fs.existsSync()` returns `false`, so `carContentFile` is set to `null`. The generated HTML behaves identically to today. When content files are created later, the generator will automatically detect and inject them on the next build.

---

#### File 3: `system/validators/car-validator.js`

**What to change:** Add dual-path validation without breaking existing validation.

**Current behavior:** Validates `car.dataFile` only.

**Required behavior:**
```javascript
// After existing validation of car.dataFile, add:

// NEW: Validate content files if declared
if (car.contentFile) {
    const supportedLangs = ['es', 'en', 'fr', 'ar'];
    supportedLangs.forEach(lang => {
        const contentPath = path.join(__dirname, '../../', car.contentFile.replace('{lang}', lang));
        if (fs.existsSync(contentPath)) {
            try {
                const contentData = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
                if (!contentData.carId) {
                    warnings.push(`Car ${car.id} content file for ${lang} is missing carId`);
                }
                if (!contentData.lang) {
                    warnings.push(`Car ${car.id} content file for ${lang} is missing lang`);
                }
            } catch (e) {
                errors.push(`Car ${car.id} content file for ${lang} is invalid JSON: ${e.message}`);
            }
        } else {
            warnings.push(`Car ${car.id} content file for ${lang} not found: ${car.contentFile.replace('{lang}', lang)}`);
        }
    });
}
```

**Why this is safe:** For all cars today, either `contentFile` is `null` (5 cars) or the files don't exist (RS7). The validator will emit warnings, not errors, for missing files, so the build still passes. When content files are created, they will be validated automatically.

---

#### File 4: `system/build.js`

**What to change:** Copy `system/cars/` and `system/car-content/` to output if they exist.

**Current code (lines 148-154):**
```javascript
copyDir(path.join(projectDir, 'css'), path.join(projectDir, 'html', 'css'));
copyDir(path.join(projectDir, 'js'), path.join(projectDir, 'html', 'js'));
copyDir(path.join(projectDir, 'images'), path.join(projectDir, 'html', 'images'));
copyDir(path.join(projectDir, 'system', 'js'), path.join(projectDir, 'html', 'system', 'js'));
copyDir(path.join(projectDir, 'system', 'locales'), path.join(projectDir, 'html', 'system', 'locales'));
copyDir(path.join(projectDir, 'system', 'registry'), path.join(projectDir, 'html', 'system', 'registry'));
```

**Required behavior:**
```javascript
// Add after existing copyDir calls:
const carsDir = path.join(projectDir, 'system', 'cars');
const carContentDir = path.join(projectDir, 'system', 'car-content');
if (fs.existsSync(carsDir)) {
    copyDir(carsDir, path.join(projectDir, 'html', 'system', 'cars'));
}
if (fs.existsSync(carContentDir)) {
    copyDir(carContentDir, path.join(projectDir, 'html', 'system', 'car-content'));
}
```

**Why this is safe:** Until the directories are created, `fs.existsSync()` is `false` and nothing is copied. The build output is identical to today.

---

### 4.2 Files That Do NOT Need Changing

| File | Reason |
|------|--------|
| `js/car-renderer-registry.js` | Already has `_getLocalized()` which works with both embedded multilingual objects and flat objects. No change needed. |
| `js/i18n.js` | Language switching is decoupled from data loading. The existing `i18n:ready` listener + `renderSections()` re-render cycle works for both paths. |
| `system/templates/car-template.html` | If the generator uses regex replacement, the template's literal string can remain unchanged. The generator injects the new variable. |
| `system/schemas/master-car-schema.json` | Can remain as-is. The new schemas are for documentation, not enforcement. |
| `system/registry/*.json` (other than contentFile field) | No structural changes needed. |
| All guide generators/validators | Guides are out of scope. |

---

### 4.3 Change Summary Table

| File | Lines Changed | Risk | Backward Compatible? |
|------|--------------|------|---------------------|
| `js/car-renderer.js` | Constructor + `loadCarData()` | Low — wrapped in `try/catch` | Yes — defaults to `null` |
| `system/generators/car-page-generator.js` | Pre-injection block | Low — `fs.existsSync` guard | Yes — null if file missing |
| `system/validators/car-validator.js` | Add content file validation loop | Low — warnings only for missing files | Yes — existing validation untouched |
| `system/build.js` | Add 2 conditional `copyDir` calls | None — conditional on directory existence | Yes — no-op until directories exist |

**Total lines of production code changed:** ~30-40 lines across 4 files.

---

## 5. What This Plan Does NOT Do

To avoid scope creep, this plan explicitly excludes:

| Excluded Item | Reason |
|---------------|--------|
| Running migration scripts | User directive: "Do not run migration scripts" |
| Creating `system/cars/` or `system/car-content/` directories | User directive: "Do not create content files" |
| Archiving old files | User directive: "Do not archive anything" |
| Modifying RS7 narrative content | User directive: "Do not modify RS7 content" |
| Modifying locales architecture | User directive: "Do not modify locales architecture" |
| Enforcing new schemas via AJV | New schemas are documentation-only for now |
| Changing `system/data/` file contents | Zero data movement |
| Deleting dead Stage 0 artifacts | Harmless; can be cleaned up later |
| Updating README.md | Out of scope for Stage 1 |

---

## 6. Test Plan for Stage 1 (Post-Implementation)

After applying the 4 file changes:

1. **Build test:** Run `node system/build.js`. Must pass with zero errors and identical output to before.
2. **Renderer test:** Load `html/rs7.html` in browser. All sections must render identically.
3. **Language switch test:** Switch languages on RS7 page. All sections must re-render correctly.
4. **Null contentFile test:** Verify BMW M5 page (contentFile = null) renders identically.
5. **Network test:** Open DevTools Network tab. Confirm only `carDataFile` is fetched. No 404s for content files.

**Post-migration test (for Stage 2):**
1. Run `node system/scripts/migrate-car-content.js --car=audi-rs7-2026`
2. Re-run build
3. Verify `html/system/car-content/` exists with 4 language files
4. Load RS7 page. Confirm renderer fetches both facts + content files and merges them.
5. Verify `html/system/cars/audi-rs7-2026.json` exists and is smaller (no embedded narrative).

---

## 7. Recommendation

**Proceed with Stage 1 as described above.**

The 4-file change set is:
- **Minimal** (~30-40 lines)
- **Safe** (every new code path is guarded by a null check or `fs.existsSync`)
- **Backward compatible** (old cars continue to work identically)
- **Forward compatible** (when migration runs, the system automatically uses the new paths)

**Do NOT run the migration script until:**
1. These 4 code changes are implemented and tested
2. `system/cars/` and `system/car-content/` directories exist
3. A staging build is verified end-to-end

**The dead Stage 0 artifacts** (`car-schema.json`, `car-content-schema.json`, country stubs, and the RS7 dead `contentFile` pointer) can remain in place. They are harmless and do not interfere with the runtime. Clean them up in a future maintenance pass, not during migration.
