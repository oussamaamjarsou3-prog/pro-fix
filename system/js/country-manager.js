/**
 * carspecio Country Manager
 * Centralized country data handling using system/registry/country-registry.json
 * Merges registry metadata with car-specific pricing from JSON data files.
 */
(function() {
    'use strict';

    // ===== State =====
    let registry = null;
    let registryLoadPromise = null;
    let currentCountry = localStorage.getItem("carspecio-country") || localStorage.getItem("carspecio-rs7-country") || "es";
    let countryData = {}; // Merged registry + car-specific pricing

    function getCurrentLang() {
        if (typeof currentLang !== 'undefined' && currentLang) return currentLang;
        if (typeof localStorage !== 'undefined') {
            const ls = localStorage.getItem('carspecio-lang');
            if (ls) return ls;
        }
        return 'es';
    }

    const CURRENCY_NAMES_AR = {
        USD: 'دولار أمريكي',
        EUR: 'يورو',
        GBP: 'جنيه إسترليني',
        MAD: 'درهم مغربي',
        SAR: 'ريال سعودي',
        AED: 'درهم إماراتي'
    };

    function getRegionNameAr(code, regionName) {
        if (!registry) return regionName;
        const reg = registry.find(r => r.id === code);
        if (!reg || !reg.regions) return regionName;
        const region = reg.regions.find(r => r.name === regionName || r.nameAr === regionName || r.id === regionName);
        return region?.nameAr || regionName;
    }

    // ===== Load Registry =====
    async function loadRegistry() {
        if (registry) return registry;
        if (registryLoadPromise) return registryLoadPromise;
        registryLoadPromise = (async () => {
            try {
                const res = await fetch('system/registry/country-registry.json');
                if (res.ok) {
                    const data = await res.json();
                    registry = data.countries || [];
                    return registry;
                }
            } catch (err) {
                console.warn('[CountryManager] Failed to load registry:', err);
            }
            registry = [];
            return registry;
        })();
        return registryLoadPromise;
    }

    // ===== Merge Registry + Car Pricing =====
    async function loadCarCountryData(carPricing) {
        if (!registry) {
            await loadRegistry();
        }

        countryData = {};
        for (const [code, carData] of Object.entries(carPricing)) {
            const reg = registry.find(r => r.id === code);
            if (reg) {
                // Merge: registry base + car-specific overrides
                // Map registry base names to standard names used by calculators
                const base = {
                    name: reg.name,
                    flag: reg.flag,
                    currency: reg.currency,
                    locale: reg.locale,
                    fuelMetric: reg.fuelMetric,
                    // Fallback values from registry if car data doesn't provide
                    insurance: reg.insuranceBase,
                    maintenance: reg.maintenanceBase,
                    tyres: reg.tyresBase,
                    oilChange: reg.oilChangeBase,
                    inspection: reg.inspection,
                    roadTax: reg.roadTax
                };
                countryData[code] = Object.assign({}, base, carData);
            } else {
                countryData[code] = carData;
            }
        }
    }

    // Backward-compatible wrapper that accepts full carData object
    async function setupCountryData(carData) {
        if (carData && carData.countryPricing) {
            await loadCarCountryData(carData.countryPricing);
            // Pre-compute local-currency servicing costs from localized runningCosts
            const rcLang = (typeof localStorage !== 'undefined' && localStorage.getItem('carspecio-lang')) || 'es';
            const runningCosts = carData.runningCosts[rcLang] || carData.runningCosts.es || carData.runningCosts.en || carData.runningCosts;
            const servicing = runningCosts?.servicing;
            if (servicing) {
                for (const code of Object.keys(countryData)) {
                    const c = countryData[code];
                    const rate = c.exchangeRateEUR || 1;
                    if (servicing.costMinor && typeof servicing.costMinor.value === 'number') {
                        c.servicingMinor = servicing.costMinor.value * rate;
                    }
                    if (servicing.costMajor && typeof servicing.costMajor.value === 'number') {
                        c.servicingMajor = servicing.costMajor.value * rate;
                    }
                }
            }
            // Map country-specific road tax strings when available
            // runningCosts keys are country names (spain, uk, germany); convert to country codes.
            const roadTaxMap = runningCosts?.roadTax;
            const countryNameToCode = { gb: 'uk', de: 'germany', es: 'spain' };
            if (roadTaxMap) {
                for (const code of Object.keys(countryData)) {
                    const key = countryNameToCode[code];
                    if (key && roadTaxMap[key]) {
                        countryData[code].roadTax = roadTaxMap[key];
                    }
                }
            }
            // Fallback: format registry roadTax value as a string for countries without localized text
            for (const code of Object.keys(countryData)) {
                const c = countryData[code];
                if (typeof c.roadTax === 'number') {
                    const sym = c.currency === 'USD' ? '$' : c.currency === 'GBP' ? '£' : c.currency === 'EUR' ? '€' : '';
                    const suffix = c.currency === 'MAD' ? ' MAD' : c.currency === 'SAR' ? ' SAR' : c.currency === 'AED' ? ' AED' : '';
                    const amount = Math.round(c.roadTax).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
                    c.roadTax = (sym + amount + suffix) + '/' + (getCurrentLang() === 'ar' ? 'سنة' : 'año');
                }
            }
            return countryData;
        }
    }

    // ===== Helpers =====
    function formatMoney(amount) {
        const c = countryData[currentCountry];
        if (!c) return getCurrentLang() === 'ar' ? "0 يورو" : "0 €";
        // Convert to EUR using exchange rate
        const rate = c.exchangeRateEUR || 1.0;
        const eurAmount = Math.round(amount / rate);
        // Use space as thousands separator for readability
        const formatted = eurAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        return getCurrentLang() === 'ar' ? formatted + " يورو" : formatted + " €";
    }

    function formatLocalMoney(amount) {
        const c = countryData[currentCountry];
        if (!c) return "0";
        const rounded = Math.round(amount);
        const lang = getCurrentLang();
        const locale = lang === 'ar' ? 'ar-MA' : c.locale || 'es-ES';
        const formatted = rounded.toLocaleString(locale);
        if (lang === 'ar') {
            const name = CURRENCY_NAMES_AR[c.currency] || c.currency;
            return formatted + ' ' + name;
        }
        const sym = c.currency === 'USD' ? '$' : c.currency === 'GBP' ? '£' : c.currency === 'MAD' ? '' : c.currency === 'SAR' ? '' : c.currency === 'AED' ? '' : '';
        if (c.currency === 'EUR') return formatted + ' €';
        if (c.currency === 'USD') return '$' + formatted;
        if (c.currency === 'GBP') return '£' + formatted;
        // For MAD, SAR, AED just show number with currency code after
        return formatted + ' ' + c.currency;
    }

    function getFuelCostPerLiter(cents, code) {
        const c = countryData[code || currentCountry];
        if (!c) return cents / 100;
        const price = cents / 100;
        // If fuel is measured in gallons (not metric), convert price to per-liter
        if (c.fuelMetric === 0 || c.fuelMetric === false) {
            return price / 3.785;
        }
        return price;
    }

    function formatFuelDisplay(cents, countryCode) {
        const code = countryCode || currentCountry;
        const c = countryData[code];
        if (!c) return cents + " c";
        const value = cents / 100;
        const formatted = value.toLocaleString(c.locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        if (getCurrentLang() === 'ar') {
            const name = CURRENCY_NAMES_AR[c.currency] || c.currency;
            return formatted + ' ' + name;
        }
        // Use correct currency symbol
        const symMap = { USD: '$', EUR: '€', GBP: '£', MAD: 'dh', SAR: 'SR', AED: 'AED' };
        const sym = symMap[c.currency] || (c.currency === 'USD' ? '$' : '€');
        return c.currency === 'USD' || c.currency === 'GBP' ? sym + formatted : formatted + ' ' + sym;
    }

    // ===== Apply Country Change =====
    function applyCountry(countryCode) {
        currentCountry = countryCode;
        localStorage.setItem("carspecio-country", countryCode);

        let c = countryData[countryCode];
        if (!c && countryCode.toLowerCase && countryCode !== countryCode.toLowerCase()) {
            c = countryData[countryCode.toLowerCase()];
        }
        if (!c) {
            const dataLoaded = Object.keys(countryData || {}).length > 0;
            if (dataLoaded) console.warn('[CountryManager] No data for country:', countryCode);
            return;
        }

        const tr = typeof t === 'function' ? t : (k) => k;
        const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        const cName = tr("countries." + countryCode) || c.name;

        // --- Toggle button icon & text ---
        const toggleBtn = document.getElementById('countryToggle');
        if (toggleBtn) {
            const iconSpan = toggleBtn.querySelector('.btn-icon');
            const textSpan = toggleBtn.querySelector('.btn-text');
            if (iconSpan) {
                if (window.createFlagImg) {
                    iconSpan.innerHTML = '';
                    iconSpan.appendChild(window.createFlagImg(countryCode));
                } else {
                    iconSpan.textContent = '';
                }
            }
            if (textSpan) textSpan.textContent = countryCode.toUpperCase();
            toggleBtn.setAttribute('data-country', countryCode);
        }

        // --- Flag & Name ---
        set("countryFlag", c.flag || '');
        set("countryName", cName);
        set("countryBannerName", cName);
        const bannerFlagEl = document.getElementById('countryBannerFlag');
        if (bannerFlagEl) {
            bannerFlagEl.innerHTML = '';
            if (window.createFlagImg) {
                bannerFlagEl.appendChild(window.createFlagImg(countryCode));
            }
        }

        // --- Prices ---
        if (c.priceNew !== undefined) {
            set("priceMain", formatLocalMoney(c.priceNew));
            set("versionPrice1", formatLocalMoney(c.priceNew));
            set("countryQuickPrice", formatLocalMoney(c.priceNew));
            set("countryQuickPriceLabel", tr("country.priceQuickLabel", { country: cName }) || tr("country.priceLabel"));
        }
        if (c.pricePerformance !== undefined) set("versionPrice2", formatLocalMoney(c.pricePerformance));
        if (c.priceCarbon !== undefined) set("versionPrice3", formatLocalMoney(c.priceCarbon));
        // Price breakdown (base / taxes / total)
        if (c.priceNew !== undefined) set("priceBase", formatLocalMoney(c.priceNew));
        if (c.fiscalRows && c.fiscalRows.length > 0 && c.priceNew !== undefined) {
            const row = c.fiscalRows[0];
            const finalPrice = Array.isArray(row) && row.length >= 4 ? row[row.length - 1] : null;
            if (finalPrice) {
                const taxes = finalPrice - c.priceNew;
                set("priceTaxes", formatLocalMoney(taxes));
                set("priceTotal", formatLocalMoney(finalPrice));
            }
        }

        // --- Depreciation ---
        if (c.priceNew !== undefined) set("depNew", formatLocalMoney(c.priceNew));
        if (c.dep3 !== undefined) set("dep3", formatLocalMoney(c.dep3));
        if (c.dep5 !== undefined) set("dep5", formatLocalMoney(c.dep5));

        // --- Used ranges ---
        if (c.used3Range !== undefined) set("used3Range", localizeCurrencyCodes(c.used3Range));
        if (c.used5Range !== undefined) set("used5Range", localizeCurrencyCodes(c.used5Range));

        // --- Maintenance ---
        updateMaintenanceSection(c);

        // --- Rivals ---
        // Legacy hardcoded rival fields
        if (c.rivalM5 !== undefined) set("barM5Val", formatLocalMoney(c.rivalM5));
        if (c.rivalAmg !== undefined) set("barAmgVal", formatLocalMoney(c.rivalAmg));
        // Generic rivals object (future-proof)
        if (c.rivals && typeof carData !== 'undefined' && carData && carData.comparisons) {
            carData.comparisons.forEach((rival, i) => {
                const price = c.rivals[rival.carId];
                if (price !== undefined) {
                    const barValId = 'barRival' + (i + 1) + 'Val';
                    const barFillId = 'barRival' + (i + 1);
                    set(barValId, formatLocalMoney(price));
                }
            });
        }

        // --- Options ---
        if (Array.isArray(c.options)) {
            document.querySelectorAll(".option-price").forEach((cell, i) => {
                const val = c.options[i];
                if (val === undefined) return;
                const stdLabel = tr("options.standard") || "estándar";
                cell.textContent = val === 0 ? formatLocalMoney(0) + " (" + stdLabel + ")" : formatLocalMoney(val);
            });
        }

        // --- Fuel slider ---
        const fuelSlider = document.getElementById("fuelPrice");
        if (fuelSlider) {
            if (c.fuelMin !== undefined) fuelSlider.min = c.fuelMin;
            if (c.fuelMax !== undefined) fuelSlider.max = c.fuelMax;
            if (c.fuelStep !== undefined) fuelSlider.step = c.fuelStep;
            if (c.fuelDefault !== undefined) fuelSlider.value = c.fuelDefault;
        }

        // --- Purchase type select ---
        const purchaseSelect = document.getElementById("purchaseType");
        if (purchaseSelect) {
            purchaseSelect.innerHTML =
                '<option value="new">' + tr("calc.new") + " (" + (c.priceNew !== undefined ? formatLocalMoney(c.priceNew) : "") + ")</option>" +
                '<option value="used3">' + tr("calc.used3") + " (" + (c.dep3 !== undefined ? formatLocalMoney(c.dep3) : "") + ")</option>" +
                '<option value="used5">' + tr("calc.used5") + " (" + (c.dep5 !== undefined ? formatLocalMoney(c.dep5) : "") + ")</option>";
        }

        // --- Fiscal table ---
        updateFiscalTable(c);

        // --- Options table ---
        updateOptionsTable(c);

        // --- Calculator ---
        if (typeof window.updateCalculator === 'function') {
            window.updateCalculator();
        }

        // --- Re-apply translations to update country-dependent placeholders ---
        if (typeof applyTranslations === 'function') {
            applyTranslations();
        }

        // --- Dispatch event ---
        document.dispatchEvent(new CustomEvent('country:changed', {
            detail: { country: countryCode, data: c }
        }));
    }

    function localizeCurrencyCodes(str) {
        if (typeof str !== 'string' || getCurrentLang() !== 'ar') return str;
        return str
            .replace(/\bUSD\b/g, 'دولار أمريكي')
            .replace(/\bEUR\b/g, 'يورو')
            .replace(/\bGBP\b/g, 'جنيه إسترليني')
            .replace(/\bMAD\b/g, 'درهم مغربي')
            .replace(/\bSAR\b/g, 'ريال سعودي')
            .replace(/\bAED\b/g, 'درهم إماراتي');
    }

    function updateFiscalTable(c) {
        const fiscalHead = document.getElementById("fiscalTableHead");
        const fiscalBody = document.getElementById("fiscalTableBody");
        const fiscalNote = document.getElementById("fiscalNote");

        // Unified 6-column header: Region | Tax | Car Price | Tax Amount | Fee | Final Price
        if (fiscalHead) {
            const tr = typeof t === 'function' ? t : (k) => k;
            const hRegion = tr("fiscal.region") || "Region";
            const hTax = tr("fiscal.tax") || "Tax";
            const hCarPrice = tr("fiscal.carPrice") || "Car Price";
            const hAmount = tr("fiscal.taxAmount") || "Tax Amount";
            const hFee = tr("fiscal.fee") || "Fee";
            const hFinal = tr("fiscal.final") || "Final Price";
            fiscalHead.innerHTML = `<tr><th>${hRegion}</th><th>${hTax}</th><th>${hCarPrice}</th><th>${hAmount}</th><th>${hFee}</th><th>${hFinal}</th></tr>`;
        }
        if (fiscalBody && c.fiscalRows) {
            const priceNew = c.priceNew || 0;
            const isAr = getCurrentLang() === 'ar';
            fiscalBody.innerHTML = c.fiscalRows.map(row => {
                // row = [region, taxDesc, fee, finalPrice] (4 elements from JSON)
                let region = row[0];
                const taxDesc = row[1];
                const fee = typeof row[2] === "number" ? row[2] : 0;
                const finalPrice = typeof row[3] === "number" ? row[3] : 0;
                if (isAr) {
                    region = getRegionNameAr(currentCountry, region);
                }
                // Calculate tax amount = final - priceNew - fee
                const taxAmount = Math.max(0, finalPrice - priceNew - fee);
                return `<tr><td>${region}</td><td>${taxDesc}</td><td>${formatLocalMoney(priceNew)}</td><td><strong>${formatLocalMoney(taxAmount)}</strong></td><td>${formatLocalMoney(fee)}</td><td><strong>${formatLocalMoney(finalPrice)}</strong></td></tr>`;
            }).join("");
        }
        if (fiscalNote && c.fiscalNote) {
            fiscalNote.textContent = c.fiscalNote;
        }
    }

    function updateOptionsTable(c) {
        console.log('[updateOptionsTable] Called with country data:', c);
        console.log('[updateOptionsTable] window.carData:', typeof window.carData !== 'undefined' ? window.carData : 'undefined');
        const tbody = document.getElementById("optionsTableBody");
        console.log('[updateOptionsTable] tbody element:', tbody);
        if (!tbody || !c.options) {
            console.log('[updateOptionsTable] Early return - tbody:', !!tbody, 'c.options:', !!c.options);
            return;
        }

        // Get global option definitions (name, worthIt, resale)
        const globalOpts = (typeof window.carData !== 'undefined' && window.carData !== null && window.carData.options) ? window.carData.options : [];
        console.log('[updateOptionsTable] globalOpts length:', globalOpts.length, 'c.options length:', c.options.length);
        console.log('[updateOptionsTable] globalOpts sample:', globalOpts.slice(0, 2));
        console.log('[updateOptionsTable] c.options sample:', c.options.slice(0, 2));

        // Check if we should show EUR column (non-EUR countries)
        const showEUR = c.currency !== 'EUR';

        tbody.innerHTML = c.options.map((price, i) => {
            const globalOpt = globalOpts[i] || {};
            const name = globalOpt.name || ("Option " + (i + 1));
            const worthIt = globalOpt.worthIt;
            const resale = globalOpt.resaleImpact || "neutral";

            // Determine tag
            let tagClass = "tag-maybe";
            let tagText = "Gustos";
            if (price === 0) {
                tagClass = "tag-yes";
                tagText = "Imprescindible";
            } else if (worthIt === true) {
                tagClass = "tag-yes";
                tagText = "Sí";
            } else if (worthIt === false) {
                tagClass = "tag-no";
                tagText = "No recomendado";
            }

            // Determine resale impact text
            let resaleText = "= Neutral";
            if (resale === "high") resaleText = "+ Alto";
            else if (resale === "medium") resaleText = "+ Medio";
            else if (resale === "low") resaleText = "- Bajo";
            else if (resale === "neutral") resaleText = "= Neutral";

            // Price display: local currency + EUR for comparison
            let priceStr;
            if (price === 0) {
                priceStr = "Incluido";
            } else if (showEUR) {
                priceStr = formatLocalMoney(price) + ' <span class="eur-price">(' + formatMoney(price) + ')</span>';
            } else {
                priceStr = formatLocalMoney(price);
            }

            return `<tr><td>${name}</td><td class="option-price">${priceStr}</td><td><span class="tag ${tagClass}">${tagText}</span></td><td>${resaleText}</td></tr>`;
        }).join("");
    }

    function updateMaintenanceSection(c) {
        console.log('[updateMaintenanceSection] Called with country data:', c);
        console.log('[updateMaintenanceSection] oilChange:', c.oilChange, 'tyres:', c.tyres, 'insurance:', c.insurance);
        console.log('[updateMaintenanceSection] roadTax:', c.roadTax, 'servicingMinor:', c.servicingMinor, 'servicingMajor:', c.servicingMajor);
        const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        if (c.oilChange !== undefined) set("maintOil", formatLocalMoney(c.oilChange));
        if (c.tyres !== undefined) set("maintTyres", formatLocalMoney(c.tyres));
        if (c.insurance !== undefined) set("maintInsurance", formatLocalMoney(c.insurance));
        if (c.roadTax !== undefined) set("maintRoadTax", typeof c.roadTax === 'string' ? c.roadTax : formatLocalMoney(c.roadTax));
        if (c.servicingMinor !== undefined) set("maintMinor", formatLocalMoney(c.servicingMinor));
        if (c.servicingMajor !== undefined) set("maintMajor", formatLocalMoney(c.servicingMajor));
        // Insurance group: prefer country-specific from runningCosts when available
        if (typeof window.carData !== 'undefined' && window.carData && window.carData.runningCosts) {
            const lang = getCurrentLang();
            const rc = window.carData.runningCosts[lang] || window.carData.runningCosts.es || window.carData.runningCosts;
            console.log('[updateMaintenanceSection] runningCosts lang:', lang, 'rc:', rc);
            const countryMap = { gb: 'uk', de: 'germany', es: 'spain', it: 'spain', fr: 'spain', ma: 'spain', ae: 'spain', sa: 'spain', us: 'spain' };
            const igKey = countryMap[currentCountry];
            const group = igKey ? rc?.insuranceGroups?.[igKey] : null;
            console.log('[updateMaintenanceSection] igKey:', igKey, 'group:', group);
            set("maintInsuranceGroup", group || '--');
        }
    }

    // ===== Auto-init =====
    loadRegistry();

    // ===== Public API =====
    window.CountryManager = {
        loadRegistry,
        loadCarCountryData,
        setupCountryData,
        applyCountry,
        formatMoney,
        getFuelCostPerLiter,
        formatFuelDisplay,
        updateFiscalTable,
        updateOptionsTable,
        get countryData() { return countryData; },
        get currentCountry() { return currentCountry; },
        set currentCountry(v) { currentCountry = v; }
    };

    // ===== Backward-compatible globals =====
    Object.defineProperty(window, 'countryData', {
        get: () => countryData,
        set: (v) => { countryData = v; }
    });
    Object.defineProperty(window, 'currentCountry', {
        get: () => currentCountry,
        set: (v) => { currentCountry = v; }
    });
    window.formatMoney = formatMoney;
    window.formatLocalMoney = formatLocalMoney;
    window.getFuelCostPerLiter = getFuelCostPerLiter;
    window.formatFuelDisplay = formatFuelDisplay;
    window.applyCountry = applyCountry;
    window.setupCountryData = setupCountryData;

})();
