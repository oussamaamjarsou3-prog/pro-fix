/**
 * fix-homepage.js
 * Phase A: Critical Homepage Fixes
 * 1. Fix character encoding (latin1/win1252 → UTF-8)
 * 2. Replace corrupted ? icons with inline SVG
 * 3. Remove external dependencies (unsplash, simpleicons)
 * 4. Add Guides section from guide registry
 * 5. Improve footer (proper icons, copyright, accessibility)
 */

'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../../');
const INDEX = path.join(ROOT, 'html/index.html');
const GUIDE_REGISTRY = path.join(ROOT, 'system/registry/guide-registry.json');

// ── 1. Read raw bytes and decode as latin1 (the actual encoding of the file) ──
let html = fs.readFileSync(INDEX, 'latin1');

// ── 2. Fix all latin1/win1252 encoded characters ──
// The file was saved in Windows-1252 but has a UTF-8 declaration.
// Characters like á (0xE1), é (0xE9), etc. were read as latin1 replacements.
const WIN1252 = {
    '\xE1': 'á', '\xC1': 'Á',
    '\xE9': 'é', '\xC9': 'É',
    '\xED': 'í', '\xCD': 'Í',
    '\xF3': 'ó', '\xD3': 'Ó',
    '\xFA': 'ú', '\xDA': 'Ú',
    '\xF1': 'ñ', '\xD1': 'Ñ',
    '\xFC': 'ü', '\xDC': 'Ü',
    '\xBF': '¿', '\xA1': '¡',
    '\x80': '€', '\xA9': '©',
    '\xAD': '­', '\xBB': '»', '\xAB': '«',
    '\xE0': 'à', '\xE8': 'è', '\xEC': 'ì', '\xF2': 'ò', '\xF9': 'ù',
    '\xE2': 'â', '\xEA': 'ê', '\xEE': 'î', '\xF4': 'ô', '\xFB': 'û',
    '\xE7': 'ç', '\xC7': 'Ç',
    '\xB7': '·', '\xBA': 'º', '\xAA': 'ª',
    '\xB0': '°', '\xB1': '±', '\xB5': 'µ',
    '\x96': '–', '\x97': '—',
    '\x91': '\u2018', '\x92': '\u2019',
    '\x93': '\u201C', '\x94': '\u201D',
    '\x85': '…', '\x95': '•',
    '\x27': "'",
};
for (const [byte, char] of Object.entries(WIN1252)) {
    html = html.split(byte).join(char);
}

// ── 3. Replace corrupted ? / ?? icons with proper inline SVGs ──

// SVG icon definitions
const SVG = {
    menu: `<svg aria-hidden="true" focusable="false" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`,
    close: `<svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    search: `<svg aria-hidden="true" focusable="false" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
    back: `<svg aria-hidden="true" focusable="false" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`,
    arrowRight: `<svg aria-hidden="true" focusable="false" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
    compare: `<svg aria-hidden="true" focusable="false" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/></svg>`,
    trophy: `<svg aria-hidden="true" focusable="false" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4a2 2 0 010-4h2"/><path d="M18 9h2a2 2 0 000-4h-2"/><path d="M6 9a6 6 0 0012 0V3H6v6z"/><path d="M12 15v4"/><path d="M8 20h8"/></svg>`,
    envelope: `<svg aria-hidden="true" focusable="false" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/></svg>`,
    dark: `<svg aria-hidden="true" focusable="false" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 0010 9.79z"/></svg>`,
    lang: `<svg aria-hidden="true" focusable="false" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>`,
    // Social icons
    instagram: `<svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`,
    youtube: `<svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.4a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>`,
    tiktok: `<svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12a4 4 0 104 4V4a5 5 0 005 5"/></svg>`,
    twitter: `<svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4l16 16M4 20L20 4"/></svg>`,
};

// Replace menu button content
html = html.replace(
    /<button type="button" class="menu-btn" id="menuBtn" aria-label="Abrir menú" aria-expanded="false">[^<]*<\/button>/,
    `<button type="button" class="menu-btn" id="menuBtn" aria-label="Abrir menú" aria-expanded="false">${SVG.menu}</button>`
);

// Replace mega-menu close button content
html = html.replace(
    /<button class="mega-menu__close" id="megaMenuClose" aria-label="Cerrar menú">[^<]*<\/button>/,
    `<button class="mega-menu__close" id="megaMenuClose" aria-label="Cerrar menú">${SVG.close}</button>`
);

// Replace mega-menu search button content
html = html.replace(
    /<button class="mega-menu__search-btn" aria-label="Buscar">[^<]*<\/button>/,
    `<button class="mega-menu__search-btn" aria-label="Buscar">${SVG.search}</button>`
);

// Replace back-to-brands button (? Volver a Marcas)
html = html.replace(
    /<button class="mega-menu__back-btn" id="backToBrands">[^<]*<\/button>/,
    `<button class="mega-menu__back-btn" id="backToBrands">${SVG.back} Volver a Marcas</button>`
);

// Replace back-to-categories button (? Volver a Categorías)
html = html.replace(
    /<button class="mega-menu__back-btn" id="backToCategories">[^<]*<\/button>/,
    `<button class="mega-menu__back-btn" id="backToCategories">${SVG.back} Volver a Categorías</button>`
);

// Replace header search icon (??)
html = html.replace(
    /<label class="header-search glass" aria-label="Buscar">\s*<span aria-hidden="true">[^<]*<\/span>/,
    `<label class="header-search glass" aria-label="Buscar">\n                <span aria-hidden="true">${SVG.search}</span>`
);

// Replace dark mode button content (??)
html = html.replace(
    /<button type="button" id="darkbtn" class="tool-btn glass" aria-label="Modo oscuro">[^<]*<\/button>/,
    `<button type="button" id="darkbtn" class="tool-btn glass" aria-label="Modo oscuro">${SVG.dark}</button>`
);

// Replace lang button content (????)
html = html.replace(
    /<button type="button" class="tool-btn tool-btn-lang glass" aria-label="Idioma" title="Español">[^<]*<\/button>/,
    `<button type="button" class="tool-btn tool-btn-lang glass" aria-label="Idioma" title="Español">${SVG.lang}</button>`
);

// Replace hero "Comparar ?" button
html = html.replace(
    /<button type="submit" class="btn-hero-compare">Comparar [^<]*<\/button>/,
    `<button type="submit" class="btn-hero-compare">Comparar ${SVG.arrowRight}</button>`
);

// Replace stat icons (various ?? patterns)
html = html.replace(
    /(<div class="stat-item reveal">\s*<div class="stat-icon" aria-hidden="true">)[^<]*(<!--[^>]*-->)?(<\/div>\s*<strong>250\+<\/strong>)/s,
    (m, pre, _, post) => `${pre}${SVG.compare}${post}`
);

// Replace all remaining ??, ?, ??? in stat-icon divs with a generic SVG
// Stats: Comparativas (compare), Marcas (globe/car), Reviews (star), Usuarios (users), Actualizado (refresh)
const STAT_SVGS = [
    `<svg aria-hidden="true" focusable="false" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/></svg>`,
    `<svg aria-hidden="true" focusable="false" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>`,
    `<svg aria-hidden="true" focusable="false" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    `<svg aria-hidden="true" focusable="false" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>`,
    `<svg aria-hidden="true" focusable="false" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>`,
];

let statIdx = 0;
html = html.replace(/<div class="stat-icon" aria-hidden="true">[^<]*<\/div>/g, () => {
    const svg = STAT_SVGS[statIdx % STAT_SVGS.length];
    statIdx++;
    return `<div class="stat-icon" aria-hidden="true">${svg}</div>`;
});

// Replace "Ver todas ?" arrows in section links
html = html.replace(/Ver todas [^\w<"]+/g, `Ver todas ${SVG.arrowRight} `);
html = html.replace(/Leer reseña [^\w<"]+/g, `Leer reseña ${SVG.arrowRight} `);

// Replace trophy icons
html = html.replace(/<div class="trophy" aria-hidden="true">[^<]*<\/div>/g, `<div class="trophy" aria-hidden="true">${SVG.trophy}</div>`);

// Replace newsletter icon (??)
html = html.replace(
    /<div class="nl-icon" aria-hidden="true">[^<]*<\/div>/,
    `<div class="nl-icon" aria-hidden="true">${SVG.envelope}</div>`
);

// Replace social icons in footer
html = html.replace(
    /<a href="#" aria-label="Instagram">[^<]*<\/a>/,
    `<a href="#" aria-label="Instagram" class="social-link">${SVG.instagram}</a>`
);
html = html.replace(
    /<a href="#" aria-label="YouTube">[^<]*<\/a>/,
    `<a href="#" aria-label="YouTube" class="social-link">${SVG.youtube}</a>`
);
html = html.replace(
    /<a href="#" aria-label="TikTok">[^<]*<\/a>/,
    `<a href="#" aria-label="TikTok" class="social-link">${SVG.tiktok}</a>`
);
html = html.replace(
    /<a href="#" aria-label="Twitter">[^<]*<\/a>/,
    `<a href="#" aria-label="Twitter/X" class="social-link">${SVG.twitter}</a>`
);

// Replace RESEÑA badges (corrupted RESE�A)
html = html.replace(/RESE[^A<]*A COMPLETA/g, 'RESEÑA COMPLETA');

// ── 4. Remove external dependencies ──

// Replace cdn.simpleicons.org brand logos with text-only fallback (no img)
// In mega-menu brands: remove the <img> tag entirely (brand already has <span>)
html = html.replace(/<img class="mega-menu__brand-logo" src="https:\/\/cdn\.simpleicons\.org\/[^"]*" alt="" loading="lazy">/g, '');

// In brands marquee: replace simpleicons imgs with SVG car silhouette placeholder
const BRAND_LOGO_SVG = `<svg class="brand-logo-svg" aria-hidden="true" focusable="false" viewBox="0 0 56 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 22h40M10 22l3-9h30l3 9"/><circle cx="16" cy="22" r="3.5"/><circle cx="40" cy="22" r="3.5"/><path d="M13 13h5l2-4h10l2 4h5"/></svg>`;

html = html.replace(/<img class="brand-logo" src="https:\/\/cdn\.simpleicons\.org\/[^"]*" alt="" width="\d+" height="\d+" loading="lazy">/g, BRAND_LOGO_SVG);

// Replace all remaining unsplash URLs with local audi-rs7 image (it's the only real car image available)
html = html.replace(/https:\/\/images\.unsplash\.com\/[^'"]+/g, 'images/audi-rs7-hero.webp');

// Replace placeholder.svg for rank card backgrounds with CSS gradient (remove inline bg-image)
html = html.replace(
    /style="background-image: url\('images\/placeholder\.svg'\)"/g,
    'style="background: linear-gradient(135deg, rgba(37,99,235,0.15) 0%, rgba(2,6,23,0.9) 100%)"'
);

// Replace placeholder.svg in brand marquee img tags with SVG
html = html.replace(
    /<img class="brand-logo[^"]*" src="images\/placeholder\.svg" alt="" width="\d+" height="\d+" loading="lazy">/g,
    BRAND_LOGO_SVG
);

// Replace placeholder.svg in review card images with local car image
html = html.replace(
    /<img class="review-image" src="images\/placeholder\.svg" alt="([^"]*)" loading="lazy">/g,
    `<img class="review-image" src="images/audi-rs7-hero.webp" alt="$1" loading="lazy" decoding="async">`
);

// Replace existing review-image that already has correct src (update Audi one to add decoding)
html = html.replace(
    /<img class="review-image" src="images\/audi-rs7-hero\.webp" alt="Audi RS7" loading="lazy">/,
    `<img class="review-image" src="images/audi-rs7-hero.webp" alt="Audi RS7" loading="lazy" decoding="async">`
);

// Replace placeholder.svg in news card images
html = html.replace(
    /<img class="news-image" src="images\/placeholder\.svg" alt="([^"]*)" loading="lazy">/g,
    `<img class="news-image" src="images/audi-rs7-hero.webp" alt="$1" loading="lazy" decoding="async">`
);

// Fix hero background
html = html.replace(
    `style="background-image: url('images/placeholder.svg')"`,
    `style="background-image: url('images/audi-rs7-hero.webp')"`
);

// ── 5. Fix mega-menu breadcrumb separators ──
html = html.replace(/<span class="mega-menu__crumb-sep" aria-hidden="true">[^<]*<\/span>/g,
    `<span class="mega-menu__crumb-sep" aria-hidden="true">›</span>`);

// ── 6. Add Guides section (from registry) ──
const guideRegistry = JSON.parse(fs.readFileSync(GUIDE_REGISTRY, 'utf8'));

const DIFFICULTY_LABELS = {
    beginner: 'Principiante',
    intermediate: 'Intermedio',
    advanced: 'Avanzado',
};
const CATEGORY_LABELS = {
    'maintenance': 'Mantenimiento',
    'car-buying': 'Compra de Coche',
    'breakdowns': 'Averías',
    'fuel-consumption': 'Combustible',
    'tires': 'Neumáticos',
    'insurance': 'Seguros',
    'itv': 'ITV',
    'taxation': 'Impuestos',
    'electric-cars': 'Eléctricos',
    'hybrid-cars': 'Híbridos',
    'driving': 'Conducción',
    'seasonal': 'Estacional',
};

function buildGuideCard(guideFile) {
    const data = JSON.parse(fs.readFileSync(path.join(ROOT, guideFile), 'utf8'));
    const guideEntry = guideRegistry.guides.find(g => g.id === data.id);
    if (!guideEntry) return '';
    const title = (data.content.es || {}).title || data.id;
    const excerpt = (data.content.es || {}).excerpt || '';
    const catLabel = CATEGORY_LABELS[data.category] || data.category;
    const diffLabel = DIFFICULTY_LABELS[data.difficulty] || data.difficulty;
    const mins = data.readingTime || '';
    const url = `guias/${data.slug}.html`;
    return `
                    <a href="${url}" class="guide-card-home reveal">
                        <div class="guide-card-home__meta">
                            <span class="guide-card-home__cat">${catLabel}</span>
                            <span class="guide-card-home__diff guide-card-home__diff--${data.difficulty}">${diffLabel}</span>
                        </div>
                        <h3 class="guide-card-home__title">${title}</h3>
                        <p class="guide-card-home__excerpt">${excerpt}</p>
                        <div class="guide-card-home__footer">
                            ${mins ? `<span class="guide-card-home__time"><svg aria-hidden="true" focusable="false" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> ${mins} min</span>` : ''}
                            <span class="guide-card-home__cta">Leer guía <svg aria-hidden="true" focusable="false" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
                        </div>
                    </a>`;
}

const guideCards = guideRegistry.guides
    .map(g => buildGuideCard(g.dataFile))
    .filter(Boolean)
    .join('');

const GUIDES_SECTION = `
        <!-- GUÍAS -->
        <section class="dash-section dash-section--alt" id="guias" aria-labelledby="guidesHeading">
            <div class="container">
                <div class="section-head">
                    <h2 id="guidesHeading">Guías de mantenimiento</h2>
                    <a href="guias/index.html" class="link-all">Ver todas las guías <svg aria-hidden="true" focusable="false" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></a>
                </div>
                <div class="guide-cards-home">
${guideCards}
                </div>
            </div>
        </section>
`;

// Insert the guides section just before the NEWSLETTER section
html = html.replace(
    /(\s*<!-- NEWSLETTER -->)/,
    `\n${GUIDES_SECTION}$1`
);

// ── 7. Improve footer ──
// Add Guías column, fix nav col, fix copyright dynamic year

// Add Guías to footer navigation column
html = html.replace(
    `<div class="footer-col reveal">
                <h3>Navegación</h3>
                <a href="index.html">Inicio</a>
                <a href="compare.html">Comparar</a>
                <a href="reviews.html">Reviews</a>
                <a href="#noticias">Noticias</a>
            </div>`,
    `<div class="footer-col reveal">
                <h3>Navegación</h3>
                <a href="index.html">Inicio</a>
                <a href="compare.html">Comparar</a>
                <a href="reviews.html">Reviews</a>
                <a href="guias/index.html">Guías</a>
                <a href="#noticias">Noticias</a>
            </div>`
);

// Fix footer copyright with dynamic year script
html = html.replace(
    `<p class="copyright">© 2026 CarSpecio — Todos los derechos reservados</p>`,
    `<p class="copyright">© <span id="footerYear">2026</span> CarSpecio — Todos los derechos reservados</p>\n    <script>var y=document.getElementById('footerYear');if(y)y.textContent=new Date().getFullYear();</script>`
);

// ── 8. Add canonical + OG tags to <head> ──
const CANONICAL_OG = `
    <link rel="canonical" href="https://carspecio.com/">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://carspecio.com/">
    <meta property="og:title" content="CarSpecio | Comparativas y reviews de coches premium">
    <meta property="og:description" content="Comparativas, precios reales y reviews de coches premium en España. Encuentra tu coche ideal con datos claros.">
    <meta property="og:image" content="https://carspecio.com/images/audi-rs7-hero.webp">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="CarSpecio | Comparativas y reviews de coches premium">
    <meta name="twitter:description" content="Comparativas, precios reales y reviews de coches premium en España.">`;

html = html.replace(
    `    <link rel="icon" href="images/favicon.svg" type="image/svg+xml">`,
    `    <link rel="icon" href="images/favicon.svg" type="image/svg+xml">${CANONICAL_OG}`
);

// ── 9. Fix tabindex on main ──
html = html.replace(
    `<main id="main-content">`,
    `<main id="main-content" tabindex="-1">`
);

// ── 10. Fix Guías nav link in site-nav (links to /guias/ properly) ──
html = html.replace(
    `<a href="#explorar">Guías</a>`,
    `<a href="guias/index.html">Guías</a>`
);

// ── 11. Fix meta description encoding ──
html = html.replace(
    `content="CarSpecio  Comparativas, precios reales y reviews de coches premium en España. Encuentra tu coche ideal con datos claros."`,
    `content="CarSpecio | Comparativas, precios reales y reviews de coches premium en España. Encuentra tu coche ideal con datos claros."`
);

// ── Write UTF-8 output ──
fs.writeFileSync(INDEX, html, 'utf8');
console.log('✅ fix-homepage.js complete — html/index.html rewritten as UTF-8');
