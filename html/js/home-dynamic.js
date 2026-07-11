/* CarSpecio — Dynamic Home Page Generator */
/* Generates car cards, rankings, and stats dynamically from car data */

(function () {
    'use strict';

    const CARS = window.CARSPECIO_COMPARE_INDEX || window.carspecio_COMPARE_CARS || [];
    if (!CARS.length) return;

    let _lang = 'es';
    const currentLang = () => {
        try {
            if (typeof window.currentLang === 'function') return window.currentLang();
            return document.documentElement.lang || _lang || 'es';
        } catch (e) { return _lang || 'es'; }
    };

    // Fetch car JSON data for a single car
    async function fetchCarData(car) {
        try {
            const dataFile = car.dataFile ? car.dataFile.replace(/^\.\.\//, '') : 'system/data/' + car.id + '.json';
            const resp = await fetch(dataFile);
            if (!resp.ok) return null;
            return await resp.json();
        } catch (e) { return null; }
    }

    // Get car display name based on language
    function carName(car, lang) {
        if (lang === 'ar' && car.nameAr) return car.nameAr;
        return car.name;
    }

    // Get category label based on language
    function categoryLabel(catId, lang) {
        const labels = {
            deportivos: { es: 'Deportivos', en: 'Sports', fr: 'Sportives', ar: 'رياضية' },
            sedan: { es: 'Sedán', en: 'Sedan', fr: 'Berline', ar: 'سيدان' },
            suv: { es: 'SUV', en: 'SUV', fr: 'SUV', ar: 'دفع رباعي' },
            compacto: { es: 'Compacto', en: 'Compact', fr: 'Compacte', ar: 'مدمج' }
        };
        const c = labels[catId] || labels['deportivos'];
        return c[lang] || c['es'];
    }

    // Get rating from car data
    function getRating(carData) {
        if (!carData) return null;
        if (carData.aggregateRating && carData.aggregateRating.ratingValue) return carData.aggregateRating.ratingValue;
        if (carData.review && carData.review.score) return carData.review.score;
        if (carData.basicInfo && carData.basicInfo.rating) return carData.basicInfo.rating;
        return null;
    }

    // Get power from car data
    function getPower(carData) {
        if (!carData) return null;
        if (carData.specs && carData.specs.engine && carData.specs.engine.power) {
            return carData.specs.engine.power.value + ' ' + (carData.specs.engine.power.unit || 'HP');
        }
        return null;
    }

    // Get acceleration from car data
    function getAcceleration(carData) {
        if (!carData) return null;
        if (carData.specs && carData.specs.performance && carData.specs.performance.zeroToHundred) {
            return carData.specs.performance.zeroToHundred + 's 0-100';
        }
        return null;
    }

    // Get price from car data (Spain price)
    function getPrice(carData) {
        if (!carData) return null;
        if (carData.countryPricing && carData.countryPricing.es && carData.countryPricing.es.priceNew) {
            return '\u20AC' + carData.countryPricing.es.priceNew.toLocaleString('es-ES');
        }
        if (carData.price && carData.price.value) {
            return '\u20AC' + carData.price.value.toLocaleString('es-ES');
        }
        return null;
    }

    // Get launch date
    function getLaunchDate(carData, lang) {
        if (!carData || !carData.launchDate) return null;
        const d = new Date(carData.launchDate);
        if (isNaN(d)) return null;
        const locales = { es: 'es-ES', en: 'en-US', fr: 'fr-FR', ar: 'ar-MA' };
        return d.toLocaleDateString(locales[lang] || 'es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
    }

    // Get image URL (normalize path for html/ root)
    function getImage(car, carData) {
        // Primary: use car.image from compare-data.js (already has correct path)
        if (car.image) {
            return car.image.replace(/^\//, '');
        }
        // Fallback: use carData.images.hero
        if (carData && carData.images && carData.images.hero) {
            let h = carData.images.hero;
            if (h.startsWith('http')) return h;
            h = h.replace(/^(\.\.\/)+/, '').replace(/^\//, '');
            return h;
        }
        return 'images/placeholder.svg';
    }

    // Build a car card HTML
    function buildCarCard(car, carData, lang, opts) {
        opts = opts || {};
        const name = carName(car, lang);
        const img = getImage(car, carData);
        const rating = getRating(carData);
        const power = getPower(carData);
        const accel = getAcceleration(carData);
        const price = getPrice(carData);
        const cat = categoryLabel(car.categoryId, lang);
        const launchDate = getLaunchDate(carData, lang);

        const ratingBadge = rating ? '<span class="card-rating">' + rating + '</span>' : '';
        const badge = opts.badge ? '<span class="card-badge">' + opts.badge + '</span>' : '';
        const specs = [power, accel, price].filter(Boolean).map(s => '<span class="spec-tag">' + s + '</span>').join('');
        const footerReview = lang === 'ar' ? 'عرض المراجعة' : lang === 'en' ? 'View review' : lang === 'fr' ? "Voir l'essai" : 'Ver review';
        const dateStr = launchDate || '';

        if (opts.compact) {
            return '<a href="' + car.htmlFile + '" class="card review-card">' +
                '<div class="card-image">' + ratingBadge + '<img src="' + img + '" alt="' + name + '" loading="lazy"></div>' +
                '<div class="card-body">' +
                '<div class="card-meta"><span>' + cat + '</span>' + (dateStr ? '<span class="card-meta-muted">' + dateStr + '</span>' : '') + '</div>' +
                '<h3 class="card-title">' + name + '</h3>' +
                '<div class="card-footer"><span>' + car.brand + '</span>' + (price || '') + '</div>' +
                '</div></a>';
        }

        return '<a href="' + car.htmlFile + '" class="card review-card">' +
            '<div class="card-image">' + badge + ratingBadge + '<img src="' + img + '" alt="' + name + '" loading="lazy"></div>' +
            '<div class="card-body">' +
            '<div class="card-meta"><span>' + cat + '</span></div>' +
            '<h3 class="card-title">' + name + '</h3>' +
            (specs ? '<div class="specs-row">' + specs + '</div>' : '') +
            '<div class="card-footer"><span>' + footerReview + '</span><span>' + car.brand + '</span></div>' +
            '</div></a>';
    }

    // Build a rank card
    function buildRankCard(car, carData, lang, label) {
        const name = carName(car, lang);
        const img = getImage(car, carData);
        const rating = getRating(carData) || '';
        return '<a href="' + car.htmlFile + '" class="rank-card">' +
            '<img class="rank-bg" src="' + img + '" alt="' + name + '" loading="lazy">' +
            '<div class="rank-overlay">' +
            '<div class="rank-badge"><span class="rank-label">' + label + '</span></div>' +
            '<div class="rank-car">' + name + '</div>' +
            '<div class="rank-score">' + rating + '</div>' +
            '</div></a>';
    }

    // Stats labels
    function statsLabels(lang) {
        const s = {
            es: { cars: 'Coches analizados', comparisons: 'Comparaciones posibles', guides: 'Gu\u00edas', brands: 'Marcas' },
            en: { cars: 'Cars analyzed', comparisons: 'Possible comparisons', guides: 'Guides', brands: 'Brands' },
            fr: { cars: 'Voitures analys\u00e9es', comparisons: 'Comparaisons possibles', guides: 'Guides', brands: 'Marques' },
            ar: { cars: '\u0633\u064a\u0627\u0631\u0627\u062a \u062a\u0645 \u062a\u062d\u0644\u064a\u0644\u0647\u0627', comparisons: '\u0645\u0642\u0627\u0631\u0646\u0627\u062a \u0645\u0645\u0643\u0646\u0629', guides: '\u0623\u062f\u0644\u0629', brands: '\u0639\u0644\u0627\u0645\u0627\u062a' }
        };
        return s[lang] || s['es'];
    }

    // Ranking labels
    function rankingLabels(lang) {
        const r = {
            es: { sports: 'Mejor deportivo', sedan: 'Mejor sed\u00e1n', value: 'Mejor relaci\u00f3n calidad-precio' },
            en: { sports: 'Best sports car', sedan: 'Best sedan', value: 'Best value for money' },
            fr: { sports: 'Meilleure sportive', sedan: 'Meilleure berline', value: 'Meilleur rapport qualit\u00e9-prix' },
            ar: { sports: '\u0623\u0641\u0636\u0644 \u0633\u064a\u0627\u0631\u0629 \u0631\u064a\u0627\u0636\u064a\u0629', sedan: '\u0623\u0641\u0636\u0644 \u0633\u064a\u062f\u0627\u0646', value: '\u0623\u0641\u0636\u0644 \u0642\u064a\u0645\u0629 \u0645\u0642\u0627\u0628\u0644 \u0627\u0644\u0633\u0639\u0631' }
        };
        return r[lang] || r['es'];
    }

    // Section labels
    function sectionLabels(lang) {
        const s = {
            es: { featured: 'Coches m\u00e1s buscados', featuredSub: 'Los modelos m\u00e1s populares entre nuestros lectores.', rankings: 'Rankings', rankingsSub: 'Las mejores opciones seg\u00fan cada necesidad.', latest: '\u00daltimos modelos a\u00f1adidos', latestSub: 'Las novedades m\u00e1s recientes del cat\u00e1logo.', seeReviews: 'Ver reviews' },
            en: { featured: 'Most searched cars', featuredSub: 'The most popular models among our readers.', rankings: 'Rankings', rankingsSub: 'The best options for every need.', latest: 'Latest models added', latestSub: 'The most recent additions to our catalog.', seeReviews: 'View reviews' },
            fr: { featured: 'Voitures les plus recherch\u00e9es', featuredSub: 'Les mod\u00e8les les plus populaires parmi nos lecteurs.', rankings: 'Classements', rankingsSub: 'Les meilleures options selon chaque besoin.', latest: 'Derniers mod\u00e8les ajout\u00e9s', latestSub: 'Les ajouts les plus r\u00e9cents au catalogue.', seeReviews: 'Voir les essais' },
            ar: { featured: '\u0627\u0644\u0633\u064a\u0627\u0631\u0627\u062a \u0627\u0644\u0623\u0643\u062b\u0631 \u0637\u0644\u0628\u0627\u064b', featuredSub: '\u0627\u0644\u0646\u0645\u0627\u0630\u062c \u0627\u0644\u0623\u0643\u062b\u0631 \u0634\u0639\u0628\u064a\u0629 \u0628\u064a\u0646 \u0642\u0631\u0627\u0626\u0646\u0627.', rankings: '\u0627\u0644\u062a\u0635\u0646\u064a\u0641\u0627\u062a', rankingsSub: '\u0623\u0641\u0636\u0644 \u0627\u0644\u062e\u064a\u0627\u0631\u0627\u062a \u062d\u0633\u0628 \u0643\u0644 \u0627\u062d\u062a\u064a\u0627\u062c.', latest: '\u0622\u062e\u0631 \u0627\u0644\u0646\u0645\u0627\u0630\u062c \u0627\u0644\u0645\u0636\u0627\u0641\u0629', latestSub: '\u0623\u062d\u062f\u062b \u0627\u0644\u0625\u0636\u0627\u0641\u0627\u062a \u0644\u0644\u0641\u0626\u0629.', seeReviews: '\u0639\u0631\u0636 \u0627\u0644\u0645\u0631\u0627\u062c\u0639\u0627\u062a' }
        };
        return s[lang] || s['es'];
    }

    // Category labels and icons
    function categoryDefs(lang) {
        const cats = {
            deportivos: { icon: '\u{1F3CE}\uFE0F', names: { es: 'Deportivos', en: 'Sports', fr: 'Sportives', ar: '\u0631\u064a\u0627\u0636\u064a\u0629' } },
            sedan: { icon: '\u{1F697}', names: { es: 'Sed\u00e1n', en: 'Sedan', fr: 'Berline', ar: '\u0633\u064a\u062f\u0627\u0646' } },
            suv: { icon: '\u{1F699}', names: { es: 'SUV', en: 'SUV', fr: 'SUV', ar: '\u062f\u0641\u0639 \u0631\u0628\u0627\u0639\u064a' } },
            electricos: { icon: '\u26A1', names: { es: 'El\u00e9ctricos', en: 'Electric', fr: '\u00c9lectriques', ar: '\u0643\u0647\u0631\u0628\u0627\u0626\u064a' } },
            compactos: { icon: '\u{1F695}', names: { es: 'Compactos', en: 'Compact', fr: 'Compacts', ar: '\u0645\u062f\u0645\u062c\u0629' } },
            hatchback: { icon: '\u{1F698}', names: { es: 'Hatchback', en: 'Hatchback', fr: 'Hatchback', ar: '\u0647\u0627\u062a\u0634\u0628\u0627\u0643' } },
            familiar: { icon: '\u{1F68C}', names: { es: 'Familiar', en: 'Family', fr: 'Familiale', ar: '\u0639\u0627\u0626\u0644\u064a\u0629' } },
            pickup: { icon: '\u{1F6FB}', names: { es: 'Pickup', en: 'Pickup', fr: 'Pickup', ar: '\u0628\u064a\u0643\u0623\u0628' } },
            h\u00edbridos: { icon: '\u{1F33F}', names: { es: 'H\u00edbridos', en: 'Hybrid', fr: 'Hybrides', ar: '\u0647\u062c\u064a\u0646' } },
            lujo: { icon: '\u{1F451}', names: { es: 'Lujo', en: 'Luxury', fr: 'Luxe', ar: '\u0641\u062e\u0645' } }
        };
        return cats;
    }

    function categoryLabels(lang) {
        const l = {
            es: { models: 'modelo', modelsPlural: 'modelos' },
            en: { models: 'model', modelsPlural: 'models' },
            fr: { models: 'mod\u00e8le', modelsPlural: 'mod\u00e8les' },
            ar: { models: '\u0645\u0648\u062f\u064a\u0644', modelsPlural: '\u0645\u0648\u062f\u064a\u0644\u0627\u062a' }
        };
        return l[lang] || l['es'];
    }

    // Build a category card
    function buildCategoryCard(catId, count, lang) {
        const cats = categoryDefs(lang);
        const cat = cats[catId];
        if (!cat) return '';
        const cl = categoryLabels(lang);
        const name = cat.names[lang] || cat.names['es'];
        const countText = count + ' ' + (count === 1 ? cl.models : cl.modelsPlural);
        return '<a href="category.html?cat=' + catId + '" class="category-card">' +
            '<span class="category-icon">' + cat.icon + '</span>' +
            '<span class="category-name">' + name + '</span>' +
            '<span class="category-count">' + countText + '</span>' +
            '</a>';
    }

    // Budget labels
    function budgetLabels(lang) {
        const b = {
            es: { from: 'Desde', models: 'modelo', modelsPlural: 'modelos' },
            en: { from: 'From', models: 'model', modelsPlural: 'models' },
            fr: { from: '\u00c0 partir de', models: 'mod\u00e8le', modelsPlural: 'mod\u00e8les' },
            ar: { from: '\u0627\u0628\u062a\u062f\u0627\u0621\u064b \u0645\u0646', models: '\u0645\u0648\u062f\u064a\u0644', modelsPlural: '\u0645\u0648\u062f\u064a\u0644\u0627\u062a' }
        };
        return b[lang] || b['es'];
    }

    // Build a budget card
    function buildBudgetCard(range, count, lang) {
        const bl = budgetLabels(lang);
        const countText = count + ' ' + (count === 1 ? bl.models : bl.modelsPlural);
        const rangeLabel = range.max !== null
            ? '\u20AC' + range.min.toLocaleString() + ' - \u20AC' + range.max.toLocaleString()
            : (lang === 'ar' ? '\u0627\u0628\u062a\u062f\u0627\u0621\u064b \u0645\u0646 ' : bl.from + ' ') + '\u20AC' + range.min.toLocaleString();
        const fromLabel = bl.from + ' \u20AC' + range.min.toLocaleString();
        const href = 'budget.html?min=' + range.min + (range.max !== null ? '&max=' + range.max : '');
        return '<a href="' + href + '" class="budget-card">' +
            '<div class="budget-range">' + rangeLabel + '</div>' +
            '<div class="budget-meta">' + fromLabel + '</div>' +
            '<div class="budget-count">' + countText + '</div>' +
            '</a>';
    }

    // Main render function
    async function render() {
        const lang = currentLang();

        // Fetch all car data
        const carDataMap = {};
        await Promise.all(CARS.map(async (car) => {
            const data = await fetchCarData(car);
            if (data) carDataMap[car.id] = data;
        }));

        // === Stats ===
        const numCars = CARS.length;
        const numComparisons = Math.round(numCars * (numCars - 1) / 2);
        const numBrands = new Set(CARS.map(c => c.brandId)).size;
        let numGuides = 3;
        try {
            const guidesResp = await fetch('system/data/guides/');
            if (guidesResp.ok) {
                const text = await guidesResp.text();
                const matches = text.match(/\.html/g);
                if (matches) numGuides = matches.length;
            }
        } catch (e) {}

        const sl = statsLabels(lang);
        const statsContainers = document.querySelectorAll('.hero-stats');
        statsContainers.forEach(container => {
            container.innerHTML =
                '<div class="hero-stat"><strong>' + numCars + '</strong><span>' + sl.cars + '</span></div>' +
                '<div class="hero-stat"><strong>' + numComparisons + '</strong><span>' + sl.comparisons + '</span></div>' +
                '<div class="hero-stat"><strong>' + numGuides + '</strong><span>' + sl.guides + '</span></div>' +
                '<div class="hero-stat"><strong>' + numBrands + '</strong><span>' + sl.brands + '</span></div>';
        });

        // === Featured cars (top rated, max 5) ===
        const carsWithRatings = CARS.map(c => ({
            car: c,
            data: carDataMap[c.id],
            rating: getRating(carDataMap[c.id]) || 0
        })).sort((a, b) => b.rating - a.rating);

        const featured = carsWithRatings.slice(0, 5);
        const secl = sectionLabels(lang);

        const featuredContainers = document.querySelectorAll('[data-dynamic="featured"]');
        featuredContainers.forEach(container => {
            container.innerHTML = featured.map((item, i) => {
                return buildCarCard(item.car, item.data, lang, { badge: i === 0 ? '#1' : '' });
            }).join('');
        });

        // === Rankings ===
        const rl = rankingLabels(lang);

        // Best sports car (highest rating among deportivos)
        const sports = carsWithRatings.filter(c => c.car.categoryId === 'deportivos');
        const bestSports = sports[0];

        // Best sedan (highest rating among sedan)
        const sedans = carsWithRatings.filter(c => c.car.categoryId === 'sedan');
        const bestSedan = sedans[0];

        // Best value (lowest price per rating point)
        const valueCars = carsWithRatings.filter(c => {
            const d = c.data;
            if (!d || !d.countryPricing || !d.countryPricing.es || !d.countryPricing.es.priceNew) return false;
            return true;
        }).map(c => {
            const price = c.data.countryPricing.es.priceNew;
            const rating = c.rating || 1;
            return { ...c, valueScore: rating / (price / 100000) };
        }).sort((a, b) => b.valueScore - a.valueScore);
        const bestValue = valueCars[0];

        const rankingsContainers = document.querySelectorAll('[data-dynamic="rankings"]');
        rankingsContainers.forEach(container => {
            let html = '';
            if (bestSports) html += buildRankCard(bestSports.car, bestSports.data, lang, rl.sports);
            if (bestSedan) html += buildRankCard(bestSedan.car, bestSedan.data, lang, rl.sedan);
            if (bestValue) html += buildRankCard(bestValue.car, bestValue.data, lang, rl.value);
            container.innerHTML = html;
        });

        // === Latest models (sorted by launch date, max 4) ===
        const latest = carsWithRatings.filter(c => c.data && c.data.launchDate)
            .sort((a, b) => new Date(b.data.launchDate) - new Date(a.data.launchDate))
            .slice(0, 4);

        // Fallback: if no launch dates, use all cars
        const latestToShow = latest.length >= 2 ? latest : carsWithRatings.slice(0, 4);

        const latestContainers = document.querySelectorAll('[data-dynamic="latest"]');
        latestContainers.forEach(container => {
            container.innerHTML = latestToShow.map(item => {
                return buildCarCard(item.car, item.data, lang, { compact: true });
            }).join('');
        });

        // === Budget cards (dynamic price ranges) ===
        const budgetRanges = [
            { min: 0, max: 50000 },
            { min: 50000, max: 100000 },
            { min: 100000, max: 150000 },
            { min: 150000, max: null }
        ];

        const budgetContainers = document.querySelectorAll('[data-dynamic="budget"]');
        budgetContainers.forEach(container => {
            const html = budgetRanges.map(range => {
                const count = carsWithRatings.filter(c => {
                    const price = c.data && c.data.countryPricing && c.data.countryPricing.es && c.data.countryPricing.es.priceNew
                        ? c.data.countryPricing.es.priceNew
                        : (c.data && c.data.price ? c.data.price.value : 0);
                    return price >= range.min && (range.max === null || price < range.max);
                }).length;
                return buildBudgetCard(range, count, lang);
            }).join('');
            container.innerHTML = html;
        });

        // === Category cards (dynamic) ===
        const cats = categoryDefs(lang);
        const categoryIds = Object.keys(cats);
        const categoryContainers = document.querySelectorAll('[data-dynamic="categories"]');
        categoryContainers.forEach(container => {
            const html = categoryIds.map(catId => {
                const count = CARS.filter(c => c.categoryId === catId).length;
                return buildCategoryCard(catId, count, lang);
            }).join('');
            container.innerHTML = html;
        });
    }

    // Run on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', render);
    } else {
        render();
    }

    // Re-render on language change
    document.addEventListener('i18n:ready', function(e) {
        if (e.detail && e.detail.lang) _lang = e.detail.lang;
        render();
    });
})();
