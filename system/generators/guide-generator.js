/**
 * CarSpecio -- Guide Page Generator (Node.js)
 * Generates static HTML pages for each guide from guide-template.html
 * Output: html/guias/[slug].html
 */

const fs = require('fs');
const path = require('path');
const { BASE_URL, SUPPORTED_LANGS, DEFAULT_LANG } = require('../config');

const TEMPLATE_PATH = path.join(__dirname, '../templates/guide-template.html');
const OUTPUT_DIR = path.join(__dirname, '../../html/guias');
const DATA_DIR = path.join(__dirname, '../../system/data/guides');
const REGISTRY_PATH = path.join(__dirname, '../registry/guide-registry.json');
const CAR_REGISTRY_PATH = path.join(__dirname, '../registry/car-registry.json');
const BRAND_REGISTRY_PATH = path.join(__dirname, '../registry/brand-registry.json');
const LOCALE_DIR = path.join(__dirname, '../locales');

const guideRegistry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
const carRegistry = JSON.parse(fs.readFileSync(CAR_REGISTRY_PATH, 'utf8'));
const brandRegistry = JSON.parse(fs.readFileSync(BRAND_REGISTRY_PATH, 'utf8'));

let template = fs.readFileSync(TEMPLATE_PATH, 'utf8');

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
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

function loadGuideData(guide) {
    const dataFile = guide.dataFile || `system/data/guides/${guide.id}.json`;
    const dataPath = path.join(__dirname, '../..', dataFile);
    try {
        return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    } catch (e) {
        return null;
    }
}

function getCategoryName(categoryId, lang = DEFAULT_LANG) {
    return t(`guides.categories.${categoryId}`, lang) || categoryId;
}

function getCategoryById(categoryId) {
    return guideRegistry.categories.find(c => c.id === categoryId);
}

// Build lookup maps for auto-related guides
const allGuideData = {};
guideRegistry.guides.forEach(g => {
    const d = loadGuideData(g);
    if (d) allGuideData[g.id] = d;
});

function computeRelatedGuides(currentGuide, currentData) {
    // If manual override exists, use it
    if (currentData.relatedGuides && currentData.relatedGuides.length > 0) {
        return currentData.relatedGuides;
    }

    const scores = {};
    const currentTags = new Set(currentData.tags || []);
    const currentKeywords = new Set(
        SUPPORTED_LANGS.flatMap(lang => currentData.content?.[lang]?.seo?.keywords || [])
            .map(k => k.toLowerCase())
    );
    const currentCategory = currentGuide.categoryId;

    guideRegistry.guides.forEach(other => {
        if (other.id === currentGuide.id) return;
        if (other.status !== 'active') return;

        const d = allGuideData[other.id];
        if (!d) return;

        let score = 0;

        // Same category (+3)
        if (other.categoryId === currentCategory) {
            score += 3;
        }

        // Shared tags (+2 each)
        const otherTags = new Set(d.tags || []);
        let tagMatches = 0;
        for (const t of currentTags) {
            if (otherTags.has(t)) tagMatches++;
        }
        score += tagMatches * 2;

        // Shared keywords (+1 each)
        const otherKeywords = new Set(
            SUPPORTED_LANGS.flatMap(lang => d.content?.[lang]?.seo?.keywords || [])
                .map(k => k.toLowerCase())
        );
        let keywordMatches = 0;
        for (const k of currentKeywords) {
            if (otherKeywords.has(k)) keywordMatches++;
        }
        score += keywordMatches;

        // Same difficulty (+1)
        if (d.difficulty && d.difficulty === currentData.difficulty) {
            score += 1;
        }

        // Same author (+1)
        if (d.author && d.author === currentData.author) {
            score += 1;
        }

        if (score > 0) {
            scores[other.id] = score;
        }
    });

    return Object.entries(scores)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([id]) => id);
}

function resolveRelatedGuides(relatedIds) {
    return relatedIds
        .map(id => guideRegistry.guides.find(g => g.id === id))
        .filter(Boolean)
        .filter(g => g.status === 'active');
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

function resolveRelatedCars(relatedCarIds) {
    return (relatedCarIds || [])
        .map(id => carRegistry.cars.find(c => c.id === id))
        .filter(Boolean)
        .filter(c => c.status === 'active')
        .map(c => {
            const carData = loadCarData(c);
            const brand = brandRegistry.brands.find(b => b.id === c.brandId);
            const name = carData?.basicInfo?.name || c.id;
            return {
                id: c.id,
                htmlFile: c.htmlFile,
                name: brand ? `${brand.name} ${name}` : name
            };
        });
}

function wrapLangContent(html, lang, isDefault = false) {
    return `<div class="lang-block" data-lang="${lang}"${isDefault ? '' : ' hidden'}>${html}</div>`;
}

function buildMultilingualSummary(guideData) {
    return SUPPORTED_LANGS.map((lang, idx) => {
        const sb = guideData.summaryBox && guideData.summaryBox[lang];
        if (!sb) return '';
        const title = sb.title || t('guides.summaryTitle', lang);
        const html = `<h4>${title}</h4><ul>${sb.items.map(item => `<li>${item}</li>`).join('')}</ul>`;
        return wrapLangContent(html, lang, idx === 0);
    }).join('');
}

function buildMultilingualKeyTakeaways(guideData) {
    return SUPPORTED_LANGS.map((lang, idx) => {
        const content = guideData.content[lang];
        if (!content || !content.keyTakeaways || content.keyTakeaways.length === 0) return '';
        const label = t('guides.keyTakeawaysTitle', lang) || 'Puntos clave';
        const html = `<h4>${label}</h4><ul class="key-takeaways__list">${content.keyTakeaways.map(item => `<li>${item}</li>`).join('')}</ul>`;
        return wrapLangContent(html, lang, idx === 0);
    }).join('');
}

function buildMultilingualToc(guideData, lang = DEFAULT_LANG) {
    const content = guideData.content[lang];
    if (!content) return '';
    let tocHtml = '';
    content.sections.forEach((section, idx) => {
        tocHtml += `<li><a href="#${section.id}">${idx + 1}. ${section.title}</a></li>`;
    });
    if (guideData.summaryBox && guideData.summaryBox[lang]) {
        tocHtml += `<li><a href="#summaryBox">${content.sections.length + 1}. ${guideData.summaryBox[lang].tocLabel || t('guides.summaryTitle', lang)}</a></li>`;
    }
    if (content.faq && content.faq.length > 0) {
        tocHtml += `<li><a href="#faq">${content.sections.length + 2}. ${content.faqLabel || t('guides.faqTitle', lang)}</a></li>`;
    }
    return tocHtml;
}

function buildMultilingualIntro(guideData) {
    return SUPPORTED_LANGS.map((lang, idx) => {
        const content = guideData.content[lang];
        if (!content) return '';
        return wrapLangContent(`<p>${content.intro}</p>`, lang, idx === 0);
    }).join('');
}

function buildMultilingualSections(guideData) {
    return SUPPORTED_LANGS.map((lang, idx) => {
        const content = guideData.content[lang];
        if (!content || !content.sections) return '';
        let sectionsHtml = '';
        content.sections.forEach(section => {
            let sectionHtml = `<section id="${section.id}">`;
            sectionHtml += `<h2 class="section-heading">${section.title}<a class="section-anchor" href="#${section.id}" data-section-id="${section.id}" aria-label="Copiar enlace a esta sección"><svg aria-hidden="true" focusable="false" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg></a></h2>`;
            if (section.image) {
                sectionHtml += `<img src="${section.image}" alt="${section.alt || section.title}" loading="lazy" decoding="async">`;
            }
            sectionHtml += `<div class="section-body">${section.content}</div>`;
            if (section.callout) {
                sectionHtml += `<div class="callout callout--${section.callout.type}">${section.callout.text}</div>`;
            }
            sectionHtml += '</section>';
            sectionsHtml += sectionHtml;
        });
        return wrapLangContent(sectionsHtml, lang, idx === 0);
    }).join('');
}

function buildMultilingualFaq(guideData) {
    return SUPPORTED_LANGS.map((lang, idx) => {
        const content = guideData.content[lang];
        if (!content || !content.faq || content.faq.length === 0) return '';
        const prefix = lang === DEFAULT_LANG ? '' : `${lang}-`;
        const faqHtml = content.faq.map((faq, i) => `
            <div class="faq-item">
                <button class="faq-question" type="button" aria-expanded="false" aria-controls="${prefix}faq-answer-${i}">
                    ${faq.question}
                    <span class="faq-icon" aria-hidden="true">+</span>
                </button>
                <div class="faq-answer" id="${prefix}faq-answer-${i}" hidden role="region">
                    <p>${faq.answer}</p>
                </div>
            </div>
        `).join('');
        return wrapLangContent(faqHtml, lang, idx === 0);
    }).join('');
}

function buildMultilingualTitle(guideData) {
    return SUPPORTED_LANGS.map((lang, idx) => {
        const content = guideData.content[lang];
        if (!content) return '';
        return `<span class="lang-title" data-lang="${lang}"${idx === 0 ? '' : ' hidden'}>${content.title}</span>`;
    }).join('');
}

function buildMultilingualCardContent(guideData) {
    return SUPPORTED_LANGS.map((lang, idx) => {
        const content = guideData.content[lang];
        if (!content) return '';
        return `<span class="lang-card-content" data-lang="${lang}"${idx === 0 ? '' : ' hidden'}><h3>${content.title}</h3><p>${content.excerpt}</p></span>`;
    }).join('');
}

function buildHreflangTags(canonicalPath) {
    return SUPPORTED_LANGS.map(lang => {
        return `<link rel="alternate" hreflang="${lang}" href="${BASE_URL}${canonicalPath}">`;
    }).join('\n    ') + `\n    <link rel="alternate" hreflang="x-default" href="${BASE_URL}${canonicalPath}">`;
}

function buildArticleJsonLd(guide, guideData, lang = DEFAULT_LANG) {
    const content = guideData.content[lang];
    const catName = getCategoryName(guide.categoryId, lang);
    return JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: content.title,
        description: content.excerpt,
        author: {
            '@type': 'Person',
            name: guideData.author
        },
        datePublished: guideData.publishedAt,
        dateModified: guideData.updatedAt,
        image: guideData.heroImage || `${BASE_URL}/images/carspecio-social-default.webp`,
        articleSection: catName,
        keywords: (guideData.tags || []).join(', '),
        publisher: {
            '@type': 'Organization',
            name: 'CarSpecio',
            url: BASE_URL
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${BASE_URL}/${guide.htmlFile}`
        }
    }, null, 2);
}

function buildFaqPageJsonLd(guideData, lang = DEFAULT_LANG) {
    const content = guideData.content[lang];
    if (!content || !content.faq || content.faq.length === 0) return '';
    return JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: content.faq.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer
            }
        }))
    }, null, 2);
}

function buildBreadcrumbJsonLd(guide, guideData) {
    const home = t('guides.breadcrumbHome', DEFAULT_LANG) || 'Inicio';
    const guides = t('guides.breadcrumbGuides', DEFAULT_LANG) || 'Guías';
    return JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: home, item: { '@id': `${BASE_URL}/` } },
            { '@type': 'ListItem', position: 2, name: guides, item: { '@id': `${BASE_URL}/guias/index.html` } },
            { '@type': 'ListItem', position: 3, name: getCategoryName(guide.categoryId), item: { '@id': `${BASE_URL}/guias/index.html#${guide.categoryId}` } },
            { '@type': 'ListItem', position: 4, name: guideData.content[DEFAULT_LANG].title, item: { '@id': `${BASE_URL}/${guide.htmlFile}` } }
        ]
    }, null, 2);
}

let generatedCount = 0;

guideRegistry.guides.forEach(guide => {
    if (guide.status !== 'active') return;

    const guideData = loadGuideData(guide);
    if (!guideData) {
        console.warn(`  ! Skipping ${guide.id}`);
        return;
    }

    let page = template;
    const content = guideData.content[DEFAULT_LANG];
    const canonicalPath = `/${guide.htmlFile}`;
    const canonicalUrl = `${BASE_URL}${canonicalPath}`;

    // SEO (default language; JS will switch)
    const seoTitle = content.seo.title;
    const seoDesc = content.seo.description;
    const seoKeywords = content.seo.keywords.join(', ');

    page = page.replace(/\{\{seoTitle\}\}/g, seoTitle);
    page = page.replace(/\{\{seoDescription\}\}/g, seoDesc);
    page = page.replace(/\{\{seoKeywords\}\}/g, seoKeywords);
    page = page.replace(/\{\{canonicalUrl\}\}/g, canonicalUrl);
    page = page.replace(/\{\{hreflangTags\}\}/, buildHreflangTags(canonicalPath));
    const heroStyle = guideData.heroImage ? `style="background-image: url('${guideData.heroImage}')"` : '';
    page = page.replace(/style="background-image: url\('{{heroImage}}'\)"/, heroStyle);
    page = page.replace(/\{\{heroImage\}\}/g, guideData.heroImage || `${BASE_URL}/images/carspecio-social-default.webp`);

    // JSON-LD
    const articleJsonLd = buildArticleJsonLd(guide, guideData);
    const faqJsonLd = buildFaqPageJsonLd(guideData);
    const breadcrumbJsonLd = buildBreadcrumbJsonLd(guide, guideData);
    page = page.replace(/\{\{jsonLd\}\}/, articleJsonLd + (faqJsonLd ? '\n    </script>\n    <script type="application/ld+json">' + faqJsonLd : ''));
    page = page.replace(/\{\{breadcrumbJsonLd\}\}/, breadcrumbJsonLd);

    // Hero content
    const categoryName = getCategoryName(guide.categoryId);
    page = page.replace(/\{\{categoryName\}\}/g, categoryName);
    page = page.replace(/\{\{categorySlug\}\}/g, guide.categoryId);
    page = page.replace(/\{\{author\}\}/g, guideData.author);
    page = page.replace(/\{\{publishedAt\}\}/g, guideData.publishedAt);
    page = page.replace(/\{\{readingTime\}\}/g, guideData.readingTime || '');
    page = page.replace(/\{\{guideTitle\}\}/g, buildMultilingualTitle(guideData));

    // Pre-loaded data
    const dataFilePath = guide.dataFile ? `../../${guide.dataFile}` : `../../system/data/guides/${guide.id}.json`;
    page = page.replace(/\{\{dataFilePath\}\}/, dataFilePath);
    const preloadedData = JSON.stringify(guideData).replace(/</g, '\\u003c');
    page = page.replace(/"__PRELOADED_GUIDE_DATA__"/, preloadedData);

    // Summary box (multilingual)
    page = page.replace(/\{\{summaryBoxContent\}\}/, buildMultilingualSummary(guideData));

    // Key Takeaways (optional)
    const keyTakeawaysHtml = buildMultilingualKeyTakeaways(guideData);
    page = page.replace(/\{\{keyTakeaways\}\}/, keyTakeawaysHtml);

    // Table of Contents (default language; JS will rebuild for other languages)
    const tocHtml = buildMultilingualToc(guideData, DEFAULT_LANG);
    page = page.replace(/\{\{tocItems\}\}/, tocHtml);

    // Intro (multilingual)
    page = page.replace(/\{\{intro\}\}/, buildMultilingualIntro(guideData));

    // Content Sections (multilingual)
    page = page.replace(/\{\{sectionsContent\}\}/, buildMultilingualSections(guideData));

    // FAQ (multilingual)
    page = page.replace(/\{\{faqContent\}\}/, buildMultilingualFaq(guideData));

    // Freshness banner (guides > 12 months)
    let freshnessBannerHtml = '';
    const updatedDate = new Date(guideData.updatedAt);
    const monthsOld = (Date.now() - updatedDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
    if (monthsOld > 12) {
        const freshnessLabel = t('guides.freshnessWarning', DEFAULT_LANG) || 'Esta guía no se ha actualizado en más de 12 meses. Algunos datos pueden estar desactualizados.';
        freshnessBannerHtml = `<div class="freshness-banner" role="status"><svg aria-hidden="true" focusable="false" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><span>${freshnessLabel}</span></div>`;
    }
    page = page.replace(/\{\{freshnessBanner\}\}/, freshnessBannerHtml);

    // Author Block (Task 8)
    const difficultyKey = `guides.difficulty${(guideData.difficulty || 'beginner').charAt(0).toUpperCase() + (guideData.difficulty || 'beginner').slice(1)}`;
    const diffLabel = t(difficultyKey);
    const updatedLabel = t('guides.updatedOn', DEFAULT_LANG) || 'Actualizado';
    const authorEditorial = t('guides.authorEditorial', DEFAULT_LANG) || 'Contenido revisado por el equipo editorial de CarSpecio.';
    const authorBlockHtml = `<div class="author-block">
        <div class="author-block__avatar" aria-hidden="true"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M5 20c0-4 3.6-6 7-6s7 2 7 6"/></svg></div>
        <div class="author-block__info">
            <span class="author-block__name">${guideData.author}</span>
            <span class="author-block__meta"><span class="author-block__updated">${updatedLabel}: ${guideData.updatedAt}</span> · <span class="author-block__difficulty guide-card-difficulty guide-card-difficulty--${guideData.difficulty || 'beginner'}">${diffLabel}</span></span>
            <span class="author-block__editorial">${authorEditorial}</span>
        </div>
    </div>`;
    page = page.replace(/\{\{authorBlock\}\}/, authorBlockHtml);

    // Related Guides (auto or manual) — multilingual
    const relatedGuideIds = computeRelatedGuides(guide, guideData);
    const relatedGuides = resolveRelatedGuides(relatedGuideIds);
    let relatedGuideCardsHtml = '';
    relatedGuides.forEach(rg => {
        const rgData = allGuideData[rg.id];
        if (!rgData) return;
        const rgCatName = getCategoryName(rg.categoryId);
        const rgMins = rgData.readingTime ? `<span class="guide-card-reading-time">${rgData.readingTime} min</span>` : '';
        const rgDiff = rgData.difficulty ? `<span class="guide-card-difficulty guide-card-difficulty--${rgData.difficulty}">${t(`guides.difficulty${rgData.difficulty.charAt(0).toUpperCase() + rgData.difficulty.slice(1)}`)}</span>` : '';
        relatedGuideCardsHtml += `
            <a href="${rg.slug}.html" class="guide-card">
                <div class="guide-card-meta">
                    <span class="guide-card-category">${rgCatName}</span>${rgDiff}${rgMins}
                </div>
                ${buildMultilingualCardContent(rgData)}
            </a>
        `;
    });
    page = page.replace(/\{\{relatedGuideCards\}\}/, relatedGuideCardsHtml);

    // Sidebar Related Guides Widget
    let sidebarRelatedHtml = '';
    if (relatedGuides.length > 0) {
        const items = relatedGuides.slice(0, 3).map(rg => {
            const rgData = allGuideData[rg.id];
            if (!rgData) return '';
            const title = buildMultilingualTitle(rgData);
            const mins = rgData.readingTime || '';
            const minsHtml = mins ? `<span class="sidebar-related__time">${mins} min</span>` : '';
            return `<a href="${rg.slug}.html" class="sidebar-related__item">${minsHtml}<span class="sidebar-related__title">${title}</span></a>`;
        }).join('');
        sidebarRelatedHtml = `<nav class="sidebar-related" aria-label="${t('guides.relatedGuidesTitle', DEFAULT_LANG)}"><h3 class="sidebar-related__heading" data-i18n="guides.relatedGuidesTitle">${t('guides.relatedGuidesTitle', DEFAULT_LANG)}</h3>${items}</nav>`;
    }
    page = page.replace(/\{\{sidebarRelatedGuides\}\}/, sidebarRelatedHtml);

    // Completion CTA Related Link (Task 4)
    let completionRelatedLinkHtml = '';
    if (relatedGuides.length > 0) {
        const firstRg = relatedGuides[0];
        const firstRgData = allGuideData[firstRg.id];
        if (firstRgData) {
            const firstTitle = buildMultilingualTitle(firstRgData);
            const relatedGuideLabel = t('guides.completionRelated', DEFAULT_LANG) || 'Leer siguiente';
            completionRelatedLinkHtml = `<a href="${firstRg.slug}.html" class="completion-cta__btn completion-cta__btn--related">${relatedGuideLabel}: <span class="sidebar-related__title">${firstTitle}</span></a>`;
        }
    }
    page = page.replace(/\{\{completionRelatedLink\}\}/, completionRelatedLinkHtml);

    // Related Cars
    const relatedCars = resolveRelatedCars(guideData.relatedCars);
    let relatedCarCardsHtml = '';
    relatedCars.forEach(rc => {
        relatedCarCardsHtml += `
            <a href="../${rc.htmlFile}" class="car-mini-card">
                <span class="car-mini-name">${rc.name || rc.id}</span>
                <span class="car-mini-arrow" aria-hidden="true">→</span>
            </a>
        `;
    });
    page = page.replace(/\{\{relatedCarCards\}\}/, relatedCarCardsHtml);

    // Footer category links
    let footerCategoriesHtml = '';
    guideRegistry.categories.forEach(cat => {
        const catName = getCategoryName(cat.id);
        footerCategoriesHtml += `<a href="index.html#${cat.id}"><span aria-hidden="true">${cat.icon}</span> ${catName}</a>`;
    });
    page = page.replace(/\{\{footerCategoryLinks\}\}/, footerCategoriesHtml);

    // Write output
    const outputPath = path.join(OUTPUT_DIR, path.basename(guide.htmlFile));
    fs.writeFileSync(outputPath, page, 'utf8');

    generatedCount++;
    console.log(`  + ${guide.htmlFile} -> ${content.title}`);
});

console.log(`\nDone! Generated ${generatedCount} guide pages in ${OUTPUT_DIR}`);
