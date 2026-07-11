/* CarSpecio — Budget Page */
/* Shows cars within a specific price range based on URL params */

(function () {
    'use strict';

    const CARS = window.CARSPECIO_COMPARE_INDEX || window.carspecio_COMPARE_CARS || [];
    if (!CARS.length) return;

    function getLang() {
        try {
            if (typeof window.currentLang === 'function') return window.currentLang();
            return document.documentElement.lang || 'es';
        } catch (e) { return 'es'; }
    }

    function carName(car, lang) {
        if (lang === 'ar' && car.nameAr) return car.nameAr;
        return car.name;
    }

    function categoryLabel(catId, lang) {
        const labels = {
            deportivos: { es: 'Deportivos', en: 'Sports', fr: 'Sportives', ar: 'رياضية' },
            sedan: { es: 'Sedán', en: 'Sedan', fr: 'Berline', ar: 'سيدان' }
        };
        const c = labels[catId] || labels['deportivos'];
        return c[lang] || c['es'];
    }

    function getImage(car, carData) {
        if (car.image) return car.image.replace(/^\//, '');
        if (carData && carData.images && carData.images.hero) {
            let h = carData.images.hero;
            if (h.startsWith('http')) return h;
            h = h.replace(/^(\.\.\/)+/, '').replace(/^\//, '');
            return h;
        }
        return 'images/placeholder.svg';
    }

    function getRating(carData) {
        if (!carData) return null;
        if (carData.aggregateRating && carData.aggregateRating.ratingValue) return carData.aggregateRating.ratingValue;
        if (carData.review && carData.review.score) return carData.review.score;
        return null;
    }

    function getPower(carData) {
        if (!carData || !carData.specs || !carData.specs.engine || !carData.specs.engine.power) return null;
        return carData.specs.engine.power.value + ' ' + (carData.specs.engine.power.unit || 'HP');
    }

    function getAcceleration(carData) {
        if (!carData || !carData.specs || !carData.specs.performance || !carData.specs.performance.zeroToHundred) return null;
        return carData.specs.performance.zeroToHundred + 's 0-100';
    }

    function getPrice(carData) {
        if (!carData) return null;
        if (carData.countryPricing && carData.countryPricing.es && carData.countryPricing.es.priceNew) return '\u20AC' + carData.countryPricing.es.priceNew.toLocaleString('es-ES');
        if (carData.price && carData.price.value) return '\u20AC' + carData.price.value.toLocaleString('es-ES');
        return null;
    }

    function buildCard(car, carData, lang) {
        const name = carName(car, lang);
        const img = getImage(car, carData);
        const rating = getRating(carData);
        const power = getPower(carData);
        const accel = getAcceleration(carData);
        const price = getPrice(carData);
        const cat = categoryLabel(car.categoryId, lang);
        const ratingBadge = rating ? '<span class="card-rating">' + rating + '</span>' : '';
        const specs = [power, accel, price].filter(Boolean).map(s => '<span class="spec-tag">' + s + '</span>').join('');
        const footerReview = lang === 'ar' ? 'عرض المراجعة' : lang === 'en' ? 'View review' : lang === 'fr' ? "Voir l'essai" : 'Ver review';

        return '<a href="' + car.htmlFile + '" class="card review-card">' +
            '<div class="card-image">' + ratingBadge + '<img src="' + img + '" alt="' + name + '" loading="lazy"></div>' +
            '<div class="card-body">' +
            '<div class="card-meta"><span>' + cat + '</span></div>' +
            '<h3 class="card-title">' + name + '</h3>' +
            (specs ? '<div class="specs-row">' + specs + '</div>' : '') +
            '<div class="card-footer"><span>' + footerReview + '</span><span>' + car.brand + '</span></div>' +
            '</div></a>';
    }

    function formatRange(min, max, lang) {
        const fromWord = { es: 'Desde', en: 'From', fr: 'A partir de', ar: 'ابتداءً من' };
        if (max === null || max === undefined) {
            return fromWord[lang] + ' \u20AC' + min.toLocaleString();
        }
        return '\u20AC' + min.toLocaleString() + ' - \u20AC' + max.toLocaleString();
    }

    async function fetchCarData(car) {
        try {
            const dataFile = car.dataFile ? car.dataFile.replace(/^\.\.\//, '') : 'system/data/' + car.id + '.json';
            const resp = await fetch(dataFile);
            if (!resp.ok) return null;
            return await resp.json();
        } catch (e) { return null; }
    }

    async function render() {
        const lang = getLang();
        const params = new URLSearchParams(window.location.search);
        const min = parseInt(params.get('min') || '0', 10);
        const maxParam = params.get('max');
        const max = maxParam ? parseInt(maxParam, 10) : null;

        // Fetch all car data
        const carDataMap = {};
        await Promise.all(CARS.map(async (car) => {
            const data = await fetchCarData(car);
            if (data) carDataMap[car.id] = data;
        }));

        // Filter cars by price range
        const filtered = CARS.filter(car => {
            const d = carDataMap[car.id];
            if (!d) return false;
            const price = (d.countryPricing && d.countryPricing.es && d.countryPricing.es.priceNew) ? d.countryPricing.es.priceNew : (d.price ? d.price.value : 0);
            return price >= min && (max === null || price < max);
        }).sort((a, b) => {
            const pa = (carDataMap[a.id].countryPricing && carDataMap[a.id].countryPricing.es && carDataMap[a.id].countryPricing.es.priceNew) || carDataMap[a.id].price?.value || 0;
            const pb = (carDataMap[b.id].countryPricing && carDataMap[b.id].countryPricing.es && carDataMap[b.id].countryPricing.es.priceNew) || carDataMap[b.id].price?.value || 0;
            return pa - pb;
        });

        const rangeText = formatRange(min, max, lang);

        // Update all language blocks
        const langMap = { es: '', en: 'En', fr: 'Fr', ar: 'Ar' };
        Object.keys(langMap).forEach(l => {
            const suffix = langMap[l];
            const resultsEl = document.getElementById('budgetResults' + suffix);
            const rangeEl = document.getElementById('budgetRangeDisplay' + suffix);
            const emptyEl = document.getElementById('budgetEmpty' + suffix);

            if (rangeEl) rangeEl.textContent = formatRange(min, max, l);

            if (resultsEl) {
                if (filtered.length > 0) {
                    resultsEl.innerHTML = filtered.map(car => buildCard(car, carDataMap[car.id], l)).join('');
                } else {
                    resultsEl.innerHTML = '';
                }
            }
            if (emptyEl) emptyEl.hidden = filtered.length > 0;
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', render);
    } else {
        render();
    }

    document.addEventListener('i18n:ready', render);
})();
