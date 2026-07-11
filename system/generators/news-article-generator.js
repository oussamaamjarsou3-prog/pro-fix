/* CarSpecio — News Article Page Generator */
/* Generates HTML article pages from news JSON files */
/* Run: node system/generators/news-article-generator.js */

const fs = require('fs');
const path = require('path');

const newsDir = path.join(__dirname, '../data/noticias');
const outputDir = path.join(__dirname, '../../html/noticias');

const files = fs.readdirSync(newsDir).filter(f => f.endsWith('.json') && !f.endsWith('.backup.json'));

let generated = 0;

files.forEach(file => {
    const data = JSON.parse(fs.readFileSync(path.join(newsDir, file), 'utf8'));
    const slug = data.slug || data.id;
    const outputPath = path.join(outputDir, slug + '.html');

    // Skip if HTML already exists and is newer than JSON
    if (fs.existsSync(outputPath)) {
        const jsonMtime = fs.statSync(path.join(newsDir, file)).mtimeMs;
        const htmlMtime = fs.statSync(outputPath).mtimeMs;
        if (htmlMtime > jsonMtime) {
            console.log('⏭️  ' + slug + '.html (already up to date)');
            return;
        }
    }

    const html = generateArticleHTML(data);
    fs.writeFileSync(outputPath, html);
    console.log('✅ ' + slug + '.html');
    generated++;
});

console.log('\n📊 Generated: ' + generated + ' pages');

function esc(s) {
    return (s || '').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function generateArticleHTML(data) {
    const slug = data.slug || data.id;
    const langs = ['es', 'en', 'fr', 'ar'];
    const titles = {};
    langs.forEach(l => { titles[l] = data.translations?.[l]?.title || data.title || ''; });

    const langBlocks = langs.map(lang => {
        const t = data.translations?.[lang];
        if (!t) return '';
        const hidden = lang === 'es' ? '' : ' hidden';
        const readMore = { es: 'Leer más →', en: 'Read more →', fr: 'Lire la suite →', ar: '← اقرأ المزيد' };
        const contentsLabel = { es: 'Contenido', en: 'Contents', fr: 'Sommaire', ar: 'المحتويات' };
        const byLabel = { es: 'Por', en: 'By', fr: 'Par', ar: 'بواسطة' };
        const minRead = { es: 'min de lectura', en: 'min read', fr: 'min de lecture', ar: 'دقائق قراءة' };
        const reviewLabel = { es: 'Ver review en CarSpecio →', en: 'Read CarSpecio review →', fr: "Voir l'essai CarSpecio →", ar: 'عرض مراجعة CarSpecio →' };
        const opinionLabel = { es: 'Opinión CarSpecio', en: 'CarSpecio Opinion', fr: 'Avis CarSpecio', ar: 'رأي CarSpecio' };
        const relatedLabel = { es: 'Coches relacionados', en: 'Related cars', fr: 'Voitures liées', ar: 'سيارات ذات صلة' };
        const viewReview = { es: 'Ver ficha', en: 'View review', fr: "Voir l'essai", ar: 'عرض المراجعة' };
        const relatedNewsLabel = { es: 'Noticias relacionadas', en: 'Related news', fr: 'Actualités liées', ar: 'أخبار ذات صلة' };
        const newsletterTitle = { es: 'Recibe las mejores noticias del motor', en: 'Get the best car news', fr: 'Recevez les meilleures actualités auto', ar: 'احصل على أفضل أخبار السيارات' };
        const newsletterDesc = { es: 'Un resumen semanal de lanzamientos, reviews y comparativas en tu correo.', en: 'A weekly roundup of launches, reviews and comparisons in your inbox.', fr: 'Un résumé hebdomadaire des lancements, essais et comparatifs dans votre boîte mail.', ar: 'ملخص أسبوعي للإطلاقات والمراجعات والمقارنات في صندوق الوارد الخاص بك.' };
        const emailPlaceholder = { es: 'Tu correo electrónico', en: 'Your email address', fr: 'Votre adresse e-mail', ar: 'عنوان بريدك الإلكتروني' };
        const subscribeBtn = { es: 'Suscribirse', en: 'Subscribe', fr: "S'abonner", ar: 'اشترك' };

        // Sections
        const tocItems = (t.sections || []).map(s => '<li><a href="#' + s.id + '">' + esc(s.heading) + '</a></li>').join('');
        const sectionsHtml = (t.sections || []).map(s => {
            const paras = (s.paragraphs || []).map(p => '<p>' + p + '</p>').join('');
            return '<section class="magazine-section" id="' + s.id + '"><h2>' + esc(s.heading) + '</h2>' + paras + '</section>';
        }).join('\n');

        // In brief
        const inBriefHtml = t.inBrief ? '<div class="news-in-brief"><h4>' + ({es:'En resumen',en:'In short',fr:'En bref',ar:'باختصار'}[lang]) + '</h4><ul><li>' + t.inBrief.map(esc).join('</li>\n<li>') + '</li></ul></div>' : '';

        // Previous model
        const prevModelHtml = t.previousModel ? '<div class="news-previous-model"><h4>' + ({es:'Generación anterior',en:'Previous generation',fr:'Génération précédente',ar:'الجيل السابق'}[lang]) + '</h4><div class="previous-model-name">' + esc(t.previousModel.name) + '</div><div class="previous-model-year">' + esc(t.previousModel.year) + '</div><p class="previous-model-summary">' + t.previousModel.summary + '</p></div>' : '';

        // What changed
        const whatChangedHtml = t.whatChanged ? '<div class="news-what-changed"><h4>' + ({es:'Qué cambia frente al modelo anterior',en:'What changes from the previous model',fr:'Ce qui change par rapport au modèle précédent',ar:'ما الذي تغير عن النموذج السابق'}[lang]) + '</h4><ul class="news-what-changed-list">' + t.whatChanged.map(w => '<li><strong>' + esc(w.title) + '</strong> ' + w.text + '</li>').join('\n') + '</ul></div>' : '';

        // New technology
        const newTechHtml = t.newTechnology ? '<div class="news-new-tech"><h4>' + ({es:'Nueva tecnología',en:'New technology',fr:'Nouvelle technologie',ar:'تقنية جديدة'}[lang]) + '</h4>' + t.newTechnology.map(p => '<p>' + p + '</p>').join('\n') + '</div>' : '';

        // Market context
        const marketHtml = t.marketContext ? '<div class="news-market-context"><h4>' + ({es:'Contexto de mercado',en:'Market context',fr:'Contexte de marché',ar:'سياق السوق'}[lang]) + '</h4><p>' + t.marketContext + '</p></div>' : '';

        // Pricing
        const pricingHtml = t.pricing ? '<div class="news-pricing"><h4>' + ({es:'Precio y disponibilidad',en:'Pricing and availability',fr:'Prix et disponibilité',ar:'السعر والتوفر'}[lang]) + '</h4><div class="pricing-price">' + esc(t.pricing.price) + '</div>' +
            (t.pricing.market ? '<div class="pricing-row"><span class="pricing-label">' + ({es:'Mercado:',en:'Market:',fr:'Marché :',ar:'السوق:'}[lang]) + '</span> <span class="pricing-value">' + esc(t.pricing.market) + '</span></div>' : '') +
            (t.pricing.availability ? '<div class="pricing-row"><span class="pricing-label">' + ({es:'Disponibilidad:',en:'Availability:',fr:'Disponibilité :',ar:'التوفر:'}[lang]) + '</span> <span class="pricing-value">' + esc(t.pricing.availability) + '</span></div>' : '') +
            (t.pricing.note ? '<p class="pricing-note">' + t.pricing.note + '</p>' : '') +
            '</div>' : '';

        // Pros/cons
        const prosConsHtml = t.prosCons ? '<div class="news-pros-cons"><h4>Pros / ' + ({es:'Contras',en:'Cons',fr:'Cons',ar:'العيوب'}[lang]) + '</h4><div class="pros-cons-grid"><ul class="pros-cons-list pros-cons-pros">' + (t.prosCons.pros||[]).map(p => '<li>' + p + '</li>').join('\n') + '</ul><ul class="pros-cons-list pros-cons-cons">' + (t.prosCons.cons||[]).map(c => '<li>' + c + '</li>').join('\n') + '</ul></div></div>' : '';

        // Stats
        const statsHtml = t.stats ? '<div class="magazine-stats">' + t.stats.map(s => '<div class="stat-card"><span class="stat-value">' + esc(s.value) + '</span><span class="stat-label">' + esc(s.label) + '</span></div>').join('\n') + '</div>' : '';

        // Timeline
        const timelineHtml = t.timeline ? '<div class="magazine-timeline"><h4>' + ({es:'Hitos',en:'Milestones',fr:'Jalons',ar:'محطات'}[lang]) + '</h4><ul class="timeline-list">' + t.timeline.map(tl => '<li class="timeline-item"><div class="timeline-date">' + esc(tl.date) + '</div><div class="timeline-title">' + esc(tl.title) + '</div><div class="timeline-desc">' + tl.desc + '</div></li>').join('\n') + '</ul></div>' : '';

        // Key fact
        const keyFactHtml = t.keyFact ? '<div class="magazine-info-card"><h4>' + ({es:'Dato clave',en:'Key fact',fr:'Fait clé',ar:'حقيقة أساسية'}[lang]) + '</h4><p>' + t.keyFact + '</p></div>' : '';

        // Quote
        const quoteHtml = t.quote ? '<blockquote class="magazine-quote"><p>' + t.quote.text + '</p><cite>' + esc(t.quote.cite) + '</cite></blockquote>' : '';

        // Related cars
        const relatedCarsHtml = (data.relatedCars || []).map(rc => '<a href="../' + rc.slug + '.html" class="related-card"><img src="' + rc.image + '" alt="' + esc(rc.name) + '" loading="lazy"><div class="related-card-body"><h3>' + esc(rc.name) + '</h3><span>' + viewReview[lang] + '</span></div></a>').join('');

        // Related news
        const relatedNewsHtml = (data.relatedNews || []).map(rnSlug => {
            const rnFile = path.join(newsDir, rnSlug + '.json');
            if (!fs.existsSync(rnFile)) return '';
            const rn = JSON.parse(fs.readFileSync(rnFile, 'utf8'));
            const rnTitle = rn.translations?.[lang]?.title || rn.translations?.es?.title || '';
            return '<a href="' + rnSlug + '.html" class="related-card"><img src="' + (rn.image||'') + '" alt="' + esc(rnTitle) + '" loading="lazy"><div class="related-card-body"><h3>' + esc(rnTitle) + '</h3><span>' + formatDate(rn.date, lang) + '</span></div></a>';
        }).join('\n');

        const dateStr = formatDate(data.date, lang);

        return '<div class="lang-block" data-lang="' + lang + '"' + hidden + '>\n' +
        '        <header class="article-header">\n' +
        '            <div class="article-meta">\n' +
        '                <span class="article-category">' + (data.category||'') + '</span>\n' +
        '                <span class="article-reading-time">' + (data.readingTime||5) + ' ' + minRead[lang] + '</span>\n' +
        '            </div>\n' +
        '            <h1 class="article-title">' + esc(t.title) + '</h1>\n' +
        '            <p class="article-subtitle">' + t.subtitle + '</p>\n' +
        '        </header>\n\n' +
        '        <figure class="article-main-image"><img src="' + (data.image||'') + '" alt="' + esc(t.title) + '" loading="lazy"><figcaption>' + esc(t.imageCaption||'') + '</figcaption></figure>\n\n' +
        '        <div class="article-byline article-byline-post-image">\n' +
        '            <div class="article-author">\n' +
        '                <span class="author-avatar">CS</span>\n' +
        '                <div class="author-info">\n' +
        '                    <strong>' + byLabel[lang] + ' CarSpecio Editorial</strong>\n' +
        '                    <time datetime="' + data.date + '">' + dateStr + '</time>\n' +
        '                </div>\n' +
        '            </div>\n' +
        (data.relatedCars && data.relatedCars.length ? '            <a href="../' + data.relatedCars[0].slug + '.html" class="article-source" aria-label="' + esc(reviewLabel[lang]) + '">\n                <span>🇩🇪</span>\n                <span>' + reviewLabel[lang] + '</span>\n            </a>\n' : '') +
        '        </div>\n\n' +
        '        <div class="article-frame">\n' +
        '            <div class="article-layout">\n' +
        '                <aside class="article-toc" aria-label="' + esc(contentsLabel[lang]) + '">\n' +
        '                    <div class="toc-sticky">\n' +
        '                        <h2>' + contentsLabel[lang] + '</h2>\n' +
        '                        <nav><ul>' + tocItems + '</ul></nav>\n' +
        '                    </div>\n' +
        '                </aside>\n\n' +
        '                <div class="article-body">\n' +
        '                    <p class="article-lead">' + t.excerpt + '</p>\n' +
        inBriefHtml + '\n' +
        prevModelHtml + '\n' +
        whatChangedHtml + '\n' +
        sectionsHtml + '\n' +
        newTechHtml + '\n' +
        marketHtml + '\n' +
        pricingHtml + '\n' +
        prosConsHtml + '\n' +
        statsHtml + '\n' +
        timelineHtml + '\n' +
        keyFactHtml + '\n\n' +
        quoteHtml + '\n' +
        '                </div>\n' +
        '            </div>\n\n' +
        '            <section class="magazine-opinion"><h2>' + opinionLabel[lang] + '</h2><p>' + t.opinion + '</p></section>\n' +
        '        </div>\n' +
        '    </div>';
    }).join('\n');

    // Related cars section (all langs)
    const relatedSections = langs.map(lang => {
        const hidden = lang === 'es' ? '' : ' hidden';
        const relatedLabel = { es: 'Coches relacionados', en: 'Related cars', fr: 'Voitures liées', ar: 'سيارات ذات صلة' };
        const viewReview = { es: 'Ver ficha', en: 'View review', fr: "Voir l'essai", ar: 'عرض المراجعة' };
        const relatedNewsLabel = { es: 'Noticias relacionadas', en: 'Related news', fr: 'Actualités liées', ar: 'أخبار ذات صلة' };
        const newsletterTitle = { es: 'Recibe las mejores noticias del motor', en: 'Get the best car news', fr: 'Recevez les meilleures actualités auto', ar: 'احصل على أفضل أخبار السيارات' };
        const newsletterDesc = { es: 'Un resumen semanal de lanzamientos, reviews y comparativas en tu correo.', en: 'A weekly roundup of launches, reviews and comparisons in your inbox.', fr: 'Un résumé hebdomadaire des lancements, essais et comparatifs dans votre boîte mail.', ar: 'ملخص أسبوعي للإطلاقات والمراجعات والمقارنات في صندوق الوارد الخاص بك.' };
        const emailPlaceholder = { es: 'Tu correo electrónico', en: 'Your email address', fr: 'Votre adresse e-mail', ar: 'عنوان بريدك الإلكتروني' };
        const subscribeBtn = { es: 'Suscribirse', en: 'Subscribe', fr: "S'abonner", ar: 'اشترك' };

        const relatedCarsHtml = (data.relatedCars || []).map(rc => '<a href="../' + rc.slug + '.html" class="related-card"><img src="' + rc.image + '" alt="' + esc(rc.name) + '" loading="lazy"><div class="related-card-body"><h3>' + esc(rc.name) + '</h3><span>' + viewReview[lang] + '</span></div></a>').join('');

        const relatedNewsHtml = (data.relatedNews || []).map(rnSlug => {
            const rnFile = path.join(newsDir, rnSlug + '.json');
            if (!fs.existsSync(rnFile)) return '';
            const rn = JSON.parse(fs.readFileSync(rnFile, 'utf8'));
            const rnTitle = rn.translations?.[lang]?.title || rn.translations?.es?.title || '';
            return '<a href="' + rnSlug + '.html" class="related-card"><img src="' + (rn.image||'') + '" alt="' + esc(rnTitle) + '" loading="lazy"><div class="related-card-body"><h3>' + esc(rnTitle) + '</h3><span>' + formatDate(rn.date, lang) + '</span></div></a>';
        }).join('\n');

        return '<div class="lang-block" data-lang="' + lang + '"' + hidden + '><section class="magazine-related"><h2>' + relatedLabel[lang] + '</h2><div class="related-grid">' + relatedCarsHtml + '</div></section></div>\n' +
        '<div class="lang-block" data-lang="' + lang + '"' + hidden + '><section class="magazine-related"><h2>' + relatedNewsLabel[lang] + '</h2><div class="related-grid">' + relatedNewsHtml + '</div></section></div>\n' +
        '<div class="lang-block" data-lang="' + lang + '"' + hidden + '><section class="magazine-newsletter"><h2>' + newsletterTitle[lang] + '</h2><p>' + newsletterDesc[lang] + '</p><form class="newsletter-form" onsubmit="return false;"><input type="email" placeholder="' + esc(emailPlaceholder[lang]) + '" aria-label="' + esc(emailPlaceholder[lang]) + '"><button type="submit">' + subscribeBtn[lang] + '</button></form></section></div>';
    }).join('\n');

    return `<!DOCTYPE html>
<html lang="es" data-i18n-lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${esc(titles.es)} | CarSpecio</title>
    <meta name="description" content="${esc(data.translations?.es?.excerpt || '')}">
    <meta name="keywords" content="${(data.tags||[]).join(', ')}">
    <meta name="author" content="CarSpecio">
    <link rel="canonical" href="https://carspecio.com/noticias/${slug}.html">
    <meta property="og:title" content="${esc(titles.es)}">
    <meta property="og:description" content="${esc(data.translations?.es?.excerpt || '')}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="https://carspecio.com/noticias/${slug}.html">
    <meta property="og:image" content="https://carspecio.com/${(data.image||'').replace(/^\.\.\//,'')}">
    <meta property="article:published_time" content="${data.date}">
    <meta property="article:section" content="${data.category||''}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${esc(titles.es)}">
    <meta name="twitter:description" content="${esc(data.translations?.es?.excerpt || '')}">
    <meta name="twitter:image" content="https://carspecio.com/${(data.image||'').replace(/^\.\.\//,'')}">
    <link rel="icon" href="../assets/logo/favicon-32.png" type="image/png" sizes="32x32">
  <link rel="icon" href="../assets/logo/favicon-64.png" type="image/png" sizes="64x64">
  <link rel="apple-touch-icon" href="../assets/logo/apple-touch-icon.png">
    <script>try{if(localStorage.getItem('profix-theme')==='light')document.documentElement.classList.add('light');}catch(e){}</script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../css/car-page-bundle.min.css">
    <link rel="stylesheet" href="../css/news-magazine.css">
</head>
<body>
    <a href="#main-content" class="skip-link">Ir al contenido principal</a>

    <header class="magazine-header site-header">

        <a href="../index.html" class="logo" aria-label="CarSpecio">
        <picture>
            <source srcset="../assets/logo/carspecio-mobile.png" media="(max-width: 600px)">
            <source srcset="../assets/logo/carspecio-tablet.png" media="(max-width: 1024px)">
            <img src="../assets/logo/carspecio-desktop.png" alt="CarSpecio" width="232" height="54">
        </picture>
    </a>

        <nav class="site-nav" id="siteNav">

            <a href="../index.html" data-i18n="navigation.home">Inicio</a>
            <a href="../compare.html" data-i18n="navigation.compare">Comparar</a>
            <a href="../reviews.html" data-i18n="navigation.reviews">Reviews</a>
            <div class="nav-item mega-menu-container" id="megaMenuContainer">
                <a class="mega-menu-link" aria-haspopup="true" aria-expanded="false" aria-controls="megaMenuPanel" id="megaMenuTrigger" role="button" tabindex="0" data-i18n="navigation.brands">Marcas</a>
                <div class="mega-menu" role="dialog" aria-label="Explorar marcas de coches" data-i18n-aria="a11y.exploreBrands" id="megaMenuPanel">
                    <button class="mega-menu__close" id="megaMenuClose" aria-label="Cerrar menu" data-i18n-aria="a11y.closeMenu">×</button>
                    <div class="mega-menu__content">
                        <nav class="mega-menu__breadcrumb" aria-label="Navegacion mega menu" data-i18n-aria="a11y.megaMenuNav">
                            <span class="mega-menu__crumb mega-menu__crumb--active" id="crumbBrands" data-i18n="navigation.popularBrands">MARCAS POPULARES</span>
                            <span class="mega-menu__crumb-sep" aria-hidden="true">›</span>
                            <span class="mega-menu__crumb" id="crumbCategory" data-i18n="navigation.categories">Categorias</span>
                            <span class="mega-menu__crumb-sep" aria-hidden="true">›</span>
                            <span class="mega-menu__crumb" id="crumbModel" data-i18n="navigation.models">Modelos</span>
                        </nav>
                        <div class="mega-menu__header">
                            <h3 data-i18n="navigation.popularBrands">MARCAS POPULARES</h3>
                            <p data-i18n="navigation.exploreBrands">Explora las marcas mas destacadas del mercado automotriz</p>
                        </div>
                        <div class="mega-menu__search">
                            <input type="search" class="mega-menu__search-input" placeholder="Buscar marca..." data-i18n-placeholder="search.brandPlaceholder" id="megaMenuSearch" autocomplete="off" aria-label="Buscar marca" data-i18n-aria="a11y.searchBrand">
                            <button class="mega-menu__search-btn" aria-label="Buscar" data-i18n-aria="a11y.search">🔍</button>
                        </div>
                        <div class="mega-menu__step" id="stepBrands">
                            <div class="mega-menu__brands" id="megaBrands"></div>
                        </div>
                        <div class="mega-menu__step" id="stepCategories">
                            <div class="mega-menu__categories" id="megaCategories">
                                <div class="mega-menu__categories-header">
                                    <h4 id="catHeaderTitle" data-i18n="navigation.categories">Categorias</h4>
                                    <button class="mega-menu__back-btn" id="backToBrands" data-i18n="navigation.backToBrands"><svg aria-hidden="true" focusable="false" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg> Volver a Marcas</button>
                                </div>
                                <div class="mega-menu__categories-list" id="megaCategoriesList"></div>
                            </div>
                        </div>
                        <div class="mega-menu__step" id="stepModels">
                            <div class="mega-menu__models" id="megaModels">
                                <div class="mega-menu__models-header">
                                    <h4 id="modHeaderTitle" data-i18n="navigation.models">Modelos</h4>
                                    <button class="mega-menu__back-btn" id="backToCategories" data-i18n="navigation.backToCategories"><svg aria-hidden="true" focusable="false" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg> Volver a Categorias</button>
                                </div>
                                <div class="mega-menu__models-list" id="megaModelsList"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <a href="../noticias.html" class="active" data-i18n="navigation.news">Noticias</a>
            <a href="../diagnostico.html" data-i18n="navigation.diagnostic">Diagnóstico</a>
            <a href="../guias/index.html" data-i18n="navigation.guides">Guías</a>
            <a href="../herramientas.html" data-i18n="navigation.tools">Herramientas</a>
            <a href="../contacto.html" data-i18n="navigation.contact">Contacto</a>
        </nav>
        <div class="header-tools">
            <div class="nav-dropdown lang-dropdown" data-dropdown>
                <button type="button" class="tool-btn-lang" id="langToggle" data-dropdown-toggle aria-label="Cambiar idioma" data-i18n-aria="a11y.language" aria-expanded="false" data-lang="es">
                    <span class="btn-icon" id="langIcon"><img src="https://flagcdn.com/24x18/es.png" alt="ES" class="flag-icon" width="20" height="15" loading="lazy" style="display: inline-block; vertical-align: middle; width: 20px; height: 15px; object-fit: cover; border-radius: 2px; flex-shrink: 0;"></span>
                    <span class="btn-text" id="langLabel">Español</span>
                </button>
                <div class="dropdown-menu lang-menu" id="langMenu" data-dropdown-menu>
                    <button type="button" data-lang="es" data-value="es" data-label="Español" data-icon="�🇸" class="active"><img src="https://flagcdn.com/24x18/es.png" alt="ES" width="20" height="15" loading="lazy" style="width:20px;height:15px;object-fit:cover;border-radius:2px;flex-shrink:0;"> Español</button>
                    <button type="button" data-lang="en" data-value="en" data-label="English" data-icon="��"><img src="https://flagcdn.com/24x18/gb.png" alt="EN" width="20" height="15" loading="lazy" style="width:20px;height:15px;object-fit:cover;border-radius:2px;flex-shrink:0;"> English</button>
                    <button type="button" data-lang="fr" data-value="fr" data-label="Français" data-icon="��"><img src="https://flagcdn.com/24x18/fr.png" alt="FR" width="20" height="15" loading="lazy" style="width:20px;height:15px;object-fit:cover;border-radius:2px;flex-shrink:0;"> Français</button>
                    <button type="button" data-lang="ar" data-value="ar" data-label="العربية" data-icon="🇸🇦"><img src="https://flagcdn.com/24x18/sa.png" alt="AR" width="20" height="15" loading="lazy" style="width:20px;height:15px;object-fit:cover;border-radius:2px;flex-shrink:0;"> العربية</button>
                </div>
            </div>
            <button type="button" class="tool-btn" id="darkbtn" aria-label="Modo oscuro">&#9790;</button>
            <button type="button" class="menu-btn" id="menuBtn" aria-label="Abrir menú" aria-expanded="false">☰</button>
        </div>
    </header>

    <main id="main-content" class="magazine-page">
        <nav aria-label="Breadcrumb" class="magazine-breadcrumb">
            <a href="../index.html">Inicio</a>
            <span class="breadcrumb-sep">›</span>
            <a href="../noticias.html" class="active">Noticias</a>
            <span class="breadcrumb-sep">›</span>
            <span class="breadcrumb-current" aria-current="page">${data.category||''}</span>
        </nav>

        <article class="magazine-article">
            ${langBlocks}
        </article>

        ${relatedSections}
    </main>

    <footer class="site-footer magazine-footer">
        <div class="footer-container">
            <div class="footer-main">
                <div class="footer-brand">
                    <div class="footer-logo" aria-label="CarSpecio">
                    <picture>
                        <source srcset="../assets/logo/carspecio-mobile.png" media="(max-width: 600px)">
                        <source srcset="../assets/logo/carspecio-tablet.png" media="(max-width: 1024px)">
                        <img src="../assets/logo/carspecio-desktop.png" alt="CarSpecio" width="232" height="54">
                    </picture>
                </div>
                    <p>Noticias, reviews y comparativas del mundo del motor.</p>
                </div>
                <div class="footer-col">
                    <h3>Enlaces</h3>
                    <a href="../index.html">Inicio</a>
                    <a href="../noticias.html">Noticias</a>
                    <a href="../reviews.html">Reviews</a>
                    <a href="../compare.html">Comparar</a>
                </div>
            </div>
            <div class="footer-bottom">
                <p class="copyright">© 2026 CarSpecio • Todos los derechos reservados</p>
            </div>
        </div>
    </footer>

    <script src="../js/mega-menu-data.js" defer></script>
    <script src="../js/mega-menu.js" defer></script>
    <script src="../js/flag-icons.js" defer></script>
    <script src="../js/i18n.js" defer></script>
    <script src="../js/search-index.js" defer></script>
    <script src="../js/script.js" defer></script>
    <script src="../system/js/dropdowns.js" defer></script>
    <script src="../js/news-magazine.js" defer></script>
    <script src="../js/cookie-consent.js" defer></script>
    <script src="../js/analytics.js" defer></script>
    <script src="../js/analytics-events.js" defer></script>
    <script type="application/json" id="articleTitlesData">${JSON.stringify(titles)}</script>
    <script>
        function updateArticleTitle() {
            const dataEl = document.getElementById('articleTitlesData');
            const titles = dataEl ? JSON.parse(dataEl.textContent) : {};
            const lang = (typeof currentLang === 'function' && currentLang()) || document.documentElement.lang || 'es';
            const title = titles[lang] || titles.es;
            if (title) document.title = title + ' | CarSpecio';
        }
        document.addEventListener('i18n:ready', updateArticleTitle);
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', updateArticleTitle);
        } else {
            updateArticleTitle();
        }
    </script>
</body>
</html>`;
}

function formatDate(dateStr, lang) {
    var d = new Date(dateStr);
    var months = {
        es: ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'],
        en: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
        fr: ['janv','févr','mars','avr','mai','juin','juil','août','sept','oct','nov','déc'],
        ar: ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر']
    };
    var m = months[lang] || months.es;
    return d.getDate() + ' ' + m[d.getMonth()] + ' ' + d.getFullYear();
}
