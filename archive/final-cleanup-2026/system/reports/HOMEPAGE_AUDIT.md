# CarSpecio Homepage Audit Report
**Date:** 2026-06-22 | **Scope:** `html/index.html` + CSS/JS | **Status:** 🔴 Critical Issues Found

---

## Summary

| Severity | Count |
|----------|-------|
| 🔴 Critical | 1 |
| 🟠 High | 12 |
| 🟡 Medium | 18 |
| 🟢 Low | 8 |

**Topline:** The homepage has systemic character encoding corruption, placeholder icons (`?`), external CDN dependencies, no i18n integration, missing guides section, broken links, and significant design inconsistency with guide/car pages.

---

## Critical Issues

### CRIT-001 — Character Encoding Corruption (Entire File)
- **File:** `html/index.html` — Lines 1–1363
- **Issue:** Every special character renders as ``. Affects meta description, aria-labels, all visible text, button labels. Page looks broken.
- **Evidence:** `aria-label="Abrir men"` (should be `menú`), `Categoras` (should be `Categorías`), `Hasta50.000` (should be `Hasta €50.000`), ` 2026` (should be `© 2026`)
- **Fix:** Re-save as UTF-8 without BOM. Use HTML entities as fallback (`&aacute;`, `&euro;`, `&copy;`).

---

## High Severity Issues

### HIGH-001 — Question Marks Used as Icons
- **File:** `html/index.html` — 30+ locations
- **Issue:** Unicode icons corrupted to `?` / `??`. Affects: menu button, close button, search button, stat icons, trophy icons, CTA arrows, social icons, back button.
- **Evidence:** `<button>?</button>` (menu), `<button>??</button>` (search), `Comparar ?` (CTA), `??` (trophy), `??` (social)
- **Fix:** Replace with SVG icons (same set used on guide pages).

### HIGH-002 — External Dependency: cdn.simpleicons.org
- **File:** `html/index.html` — Lines 73–132, 1172–1202
- **Issue:** 20+ brand logos load from external CDN. Violates "no external dependencies" rule. Third-party tracking risk.
- **Fix:** Download SVGs to `images/brands/` and reference locally.

### HIGH-003 — Placeholder.svg for Real Car Images
- **File:** `html/index.html` — 15+ locations
- **Issue:** `images/placeholder.svg` used for hero background, car photos in vs-cards, review cards, rank cards, brand logos, news images. Site looks unfinished.
- **Fix:** Replace with actual car photography from the car registry.

### HIGH-004 — Hardcoded Spanish Text, No i18n
- **File:** `html/index.html` — Entire file
- **Issue:** 100% hardcoded Spanish. Zero `data-i18n` attributes. No connection to the existing `t()` translation system used by guide pages (es/en/fr/ar locale files). No language switcher.
- **Fix:** Add `data-i18n` attributes, include `i18n.js`, add homepage keys to all 4 locale files, add language switcher to header.

### HIGH-005 — Broken / Empty Links (`href="#"`)
- **File:** `html/index.html` — 140+ links
- **Issue:** Mega menu brands (35+), categories (100+), category tiles, rank cards, news links, social links all use `href="#"`. Frustrates users, wastes crawl budget.
- **Fix:** Wire to actual pages or convert to `<span>`.

### HIGH-006 — Missing Guides Section
- **File:** `html/index.html` — Main content (lines 872–1312)
- **Issue:** Homepage has Comparativas, Reviews, Categories, Brands, Rankings, News — but no Guides section despite guides being a major content pillar (3 active guides, full registry, recent enhancements). Missed SEO opportunity.
- **Fix:** Add "Guías destacadas" section linking to generated guide pages.

### HIGH-007 — Unsplash External Images (Same Photo Used 4×)
- **File:** `html/index.html` — Lines 964, 1038, 1243, 1281
- **Issue:** Same `images.unsplash.com/photo-1606664515524...` Audi RS7 photo used to represent BMW M5, Mercedes, Porsche, Tesla, and news articles. Misleading. External dependency.
- **Fix:** Replace with actual car images from project assets.

### HIGH-008 — Newsletter Stores Emails in localStorage
- **File:** `js/home.js` — Lines 42–62
- **Issue:** PII (email addresses) stored client-side unencrypted. No backend, no GDPR checkbox, no validation beyond HTML5, no rate limiting.
- **Fix:** Remove localStorage storage. Add real backend endpoint + privacy checkbox.

### HIGH-009 — No Language Switcher
- **File:** `html/index.html` — Header
- **Issue:** Guide pages have ES/EN/FR/AR switcher. Homepage has none. Users lose language context when navigating.
- **Fix:** Port switcher from `guide-template.html`.

### HIGH-010 — Missing Schema.org JSON-LD
- **File:** `html/index.html` — `<head>`
- **Issue:** Guide pages have Article + FAQ + Breadcrumb structured data. Homepage has zero schema. No Organization, WebSite, or SearchAction.
- **Fix:** Add Organization + WebSite + SearchAction JSON-LD.

### HIGH-011 — Missing Open Graph / Twitter Cards
- **File:** `html/index.html` — `<head>`
- **Issue:** No `og:title`, `og:description`, `og:image`, `twitter:card` tags.
- **Fix:** Add standard OG + Twitter Card meta tags.

### HIGH-012 — No Canonical Tag
- **File:** `html/index.html` — `<head>`
- **Issue:** Missing `<link rel="canonical">`. Duplicate content risk.
- **Fix:** Add `<link rel="canonical" href="https://carspecio.com/">`.

---

## Medium Severity Issues

### MED-001 — Design System Inconsistency
- **Files:** `css/home.css` vs `css/guide-page.css` / `css/car-page.css`
- **Issue:** Homepage uses completely different CSS architecture: `.dash-hero`, `.vs-card`, `.review-card-dash` vs guides' `.guide-hero`, `.guide-card`, `.author-block`. Different border-radius, shadows, color variables, font (Poppins vs system stack). No shared component library.
- **Fix:** Create `components.css` with common patterns; refactor all pages to use it.

### MED-002 — No Print Styles
- **File:** `css/home.css`
- **Issue:** Guide pages have `@media print`. Homepage has none. Printing would include fixed header, hero background, newsletter form.
- **Fix:** Add `@media print` hiding decorative elements.

### MED-003 — No Visible Theme Toggle
- **File:** `html/index.html`
- **Issue:** Code checks `localStorage.getItem('profix-theme')` (line 24) but no toggle button exists. Users cannot switch themes without editing localStorage manually.
- **Fix:** Add sun/moon toggle button in header.

### MED-004 — Multiple Unthrottled Scroll Listeners
- **File:** `js/script.js` — Lines 281, 479, 569
- **Issue:** 3 separate `window.addEventListener('scroll', ...)` without `requestAnimationFrame` throttling. Causes jank on low-end devices.
- **Fix:** Consolidate into one throttled handler.

### MED-005 — Fabricated Stat Numbers
- **File:** `html/index.html` — Lines 927–948
- **Issue:** "250+ Comparativas, 50+ Marcas, 1.200+ Reviews, 100K+ Usuarios" are hardcoded and don't match actual data (6 cars, 35 brands, 3 guides, no user tracking).
- **Fix:** Replace with actual computed numbers from registries, or remove stats bar.

### MED-006 — Hardcoded Category Counts
- **File:** `html/index.html` — Lines 1122–1157
- **Issue:** Category article counts (SUV: 45, Deportivos: 62, etc.) are hardcoded and don't match registry data.
- **Fix:** Generate dynamically from car registry, or remove counts.

### MED-007 — Missing Hreflang Tags
- **File:** `html/index.html` — `<head>`
- **Issue:** Guide pages have `<link rel="alternate" hreflang="...">`. Homepage (lang="es") has none for en/fr/ar.
- **Fix:** Add hreflang links for all 4 languages.

### MED-008 — Footer Social Links Empty
- **File:** `html/index.html` — Lines 1322–1325
- **Issue:** Instagram, YouTube, TikTok, Twitter all point to `href="#"` with `??` text.
- **Fix:** Add real URLs or remove until accounts exist.

### MED-009 — Newsletter Form State Management Poor
- **File:** `js/home.js` — Lines 42–62
- **Issue:** No error state, no loading state, no duplicate check, inline styles in JS string, message auto-hides with no recall.
- **Fix:** Add CSS state classes (`.is-loading`, `.is-success`, `.is-error`).

### MED-010 — Missing `loading="lazy"` on Some Images
- **File:** `html/index.html`
- **Issue:** Most images have `loading="lazy"` but some in brands marquee don't (Mercedes, Land Rover, Lexus logos at lines 1180, 1204, 1208).
- **Fix:** Add `loading="lazy"` to all `<img>` tags.

### MED-011 — Skip Link Lacks Focus Target
- **File:** `html/index.html` — Line 33
- **Issue:** `<a href="#main-content">` targets `<main id="main-content">` but `<main>` lacks `tabindex="-1"`. Focus may not move in all browsers.
- **Fix:** Add `tabindex="-1"` to `<main>`.

### MED-012 — Copyright Year Hardcoded
- **File:** `html/index.html` — Line 1350
- **Issue:** `2026` hardcoded. Will be outdated in 2027.
- **Fix:** Use `new Date().getFullYear()` in JS.

### MED-013 — Favicon Not Verified
- **File:** `html/index.html` — Line 23
- **Issue:** `images/favicon.svg` referenced but existence not verified. No PNG/ICO fallback.
- **Fix:** Verify file exists; add `.ico` fallback.

### MED-014 — Mega Menu Step 3 Empty Without JS
- **File:** `html/index.html` — Step 3 (Models)
- **Issue:** 3-step flow has no fallback content if JS fails or loads slowly.
- **Fix:** Add "Selecciona una categoría primero" placeholder.

### MED-015 — Header Search Only Filters Review Cards
- **File:** `js/home.js` — Lines 24–37
- **Issue:** Header search only filters `.review-card` elements. Doesn't use global `window.CARSPECIO_SEARCH` index like guide pages.
- **Fix:** Replace with global search from `script.js` (`initHeaderSearch`).

### MED-016 — Hero Background Is Placeholder
- **File:** `html/index.html` — Line 876
- **Issue:** Hero uses `images/placeholder.svg` as background. Unengaging.
- **Fix:** Replace with actual hero image/video or CSS gradient pattern.

### MED-017 — Missing `decoding="async"` on Images
- **File:** `html/index.html`
- **Issue:** Guide pages recently added `decoding="async"`. Homepage images lack it.
- **Fix:** Add `decoding="async"` to all `<img>` tags.

---

## Low Severity Issues

| ID | Issue | File | Location | Fix |
|----|-------|------|----------|-----|
| LOW-001 | Trailing empty lines at EOF | `html/index.html` | Lines 1359–1362 | Remove |
| LOW-002 | Inconsistent CSS class naming | `css/home.css` | Entire file | Standardize on BEM |
| LOW-003 | No font preload | `html/index.html` | Line 29 | Add `<link rel="preload">` |
| LOW-004 | Redundant body classes | `html/index.html` | Line 32 | Remove `dash-home` if unused |
| LOW-005 | Review card links unverified | `html/index.html` | Lines 1034–1104 | Run link checker |
| LOW-006 | No `decoding="async"` | `html/index.html` | All `<img>` | Add attribute |
| LOW-007 | Marquee DOM duplication | `js/script.js` | Lines 343–346 | Verify `duped` guard works |
| LOW-008 | Mixed px/rem spacing | `css/home.css` | Entire file | Convert to design tokens |

---

## Design Consistency Matrix

| Element | Homepage | Guides | Cars | Status |
|---------|----------|--------|------|--------|
| Header | Dark glass | Light solid | Light solid | 🔴 Inconsistent |
| Border radius | 16–24px | 12–16px | 12–16px | 🔴 Inconsistent |
| Card shadows | Heavy/colored | Subtle/neutral | Subtle/neutral | 🔴 Inconsistent |
| Buttons | Gradient, large | Solid, medium | Solid, medium | 🔴 Inconsistent |
| Font | Poppins (Google) | System stack | System stack | 🔴 Inconsistent |
| Theme | Dark only | Light + dark | Light + dark | 🔴 Inconsistent |
| i18n | None | Full | Full | 🔴 Inconsistent |
| Skip link | Yes | Yes | Yes | ✅ |
| Lazy images | Partial | Full | Full | 🟡 |
| Print styles | None | Full | Unknown | 🟡 |
| Breadcrumb | None | Full | Full | 🟡 |
| JSON-LD | None | Full | Partial | 🟡 |

---

## Implementation Order

### Quick Wins (< 30 min)
1. Fix character encoding (UTF-8 without BOM)
2. Replace `?` icons with SVGs
3. Add canonical tag
4. Add Open Graph + Twitter Card meta tags
5. Add JSON-LD structured data (Organization + WebSite)
6. Remove localStorage email storage from newsletter
7. Add `tabindex="-1"` to `<main>`
8. Add dynamic copyright year
9. Remove trailing empty lines

### Medium Improvements (1–2 hours)
10. Fix all `href="#"` links
11. Add Guides section to homepage
12. Add language switcher to header
13. Replace placeholder images with real assets
14. Add print styles
15. Add theme toggle button
16. Consolidate scroll listeners
17. Add `loading="lazy"` + `decoding="async"` to all images
18. Replace hardcoded stats with registry counts
19. Add hreflang tags

### Major Improvements (3+ hours)
20. Replace external CDN dependencies with local assets
21. Add full i18n to homepage (`data-i18n` + locale files)
22. Create shared `components.css` library
23. Unify design system across all page types
24. Implement real newsletter backend
25. Add professional hero background
26. Replace Unsplash images with local assets
