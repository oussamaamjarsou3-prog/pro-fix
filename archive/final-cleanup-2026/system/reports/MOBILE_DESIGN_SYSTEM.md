# Mobile Design System — AutoMax Car Pages

## Date: June 18, 2026
## Scope: All Car Pages (RS7, RS3, M5, AMG GT, GT-R, 911)

---

## 1. Problems Found (Before Fixes)

### A. `car-template.html` loaded `style.css` (3,694 lines)
- Contains CSS for Homepage + Comparison + Contact + RS7
- **Wasted bandwidth** on every car page
- No mobile-first approach

### B. Hero Sections too tall
```css
.car-hero { height: 100vh; min-height: 600px; }
```
- On iPhone SE: hero takes **667px** (entire screen)
- User must scroll excessively to reach content

### C. Cards with massive padding
```css
.price-box { padding: 70px; }       /* too much on mobile */
.info-card { padding: 44px 28px; }   /* wasted space */
.score-box { padding: 40px 20px; }
```

### D. Tables hide overflow instead of scroll
```css
.compare-table { overflow-x: hidden; }  /* content gets cut off! */
```
Correct: `overflow-x: auto; -webkit-overflow-scrolling: touch;`

### E. Font sizes too large on mobile
```css
.rs7-content h1 { font-size: 44px; }  /* 12% of screen width per char */
```

### F. Header controls hide text
```css
.ctrl-text { display: none; }  /* "España" disappears */
```
Result: `[☰] [Logo] [🔍] [🇪🇸]` — user can't read labels

### G. No horizontal scroll hint on tables
- Users don't know tables are scrollable
- Missing gradient shadow indicator

### H. `css/car-page.css` existed but was unused
- 1,947 lines of car-specific CSS
- Template loaded `style.css` instead
- Wasted architecture effort

---

## 2. What Was Migrated to `car-template.html`

| Change | File | Detail |
|--------|------|--------|
| CSS links updated | `system/templates/car-template.html` | Replaced `style.css` with `car-page.css` + `car-page-mobile.css` |
| New file included | template | Added `car-page-mobile.css` for all generated pages |

**Result**: Every new car page now inherits:
- Clean car-specific CSS (not bloated homepage CSS)
- Dedicated mobile override layer

---

## 3. What Was Migrated to `system/`

### A. `css/car-page.css` (Updated)
**Changes made:**
- Hero: `height: 100vh` → `height: auto; min-height: 85vh; max-height: 900px;`
- Price box: `padding: 70px` → `padding: 50px 40px;`
- Info cards: `padding: 44px 28px` → `padding: 32px 20px;`
- Section padding: `var(--section-padding)` → `clamp(50px, 5vw, 120px) clamp(16px, 4vw, 80px);`
- Section title margin: `65px` → `clamp(32px, 4vw, 65px);`

### B. `css/car-page-mobile.css` (New — 23 sections)

| Section | Breakpoint | Fixes Applied |
|---------|------------|---------------|
| 1. Mobile Variables | 768px | Compact spacing, font scale |
| 2. Header Mobile | 768px | Compact controls, icon+text visible |
| 3. Hero Mobile | 768px | Shorter hero, responsive fonts |
| 4. Sticky Nav | 768px | Horizontal scroll, touch-friendly |
| 5. Section Titles | 768px | Smaller margins |
| 6. Quick Info Cards | 768px | 2-column grid, compact padding |
| 7. Price Box | 768px | Reduced padding |
| 8. Specs Tables | 768px | `overflow-x: auto` + scroll shadow hint |
| 9. Versions Grid | 768px | Single column, smaller images |
| 10. Gallery | 768px | Single column, 220px height |
| 11. Problems/Pros/Score | 768px | Compact cards |
| 12. Calculator | 768px | Single column layout |
| 13. Comparison | 768px | Stacked bar rows |
| 14. Timeline | 768px | Vertical layout (no left border) |
| 15. CTA | 768px | Stacked buttons, full width |
| 16. Related Cars | 768px | 1-2 column grid |
| 17. Quiz | 768px | Compact options |
| 18. Depreciation | 768px | Single column |
| 19. Options Table | 768px | Horizontal scroll |
| 20. Used Guide | 768px | Single column cards |
| 21. Footer | 768px | Single column grid |
| 22. Touch Devices | `hover: none` | Disable hover transforms, min 44px touch targets |
| 23. Reduced Motion | `prefers-reduced-motion` | Disable animations |

### C. Small Mobile (480px) & Ultra Small (360px)
- Further font reduction
- Hero: `min-height: 60vh; max-height: 500px;`
- Header: icon-only on 360px
- Cards: even more compact

---

## 4. What New Cars Inherit Automatically

When you add a new car (e.g., `taycan-2026`):

### Generator produces:
```html
<link rel="stylesheet" href="../css/car-page.css">
<link rel="stylesheet" href="../css/car-page-mobile.css">
<link rel="stylesheet" href="../css/mega-menu-base.css">
<link rel="stylesheet" href="../css/mega-menu-full.css">
<link rel="stylesheet" href="../css/responsive.css">
```

### Inherited for free:
| Feature | Source |
|---------|--------|
| Compact hero (85vh max) | `car-page.css` |
| Responsive section padding | `car-page.css` |
| Horizontal scroll tables | `car-page-mobile.css` |
| Touch-friendly buttons (44px min) | `car-page-mobile.css` |
| 2-column quick info cards | `car-page-mobile.css` |
| Sticky nav with horizontal scroll | `car-page-mobile.css` |
| Scroll shadow hint on tables | `car-page-mobile.css` |
| Reduced motion support | `car-page-mobile.css` |
| Landscape mobile fixes | `car-page-mobile.css` |
| RTL support (if needed) | `car-page.css` |

### Optional per-car override:
```html
<!-- Add after Design System -->
<link rel="stylesheet" href="../css/taycan.css">
```
Use only for car-specific styles (color accents, hero image, etc.)

---

## 5. Header Controls Behavior

| Screen Size | Country Button | Language Button |
|-------------|---------------|-----------------|
| Desktop (>768px) | `🇪🇸 España ▼` | `🌐 Español ▼` |
| Mobile (768px) | `🇪🇸 España ▼` (compact) | `🌐 Español ▼` (compact) |
| Small (480px) | `🇪🇸 Esp ▼` (truncated) | `🌐 Esp ▼` |
| Ultra-small (360px) | `🇪🇸` (icon only) | `🌐` (icon only) |

Menus open as **bottom sheets** on mobile (not dropdowns):
- Fixed to bottom
- Rounded top corners
- Max 60vh height
- Scrollable
- Backdrop click to close

---

## 6. Mobile-First Typography Scale

| Element | Desktop | Mobile (<768px) | Small (<480px) |
|---------|---------|-----------------|----------------|
| Hero h1 | 88px | `clamp(32px, 10vw, 44px)` | 32px |
| Section h2 | 48px | `clamp(24px, 7vw, 32px)` | 24px |
| Card h3 | 40px | 28px | 22px |
| Body | 17px | 15px | 14px |
| Price | 68px | 48px | 36px |

---

## 7. Card Density Comparison

| Card Type | Before Padding | After Padding | Reduction |
|-----------|---------------|-------------|-----------|
| info-card | 44px 28px | 32px 20px | ~30% |
| price-box | 70px | 50px 40px | ~35% |
| score-box | 40px 20px | 24px 18px | ~40% |
| problems-box | 40px 20px | 24px 18px | ~40% |
| guide-card | 30px | 20px 16px | ~35% |

---

## 8. Files Changed

| File | Action | Lines |
|------|--------|-------|
| `system/templates/car-template.html` | Updated CSS links | +2 |
| `css/car-page.css` | Updated base styles | ~10 modified |
| `css/car-page-mobile.css` | **New** | 23 sections, ~400 lines |
| `rs7.html` | Updated CSS links | +2 |
| `html/*.html` (6 files) | Regenerated | All updated |

---

## 9. Testing Checklist for New Cars

When adding a new car, verify on:
- [ ] iPhone SE (375×667)
- [ ] iPhone 14 Pro (393×852)
- [ ] iPad Mini (768×1024)
- [ ] Desktop (1920×1080)
- [ ] Landscape mobile

Check:
- [ ] No horizontal scroll on page
- [ ] Tables scroll horizontally
- [ ] Hero fits without excessive scroll
- [ ] Cards are compact
- [ ] Navigation is tappable (44px min)
- [ ] Country/Language menus open as sheets
- [ ] Images scale correctly
- [ ] No FOUT (content-ready class)

---

## Architecture Diagram

```
system/data/NEW-CAR.json
         |
         v
system/build.js
         |
         +-- car-page-generator.js
         |      |
         |      v
         |   system/templates/car-template.html
         |      |
         |      +-- css/car-page.css         (base styles)
         |      +-- css/car-page-mobile.css  (mobile overrides)
         |      +-- css/mega-menu-*.css      (navigation)
         |      +-- css/responsive.css       (fallback)
         |      |
         |      v
         |   html/NEW-CAR.html  (generated)
         |
         +-- mega-menu-generator.js
         +-- compare-data-generator.js
         +-- search-index-generator.js
         +-- sitemap-generator.js
```

**No manual CSS edits needed for new cars.**
