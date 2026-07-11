# Phase 2 Implementation Report — Canonical Domain Unification

**Project:** CarSpecio
**Date:** 2026-06-21
**Goal:** Unify the canonical domain to `https://carspecio.com` across the entire project, refactor guide generation for SEO/accessibility, and wire search/sitemap systems.

---

## 1. Scope Completed

### 1.1 Canonical Domain Unification
- Removed all references to `carspecio.io` and `automax.io` across the project.
- Centralized domain configuration in `system/config.js`:
  - `BASE_URL = 'https://carspecio.com'`
  - `SUPPORTED_LANGS = ['es', 'en', 'fr', 'ar']`
  - `DEFAULT_LANG = 'es'`
- Updated all SEO, sitemap, JSON-LD, Open Graph, Twitter Card, and canonical URLs to use `BASE_URL`.
- Updated schema `$id` fields in:
  - `system/schemas/*.json`
  - `system/registry/*.json`
  - `system/locales/*.json`
  - `html/lang/*.json`
  - `schemas/master-car-schema.json`
- Updated generators and scripts:
  - `system/generators/sitemap-generator.js`
  - `system/generators/car-page-generator.js`
  - `system/generators/guide-generator.js`
  - `system/generators/guide-index-generator.js`
  - `system/generators/search-index-generator.js`
  - `system/generators/compare-data-generator.js`
  - `system/build.js`
  - `system/build.ps1`
  - `system/generators/car-page-generator.py`

### 1.2 Guide System Refactor
- `system/templates/guide-template.html`:
  - Added skip-to-content link, accessible loader, and ARIA announcements.
  - Added canonical URL, hreflang tags, Article/FAQPage/BreadcrumbList JSON-LD.
  - Added FAQ accordion with keyboard support and ARIA roles.
  - Added preloaded guide data, multilingual content switching, and language change announcements.
- `system/generators/guide-generator.js`:
  - Rewritten to use `BASE_URL`, `SUPPORTED_LANGS`, and `DEFAULT_LANG`.
  - Generates multilingual content blocks, TOC, intro, sections, FAQ, summary box.
  - Generates multilingual related guides and related cars with real names.
  - Produces Article, FAQPage, and BreadcrumbList JSON-LD.
- `system/templates/guide-index-template.html` and `system/generators/guide-index-generator.js`:
  - Refactored to use a template with placeholders.
  - Generates canonical URL, hreflang tags, ItemList and BreadcrumbList JSON-LD.
  - Localized category cards, guide cards, and footer category links.

### 1.3 Search & Sitemap Integration
- `system/generators/search-index-generator.js`:
  - Unified index for cars and guides.
  - Renamed globals from `AUTOMAX_*` to `CARSPECIO_*`.
  - Exposed `window.CARSPECIO_SEARCH` with `search(query)` and `getUrl(item)`.
  - Keeps backward-compatible `window.searchCars` alias.
- `js/script.js`:
  - Replaced inline card filtering with a real header search dropdown.
  - Uses `window.CARSPECIO_SEARCH` and supports keyboard navigation.
  - Added `search-results` CSS in `css/variables.css`.
- Loaded `js/search-index.js` in guide and car templates.
- `system/generators/sitemap-generator.js`:
  - Generates sitemap with homepage, main pages, car pages, and guide pages.
  - All URLs use `BASE_URL`.

### 1.4 Validation
- `system/validators/guide-validator.js`:
  - Rewritten to perform real JSON Schema validation against `system/schemas/guide-schema.json`.
  - Validates required fields, types, patterns, enums, min/max length, array minItems, and cross-references.
  - Maintains registry cross-reference checks for categories, related guides, and related cars.

### 1.5 Accessibility
- Added skip-link CSS and `.sr-only` utility in `css/variables.css`.
- Added skip links and main-content targets in:
  - `system/templates/guide-template.html`
  - `system/templates/car-template.html`
  - `system/templates/guide-index-template.html`
- Added `role="status"` and `aria-label` to page loaders.
- Added ARIA roles, keyboard support, and live announcements for language switching and FAQ accordions.
- Updated `js/i18n.js` to toggle `.lang-block`, `.lang-card-content`, and `.lang-title` elements when the language changes.

---

## 2. Verification

Run the full build:

```powershell
node system/build.js
```

Results:

```
🚀 Starting CarSpecio build process...
📦 Running generators...
✅ Car Page Generator completed
✅ Guide Page Generator completed
✅ Guide Index Generator completed
✅ Mega Menu Generator completed
✅ Compare Data Generator completed
✅ Search Index Generator completed
✅ Sitemap Generator completed
🔍 Running validators...
✅ Car Data Validator completed
✅ Guide Data Validator completed
✅ Car Registry Validator completed
✨ Build completed successfully!
```

### 2.1 Generated Output Checks
- Canonical URL in guide page: `https://carspecio.com/guias/cambiar-aceite.html`
- Canonical URL in car page: `https://carspecio.com/rs7.html`
- Sitemap URLs use `https://carspecio.com`.
- Search index absolute URLs use `https://carspecio.com`.
- No `carspecio.io` or `automax.io` references remain in the project.

### 2.2 Runtime Checks
- Local HTTP server started on `http://localhost:8080` and serves generated pages.
- Guide index, guide pages, and car pages are accessible.
- Search index is loaded and ready for the header search implementation.

---

## 3. Known Warnings

The car registry validator reports two warnings about brand models not found in the registry. These are pre-existing data issues and do not affect the canonical domain unification or Phase 2 deliverables.

---

## 4. Next Steps

- Continue with remaining Phase 2+ items: real-time search smoke tests, accessibility audit with automated tooling, and image/performance optimization.
- Address the two brand-model registry warnings.
- Consider adding language-specific URLs if the project moves to server-side rendering or language path prefixes.

---

**Status:** ✅ Phase 2 canonical domain unification complete and verified.
