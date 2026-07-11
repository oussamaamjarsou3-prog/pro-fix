/**
 * CarSpecio -- News Page Generator
 * Generates html/noticias.html and html/noticias/*.html from templates
 */

const fs = require('fs');
const path = require('path');
const { BASE_URL } = require('../config');

const NEWS_PATH = path.join(__dirname, '../data/news.json');
const ARTICLES_DATA_DIR = path.join(__dirname, '../data/noticias');
const INDEX_TEMPLATE_PATH = path.join(__dirname, '../templates/news-template.html');
const MAGAZINE_TEMPLATE_PATH = path.join(__dirname, '../templates/news-magazine-template.html');
const OUTPUT_DIR = path.join(__dirname, '../../html');
const ARTICLES_DIR = path.join(OUTPUT_DIR, 'noticias');

const SUPPORTED_LANGS = ['es', 'en', 'fr', 'ar'];
const DATE_LOCALES = { es: 'es-ES', en: 'en-GB', fr: 'fr-FR', ar: 'ar-SA' };
const UI_LABELS = {
    es: { readMore: 'Leer más →', toc: 'Contenido', readingTime: 'min de lectura', sourcePrefix: 'Basado en', author: 'Por CarSpecio Editorial', opinion: 'Opinión CarSpecio', relatedCars: 'Coches relacionados', relatedNews: 'Noticias relacionadas', newsletterTitle: 'Recibe las mejores noticias del motor', newsletterDesc: 'Un resumen semanal de lanzamientos, reviews y comparativas en tu correo.', newsletterPlaceholder: 'Tu correo electrónico', newsletterSubmit: 'Suscribirse', reviewLink: 'Ver review en CarSpecio →', reviewLinkExternal: 'Ver fuente original →' },
    en: { readMore: 'Read more →', toc: 'Contents', readingTime: 'min read', sourcePrefix: 'Based on', author: 'By CarSpecio Editorial', opinion: 'CarSpecio Opinion', relatedCars: 'Related cars', relatedNews: 'Related news', newsletterTitle: 'Get the best car news', newsletterDesc: 'A weekly roundup of launches, reviews and comparisons in your inbox.', newsletterPlaceholder: 'Your email address', newsletterSubmit: 'Subscribe', reviewLink: 'Read CarSpecio review →', reviewLinkExternal: 'View original source →' },
    fr: { readMore: 'Lire la suite →', toc: 'Contenu', readingTime: 'min de lecture', sourcePrefix: 'Basé sur', author: 'Par CarSpecio Editorial', opinion: 'Opinion CarSpecio', relatedCars: 'Voitures liées', relatedNews: 'Actualités liées', newsletterTitle: 'Recevez les meilleures actualités auto', newsletterDesc: 'Un résumé hebdomadaire des lancements, essais et comparatifs dans votre boîte mail.', newsletterPlaceholder: 'Votre adresse e-mail', newsletterSubmit: 'S\'abonner', reviewLink: 'Voir l\'essai CarSpecio →', reviewLinkExternal: 'Voir la source originale →' },
    ar: { readMore: '← اقرأ المزيد', toc: 'المحتويات', readingTime: 'دقيقة قراءة', sourcePrefix: 'استناداً إلى', author: 'بواسطة تحرير CarSpecio', opinion: 'رأي CarSpecio', relatedCars: 'سيارات ذات صلة', relatedNews: 'أخبار ذات صلة', newsletterTitle: 'احصل على أفضل أخبار السيارات', newsletterDesc: 'ملخص أسبوعي للإطلاقات والمراجعات والمقارنات في صندوق الوارد الخاص بك.', newsletterPlaceholder: 'عنوان بريدك الإلكتروني', newsletterSubmit: 'اشترك', reviewLink: '← اقرأ مراجعة CarSpecio', reviewLinkExternal: '← عرض المصدر الأصلي' }
};

const newsData = JSON.parse(fs.readFileSync(NEWS_PATH, 'utf8'));
const indexTemplate = fs.readFileSync(INDEX_TEMPLATE_PATH, 'utf8');
const magazineTemplate = fs.readFileSync(MAGAZINE_TEMPLATE_PATH, 'utf8');

function loadArticles() {
    const files = fs.readdirSync(ARTICLES_DATA_DIR).filter(f => f.endsWith('.json'));
    const articles = files.map(file => {
        return JSON.parse(fs.readFileSync(path.join(ARTICLES_DATA_DIR, file), 'utf8'));
    });
    articles.sort((a, b) => new Date(b.date) - new Date(a.date));
    return articles;
}

newsData.articles = loadArticles();

function getSource(id) {
    return newsData.sources.find(s => s.id === id) || { name: id, flag: '', url: '#' };
}

function formatDate(dateStr, lang = 'es') {
    const d = new Date(dateStr);
    return d.toLocaleDateString(DATE_LOCALES[lang] || 'es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
}

function getArticleLang(article, lang) {
    if (article.translations && article.translations[lang]) return article.translations[lang];
    if (article.translations && article.translations.es) return article.translations.es;
    return article;
}

function wrapLangContent(html, lang, isDefault = false) {
    return `<div class="lang-block" data-lang="${lang}"${isDefault ? '' : ' hidden'}>${html}</div>`;
}

function buildNewsCards() {
    return SUPPORTED_LANGS.map((lang, idx) => {
        const labels = UI_LABELS[lang];
        const cards = newsData.articles.map(article => {
            const data = getArticleLang(article, lang);
            const source = getSource(article.source);
            const imageHtml = article.image ? `<img class="news-card-image" src="${article.image}" alt="${data.title}" loading="lazy">` : '';
            const articleUrl = `noticias/${article.slug}.html`;
            return `
            <article class="news-card${article.image ? '' : ' news-card--no-image'}" data-category="${article.category}">
                <a href="${articleUrl}" class="news-card-link" aria-label="${data.title}">
                    ${imageHtml}
                </a>
                <div class="news-card-body">
                    <div class="news-card-meta">
                        <span class="news-card-category">${article.category}</span>
                        <span class="news-card-source"><span>${source.flag}</span> ${source.name}</span>
                        <span>${formatDate(article.date, lang)}</span>
                    </div>
                    <h2><a href="${articleUrl}">${data.title}</a></h2>
                    <p class="news-card-excerpt">${data.excerpt}</p>
                    <div class="news-card-footer">
                        <div class="news-card-tags">${article.tags.map(t => `<span class="news-card-tag">${t}</span>`).join('')}</div>
                        <a href="${articleUrl}" class="news-card-read">${labels.readMore}</a>
                    </div>
                </div>
            </article>`;
        }).join('');
        return wrapLangContent(`<div class="news-grid">${cards}</div>`, lang, idx === 0);
    }).join('');
}

function buildToc(sections) {
    if (!sections || !sections.length) return '';
    return '<ul>' + sections.map(s => `<li><a href="#${s.id}">${s.heading}</a></li>`).join('') + '</ul>';
}

function buildSections(sections) {
    if (!sections || !sections.length) return '';
    return sections.map(s => {
        const paragraphs = (s.paragraphs || []).map(p => `<p>${p}</p>`).join('\n');
        return `<section class="magazine-section" id="${s.id}">\n            <h2>${s.heading}</h2>\n            ${paragraphs}\n        </section>`;
    }).join('\n');
}

function buildStats(stats) {
    if (!stats || !stats.length) return '';
    return `<div class="magazine-stats">\n            ${stats.map(s => `<div class="stat-card"><span class="stat-value">${s.value}</span><span class="stat-label">${s.label}</span></div>`).join('\n')}\n        </div>`;
}

function buildTimeline(timeline) {
    if (!timeline || !timeline.length) return '';
    const items = timeline.map(t => `<li class="timeline-item"><div class="timeline-date">${t.date}</div><div class="timeline-title">${t.title}</div><div class="timeline-desc">${t.desc}</div></li>`).join('\n');
    return `<div class="magazine-timeline"><h4>Hitos</h4><ul class="timeline-list">${items}</ul></div>`;
}

function buildInfoBox(box) {
    if (!box) return '';
    return `<div class="magazine-info-card"><h4>${box.title}</h4><p>${box.text}</p></div>`;
}

function buildWarningBox(box) {
    if (!box) return '';
    return `<div class="magazine-warning"><h4>${box.title}</h4><p>${box.text}</p></div>`;
}

function buildQuote(quote) {
    if (!quote) return '';
    return `<blockquote class="magazine-quote"><p>${quote.text}</p><cite>${quote.author}</cite></blockquote>`;
}

function buildOpinion(opinion, labels) {
    if (!opinion) return '';
    return `<section class="magazine-opinion"><h2>${labels.opinion}</h2><p>${opinion}</p></section>`;
}

function buildRelatedCars(cars, labels) {
    if (!cars || !cars.length) return '';
    const cards = cars.map(c => `<a href="../${c.slug}.html" class="related-card"><img src="${c.image}" alt="${c.name}" loading="lazy"><div class="related-card-body"><h3>${c.name}</h3><span>Ver ficha</span></div></a>`).join('\n');
    return `<section class="magazine-related"><h2>${labels.relatedCars}</h2><div class="related-grid">${cards}</div></section>`;
}

function buildRelatedNews(article, ids, lang) {
    if (!ids || !ids.length) return '';
    const related = ids.map(id => newsData.articles.find(a => a.id === id || a.slug === id)).filter(Boolean);
    if (!related.length) return '';
    const labels = UI_LABELS[lang];
    const cards = related.map(a => {
        const data = getArticleLang(a, lang);
        const image = a.image ? `<img src="${a.image}" alt="${data.title}" loading="lazy">` : '';
        return `<a href="${a.slug}.html" class="related-card">${image}<div class="related-card-body"><h3>${data.title}</h3><span>${formatDate(a.date, lang)}</span></div></a>`;
    }).join('\n');
    return `<section class="magazine-related"><h2>${labels.relatedNews}</h2><div class="related-grid">${cards}</div></section>`;
}

function buildNewsletter(labels) {
    if (!labels) {
        labels = UI_LABELS['es'];
    }
    return `<section class="magazine-newsletter"><h2>${labels.newsletterTitle}</h2><p>${labels.newsletterDesc}</p><form class="newsletter-form" onsubmit="return false;"><input type="email" placeholder="${labels.newsletterPlaceholder}" aria-label="${labels.newsletterPlaceholder}"><button type="submit">${labels.newsletterSubmit}</button></form></section>`;
}

function buildPreviousModel(prev) {
    if (!prev) return '';
    return `<div class="news-previous-model"><h4>Generación anterior</h4><div class="previous-model-name">${prev.name}</div>${prev.year ? `<div class="previous-model-year">${prev.year}</div>` : ''}<p class="previous-model-summary">${prev.summary}</p></div>`;
}

function buildWhatChanged(items) {
    if (!items || !items.length) return '';
    const list = items.map(i => `<li><strong>${i.title}</strong> ${i.text}</li>`).join('\n');
    return `<div class="news-what-changed"><h4>Qué cambia frente al modelo anterior</h4><ul class="news-what-changed-list">${list}</ul></div>`;
}

function buildNewTechnology(items) {
    if (!items || !items.length) return '';
    const paragraphs = items.map(t => `<p>${t}</p>`).join('\n');
    return `<div class="news-new-tech"><h4>Nueva tecnología</h4>${paragraphs}</div>`;
}

function buildMarketContext(text) {
    if (!text) return '';
    return `<div class="news-market-context"><h4>Contexto de mercado</h4><p>${text}</p></div>`;
}

function buildPricing(pricing) {
    if (!pricing) return '';
    const market = pricing.market ? `<div class="pricing-row"><span class="pricing-label">Mercado:</span> <span class="pricing-value">${pricing.market}</span></div>` : '';
    const availability = pricing.availability ? `<div class="pricing-row"><span class="pricing-label">Disponibilidad:</span> <span class="pricing-value">${pricing.availability}</span></div>` : '';
    const note = pricing.note ? `<p class="pricing-note">${pricing.note}</p>` : '';
    return `<div class="news-pricing"><h4>Precio y disponibilidad</h4><div class="pricing-price">${pricing.price}</div>${market}${availability}${note}</div>`;
}

function buildProsCons(prosCons) {
    if (!prosCons || (!prosCons.pros?.length && !prosCons.cons?.length)) return '';
    const pros = prosCons.pros?.length ? `<ul class="pros-cons-list pros-cons-pros">${prosCons.pros.map(p => `<li>${p}</li>`).join('\n')}</ul>` : '';
    const cons = prosCons.cons?.length ? `<ul class="pros-cons-list pros-cons-cons">${prosCons.cons.map(c => `<li>${c}</li>`).join('\n')}</ul>` : '';
    return `<div class="news-pros-cons"><h4>Pros / Contras</h4><div class="pros-cons-grid">${pros}${cons}</div></div>`;
}

function buildInBrief(items) {
    if (!items || !items.length) return '';
    const list = items.map(i => `<li>${i}</li>`).join('\n');
    return `<div class="news-in-brief"><h4>En resumen</h4><ul>${list}</ul></div>`;
}

function buildMainImage(article, data) {
    if (!article.image) return '';
    const src = article.image;
    const caption = data.imageCaption ? `<figcaption>${data.imageCaption}</figcaption>` : '';
    return `<figure class="article-main-image"><img src="${src}" alt="${data.title}" loading="lazy">${caption}</figure>`;
}

function buildHero() {
    return SUPPORTED_LANGS.map((lang, idx) => {
        const t = newsData.meta.translations?.[lang] || {};
        const title = t.title || newsData.meta.title;
        const description = t.description || newsData.meta.description;
        const html = `
            <div class="section-title">
                <span>NEWS</span>
                <h1>${title}</h1>
                <p>${description}</p>
            </div>
        `;
        return wrapLangContent(html, lang, idx === 0);
    }).join('');
}

function buildFilters() {
    const filters = ['all', 'lanzamientos', 'rendimiento', 'eléctricos', 'tecnología'];
    return SUPPORTED_LANGS.map((lang, idx) => {
        const t = newsData.meta.translations?.[lang] || {};
        const filterLabels = t.filters || {};
        const buttons = filters.map((f, i) => {
            const label = filterLabels[f] || f;
            return `<button class="news-filter${i === 0 ? ' active' : ''}" data-filter="${f}">${label}</button>`;
        }).join('\n');
        return wrapLangContent(`<div class="news-filters">${buttons}</div>`, lang, idx === 0);
    }).join('');
}

function buildIndexPage() {
    const titles = SUPPORTED_LANGS.reduce((acc, lang) => {
        const t = newsData.meta.translations?.[lang] || {};
        acc[lang] = t.title || newsData.meta.title;
        return acc;
    }, {});

    let page = indexTemplate;
    page = page.replace(/\{\{title\}\}/g, newsData.meta.title);
    page = page.replace(/\{\{description\}\}/g, newsData.meta.description);
    page = page.replace(/\{\{canonicalUrl\}\}/g, `${BASE_URL}/noticias.html`);
    page = page.replace(/\{\{ogImage\}\}/g, `${BASE_URL}/images/placeholder.svg`);
    page = page.replace(/\{\{hero\}\}/g, buildHero());
    page = page.replace(/\{\{filters\}\}/g, buildFilters());
    page = page.replace(/\{\{newsCards\}\}/g, buildNewsCards());
    page = page.replace(/\{\{newsTitles\}\}/g, JSON.stringify(titles).replace(/</g, '\\u003c'));

    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    fs.writeFileSync(path.join(OUTPUT_DIR, 'noticias.html'), page, 'utf8');
    console.log('✅ Generated html/noticias.html');
}

function buildArticleContent(article, lang) {
    const data = getArticleLang(article, lang);
    const labels = UI_LABELS[lang];
    const source = getSource(article.source);
    const relatedCar = article.relatedCars && article.relatedCars[0];
    const reviewUrl = relatedCar ? `../${relatedCar.slug}.html` : article.externalUrl;
    const reviewTarget = relatedCar ? '' : ' target="_blank" rel="noopener noreferrer"';
    const reviewLabel = relatedCar ? labels.reviewLink : labels.reviewLinkExternal;
    const reviewAria = relatedCar ? labels.reviewLink : `${labels.reviewLinkExternal} ${source.name}`;
    const sections = data.sections || [];
    const toc = buildToc(sections);
    const content = buildSections(sections);
    const stats = buildStats(data.stats);
    const timeline = buildTimeline(data.timeline);
    const infoBox = buildInfoBox(data.infoBox);
    const warningBox = buildWarningBox(data.warningBox);
    const quote = buildQuote(data.quote);
    const opinion = buildOpinion(data.opinion, labels);
    const mainImage = buildMainImage(article, data);

    const inBrief = buildInBrief(data.inBrief);
    const previousModel = buildPreviousModel(data.previousModel);
    const whatChanged = buildWhatChanged(data.whatChanged);
    const newTechnology = buildNewTechnology(data.newTechnology);
    const marketContext = buildMarketContext(data.marketContext);
    const pricing = buildPricing(data.pricing);
    const prosCons = buildProsCons(data.prosCons);

    const fullContent = `${inBrief}\n${previousModel}\n${whatChanged}\n${content}\n${newTechnology}\n${marketContext}\n${pricing}\n${prosCons}\n${stats}\n${timeline}\n${infoBox}\n${warningBox}\n${quote}`;

    return `
        <header class="article-header">
            <div class="article-meta">
                <span class="article-category">${article.category}</span>
                <span class="article-reading-time">${article.readingTime || 5} ${labels.readingTime}</span>
            </div>
            <h1 class="article-title">${data.title}</h1>
            <p class="article-subtitle">${data.subtitle || ''}</p>
        </header>

        ${mainImage}

        <div class="article-byline article-byline-post-image">
            <div class="article-author">
                <span class="author-avatar">CS</span>
                <div class="author-info">
                    <strong>${labels.author}</strong>
                    <time datetime="${article.date}">${formatDate(article.date, lang)}</time>
                </div>
            </div>
            <a href="${reviewUrl}" class="article-source"${reviewTarget} aria-label="${reviewAria}">
                <span>${source.flag}</span>
                <span>${reviewLabel}</span>
            </a>
        </div>

        <div class="article-frame">
            <div class="article-layout">
                <aside class="article-toc" aria-label="${labels.toc}">
                    <div class="toc-sticky">
                        <h2>${labels.toc}</h2>
                        <nav>${toc}</nav>
                    </div>
                </aside>

                <div class="article-body">
                    <p class="article-lead">${data.excerpt}</p>
                    ${fullContent}
                </div>
            </div>

            ${opinion}
        </div>
    `;
}

function buildArticlePage(article) {
    const source = getSource(article.source);
    const defaultData = getArticleLang(article, 'es');

    const articleContent = SUPPORTED_LANGS.map((lang, idx) => {
        const html = buildArticleContent(article, lang);
        return wrapLangContent(html, lang, idx === 0);
    }).join('\n');

    const relatedCars = SUPPORTED_LANGS.map((lang, idx) => {
        return wrapLangContent(buildRelatedCars(article.relatedCars, UI_LABELS[lang]), lang, idx === 0);
    }).join('\n');

    const relatedNews = SUPPORTED_LANGS.map((lang, idx) => {
        return wrapLangContent(buildRelatedNews(article, article.relatedNews, lang), lang, idx === 0);
    }).join('\n');

    const newsletter = SUPPORTED_LANGS.map((lang, idx) => {
        return wrapLangContent(buildNewsletter(UI_LABELS[lang]), lang, idx === 0);
    }).join('\n');

    const articleTitles = SUPPORTED_LANGS.reduce((acc, lang) => {
        acc[lang] = getArticleLang(article, lang).title || defaultData.title;
        return acc;
    }, {});

    let page = magazineTemplate;
    page = page.replace(/\{\{title\}\}/g, defaultData.title);
    page = page.replace(/\{\{excerpt\}\}/g, defaultData.excerpt);
    page = page.replace(/\{\{canonicalUrl\}\}/g, `${BASE_URL}/noticias/${article.slug}.html`);
    page = page.replace(/\{\{ogImage\}\}/g, article.image ? `${BASE_URL}/${article.image.replace('../', '')}` : `${BASE_URL}/images/placeholder.svg`);
    page = page.replace(/\{\{category\}\}/g, article.category);
    page = page.replace(/\{\{sourceFlag\}\}/g, source.flag);
    page = page.replace(/\{\{sourceName\}\}/g, source.name);
    page = page.replace(/\{\{date\}\}/g, formatDate(article.date));
    page = page.replace(/\{\{dateIso\}\}/g, article.date);
    page = page.replace(/\{\{readingTime\}\}/g, article.readingTime || 5);
    page = page.replace(/\{\{articleContent\}\}/g, articleContent);
    page = page.replace(/\{\{articleTitles\}\}/g, JSON.stringify(articleTitles).replace(/</g, '\\u003c'));
    page = page.replace(/\{\{relatedCars\}\}/g, relatedCars);
    page = page.replace(/\{\{relatedNews\}\}/g, relatedNews);
    page = page.replace(/\{\{newsletter\}\}/g, newsletter);
    page = page.replace(/\{\{tags\}\}/g, article.tags.join(', '));
    page = page.replace(/\{\{externalUrl\}\}/g, article.externalUrl);

    if (!fs.existsSync(ARTICLES_DIR)) {
        fs.mkdirSync(ARTICLES_DIR, { recursive: true });
    }
    fs.writeFileSync(path.join(ARTICLES_DIR, `${article.slug}.html`), page, 'utf8');
    console.log(`✅ Generated html/noticias/${article.slug}.html`);
}

function buildAll() {
    buildIndexPage();
    newsData.articles.forEach(buildArticlePage);
}

buildAll();
