# JavaScript Inventory — rs7.html (lines 2418–3404)
## Detailed Function Map for Safe Migration

---

## How to read this inventory

| Column | Meaning |
|--------|---------|
| **Function** | Name and signature |
| **Purpose** | What it does |
| **Dependencies** | External globals, DOM IDs, other functions it calls |
| **Lines in RS7** | Exact location in rs7.html |
| **Target File** | Where this function will be migrated |
| **RS7-Only** | `YES` if this function contains RS7-specific hardcoded values |
| **Duplicate** | `YES` if a simpler version already exists in car-template.html |
| **Back-compat** | How RS7 will keep working during migration |

---

## Block A — Car Data Loading & Rendering (lines 2418–2856)

### A1. Global Error Handler
| Field | Value |
|-------|-------|
| **Function** | `window.onerror = function(msg, url, line, col, err)` |
| **Purpose** | Logs all JS errors to console with RS7 tag |
| **Dependencies** | `console.error` |
| **Lines** | 2421–2424 |
| **Target** | `js/car-renderer.js` (optional, generic) |
| **RS7-Only** | NO (generic pattern) |
| **Duplicate** | NO |
| **Back-compat** | Keep in rs7.html until tested |

---

### A2. loadCarData (MAIN FUNCTION)
| Field | Value |
|-------|-------|
| **Function** | `async function loadCarData()` |
| **Purpose** | Fetches JSON, calls setCarData, applies pageText, renders all dynamic sections |
| **Dependencies** | `setCarData`, `applyTranslations`, `t`, `currentLang`, `currentCountry`, `countryData`, `setupCountryData`, `applyCountry`, `updateCalculator`, `updateProfileLabels`, `showContent` |
| **Lines** | 2426–2763 |
| **Target** | `js/car-renderer.js` |
| **RS7-Only** | NO (generic for any car) |
| **Duplicate** | PARTIAL — template has `initPage()` + `CarRenderer` placeholder but no real implementation |
| **Back-compat** | Keep rs7.html inline untouched. New file will be loaded via `<script>` but rs7 won't use it yet |

---

### A3. replacePlaceholders (nested helper)
| Field | Value |
|-------|-------|
| **Function** | `function replacePlaceholders(val)` (nested inside loadCarData) |
| **Purpose** | Replaces `{{key}}` with values from carData + countryData (same logic as i18n.js t()) |
| **Dependencies** | `carData`, `currentCountry`, `countryData` |
| **Lines** | 2456–2503 |
| **Target** | `js/car-renderer.js` |
| **RS7-Only** | NO |
| **Duplicate** | NO — i18n.js has t() but doesn't merge carData + countryData the same way |
| **Back-compat** | Keep inline. Will be extracted as helper in car-renderer.js |

---

### A4. applyPageText (nested inside loadCarData)
| Field | Value |
|-------|-------|
| **Function** | `const applyPageText = () => {...}` |
| **Purpose** | Injects pageText content into DOM elements: score.desc, worth.desc, pros/cons, FAQ, timeline, profileData, usedGuide, depreciation, versions |
| **Dependencies** | `pt` (pageText from carData), `replacePlaceholders`, DOM selectors |
| **Lines** | 2505–2562 |
| **Target** | `js/car-renderer.js` |
| **RS7-Only** | NO (reads from carData.pageText) |
| **Duplicate** | NO |
| **Back-compat** | Keep inline |

---

### A5. showContent
| Field | Value |
|-------|-------|
| **Function** | `function showContent()` |
| **Purpose** | Hides #pageLoader and adds .content-ready class |
| **Dependencies** | `document.getElementById('pageLoader')`, `document.body` |
| **Lines** | 2768–2782 |
| **Target** | `js/car-renderer.js` |
| **RS7-Only** | NO |
| **Duplicate** | **YES — car-template.html has TWO copies** (lines 652–656 and 737–741) |
| **Back-compat** | Keep inline. When centralized, RS7 will have its own copy still working |

---

### A6. safeLoadCarData
| Field | Value |
|-------|-------|
| **Function** | `async function safeLoadCarData()` |
| **Purpose** | Deduplication wrapper — ensures loadCarData runs only once |
| **Dependencies** | `carDataLoaded` flag, `loadCarData()` |
| **Lines** | 2788–2795 |
| **Target** | `js/car-renderer.js` |
| **RS7-Only** | NO |
| **Duplicate** | NO |
| **Back-compat** | Keep inline |

---

### A7. Event Listeners (inside Block A)

| Listener | Lines | Purpose | Target |
|----------|-------|---------|--------|
| `document.addEventListener('i18n:ready', ...)` | 2797–2800 | Triggers safeLoadCarData when translations ready | `js/car-renderer.js` |
| `document.readyState` check + `setTimeout(safeLoadCarData, 100)` | 2803–2806 | Fallback if DOM already ready | `js/car-renderer.js` |
| `setTimeout` diagnostic (1000ms) | 2810–2821 | Logs carData and element states | **KEEP IN RS7 ONLY** (debugging) |
| `setTimeout` fallback (3000ms) | 2824–2831 | Shows content even if loading failed | `js/car-renderer.js` |
| `document.addEventListener('DOMContentLoaded', ...)` | 2834–2842 | Logs script availability | **KEEP IN RS7 ONLY** |
| `window.addEventListener('load', ...)` | 2845–2848 | Logs window load state | **KEEP IN RS7 ONLY** |

**Decision:** The diagnostic logging listeners (lines 2810–2848) are RS7-specific debugging. They will **NOT** be migrated to the centralized system.

---

## Block B — Cost Calculator (lines 2858–3040)

### B1. getConsumptionMap
| Field | Value |
|-------|-------|
| **Function** | `function getConsumptionMap()` |
| **Purpose** | Returns driving style consumption map from carData or fallback hardcoded |
| **Dependencies** | `carData` global |
| **Lines** | 2874–2879 |
| **Target** | `js/cost-calculator.js` |
| **RS7-Only** | NO |
| **Duplicate** | **YES — car-template.html has identical function (lines 675–680)** |
| **Back-compat** | Keep inline. Template version is identical, so migration is safe |

---

### B2. animateCounter
| Field | Value |
|-------|-------|
| **Function** | `function animateCounter(elementId, targetValue, formatFn)` |
| **Purpose** | Animated number transition using requestAnimationFrame with ease-out-quart |
| **Dependencies** | `document.getElementById`, `requestAnimationFrame`, `lastCalcValues` |
| **Lines** | 2885–2933 |
| **Target** | `js/cost-calculator.js` |
| **RS7-Only** | NO |
| **Duplicate** | NO — template version does NOT have animation |
| **Back-compat** | Keep inline. This is the advanced version that template lacks |

---

### B3. highlightValue
| Field | Value |
|-------|-------|
| **Function** | `function highlightValue(elementId, newValue)` |
| **Purpose** | Wraps animateCounter with currency formatting (uses countryData) |
| **Dependencies** | `countryData`, `currentCountry`, `animateCounter` |
| **Lines** | 2935–2946 |
| **Target** | `js/cost-calculator.js` |
| **RS7-Only** | NO |
| **Duplicate** | NO |
| **Back-compat** | Keep inline |

---

### B4. updateCalculator (FULL VERSION)
| Field | Value |
|-------|-------|
| **Function** | `function updateCalculator()` |
| **Purpose** | Calculates fuel, insurance, maintenance, depreciation costs. Updates all DOM elements with animation via highlightValue. Also updates comparison bar (barRs7) |
| **Dependencies** | `annualKm`, `fuelPrice`, `purchaseType`, `drivingStyle`, `countryData`, `currentCountry`, `getConsumptionMap`, `highlightValue`, `formatMoney`, `formatFuelDisplay`, `t()` |
| **Lines** | 2949–3028 |
| **Target** | `js/cost-calculator.js` |
| **RS7-Only** | **PARTIAL — contains `barRs7` / `barRs7Val` which are RS7-specific IDs** |
| **Duplicate** | **YES — car-template.html has simpler version (lines 682–725)** without: animation, perKmLine with t(), comparison bar, barRs7 |
| **Back-compat** | Keep inline. The centralized version will be the advanced one that replaces the template's simpler version |

**Important:** The template's `updateCalculator` (lines 682–725) will be **replaced** by the centralized advanced version. The template version lacks:
- `animateCounter` / `highlightValue`
- `barRs7` comparison bar
- `perKmLine` with `t("calc.perKmLine")` translation
- Safety checks (`if (!annualKm) return` is present in both)

---

### B5. Event Listeners for Calculator Inputs
| Field | Value |
|-------|-------|
| **Code** | `[annualKm, fuelPrice, purchaseType, drivingStyle].forEach(el => el.addEventListener("input", updateCalculator))` |
| **Purpose** | Re-calculates on any input change |
| **Lines** | 3031–3035 |
| **Target** | `js/cost-calculator.js` (init function) |
| **RS7-Only** | NO |
| **Duplicate** | **YES — car-template.html has similar (lines 727–731)** |
| **Back-compat** | Keep inline |

---

## Block C — Profile Score (lines 3041–3119)

### C1. profileBarsData (const)
| Field | Value |
|-------|-------|
| **Variable** | `const profileBarsData = {...}` |
| **Purpose** | Hardcoded scores for 5 driving profiles: highway, city, family, collector, track |
| **Dependencies** | None (pure data) |
| **Lines** | 3044–3056 |
| **Target** | `js/cost-calculator.js` |
| **RS7-Only** | **YES — scores [95,90,75,80] etc are specific to RS7 rating** |
| **Duplicate** | NO |
| **Back-compat** | Keep inline. Centralized version should read from `carData.rating.profiles` if available, fallback to this data |

---

### C2. setProfile
| Field | Value |
|-------|-------|
| **Function** | `function setProfile(profile)` |
| **Purpose** | Updates profile card active state, score value, title, description, and bar widths based on profileBarsData |
| **Dependencies** | `profileBarsData`, `profileCards`, `profileScoreValue`, `profileResultTitle`, `profileResultDesc`, `profileBars`, `t()`, `carData.pageText` |
| **Lines** | 3070–3103 |
| **Target** | `js/cost-calculator.js` |
| **RS7-Only** | NO (reads from carData.pageText when available) |
| **Duplicate** | NO |
| **Back-compat** | Keep inline |

---

### C3. updateProfileLabels
| Field | Value |
|-------|-------|
| **Function** | `function updateProfileLabels()` |
| **Purpose** | Calls setProfile with the currently active profile card |
| **Dependencies** | `setProfile`, DOM querySelector |
| **Lines** | 3106–3110 |
| **Target** | `js/cost-calculator.js` |
| **RS7-Only** | NO |
| **Duplicate** | NO |
| **Back-compat** | Keep inline |

---

### C4. Profile Card Click Listeners
| Field | Value |
|-------|-------|
| **Code** | `profileCards.forEach(card => card.addEventListener("click", () => setProfile(card.dataset.profile)))` |
| **Purpose** | Switch profile on card click |
| **Lines** | 3113–3117 |
| **Target** | `js/cost-calculator.js` (init function) |
| **RS7-Only** | NO |
| **Duplicate** | NO |
| **Back-compat** | Keep inline |

---

## Block D — Quiz (lines 3120–3223)

### D1. Quiz State Variables
| Field | Value |
|-------|-------|
| **Variables** | `quizStep`, `quizRs7`, `quizM5`, `quizSteps`, `quizResult`, `quizProgress` |
| **Purpose** | Track quiz progress and scores |
| **Lines** | 3123–3133 |
| **Target** | `js/cost-calculator.js` |
| **RS7-Only** | **YES — variable names `quizRs7` and `quizM5` are RS7 vs M5 specific** |
| **Duplicate** | NO |
| **Back-compat** | Keep inline |

---

### D2. getQuizTexts
| Field | Value |
|-------|-------|
| **Function** | `function getQuizTexts()` |
| **Purpose** | Returns translated quiz result texts using t() |
| **Dependencies** | `t()` |
| **Lines** | 3136–3150 |
| **Target** | `js/cost-calculator.js` |
| **RS7-Only** | NO |
| **Duplicate** | NO |
| **Back-compat** | Keep inline |

---

### D3. Quiz Logic (anonymous listener)
| Field | Value |
|-------|-------|
| **Function** | Anonymous click listener on `.quiz-opt` buttons |
| **Purpose** | Steps through 4 quiz questions, accumulates points for rs7 vs m5, shows result |
| **Dependencies** | `quizStep`, `quizRs7`, `quizM5`, `quizSteps`, `quizResult`, `quizProgress`, `getQuizTexts`, `t()`, `carData.comparisons` |
| **Lines** | 3153–3223 |
| **Target** | `js/cost-calculator.js` |
| **RS7-Only** | **YES — hardcodes "Audi RS7" and "BMW M5" as winner strings (lines 3194, 3200)** |
| **Duplicate** | NO |
| **Back-compat** | Keep inline. Centralized version will read comparison car names from `carData.comparisons` |

---

## Block E — Scroll Top Button (lines 3226–3254)

### E1. Scroll Top Button Creation & Logic
| Field | Value |
|-------|-------|
| **Function** | Inline code (no named function) |
| **Purpose** | Creates a scroll-to-top button dynamically, toggles visibility on scroll > 600px, smooth scroll on click |
| **Dependencies** | `document.createElement`, `window.scrollY`, `window.scrollTo` |
| **Lines** | 3232–3254 |
| **Target** | `js/cost-calculator.js` (as `initScrollTop()`) |
| **RS7-Only** | NO |
| **Duplicate** | NO |
| **Back-compat** | Keep inline |

---

## Block F — Footer Newsletter (lines 3256–3291)

### F1. handleFooterSubscribe
| Field | Value |
|-------|-------|
| **Function** | `function handleFooterSubscribe(e)` |
| **Purpose** | Validates email, shows loading/success states on newsletter form |
| **Dependencies** | `t('footer.subscribing')`, `t('footer.subscribed')`, DOM form elements |
| **Lines** | 3257–3291 |
| **Target** | `js/cost-calculator.js` (or separate util — generic enough) |
| **RS7-Only** | NO |
| **Duplicate** | NO |
| **Back-compat** | Keep inline |

---

## Block G — Overflow Diagnostic (lines 3293–3364)

### G1. diagnoseOverflow (IIFE)
| Field | Value |
|-------|-------|
| **Function** | `(function diagnoseOverflow() {...})()` — IIFE |
| **Purpose** | Diagnostic tool: finds DOM elements wider than viewport, logs reasons. Also deep-inspects header and car-nav |
| **Dependencies** | `window.innerWidth`, `document.querySelectorAll`, `getComputedStyle` |
| **Lines** | 3294–3364 |
| **Target** | **DO NOT MIGRATE** — debugging tool only |
| **RS7-Only** | YES (development tool) |
| **Duplicate** | NO |
| **Back-compat** | Keep in rs7.html only |

---

## Block H — Emergency Fallback (lines 3369–3399)

### H1. emergencyFill (IIFE)
| Field | Value |
|-------|-------|
| **Function** | `(function emergencyFill() {...})()` — IIFE |
| **Purpose** | After 2s delay, checks if score.desc, worth.desc, pros.items, cons.items are empty and fills them with fallback text |
| **Dependencies** | `document.querySelector`, hardcoded Spanish text |
| **Lines** | 3371–3398 |
| **Target** | `js/emergency-fallback.js` |
| **RS7-Only** | **YES — hardcoded Spanish text specific to RS7** |
| **Duplicate** | NO |
| **Back-compat** | Keep inline. Centralized version will read fallback from `carData.pageText` |

**Hardcoded values to remove:**
```javascript
'Excelente combinación entre lujo, potencia y confort premium.'
'Sí. El RS7 combina lujo, tecnología, potencia extrema y confort premium...'
'✔ Sonido V8 brutal', '✔ Interior premium'...
'✖ Consumo elevado', '✖ Seguro caro'...
```

---

## Duplicate Analysis: RS7 vs Template

| Function | RS7 Version | Template Version | Decision |
|----------|-------------|------------------|----------|
| `showContent()` | Lines 2768–2782 | Lines 652–656 + 737–741 | RS7 version is the canonical one. Template has **two copies** of the same function. Will unify in car-renderer.js |
| `getConsumptionMap()` | Lines 2874–2879 | Lines 675–680 | **IDENTICAL** — safe to replace template with centralized |
| `updateCalculator()` | Lines 2949–3028 (advanced) | Lines 682–725 (basic) | RS7 version is **superset** — has animation, comparison bar, translated perKmLine. Will replace template version |
| Calculator input listeners | Lines 3031–3035 | Lines 727–731 | Nearly identical. Centralized version will init automatically |

---

## Functions NOT in RS7 but referenced

These are defined in other files and used by RS7 code. They must exist for the centralized system:

| Function | Source File | Used By | Status |
|----------|-------------|---------|--------|
| `setCarData(data)` | `js/i18n.js` | `loadCarData` | ✅ Exists |
| `applyTranslations()` | `js/i18n.js` | `loadCarData` | ✅ Exists |
| `t(key, vars)` | `js/i18n.js` | `loadCarData`, `updateCalculator`, `setProfile`, `getQuizTexts` | ✅ Exists |
| `currentLang` | `js/i18n.js` | `loadCarData` | ✅ Exists |
| `setupCountryData(carData)` | `system/js/country-manager.js` | `loadCarData` | ✅ Exists |
| `applyCountry(code)` | `system/js/country-manager.js` | `loadCarData`, `initPage` | ✅ Exists |
| `getFuelCostPerLiter(price)` | `js/country-data.js` or `system/js/country-manager.js` | `updateCalculator` | ✅ Exists |
| `formatMoney(amount)` | `js/country-data.js` or `system/js/country-manager.js` | `updateCalculator`, `highlightValue` | ✅ Exists |
| `formatFuelDisplay(price, country)` | `js/country-data.js` or `system/js/country-manager.js` | `updateCalculator` | ✅ Exists |
| `updateCalculator()` | Called from `applyCountry` | `loadCarData` after country setup | ✅ Will be centralized |
| `CarRenderer` | Referenced in template only | `initPage` | ❌ **DOES NOT EXIST** — was planned but never built |

---

## Recommended Extraction Order

### Group 1 — Car Renderer Core (js/car-renderer.js)
```javascript
loadCarData()           // Main orchestrator
replacePlaceholders()   // String helper (can also be used by i18n.js)
applyPageText()         // DOM injection from pageText
showContent()           // Loader management
safeLoadCarData()       // Deduplication wrapper
```

**Plus inline event wiring:**
- i18n:ready listener
- DOM ready fallback
- 3s timeout fallback

**NOT migrated:**
- Diagnostic logging (lines 2810–2848)

### Group 2 — Cost Calculator (js/cost-calculator.js)
```javascript
getConsumptionMap()     // Consumption data reader
animateCounter()        // Number animation
highlightValue()        // Currency formatting + animation
updateCalculator()      // Full calculator logic
setProfile()            // Profile card switching
updateProfileLabels()   // Initialize profile
getQuizTexts()          // Quiz translation helper
initQuiz()              // Quiz step logic (refactored from anonymous listener)
initScrollTop()         // Scroll-to-top button
handleFooterSubscribe() // Newsletter form
```

### Group 3 — Emergency Fallback (js/emergency-fallback.js)
```javascript
emergencyFill()         // Generic fallback, reads from carData.pageText
```

---

## RS7-Specific Elements That Must Be Generalized

| Element | RS7 Value | Generalized Source |
|---------|-----------|-------------------|
| `barRs7` / `barRs7Val` IDs | Hardcoded in updateCalculator | Remove or make conditional |
| `quizRs7` / `quizM5` variable names | RS7 vs M5 specific | Rename to `quizCar1` / `quizCar2` |
| Winner strings in quiz | `"Audi RS7"`, `"BMW M5"` | Read from `carData.comparisons[0].name` |
| `profileBarsData` values | `[95, 90, 75, 80]` etc | Read from `carData.rating.profiles` or keep as fallback |
| Emergency fallback text | Spanish RS7 descriptions | Read from `carData.pageText.es.scoreDescFallback` |

---

## Verification Checklist Before Cleanup

Before removing ANY inline code from rs7.html, verify:

- [ ] `js/car-renderer.js` loads and `loadCarData()` works with rs7-2026.json
- [ ] `js/cost-calculator.js` loads and calculator updates correctly
- [ ] `js/emergency-fallback.js` loads and fills missing content
- [ ] `html/test-car.html` (generated from updated template) works correctly
- [ ] `html/test-car.html` has all sections: Header, Hero, Gallery, Specs, Calculator, Timeline, FAQ, Comparativas, Footer
- [ ] No console errors on test-car page
- [ ] No console errors on RS7 page (when using new scripts)
- [ ] Country selector works on both pages
- [ ] Language selector works on both pages
- [ ] Dark mode toggle works on both pages
- [ ] Mobile menu works on both pages

---

*Inventory complete. Ready for Phase 2 — Grouped Migration.*
