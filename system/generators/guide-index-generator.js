/**
 * CarSpecio -- Guide Index Page Generator
 * Generates html/guias/index.html from system/templates/guide-index-template.html
 */

const fs = require('fs');
const path = require('path');
const { BASE_URL, SUPPORTED_LANGS, DEFAULT_LANG } = require('../config');

const REGISTRY_PATH = path.join(__dirname, '../registry/guide-registry.json');
const TEMPLATE_PATH = path.join(__dirname, '../templates/guide-index-template.html');
const LOCALE_DIR = path.join(__dirname, '../locales');
const OUTPUT_DIR = path.join(__dirname, '../../html/guias');

const guideRegistry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
const template = fs.readFileSync(TEMPLATE_PATH, 'utf8');

const localeCache = {};
function loadLocale(lang) {
    if (!localeCache[lang]) {
        try {
            localeCache[lang] = JSON.parse(fs.readFileSync(path.join(LOCALE_DIR, `${lang}.json`), 'utf8'));
        } catch (e) {
            localeCache[lang] = {};
        }
    }
    return localeCache[lang];
}

function getCategoryName(categoryId, lang = DEFAULT_LANG) {
    const locale = loadLocale(lang);
    return locale.guides?.categories?.[categoryId] || categoryId;
}

function loadGuideData(guide) {
    const dataFile = guide.dataFile || `system/data/guides/${guide.id}.json`;
    const dataPath = path.join(__dirname, '../..', dataFile);
    try {
        return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    } catch (e) {
        return null;
    }
}

function buildMultilingualCardContent(guideData, defaultLang = DEFAULT_LANG) {
    return SUPPORTED_LANGS.map((lang, idx) => {
        const content = guideData.content?.[lang];
        if (!content) return '';
        return `<span class="lang-card-content" data-lang="${lang}"${idx === 0 ? '' : ' hidden'}><h3>${content.title}</h3><p>${content.excerpt}</p></span>`;
    }).join('');
}

function buildCategoryCards() {
    return guideRegistry.categories.map(cat => {
        const count = guideRegistry.guides.filter(
            g => g.status === 'active' && g.categoryId === cat.id
        ).length;
        const catName = getCategoryName(cat.id);
        return `
            <a href="#${cat.id}" class="guide-cat-card" data-cat="${cat.id}">
                <span class="guide-cat-icon" aria-hidden="true">${cat.icon}</span>
                <span class="guide-cat-name" data-i18n="guides.categories.${cat.id}">${catName}</span>
                <span class="guide-cat-count">${count}</span>
            </a>`;
    }).join('');
}

function buildFeaturedCards() {
    const featured = guideRegistry.guides.filter(g => g.featured && g.status === 'active');
    if (featured.length === 0) return '';
    return featured.map(g => {
        const d = loadGuideData(g);
        if (!d) return '';
        const catName = getCategoryName(g.categoryId);
        return `
            <a href="${g.slug}.html" class="guide-card guide-card--featured">
                <div class="guide-card-meta">
                    <span class="guide-card-category">${catName}</span>
                    <span class="guide-card-difficulty">${d.difficulty || 'beginner'}</span>
                </div>
                ${buildMultilingualCardContent(d)}
                <div class="guide-card-footer">
                    <span>${d.readingTime || ''} min</span>
                    <span>${d.author}</span>
                </div>
            </a>`;
    }).join('');
}

function buildCategorySections() {
    return guideRegistry.categories.map(cat => {
        const catGuides = guideRegistry.guides.filter(
            g => g.status === 'active' && g.categoryId === cat.id
        );
        if (catGuides.length === 0) return '';

        const catName = getCategoryName(cat.id);
        const cards = catGuides.map(g => {
            const d = loadGuideData(g);
            if (!d) return '';
            return `
                <a href="${g.slug}.html" class="guide-card">
                    <div class="guide-card-meta">
                        <span class="guide-card-category">${catName}</span>
                    </div>
                    ${buildMultilingualCardContent(d)}
                </a>`;
        }).join('');

        return `
        <section class="guide-index-section" id="${cat.id}">
            <div class="guide-index-section-header">
                <h2><span class="guide-cat-icon" aria-hidden="true">${cat.icon}</span> ${catName}</h2>
            </div>
            <div class="guide-cards">${cards}</div>
        </section>`;
    }).join('');
}

function buildFooterCategoryLinks() {
    return guideRegistry.categories.map(cat => {
        const catName = getCategoryName(cat.id);
        return `<a href="index.html#${cat.id}"><span aria-hidden="true">${cat.icon}</span> ${catName}</a>`;
    }).join('');
}

function buildHreflangTags(canonicalPath) {
    return SUPPORTED_LANGS.map(lang => {
        return `<link rel="alternate" hreflang="${lang}" href="${BASE_URL}${canonicalPath}">`;
    }).join('\n    ') + `\n    <link rel="alternate" hreflang="x-default" href="${BASE_URL}${canonicalPath}">`;
}

function buildJsonLd() {
    const itemList = guideRegistry.guides
        .filter(g => g.status === 'active')
        .map((g, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            url: `${BASE_URL}/${g.htmlFile}`,
            name: loadGuideData(g)?.content?.[DEFAULT_LANG]?.title || g.id
        }));

    return JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: itemList
    }, null, 2);
}

function buildBreadcrumbJsonLd() {
    return JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${BASE_URL}/` },
            { '@type': 'ListItem', position: 2, name: 'Guías', item: `${BASE_URL}/guias/index.html` }
        ]
    }, null, 2);
}

const canonicalPath = '/guias/index.html';
const canonicalUrl = `${BASE_URL}${canonicalPath}`;

let page = template;
page = page.replace(/\{\{canonicalUrl\}\}/g, canonicalUrl);
page = page.replace(/\{\{ogImage\}\}/g, `${BASE_URL}/images/carspecio-social-default.webp`);
page = page.replace(/\{\{hreflangTags\}\}/, buildHreflangTags(canonicalPath));
page = page.replace(/\{\{jsonLd\}\}/, buildJsonLd() + '\n    </script>\n    <script type="application/ld+json">' + buildBreadcrumbJsonLd());
page = page.replace(/\{\{categoryCards\}\}/, buildCategoryCards());
page = page.replace(/\{\{featuredCards\}\}/, buildFeaturedCards());
page = page.replace(/\{\{categorySections\}\}/, buildCategorySections());
page = page.replace(/\{\{footerCategoryLinks\}\}/, buildFooterCategoryLinks());

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const outputPath = path.join(OUTPUT_DIR, 'index.html');
fs.writeFileSync(outputPath, page, 'utf8');

console.log(`✅ Guide index generated: ${outputPath}`);
