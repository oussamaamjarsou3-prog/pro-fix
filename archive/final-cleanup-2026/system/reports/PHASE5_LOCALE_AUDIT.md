# Phase 5 — Locale & Hardcoded Values Audit

**Date:** June 2026
**Scope:** All new centralized JS files + locale JSON files

---

## Locale JSON Files (system/locales/)

| File | Hardcoded Vehicle Names | Hardcoded Country Names | Status |
|------|------------------------|------------------------|--------|
| `es.json` | None found | Country names are keys ("es", "fr", "gb") — acceptable | ✅ Clean |
| `en.json` | None found | Country names are keys — acceptable | ✅ Clean |
| `fr.json` | None found | Country names are keys — acceptable | ✅ Clean |
| `ar.json` | None found | Country names are keys — acceptable | ✅ Clean |

**Note:** "Saudi Arabia" contains "audi" as substring but is a country name, not a vehicle reference.

---

## New Centralized JS Files Audit

### 1. `js/car-renderer.js`

| Line | Hardcoded Value | Context | Risk Level |
|------|----------------|---------|------------|
| 275 | `v.id === 'rs7-sportback' ? 'sportbackDesc' : v.id === 'rs7-performance' ? 'performanceDesc' : 'carbonDesc'` | Version description i18n key mapping | 🟡 MEDIUM |

**Analysis:** This maps specific version IDs to i18n keys. For non-RS7 cars, it falls back to `'carbonDesc'` which may not exist.

**Recommendation (future):** Make the i18n key derive from `v.slug` or `v.id` directly (e.g., `versions.${v.slug}Desc`), ensuring translation files follow this convention for all cars.

**Current mitigation:** The default text content is `Versión ${v.name}`, so even if the i18n key doesn't match, the version name is still displayed.

### 2. `js/cost-calculator.js`

| Line | Hardcoded Value | Context | Risk Level |
|------|----------------|---------|------------|
| 106–107 | `document.getElementById("barRs7")` / `document.getElementById("barRs7Val")` | Comparison bar fallback IDs | 🟢 LOW |
| 158–159 | `t("quizResults.rs7")` / `t("quizResults.m5")` | Quiz result translation fallback keys | 🟢 LOW |
| 181–182 | `pts === "rs7"` / `pts === "m5"` | Quiz data-points attribute values | 🟢 LOW |

**Analysis:** All three are **backward-compatibility fallbacks** for RS7.
- The `barRs7` IDs are only used if `barComparison` is not found
- The `quizResults.rs7` keys are only used if `quizResults.car1` is not found
- The `"rs7"`/`"m5"` data-points are supported alongside the new `"car1"`/`"car2"` values

**Impact on new cars:** None. New cars will use `barComparison`, `quizResults.car1`, and `data-points="car1"`.

---

## Template Files

### `system/templates/car-template.html`

| Line | Hardcoded Value | Context | Risk Level |
|------|----------------|---------|------------|
| 628 | `const carDataFile = '../system/data/rs7-2026.json'` | Default data file path | 🟢 LOW |
| 642 | `applyCountry('ES')` | Default country | 🟢 LOW |

**Analysis:** Both are template defaults that get replaced by `car-page-generator.js` for each car. The generator already handles this correctly.

### `rs7.html` (root, reference page)

**Status:** Not audited as part of Phase 5 per user instructions — RS7 is the reference source, not a target for cleanup during migration.

---

## Summary

| Category | Findings | Action Taken |
|----------|----------|--------------|
| Locale JSON files | No vehicle-specific hardcoded values | None needed |
| `car-renderer.js` | One version i18n mapping is RS7-specific | Documented for future improvement; fallback text keeps it working |
| `cost-calculator.js` | Three RS7 backward-compatibility fallbacks | Intentional and safe; do not remove |
| Template | Default values replaced by generator | Already handled by generator |

**Phase 5 Status:** ✅ Complete

**No critical hardcoded values found that would break new car pages.**

---

## Recommendations for Future Cleanup (Post-Validation)

1. **Version i18n keys:** Update `car-renderer.js` line 275 to use `versions.${v.slug}Desc` instead of the RS7-specific ternary. Update all locale JSONs to match.

2. **Remove RS7 fallbacks:** After RS7 is fully migrated and tested, remove:
   - `document.getElementById("barRs7")` fallback
   - `t("quizResults.rs7")` fallback
   - `"rs7"` / `"m5"` quiz data-points support

3. **These should only be done after:**
   - RS7 inline code is confirmed removed
   - All generated pages are verified working
   - `car-page-generator.js` is confirmed generating correct data
