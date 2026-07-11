# AutoMax Car Page Templates

## 📁 Template Files

| File | Purpose |
|------|---------|
| `car-template.html` | Complete HTML template for new car pages |
| `car-data-template.js` | JavaScript data structure template |

---

## ✅ All Fixes Applied (June 2026)

### 1. FOUT Protection (Flash of Untranslated Content)
```html
<!-- In <head> -->
<style>
    body { opacity: 0; transition: opacity 0.3s ease; }
    body.content-ready { opacity: 1; }
    #pageLoader { /* spinner styles */ }
</style>

<!-- After <body> -->
<div id="pageLoader"><div class="loader-spinner"></div></div>
```

### 2. Mega Menu CSS (includes Header Tools)
```html
<link rel="stylesheet" href="../css/mega-menu-base.css">
<link rel="stylesheet" href="../css/mega-menu-full.css">
```

**Note:** `mega-menu-full.css` now includes styles for:
- `.header-tools` - container for buttons
- `.header-search` - search input with 🔍 icon
- `.tool-btn` - country, language, dark mode buttons
- `.glass` - glassmorphism effect

### 3. Header Structure (Unified)
```html
<header class="site-header">
    <a href="index.html" class="logo">AutoMax</a>
    <nav class="site-nav" id="siteNav">
        <a href="index.html">Inicio</a>
        <div class="mega-menu-container">
            <a href="marcas.html" class="mega-menu-link">Marcas</a>
            <div class="mega-menu">...</div>
        </div>
        <a href="reviews.html">Reviews</a>
        <a href="diagnostico.html">Diagnóstico</a>
        <a href="herramientas.html">Herramientas</a>
        <a href="contacto.html">Contacto</a>
        
        <!-- Country Dropdown -->
        <div class="nav-dropdown country-dropdown">
            <button class="tool-btn-country" id="countryToggle" aria-expanded="false">
                <span class="btn-icon">🇪🇸</span>
                <span class="btn-text">ES</span>
            </button>
            <div class="dropdown-menu country-menu" id="countryMenu">
                <button data-country="es" data-label="ES" data-icon="🇪🇸">🇪🇸 España</button>
                <button data-country="de" data-label="DE" data-icon="🇩🇪">🇩🇪 Deutschland</button>
                ...
            </div>
        </div>
        
        <!-- Language Dropdown -->
        <div class="nav-dropdown lang-dropdown">
            <button class="tool-btn-lang" id="langToggle" aria-expanded="false">
                <span class="btn-icon">🇪🇸</span>
                <span class="btn-text">ES</span>
            </button>
            <div class="dropdown-menu lang-menu" id="langMenu">
                <button data-lang="es" data-label="ES" data-icon="🇪🇸">🇪🇸 Español</button>
                <button data-lang="en" data-label="EN" data-icon="🇬🇧">🇬🇧 English</button>
                ...
            </div>
        </div>
    </nav>
    <div class="header-tools">
        <label class="header-search">🔍 <input placeholder="Buscar..."></label>
        <button id="darkbtn">&#9790;</button>  <!-- Dark mode -->
    </div>
</header>
```

### 4. Back Buttons
```html
<button class="mega-menu__back-btn">← Volver a Marcas</button>
<button class="mega-menu__back-btn">← Volver a Categorías</button>
```

### 5. Short Titles (No Long Car Names)
```html
<!-- GOOD -->
<h2>Problemas comunes</h2>
<h2>Veredicto</h2>
<h2>¿Merece la pena?</h2>

<!-- BAD -->
<h2>Problemas Audi RS7 Sportback 2026</h2>
<h2>Valoración general del Audi RS7</h2>
```

### 5. Problems Section with Fallback
```html
<ul data-i18n-list="problems.items" data-i18n-list-class="problem-item">
    <li class="problem-item">Problema 1: descripción...</li>
    <li class="problem-item">Problema 2: descripción...</li>
    <!-- Fallback content displays even if JS fails -->
</ul>
```

### 6. Quiz Section (Improved)
```html
<span>TEST</span>
<h2>¿Cuál es tu coche ideal?</h2>
<p>4 preguntas para descubrir si eres más Car o Rival.</p>
```

### 7. Remove Decorative Symbols
```html
<!-- BAD -->
<li>✔ La versión Performance...</li>
<li>⚠ Cuidado con...</li>
<td>± Neutro</td>
<td>− Bajo</td>

<!-- GOOD -->
<li>La versión Performance...</li>
<li>Cuidado con...</li>
<td>Neutro</td>
<td>Negativo</td>
```

### 8. Character Encoding (UTF-8)
```javascript
// Spanish
"Región", "matriculación", "Cataluña", "País Vasco", "Andalucía", "España"

// French  
"Région", "CO₂", "Île-de-France", "Côte", "Rhône"

// German
"Württemberg"
```

### 9. Country Pricing Data
```javascript
countryPricing: {
    es: {
        name: 'España',
        flag: '🇪🇸',
        currency: 'EUR',
        locale: 'es-ES',
        fiscalHead: ['Región', 'Impuesto matriculación', 'ITV', 'Precio final'],
        fiscalRows: [
            ['Madrid', '~21%', '380 EUR', 169100],
            ['Cataluña', '~21%', '420 EUR', 169140]
        ],
        // ... more fields
    }
}
```

### 10. No Mega Menu Footer
```html
<!-- REMOVED -->
<!-- <div class="mega-menu__footer"> -->
<!--     <a href="marcas.html">Ver todas las marcas →</a> -->
<!-- </div> -->
```

### 11. Dropdown JavaScript (Required)
```javascript
// Country & Language Dropdown Toggle
const countryToggle = document.getElementById('countryToggle');
const countryMenu = document.getElementById('countryMenu');
const langToggle = document.getElementById('langToggle');
const langMenu = document.getElementById('langMenu');

countryToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = countryMenu?.classList.contains('active');
    langMenu?.classList.remove('active');
    countryMenu?.classList.toggle('active');
    countryToggle?.setAttribute('aria-expanded', !isOpen);
});

langToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = langMenu?.classList.contains('active');
    countryMenu?.classList.remove('active');
    langMenu?.classList.toggle('active');
    langToggle?.setAttribute('aria-expanded', !isOpen);
});

// Handle Selection Changes
countryMenu?.querySelectorAll('button[data-country]').forEach(btn => {
    btn.addEventListener('click', () => {
        const country = btn.dataset.country;
        const label = btn.dataset.label;
        const icon = btn.dataset.icon;
        
        // Update active state
        countryMenu.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update toggle button
        const iconSpan = countryToggle?.querySelector('.btn-icon');
        const textSpan = countryToggle?.querySelector('.btn-text');
        if (iconSpan) iconSpan.textContent = icon;
        if (textSpan) textSpan.textContent = label;
        
        // Close menu
        countryMenu.classList.remove('active');
        countryToggle?.setAttribute('aria-expanded', 'false');
        
        // TODO: Add country change logic (currency, prices, etc.)
        console.log(`Country: ${country} (${label})`);
    });
});

langMenu?.querySelectorAll('button[data-lang]').forEach(btn => {
    btn.addEventListener('click', () => {
        const lang = btn.dataset.lang;
        const label = btn.dataset.label;
        const icon = btn.dataset.icon;
        
        // Update active state
        langMenu.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update toggle button
        const iconSpan = langToggle?.querySelector('.btn-icon');
        const textSpan = langToggle?.querySelector('.btn-text');
        if (iconSpan) iconSpan.textContent = icon;
        if (textSpan) textSpan.textContent = label;
        
        // Close menu
        langMenu.classList.remove('active');
        langToggle?.setAttribute('aria-expanded', 'false');
        
        // TODO: Add language change logic (translations, RTL, etc.)
        document.documentElement.lang = lang;
        if (typeof applyTranslations === 'function') applyTranslations();
        console.log(`Language: ${lang} (${label})`);
    });
});

// Close on outside click
document.addEventListener('click', () => {
    countryMenu?.classList.remove('active');
    langMenu?.classList.remove('active');
});
```

---

## 📋 Quick Checklist for New Pages

- [ ] Copy `car-template.html` to `html/car-name.html`
- [ ] Update title, meta description
- [ ] Create `system/data/car-2026.json` with countryPricing
- [ ] Add car to `mega-menu-data.js` modelPageMap
- [ ] Test FOUT (Ctrl+F5, should see spinner then content)
- [ ] Test Mega Menu (back buttons, no footer)
- [ ] Test Country/Language Dropdowns (click to open/close)
- [ ] Test Fiscal Table (switch countries)
- [ ] Check encoding (Cataluña not CataluÃ±a)

---

## 🎯 Section Order in Template

1. Hero (title, tagline)
2. Quick Info (power, 0-100, consumption)
3. Gallery
4. Versions
5. Engine & Sound
6. Real Consumption
7. Cost Calculator
8. Fiscal/Taxes
9. Options Guide
10. Timeline/Maintenance
11. **Problems** (with fallback)
12. **Rival Comparison**
13. **Quiz**
14. **Used Car Guide**
15. Pros & Cons
16. Veredicto/Score
17. FAQ
18. Footer

---

## 🔧 Data Requirements

### Minimum Required in car-data.json:
- `basicInfo`: fullModelName, tagline
- `performance`: power, acceleration
- `specs`: engine, consumption
- `countryPricing`: at least `es` with fiscalHead/fiscalRows
- `comparisons`: car1, car2 names for quiz

---

## ⚠️ Common Mistakes to Avoid

1. **Don't** use `✔ ✖ ⚠ ± −` symbols
2. **Don't** write long titles with full car names
3. **Don't** forget fallback content in lists
4. **Don't** use broken UTF-8 (CataluÃ±a)
5. **Don't** include mega-menu__footer
6. **Don't** forget FOUT protection CSS

---

## 🚀 Future Improvements

These templates ensure new car pages will have:
- Consistent styling
- Proper translations
- No FOUC/FOUT issues
- Working fiscal tables
- Interactive quiz
- Fallback content

**All fixes from rs7.html are now in the templates!**
