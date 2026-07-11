const fs = require('fs');
const path = require('path');

const SYSTEM_DIR = path.join(__dirname, '..');
const PROJECT_DIR = path.join(SYSTEM_DIR, '..');

test('all supported locales exist and are valid JSON', () => {
    const langs = ['es', 'en', 'fr', 'ar'];
    for (const lang of langs) {
        const localePath = path.join(SYSTEM_DIR, 'locales', `${lang}.json`);
        assertTrue(fs.existsSync(localePath), `Locale ${lang} should exist`);
        const locale = JSON.parse(fs.readFileSync(localePath, 'utf8'));
        assertTrue(locale && locale.$id, `Locale ${lang} should have $id`);
        assertIncludes(locale.$id, 'carspecio.com', `Locale ${lang} $id should use carspecio.com`);
    }
});

test('car registry references valid brand and category IDs', () => {
    const carRegistry = JSON.parse(fs.readFileSync(path.join(SYSTEM_DIR, 'registry', 'car-registry.json'), 'utf8'));
    const brandRegistry = JSON.parse(fs.readFileSync(path.join(SYSTEM_DIR, 'registry', 'brand-registry.json'), 'utf8'));
    const categoryRegistry = JSON.parse(fs.readFileSync(path.join(SYSTEM_DIR, 'registry', 'category-registry.json'), 'utf8'));

    const validBrandIds = new Set(brandRegistry.brands.map(b => b.id));
    const validCategoryIds = new Set(categoryRegistry.categories.map(c => c.id));

    for (const car of carRegistry.cars) {
        assertTrue(validBrandIds.has(car.brandId), `Car ${car.id} should have valid brandId`);
        assertTrue(validCategoryIds.has(car.categoryId), `Car ${car.id} should have valid categoryId`);
        assertTrue(car.status === 'active' || car.status === 'draft' || car.status === 'archived', `Car ${car.id} should have valid status`);
    }
});

test('guide registry references valid categories and data files', () => {
    const guideRegistry = JSON.parse(fs.readFileSync(path.join(SYSTEM_DIR, 'registry', 'guide-registry.json'), 'utf8'));
    const validCategoryIds = new Set(guideRegistry.categories.map(c => c.id));

    for (const guide of guideRegistry.guides) {
        assertTrue(validCategoryIds.has(guide.categoryId), `Guide ${guide.id} should have valid categoryId`);
        const dataFile = guide.dataFile || `system/data/guides/${guide.id}.json`;
        const dataPath = path.join(PROJECT_DIR, dataFile);
        assertTrue(fs.existsSync(dataPath), `Guide ${guide.id} data file should exist`);
    }
});

test('brand model references match car registry IDs', () => {
    const brandRegistry = JSON.parse(fs.readFileSync(path.join(SYSTEM_DIR, 'registry', 'brand-registry.json'), 'utf8'));
    const carRegistry = JSON.parse(fs.readFileSync(path.join(SYSTEM_DIR, 'registry', 'car-registry.json'), 'utf8'));
    const validCarIds = new Set(carRegistry.cars.map(c => c.id));

    for (const brand of brandRegistry.brands) {
        for (const modelId of brand.models || []) {
            assertTrue(validCarIds.has(modelId), `Brand ${brand.id} model ${modelId} should match a car in registry`);
        }
    }
});

test('guide related cars reference valid active cars', () => {
    const carRegistry = JSON.parse(fs.readFileSync(path.join(SYSTEM_DIR, 'registry', 'car-registry.json'), 'utf8'));
    const guideRegistry = JSON.parse(fs.readFileSync(path.join(SYSTEM_DIR, 'registry', 'guide-registry.json'), 'utf8'));
    const validCarIds = new Set(carRegistry.cars.filter(c => c.status === 'active').map(c => c.id));

    for (const guide of guideRegistry.guides) {
        const dataFile = guide.dataFile || `system/data/guides/${guide.id}.json`;
        const dataPath = path.join(PROJECT_DIR, dataFile);
        const guideData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        for (const carId of guideData.relatedCars || []) {
            assertTrue(validCarIds.has(carId), `Guide ${guide.id} relatedCar ${carId} should be valid active car`);
        }
    }
});

test('guide related guides reference valid active guides', () => {
    const guideRegistry = JSON.parse(fs.readFileSync(path.join(SYSTEM_DIR, 'registry', 'guide-registry.json'), 'utf8'));
    const validGuideIds = new Set(guideRegistry.guides.filter(g => g.status === 'active').map(g => g.id));

    for (const guide of guideRegistry.guides) {
        const dataFile = guide.dataFile || `system/data/guides/${guide.id}.json`;
        const dataPath = path.join(PROJECT_DIR, dataFile);
        const guideData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        for (const relatedId of guideData.relatedGuides || []) {
            assertTrue(validGuideIds.has(relatedId), `Guide ${guide.id} relatedGuide ${relatedId} should be valid active guide`);
        }
    }
});
