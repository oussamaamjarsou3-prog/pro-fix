/**
 * CarSpecio -- Car Page Generator (Node.js)
 * Generates static HTML pages for each car from car-template.html
 * Output: html/[slug].html
 */

const fs = require('fs');
const path = require('path');
const { BASE_URL, SUPPORTED_LANGS, DEFAULT_LANG } = require('../config');

const TEMPLATE_PATH = path.join(__dirname, '../templates/car-template.html');
const OUTPUT_DIR = path.join(__dirname, '../../html');
const DATA_DIR = path.join(__dirname, '../../system/data');
const REGISTRY_PATH = path.join(__dirname, '../registry/car-registry.json');
const BRAND_REGISTRY_PATH = path.join(__dirname, '../registry/brand-registry.json');
const COUNTRY_REGISTRY_PATH = path.join(__dirname, '../registry/country-registry.json');
const LOCALE_DIR = path.join(__dirname, '../locales');

const carRegistry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
const brandRegistry = JSON.parse(fs.readFileSync(BRAND_REGISTRY_PATH, 'utf8'));
const countryRegistry = JSON.parse(fs.readFileSync(COUNTRY_REGISTRY_PATH, 'utf8'));
const guideRegistry = JSON.parse(fs.readFileSync(path.join(__dirname, '../registry/guide-registry.json'), 'utf8'));

const LANG_INFO = {
    es: { name: 'Español', flag: '🇪🇸', cc: 'es' },
    en: { name: 'English', flag: '🇬🇧', cc: 'gb' },
    fr: { name: 'Français', flag: '🇫🇷', cc: 'fr' },
    ar: { name: 'العربية', flag: '🇸🇦', cc: 'sa' }
};

function flagImg(cc, alt) {
    return `<img src="https://flagcdn.com/24x18/${cc}.png" alt="${alt || cc.toUpperCase()}" width="20" height="15" loading="lazy" style="width:20px;height:15px;object-fit:cover;border-radius:2px;flex-shrink:0;">`;
}

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
function t(key, lang = DEFAULT_LANG) {
    const locale = loadLocale(lang);
    return key.split('.').reduce((obj, k) => obj?.[k], locale) || key;
}
function getCategoryName(categoryId, lang = DEFAULT_LANG) {
    return t(`guides.categories.${categoryId}`, lang) || categoryId;
}

// Pre-load all guide data for bidirectional lookups
const allGuideData = {};
function loadGuideData(guide) {
    const dataFile = guide.dataFile || `system/data/guides/${guide.id}.json`;
    const dataPath = path.join(__dirname, '../..', dataFile);
    try {
        return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    } catch (e) {
        return null;
    }
}
guideRegistry.guides.forEach(g => {
    const d = loadGuideData(g);
    if (d) allGuideData[g.id] = d;
});

function buildMultilingualCardContent(guideData) {
    return SUPPORTED_LANGS.map((lang, idx) => {
        const content = guideData.content?.[lang];
        if (!content) return '';
        return `<span class="lang-card-content" data-lang="${lang}"${idx === 0 ? '' : ' hidden'}><h3>${content.title}</h3><p>${content.excerpt}</p></span>`;
    }).join('');
}

function buildHreflangTags(canonicalPath) {
    return SUPPORTED_LANGS.map(lang => {
        return `<link rel="alternate" hreflang="${lang}" href="${BASE_URL}${canonicalPath}">`;
    }).join('\n    ') + `\n    <link rel="alternate" hreflang="x-default" href="${BASE_URL}${canonicalPath}">`;
}

function buildBreadcrumbJsonLd(car, brand, carData) {
    return JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: t('navigation.home', DEFAULT_LANG), item: { '@id': `${BASE_URL}/` } },
            { '@type': 'ListItem', position: 2, name: brand.name, item: { '@id': `${BASE_URL}/marcas.html` } },
            { '@type': 'ListItem', position: 3, name: carData.basicInfo?.name || car.id, item: { '@id': `${BASE_URL}/${car.htmlFile}` } }
        ]
    }, null, 2);
}

function buildCarSchemaJsonLd(car, brand, carData, url) {
    const engine = carData.specs?.engine || {};
    const rawImage = carData.images?.hero || car.images?.hero || '';
    const schemaImage = rawImage.startsWith('http')
        ? rawImage
        : `${BASE_URL}/${rawImage.replace(/^\.\.\//, '')}`;
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Car',
        name: carData.basicInfo?.fullModelName || `${brand.name} ${carData.basicInfo?.name || car.id}`,
        brand: { '@type': 'Brand', name: brand.name },
        model: carData.basicInfo?.name || car.id,
        vehicleEngine: {
            '@type': 'EngineSpecification',
            engineType: engine.type || '',
            fuelType: engine.fuelType || ''
        },
        offers: {
            '@type': 'Offer',
            priceCurrency: 'EUR',
            availability: 'https://schema.org/InStock',
            url: url
        },
        image: schemaImage,
        url: url,
        description: car.seo?.description || `${brand.name} ${carData.basicInfo?.name || ''} review completa.`
    };
    if (carData.rating && carData.rating.overall !== undefined) {
        schema.aggregateRating = {
            '@type': 'AggregateRating',
            ratingValue: carData.rating.overall,
            bestRating: 10,
            worstRating: 0
        };
    }
    return JSON.stringify(schema, null, 2);
}

function buildFaqPageJsonLd(carData, lang) {
    const pt = carData.pageText?.[lang];
    if (!pt || !pt.faq) return null;
    const mainEntity = [];
    for (let i = 1; i <= 7; i++) {
        const q = pt.faq['q' + i];
        const a = pt.faq['a' + i];
        if (q && a) {
            mainEntity.push({
                '@type': 'Question',
                name: q,
                acceptedAnswer: { '@type': 'Answer', text: a }
            });
        }
    }
    if (mainEntity.length === 0) return null;
    return JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity
    }, null, 2);
}

function buildCountrySelector(countries, defaultCountry) {
    const defaultId = defaultCountry ? defaultCountry.toLowerCase() : 'es';
    return countries.map(c => {
        const isActive = c.id === defaultId ? ' class="active"' : '';
        return `<button type="button" data-country="${c.id}" data-value="${c.id}" data-label="${c.id.toUpperCase()}" data-icon="${c.flag}"${isActive}>${flagImg(c.id, c.id.toUpperCase())} ${c.name}</button>`;
    }).join('\n                    ');
}

function buildLanguageSelector(langs, defaultLang) {
    const defaultId = defaultLang ? defaultLang.toLowerCase() : 'es';
    return langs.map(lang => {
        const info = LANG_INFO[lang] || { name: lang, flag: '', cc: lang };
        const isActive = lang === defaultId ? ' class="active"' : '';
        return `<button type="button" data-lang="${lang}" data-value="${lang}" data-label="${info.name}" data-icon="${info.flag}"${isActive}>${flagImg(info.cc, lang.toUpperCase())} ${info.name}</button>`;
    }).join('\n                    ');
}

let template = fs.readFileSync(TEMPLATE_PATH, 'utf8');

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function loadCarData(car) {
    const dataFile = car.dataFile || `system/data/${car.id}.json`;
    const dataPath = path.join(__dirname, '../..', dataFile);
    try {
        return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    } catch (e) {
        return null;
    }
}

function buildRelatedGuidesForCar(carId) {
    const relatedGuides = guideRegistry.guides.filter(guide => {
        if (guide.status !== 'active') return false;
        const d = allGuideData[guide.id];
        if (!d) return false;
        return d.relatedCars && d.relatedCars.includes(carId);
    });

    let cards = '';
    relatedGuides.forEach(guide => {
        const d = allGuideData[guide.id];
        if (!d) return;
        const catName = getCategoryName(guide.categoryId);
        cards += `
            <a href="guias/${guide.slug}.html" class="guide-card">
                <div class="guide-card-meta">
                    <span class="guide-card-category">${catName}</span>
                </div>
                ${buildMultilingualCardContent(d)}
            </a>`;
    });

    const hiddenAttr = relatedGuides.length === 0 ? ' hidden' : '';
    return `
    <section class="guide-related" id="related-guides"${hiddenAttr} aria-live="polite">
        <h2>${t('guides.relatedGuidesTitle', DEFAULT_LANG)}</h2>
        <div class="guide-cards">${cards}</div>
    </section>`;
}

let generatedCount = 0;

carRegistry.cars.forEach(car => {
    if (car.status !== 'active') return;

    const brand = brandRegistry.brands.find(b => b.id === car.brandId);
    const carData = loadCarData(car);
    if (!brand || !carData) {
        console.warn(`  ! Skipping ${car.id}`);
        return;
    }

    // Resolve dynamic placeholders used in pageText strings
    const defaultCountry = carData.countryPricing ? Object.keys(carData.countryPricing)[0].toLowerCase() : 'es';
    const defaultCountryData = countryRegistry.countries.find(c => c.id === defaultCountry) || countryRegistry.countries.find(c => c.id === 'es');
    const defaultCountryPricing = carData.countryPricing?.[defaultCountry];
    const pVars = {
        fullModelName: carData.basicInfo?.fullModelName || carData.basicInfo?.name || `${brand.name} ${carData.basicInfo?.name || car.id}`,
        shortName: carData.basicInfo?.name || carData.basicInfo?.fullModelName || car.id,
        modelYear: String(carData.modelYear || ''),
        nextYear: String(carData.modelYear ? (parseInt(carData.modelYear) + 2) : ''),
        scoreOverall: String(carData.rating?.overall ?? ''),
        engineType: carData.specs?.engine?.type || '',
        co2: carData.fuelEconomy?.petrol?.co2 || carData.fuelEconomy?.diesel?.co2 || carData.emissions?.co2 || '',
        power: carData.performance?.power ? `${carData.performance.power.value} ${carData.performance.power.unit}` : '',
        torque: carData.performance?.torque ? `${carData.performance.torque.value} ${carData.performance.torque.unit}` : '',
        consumption: (() => {
            const c = carData.fuelEconomy?.petrol?.combined || carData.fuelEconomy?.diesel?.combined || carData.fuelEconomy?.consumption?.combined || carData.fuelEconomy?.combined;
            if (typeof c === 'object' && c !== null) {
                return `${c.value} ${c.unit}`;
            }
            return c || '';
        })(),
        topSpeed: carData.performance?.topSpeed ? `${carData.performance.topSpeed.value} ${carData.performance.topSpeed.unit}` : '',
        acceleration: carData.performance?.acceleration?.zeroToHundred || carData.performance?.acceleration?.['0-100'] || '',
        drivetrain: carData.specs?.transmission?.driveMode || carData.drivetrain || '',
        country: defaultCountryData?.name || 'España',
        currency: defaultCountryData?.currency || 'EUR',
        priceNew: defaultCountryPricing?.priceNew ? String(defaultCountryPricing.priceNew) : '',
        used3Range: defaultCountryPricing?.used3Range || '',
        used5Range: defaultCountryPricing?.used5Range || ''
    };
    if (carData.comparisons && carData.comparisons[0]) {
        pVars.car1 = carData.comparisons[0].name || '';
        pVars.car1FullName = carData.comparisons[0].fullName || pVars.car1;
        if (carData.comparisons[1]) {
            pVars.car2 = carData.comparisons[1].name || '';
            pVars.car2FullName = carData.comparisons[1].fullName || pVars.car2;
            if (carData.comparisons[2]) {
                pVars.car3 = carData.comparisons[2].name || '';
            } else {
                pVars.car3 = 'otros modelos del segmento';
            }
        } else {
            pVars.car2 = 'otros modelos del segmento';
            pVars.car3 = '';
        }
    }

    function replacePlaceholdersInStrings(obj) {
        if (typeof obj === 'string') {
            return Object.keys(pVars).reduce((str, key) => {
                const value = pVars[key];
                if (value === undefined || value === null) return str;
                return str.replace(new RegExp('\\{\\{' + key + '\\}\\}', 'g'), String(value));
            }, obj);
        }
        if (Array.isArray(obj)) return obj.map(replacePlaceholdersInStrings);
        if (obj && typeof obj === 'object') {
            const result = {};
            for (const key of Object.keys(obj)) {
                result[key] = replacePlaceholdersInStrings(obj[key]);
            }
            return result;
        }
        return obj;
    }

    // Electric data placeholders
    const electricVars = {
        electricBattery: carData.electric?.batteryCapacity?.value || '--',
        electricRange: carData.electric?.electricRange?.value || '--',
        electricAcPower: carData.electric?.charging?.ac?.power || '--',
        electricAcTime: carData.electric?.charging?.ac?.time ? carData.electric.charging.ac.time + ' h' : '--',
        electricDcPower: carData.electric?.charging?.dc?.power || '--',
        electricDcTime: carData.electric?.charging?.dc?.time?.value ? carData.electric.charging.dc.time.value + ' min' + (carData.electric.charging.dc.time.percentage ? ' (' + carData.electric.charging.dc.time.percentage + '%)' : '') : '--',
        electricMotorPower: carData.electric?.motor?.power?.value || '--',
        electricMotorType: carData.electric?.motor?.type ? (carData.electric.motor.count ? carData.electric.motor.count + 'x ' : '') + carData.electric.motor.type : '--',
        electricConsumption: carData.fuelEconomy?.energyConsumption?.combined?.value || '--'
    };

    // Replace placeholders in the carData copy used for preloading (so the inline script has no visible residue)
    const preloadedCarData = replacePlaceholdersInStrings(carData);

    let page = template;

    // Fix relative paths for html/ folder (pages are in html/ root, not a subfolder)
    page = page.replace(/\.\.\//g, '');

    // Determine language default for this car
    const defaultLangInfo = LANG_INFO[DEFAULT_LANG] || LANG_INFO['es'];

    // Template parameterization (language, country, selectors)
    page = page.replace(/{{DEFAULT_LANG}}/g, DEFAULT_LANG);
    page = page.replace(/{{DEFAULT_LANG_FLAG}}/g, defaultLangInfo.flag);
    page = page.replace(/{{DEFAULT_LANG_FLAG_IMG}}/g, flagImg(defaultLangInfo.cc, DEFAULT_LANG.toUpperCase()));
    page = page.replace(/{{DEFAULT_LANG_CODE}}/g, DEFAULT_LANG.toUpperCase());
    page = page.replace(/{{DEFAULT_LANG_NAME}}/g, defaultLangInfo.name);
    page = page.replace(/{{DEFAULT_COUNTRY}}/g, defaultCountry.toUpperCase());
    page = page.replace(/{{DEFAULT_COUNTRY_FLAG}}/g, defaultCountryData.flag);
    page = page.replace(/{{DEFAULT_COUNTRY_NAME}}/g, defaultCountryData.name);
    page = page.replace(/{{COUNTRY_SELECTOR}}/g, buildCountrySelector(countryRegistry.countries, defaultCountry));
    page = page.replace(/{{LANGUAGE_SELECTOR}}/g, buildLanguageSelector(SUPPORTED_LANGS, DEFAULT_LANG));

    // Replace electric data placeholders
    page = page.replace(/id="electricBattery">--</g, `id="electricBattery">${electricVars.electricBattery}<`);
    page = page.replace(/id="electricRange">--</g, `id="electricRange">${electricVars.electricRange}<`);
    page = page.replace(/id="electricAcPower">--</g, `id="electricAcPower">${electricVars.electricAcPower}<`);
    page = page.replace(/id="electricAcTime">--</g, `id="electricAcTime">${electricVars.electricAcTime}<`);
    page = page.replace(/id="electricDcPower">--</g, `id="electricDcPower">${electricVars.electricDcPower}<`);
    page = page.replace(/id="electricDcTime">--</g, `id="electricDcTime">${electricVars.electricDcTime}<`);
    page = page.replace(/id="electricMotorPower">--</g, `id="electricMotorPower">${electricVars.electricMotorPower}<`);
    page = page.replace(/id="electricMotorType">--</g, `id="electricMotorType">${electricVars.electricMotorType}<`);
    page = page.replace(/id="electricConsumption">--</g, `id="electricConsumption">${electricVars.electricConsumption}<`);

    // Set car data file (use dataFile from registry if available)
    const dataFilePath = car.dataFile ? car.dataFile : `system/data/${car.id}.json`;
    // Pre-inject raw car data (with placeholders intact) so runtime can replace them per country.
    const rawCarDataJson = JSON.stringify(carData).replace(/</g, '\\u003c');
    // Pre-inject default locale translations to avoid flash of placeholder text
    const defaultLocale = loadLocale(DEFAULT_LANG);
    const localeJson = JSON.stringify({ [DEFAULT_LANG]: defaultLocale }).replace(/</g, '\\u003c');
    page = page.replace(
        /const carDataFile = '[^']*';/,
        `const carDataFile = '${dataFilePath}';\n        window.__preloadedCarData = ${rawCarDataJson};\n        window.__LANG_DATA__ = ${localeJson};`
    );

    // SEO
    const seoTitle = car.seo?.title || `${brand.name} ${carData.basicInfo?.name || car.id} ${car.modelYear} - Review y Comparativa`;
    page = page.replace(/<title[^>]*>[^<]*<\/title>/, `<title>${seoTitle}</title>`);

    const seoDesc = car.seo?.description || `${brand.name} ${carData.basicInfo?.name || ''} review completa.`;
    page = page.replace(/<meta name="description"[^>]*content="[^"]*"/, `<meta name="description" content="${seoDesc}"`);

    const canonicalUrl = `${BASE_URL}/${car.htmlFile}`;
    const canonicalPath = `/${car.htmlFile}`;
    page = page.replace(/<link rel="canonical" href="[^"]*" id="canonicalUrl">/, `<link rel="canonical" href="${canonicalUrl}" id="canonicalUrl">\n    ${buildHreflangTags(canonicalPath)}\n    <script type="application/ld+json">${buildBreadcrumbJsonLd(car, brand, carData)}</script>`);

    page = page.replace(/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${seoTitle}"`);
    page = page.replace(/<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${seoDesc}"`);
    page = page.replace(/<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${canonicalUrl}"`);
    page = page.replace(/<meta name="twitter:title" content="[^"]*"/, `<meta name="twitter:title" content="${seoTitle}"`);
    page = page.replace(/<meta name="twitter:description" content="[^"]*"/, `<meta name="twitter:description" content="${seoDesc}"`);

    // Open Graph & Twitter Card fixed values
    page = page.replace(/<meta property="og:type" content="[^"]*"/, `<meta property="og:type" content="product"`);
    page = page.replace(/<meta name="twitter:card" content="[^"]*"/, `<meta name="twitter:card" content="summary_large_image"`);

    // Keywords
    const seoKeywords = car.seo?.keywords || `${brand.name} ${carData.basicInfo?.name || car.id} ${car.modelYear}, review, precio, consumo, fiabilidad`;
    page = page.replace(/<meta name="keywords" content="[^"]*"/, `<meta name="keywords" content="${seoKeywords}"`);

    // Hero image
    const heroImage = car.images?.hero || carData.images?.hero || '';
    if (heroImage) {
        const fixedHero = heroImage.startsWith('/') ? `..${heroImage}` : heroImage;
        page = page.replace(/style="background-image: url\('[^']*'\)"/, `style="background-image: url('${fixedHero}')"`);
        // Preload hero image to improve LCP
        const preloadLink = `<link rel="preload" as="image" href="${fixedHero}">`;
        page = page.replace(/<\/head>/, `    ${preloadLink}\n</head>`);
        // OG and Twitter images
        const ogImageUrl = fixedHero.startsWith('http') ? fixedHero : `${BASE_URL}${fixedHero.replace(/^\.\.\//, '/')}`;
        page = page.replace(/<meta property="og:image" content="[^"]*"/, `<meta property="og:image" content="${ogImageUrl}"`);
        page = page.replace(/<meta name="twitter:image" content="[^"]*"/, `<meta name="twitter:image" content="${ogImageUrl}"`);
    }

    // Schema.org structured data
    const schemas = [buildCarSchemaJsonLd(car, brand, carData, canonicalUrl)];
    const faqSchema = buildFaqPageJsonLd(preloadedCarData, DEFAULT_LANG);
    if (faqSchema) schemas.push(faqSchema);
    const schemaScripts = schemas.map(s => `    <script type="application/ld+json">${s}</script>`).join('\n');
    page = page.replace(/<\/head>/, `${schemaScripts}\n</head>`);

    // Bidirectional: inject Related Guides into car page
    const relatedGuidesHtml = buildRelatedGuidesForCar(car.id);
    page = page.replace(/<footer class="site-footer">/, `${relatedGuidesHtml}\n    <footer class="site-footer">`);

    // Write output
    const outputPath = path.join(OUTPUT_DIR, car.htmlFile);
    fs.writeFileSync(outputPath, page, 'utf8');

    generatedCount++;
    console.log(`  + ${car.htmlFile} -> ${brand.name} ${carData.basicInfo?.name || car.id}`);
});

console.log(`\nDone! Generated ${generatedCount} car pages in ${OUTPUT_DIR}`);
