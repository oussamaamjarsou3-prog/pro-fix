# CarSpecio Car Pages Audit
**Scope:** All 6 generated car pages (`html/*.html`) and their source data (`system/data/*-2026.json`)  
**Date:** 2026-06-22  
**Method:** Static HTML analysis, JSON data completeness scan, template & generator code review, cross-page visual comparison with Homepage and Guide pages.  

---

## Summary Table

| Car | Hero Image | OG Image | Twitter Card | Related Guides | Related Cars | Mojibake | pageText | Rating |
|-----|------------|----------|--------------|----------------|--------------|----------|----------|--------|
| rs7 | `audi-rs7-hero.webp` | empty | empty | 3 guides | none | 0 | full | 9.2 |
| rs3 | `placeholder.svg` | empty | empty | 1 guide | none | 7 | missing | missing |
| bmw-m5 | `placeholder.svg` | empty | empty | 1 guide | none | 7 | missing | missing |
| mercedes-amg-gt | `placeholder.svg` | empty | empty | **MISSING** | none | 7 | missing | missing |
| nissan-gtr | `placeholder.svg` | empty | empty | 1 guide | none | 7 | missing | missing |
| porsche-911 | `placeholder.svg` | empty | empty | 1 guide | none | 7 | missing | missing |

---

## 1. Content Completeness

### 1.1 Missing Data Sections (All Cars)

The following top-level keys are **absent from every car data JSON**:

| Section | Impact | Notes |
|---------|--------|-------|
| `equipment` | High | No equipment/features list rendered. Section exists in template but is empty. |
| `prosAndCons` | High | `car-renderer.js` reads from `pageText.pros/cons`, but only `rs7` has `pageText`. All other cars show empty pros/cons lists. |
| `faq` | High | `car-renderer.js` reads from `pageText.faq`, only `rs7` has it. FAQ section renders empty for 5/6 cars. |
| `relatedGuides` | High | No car references related guides in its own data. Cross-linking is template-driven only. |
| `relatedCars` | High | No "Related Cars" section exists in template or renderer. |
| `timeline` | Medium | `car-renderer.js` reads from `pageText.timeline`, only `rs7` has it. Timeline titles/descriptions are empty for 5/6 cars. |
| `gallery` | Medium | `galleryGrid` exists in template but has no static content and renderer has no `renderGallery` function. |
| `ratings` | High | Only `rs7` has `rating` object. Score bars remain at `width:0%` for 5/6 cars until JS fails silently. |
| `rivalry` | Medium | Comparison quiz uses `carData.comparisons`, only `rs7` has it. Other cars show fallback text. |
| `heroImage` | Critical | Missing from all JSONs. Generator falls back to `car.images?.hero`, but registry has no `images.hero` either. Result: `placeholder.svg` for 5/6 cars. |
| `schema` | High | No Product, Review, or FAQPage schema.org JSON-LD. Only BreadcrumbList is injected. |

### 1.2 `pageText` Language Coverage

Only `rs7-2026.json` contains a `pageText` object with localized content for `es`, `en`, `fr`, `ar`.  
All other 5 cars completely lack `pageText`, meaning:
- Pros & Cons sections are empty
- FAQ questions/answers are empty  
- Timeline titles/descriptions are empty
- Profile score descriptions are empty
- Used-car guide card content is empty
- Version descriptions are empty

**Severity:** Critical for user experience on 5/6 pages.

### 1.3 `problems` Array Format

All cars have `problems` as an array of plain **strings**, not structured objects with severity/cost/occurrence fields.  
The renderer treats them as simple `<li>` items.  

Example from `rs7`:
```json
["Suspensión neumática costosa tras 80.000 km", "Turbos: desgaste prematuro en calor", ...]
```

**Issue:** No repair cost estimates, no occurrence frequency, no severity rating. Less useful than structured data.

### 1.4 Missing Dimension Fields

| Field | rs7 | rs3 | bmw-m5 | amg-gt | gtr | 911 |
|-------|-----|-----|--------|--------|-----|-----|
| `cargoVolume` / `cargoCapacity` | missing | missing | missing | missing | missing | missing |
| `fuelTankCapacity` | present | missing | missing | missing | missing | missing |
| `co2` emissions | missing | missing | missing | missing | missing | missing |
| `weight` (curb/gross) | present | present | present | present | present | present |
| `dimensions.curbWeight` | present | **MISSING** | present | present | present | present |

**Critical:** `audi-rs3-2026.json` uses `dimensions.weight` instead of `dimensions.curbWeight`.  
`car-renderer.js` line 261 reads `carData.dimensions?.curbWeight?.value`, which yields `undefined` for RS3, causing the spec table to show `--` for weight.

### 1.5 Missing Fuel Economy Fields

| Field | rs7 | rs3 | bmw-m5 | amg-gt | gtr | 911 |
|-------|-----|-----|--------|--------|-----|-----|
| `consumption.combined` | present | **MISSING** | **MISSING** | **MISSING** | **MISSING** | **MISSING** |
| `consumption.city` | present | missing | missing | missing | missing | missing |
| `consumption.highway` | present | missing | missing | missing | missing | missing |
| `drivingStyles` | present | present | present | present | present | present |
| `co2` | missing | missing | missing | missing | missing | missing |

Only `rs7` has complete `city/highway/combined` consumption data. The renderer shows `--` for `specConsumption` on 5/6 cars.

### 1.6 Related Guides Section — Missing on Mercedes

`buildRelatedGuidesForCar()` filters guides where `guideData.relatedCars.includes(carId)`.  
`mercedes-amg-gt-2026` is not referenced by any guide's `relatedCars`, so the entire `<section class="guide-related">` is omitted from `mercedes-amg-gt.html`.  

This creates an **inconsistency**: 5/6 cars show related guides; 1 does not.

---

## 2. SEO

### 2.1 Meta Tags (All Pages)

| Meta | Status | Issue |
|------|--------|-------|
| `<title>` | OK | Hardcoded per car by generator |
| `<meta name="description">` | OK | Hardcoded per car by generator |
| `<meta name="keywords">` | **EMPTY** | Generator never sets `seoKeywords`. `content=""` on all pages. |
| `<link rel="canonical">` | OK | Set by generator |
| `hreflang` alternate links | **BUG** | All 4 language variants point to the **same URL** (no language-specific paths). Signals to search engines that all languages live at the same URL, which is incorrect for a multi-language site. |

### 2.2 Open Graph (All Pages)

| OG Tag | Status |
|--------|--------|
| `og:title` | OK — set by generator |
| `og:description` | OK — set by generator |
| `og:url` | OK — set by generator |
| `og:image` | **EMPTY** — generator never sets it |
| `og:type` | **EMPTY** — should be `product` or `website` |

### 2.3 Twitter Cards (All Pages)

| Twitter Tag | Status |
|-------------|--------|
| `twitter:title` | **EMPTY** — never set |
| `twitter:description` | **EMPTY** — never set |
| `twitter:image` | **EMPTY** — never set |
| `twitter:card` | **EMPTY** — should be `summary_large_image` |

### 2.4 JSON-LD Schema (All Pages)

| Schema Type | Status |
|-------------|--------|
| `BreadcrumbList` | OK — injected by generator |
| `Product` / `Car` / `Vehicle` | **MISSING** — no product schema for rich snippets (price, rating, image) |
| `FAQPage` | **MISSING** — no FAQ schema even though FAQ section exists |
| `Review` | **MISSING** — no review aggregate rating schema |

### 2.5 JSON-LD in Template

The template (`car-template.html`) contains a hardcoded `<script type="application/ld+json">` with `@type: "Car"` but **no `BreadcrumbList`**. The generator injects `BreadcrumbList` and overwrites nothing about the `Car` schema.  
However, the generated pages show **only** `BreadcrumbList` — the `Car` schema from the template is not present in generated output. The generator's replacement logic may be removing it.

---

## 3. UX

### 3.1 Sticky Navigation Text Bug

The sticky nav link for the maintenance/timeline section reads `Entretien` (French) instead of `Mantenimiento` (Spanish):

```html
<a href="#timeline" data-i18n="sticky.service">Entretien</a>
```

**Impact:** Present in template → affects **all 6 car pages**.  
**Severity:** High — undermines Spanish-language credibility.

### 3.2 Default Country Mismatch

The generator sets default country from `Object.keys(carData.countryPricing)[0].toUpperCase()`.  
For `rs7`, the first key happens to be `es`. For all other cars, the first key is `us`.  
Result: `applyCountry('US')` on 5/6 pages for a Spanish-language site.

**Impact:** Prices, currency symbols, and cost calculators default to USD/US market on most pages.  
**Severity:** Critical — directly affects price accuracy and user trust.

### 3.3 Compare Button

The Compare button (`#compareBtn`) links to `compare.html?car1=<name>`, set dynamically after `car:rendered` event.  
If JavaScript fails or is slow, the button remains with `href="compare.html"` (no car pre-selected).  
No `noscript` fallback.

### 3.4 Gallery Section — Permanently Empty

```html
<div class="gallery-grid" id="galleryGrid">
    <!-- Gallery items will be dynamically loaded -->
</div>
```

The renderer has **no `renderGallery` function**. Gallery section is always empty.  
Only `rs7` has `heroImage` (not a gallery). No car has `gallery` array in JSON.

### 3.5 FAQ Section — Mostly Empty

Only `rs7` has FAQ content in `pageText`. For other cars, the FAQ list renders with empty questions/answers because the renderer looks for `data-i18n="faq.q1"` elements but finds no `pageText.faq` data.

### 3.6 Skip Link & Main Accessibility

- Skip link exists (`<a href="#main-content" class="skip-link">`)
- `<main id="main-content">` lacks `tabindex="-1"` ( Homepage got this fix; car pages did not)
- Menu button uses `☰` Unicode character instead of inline SVG (Homepage was fixed)

---

## 4. Visual Consistency

### 4.1 Header Icons (vs Homepage)

| Element | Homepage (fixed) | Car Pages |
|---------|-----------------|-----------|
| Menu button | Inline SVG | `☰` Unicode |
| Search button | Inline SVG | `🔍` emoji |
| Dark mode | `&#9790;` entity | `&#9790;` entity |
| Profile avatar | Inline SVG | Inline SVG |

**Gap:** Menu and search buttons on car pages still use text/emoji, not SVG. Inconsistent with Homepage.

### 4.2 Footer (vs Homepage)

| Element | Homepage (fixed) | Car Pages |
|---------|-----------------|-----------|
| Social icons | Inline SVG icons (Instagram, YouTube, TikTok, X) | Plain text links `href="#"` |
| Social hover | CSS hover states with `background` + `border-radius` | No custom hover styles |
| Copyright year | Dynamic JS (`new Date().getFullYear()`) | Hardcoded `© 2026` |
| "Guías" link | `href="guias/index.html"` | Not present in car footer |
| Footer layout | 4-column grid with "CarSpecio", "Modelos", "Categorías", "Síguenos" | 3-column grid, missing "Categorías" |

**Gap:** Footer on car pages is a stripped-down version. No SVG social icons, no working links, no dynamic year.

### 4.3 Hero Images

- `rs7.html`: Uses `audi-rs7-hero.webp` (local, optimized)
- All other 5 cars: Use `../images/placeholder.svg` (LCP killer)
- No `srcset` or responsive image strategy

### 4.4 Rating Bars

All cars have rating bars with `style="width:0%"` in static HTML. They update via JS only if `carData.rating` exists.  
For 5/6 cars, bars never update from 0%. Users with JS disabled or slow connections see empty bars.

---

## 5. Data Quality

### 5.1 Placeholder Values

| Value | Location | Count |
|-------|----------|-------|
| `€0` | `#priceBase`, `#priceTaxes`, `#priceTotal` | 6 cars × 3 = 18 |
| `0 HP` | `#quickPower` | 6 |
| `0s` | `#quickAcceleration` | 6 |
| `0 km/h` | `#quickTopSpeed` | 6 |
| `--` | spec table rows (`#specEngine`, etc.) | 6 × 9 = 54 |
| `0/10` | rating values | 6 × 6 = 36 |

These are default fallback values in the template. They are replaced by JS **after** data loads. During load time (or on JS failure), users see placeholder zeros.

### 5.2 Repeated Values

The `countryPricing` object for all 6 cars contains identical `fiscalRows` structure and similar `depAnnual` curves. This suggests the data was copied from a template rather than researched per car.  

### 5.3 Invalid / Suspect Units

- `dimensions.groundClearance` uses `mm` — correct
- `fuelEconomy.consumption` uses `L/100km` — correct for EU
- `performance.acceleration.zeroToSixty` is present alongside `zeroToHundred` — both use same value in some cars (likely copy-paste error)

### 5.4 `specs.drivetrain` Type Inconsistency

`car-renderer.js` line 251 expects `carData.specs?.drivetrain?.type`, but some JSONs have `drivetrain: "awd"` (string) at the top level, not nested under `specs`.  
The renderer falls back to showing `--` when the nested path fails.

---

## 6. Lighthouse-Impacting Issues

### 6.1 Largest Contentful Paint (LCP)

| Issue | Impact | Affected Pages |
|-------|--------|----------------|
| Hero background = `placeholder.svg` (5/6 cars) | LCP increases by ~2-3s | bmw-m5, rs3, amg-gt, gtr, 911 |
| No `preload` for actual hero images | Browser discovers image late | all |
| `car-page-bundle.min.css` (144 KB) render-blocking | Blocks first paint | all |
| No critical CSS inline | Full CSS must load before paint | all |

**Note:** `rs7` preloads its hero image, but 5 others preload `placeholder.svg` — making the preload actively harmful (wastes bandwidth on a non-rendered asset).

### 6.2 Cumulative Layout Shift (CLS)

| Issue | Impact |
|-------|--------|
| Rating bars `width:0%` → JS updates to final width | Bars may shift content as they fill |
| `#galleryGrid`, `#versionsGrid`, `#faqList` empty → JS populates | Content injection causes reflow |
| Price values `€0` → actual values | Text width changes as numbers load |
| Hero badge `BADGE` → actual badge text | Text change causes shift |

### 6.3 Render-Blocking Resources

```html
<link rel="stylesheet" href="../css/car-page-bundle.min.css">
```

- No `media` attribute
- No inline critical CSS
- No `async` or `defer` for CSS (not possible for main stylesheet, but `rel="preload"` + `onload` pattern is absent)

### 6.4 Image Optimization

- No `srcset` or `sizes` on any image
- No WebP/AVIF fallback for browsers without support
- Gallery images use external URLs or placeholder — not optimized
- `loading="lazy"` is present on some images but hero is `background-image` (cannot lazy-load)

---

## Issue Summary by Severity

### Critical Issues

| # | Issue | Affected |
|---|-------|----------|
| 1 | **5/6 cars use `placeholder.svg` as hero image** — LCP severely degraded, poor UX | bmw-m5, rs3, amg-gt, gtr, 911 |
| 2 | **Default country = `US` on 5/6 pages** — Spanish site shows USD prices by default | All except rs7 |
| 3 | **5/6 cars completely lack `pageText`** — Pros/Cons, FAQ, Timeline, Profile, Used Guide all empty | All except rs7 |
| 4 | **No Product/Review/FAQPage schema.org** — Misses rich snippets in SERPs | All |
| 5 | **OG & Twitter Card meta tags empty** — No social sharing preview images | All |
| 6 | **Gallery section permanently empty** — No renderer function, no gallery data | All |

### High Issues

| # | Issue | Affected |
|---|-------|----------|
| 7 | `Entretien` (French) in sticky nav on all car pages | All |
| 8 | `keywords` meta tag empty on all pages | All |
| 9 | `hreflang` all point to same URL (no language-specific paths) | All |
| 10 | Rating bars stuck at `0%` for 5/6 cars (no `rating` data) | All except rs7 |
| 11 | Footer social links are plain text `href="#"` (no SVG icons, no real URLs) | All |
| 12 | `applyCountry('US')` in script — wrong default for Spanish site | All except rs7 |
| 13 | Preload wastes bandwidth on `placeholder.svg` (5/6 cars) | All except rs7 |
| 14 | `cargoVolume`, `fuelTankCapacity`, `co2` missing from all cars | All |
| 15 | Mercedes-AMG GT missing Related Guides section entirely | mercedes-amg-gt |
| 16 | `dimensions.curbWeight` missing from RS3 — spec table shows `--` | rs3 |
| 17 | Mojibake (UTF-8 corruption) in 5/6 generated HTML preloaded JSON | All except rs7 |

### Medium Issues

| # | Issue | Affected |
|---|-------|----------|
| 18 | `problems` array is plain strings, not structured objects | All |
| 19 | `relatedCars` section completely absent from template | All |
| 20 | Copyright year hardcoded to `2026` (no dynamic JS update) | All |
| 21 | Menu button uses `☰` instead of SVG (Homepage was fixed) | All |
| 22 | Search button uses `🔍` emoji instead of SVG | All |
| 23 | `<main>` lacks `tabindex="-1"` (Homepage got this fix) | All |
| 24 | `zeroToSixty` and `zeroToHundred` sometimes identical (copy-paste suspect) | Some |
| 25 | No `noscript` fallback for JS-dependent content | All |
| 26 | `specs.drivetrain` path inconsistency (string vs nested object) | Some |

### Low Issues

| # | Issue | Affected |
|---|-------|----------|
| 27 | `og:type` meta empty | All |
| 28 | `twitter:card` meta empty | All |
| 29 | No `srcset` / responsive images | All |
| 30 | No critical CSS inline | All |
| 31 | `highlights` array duplicated between `basicInfo` and `pageText` (potential for drift) | rs7 |
| 32 | Footer grid is 3-column on car pages vs 4-column on Homepage | All |
| 33 | `car-page-bundle.min.css` not split into critical + deferred | All |

---

## Top 10 Improvements (Highest Impact)

| Rank | Improvement | Expected Impact | Effort |
|------|-------------|-----------------|--------|
| 1 | **Add real hero images for all 6 cars** (photography or brand assets) | LCP ↓ 2-3s, visual quality, user trust | Medium |
| 2 | **Populate `pageText` for all 5 remaining cars** (pros, cons, FAQ, timeline, profile, used guide) | Content completeness, SEO, user engagement | High |
| 3 | **Fix default country to `ES`** in generator + force `applyCountry('ES')` | Price accuracy, user trust, conversion | Low |
| 4 | **Implement `Product` + `FAQPage` schema.org JSON-LD** | Rich snippets in SERPs, CTR ↑ | Medium |
| 5 | **Set `og:image` and `twitter:image`** using hero image + add `og:type="product"` | Social sharing quality, referral traffic | Low |
| 6 | **Add `relatedCars` section** to template + populate `relatedCars` in JSON | Cross-linking, page depth, SEO | Medium |
| 7 | **Fix mojibake in generated HTML** (ensure UTF-8 write in generator) | Professional appearance, search indexing | Low |
| 8 | **Fix `Entretien` → `Mantenimiento`** in template sticky nav | Language credibility, UX | Trivial |
| 9 | **Align car page footer with Homepage** (SVG social icons, dynamic year, working links) | Visual consistency, brand trust | Medium |
| 10 | **Add `gallery` data + `renderGallery` function** or remove empty section | Content completeness, CLS reduction | Medium |

---

## Appendix: File References

| File | Role |
|------|------|
| `html/rs7.html` | Only car page with real hero image and full `pageText` |
| `html/bmw-m5.html`, `html/rs3.html`, `html/mercedes-amg-gt.html`, `html/nissan-gtr.html`, `html/porsche-911.html` | Missing hero image, `pageText`, and contain mojibake |
| `system/templates/car-template.html` | Source template — contains `Entretien` bug, empty OG/Twitter, `applyCountry('ES')` |
| `system/generators/car-page-generator.js` | Generator — missing OG image injection, uses wrong default country logic |
| `js/car-renderer.js` | Client-side renderer — missing `renderGallery`, expects `dimensions.curbWeight` |
| `system/data/*-2026.json` | Car data — rs7 complete, others missing `pageText`, `rating`, `heroImage` |
