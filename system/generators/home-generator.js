/**
 * CarSpecio — Home Page Generator
 * Generates html/index.html from system/templates/home-template.html
 * Pulls dynamic cards from reviews, news, comparisons, guides, brands and tools.
 */

const fs = require('fs');
const path = require('path');
const { BASE_URL, SUPPORTED_LANGS, DEFAULT_LANG } = require('../config');

const TEMPLATE_PATH = path.join(__dirname, '../templates/home-template.html');
const OUTPUT_DIR = path.join(__dirname, '../../html');
const LOCALE_DIR = path.join(__dirname, '../locales');

const CAR_REGISTRY_PATH = path.join(__dirname, '../registry/car-registry.json');
const BRAND_REGISTRY_PATH = path.join(__dirname, '../registry/brand-registry.json');
const CATEGORY_REGISTRY_PATH = path.join(__dirname, '../registry/category-registry.json');
const GUIDE_REGISTRY_PATH = path.join(__dirname, '../registry/guide-registry.json');
const NEWS_PATH = path.join(__dirname, '../data/news.json');
const NEWS_DIR = path.join(__dirname, '../data/noticias');

const carRegistry = JSON.parse(fs.readFileSync(CAR_REGISTRY_PATH, 'utf8'));
const brandRegistry = JSON.parse(fs.readFileSync(BRAND_REGISTRY_PATH, 'utf8'));
const categoryRegistry = JSON.parse(fs.readFileSync(CATEGORY_REGISTRY_PATH, 'utf8'));
const guideRegistry = JSON.parse(fs.readFileSync(GUIDE_REGISTRY_PATH, 'utf8'));
const newsData = JSON.parse(fs.readFileSync(NEWS_PATH, 'utf8'));
const template = fs.readFileSync(TEMPLATE_PATH, 'utf8');

const carDataCache = {};
const newsArticles = loadNews();

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
    return key.split('.').reduce((obj, k) => obj?.[k], loadLocale(lang)) || key;
}
function getCategoryName(id, lang = DEFAULT_LANG) {
    return t(`categories.${id}`, lang) || id;
}
function formatModelCount(count, lang = DEFAULT_LANG) {
    return `${count} ${count === 1 ? t('home.modelSingular', lang) : t('home.modelPlural', lang)}`;
}
function getCategoryIcon(id) {
    const cat = categoryRegistry.categories.find(c => c.id === id);
    return cat?.icon || '🚗';
}

const UI_LABELS = {
    es: {
        heroKicker: 'Tu portal de referencia',
        heroTitle: 'Elige tu coche con datos, no con impulsos',
        heroSubtitle: 'Comparativas técnicas, reviews reales, herramientas de diagnóstico y guías prácticas para tomar la mejor decisión.',
        heroSearchPlaceholder: 'Buscar coche, marca o noticia...',
        heroSearchBtn: 'Buscar',
        statCars: 'Coches analizados',
        statCompares: 'Comparativas posibles',
        statGuides: 'Guías',
        statBrands: 'Marcas',
        newsTitle: 'Últimas noticias',
        newsSubtitle: 'Lanzamientos, tecnología y actualidad del motor.',
        newsLink: 'Ver noticias',
        reviewsTitle: 'Reviews destacadas',
        reviewsSubtitle: 'Análisis completos con precios, consumos y fiabilidad.',
        reviewsLink: 'Ver reviews',
        comparesTitle: 'Comparativas populares',
        comparesSubtitle: 'Cara a cara con datos objetivos.',
        comparesLink: 'Ver comparativas',
        guidesTitle: 'Guías prácticas',
        guidesSubtitle: 'Mantenimiento, compra y cuidado del coche.',
        guidesLink: 'Ver guías',
        toolsTitle: 'Herramientas útiles',
        toolsSubtitle: 'Diagnóstico, comparativas y más utilidades.',
        toolDiagnosticTitle: 'Diagnóstico',
        toolDiagnosticDesc: 'Descubre qué le pasa a tu coche por síntomas.',
        toolCompareTitle: 'Comparar',
        toolCompareDesc: 'Compara coches cara a cara con datos reales.',
        toolUtilityTitle: 'Herramientas',
        toolUtilityDesc: 'Calculadoras y utilidades para conductores.',
        brandsTitle: 'Marcas populares',
        brandsSubtitle: 'Encuentra tu próximo coche por marca.',
        brandLink: 'Ver marca',
        newsletterTitle: 'Recibe lo mejor del motor en tu correo',
        newsletterDesc: 'Un resumen semanal de reviews, comparativas y noticias. Sin spam.',
        newsletterPlaceholder: 'Tu correo electrónico',
        newsletterSubmit: 'Suscribirse',
        readMore: 'Leer más',
        viewReview: 'Ver review',
        compareBtn: 'Comparar'
    },
    en: {
        heroKicker: 'Your reference portal',
        heroTitle: 'Choose your car with data, not impulses',
        heroSubtitle: 'Technical comparisons, real reviews, diagnostic tools and practical guides to make the best decision.',
        heroSearchPlaceholder: 'Search car, brand or news...',
        heroSearchBtn: 'Search',
        statCars: 'Cars analyzed',
        statCompares: 'Possible comparisons',
        statGuides: 'Guides',
        statBrands: 'Brands',
        newsTitle: 'Latest news',
        newsSubtitle: 'Launches, technology and motoring news.',
        newsLink: 'All news',
        reviewsTitle: 'Featured reviews',
        reviewsSubtitle: 'Complete analysis with prices, consumption and reliability.',
        reviewsLink: 'All reviews',
        comparesTitle: 'Popular comparisons',
        comparesSubtitle: 'Head-to-head with objective data.',
        comparesLink: 'All comparisons',
        guidesTitle: 'Practical guides',
        guidesSubtitle: 'Maintenance, buying and car care.',
        guidesLink: 'All guides',
        toolsTitle: 'Useful tools',
        toolsSubtitle: 'Diagnostics, comparisons and more utilities.',
        toolDiagnosticTitle: 'Diagnose',
        toolDiagnosticDesc: 'Find out what is wrong with your car by symptoms.',
        toolCompareTitle: 'Compare',
        toolCompareDesc: 'Compare cars side by side with real data.',
        toolUtilityTitle: 'Tools',
        toolUtilityDesc: 'Calculators and utilities for drivers.',
        brandsTitle: 'Popular brands',
        brandsSubtitle: 'Find your next car by brand.',
        brandLink: 'See brand',
        newsletterTitle: 'Get the best of motoring in your inbox',
        newsletterDesc: 'A weekly roundup of reviews, comparisons and news. No spam.',
        newsletterPlaceholder: 'Your email address',
        newsletterSubmit: 'Subscribe',
        readMore: 'Read more',
        viewReview: 'View review',
        compareBtn: 'Compare'
    },
    fr: {
        heroKicker: 'Votre portail de référence',
        heroTitle: 'Choisissez votre voiture avec des données, pas des impulsions',
        heroSubtitle: 'Comparatifs techniques, essais réels, outils de diagnostic et guides pratiques pour prendre la meilleure décision.',
        heroSearchPlaceholder: 'Rechercher voiture, marque ou actualité...',
        heroSearchBtn: 'Rechercher',
        statCars: 'Voitures analysées',
        statCompares: 'Comparaisons possibles',
        statGuides: 'Guides',
        statBrands: 'Marques',
        newsTitle: 'Dernières actualités',
        newsSubtitle: 'Lancements, technologie et actualité automobile.',
        newsLink: 'Toutes les actualités',
        reviewsTitle: 'Essais sélectionnés',
        reviewsSubtitle: 'Analyses complètes avec prix, consommation et fiabilité.',
        reviewsLink: 'Tous les essais',
        comparesTitle: 'Comparatifs populaires',
        comparesSubtitle: 'Face à face avec des données objectives.',
        comparesLink: 'Tous les comparatifs',
        guidesTitle: 'Guides pratiques',
        guidesSubtitle: 'Entretien, achat et soin de la voiture.',
        guidesLink: 'Tous les guides',
        toolsTitle: 'Outils utiles',
        toolsSubtitle: 'Diagnostic, comparatifs et autres utilités.',
        toolDiagnosticTitle: 'Diagnostic',
        toolDiagnosticDesc: 'Découvrez ce qui arrive à votre voiture par symptômes.',
        toolCompareTitle: 'Comparer',
        toolCompareDesc: 'Comparez les voitures côte à côte avec des données réelles.',
        toolUtilityTitle: 'Outils',
        toolUtilityDesc: 'Calculateurs et utilités pour conducteurs.',
        brandsTitle: 'Marques populaires',
        brandsSubtitle: 'Trouvez votre prochaine voiture par marque.',
        brandLink: 'Voir marque',
        newsletterTitle: 'Recevez le meilleur de l\'auto dans votre boîte mail',
        newsletterDesc: 'Un résumé hebdomadaire d\'essais, comparatifs et actualités. Pas de spam.',
        newsletterPlaceholder: 'Votre adresse e-mail',
        newsletterSubmit: 'S\'abonner',
        readMore: 'Lire la suite',
        viewReview: 'Voir l\'essai',
        compareBtn: 'Comparer'
    },
    ar: {
        heroKicker: 'بوابتك المرجعية',
        heroTitle: 'اختر سيارتك بالبيانات، لا بالاندفاع',
        heroSubtitle: 'مقارنات تقنية، مراجعات حقيقية، أدوات تشخيص وأدلة عملية لاتخاذ أفضل قرار.',
        heroSearchPlaceholder: 'ابحث عن سيارة أو علامة أو خبر...',
        heroSearchBtn: 'بحث',
        statCars: 'سيارات تم تحليلها',
        statCompares: 'مقارنات ممكنة',
        statGuides: 'أدلة',
        statBrands: 'علامات',
        newsTitle: 'آخر الأخبار',
        newsSubtitle: 'إطلاقات، تقنية وأخبار السيارات.',
        newsLink: 'كل الأخبار',
        reviewsTitle: 'مراجعات مختارة',
        reviewsSubtitle: 'تحليلات شاملة مع الأسعار، الاستهلاك والموثوقية.',
        reviewsLink: 'كل المراجعات',
        comparesTitle: 'مقارنات شائعة',
        comparesSubtitle: 'وجهاً لوجه مع بيانات موضوعية.',
        comparesLink: 'كل المقارنات',
        guidesTitle: 'أدلة عملية',
        guidesSubtitle: 'الصيانة، الشراء والعناية بالسيارة.',
        guidesLink: 'كل الأدلة',
        toolsTitle: 'أدوات مفيدة',
        toolsSubtitle: 'التشخيص، المقارنات والمزيد من الأدوات.',
        toolDiagnosticTitle: 'التشخيص',
        toolDiagnosticDesc: 'اكتشف ما يحدث لسيارتك من خلال الأعراض.',
        toolCompareTitle: 'قارن',
        toolCompareDesc: 'قارن السيارات وجهاً لوجه ببيانات حقيقية.',
        toolUtilityTitle: 'أدوات',
        toolUtilityDesc: 'حاسبات وأدوات للسائقين.',
        brandsTitle: 'علامات شائعة',
        brandsSubtitle: 'اعثر على سيارتك القادمة حسب العلامة.',
        brandLink: 'عرض العلامة',
        newsletterTitle: 'احصل على أفضل أخبار السيارات في بريدك',
        newsletterDesc: 'ملخص أسبوعي للمراجعات والمقارنات والأخبار. لا رسائل مزعجة.',
        newsletterPlaceholder: 'عنوان بريدك الإلكتروني',
        newsletterSubmit: 'اشترك',
        readMore: 'اقرأ المزيد',
        viewReview: 'عرض المراجعة',
        compareBtn: 'قارن'
    }
};

const TOOL_ICONS = {
    diagnostic: '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 3 0 3 0v4z"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-3 0-3h-4z"/></svg>',
    compare: '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18"/><path d="M3 12h18"/><path d="M3 18h18"/></svg>',
    tools: '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>'
};

function wrapLangContent(html, lang, isDefault = false) {
    return `<div class="lang-block" data-lang="${lang}"${isDefault ? '' : ' hidden'}>${html}</div>`;
}

function loadCarData(car) {
    if (carDataCache[car.id]) return carDataCache[car.id];
    const dataFile = car.dataFile || `system/data/${car.id}.json`;
    const dataPath = path.join(__dirname, '../..', dataFile);
    try {
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        carDataCache[car.id] = data;
        return data;
    } catch (e) {
        return null;
    }
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

function loadNews() {
    if (!fs.existsSync(NEWS_DIR)) return [];
    const files = fs.readdirSync(NEWS_DIR).filter(f => f.endsWith('.json'));
    const articles = files.map(file => JSON.parse(fs.readFileSync(path.join(NEWS_DIR, file), 'utf8')));
    articles.sort((a, b) => new Date(b.date) - new Date(a.date));
    return articles;
}

function getNewsArticleLang(article, lang) {
    if (article.translations && article.translations[lang]) return article.translations[lang];
    if (article.translations && article.translations.es) return article.translations.es;
    return article;
}

function formatDate(dateStr, lang = DEFAULT_LANG) {
    const d = new Date(dateStr);
    const locale = { es: 'es-ES', en: 'en-GB', fr: 'fr-FR', ar: 'ar-SA' };
    return d.toLocaleDateString(locale[lang] || 'es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
}

function getNewsSource(id) {
    return newsData.sources.find(s => s.id === id) || { name: id, flag: '' };
}

function getActiveCars() {
    return carRegistry.cars.filter(c => c.status === 'active');
}

function getComparisonCount() {
    const n = getActiveCars().length;
    return n > 1 ? (n * (n - 1)) / 2 : 0;
}

function getActiveBrandCount() {
    const activeBrandIds = new Set(getActiveCars().map(c => c.brandId).filter(Boolean));
    return activeBrandIds.size;
}

function getCarPrice(carData, lang = DEFAULT_LANG) {
    const country = lang === 'en' ? 'gb' : lang === 'fr' ? 'fr' : lang === 'ar' ? 'ae' : 'es';
    const cp = carData.countryPricing?.[country] || carData.countryPricing?.es || carData.countryPricing?.us;
    if (cp?.priceNew) return `€${Number(cp.priceNew).toLocaleString('es-ES')}`;
    if (carData.pricing?.basePrice?.value) return `€${Number(carData.pricing.basePrice.value).toLocaleString('es-ES')}`;
    return '';
}

function getCarName(car, carData, lang = DEFAULT_LANG) {
    const brand = brandRegistry.brands.find(b => b.id === car.brandId);
    const name = carData.basicInfo?.fullModelName || `${brand?.name || ''} ${carData.basicInfo?.name || car.id}`.trim();
    return name;
}

function getCarImage(car, carData) {
    let raw = car.images?.hero || carData.images?.hero || '/images/placeholder.svg';
    if (raw.startsWith('../images/')) raw = raw.replace('../images/', '/images/');
    const srcPath = path.join(__dirname, '../..', raw.startsWith('/') ? raw.slice(1) : raw);
    if (!fs.existsSync(srcPath)) return '/images/placeholder.svg';
    return raw;
}

function buildHeroSection() {
    return SUPPORTED_LANGS.map((lang, idx) => {
        const labels = UI_LABELS[lang];
        const html = `
        <section class="hero" style="background-image: url('images/hero-incio.png')">
            <div class="hero-bg-overlay"></div>
            <div class="container">
                <div class="hero-content">
                    <span class="hero-kicker">${labels.heroKicker}</span>
                    <h1>${labels.heroTitle}</h1>
                    <p>${labels.heroSubtitle}</p>
                    <form class="hero-search" action="reviews.html" method="get" role="search">
                        <input type="search" name="q" id="headerSearch" placeholder="${labels.heroSearchPlaceholder}" aria-label="${labels.heroSearchPlaceholder}">
                        <button type="submit">${labels.heroSearchBtn}</button>
                    </form>
                    <div class="hero-stats">
                        <div class="hero-stat"><strong>${getActiveCars().length}</strong><span>${labels.statCars}</span></div>
                        <div class="hero-stat"><strong>${getComparisonCount()}</strong><span>${labels.statCompares}</span></div>
                        <div class="hero-stat"><strong>${guideRegistry.guides.filter(g => g.status === 'active').length}</strong><span>${labels.statGuides}</span></div>
                        <div class="hero-stat"><strong>${getActiveBrandCount()}</strong><span>${labels.statBrands}</span></div>
                    </div>
                </div>
            </div>
        </section>`;
        return wrapLangContent(html, lang, idx === 0);
    }).join('');
}

function buildNewsSection() {
    const articles = newsArticles.slice(0, 3);
    return SUPPORTED_LANGS.map((lang, idx) => {
        const cards = articles.map(article => {
            const data = getNewsArticleLang(article, lang);
            const source = getNewsSource(article.source);
            const image = article.image ? `<img src="${article.image}" alt="${data.title}" loading="lazy">` : '';
            return `
            <a href="noticias/${article.slug}.html" class="card">
                <div class="card-image">${image}</div>
                <div class="card-body">
                    <div class="card-meta"><span>${article.category}</span><span class="card-meta-muted">${source.flag} ${source.name}</span></div>
                    <h3 class="card-title">${data.title}</h3>
                    <p class="card-text">${data.excerpt}</p>
                    <div class="card-footer"><span>${formatDate(article.date, lang)}</span><span>${t('home.readMore', lang)}</span></div>
                </div>
            </a>`;
        }).join('');
        const html = `
        <section class="section">
            <div class="container">
                <div class="section-header">
                    <div><h2 class="section-title">${t('home.newsTitle', lang)}</h2><p class="section-subtitle">${t('home.newsSubtitle', lang)}</p></div>
                    <a href="noticias.html" class="section-link">${t('home.newsLink', lang)}</a>
                </div>
                <div class="card-grid card-grid--3">${cards}</div>
            </div>
        </section>`;
        return wrapLangContent(html, lang, idx === 0);
    }).join('');
}

function buildReviewsSection() {
    const cars = getActiveCars().slice(0, 4);
    return SUPPORTED_LANGS.map((lang, idx) => {
        const labels = UI_LABELS[lang];
        const cards = cars.map(car => {
            const carData = loadCarData(car);
            if (!carData) return '';
            const brand = brandRegistry.brands.find(b => b.id === car.brandId);
            const name = getCarName(car, carData, lang);
            const image = getCarImage(car, carData);
            const rating = carData.rating?.overall ?? '';
            const price = getCarPrice(carData, lang);
            const power = carData.performance?.power ? `${carData.performance.power.value} ${carData.performance.power.unit}` : '';
            const accel = carData.performance?.acceleration?.zeroToHundred ? `${carData.performance.acceleration.zeroToHundred}s 0-100` : '';
            const ratingHtml = rating ? `<span class="card-rating">${rating}</span>` : '';
            return `
            <a href="${car.htmlFile}" class="card review-card">
                <div class="card-image">${ratingHtml}<img src="${image}" alt="${name}" loading="lazy"></div>
                <div class="card-body">
                    <div class="card-meta"><span>${getCategoryName(car.categoryId, lang)}</span></div>
                    <h3 class="card-title">${name}</h3>
                    <div class="specs-row">
                        ${power ? `<span class="spec-tag">${power}</span>` : ''}
                        ${accel ? `<span class="spec-tag">${accel}</span>` : ''}
                        ${price ? `<span class="spec-tag">${price}</span>` : ''}
                    </div>
                    <div class="card-footer"><span>${brand?.name || ''}</span><span>${labels.viewReview}</span></div>
                </div>
            </a>`;
        }).join('');
        const html = `
        <section class="section">
            <div class="container">
                <div class="section-header">
                    <div><h2 class="section-title">${labels.reviewsTitle}</h2><p class="section-subtitle">${labels.reviewsSubtitle}</p></div>
                    <a href="reviews.html" class="section-link">${labels.reviewsLink}</a>
                </div>
                <div class="card-grid card-grid--4">${cards}</div>
            </div>
        </section>`;
        return wrapLangContent(html, lang, idx === 0);
    }).join('');
}

function buildComparesSection() {
    const pairs = getComparisonPairs(3);
    return SUPPORTED_LANGS.map((lang, idx) => {
        const cards = pairs.map(({ a, b }) => {
            const dataA = loadCarData(a);
            const dataB = loadCarData(b);
            const nameA = dataA ? getCarName(a, dataA, lang) : a.id;
            const nameB = dataB ? getCarName(b, dataB, lang) : b.id;
            const imgA = dataA ? getCarImage(a, dataA) : '/images/placeholder.svg';
            const imgB = dataB ? getCarImage(b, dataB) : '/images/placeholder.svg';
            return `
            <a href="compare.html?car1=${encodeURIComponent(a.id)}&car2=${encodeURIComponent(b.id)}" class="card compare-card">
                <div class="card-image">
                    <div class="compare-images">
                        <div><img src="${imgA}" alt="${nameA}" loading="lazy"></div>
                        <div><img src="${imgB}" alt="${nameB}" loading="lazy"></div>
                    </div>
                    <span class="compare-vs">VS</span>
                </div>
                <div class="card-body">
                    <div class="card-meta"><span>${getCategoryName(a.categoryId, lang)} vs ${getCategoryName(b.categoryId, lang)}</span></div>
                    <h3 class="card-title">${nameA} <span style="color:var(--text-muted)">vs</span> ${nameB}</h3>
                    <div class="card-footer"><span>${nameA} <span style="color:var(--text-muted)">vs</span> ${nameB}</span><span>${t('home.compareBtn', lang)}</span></div>
                </div>
            </a>`;
        }).join('');
        const html = `
        <section class="section">
            <div class="container">
                <div class="section-header">
                    <div><h2 class="section-title">${t('home.comparisonsTitle', lang)}</h2><p class="section-subtitle">${t('home.comparisonsSubtitle', lang)}</p></div>
                    <a href="compare.html" class="section-link">${t('home.compareLink', lang)}</a>
                </div>
                ${cards ? `<div class="comparisons-grid">${cards}</div>` : `<div class="empty-section">${t('home.comparisonsSubtitle', lang)}</div>`}
            </div>
        </section>`;
        return wrapLangContent(html, lang, idx === 0);
    }).join('');
}

function getCarByName(name) {
    for (const car of getActiveCars()) {
        const carData = loadCarData(car);
        if (!carData) continue;
        const fullName = getCarName(car, carData);
        if (fullName.toLowerCase().includes(name.toLowerCase())) return { car, data: carData };
    }
    return null;
}

function getCarUrl(car) {
    return car.htmlFile;
}

function formatPrice(value, lang = DEFAULT_LANG) {
    if (value == null || Number.isNaN(value)) return '';
    return `€${Math.round(value).toLocaleString('es-ES')}`;
}

function parsePrice(carData) {
    const cp = carData.countryPricing?.es || carData.countryPricing?.us || carData.countryPricing?.gb || Object.values(carData.countryPricing || {})[0];
    if (cp?.priceNew) return Number(cp.priceNew);
    if (carData.pricing?.basePrice?.value) return Number(carData.pricing.basePrice.value);
    return null;
}

function getCarDate(carData) {
    return carData.launchDate || carData.metadata?.createdAt || `${carData.modelYear || 2026}-01-01`;
}

function getCarRating(carData) {
    return carData.rating?.overall ?? 0;
}

function getActiveCarDataList() {
    return getActiveCars().map(car => ({ car, data: loadCarData(car) })).filter(item => item.data);
}

function countNewsForCar(car) {
    return newsArticles.filter(a => Array.isArray(a.relatedCars) && a.relatedCars.includes(car.id)).length;
}

function getCarScore(car, carData) {
    const rating = getCarRating(carData);
    const compCount = (car.comparisons?.length || 0) + (car.relatedCars?.length || 0);
    const newsCount = countNewsForCar(car);
    const year = new Date(getCarDate(carData)).getFullYear() || 2020;
    const yearBoost = Math.max(0, (year - 2020) * 0.5);
    const catIndex = categoryRegistry.categories.findIndex(c => c.id === car.categoryId);
    const categoryImportance = Math.max(0.5, (categoryRegistry.categories.length - Math.max(0, catIndex)) * 0.25);
    return (rating * 4) + (compCount * 1.5) + (newsCount * 2) + yearBoost + categoryImportance;
}

const RANKING_DEFINITIONS = [
    { key: 'bestSportsCar', categoryId: 'deportivos', icon: '🏎️' },
    { key: 'bestSedan', categoryId: 'sedan', icon: '🚗' },
    { key: 'bestSuv', categoryId: 'suv', icon: '🚙' },
    { key: 'bestFamily', categoryId: 'familiar', icon: '🚌' },
    { key: 'bestLuxury', categoryId: 'lujo', icon: '👑' },
    { key: 'bestValue', categoryId: null, icon: '💰', valueSort: true }
];

function getRankings() {
    const list = getActiveCarDataList();
    return RANKING_DEFINITIONS.map(def => {
        let candidates = list;
        if (def.categoryId) {
            candidates = list.filter(({ car }) => car.categoryId === def.categoryId);
        }
        if (candidates.length === 0) return null;
        let best;
        if (def.valueSort) {
            best = candidates
                .map(item => ({ ...item, valueScore: getCarRating(item.data) / (parsePrice(item.data) || 1) }))
                .sort((a, b) => b.valueScore - a.valueScore)[0];
        } else {
            best = candidates.slice().sort((a, b) => getCarRating(b.data) - getCarRating(a.data))[0];
        }
        return { ...def, ...best };
    }).filter(Boolean);
}

function getBudgetRanges() {
    const prices = getActiveCarDataList().map(({ data }) => parsePrice(data)).filter(p => p != null && !Number.isNaN(p));
    if (prices.length === 0) return [];
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const steps = 4;
    const rawStep = (max - min) / steps;
    const step = Math.ceil(rawStep / 5000) * 5000 || 5000;
    const ranges = [];
    let lower = Math.floor(min / step) * step;
    for (let i = 0; i < steps; i++) {
        const upper = i < steps - 1 ? lower + step : null;
        const count = prices.filter(p => p >= lower && (upper == null || p < upper)).length;
        ranges.push({ from: lower, to: upper, count });
        if (upper == null) break;
        lower = upper;
    }
    return ranges.filter(r => r.count > 0);
}

function getCategoryCounts() {
    const list = getActiveCarDataList();
    return categoryRegistry.categories
        .map(cat => ({ ...cat, count: list.filter(({ car }) => car.categoryId === cat.id).length }))
        .filter(c => c.count > 0)
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

function getActiveBrandCounts() {
    const list = getActiveCarDataList();
    const counts = {};
    list.forEach(({ car }) => { counts[car.brandId] = (counts[car.brandId] || 0) + 1; });
    return brandRegistry.brands
        .map(b => ({ ...b, count: counts[b.id] || 0 }))
        .filter(b => b.count > 0)
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

function getComparisonPairs(limit = 3) {
    const activeIds = new Set(getActiveCars().map(c => c.id));
    const pairs = [];
    const seen = new Set();
    for (const car of getActiveCars()) {
        for (const otherId of car.comparisons || []) {
            if (!activeIds.has(otherId)) continue;
            const key = [car.id, otherId].sort().join('--');
            if (seen.has(key)) continue;
            seen.add(key);
            const other = carRegistry.cars.find(c => c.id === otherId);
            if (!other) continue;
            pairs.push({ a: car, b: other });
            if (pairs.length >= limit) return pairs;
        }
    }
    return pairs;
}

function getMostSearchedCars(limit = 5) {
    return getActiveCarDataList()
        .map(item => ({ ...item, score: getCarScore(item.car, item.data) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
}

function getLatestModels(limit = 5) {
    return getActiveCarDataList()
        .slice()
        .sort((a, b) => new Date(getCarDate(b.data)) - new Date(getCarDate(a.data)))
        .slice(0, limit);
}

function getBestRatedCars(limit = 6) {
    return getActiveCarDataList()
        .slice()
        .sort((a, b) => getCarRating(b.data) - getCarRating(a.data))
        .slice(0, limit);
}

function buildGuidesSection() {
    const guides = guideRegistry.guides.filter(g => g.status === 'active').slice(0, 3);
    return SUPPORTED_LANGS.map((lang, idx) => {
        const cards = guides.map(g => {
            const d = loadGuideData(g);
            const content = d?.content?.[lang] || d?.content?.es || {};
            return `
            <a href="${g.htmlFile}" class="card">
                <div class="card-body">
                    <div class="card-meta"><span>${t(`guides.categories.${g.categoryId}`, lang)}</span></div>
                    <h3 class="card-title">${content.title || g.id}</h3>
                    <p class="card-text">${content.excerpt || ''}</p>
                    <div class="card-footer"><span>${d?.readingTime || ''} min</span><span>${t('home.readMore', lang)}</span></div>
                </div>
            </a>`;
        }).join('');
        const html = `
        <section class="section">
            <div class="container">
                <div class="section-header">
                    <div><h2 class="section-title">${t('home.guidesTitle', lang)}</h2><p class="section-subtitle">${t('home.guidesSubtitle', lang)}</p></div>
                    <a href="guias/index.html" class="section-link">${t('home.guidesLink', lang)}</a>
                </div>
                <div class="card-grid card-grid--3">${cards}</div>
            </div>
        </section>`;
        return wrapLangContent(html, lang, idx === 0);
    }).join('');
}

function buildToolsSection() {
    return SUPPORTED_LANGS.map((lang, idx) => {
        const labels = UI_LABELS[lang];
        const tools = [
            { icon: 'diagnostic', href: 'diagnostico.html', titleKey: 'toolDiagnosticTitle', descKey: 'toolDiagnosticDesc' },
            { icon: 'compare', href: 'compare.html', titleKey: 'toolCompareTitle', descKey: 'toolCompareDesc' },
            { icon: 'tools', href: 'herramientas.html', titleKey: 'toolUtilityTitle', descKey: 'toolUtilityDesc' }
        ];
        const cards = tools.map(t => `
            <a href="${t.href}" class="tool-card">
                <div class="tool-icon">${TOOL_ICONS[t.icon]}</div>
                <div class="tool-info">
                    <h3>${labels[t.titleKey]}</h3>
                    <p>${labels[t.descKey]}</p>
                </div>
            </a>`).join('');
        const html = `
        <section class="section">
            <div class="container">
                <div class="section-header">
                    <div><h2 class="section-title">${labels.toolsTitle}</h2><p class="section-subtitle">${labels.toolsSubtitle}</p></div>
                </div>
                <div class="tool-grid">${cards}</div>
            </div>
        </section>`;
        return wrapLangContent(html, lang, idx === 0);
    }).join('');
}

function buildBrandsSection() {
    const brands = getActiveBrandCounts().slice(0, 12);
    return SUPPORTED_LANGS.map((lang, idx) => {
        const cards = brands.map(b => {
            const logo = b.logo || `https://cdn.simpleicons.org/${b.id}/94a3b8`;
            return `
            <a href="marcas.html#${b.id}" class="brand-card">
                <img src="${logo}" alt="${b.name}" loading="lazy">
                <span>${b.name}</span>
                <span class="category-count">${formatModelCount(b.count, lang)}</span>
            </a>`;
        }).join('');
        const html = `
        <section class="section">
            <div class="container">
                <div class="section-header">
                    <div><h2 class="section-title">${t('home.brandsTitle', lang)}</h2><p class="section-subtitle">${t('home.brandsSubtitle', lang)}</p></div>
                    <a href="marcas.html" class="section-link">${t('home.brandsLink', lang)}</a>
                </div>
                <div class="brand-grid">${cards}</div>
            </div>
        </section>`;
        return wrapLangContent(html, lang, idx === 0);
    }).join('');
}

function buildNewsletterSection() {
    return SUPPORTED_LANGS.map((lang, idx) => {
        const labels = UI_LABELS[lang];
        const html = `
        <section class="newsletter">
            <div class="container">
                <div class="newsletter-inner">
                    <h2>${labels.newsletterTitle}</h2>
                    <p>${labels.newsletterDesc}</p>
                    <form class="newsletter-form" onsubmit="return false;">
                        <input type="email" placeholder="${labels.newsletterPlaceholder}" aria-label="${labels.newsletterPlaceholder}">
                        <button type="submit">${labels.newsletterSubmit}</button>
                    </form>
                </div>
            </div>
        </section>`;
        return wrapLangContent(html, lang, idx === 0);
    }).join('');
}

function buildMostSearchedSection() {
    const items = getMostSearchedCars(5);
    return SUPPORTED_LANGS.map((lang, idx) => {
        const cards = items.map(({ car, data, score }, i) => {
            const name = getCarName(car, data, lang);
            const image = getCarImage(car, data);
            const rating = getCarRating(data);
            const price = getCarPrice(data, lang);
            const power = data.performance?.power ? `${data.performance.power.value} ${data.performance.power.unit}` : '';
            const accel = data.performance?.acceleration?.zeroToHundred ? `${data.performance.acceleration.zeroToHundred}s 0-100` : '';
            const brand = brandRegistry.brands.find(b => b.id === car.brandId);
            const badge = i === 0 ? `<span class="card-badge">#1</span>` : '';
            const ratingHtml = rating ? `<span class="card-rating">${rating.toFixed(1)}</span>` : '';
            return `
            <a href="${car.htmlFile}" class="card review-card">
                <div class="card-image">${badge}${ratingHtml}<img src="${image}" alt="${name}" loading="lazy"></div>
                <div class="card-body">
                    <div class="card-meta"><span>${getCategoryName(car.categoryId, lang)}</span></div>
                    <h3 class="card-title">${name}</h3>
                    <div class="specs-row">
                        ${power ? `<span class="spec-tag">${power}</span>` : ''}
                        ${accel ? `<span class="spec-tag">${accel}</span>` : ''}
                        ${price ? `<span class="spec-tag">${price}</span>` : ''}
                    </div>
                    <div class="card-footer"><span>${t('home.viewReview', lang)}</span><span>${brand?.name || ''}</span></div>
                </div>
            </a>`;
        }).join('');
        const html = `
        <section class="section">
            <div class="container">
                <div class="section-header">
                    <div><h2 class="section-title">${t('home.mostSearchedTitle', lang)}</h2><p class="section-subtitle">${t('home.mostSearchedSubtitle', lang)}</p></div>
                    <a href="reviews.html" class="section-link">${t('home.reviewsLink', lang)}</a>
                </div>
                ${cards ? `<div class="featured-grid">${cards}</div>` : `<div class="empty-section">${t('home.mostSearchedSubtitle', lang)}</div>`}
            </div>
        </section>`;
        return wrapLangContent(html, lang, idx === 0);
    }).join('');
}

function buildRankingsSection() {
    const rankings = getRankings();
    return SUPPORTED_LANGS.map((lang, idx) => {
        const cards = rankings.map(r => {
            const name = getCarName(r.car, r.data, lang);
            const image = getCarImage(r.car, r.data);
            const rating = getCarRating(r.data);
            const scoreHtml = rating ? `<div class="rank-score">${rating.toFixed(1)}</div>` : '';
            return `
            <a href="${r.car.htmlFile}" class="rank-card">
                <img class="rank-bg" src="${image}" alt="${name}" loading="lazy">
                <div class="rank-overlay">
                    <div class="rank-badge">
                        <span class="rank-label">${t('home.' + r.key, lang)}</span>
                    </div>
                    <div class="rank-car">${name}</div>
                    ${scoreHtml}
                </div>
            </a>`;
        }).join('');
        const html = `
        <section class="section">
            <div class="container">
                <div class="section-header">
                    <div><h2 class="section-title">${t('home.rankingsTitle', lang)}</h2><p class="section-subtitle">${t('home.rankingsSubtitle', lang)}</p></div>
                </div>
                ${cards ? `<div class="rankings-grid">${cards}</div>` : `<div class="empty-section">${t('home.rankingsSubtitle', lang)}</div>`}
            </div>
        </section>`;
        return wrapLangContent(html, lang, idx === 0);
    }).join('');
}

function buildLatestModelsSection() {
    const items = getLatestModels(5);
    return SUPPORTED_LANGS.map((lang, idx) => {
        const cards = items.map(({ car, data }) => {
            const name = getCarName(car, data, lang);
            const image = getCarImage(car, data);
            const date = formatDate(getCarDate(data), lang);
            const price = getCarPrice(data, lang);
            const brand = brandRegistry.brands.find(b => b.id === car.brandId);
            return `
            <a href="${car.htmlFile}" class="card review-card">
                <div class="card-image"><img src="${image}" alt="${name}" loading="lazy"></div>
                <div class="card-body">
                    <div class="card-meta"><span>${getCategoryName(car.categoryId, lang)}</span><span class="card-meta-muted">${date}</span></div>
                    <h3 class="card-title">${name}</h3>
                    <div class="card-footer"><span>${brand?.name || ''}</span><span>${price || t('home.viewReview', lang)}</span></div>
                </div>
            </a>`;
        }).join('');
        const html = `
        <section class="section">
            <div class="container">
                <div class="section-header">
                    <div><h2 class="section-title">${t('home.latestModelsTitle', lang)}</h2><p class="section-subtitle">${t('home.latestModelsSubtitle', lang)}</p></div>
                    <a href="reviews.html" class="section-link">${t('home.reviewsLink', lang)}</a>
                </div>
                ${cards ? `<div class="slider-track">${cards}</div>` : `<div class="empty-section">${t('home.latestModelsSubtitle', lang)}</div>`}
            </div>
        </section>`;
        return wrapLangContent(html, lang, idx === 0);
    }).join('');
}

function buildBestRatedSection() {
    const items = getBestRatedCars(6);
    return SUPPORTED_LANGS.map((lang, idx) => {
        const cards = items.map(({ car, data }) => {
            const name = getCarName(car, data, lang);
            const image = getCarImage(car, data);
            const rating = getCarRating(data);
            const ratingHtml = rating ? `<span class="card-rating">${rating.toFixed(1)}</span>` : '';
            const brand = brandRegistry.brands.find(b => b.id === car.brandId);
            return `
            <a href="${car.htmlFile}" class="card review-card">
                <div class="card-image">${ratingHtml}<img src="${image}" alt="${name}" loading="lazy"></div>
                <div class="card-body">
                    <div class="card-meta"><span>${getCategoryName(car.categoryId, lang)}</span></div>
                    <h3 class="card-title">${name}</h3>
                    <div class="card-footer"><span>${brand?.name || ''}</span><span>${t('home.viewReview', lang)}</span></div>
                </div>
            </a>`;
        }).join('');
        const html = `
        <section class="section">
            <div class="container">
                <div class="section-header">
                    <div><h2 class="section-title">${t('home.bestRatedTitle', lang)}</h2><p class="section-subtitle">${t('home.bestRatedSubtitle', lang)}</p></div>
                    <a href="reviews.html" class="section-link">${t('home.reviewsLink', lang)}</a>
                </div>
                ${cards ? `<div class="masonry-grid">${cards}</div>` : `<div class="empty-section">${t('home.bestRatedSubtitle', lang)}</div>`}
            </div>
        </section>`;
        return wrapLangContent(html, lang, idx === 0);
    }).join('');
}

function buildBudgetSection() {
    const ranges = getBudgetRanges();
    return SUPPORTED_LANGS.map((lang, idx) => {
        const cards = ranges.map(r => {
            const label = r.to == null
                ? `${t('home.budgetFrom', lang)} ${formatPrice(r.from, lang)}`
                : `${formatPrice(r.from, lang)} - ${formatPrice(r.to, lang)}`;
            const budgetParam = r.to == null ? `${r.from}` : `${r.from}-${r.to}`;
            return `
            <a href="reviews.html?budget=${budgetParam}" class="budget-card">
                <div class="budget-range">${label}</div>
                <div class="budget-meta">${t('home.budgetFrom', lang)} ${formatPrice(r.from, lang)}</div>
                <div class="budget-count">${formatModelCount(r.count, lang)}</div>
            </a>`;
        }).join('');
        const html = `
        <section class="section">
            <div class="container">
                <div class="section-header">
                    <div><h2 class="section-title">${t('home.budgetTitle', lang)}</h2><p class="section-subtitle">${t('home.budgetSubtitle', lang)}</p></div>
                </div>
                ${cards ? `<div class="budget-grid">${cards}</div>` : `<div class="empty-section">${t('home.budgetSubtitle', lang)}</div>`}
            </div>
        </section>`;
        return wrapLangContent(html, lang, idx === 0);
    }).join('');
}

function buildCategoriesSection() {
    const categories = getCategoryCounts();
    return SUPPORTED_LANGS.map((lang, idx) => {
        const cards = categories.map(c => `
            <a href="reviews.html?categoria=${encodeURIComponent(c.id)}" class="category-card">
                <span class="category-icon">${c.icon}</span>
                <span class="category-name">${getCategoryName(c.id, lang)}</span>
                <span class="category-count">${formatModelCount(c.count, lang)}</span>
            </a>`).join('');
        const html = `
        <section class="section">
            <div class="container">
                <div class="section-header">
                    <div><h2 class="section-title">${t('home.categoriesTitle', lang)}</h2><p class="section-subtitle">${t('home.categoriesSubtitle', lang)}</p></div>
                </div>
                ${cards ? `<div class="category-grid">${cards}</div>` : `<div class="empty-section">${t('home.categoriesSubtitle', lang)}</div>`}
            </div>
        </section>`;
        return wrapLangContent(html, lang, idx === 0);
    }).join('');
}

function buildCtaSection() {
    return SUPPORTED_LANGS.map((lang, idx) => {
        const html = `
        <section class="home-cta">
            <div class="container">
                <div class="home-cta-inner">
                    <h2>${t('home.ctaTitle', lang)}</h2>
                    <p>${t('home.ctaSubtitle', lang)}</p>
                    <div class="home-cta-actions">
                        <a href="reviews.html" class="primary">${t('home.ctaReviews', lang)}</a>
                        <a href="compare.html" class="secondary">${t('home.ctaCompare', lang)}</a>
                        <a href="guias/index.html" class="secondary">${t('home.ctaGuides', lang)}</a>
                    </div>
                </div>
            </div>
        </section>`;
        return wrapLangContent(html, lang, idx === 0);
    }).join('');
}

function buildHreflangTags() {
    return SUPPORTED_LANGS.map(lang => {
        return `<link rel="alternate" hreflang="${lang}" href="${BASE_URL}/">`;
    }).join('\n    ') + `\n    <link rel="alternate" hreflang="x-default" href="${BASE_URL}/">`;
}

function buildJsonLd() {
    const cars = getActiveCars();
    const itemList = cars.map((car, idx) => {
        const carData = loadCarData(car);
        const name = carData ? getCarName(car, carData) : car.id;
        return {
            '@type': 'ListItem',
            position: idx + 1,
            url: `${BASE_URL}/${car.htmlFile}`,
            name
        };
    });
    return JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: itemList
    }, null, 2);
}

function buildAll() {
    const activeCars = getActiveCars();
    const firstCar = activeCars[0];
    const firstCarData = firstCar ? loadCarData(firstCar) : null;
    const ogImage = (firstCar ? getCarImage(firstCar, firstCarData) : '/images/placeholder.svg');

    let page = template;
    page = page.replace(/\{\{title\}\}/g, 'CarSpecio | Comparativas y reviews de coches premium');
    page = page.replace(/\{\{description\}\}/g, 'Reviews técnicas, comparativas y herramientas para elegir tu próximo coche con confianza.');
    page = page.replace(/\{\{keywords\}\}/g, 'coches, reviews, comparativas, marcas, noticias, guías, herramientas, diagnóstico');
    page = page.replace(/\{\{canonicalUrl\}\}/g, `${BASE_URL}/`);
    page = page.replace(/\{\{ogImage\}\}/g, ogImage.startsWith('http') ? ogImage : `${BASE_URL}${ogImage}`);
    page = page.replace(/\{\{hreflangTags\}\}/g, buildHreflangTags());
    page = page.replace(/\{\{jsonLd\}\}/g, buildJsonLd());
    page = page.replace(/\{\{year\}\}/g, new Date().getFullYear());
    page = page.replace(/\{\{heroSection\}\}/g, buildHeroSection());
    page = page.replace(/\{\{mostSearchedSection\}\}/g, buildMostSearchedSection());
    page = page.replace(/\{\{rankingsSection\}\}/g, buildRankingsSection());
    page = page.replace(/\{\{latestModelsSection\}\}/g, buildLatestModelsSection());
    page = page.replace(/\{\{bestRatedSection\}\}/g, buildBestRatedSection());
    page = page.replace(/\{\{budgetSection\}\}/g, buildBudgetSection());
    page = page.replace(/\{\{categoriesSection\}\}/g, buildCategoriesSection());
    page = page.replace(/\{\{brandsSection\}\}/g, buildBrandsSection());
    page = page.replace(/\{\{comparesSection\}\}/g, buildComparesSection());
    page = page.replace(/\{\{newsSection\}\}/g, buildNewsSection());
    page = page.replace(/\{\{guidesSection\}\}/g, buildGuidesSection());
    page = page.replace(/\{\{toolsSection\}\}/g, buildToolsSection());
    page = page.replace(/\{\{ctaSection\}\}/g, buildCtaSection());
    page = page.replace(/\{\{newsletterSection\}\}/g, buildNewsletterSection());

    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), page, 'utf8');
    console.log('✅ Generated html/index.html');
}

buildAll();
