/**
 * CarSpecio — Search Index Generator
 * Generates js/search-index.js from car and guide registries
 */

const fs = require('fs');
const path = require('path');
const { BASE_URL, SUPPORTED_LANGS, DEFAULT_LANG } = require('../config');

// Load registries
const carRegistry = JSON.parse(fs.readFileSync(path.join(__dirname, '../registry/car-registry.json'), 'utf8'));
const brandRegistry = JSON.parse(fs.readFileSync(path.join(__dirname, '../registry/brand-registry.json'), 'utf8'));
const categoryRegistry = JSON.parse(fs.readFileSync(path.join(__dirname, '../registry/category-registry.json'), 'utf8'));
const guideRegistry = JSON.parse(fs.readFileSync(path.join(__dirname, '../registry/guide-registry.json'), 'utf8'));

const localeCache = {};
function loadLocale(lang) {
    if (!localeCache[lang]) {
        try {
            localeCache[lang] = JSON.parse(fs.readFileSync(path.join(__dirname, `../locales/${lang}.json`), 'utf8'));
        } catch (e) {
            localeCache[lang] = {};
        }
    }
    return localeCache[lang];
}
function t(key, lang = DEFAULT_LANG) {
    const locale = loadLocale(lang);
    return key.split('.').reduce((obj, k) => obj?.[k], locale) || key;
}

// Helper: load car data
function loadCarData(car) {
    const dataFile = car.dataFile || `system/data/${car.id}.json`;
    const dataPath = path.join(__dirname, '../..', dataFile);
    try {
        return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    } catch (e) {
        return null;
    }
}

// Helper: load guide data
function loadGuideData(guide) {
    const dataFile = guide.dataFile || `system/data/guides/${guide.id}.json`;
    const dataPath = path.join(__dirname, '../..', dataFile);
    try {
        return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    } catch (e) {
        return null;
    }
}

// Generate search index
const searchIndex = [];

carRegistry.cars.forEach(car => {
    if (car.status !== 'active') return;
    const brand = brandRegistry.brands.find(b => b.id === car.brandId);
    const category = categoryRegistry.categories.find(c => c.id === car.categoryId);
    const carData = loadCarData(car);

    if (brand && category && carData) {
        const basicInfo = carData.basicInfo || {};
        const pricing = carData.pricing || {};
        const performance = carData.performance || {};

        searchIndex.push({
            id: car.id,
            type: 'car',
            name: basicInfo.name || car.id,
            fullName: basicInfo.fullModelName || basicInfo.name || car.id,
            brand: brand.name,
            brandId: car.brandId,
            category: category.name,
            categoryId: car.categoryId,
            slug: car.slug,
            year: car.modelYear,
            url: car.htmlFile,
            absoluteUrl: `${BASE_URL}/${car.htmlFile}`,
            image: car.images?.hero || carData.images?.hero || '',
            price: pricing.current?.value || 0,
            power: performance.power?.value || 0,
            keywords: [
                (basicInfo.name || '').toLowerCase(),
                (basicInfo.fullModelName || '').toLowerCase(),
                brand.name.toLowerCase(),
                category.name.toLowerCase(),
                car.slug.toLowerCase()
            ],
            description: basicInfo.description || car.seo?.description || ''
        });
    }
});

// Add guides to search index
guideRegistry.guides.forEach(guide => {
    if (guide.status !== 'active') return;
    const guideData = loadGuideData(guide);
    if (!guideData) return;

    const content = guideData.content[DEFAULT_LANG] || {};
    const seo = content.seo || {};

    searchIndex.push({
        id: guide.id,
        type: 'guide',
        name: content.title || guide.id,
        slug: guide.slug,
        category: guide.categoryId,
        categoryName: t(`guides.categories.${guide.categoryId}`, DEFAULT_LANG),
        url: guide.htmlFile,
        absoluteUrl: `${BASE_URL}/${guide.htmlFile}`,
        image: guideData.heroImage || '',
        keywords: [
            (content.title || '').toLowerCase(),
            guide.slug.toLowerCase(),
            ...(guideData.tags || []).map(t => t.toLowerCase()),
            ...(seo.keywords || []).map(k => k.toLowerCase())
        ],
        description: content.excerpt || seo.description || '',
        tags: guideData.tags || []
    });
});

// Generate output file
const output = `/**
 * CarSpecio — Search Index
 * AUTO-GENERATED from car and guide registries
 * DO NOT EDIT MANUALLY - Use system/generators/search-index-generator.js
 */

window.CARSPECIO_SEARCH_INDEX = ${JSON.stringify(searchIndex, null, 4)};

window.CARSPECIO_SEARCH = {
    index: window.CARSPECIO_SEARCH_INDEX,

    search: function(query) {
        if (!query || query.length < 2) return [];

        const lowerQuery = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return window.CARSPECIO_SEARCH_INDEX.filter(item => {
            const text = (item.name + ' ' + item.description + ' ' + (item.categoryName || item.category || '')).toLowerCase();
            return item.keywords.some(keyword => keyword.normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(lowerQuery)) ||
                   text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(lowerQuery);
        }).slice(0, 10);
    },

    getUrl: function(item) {
        if (item.type === 'guide') {
            return 'guias/' + item.url;
        }
        return item.url;
    }
};

// Backward-compatible alias
window.searchCars = window.CARSPECIO_SEARCH.search;
`;

// Write output file
const outputPath = path.join(__dirname, '../../js/search-index.js');
fs.writeFileSync(outputPath, output);

console.log('✅ search-index.js generated successfully');
console.log(`📁 Output: ${outputPath}`);
console.log(`📊 Items indexed: ${searchIndex.length}`);
