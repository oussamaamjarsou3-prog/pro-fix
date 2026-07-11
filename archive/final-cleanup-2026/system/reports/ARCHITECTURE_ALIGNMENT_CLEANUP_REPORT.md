# Architecture Alignment Cleanup Report — CarSpecio

**Date:** 2026-06-23
**Status:** Read-only audit complete. No modifications performed.
**Directive:** Revert migration debt. Preserve existing monolithic architecture.

---

## 1. Executive Summary

The repository contains migration artifacts from an aborted Stage 0/Stage 1 architecture migration. These artifacts are:
- **Harmless** to the build and runtime
- **Unused** by any production code
- **Misleading** to any developer reading the codebase

This report inventories every artifact, verifies the current single source of truth, and proposes a minimal cleanup that restores architectural clarity without touching any car data, locales, or runtime behavior.

---

## 2. Audit Methodology

Every claim was verified with `grep_search` and `list_dir` against the actual repository files. `node_modules/` was excluded from production relevance checks.

---

## 3. contentFile Reference Audit

### 3.1 Production Code & Data

| File | Matches | Context | Used at Runtime? |
|------|---------|---------|----------------|
| `system/registry/car-registry.json` | 6 | RS7: `"contentFile": "system/car-content/audi-rs7-2026-{lang}.json"` | **No** |
| `html/system/registry/car-registry.json` | 6 | Identical copy of above | **No** |
| `system/scripts/migrate-car-content.js` | 3 | Script reads `contentFile` from registry to determine output paths | Script never executed |

**Finding:** No JavaScript file in `js/`, `system/generators/`, `system/validators/`, or `system/build.js` reads the `contentFile` field. The renderer loads `carDataFile` only. The generator loads `car.dataFile` only. The validator checks `car.dataFile` existence only.

### 3.2 Documentation & Reports

The following reports mention `contentFile` in their text but do not modify any production files:

| Report | Mentions | Notes |
|--------|----------|-------|
| `system/reports/REALITY_ALIGNMENT_PLAN.md` | 29 | Proposes dual-path support (not implemented) |
| `system/reports/ARCHITECTURE_MIGRATION_PLAN.md` | 19 | Full migration plan (not implemented) |
| `system/reports/ARCHITECTURE_REALITY_AUDIT.md` | 16 | Audit finding (this report) |
| `system/reports/ARCHITECTURE_ALIGNMENT_REVIEW.md` | 7 | Original architecture review |
| `system/reports/MIGRATION_PLAN_PHASE1.md` | 2 | Phase 1 plan (not implemented) |
| `system/reports/MIGRATION_FINAL_SUMMARY.md` | 1 | Summary (not implemented) |
| `system/reports/MULTILINGUAL_MIGRATION_REPORT.md` | 1 | Multilingual migration report |

**Conclusion:** `contentFile` is a registry field with zero runtime consumers. It is safe to remove.

---

## 4. car-schema.json Reference Audit

### 4.1 Production Code

| File | Matches | Context | Used at Runtime? |
|------|---------|---------|----------------|
| `system/schemas/car-schema.json` | 1 | Self-reference in its own `$id` field | **Dead file** |
| `system/validators/car-validator.js` | 2 | NOT referencing car-schema.json. Line 3 says "Validates car data files against master-car-schema.json". Line 15 loads `master-car-schema.json`. | **No** |
| `system/tests/schema-validation.test.js` | 1 | Tests `master-car-schema.json` | **No** |

**Finding:** Zero production code loads or validates against `car-schema.json`.

### 4.2 Documentation & Reports

| Report | Mentions | Notes |
|--------|----------|-------|
| `system/reports/ARCHITECTURE_REALITY_AUDIT.md` | 14 | Audit finding |
| `system/reports/ARCHITECTURE_MIGRATION_PLAN.md` | 7 | Proposed schema separation |
| `system/reports/REALITY_ALIGNMENT_PLAN.md` | 6 | Proposed usage |
| `docs/ARCHITECTURE_AUDIT_REPORT.md` | 6 | Documentation reference |
| `.archived-backup/reports/ARCHITECTURE_AUDIT_PLAN.md` | 5 | Archived report |
| `system/README.md` | 4 | Mentions `master-car-schema.json` only, NOT `car-schema.json` |
| `docs/CURRENT_SYSTEM_SCHEMA.md` | 3 | Documentation |
| `system/reports/CAR_CONTENT_EXPANSION_PLAN.md` | 3 | Expansion plan |
| `docs/DATA_ARCHITECTURE.md` | 2 | Documentation |
| `system/reports/FINAL_ARCHITECTURE_AUDIT.md` | 2 | Audit report |
| `system/reports/MIGRATION_PLAN_PHASE1.md` | 2 | Phase 1 plan |
| `system/reports/MULTILINGUAL_MIGRATION_REPORT.md` | 2 | Migration report |
| `system/reports/ARCHITECTURE_ALIGNMENT_REVIEW.md` | 1 | Alignment review |
| `system/reports/GUIDES_ARCHITECTURE.md` | 1 | Guides architecture |
| `system/reports/MULTILINGUAL_ARCHITECTURE_AUDIT.md` | 1 | Audit report |
| `system/reports/PHASE2_IMPLEMENTATION_REPORT.md` | 1 | Phase 2 report |
| `system/reports/POWERTRAIN_MIGRATION_REPORT.md` | 1 | Powertrain report |
| `.archived-backup/reports/CAR_DATA_VERIFICATION.md` | 1 | Archived report |
| `docs/DATA_AUDIT_REPORT.md` | 1 | Documentation |

**Conclusion:** `car-schema.json` is a dead file with zero runtime or build-time consumers. It is safe to delete.

---

## 5. car-content-schema.json Reference Audit

### 5.1 Production Code

| File | Matches | Context | Used at Runtime? |
|------|---------|---------|----------------|
| `system/schemas/car-content-schema.json` | 1 | Self-reference in its own `$id` field | **Dead file** |

**Finding:** Zero production code references `car-content-schema.json`.

### 5.2 Documentation & Reports

| Report | Mentions | Notes |
|--------|----------|-------|
| `system/reports/ARCHITECTURE_REALITY_AUDIT.md` | 6 | Audit finding |
| `system/reports/ARCHITECTURE_MIGRATION_PLAN.md` | 4 | Proposed schema separation |
| `system/reports/REALITY_ALIGNMENT_PLAN.md` | 3 | Proposed usage |
| `system/reports/ARCHITECTURE_ALIGNMENT_REVIEW.md` | 1 | Alignment review |
| `system/reports/MULTILINGUAL_MIGRATION_REPORT.md` | 1 | Migration report |

**Conclusion:** `car-content-schema.json` is a dead file. Safe to delete.

---

## 6. Migration Artifact Audit

### 6.1 Artifact Inventory

| Artifact | Type | Status | Impact if Removed |
|----------|------|--------|-------------------|
| `system/schemas/car-schema.json` | Dead schema | Never loaded | None |
| `system/schemas/car-content-schema.json` | Dead schema | Never loaded | None |
| `system/countries/spain.json` | Stub | Never read | None |
| `system/countries/uk.json` | Stub | Never read | None |
| `system/countries/france.json` | Stub | Never read | None |
| `system/countries/germany.json` | Stub | Never read | None |
| `system/countries/usa.json` | Stub | Never read | None |
| `system/scripts/migrate-car-content.js` | Script | Never executed | None |
| `system/scripts/migrate-rs7-multilingual.js` | Script | Already executed (RS7 now has multilingual content) | **Cannot remove** — it is the historical record of how RS7 content was populated |
| `system/scripts/archive/populate-rs7.js` | Archived script | Never executed | Already archived |
| `system/scripts/archive/analyze-rs7-content.js` | Archived script | Never executed | Already archived |
| `system/reports/REALITY_ALIGNMENT_PLAN.md` | Report | Read-only | Safe to archive |
| `system/reports/ARCHITECTURE_MIGRATION_PLAN.md` | Report | Read-only | Safe to archive |
| `system/reports/ARCHITECTURE_REALITY_AUDIT.md` | Report | Read-only | Safe to keep as reference |
| `system/reports/ARCHITECTURE_ALIGNMENT_REVIEW.md` | Report | Read-only | Safe to archive |
| `system/reports/MIGRATION_PLAN_PHASE1.md` | Report | Read-only | Safe to archive |
| `system/reports/MIGRATION_FINAL_SUMMARY.md` | Report | Read-only | Safe to archive |
| `system/registry/car-registry.json` `contentFile` field | Registry data | Dead pointer | Safe to remove from all 6 entries |
| `html/system/registry/car-registry.json` `contentFile` field | Registry copy | Dead pointer | Safe to remove (regenerated on next build) |

### 6.2 Artifact that MUST be Preserved

| Artifact | Reason |
|----------|--------|
| `system/scripts/migrate-rs7-multilingual.js` | This script was **executed**. It is the audit trail for how the RS7's multilingual content (review, drivingExperience, etc.) was populated. Removing it would erase the provenance of live data. It has no references to `contentFile`, `car-schema`, or `car-content-schema`. |
| `system/scripts/archive/` contents | Already safely archived. No action needed. |

---

## 7. Source of Truth Verification

### 7.1 Per-Car Verification

| Car | File Path | Exists? | Size | Embedded Multilingual? | Sole Source? |
|-----|-----------|---------|------|------------------------|--------------|
| Audi RS7 | `system/data/rs7-2026.json` | Yes | 162 KB | Yes (all 8 sections, 4 languages) | **Yes** |
| BMW M5 | `system/data/bmw-m5-2026.json` | Yes | 31 KB | No (facts only) | **Yes** |
| Audi RS3 | `system/data/audi-rs3-2026.json` | Yes | 31 KB | No (facts only) | **Yes** |
| Mercedes AMG GT | `system/data/mercedes-amg-gt-2026.json` | Yes | 31 KB | No (facts only) | **Yes** |
| Nissan GT-R | `system/data/nissan-gtr-2026.json` | Yes | 31 KB | No (facts only) | **Yes** |
| Porsche 911 | `system/data/porsche-911-2026.json` | Yes | 31 KB | No (facts only) | **Yes** |

**Finding:** Each car has exactly ONE JSON file. No splits, no duplicates, no content files.

### 7.2 Build Verification

Running the build produces the following output (verified from `system/build.js`):

```
html/
  css/          ← from css/
  js/           ← from js/
  images/       ← from images/
  system/
    js/         ← from system/js/
    locales/    ← from system/locales/
    registry/   ← from system/registry/
```

`system/data/` is **not copied** to `html/system/data/`. Car data is pre-injected into each HTML page by `car-page-generator.js` as `window.__preloadedCarData`.

**Finding:** There is no secondary copy of car data in the build output. The monolithic files in `system/data/` are the sole source.

---

## 8. Backward Compatibility Assessment

The current multilingual model works as follows:

```
system/data/rs7-2026.json
├── basicInfo, specs, performance, dimensions, pricing, images, seo
├── content (legacy)
├── review
│   ├── es: { summary, fullText, verdict, ... }
│   ├── en: { summary, fullText, verdict, ... }
│   ├── fr: { summary, fullText, verdict, ... }
│   └── ar: { summary, fullText, verdict, ... }
├── drivingExperience
│   ├── es, en, fr, ar
├── exteriorDesign
│   ├── es, en, fr, ar
├── interior
│   ├── es, en, fr, ar
├── technology
│   ├── es, en, fr, ar
├── safety
│   ├── es, en, fr, ar
├── runningCosts
│   ├── es, en, fr, ar
└── ownership
    ├── es, en, fr, ar
```

The renderer (`js/car-renderer.js`) and section renderers (`js/car-renderer-registry.js`) use `_getLocalized(data, lang)` to extract the correct language from these embedded objects. The `i18n:ready` event re-triggers `renderSections()` on language switch.

**This model is fully functional and must be preserved.** None of the proposed cleanup changes affect this structure.

---

## 9. Proposed Cleanup Actions

**All actions are deletions or removals only. No data is moved, split, or regenerated.**

### 9.1 Safe to Delete (Zero Runtime Impact)

| # | Action | File/Field | Reason |
|---|--------|-----------|--------|
| 1 | **Delete file** | `system/schemas/car-schema.json` | Dead schema, never loaded by any code |
| 2 | **Delete file** | `system/schemas/car-content-schema.json` | Dead schema, never loaded by any code |
| 3 | **Delete directory** | `system/countries/` (and 5 stub files inside) | No code references this directory or any file within it |
| 4 | **Delete file** | `system/scripts/migrate-car-content.js` | Migration script for abandoned architecture. Never executed. |
| 5 | **Delete file** | `system/reports/REALITY_ALIGNMENT_PLAN.md` | Proposes architecture that is now abandoned. Misleading to future readers. |
| 6 | **Delete file** | `system/reports/ARCHITECTURE_MIGRATION_PLAN.md` | Full migration plan for abandoned architecture. Misleading. |
| 7 | **Delete file** | `system/reports/ARCHITECTURE_ALIGNMENT_REVIEW.md` | Original review that recommended migration. Now obsolete. |
| 8 | **Delete file** | `system/reports/MIGRATION_PLAN_PHASE1.md` | Phase 1 plan for abandoned architecture. |
| 9 | **Delete file** | `system/reports/MIGRATION_FINAL_SUMMARY.md` | Summary of abandoned migration. |

### 9.2 Safe to Modify (Zero Runtime Impact)

| # | Action | File/Field | Reason |
|---|--------|-----------|--------|
| 10 | **Remove field** | `contentFile` from all 6 entries in `system/registry/car-registry.json` | Dead pointer. No code reads it. Removing it eliminates confusion. |
| 11 | **Remove references** | In `system/README.md`, remove any sentences that mention `car-schema.json` or `car-content-schema.json` or `system/cars/` or `system/car-content/` | README should describe the actual architecture, not the abandoned one. |

### 9.3 Must Preserve

| # | Item | Reason |
|---|------|--------|
| 12 | `system/scripts/migrate-rs7-multilingual.js` | This script created the live RS7 multilingual content. It is the audit trail. |
| 13 | `system/scripts/archive/` | Already safely archived. |
| 14 | `system/reports/ARCHITECTURE_REALITY_AUDIT.md` | Accurate record of current state. Should be kept. |
| 15 | `system/reports/MULTILINGUAL_MIGRATION_REPORT.md` | Accurate record of RS7 multilingual implementation. Should be kept. |
| 16 | `system/reports/RS7_MULTILINGUAL_COVERAGE.md` | Accurate record of RS7 content coverage. Should be kept. |
| 17 | All `system/data/*.json` files | These are the live data. Zero changes. |
| 18 | All `system/locales/*.json` files | Live UI translations. Zero changes. |
| 19 | `system/schemas/master-car-schema.json` | Authoritative schema. Zero changes. |
| 20 | `js/car-renderer.js` and `js/car-renderer-registry.js` | Live renderers. Zero changes. |
| 21 | `system/build.js` and all generators/validators | Live build system. Zero changes. |

---

## 10. Files NOT Proposed for Change

The following files are mentioned in migration reports but are part of the live system and must remain untouched:

| File | Reason |
|------|--------|
| `js/car-renderer.js` | Live renderer. Works correctly with embedded multilingual content. |
| `js/car-renderer-registry.js` | Live section renderers. `_getLocalized()` works correctly. |
| `system/generators/car-page-generator.js` | Live generator. Preloads car data correctly. |
| `system/validators/car-validator.js` | Live validator. Validates monolithic files correctly. |
| `system/build.js` | Live build orchestrator. No references to dead artifacts. |
| `system/registry/car-registry.json` (structure) | Only the `contentFile` field is dead. The rest is live. |
| `system/schemas/master-car-schema.json` | Authoritative schema. Do not modify. |
| `system/data/*.json` | Live car data. Do not modify. |
| `system/locales/*.json` | Live UI translations. Do not modify. |

---

## 11. Verification After Cleanup

After applying the proposed changes, the following must remain true:

1. `node system/build.js` passes with zero errors.
2. `node system/validators/car-validator.js` passes for all 6 cars.
3. `node system/validators/registry-validator.js` passes.
4. All 6 generated HTML pages render identically in a browser.
5. Language switching on RS7 page works identically.
6. No file in `system/data/` has been modified.
7. No file in `system/locales/` has been modified.
8. No file in `js/` has been modified.

---

## 12. Summary of Proposed Changes

- **9 files deleted** (dead schemas, stubs, unused scripts, obsolete reports)
- **1 directory deleted** (`system/countries/`)
- **1 field removed** (`contentFile` from 6 registry entries)
- **1 file edited** (`system/README.md` to remove references to abandoned architecture)
- **0 files created**
- **0 car data files modified**
- **0 locales modified**
- **0 runtime code modified**

**Risk:** Zero. Every deleted file or field is confirmed dead by grep_search across all production code.

**Next step:** Await approval before executing cleanup.
