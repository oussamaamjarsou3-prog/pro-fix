/* CarSpecio — Category Page */
/* Shows cars within a specific category based on URL param ?cat=deportivos */

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
            sedan: { es: 'Sedán', en: 'Sedan', fr: 'Berline', ar: 'سيدان' },
            suv: { es: 'SUV', en: 'SUV', fr: 'SUV', ar: 'دفع رباعي' },
            electricos: { es: 'Eléctricos', en: 'Electric', fr: 'Électriques', ar: 'كهربائي' },
            compactos: { es: 'Compactos', en: 'Compact', fr: 'Compacts', ar: 'مدمجة' },
            hatchback: { es: 'Hatchback', en: 'Hatchback', fr: 'Hatchback', ar: 'هاتشباك' },
            familiar: { es: 'Familiar', en: 'Family', fr: 'Familiale', ar: 'عائلية' },
            pickup: { es: 'Pickup', en: 'Pickup', fr: 'Pickup', ar: 'بيك أب' },
            híbridos: { es: 'Híbridos', en: 'Hybrid', fr: 'Hybrides', ar: 'هجين' },
            lujo: { es: 'Lujo', en: 'Luxury', fr: 'Luxe', ar: 'فخم' }
        };
        const c = labels[catId];
        return c ? (c[lang] || c['es']) : catId;
    }

    function getImage(car) {
        if (car.image) return car.image.replace(/^\//, '');
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
        const img = getImage(car);
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
        const cat = params.get('cat') || 'deportivos';

        // Fetch all car data
        const carDataMap = {};
        await Promise.all(CARS.map(async (car) => {
            const data = await fetchCarData(car);
            if (data) carDataMap[car.id] = data;
        }));

        // Filter cars by category
        const filtered = CARS.filter(car => car.categoryId === cat);

        // Sort by rating (highest first)
        filtered.sort((a, b) => {
            const ra = getRating(carDataMap[a.id]) || 0;
            const rb = getRating(carDataMap[b.id]) || 0;
            return rb - ra;
        });

        const catName = categoryLabel(cat, lang);

        // Update all language blocks
        const langMap = { es: '', en: 'En', fr: 'Fr', ar: 'Ar' };
        Object.keys(langMap).forEach(l => {
            const suffix = langMap[l];
            const resultsEl = document.getElementById('catResults' + suffix);
            const displayEl = document.getElementById('catDisplay' + suffix);
            const emptyEl = document.getElementById('catEmpty' + suffix);

            if (displayEl) displayEl.textContent = categoryLabel(cat, l);

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
