const fs = require('fs');
const path = require('path');

const projectDir = path.join(__dirname, '..');
const htmlDir = path.join(projectDir, 'html');
const reviewsPath = path.join(htmlDir, 'reviews.html');
const localesDir = path.join(projectDir, 'system/locales');

const carRegistry = JSON.parse(fs.readFileSync(path.join(projectDir, 'system/registry/car-registry.json'), 'utf8'));
const brandRegistry = JSON.parse(fs.readFileSync(path.join(projectDir, 'system/registry/brand-registry.json'), 'utf8'));

const SUPPORTED_LANGS = ['es', 'en', 'fr', 'ar'];

const locales = {};
for (const lang of SUPPORTED_LANGS) {
  locales[lang] = JSON.parse(fs.readFileSync(path.join(localesDir, `${lang}.json`), 'utf8'));
}

function t(key, lang) {
  const keys = key.split('.');
  let val = locales[lang];
  for (const k of keys) {
    val = val?.[k];
  }
  return val || key;
}

function getCarData(car) {
  const dataPath = path.join(projectDir, car.dataFile);
  if (!fs.existsSync(dataPath)) return null;
  return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
}

function getCategoryName(categoryId, lang) {
  return t(`categories.${categoryId}`, lang);
}

function getBrandName(brandId) {
  const brand = brandRegistry.brands.find(b => b.id === brandId);
  return brand?.name || brandId;
}

function getCarImage(car, carData) {
  let raw = carData?.images?.hero || car.images?.hero || '/images/placeholder.svg';
  if (raw.startsWith('../images/')) raw = raw.replace('../images/', '/images/');
  const srcPath = path.join(projectDir, raw.startsWith('/') ? raw.slice(1) : raw);
  if (!fs.existsSync(srcPath)) return '/images/placeholder.svg';
  return raw;
}

function getCarDescription(carData, lang) {
  return carData?.review?.[lang]?.summary || carData?.seo?.description || '';
}

function parsePrice(carData) {
  const cp = carData.countryPricing?.es || carData.countryPricing?.us || carData.countryPricing?.gb || Object.values(carData.countryPricing || {})[0];
  if (cp?.priceNew) return Number(cp.priceNew);
  if (carData.pricing?.basePrice?.value) return Number(carData.pricing.basePrice.value);
  return null;
}

function buildCard(car, carData, lang) {
  const name = carData?.basicInfo?.fullModelName || carData?.basicInfo?.name || 'Car';
  const description = getCarDescription(carData, lang);
  const rating = carData?.rating?.overall ?? '';
  const brand = getBrandName(car.brandId);
  const category = getCategoryName(car.categoryId, lang);
  const image = getCarImage(car, carData);
  const ratingHtml = rating ? `<span class="card-rating">${rating}</span>` : '';
  const cta = t('reviewsPage.cta', lang);
  const searchText = `${name} ${brand} ${category}`.toLowerCase();
  const price = parsePrice(carData);
  const priceAttr = price != null ? ` data-price="${price}"` : '';

  return `            <a href="${car.htmlFile}" class="card review-card" data-search="${searchText}" data-category="${car.categoryId}"${priceAttr}>
                <div class="card-image">${ratingHtml}<img src="${image}" alt="${name}" loading="lazy"></div>
                <div class="card-body">
                    <div class="card-meta"><span>${category}</span></div>
                    <h3 class="card-title">${name}</h3>
                    <p class="card-text">${description}</p>
                    <div class="card-footer"><span>${brand}</span><span>${cta}</span></div>
                </div>
            </a>`;
}

function buildLangBlock(lang) {
  const activeCars = carRegistry.cars.filter(c => c.status === 'active');
  const cards = activeCars.map(car => {
    const carData = getCarData(car);
    return buildCard(car, carData, lang);
  }).join('\n');

  return `        <div class="lang-block" data-lang="${lang}">
            <div class="card-grid card-grid--4">
${cards}
            </div>
        </div>`;
}

function buildReviewsSection() {
  const langBlocks = SUPPORTED_LANGS.map(lang => buildLangBlock(lang)).join('\n');

  return `
    <!-- REVIEWS -->
    <section class="dash-section">
        <div class="container">
            <div class="section-head">
                <h2 data-i18n="reviewsPage.sectionTitle">Reviews destacadas</h2>
                <p class="section-subtitle" data-i18n="reviewsPage.allSectionTitle">Todas las reviews</p>
            </div>

            <div class="reviews-search">
                <input type="search" id="reviewsSearch" class="reviews-search-input" data-i18n-placeholder="reviewsPage.searchPlaceholder" placeholder="Buscar por marca, modelo o categoría..." aria-label="Buscar reviews">
            </div>

            <div class="reviews-grid">
${langBlocks}
            </div>
            <p class="reviews-empty" id="reviewsEmpty" data-i18n="reviewsPage.emptyResults" hidden>No se encontraron reviews</p>
        </div>
    </section>
`;
}

function buildHeroSection() {
  return `
    <!-- HERO -->
    <section class="dash-hero reviews-hero">
        <div class="dash-hero-bg" style="background-image: url('images/hero-incio.webp')"></div>
        <div class="hero-bg-overlay"></div>
        <div class="container dash-hero-content">
            <h1 class="reveal" data-i18n="reviewsPage.title">Reviews de coches premium</h1>
            <p class="reveal" data-i18n="reviewsPage.subtitle">Análisis detallados de los mejores coches del mercado con datos reales y opiniones expertas.</p>
        </div>
    </section>
`;
}

function buildSearchScript() {
  return `
<script>
(function() {
    const searchInput = document.getElementById('reviewsSearch');
    if (!searchInput) return;

    function getBudgetFilter() {
        const params = new URLSearchParams(window.location.search);
        return params.get('budget');
    }

    function getCategoryFilter() {
        const params = new URLSearchParams(window.location.search);
        return params.get('categoria');
    }

    function filterReviews() {
        const query = searchInput.value.toLowerCase().trim();
        const currentLang = document.documentElement.lang || 'es';
        const activeBlock = document.querySelector('.reviews-grid .lang-block[data-lang="' + currentLang + '"]');
        if (!activeBlock) return;

        const budget = getBudgetFilter();
        let budgetMin = null, budgetMax = null;
        if (budget) {
            const parts = budget.split('-');
            budgetMin = parseFloat(parts[0]);
            budgetMax = parts[1] ? parseFloat(parts[1]) : null;
        }

        const catFilter = getCategoryFilter();

        const cards = activeBlock.querySelectorAll('.review-card');
        let visible = 0;

        cards.forEach(card => {
            const text = (card.getAttribute('data-search') || '').toLowerCase();
            const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
            const price = parseFloat(card.getAttribute('data-price'));
            const cardCat = card.getAttribute('data-category') || '';
            const textMatch = !query || text.includes(query) || title.includes(query);
            let priceMatch = true;
            if (budgetMin != null) {
                if (isNaN(price)) priceMatch = false;
                else if (price < budgetMin) priceMatch = false;
                else if (budgetMax != null && price >= budgetMax) priceMatch = false;
            }
            let catMatch = true;
            if (catFilter) {
                catMatch = cardCat === catFilter;
            }
            const match = textMatch && priceMatch && catMatch;
            card.style.display = match ? '' : 'none';
            if (match) visible++;
        });

        const emptyMsg = document.getElementById('reviewsEmpty');
        if (emptyMsg) emptyMsg.hidden = visible > 0;

        var subtitle = document.querySelector('.section-subtitle');
        if (subtitle) {
            if (catFilter) {
                var catNames = {
                    deportivos: 'Deportivos', sedan: 'Sedán', suv: 'SUV',
                    electricos: 'Eléctricos', compactos: 'Compactos',
                    hatchback: 'Hatchback', familiar: 'Familiar',
                    pickup: 'Pickup', 'híbridos': 'Híbridos', lujo: 'Lujo'
                };
                subtitle.textContent = catNames[catFilter] || catFilter;
            } else if (budgetMin != null) {
                subtitle.textContent = budgetMax != null
                    ? '€' + budgetMin.toLocaleString('es-ES') + ' - €' + budgetMax.toLocaleString('es-ES')
                    : 'Desde €' + budgetMin.toLocaleString('es-ES');
            }
        }
    }

    searchInput.addEventListener('input', filterReviews);
    document.addEventListener('i18n:ready', filterReviews);
    document.addEventListener('DOMContentLoaded', filterReviews);
    if (document.readyState !== 'loading') filterReviews();
})();
</script>`;
}

function updateReviewsPage() {
  if (!fs.existsSync(reviewsPath)) {
    console.error('reviews.html not found');
    return;
  }
  let content = fs.readFileSync(reviewsPath, 'utf8');

  // Replace the existing hero section
  content = content.replace(
    /<!--\s*HERO\s*-->\s*<section class="dash-hero"[\s\S]*?<\/section>/,
    buildHeroSection().trim()
  );

  // Replace the existing reviews section
  content = content.replace(
    /<!--\s*REVIEWS\s*-->\s*<section class="dash-section"[\s\S]*?<\/section>\s*(?=<!--\s*FOOTER\s*-->)/,
    buildReviewsSection().trim()
  );

  // Add page-home class to the body so it can reuse homepage card styles
  content = content.replace(
    /<body class="dash-home">/,
    '<body class="page-home dash-home">'
  );

  // Add data-i18n to title and meta description for multilingual support
  content = content.replace(
    /<title>[^<]*<\/title>/,
    '<title data-i18n="reviewsPage.pageTitle">Reviews | CarSpecio</title>'
  );
  content = content.replace(
    /<meta name="description" content="[^"]*">/,
    '<meta name="description" data-i18n="reviewsPage.subtitle" content="Análisis detallados de los mejores coches del mercado con datos reales y opiniones expertas.">'
  );

  // Add the search script before the closing body tag if not already present
  if (!content.includes('function filterReviews()')) {
    content = content.replace(
      /<script src="js\/script\.js"><\/script>/,
      `<script src="js/script.js"></script>\n${buildSearchScript()}`
    );
  } else {
    content = content.replace(
      /<script>\s*\(function\(\)\s*\{[\s\S]*?function filterReviews\(\)[\s\S]*?<\/script>/,
      buildSearchScript().trim()
    );
  }

  fs.writeFileSync(reviewsPath, content, 'utf8');
  console.log('Updated reviews.html with', carRegistry.cars.filter(c => c.status === 'active').length, 'cars');
}

updateReviewsPage();
