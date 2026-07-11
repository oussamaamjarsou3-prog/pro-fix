# Phase 3.2 — Conflict Analysis Report
## Legacy Inline vs New Centralized System

**Date:** June 2026  
**Scope:** `system/templates/car-template.html` (after Step 3.1)  
**Rule:** Analysis only — NO modifications made

---

## 1. Executive Summary

| Metric | Count |
|--------|-------|
| **Duplicate function definitions** | 5 |
| **Duplicate event listeners** | 2 sets |
| **Multiple DOM render sources** | 3 sources |
| **Critical conflicts** | 2 |
| **Safe overlaps** | 3 |

**Verdict:** The template currently runs in **parallel mode** with both systems active. The legacy inline system is the **primary source of truth** for calculator and loader. The new centralized system loads but its functions are **not directly invoked by the template's inline code**.

---

## 2. Function Duplication Matrix

### 2.1 `showContent()` — THREE DEFINITIONS

| Location | Lines | Scope | Called By |
|----------|-------|-------|-----------|
| **Template inline (1st)** | 654–658 | Local `<script>` block | `car:rendered` event, 3s fallback |
| **Template inline (2nd)** | 739–743 | Local `<script>` block | `i18n:ready` event, 2s fallback |
| **`car-renderer.js`** | Global | `window.showContent` | `loadCarData()` completion, safeLoadCarData |

**Conflict Level:** 🔴 **HIGH**

**Analysis:**
- The template's inline `showContent()` (lines 654–658) and the second inline `showContent()` (lines 739–743) are **identical** — pure duplication within the same file.
- `car-renderer.js` also defines `window.showContent = function() {...}` globally.
- When `initPage()` calls `await window.carRenderer.render()`, the renderer's `loadCarData()` internally calls its own `showContent()` (from car-renderer.js).
- BUT the template also has `document.addEventListener('car:rendered', showContent)` (line 661), which calls the **local** `showContent()` (not the global one), because the local function is in the closer scope.
- **Result:** `showContent()` is called **at least twice** — once by car-renderer.js internally, once by the template's `car:rendered` listener.
- **Impact:** The second call is a no-op (loader already hidden, class already added), so this is **harmless but redundant**.

### 2.2 `updateCalculator()` — TWO DEFINITIONS

| Location | Lines | Features | Scope |
|----------|-------|----------|-------|
| **Template inline** | 684–727 | Basic: no animation, no perKmLine translation, no comparison bar | Local `<script>` |
| **`cost-calculator.js`** | Lines ~95–145 | Advanced: animation, perKmLine with `t()`, comparison bar, `barRs7` fallback | `window.updateCalculator` |

**Conflict Level:** 🟡 **MEDIUM**

**Analysis:**
- The inline `updateCalculator()` is **scoped locally** to its `<script>` block. It is called by:
  - The inline input event listeners (lines 729–732)
  - `applyCountry()` (from country-manager.js) — but country-manager calls `window.updateCalculator` (global)
- The global `window.updateCalculator` (from cost-calculator.js) is **never called by the template inline code** because the inline code's `updateCalculator` reference resolves to the local function.
- **However:** `applyCountry()` in `system/js/country-manager.js` calls `typeof updateCalculator === 'function'` — this resolves to the **global** `window.updateCalculator` (from cost-calculator.js), NOT the local inline one.
- **Result:** The calculator **input sliders** trigger the inline basic version, but `applyCountry()` triggers the global advanced version.
- **Impact:** The advanced version (with animation) runs after country change. The basic version runs on slider input. The DOM elements are the same, so they **overwrite each other** without visual conflict, but the animation only appears after country changes, not on slider input.

### 2.3 `getConsumptionMap()` — TWO DEFINITIONS

| Location | Lines | Scope |
|----------|-------|-------|
| **Template inline** | 677–682 | Local `<script>` |
| **`cost-calculator.js`** | Lines ~17–22 | Private (IIFE) |

**Conflict Level:** 🟢 **LOW**

**Analysis:**
- The inline version is used only by the inline `updateCalculator()`.
- The cost-calculator.js version is used only by its own `updateCalculator()`.
- They are **isolated** — no cross-calling.
- **Impact:** None. Duplicate but isolated.

### 2.4 `initPage()` — Template Orchestrator

| Location | Lines | Behavior |
|----------|-------|----------|
| **Template inline** | 640–651 | Calls `applyCountry('ES')` then `await window.carRenderer.render()` |

**Conflict Level:** 🟡 **MEDIUM**

**Analysis:**
- `initPage()` calls `window.carRenderer.render()` which triggers `loadCarData()` in car-renderer.js.
- Inside `loadCarData()` (car-renderer.js), it:
  1. Fetches JSON
  2. Calls `setCarData()`
  3. Applies pageText
  4. Calls `setupCountryData()`
  5. Calls `applyCountry(currentCountry)` ← This triggers the global `window.updateCalculator`
  6. Calls `showContent()`
  7. Then the template dispatches `car:rendered` which triggers local `showContent()` again
- **But wait:** `initPage()` already called `applyCountry('ES')` BEFORE `render()`. This means:
  1. `applyCountry('ES')` is called → triggers global `updateCalculator` (advanced, from cost-calculator.js)
  2. Then `render()` is called → inside, `setupCountryData()` + `applyCountry()` → triggers global `updateCalculator` AGAIN
- **Result:** `updateCalculator` (global, advanced) is called **twice** during page load.
- **Impact:** Harmless — same calculation, just redundant. Animation might flicker slightly.

---

## 3. Event Listener Duplication

### 3.1 Calculator Input Listeners

| Source | Elements | Handler | Timing |
|--------|----------|---------|--------|
| **Template inline** | annualKm, fuelPrice, purchaseType, drivingStyle | Local `updateCalculator` | DOM ready (inline script execution) |
| **`cost-calculator.js`** | Same elements | Global `updateCalculator` | DOMContentLoaded (inside initCostCalculator) |

**Conflict Level:** 🔴 **HIGH**

**Analysis:**
- The inline script (lines 729–732) adds listeners that call the **local** basic `updateCalculator`.
- `cost-calculator.js` (in `initCostCalculator()`) adds listeners that call the **global** advanced `updateCalculator`.
- **Result:** On every slider movement, **TWO** `updateCalculator` functions fire:
  1. Local basic version (no animation) → writes to DOM
  2. Global advanced version (with animation) → overwrites the same DOM
- **Impact:** The advanced version "wins" visually because it fires second and includes animation. The basic version's write is immediately overwritten. This is **wasteful but not broken**.

### 3.2 `i18n:ready` Event

| Source | Listener | Action |
|--------|----------|--------|
| **Template inline (2nd script)** | `document.addEventListener('i18n:ready', showContent)` | Local showContent |
| **car-renderer.js** | `document.addEventListener('i18n:ready', safeLoadCarData)` | Indirect (if i18n fires before car-renderer loads) |

**Conflict Level:** 🟢 **LOW**

**Analysis:**
- The template's second inline script listens for `i18n:ready` to call `showContent()`.
- `car-renderer.js` does NOT directly listen for `i18n:ready` — it uses `safeLoadCarData()` which is called by other means.
- **Result:** Only the template's listener fires for `i18n:ready`. No conflict.

---

## 4. DOM Rendering Sources

### 4.1 Who Renders What?

| Content | Source | Method |
|---------|--------|--------|
| **Hero text** | car-renderer.js | `setText()` helper |
| **Quick stats** | car-renderer.js | Direct DOM write |
| **Specs table** | car-renderer.js | Direct DOM write |
| **Versions** | car-renderer.js | `innerHTML` |
| **Gallery** | car-renderer.js | `innerHTML` |
| **Problems list** | car-renderer.js | `innerHTML` |
| **Interior cards** | car-renderer.js | `innerHTML` |
| **Timeline costs** | car-renderer.js | Query + textContent |
| **Profile score** | car-renderer.js | Width style + textContent |
| **Score box** | car-renderer.js | textContent |
| **Calculator results** | Inline / cost-calculator.js | textContent (overwrite each other) |
| **Pros/Cons** | car-renderer.js | `innerHTML` |
| **FAQ** | car-renderer.js | `innerHTML` |
| **Page text** | car-renderer.js | `innerHTML` |
| **Loader hide** | Multiple | `showContent()` (called multiple times) |

**Observation:** `car-renderer.js` is the **dominant renderer** for most content. The calculator is the only area with dual rendering.

---

## 5. Source of Truth Determination

### For each feature:

| Feature | Primary Source | Secondary Source | Which Runs? |
|---------|---------------|-------------------|-------------|
| **Car data loading** | `car-renderer.js` `loadCarData()` | None (template calls it) | ✅ New system |
| **Page text injection** | `car-renderer.js` `applyPageText()` | None | ✅ New system |
| **Specs/versions/gallery** | `car-renderer.js` | None | ✅ New system |
| **Calculator (slider input)** | Inline local `updateCalculator` | `cost-calculator.js` global (fires second) | ⚠️ Both — global "wins" |
| **Calculator (country change)** | `cost-calculator.js` global | Inline local (not called) | ✅ New system |
| **Loader hide** | Template inline `showContent` | `car-renderer.js` `showContent` | ⚠️ Both — inline "wins" for `car:rendered`, new for internal |
| **Profile cards** | None in inline | `cost-calculator.js` `setProfile()` | ✅ New system (if called) |
| **Quiz** | None in inline | `cost-calculator.js` `initQuiz()` | ✅ New system (if DOM exists) |
| **Scroll top** | None in inline | `cost-calculator.js` | ✅ New system |
| **Newsletter** | None in inline | `cost-calculator.js` | ✅ New system |
| **Emergency fallback** | None in inline | `emergency-fallback.js` | ✅ New system |

### Conclusion:
- **New system controls:** Data loading, rendering, profile, quiz, utilities
- **Legacy inline controls:** Calculator input handling (but is overwritten by new system)
- **Both control:** Loader visibility (harmless duplication)

---

## 6. Critical Conflicts Requiring Action

### Conflict #1: Dual Calculator Event Listeners 🔴

**Problem:** Both inline and global `updateCalculator` fire on every slider input.
**Impact:** Wasted CPU, potential animation flicker.
**Fix Strategy:** Remove inline calculator code after confirming global version works.

### Conflict #2: `initPage()` calls `applyCountry()` twice 🟡

**Problem:** `initPage()` calls `applyCountry('ES')` before `render()`, and `render()` internally calls `applyCountry()` again via `setupCountryData()`.
**Impact:** Calculator updates twice. Country data setup is idempotent so this is harmless.
**Fix Strategy:** Remove the explicit `applyCountry('ES')` from `initPage()` — `render()` handles it.

---

## 7. Safe Overlaps (No Action Needed)

| Overlap | Why It's Safe |
|---------|---------------|
| `showContent()` called twice | Second call is a no-op (class already added) |
| `setCarData()` called once | Only car-renderer.js calls it |
| `applyTranslations()` called multiple times | Idempotent — safe to call repeatedly |
| Emergency fallback + main renderer | Fallback only activates if content is empty |

---

## 8. What Would Break If We Remove Inline Code Now?

| Inline Code Removed | Risk | Why |
|---------------------|------|-----|
| `showContent()` (1st) | 🟢 Low | Global version exists and is called by renderer |
| `showContent()` (2nd) | 🟡 Medium | `i18n:ready` listener depends on it — but renderer also hides loader |
| `updateCalculator()` + listeners | 🟢 Low | Global version handles everything + auto-inits |
| `getConsumptionMap()` | 🟢 Low | Global version exists |
| `initPage()` structure | 🔴 High | Template calls `window.carRenderer.render()` — the structure is fine, but removing the explicit `applyCountry()` before render might change timing |

---

## 9. Recommended Fix Order (For Future Approval)

1. **Remove duplicate `showContent()` (2nd instance, lines 739–743)** — lowest risk
2. **Remove inline calculator code (lines 670–733)** — global version is a superset
3. **Simplify `initPage()`** — remove explicit `applyCountry('ES')`, let renderer handle it
4. **Remove first `showContent()` definition (lines 654–658)** — global version handles it
5. **Clean up event listeners** — remove `car:rendered` listener since renderer already calls `showContent()`

---

## 10. Current State Verification

**NO CODE WAS MODIFIED IN THIS ANALYSIS.**

The template is in **parallel mode**:
- ✅ Legacy inline code runs
- ✅ New centralized scripts load
- ✅ Both coexist without breaking the page
- ⚠️ Some redundant execution occurs (calculator, showContent)
- 🔒 **No functionality is lost**

---

*Report complete. Awaiting approval for fixes.*
