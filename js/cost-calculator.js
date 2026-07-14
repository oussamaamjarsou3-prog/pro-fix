/**
 * CarSpecio Cost Calculator
 * Per-car adaptive calculator: fuel, hybrid, electric.
 */
(function() {
    'use strict';

    // --- DOM refs ---
    let annualKm, fuelPrice, purchaseType, drivingStyle;
    let kmDisplay, fuelDisplay, costPerKm;
    let profileCards, profileScoreValue, profileResultTitle, profileResultDesc, profileBars;
    let quizSteps, quizResult, quizProgress;
    const lastCalcValues = {};
    let energyType = 'fuel';
    let calculatorReady = false;

    // ========== 0. CAR / ENERGY DETECTION ==========
    function getCarData() {
        return (typeof carData !== 'undefined') ? carData : null;
    }

    function detectEnergyType() {
        const cd = getCarData();
        if (!cd) return 'fuel';
        const pt = (cd.powertrain && cd.powertrain.type) || (cd.specs && cd.specs.engine && cd.specs.engine.fuelType) || '';
        const ptl = String(pt).toLowerCase();
        if (ptl.includes('electric') || ptl.includes('electrico') || ptl.includes('électrique') || ptl.includes('كهرب')) return 'electric';
        if (ptl.includes('hybrid') || ptl.includes('híbrido') || ptl.includes('hybride') || ptl.includes('phev')) return 'hybrid';
        return 'fuel';
    }

    function getCurrencySymbol(currency) {
        const map = { USD: '$', EUR: '€', GBP: '£', MAD: 'dh', SAR: 'SR', AED: 'AED' };
        return map[currency] || '€';
    }

    function getCurrentCountryData() {
        if (typeof countryData === 'undefined' || typeof currentCountry === 'undefined') return null;
        return countryData[currentCountry] || null;
    }

    function getCurrentLang() {
        if (typeof window !== 'undefined' && typeof window.currentLang === 'function') return window.currentLang();
        if (typeof window !== 'undefined' && window.currentLang) return window.currentLang;
        if (typeof currentLang !== 'undefined') return currentLang;
        return 'es';
    }

    function getConsumptionMap() {
        const cd = getCarData();
        const fe = cd && cd.fuelEconomy;
        if (!fe) return { calm: 10, mixed: 12, sport: 15 };

        if (energyType === 'electric') {
            const kwh = (fe.energyConsumption && fe.energyConsumption.combined && fe.energyConsumption.combined.value) ||
                        (fe.consumption && fe.consumption.combined && fe.consumption.combined.value) || 15.7;
            return { calm: kwh * 0.85, mixed: kwh, sport: kwh * 1.25 };
        }

        if (fe.drivingStyles) {
            var ds = fe.drivingStyles;
            var norm = function(v) { return (typeof v === 'object' && v !== null) ? v.value : v; };
            var calmVal = norm(ds.calm);
            var sportVal = norm(ds.sport);
            var mixedVal = norm(ds.mixed);
            if (!mixedVal) {
                mixedVal = (fe.petrol && fe.petrol.combined && fe.petrol.combined.value) ||
                           (fe.consumption && fe.consumption.combined && fe.consumption.combined.value) || null;
            }
            if (!mixedVal && calmVal && sportVal) mixedVal = (calmVal + sportVal) / 2;
            return {
                calm: calmVal || 10,
                mixed: mixedVal || 12,
                sport: sportVal || 15
            };
        }

        const combined = (fe.consumption && fe.consumption.combined && fe.consumption.combined.value) ||
                         (fe.petrol && fe.petrol.combined && fe.petrol.combined.value) || null;
        if (combined) {
            return { calm: combined * 0.85, mixed: combined, sport: combined * 1.25 };
        }
        return { calm: 10, mixed: 12, sport: 15 };
    }

    function getEnergyLabel() {
        if (energyType === 'electric') return 'Electricidad';
        if (energyType === 'hybrid') return 'Energía (PHEV)';
        return 'Combustible';
    }

    function getEnergyUnit() {
        if (energyType === 'electric') return 'kWh/100km';
        return 'L/100km';
    }

    function getPriceUnit() {
        const c = getCurrentCountryData();
        const fuelMetric = c ? c.fuelMetric !== 0 && c.fuelMetric !== false : true;
        if (energyType === 'electric') {
            if (c && c.currency === 'USD') return '¢/kWh';
            if (c && c.currency === 'GBP') return 'p/kWh';
            if (c && c.currency === 'MAD') return 'MAD/kWh';
            if (c && c.currency === 'SAR') return 'SAR/kWh';
            if (c && c.currency === 'AED') return 'AED/kWh';
            return '€/kWh';
        }
        if (!fuelMetric && c) {
            if (c.currency === 'USD') return '$/gal';
            if (c.currency === 'GBP') return '£/gal';
            return '€/gal';
        }
        if (c && c.currency === 'USD') return '$/L';
        if (c && c.currency === 'GBP') return '£/L';
        if (c && c.currency === 'MAD') return 'MAD/L';
        if (c && c.currency === 'SAR') return 'SAR/L';
        if (c && c.currency === 'AED') return 'AED/L';
        return '€/L';
    }

    function setFuelSliderDefaults() {
        if (!fuelPrice) return;
        if (energyType === 'electric') return;
        const c = getCurrentCountryData();
        const isMetric = c ? c.fuelMetric !== 0 && c.fuelMetric !== false : true;
        const min = c && c.fuelMin ? c.fuelMin : (isMetric ? 150 : 300);
        const max = c && c.fuelMax ? c.fuelMax : (isMetric ? 270 : 500);
        fuelPrice.min = min;
        fuelPrice.max = max;
        fuelPrice.step = c && c.fuelStep ? c.fuelStep : 5;
        const defaultValue = c && c.fuelDefault ? c.fuelDefault : (isMetric ? 178 : 350);
        const currentValue = parseInt(fuelPrice.value) || 0;
        if (currentValue < min || currentValue > max) {
            fuelPrice.value = defaultValue;
        }
    }

    // ========== 1. LABELS (ADAPTIVE) ==========
    function updateCalculatorLabels() {
        const energyLabel = getEnergyLabel();
        const priceUnit = getPriceUnit();

        const _ct = (typeof t === 'function') ? function(key) { return t('cost.calculator.' + key); } : function(key) { return key; };
        const cards = document.querySelectorAll('.calculator-results .calc-result-card');
        if (cards[0]) {
            const span = cards[0].querySelector('span');
            const p = cards[0].querySelector('p');
            if (span) {
                span.textContent = _ct(energyType === 'electric' ? 'electricity' : 'fuel') || energyLabel;
                span.removeAttribute('data-i18n');
            }
            if (p) {
                p.textContent = _ct(energyType === 'electric' ? 'electricityDesc' : 'fuelDesc') || '';
                p.removeAttribute('data-i18n');
            }
        }

        const fuelLabelSpan = document.querySelector('label[for="fuelPrice"] > span');
        if (fuelLabelSpan) {
            fuelLabelSpan.textContent = _ct(energyType === 'electric' ? 'electricityPrice' : 'fuelPrice') || '';
            fuelLabelSpan.removeAttribute('data-i18n');
        }

        const fuelSmall = document.querySelector('#fuelPrice') && document.querySelector('#fuelPrice').closest('.calc-field') ?
            document.querySelector('#fuelPrice').closest('.calc-field').querySelector('small') : null;
        if (fuelSmall) {
            fuelSmall.textContent = _ct(energyType === 'electric' ? 'electricityPriceHelp' : 'fuelPriceHelp') || '';
            fuelSmall.removeAttribute('data-i18n');
        }
    }

    // ========== 2. ANIMATION ==========
    function animateCounter(elementId, targetValue, formatFn) {
        const el = document.getElementById(elementId);
        if (!el) return;
        const parseNum = (str) => { if (!str) return 0; const cleaned = String(str).replace(/[^0-9.-]/g, ''); return parseFloat(cleaned) || 0; };
        const targetNum = parseNum(targetValue);
        const startNum = lastCalcValues[elementId] !== undefined ? lastCalcValues[elementId] : targetNum;
        lastCalcValues[elementId] = targetNum;
        if (startNum === targetNum) {
            el.textContent = targetValue;
            el.classList.remove("value-updated");
            requestAnimationFrame(() => el.classList.add("value-updated"));
            return;
        }
        const duration = 600; const startTime = performance.now();
        function tick(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            const current = startNum + (targetNum - startNum) * eased;
            el.textContent = formatFn(current);
            if (progress < 1) { requestAnimationFrame(tick); }
            else {
                el.textContent = targetValue;
                el.classList.remove("value-updated");
                requestAnimationFrame(() => el.classList.add("value-updated"));
            }
        }
        requestAnimationFrame(tick);
    }

    function highlightValue(elementId, newValue) {
        const el = document.getElementById(elementId);
        if (!el) return;
        animateCounter(elementId, newValue, (n) => {
            const c = getCurrentCountryData();
            if (!c) return Math.round(n).toLocaleString();
            return (typeof formatLocalMoney === 'function') ? formatLocalMoney(n) : (getCurrencySymbol(c.currency) + Math.round(n).toLocaleString(c.locale || 'es-ES'));
        });
    }

    function formatFuelPrice(cents) {
        const c = getCurrentCountryData();
        const unit = getPriceUnit();
        const isSmallDenom = unit.startsWith('¢') || unit.startsWith('p');
        const value = isSmallDenom ? cents : cents / 100;
        const lang = getCurrentLang();
        const locale = lang === 'ar' ? 'ar-MA' : c ? c.locale : 'es-ES';
        const formatted = value.toLocaleString(locale, { minimumFractionDigits: isSmallDenom ? 0 : 2, maximumFractionDigits: isSmallDenom ? 0 : 2 });
        // Use Arabic currency name for MAD when in Arabic
        const unitLocalized = lang === 'ar' && unit === 'MAD/L' ? 'درهم مغربي/لتر' : unit;
        return formatted + ' ' + unitLocalized;
    }

    // ========== 3. CALCULATOR ==========
    function updateCalculator() {
        if (!annualKm || !fuelPrice) return;
        energyType = detectEnergyType();
        setFuelSliderDefaults();
        const c = getCurrentCountryData();
        if (!c) return;

        const km = parseInt(annualKm.value) || 15000;
        const priceCents = parseInt(fuelPrice.value) || (c.fuelDefault || 178);
        const isMetric = c.fuelMetric !== 0 && c.fuelMetric !== false;
        const pricePerUnit = isMetric ? (priceCents / 100) : (priceCents / 100 / 3.78541);
        const style = drivingStyle ? drivingStyle.value : 'mixed';
        const purchase = purchaseType ? purchaseType.value : 'new';
        const consumptionMap = getConsumptionMap();
        const consumption = consumptionMap[style] || consumptionMap.mixed || 12;

        const energyCost = (km / 100) * consumption * pricePerUnit;
        const insurance = (c.insurance || 0) + (c.inspection || 0);
        const maint = (c.maintenance || 0) + (c.tyres || 0);
        const dep = (c.depAnnual && c.depAnnual[purchase]) || 0;
        const total = energyCost + insurance + maint + dep;
        const perKm = total / km;
        const trackOuting = perKm * 150;

        const fmt = (val) => (typeof formatLocalMoney === 'function') ? formatLocalMoney(val) : Math.round(val).toLocaleString();

        if (kmDisplay) kmDisplay.textContent = km.toLocaleString(c.locale || 'es-ES') + " km";
        if (fuelDisplay) fuelDisplay.textContent = formatFuelPrice(priceCents);

        updateCalculatorLabels();

        highlightValue("costFuel", fmt(energyCost));
        highlightValue("costInsurance", fmt(insurance));
        highlightValue("costMaint", fmt(maint));
        highlightValue("costDep", fmt(dep));
        highlightValue("costTotal", fmt(total));

        const sym = getCurrencySymbol(c.currency);
        const perKmFormatted = perKm.toLocaleString(c.locale || 'es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        if (costPerKm) {
            const perKmLine = (typeof t === 'function' ? t('cost.perKmLine') : '') || '{perKm} / km · {track}';
            costPerKm.textContent = perKmLine
                .replace('{perKm}', '≈ ' + sym + perKmFormatted)
                .replace('{track}', fmt(trackOuting));
        }

        const barComp = document.getElementById("barComparison") || document.getElementById("barRs7");
        const barCompVal = document.getElementById("barComparisonVal") || document.getElementById("barRs7Val");
        const maxRef = c.currency === "USD" ? 35000 : 31000;
        if (barComp) barComp.style.width = Math.min(95, (total / maxRef) * 100) + "%";
        if (barCompVal) barCompVal.textContent = fmt(total);
    }

    // ========== 4. PROFILE SCORE ==========
    function getProfileBarsData() {
        if (typeof carData !== 'undefined' && carData && carData.rating && carData.rating.profiles) {
            return carData.rating.profiles;
        }
        return {
            highway: [95, 90, 75, 80], city: [70, 85, 40, 75],
            family: [92, 82, 65, 78], collector: [85, 88, 55, 90], track: [60, 92, 50, 70]
        };
    }

    function computeProfileScore(profile) {
        const barsData = getProfileBarsData();
        const bars = barsData[profile];
        if (!bars || !bars.length) return '--/100';
        const avg = Math.round(bars.reduce(function(a, b) { return a + b; }, 0) / bars.length);
        return avg + '/100';
    }

    function setProfile(profile) {
        if (typeof t !== "function") return;
        const barsData = getProfileBarsData();
        const bars = barsData[profile];
        if (!bars) return;
        if (!profileCards) return;
        profileCards.forEach(c => {
            c.classList.remove("active");
            c.setAttribute('aria-pressed', 'false');
        });
        const activeCard = document.querySelector('[data-profile="' + profile + '"]');
        if (activeCard) {
            activeCard.classList.add("active");
            activeCard.setAttribute('aria-pressed', 'true');
        }
        const rawLangP = typeof window.currentLang === 'function' ? window.currentLang() : (window.currentLang || 'es');
        const currentLangP = String(rawLangP).split('-')[0].toLowerCase().trim();
        const ptP = (typeof carData !== 'undefined' && carData && carData.pageText && carData.pageText[currentLangP]) ? carData.pageText[currentLangP] : null;
        const pData = ptP && ptP.profileData && ptP.profileData[profile];
        const profileScore = (pData && pData.score) || computeProfileScore(profile);
        if (profileScoreValue) profileScoreValue.textContent = profileScore;
        if (profileResultTitle) profileResultTitle.textContent = (pData && pData.title) || t("profileData." + profile + ".title");
        if (profileResultDesc) profileResultDesc.textContent = (pData && pData.desc) || t("profileData." + profile + ".desc");
        const labels = [t("profile.comfort"), t("profile.power"), t("profile.consumption"), t("profile.resale")];
        if (profileBars) {
            profileBars.innerHTML = labels.map((label, i) =>
                '<div class="profile-bar-row"><span>' + label + '</span><div class="pbar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + bars[i] + '" aria-label="' + label + '"><div class="pbar-fill" style="width:' + bars[i] + '%"></div></div></div>'
            ).join("");
        }
    }

    function updateProfileLabels() {
        const active = document.querySelector(".profile-card.active");
        setProfile(active && active.dataset.profile ? active.dataset.profile : "highway");
    }

    // ========== 5. QUIZ ==========
    let quizStep = 1; let quizCar1 = 0; let quizCar2 = 0;

    function getQuizTexts() {
        if (typeof t !== 'function') return { car1: 'Car 1', car2: 'Car 2', tie: "It's a tie!", tieTitle: 'Tie' };
        const carNames = getComparisonCarNames();
        return {
            car1: carNames.car1,
            car2: carNames.car2,
            tie: t("quizResults.tie") || "It's a tie!",
            tieTitle: t("quizResults.tieTitle") || 'Tie'
        };
    }

    function getComparisonCarNames() {
        const cd = getCarData();
        const comparisons = (cd && cd.comparisons) ? cd.comparisons : [];
        const lang = getCurrentLang();
        const isAr = lang === 'ar';
        const currentCarName = isAr && cd.basicInfo && cd.basicInfo.fullModelNameAr ? cd.basicInfo.fullModelNameAr : (cd && cd.basicInfo && cd.basicInfo.fullModelName) ? cd.basicInfo.fullModelName : (cd && cd.basicInfo && cd.basicInfo.name) ? cd.basicInfo.name : 'Car 1';
        const rivalName = comparisons[0] && comparisons[0].nameAr && isAr ? comparisons[0].nameAr : comparisons[0] && comparisons[0].name ? comparisons[0].name : 'Car 2';
        return {
            car1: currentCarName,
            car2: rivalName
        };
    }

    function initQuiz() {
        if (!quizSteps || !quizSteps.length) return;
        quizSteps.forEach(s => s.classList.remove("active"));
        if (quizSteps[0]) quizSteps[0].classList.add("active");
        if (quizProgress) quizProgress.style.width = "25%";
        document.querySelectorAll(".quiz-opt").forEach(btn => {
            btn.setAttribute('aria-pressed', 'false');
            btn.addEventListener("click", () => {
                const step = quizSteps[quizStep - 1];
                if (step) step.querySelectorAll('.quiz-opt').forEach(b => b.setAttribute('aria-pressed', 'false'));
                btn.setAttribute('aria-pressed', 'true');
                const pts = btn.dataset.points;
                if (pts === "car1" || pts === "rs7") quizCar1++;
                else if (pts === "car2" || pts === "m5") quizCar2++;
                if (quizSteps[quizStep - 1]) quizSteps[quizStep - 1].classList.remove("active");
                if (quizStep < 4) {
                    quizStep++;
                    if (quizSteps[quizStep - 1]) quizSteps[quizStep - 1].classList.add("active");
                    if (quizProgress) quizProgress.style.width = (quizStep / 4 * 100) + "%";
                } else {
                    quizSteps.forEach(s => s.classList.remove("active"));
                    if (quizResult) quizResult.hidden = false;
                    if (quizProgress) quizProgress.style.width = "100%";
                    const quizTexts = getQuizTexts();
                    const carNames = getComparisonCarNames();
                    let winner, text;
                    if (quizCar1 > quizCar2) { winner = carNames.car1; text = quizTexts.car1; }
                    else if (quizCar2 > quizCar1) { winner = carNames.car2; text = quizTexts.car2; }
                    else { winner = quizTexts.tieTitle; text = quizTexts.tie; }
                    const rt = document.getElementById("quizResultTitle");
                    const rtxt = document.getElementById("quizResultText");
                    if (rt) rt.textContent = winner;
                    if (rtxt) rtxt.textContent = text;
                }
            });
        });
    }

    // ========== 6. SCROLL TOP ==========
    function initScrollTop() {
        const btn = document.createElement("button");
        btn.id = "scrollTopBtn"; btn.innerHTML = "↑";
        btn.setAttribute("aria-label", typeof t === 'function' ? t('a11y.scrollTop') || "Volver arriba" : "Volver arriba");
        document.body.appendChild(btn);
        window.addEventListener("scroll", () => { btn.classList.toggle("visible", window.scrollY > 600); });
        btn.addEventListener("click", () => { window.scrollTo({ top: 0, behavior: "smooth" }); });
    }

    // ========== 7. FOOTER NEWSLETTER ==========
    function handleFooterSubscribe(e) {
        e.preventDefault();
        const form = e.target;
        const input = form.querySelector('input[type="email"]');
        const btn = form.querySelector('button[type="submit"]');
        const email = input.value.trim();
        if (!email || !email.includes('@')) {
            input.style.borderColor = '#ef4444'; input.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.2)';
            setTimeout(() => { input.style.borderColor = ''; input.style.boxShadow = ''; }, 2000);
            return;
        }
        const originalText = btn.textContent;
        btn.textContent = typeof t === 'function' ? t('footer.subscribing') || 'Enviando...' : 'Enviando...';
        btn.disabled = true; btn.style.opacity = '0.7';
        setTimeout(() => {
            btn.textContent = typeof t === 'function' ? t('footer.subscribed') || '¡Gracias!' : '¡Gracias!';
            btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)'; btn.style.opacity = '1'; input.value = '';
            setTimeout(() => { btn.textContent = originalText; btn.disabled = false; btn.style.background = ''; }, 3000);
        }, 1200);
    }

    function initFooterNewsletter() {
        const footerForm = document.querySelector('.footer-newsletter form, footer form');
        if (footerForm) footerForm.addEventListener('submit', handleFooterSubscribe);
    }

    // ========== 8. INITIALIZATION ==========
    function initCostCalculator() {
        annualKm = document.getElementById("annualKm");
        fuelPrice = document.getElementById("fuelPrice");
        purchaseType = document.getElementById("purchaseType");
        drivingStyle = document.getElementById("drivingStyle");
        kmDisplay = document.getElementById("kmDisplay");
        fuelDisplay = document.getElementById("fuelDisplay");
        costPerKm = document.getElementById("costPerKm");
        profileCards = document.querySelectorAll(".profile-card");
        profileScoreValue = document.getElementById("profileScoreValue");
        profileResultTitle = document.getElementById("profileResultTitle");
        profileResultDesc = document.getElementById("profileResultDesc");
        profileBars = document.getElementById("profileBars");

        energyType = detectEnergyType();

        if (profileCards.length) {
            profileCards.forEach(card => card.addEventListener('click', () => setProfile(card.dataset.profile)));
            const active = document.querySelector('.profile-card.active') || profileCards[0];
            if (active) setProfile(active.dataset.profile);
        }
        quizSteps = document.querySelectorAll(".quiz-step");
        quizResult = document.getElementById("quizResult");
        quizProgress = document.getElementById("quizProgress");

        const inputs = [annualKm, fuelPrice, purchaseType, drivingStyle];
        inputs.forEach(el => { if (el) el.addEventListener("input", updateCalculator); });

        // Recalculate when country changes (insurance/maintenance values are country-specific)
        document.addEventListener('country:changed', () => updateCalculator());
        // Re-render when language changes to update numeral formatting (e.g., Arabic numerals)
        document.addEventListener('i18n:ready', () => updateCalculator());
        // Update purchase type dropdown options with translations
        document.addEventListener('i18n:ready', updatePurchaseTypeOptions);

        initQuiz(); initScrollTop(); initFooterNewsletter();

        calculatorReady = true;
        updateCalculator();
    }

    // Expose globally
    window.updateCalculator = updateCalculator;
    window.setProfile = setProfile;

    function updatePurchaseTypeOptions() {
        if (!purchaseType) return;
        const lang = getCurrentLang();
        const t = (typeof window !== 'undefined' && window.t) ? window.t : function(key) { return key; };
        const options = purchaseType.querySelectorAll('option');
        const translations = {
            'new': t('cost.calculator.new'),
            'used3': t('cost.calculator.used3'),
            'used5': t('cost.calculator.used5')
        };
        const c = getCurrentCountryData();
        options.forEach(opt => {
            const value = opt.value;
            if (translations[value]) {
                const price = (value === 'new' && c?.priceNew) ? c.priceNew : (value === 'used3' && c?.dep3) ? c.dep3 : (value === 'used5' && c?.dep5) ? c.dep5 : null;
                const priceStr = price ? ' (' + (typeof formatLocalMoney === 'function' ? formatLocalMoney(price) : price) + ')' : '';
                opt.textContent = translations[value] + priceStr;
            }
        });
    }
    window.updateProfileLabels = updateProfileLabels;
    window.handleFooterSubscribe = handleFooterSubscribe;
    window.getConsumptionMap = getConsumptionMap;
    window.highlightValue = highlightValue;
    window.animateCounter = animateCounter;
    window.initCostCalculator = initCostCalculator;
    window.detectEnergyType = detectEnergyType;

    // Auto-init
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCostCalculator);
    } else {
        initCostCalculator();
    }
})();
