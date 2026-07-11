/**
 * CarSpecio Car Renderer
 * Centralized car page rendering system
 * Extracted from rs7.html reference implementation (June 2026)
 *
 * Usage:
 *   const renderer = new CarRenderer('../system/data/car.json');
 *   await renderer.render();
 */

class CarRenderer {
    constructor(carDataFile) {
        this.carDataFile = carDataFile;
        this.carDataLoaded = false;
    }

    _getLang() {
        const raw = typeof window.currentLang === 'function' ? window.currentLang() : (window.currentLang || 'es');
        return String(raw).split('-')[0].toLowerCase().trim();
    }

    _getPowertrainType(carData) {
        if (carData.powertrain?.type) return carData.powertrain.type;
        if (carData.specs?.engine?.fuelType === 'electric') return 'electric';
        return 'petrol';
    }

    renderSections(carData) {
        const pt = this._getPowertrainType(carData);
        const sectionRenderers = (typeof window !== 'undefined' && window.SECTION_RENDERERS) ? window.SECTION_RENDERERS : (typeof SECTION_RENDERERS !== 'undefined' ? SECTION_RENDERERS : {});
        for (const [key, fn] of Object.entries(sectionRenderers)) {
            if (key.startsWith('_') || typeof fn !== 'function') continue;
            try { fn.call(this, carData); } catch (e) { console.warn('[CarRenderer] Section "' + key + '" render failed:', e); }
        }
        const powertrainRenderers = (typeof window !== 'undefined' && window.POWERTRAIN_RENDERERS) ? window.POWERTRAIN_RENDERERS : (typeof POWERTRAIN_RENDERERS !== 'undefined' ? POWERTRAIN_RENDERERS : {});
        const ptr = powertrainRenderers[pt];
        if (ptr && typeof ptr === 'function') {
            try { ptr.call(this, carData); } catch (e) { console.warn('[CarRenderer] Powertrain "' + pt + '" render failed:', e); }
        }
        this._lastRenderedLang = this._getLang();
        
        // Show hero section after first render to prevent FOUC
        const heroSection = document.getElementById('hero-section');
        if (heroSection && heroSection.hidden) {
            heroSection.hidden = false;
        }
        
        // Show body after first render to prevent FOUC
        const pageBody = document.getElementById('page-body');
        if (pageBody && pageBody.style.display === 'none') {
            pageBody.style.display = '';
        }
    }

    async _waitForI18n() {
        if (typeof translations !== 'undefined' && translations && translations.carLabels && Object.keys(translations.carLabels).length > 0) {
            return;
        }
        if (typeof translations !== 'undefined' && translations && Object.keys(translations).length > 0 && !translations.carLabels) {
            // locale loaded but has no carLabels; proceed
            return;
        }
        return new Promise((resolve) => {
            const onReady = (e) => {
                document.removeEventListener('i18n:ready', onReady);
                resolve();
            };
            document.addEventListener('i18n:ready', onReady);
            // Safety timeout: continue even if i18n event never fires
            setTimeout(() => {
                document.removeEventListener('i18n:ready', onReady);
                resolve();
            }, 2000);
        });
    }

    async render() {
        await this._waitForI18n();
        return this.loadCarData();
    }

    async loadCarData() {
        try {
            let carData;

            if (typeof window !== 'undefined' && window.__preloadedCarData) {
                carData = window.__preloadedCarData;
            } else {
                const response = await fetch(this.carDataFile);
                if (!response.ok) throw new Error('Failed to load car data');
                carData = await response.json();
            }

            // Set carData FIRST so translations can use it even if other steps fail
            if (typeof setCarData === 'function') {
                setCarData(carData);
            }

            // === APPLY PAGE TEXT IMMEDIATELY ===
            const rawLang = typeof window.currentLang === 'function' ? window.currentLang() : (window.currentLang || 'es');
            const currentLang = String(rawLang).split('-')[0].toLowerCase().trim();
            let pt = carData.pageText?.[currentLang] || carData.pageText?.['es'];
            if (!pt) { console.warn('[CarRenderer] pageText missing for lang:', currentLang); pt = {}; }

            // Helper: replace {{key}} placeholders using carData + countryData
            function replacePlaceholders(val) {
                if (typeof val !== 'string') return val;
                const allVars = {};
                if (carData) {
                    allVars.fullModelName = (currentLang === 'ar' && carData.basicInfo?.fullModelNameAr) ? carData.basicInfo.fullModelNameAr : (carData.basicInfo?.fullModelName || '');
                    allVars.shortName = (currentLang === 'ar' && carData.basicInfo?.nameAr) ? carData.basicInfo.nameAr : (carData.basicInfo?.name || '');
                    allVars.modelYear = carData.modelYear || '';
                    allVars.nextYear = carData.nextYear || (carData.modelYear ? (parseInt(carData.modelYear) + 2).toString() : '');
                    allVars.engineType = (currentLang === 'ar' && carData.specs?.engine?.typeAr) ? carData.specs.engine.typeAr : (carData.specs?.engine?.type || '');
                    // Depreciation placeholders
                    if (carData.depreciation) {
                        const d = carData.depreciation;
                        if (d.year3?.percentage !== undefined) allVars.loss3 = 100 - d.year3.percentage;
                        if (d.year3?.km !== undefined) allVars.km3 = d.year3.km.toLocaleString();
                        if (d.year5?.percentage !== undefined) allVars.loss5 = 100 - d.year5.percentage;
                        if (d.year5?.km !== undefined) allVars.km5 = d.year5.km.toLocaleString();
                    }
                    const co2 = carData.fuelEconomy?.petrol?.co2 || carData.fuelEconomy?.diesel?.co2 || carData.fuelEconomy?.emissions?.co2 || carData.emissions?.co2;
                    allVars.co2 = co2 ? co2.value + ' ' + co2.unit : '';
                    // Comparison cars
                    if (Array.isArray(carData.comparisons)) {
                        allVars.car1 = (currentLang === 'ar' && carData.comparisons[0]?.nameAr) ? carData.comparisons[0].nameAr : (carData.comparisons[0]?.name || '');
                        allVars.car2 = (currentLang === 'ar' && carData.comparisons[1]?.nameAr) ? carData.comparisons[1].nameAr : (carData.comparisons[1]?.name || '');
                        allVars.car1FullName = (currentLang === 'ar' && carData.comparisons[0]?.fullNameAr) ? carData.comparisons[0].fullNameAr : (carData.comparisons[0]?.fullName || allVars.car1);
                        allVars.car2FullName = (currentLang === 'ar' && carData.comparisons[1]?.fullNameAr) ? carData.comparisons[1].fullNameAr : (carData.comparisons[1]?.fullName || allVars.car2);
                    }
                    let cc = null;
                    if (typeof currentCountry !== 'undefined' && currentCountry) {
                        cc = currentCountry;
                    } else if (typeof window !== 'undefined' && window.currentCountry) {
                        try { cc = (typeof window.currentCountry === 'function') ? window.currentCountry() : window.currentCountry; } catch (e) { cc = null; }
                    }
                    const currentCountryData = (typeof countryData !== 'undefined' && cc && countryData[cc]) ? countryData[cc] : null;
                    if (currentCountryData) {
                        const localizedCountry = (typeof translations !== 'undefined' && translations && translations.countries && translations.countries[cc]) ? translations.countries[cc] : (currentCountryData.name || carData.country || 'España');
                        allVars.country = localizedCountry;
                        allVars.currency = currentCountryData.currency || 'EUR';
                        if (currentCountryData.priceNew !== undefined) {
                            const rate = currentCountryData.exchangeRateEUR || 1.0;
                            const localPrice = currentCountryData.priceNew;
                            allVars.priceNew = (typeof formatLocalMoney === 'function') ? formatLocalMoney(localPrice) : localPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ' + currentCountryData.currency;
                            allVars.priceNewNum = localPrice;
                            allVars.priceNewEUR = Math.round(localPrice / rate).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' €';
                        }
                        if (currentCountryData.used3Range) allVars.used3Range = currentCountryData.used3Range;
                        if (currentCountryData.used5Range) allVars.used5Range = currentCountryData.used5Range;
                    } else {
                        allVars.country = carData.country || 'España';
                        allVars.currency = 'EUR';
                    }
                }
                if (Object.keys(allVars).length === 0) return val;
                const result = Object.entries(allVars).reduce(
                    (str, [k, v]) => str.replace(new RegExp('\\{\\{' + k + '\\}\\}', 'g'), v || ''),
                    val
                );
                return result;
            }
            window.replaceCarPlaceholders = replacePlaceholders;

            const applyPageText = () => {
                window.applyPageText = applyPageText;
                // Used-car guide cards (only pageText source that matches live template DOM)
                if (pt.usedGuide) {
                    const ugMap = [
                        ['usedGuide.card1Title', 'card1Title'],
                        ['usedGuide.card1Items', 'card1Items'],
                        ['usedGuide.card2Title', 'card2Title'],
                        ['usedGuide.card2Items', 'card2Items'],
                        ['usedGuide.card3Title', 'card3Title'],
                        ['usedGuide.card3Items', 'card3Items'],
                        ['usedGuide.card4Title', 'card4Title'],
                        ['usedGuide.card4Items', 'card4Items']
                    ];
                    ugMap.forEach(([attr, key]) => {
                        const el = document.querySelector(`[data-i18n${key.endsWith('Items') ? '-list' : ''}="${attr}"]`);
                        const val = pt.usedGuide[key];
                        if (!el || !val) return;
                        if (Array.isArray(val)) {
                            el.innerHTML = val.map(item => `<li>${replacePlaceholders(item)}</li>`).join('');
                        } else {
                            el.textContent = replacePlaceholders(val);
                        }
                    });
                }
                // Update used3Range / used5Range spans from country data
                const u3 = document.getElementById('used3Range');
                const u5 = document.getElementById('used5Range');
                let cc2 = null;
                if (typeof currentCountry !== 'undefined' && currentCountry) {
                    cc2 = currentCountry;
                } else if (typeof window !== 'undefined' && window.currentCountry) {
                    try { cc2 = (typeof window.currentCountry === 'function') ? window.currentCountry() : window.currentCountry; } catch (e) { cc2 = null; }
                }
                const ccd = (typeof countryData !== 'undefined' && cc2 && countryData[cc2]) ? countryData[cc2] : null;
                if (u3 && ccd?.used3Range) u3.textContent = ccd.used3Range;
                if (u5 && ccd?.used5Range) u5.textContent = ccd.used5Range;
                // Depreciation loss text
                const depLoss3 = document.querySelector('[data-i18n="dep.loss3"]');
                const depLoss5 = document.querySelector('[data-i18n="dep.loss5"]');
                if (depLoss3 && typeof t === 'function') {
                    const loss3Text = t('dep.loss3');
                    if (loss3Text) depLoss3.textContent = replacePlaceholders(loss3Text);
                }
                if (depLoss5 && typeof t === 'function') {
                    const loss5Text = t('dep.loss5');
                    if (loss5Text) depLoss5.textContent = replacePlaceholders(loss5Text);
                }
                // Version descriptions and other pageText keys that match a data-i18n key
                if (pt.versions) {
                    Object.keys(pt.versions).forEach(function(key) {
                        const el = document.querySelector('[data-i18n="versions.' + key + '"]');
                        if (el && pt.versions[key]) {
                            el.textContent = replacePlaceholders(pt.versions[key]);
                        }
                    });
                }
                // Replace any remaining placeholders in translated text (e.g. section titles)
                document.querySelectorAll('[data-i18n]:not([data-i18n-list])').forEach(el => {
                    if (el.textContent.includes('{{')) el.textContent = replacePlaceholders(el.textContent);
                });
                // Update depreciation bar widths from car data
                if (carData.depreciation) {
                    const d = carData.depreciation;
                    const fill3 = document.getElementById('depFill3');
                    const fill5 = document.getElementById('depFill5');
                    if (fill3 && d.year3?.percentage !== undefined) fill3.style.width = d.year3.percentage + '%';
                    if (fill5 && d.year5?.percentage !== undefined) fill5.style.width = d.year5.percentage + '%';
                }
                // Refresh profile score with car-specific data once pageText is applied
                if (typeof updateProfileLabels === 'function') updateProfileLabels();
            };
            applyPageText();
            setTimeout(applyPageText, 300);
            setTimeout(applyPageText, 800);

            // Setup country data for calculator
            try {
                if (typeof setupCountryData === 'function') {
                    await setupCountryData(carData);
                }
                // Ensure currentCountry is valid for this car's data
                if (typeof countryData !== 'undefined' && countryData && !countryData[currentCountry]) {
                    const fallback = Object.keys(countryData)[0] || 'es';
                    currentCountry = fallback;
                }
                if (typeof applyCountry === 'function') {
                    applyCountry(currentCountry);
                }
                if (typeof updateCalculator === 'function') {
                    updateCalculator();
                }
                // Re-apply pageText now that country data is loaded
                applyPageText();
                setTimeout(applyPageText, 300);
            } catch (countryErr) {
                console.warn('[CarRenderer] Country setup failed (non-critical):', countryErr);
            }

            // Render problems dynamically from car data (multilingual object or single array)
            try {
                const problemsList = document.getElementById('problemsList');
                if (!problemsList || !carData.problems) return;
                const lang = this._getLang ? this._getLang() : 'es';
                let problems = [];
                if (Array.isArray(carData.problems)) {
                    problems = carData.problems;
                } else if (typeof carData.problems === 'object') {
                    problems = carData.problems[lang] || carData.problems['es'] || [];
                }
                if (problems.length) {
                    problemsList.innerHTML = problems.map(p => `<li class="problem-item">${p}</li>`).join('');
                }
            } catch (e) {
                console.warn('[CarRenderer] Problems render failed (non-critical):', e);
            }

            // Interior cards are rendered by SECTION_RENDERERS.interiorDeepDive in car-renderer-registry.js

            // Populate hero content
            try {
                const heroTitle = document.getElementById('heroTitle');
                const heroSubtitle = document.getElementById('heroSubtitle');
                const heroBadge = document.getElementById('heroBadge');
                const heroSection = document.querySelector('.car-hero');
                if (heroTitle) heroTitle.textContent = (currentLang === 'ar' && carData.basicInfo?.fullModelNameAr) ? carData.basicInfo.fullModelNameAr : (carData.basicInfo?.fullModelName || carData.basicInfo?.name || heroTitle.textContent);
                if (heroSubtitle) heroSubtitle.textContent = (currentLang === 'ar' && carData.basicInfo?.taglineAr) ? carData.basicInfo.taglineAr : (carData.basicInfo?.tagline || heroSubtitle.textContent);
                if (heroBadge) heroBadge.textContent = (currentLang === 'ar' && carData.basicInfo?.badgeAr) ? carData.basicInfo.badgeAr : (carData.basicInfo?.badge || heroBadge.textContent);
                const heroImage = carData.images?.hero || carData.heroImage || '';
                if (heroSection && heroImage) heroSection.style.backgroundImage = "url('" + heroImage + "')";
            } catch (e) {
                console.warn('[CarRenderer] Hero populate failed (non-critical):', e);
            }

            // Populate dynamic specs from carData
            try {
                const accel = carData.performance?.acceleration;
                const zeroToHundred = accel?.zeroToHundred ?? accel?.['0-100'];
                const fuelType = carData.specs?.engine?.fuelType;
                const consumption = carData.fuelEconomy?.consumption?.combined
                    || carData.fuelEconomy?.petrol?.combined
                    || carData.fuelEconomy?.diesel?.combined
                    || carData.fuelEconomy?.energyConsumption?.combined
                    || {};
                const curbWeight = carData.dimensions?.curbWeight || carData.dimensions?.weight?.curb || {};
                const drivetrain = carData.specs?.drivetrain?.type || carData.specs?.transmission?.driveMode || carData.drivetrain;
                const drivetrainAr = (currentLang === 'ar' && (carData.specs?.drivetrain?.typeAr || carData.drivetrainAr)) ? (carData.specs?.drivetrain?.typeAr || carData.drivetrainAr) : drivetrain;
                const specMap = {
                quickPower: `${carData.performance?.power?.value} ${(currentLang === 'ar' && typeof translateUnit === 'function') ? translateUnit(carData.performance?.power?.unit) : carData.performance?.power?.unit}`,
                quickAcceleration: zeroToHundred !== undefined ? `${zeroToHundred} ${(currentLang === 'ar' && typeof translateUnit === 'function') ? translateUnit('s') : 's'}` : null,
                quickTopSpeed: `${carData.performance?.topSpeed?.value} ${(currentLang === 'ar' && typeof translateUnit === 'function') ? translateUnit(carData.performance?.topSpeed?.unit) : carData.performance?.topSpeed?.unit}`,
                versionPower1: `✔ ${carData.performance?.power?.value} ${(currentLang === 'ar' && typeof translateUnit === 'function') ? translateUnit(carData.performance?.power?.unit) : carData.performance?.power?.unit}`,
                versionTorque1: `✔ ${carData.performance?.torque?.value} ${(currentLang === 'ar' && typeof translateUnit === 'function') ? translateUnit(carData.performance?.torque?.unit) : carData.performance?.torque?.unit}`,
                versionEngine1: `✔ ${(currentLang === 'ar' && carData.specs?.engine?.typeAr) ? carData.specs.engine.typeAr : carData.specs?.engine?.type}`,
                versionDrivetrain1: `✔ ${drivetrainAr}`,
                versionAccel1: `✔ 0-100 ${(currentLang === 'ar') ? 'في' : 'en'} ${zeroToHundred} ${(currentLang === 'ar' && typeof translateUnit === 'function') ? translateUnit('s') : 's'}`,
                specEngine: (currentLang === 'ar' && carData.specs?.engine?.typeAr) ? carData.specs.engine.typeAr : carData.specs?.engine?.type,
                specPower: `${carData.performance?.power?.value} ${(currentLang === 'ar' && typeof translateUnit === 'function') ? translateUnit(carData.performance?.power?.unit) : carData.performance?.power?.unit}`,
                specTorque: `${carData.performance?.torque?.value} ${(currentLang === 'ar' && typeof translateUnit === 'function') ? translateUnit(carData.performance?.torque?.unit) : carData.performance?.torque?.unit}`,
                specTransmission: `${(currentLang === 'ar' && carData.specs?.transmission?.typeAr) ? carData.specs.transmission.typeAr : carData.specs?.transmission?.type} ${carData.specs?.transmission?.gears} ${(currentLang === 'ar') ? 'سرعات' : 'velocidades'}`,
                specDrivetrain: drivetrainAr,
                specAcceleration: zeroToHundred !== undefined ? `${zeroToHundred} ${(currentLang === 'ar' && typeof translateUnit === 'function') ? translateUnit('s') : 'segundos'}` : null,
                specTopSpeed: `${carData.performance?.topSpeed?.value} ${(currentLang === 'ar' && typeof translateUnit === 'function') ? translateUnit(carData.performance?.topSpeed?.unit) : carData.performance?.topSpeed?.unit}`,
                specConsumption: consumption?.value !== undefined ? `${consumption.value} ${(currentLang === 'ar' && typeof translateUnit === 'function') ? translateUnit('L/100 km') : 'L / 100 km'}` : null,
                specWeight: curbWeight?.value !== undefined ? `${curbWeight.value.toLocaleString()} ${(currentLang === 'ar' && typeof translateUnit === 'function') ? translateUnit(curbWeight.unit || 'kg') : (curbWeight.unit || 'kg')}` : null,
                consumptionCity: `${carData.fuelEconomy?.consumption?.city?.value || carData.fuelEconomy?.petrol?.city?.value} ${(currentLang === 'ar' && typeof translateUnit === 'function') ? translateUnit('L/100 km') : 'L / 100 km'}`,
                consumptionHighway: `${carData.fuelEconomy?.consumption?.highway?.value || carData.fuelEconomy?.petrol?.highway?.value} ${(currentLang === 'ar' && typeof translateUnit === 'function') ? translateUnit('L/100 km') : 'L / 100 km'}`,
                consumptionMixed: `${consumption?.value} ${(currentLang === 'ar' && typeof translateUnit === 'function') ? translateUnit('L/100 km') : 'L / 100 km'}`
            };
            for (const [id, value] of Object.entries(specMap)) {
                const el = document.getElementById(id);
                if (el && value && !value.includes('undefined')) {
                    el.textContent = value;
                }
            }
            } catch (e) {
                console.warn('[CarRenderer] Specs populate failed (non-critical):', e);
            }

            // Render versions dynamically from carData
            try {
                const versionsContainer = document.getElementById('versionsContainer') || document.getElementById('versionsGrid');
                if (versionsContainer && Array.isArray(carData.versions)) {
                // Compute each version's price ratio relative to the base (first) version.
                // This lets us convert every version's price into the selected country's
                // currency/price by scaling the country's priceNew, instead of always
                // showing the static home-market EUR price.
                const baseVersionPrice = carData.versions[0]?.price?.value || 1;
                const versionRatios = carData.versions.map(v => (v.price?.value || baseVersionPrice) / baseVersionPrice);
                const getCountryPriceNew = () => {
                    let cc = null;
                    if (typeof currentCountry !== 'undefined' && currentCountry) cc = currentCountry;
                    else if (typeof window !== 'undefined' && window.currentCountry) {
                        try { cc = (typeof window.currentCountry === 'function') ? window.currentCountry() : window.currentCountry; } catch (e) { cc = null; }
                    }
                    const cd = (typeof countryData !== 'undefined' && cc && countryData[cc]) ? countryData[cc] : null;
                    return cd && cd.priceNew !== undefined ? cd.priceNew : null;
                };
                const fmtPrice = (price, ratio) => {
                    const countryPriceNew = getCountryPriceNew();
                    if (countryPriceNew !== null && typeof formatLocalMoney === 'function') {
                        return formatLocalMoney(countryPriceNew * ratio);
                    }
                    const locale = currentLang === 'ar' ? 'ar-MA' : 'es-ES';
                    return new Intl.NumberFormat(locale, { style: 'currency', currency: price.currency, currencyDisplay: currentLang === 'ar' ? 'name' : 'symbol', maximumFractionDigits: 0 }).format(price.value);
                };
                const defaultVersionName = currentLang === 'ar' ? 'نسخة' : 'Version';
                const localizedVersionHtml = carData.versions.map((v, i) => {
                    const img = v.images?.[0] || v.image || '';
                    const power = v.specs?.power ? `✔ ${v.specs.power.value} ${(currentLang === 'ar' && typeof translateUnit === 'function') ? translateUnit(v.specs.power.unit) : v.specs.power.unit}` : '';
                    const torque = v.specs?.torque ? `✔ ${v.specs.torque.value} ${(currentLang === 'ar' && typeof translateUnit === 'function') ? translateUnit(v.specs.torque.unit) : v.specs.torque.unit}` : '';
                    const features = (currentLang === 'ar' && v.featuresAr) ? v.featuresAr : (v.features || []);
                    const featItems = features.slice(0, 5).map(f => `✔ ${f}`).join('') || '';
                    // Dynamic i18n key: RS7 hardcoded for compatibility, generic fallback for any car
                    const versionDescKey = v.id === 'rs7-sportback' ? 'sportbackDesc'
                        : v.id === 'rs7-performance' ? 'performanceDesc'
                        : v.id === 'rs7-carbon' ? 'carbonDesc'
                        : (v.slug || v.id).replace(/-/g, '') + 'Desc';
                    const safeImg = img ? img : '../images/placeholder.svg';
                    const versionName = (currentLang === 'ar' && v.nameAr) ? v.nameAr : (v.name || defaultVersionName);
                    const altText = versionName;
                    const featNames = { 'matrix-led': 'Matrix LED', 'valcona-leather': 'Cuero Valcona', 'heated-seats': 'Asientos calefactables', 'ventilated-seats': 'Asientos ventilados', 'massaging-seats': 'Masaje lumbar', 'virtual-cockpit': 'Virtual Cockpit', 'mmi-touch': 'MMI Touch', 'bang-olufsen': 'Bang & Olufsen', 'adaptive-cruise': 'Adaptive Cruise', 'lane-assist': 'Lane Assist', 'four-zone-climate': 'Climatización 4 zonas', 'air-suspension': 'Suspensión neumática', 'sport-differential': 'Diferencial deportivo', 'drive-select': 'Drive Select', 'rs-dynamic-package': 'RS Dynamic Package', 'dynamic-steering': 'Dirección dinámica', 'sport-exhaust': 'Escape RS', 'ceramic-brakes': 'Frenos cerámicos', 'carbon-interior': 'Interior carbono' };
                    return `<div class="version-card">
                        ${safeImg ? `<img loading="lazy" src="${safeImg}" alt="${altText}">` : ''}
                        <div class="version-content">
                            <h3 data-i18n="versions.${v.slug}">${versionName}</h3>
                            <h4 data-version-price-index="${i}">${fmtPrice(v.price, versionRatios[i])}</h4>
                            <ul>
                                ${power ? `<li>${power}</li>` : ''}
                                ${torque ? `<li>${torque}</li>` : ''}
                                ${featItems ? features.slice(0, 3).map(f => {
                                    let featLabel = featNames[f] || f;
                                    if (currentLang === 'ar' && typeof t === 'function') {
                                        const translated = t('features.' + f);
                                        if (translated && translated !== 'features.' + f) featLabel = translated;
                                    }
                                    return `<li>✔ ${featLabel}</li>`;
                                }).join('') : ''}
                            </ul>
                            <p data-i18n="versions.${versionDescKey}">${versionName}</p>
                        </div>
                    </div>`;
                }).join('');
                if (typeof _localizeHtml === 'function') versionsContainer.innerHTML = _localizeHtml(localizedVersionHtml, currentLang);
                else versionsContainer.innerHTML = localizedVersionHtml;

                // Keep version prices in sync when the user switches country or language
                const updateVersionPrices = () => {
                    versionsContainer.querySelectorAll('[data-version-price-index]').forEach(el => {
                        const idx = parseInt(el.getAttribute('data-version-price-index'), 10);
                        const v = carData.versions[idx];
                        if (v) el.textContent = fmtPrice(v.price, versionRatios[idx]);
                    });
                };
                document.addEventListener('country:changed', updateVersionPrices);
                document.addEventListener('i18n:ready', updateVersionPrices);
                }
            } catch (e) {
                console.warn('[CarRenderer] Versions render failed (non-critical):', e);
            }

            // Update profile score and bars from carData.rating
            try {
                if (carData.rating) {
                    const profileScore = document.getElementById('profileScoreValue');
                if (profileScore) profileScore.textContent = carData.rating.overall;
                const bars = {
                    'profile.comfort': carData.rating.comfort,
                    'profile.power': carData.rating.performance,
                    'profile.consumption': 100 - (carData.rating.value || 50),
                    'profile.resale': carData.rating.reliability
                };
                    document.querySelectorAll('.profile-bar-row').forEach(row => {
                        const label = row.querySelector('span');
                        const fill = row.querySelector('.pbar-fill');
                        if (label && fill) {
                            const key = label.getAttribute('data-i18n');
                            if (key && bars[key] !== undefined) {
                                fill.style.width = bars[key] + '%';
                            }
                        }
                    });
                    const scoreBox = document.querySelector('.score-box h3');
                    if (scoreBox) scoreBox.textContent = `${carData.rating.overall} / 10`;
                }
            } catch (e) {
                console.warn('[CarRenderer] Profile/Score update failed (non-critical):', e);
            }

            // Re-apply translations with car data
            if (typeof applyTranslations === 'function') {
                applyTranslations();
            }

            // Safety net: re-apply after delays
            setTimeout(() => {
                if (typeof applyTranslations === 'function') {
                    applyTranslations();
                }
            }, 300);

            setTimeout(() => {
                if (typeof applyTranslations === 'function') {
                    applyTranslations();
                }
            }, 800);

            // Hide loader and show content
            showContent();

            // Initialize profile section
            if (typeof updateProfileLabels === 'function') {
                updateProfileLabels();
            }

            // Render new architecture sections
            this.renderSections(carData);

            // Update timeline costs from carData.content.timeline (must run AFTER renderSections creates .timeline-item elements)
            try {
                if (carData.content?.timeline && Array.isArray(carData.content.timeline)) {
                    const timelineItems = document.querySelectorAll('.timeline-item');
                    carData.content.timeline.forEach((item, i) => {
                        if (timelineItems[i]) {
                            const marker = timelineItems[i].querySelector('.timeline-marker');
                            if (marker) marker.textContent = item.km.toLocaleString() + ' km';
                            const costs = timelineItems[i].querySelectorAll('.timeline-costs strong');
                            if (costs.length > 0 && item.cost) {
                                costs[0].textContent = new Intl.NumberFormat('es-ES', { style: 'currency', currency: item.cost.currency }).format(item.cost.value);
                            }
                        }
                    });
                }
            } catch (e) {
                console.warn('[CarRenderer] Timeline update failed (non-critical):', e);
            }

            // Store for re-rendering on language switch
            window.__currentCarData = carData;

            // If i18n:ready fired before data was available, render sections now
            // that translations are loaded.
            if (this._i18nReadyBeforeData && !this._renderedAfterI18n) {
                this._renderedAfterI18n = true;
                this.renderSections(carData);
                if (typeof window.applyPageText === 'function') window.applyPageText();
            }

            return carData;

        } catch (e) {
            console.error('[CarRenderer] Car data load failed:', e);
            if (typeof applyTranslations === 'function') {
                applyTranslations();
            }
            showContent();
        }
    }
}

// ============================================================
// Powertrain renderer shared logic (moved from registry so CarRenderer exists)
// ============================================================

CarRenderer.prototype._renderPowertrainCommon = function(carData, type) {
    const section = document.getElementById('powertrain-sections');
    const body = document.getElementById('powertrainBody');
    if (!section || !body) return;
    const lang = this._getLang();
    const isAr = lang === 'ar';
    const _label = (key, fallback) => {
        if (typeof t === 'function') {
            const tr = t('powertrain.' + key);
            if (tr && tr !== 'powertrain.' + key) return tr;
        }
        return fallback;
    };
    const _unit = (u) => (isAr && typeof translateUnit === 'function') ? translateUnit(u) : u;
    const _val = (v, u) => u ? (_str(v) + ' ' + _unit(u)) : _str(v);
    let html = '';
    const pt = carData.powertrain || {};
    if (pt.description) {
        const desc = (isAr && pt.descriptionAr) ? pt.descriptionAr : pt.description;
        html += '<p>' + _str(desc) + '</p>';
    }

    const engineType = (isAr && carData.specs?.engine?.typeAr) ? carData.specs.engine.typeAr : carData.specs?.engine?.type;
    const fuelType = (isAr && carData.specs?.engine?.fuelTypeAr) ? carData.specs.engine.fuelTypeAr : carData.specs?.engine?.fuelType;
    const transmissionType = (isAr && carData.specs?.transmission?.typeAr) ? carData.specs.transmission.typeAr : carData.specs?.transmission?.type;

    if (type === 'electric') {
        if (carData.specs?.battery) {
            html += '<div class="pt-card"><h4>' + _label('batteryTitle', 'Battery') + '</h4><ul>';
            if (carData.specs.battery.capacity) html += '<li><strong>' + _label('capacityLabel', 'Capacity') + ':</strong> ' + _val(carData.specs.battery.capacity.value, carData.specs.battery.capacity.unit) + '</li>';
            if (carData.specs.battery.range) html += '<li><strong>' + _label('rangeLabel', 'Range') + ':</strong> ' + _val(carData.specs.battery.range.value, carData.specs.battery.range.unit) + '</li>';
            if (carData.specs.battery.charging) {
                const ch = carData.specs.battery.charging;
                if (ch.ac) html += '<li><strong>' + _label('acCharging', 'AC charging') + ':</strong> ' + _str(ch.ac) + '</li>';
                if (ch.dc) html += '<li><strong>' + _label('dcCharging', 'DC fast charging') + ':</strong> ' + _str(ch.dc) + '</li>';
            }
            html += '</ul></div>';
        }
        if (carData.specs?.electricMotor) {
            html += '<div class="pt-card"><h4>' + _label('electricMotorTitle', 'Electric motor') + '</h4><ul>';
            if (carData.specs.electricMotor.power) html += '<li><strong>' + _label('powerLabel', 'Power') + ':</strong> ' + _val(carData.specs.electricMotor.power.value, carData.specs.electricMotor.power.unit) + '</li>';
            if (carData.specs.electricMotor.torque) html += '<li><strong>' + _label('torqueLabel', 'Torque') + ':</strong> ' + _val(carData.specs.electricMotor.torque.value, carData.specs.electricMotor.torque.unit) + '</li>';
            html += '</ul></div>';
        }
    } else if (type === 'phev') {
        if (carData.specs?.engine) {
            html += '<div class="pt-card"><h4>' + _label('engineTitle', 'Engine') + '</h4><ul>';
            if (engineType) html += '<li><strong>' + _label('typeLabel', 'Type') + ':</strong> ' + _str(engineType) + '</li>';
            if (carData.specs.engine.displacement) html += '<li><strong>' + _label('displacementLabel', 'Displacement') + ':</strong> ' + _val(carData.specs.engine.displacement.value, carData.specs.engine.displacement.unit) + '</li>';
            if (fuelType) html += '<li><strong>' + _label('fuelLabel', 'Fuel') + ':</strong> ' + _str(fuelType) + '</li>';
            html += '</ul></div>';
        }
        if (carData.specs?.battery) {
            html += '<div class="pt-card"><h4>' + _label('batteryTitle', 'Battery') + '</h4><ul>';
            if (carData.specs.battery.capacity) html += '<li><strong>' + _label('capacityLabel', 'Capacity') + ':</strong> ' + _val(carData.specs.battery.capacity.value, carData.specs.battery.capacity.unit) + '</li>';
            if (carData.specs.battery.range) html += '<li><strong>' + _label('rangeLabel', 'EV range') + ':</strong> ' + _val(carData.specs.battery.range.value, carData.specs.battery.range.unit) + '</li>';
            html += '</ul></div>';
        }
    } else {
        if (carData.specs?.engine) {
            html += '<div class="pt-card"><h4>' + _label('engineTitle', 'Engine') + '</h4><ul>';
            if (engineType) html += '<li><strong>' + _label('typeLabel', 'Type') + ':</strong> ' + _str(engineType) + '</li>';
            if (carData.specs.engine.displacement) html += '<li><strong>' + _label('displacementLabel', 'Displacement') + ':</strong> ' + _val(carData.specs.engine.displacement.value, carData.specs.engine.displacement.unit) + '</li>';
            if (carData.specs.engine.cylinders) html += '<li><strong>' + _label('cylindersLabel', 'Cylinders') + ':</strong> ' + _str(carData.specs.engine.cylinders) + '</li>';
            if (fuelType) html += '<li><strong>' + _label('fuelLabel', 'Fuel') + ':</strong> ' + _str(fuelType) + '</li>';
            html += '</ul></div>';
        }
        if (carData.specs?.transmission) {
            html += '<div class="pt-card"><h4>' + _label('transmissionTitle', 'Transmission') + '</h4><ul>';
            if (transmissionType) html += '<li><strong>' + _label('typeLabel', 'Type') + ':</strong> ' + _str(transmissionType) + '</li>';
            if (carData.specs.transmission.gears) html += '<li><strong>' + _label('gearsLabel', 'Gears') + ':</strong> ' + _str(carData.specs.transmission.gears) + '</li>';
            html += '</ul></div>';
        }
    }

    if (carData.performance) {
        const accel = carData.performance.acceleration;
        const zeroToHundred = accel?.zeroToHundred ?? accel?.['0-100'];
        html += '<div class="pt-card"><h4>' + _label('performanceTitle', 'Performance') + '</h4><ul>';
        if (carData.performance.power) html += '<li><strong>' + _label('powerLabel', 'Power') + ':</strong> ' + _val(carData.performance.power.value, carData.performance.power.unit) + '</li>';
        if (carData.performance.torque) html += '<li><strong>' + _label('torqueLabel', 'Torque') + ':</strong> ' + _val(carData.performance.torque.value, carData.performance.torque.unit) + '</li>';
        if (zeroToHundred !== undefined) html += '<li><strong>' + _label('accelerationLabel', '0-100 km/h') + ':</strong> ' + _val(zeroToHundred, 's') + '</li>';
        if (carData.performance.topSpeed) html += '<li><strong>' + _label('topSpeedLabel', 'Top speed') + ':</strong> ' + _val(carData.performance.topSpeed.value, carData.performance.topSpeed.unit) + '</li>';
        html += '</ul></div>';
    }

    body.innerHTML = (typeof _localizeHtml === 'function') ? _localizeHtml(html, lang) : html;
    if (html) section.hidden = false;
};

// ============================================================
// Multilingual re-render hook
// ============================================================

document.addEventListener('i18n:ready', function(e) {
    if (!window.carRenderer || typeof window.carRenderer.renderSections !== 'function') return;
    if (!window.__currentCarData) {
        window.carRenderer._i18nReadyBeforeData = true;
        return;
    }
    const newLang = e.detail && e.detail.lang;
    const lastLang = window.carRenderer._lastRenderedLang;
    const alreadyRenderedAfterI18n = window.carRenderer._renderedAfterI18n;
    if (newLang && lastLang && newLang === lastLang && alreadyRenderedAfterI18n) return;
    window.carRenderer._renderedAfterI18n = true;
    window.carRenderer.renderSections(window.__currentCarData);
    if (typeof window.applyPageText === 'function') window.applyPageText();
});

document.addEventListener('country:changed', function(e) {
    if (!window.carRenderer || !window.__currentCarData || typeof window.carRenderer.renderSections !== 'function') return;
    window.carRenderer.renderSections(window.__currentCarData);
    if (typeof window.applyPageText === 'function') window.applyPageText();
});

// Compare button: update URL once car title is known
document.addEventListener('car:rendered', function() {
    const btn = document.getElementById('compareBtn');
    if (!btn) return;
    const title = document.getElementById('heroTitle');
    const carName = title ? title.textContent.trim() : '';
    if (carName) {
        btn.href = 'compare.html?car1=' + encodeURIComponent(carName);
        btn.setAttribute('aria-label', 'Comparar ' + carName);
    }
});

// ============================================================
// Global helpers (exposed for backward compatibility)
// ============================================================

let _contentShown = false;
function showContent() {
    if (_contentShown) {
        return;
    }
    _contentShown = true;
    const loader = document.getElementById('pageLoader');
    if (loader) {
        loader.classList.add('hidden');
    }
    document.body.classList.add('content-ready');
    console.log('[CarRenderer] Content is now visible');
}

let _carDataLoaded = false;

async function safeLoadCarData(carDataFile) {
    if (_carDataLoaded) {
        return;
    }
    _carDataLoaded = true;
    const renderer = new CarRenderer(carDataFile);
    await renderer.loadCarData();
}

// Expose globally
window.CarRenderer = CarRenderer;
window.showContent = showContent;
window.safeLoadCarData = safeLoadCarData;
