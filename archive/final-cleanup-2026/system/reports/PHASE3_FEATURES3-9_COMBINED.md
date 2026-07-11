# Phase 3 — Features #3–#9: Combined Report
**Date:** 2026-06-22  
**Status:** ✅ All Complete

---

## Files Created
None.

---

## Files Modified

| File | Features |
|------|----------|
| `system/templates/guide-template.html` | #3 #4 #5 #6 #8 |
| `system/templates/car-template.html` | #6 #9 |
| `system/templates/guide-index-template.html` | #6 |
| `system/generators/guide-generator.js` | #5 |
| `css/guide-page.css` | #3 #4 #5 #8 |
| `css/car-page.css` | #9 |
| `css/variables.css` | #6 #7 |
| `js/script.js` | #7 |
| `js/search-index.js` | #7 |
| `js/compare.js` | (no changes — URL params already supported) |
| `html/index.html` | #6 |

---

## Feature Summaries

### #3 — Estimated Reading Time (Progress Bar Tooltip)
- `data-reading-time` attribute on progress bar container baked at build time
- Tooltip follows the bar: shows `N min`, counts down to `1 min`, then `✓`
- `aria-hidden="true"` — decorative only, no screen reader noise
- `prefers-reduced-motion` respected

### #4 — Back to Top Button
- Fixed `position`, bottom-right, `z-index: 900` (below header at 1000)
- Hidden with `hidden` attribute, appears after 400px scroll
- Click scrolls to top and moves focus to skip link
- 44×44px touch target, `focus-visible` outline, `prefers-reduced-motion` respected

### #5 — Related Articles Sidebar Enhancement
- New `sidebar-related` widget added to sticky guide sidebar
- Built at **generation time** in `guide-generator.js` — zero JS overhead
- Shows up to 3 related guides with reading-time badge + title
- Fully keyboard accessible (`focus-visible` outline on each link)

### #6 — Dark Mode Toggle Persistence (Flash Fix)
- Existing `script.js` already persists to `localStorage` (`profix-theme`)
- **Added inline `<script>` in `<head>`** of all 4 templates + `index.html`:  
  `try{if(localStorage.getItem('profix-theme')==='light')document.documentElement.classList.add('light');}catch(e){}`
- Added `html.light body { ... }` block to `variables.css` mirroring `body.light`  
  so CSS variables apply correctly on first paint (before deferred `script.js` runs)
- Eliminates Flash of Incorrect Theme (FOIT) on page load/navigation

### #7 — Search Improvements
- **Debounce** (180ms) on `input` event — no redundant queries while typing
- **Score-based ranking** in `search-index.js`:  
  Exact name (100) → name starts-with (80) → name contains (60) → keyword (40) → description/category (20)
- **Query highlight** — matched term wrapped in `<mark>` in result names
- **"No results" message** — shown when query ≥ 2 chars yields no matches, with `aria-live="polite"`

### #8 — Guide Page Feedback Widget
- "¿Te ha resultado útil esta guía?" with 👍 / 👎 buttons
- Vote persisted in `localStorage` keyed by guide slug (`profix-feedback-<id>`)
- On return visit: vote is restored, buttons disabled, confirmation shown
- Positive vote → green highlight; negative → red highlight
- `aria-pressed` on buttons, `aria-live="polite"` on confirmation, ARIA announcement via existing `#a11yAnnouncer`
- `prefers-reduced-motion` respected

### #9 — Car Page Comparison Button
- **"Comparar" button** added to car hero section alongside existing "Ver análisis" CTA
- Ghost button style (transparent background, white border) — doesn't compete with primary CTA
- On `car:rendered` event: `href` updated to `compare.html?car1=<carName>`  
  — uses existing URL-param support already in `compare.js`
- `aria-label` updated dynamically: "Comparar Audi RS7" etc.
- Fallback href `compare.html` if car data hasn't loaded yet

---

## Build Result
```
✅ Build: PASS — Generators: 7/7, Validators: 3/3
```

## Validation Result
```
✅ All validators pass
```

## Test Result
```
✅ 32 passed, 0 failed
```

## Lighthouse Results (final)

| Page        | Performance | Accessibility | Best Practices | SEO  |
|-------------|:-----------:|:-------------:|:--------------:|:----:|
| Homepage    | 88          | 100           | 100            | 100  |
| Car Page    | 85          | 100           | 100            | 100  |
| **Guide Page** | **97**   | **100**       | **100**        | **100** |

## Regressions Found
None.

## Production Impact

| Feature | CLS | TBT | Paint | Notes |
|---------|-----|-----|-------|-------|
| #3 Tooltip | 0 | 0 | 0 | Fixed element, rAF-throttled |
| #4 Back to Top | 0 | 0 | 0 | Hidden until scroll, passive listener |
| #5 Sidebar Related | 0 | 0 | 0 | Static HTML, no JS |
| #6 Dark Mode Fix | 0 | 0 | ✅ better | Eliminates FOIT |
| #7 Search | 0 | 0 | 0 | Debounced, no extra network |
| #8 Feedback | 0 | 0 | 0 | localStorage only |
| #9 Compare Btn | 0 | 0 | 0 | DOM update on existing event |
