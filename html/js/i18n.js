/* CarSpecio � i18n (ES / EN / FR / AR) */

const SUPPORTED_LANGS = ["es", "en", "fr", "ar"];
const RTL_LANGS = ["ar"];

let currentLang = localStorage.getItem("carspecio-lang") || "es";
if (!SUPPORTED_LANGS.includes(currentLang)) currentLang = "es";
let translations = {};
let langSelectorReady = false;

function langJsonUrl(code) {
    // Use absolute URL based on the server origin to avoid file:// protocol issues.
    return `${window.location.origin}/system/locales/${code}.json`;
}

function langJsonUrls(code) {
    // Return an array with a single absolute URL.
    return [langJsonUrl(code)];
}

function loadBundledLang(code) {
    if (window.__LANG_DATA__ && window.__LANG_DATA__[code]) {
        translations = window.__LANG_DATA__[code];
        return true;
    }
    return false;
}

let carData = null;

function formatCarId(carId) {
    if (!carId) return "";
    // Convert "bmw-m5-2026" to "BMW M5 2026"
    return carId
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
        .replace(/(\d{4})/, ' $1'); // Add space before year
}

function setCarData(data) {
    carData = data;
    if (typeof window !== 'undefined') {
        window.carData = data;
    }
    // Re-render options table if CountryManager is available
    if (typeof window !== 'undefined' && window.CountryManager && typeof window.CountryManager.updateOptionsTable === 'function') {
        const cc = window.CountryManager.currentCountry;
        const cData = window.CountryManager.countryData;
        if (cc && cData && cData[cc]) {
            window.CountryManager.updateOptionsTable(cData[cc]);
        }
    }
}

function getCarVar(varName) {
    if (!carData) return null;

    const keys = varName.split(".");
    let val = carData;
    for (const k of keys) {
        val = val?.[k];
    }
    return val;
}

function t(key, vars) {

    const keys = key.split(".");
    let val = translations;

    for (const k of keys) {
        val = val?.[k];
    }

    if (val === undefined || val === null) return key;

    if (typeof val === "number") return String(val);

    if (typeof val !== "string") return val;

    // Merge passed vars with car data
    const allVars = { ...vars };

    // Add car data if available
    if (carData) {
        allVars.fullModelName = (currentLang === 'ar' && carData.basicInfo?.fullModelNameAr) ? carData.basicInfo.fullModelNameAr : (carData.basicInfo?.fullModelName || carData.fullModelName || '');
        allVars.modelYear = carData.modelYear || "";
        allVars.nextYear = carData.modelYear ? (parseInt(carData.modelYear) + 2).toString() : "";
        allVars.engineType = (currentLang === 'ar' && carData.specs?.engine?.typeAr) ? carData.specs.engine.typeAr : (carData.specs?.engine?.type || carData.engineType || '');
        const powerValue = carData.performance?.power?.value || "";
        const powerUnit = carData.performance?.power?.unit || 'HP';
        allVars.power = powerValue ? `${powerValue} ${translateUnit(powerUnit)}` : '';
        // Use current country name if available, fallback to carData.country
        let currentCountryCode = null;
        if (typeof currentCountry !== 'undefined' && currentCountry) {
            currentCountryCode = currentCountry;
        } else if (typeof window !== 'undefined' && window.currentCountry) {
            // window.currentCountry may be a function or a getter property
            try {
                currentCountryCode = (typeof window.currentCountry === 'function') ? window.currentCountry() : window.currentCountry;
            } catch (e) {
                currentCountryCode = null;
            }
        }
        if (currentCountryCode && typeof countryData !== 'undefined' && countryData[currentCountryCode]) {
            allVars.country = translations.countries?.[currentCountryCode] || countryData[currentCountryCode].name || carData.country || 'España';
        } else {
            allVars.country = carData.country || 'España';
        }
        allVars.shortName = (currentLang === 'ar' && carData.basicInfo?.nameAr) ? carData.basicInfo.nameAr : (carData.basicInfo?.name || carData.shortName || '');
        allVars.brandBadge = (currentLang === 'ar' && carData.basicInfo?.badgeAr) ? carData.basicInfo.badgeAr : (carData.basicInfo?.badge || carData.brandBadge || '');
        allVars.tagline = (currentLang === 'ar' && carData.basicInfo?.taglineAr)
            ? carData.basicInfo.taglineAr
            : (carData.basicInfo?.tagline || carData.tagline || "");
        // Handle versions as array or object
        if (Array.isArray(carData.versions)) {
            allVars.versionBaseName = (currentLang === 'ar' && carData.versions[0]?.nameAr) ? carData.versions[0].nameAr : (carData.versions[0]?.name || '');
            allVars.versionPerformanceName = (currentLang === 'ar' && carData.versions[1]?.nameAr) ? carData.versions[1].nameAr : (carData.versions[1]?.name || carData.versions[0]?.name || '');
            allVars.versionCarbonName = (currentLang === 'ar' && carData.versions[2]?.nameAr) ? carData.versions[2].nameAr : (carData.versions[2]?.name || carData.versions[0]?.name || '');
        } else {
            allVars.versionBaseName = (currentLang === 'ar' && carData.versions?.base?.nameAr) ? carData.versions.base.nameAr : (carData.versions?.base?.name || '');
            allVars.versionPerformanceName = (currentLang === 'ar' && carData.versions?.performance?.nameAr) ? carData.versions.performance.nameAr : (carData.versions?.performance?.name || '');
            allVars.versionCarbonName = (currentLang === 'ar' && carData.versions?.carbon?.nameAr) ? carData.versions.carbon.nameAr : (carData.versions?.carbon?.name || '');
        }
        allVars.interiorMaterial = carData.options?.interior?.material || "";
        // Consumption
        const consumption = carData.fuelEconomy?.consumption?.combined;
        allVars.consumption = consumption ? `${consumption.value} ${translateUnit(consumption.unit)}` : '';
        // CO2 emissions
        const co2 = carData.fuelEconomy?.emissions?.co2;
        allVars.co2 = co2 ? `${co2.value} ${translateUnit(co2.unit)}` : '';
        // Price (from current country data if available) � convert to EUR
        let cc = null;
        if (typeof currentCountry !== 'undefined' && currentCountry) {
            cc = currentCountry;
        } else if (typeof window !== 'undefined' && window.currentCountry) {
            try {
                cc = (typeof window.currentCountry === 'function') ? window.currentCountry() : window.currentCountry;
            } catch (e) {
                cc = null;
            }
        }
        const currentCountryData = (typeof countryData !== 'undefined' && cc && countryData[cc]) ? countryData[cc] : null;
        if (currentCountryData && currentCountryData.priceNew !== undefined) {
            const rate = currentCountryData.exchangeRateEUR || 1.0;
            const localPrice = currentCountryData.priceNew;
            // Use space as thousands separator for readability
            const formatted = localPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
            allVars.priceNew = formatted + " " + currentCountryData.currency;
            allVars.priceNewNum = localPrice;
            // Keep EUR equivalent for contexts that need it
            allVars.priceNewEUR = Math.round(localPrice / rate).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " €";
        } else {
            allVars.priceNew = "";
            allVars.priceNewNum = "";
            allVars.priceNewEUR = "";
        }
        // Handle comparisons as array or object
        if (Array.isArray(carData.comparisons)) {
            // Try to get Arabic fullName first, then name, then carId formatted
            allVars.car1FullName = (currentLang === 'ar' && carData.comparisons[0]?.fullNameAr) ? carData.comparisons[0].fullNameAr : (carData.comparisons[0]?.name || formatCarId(carData.comparisons[0]?.carId) || '');
            allVars.car2FullName = (currentLang === 'ar' && carData.comparisons[1]?.fullNameAr) ? carData.comparisons[1].fullNameAr : (carData.comparisons[1]?.name || formatCarId(carData.comparisons[1]?.carId) || '');
            allVars.car3FullName = (currentLang === 'ar' && carData.comparisons[2]?.fullNameAr) ? carData.comparisons[2].fullNameAr : (carData.comparisons[2]?.name || formatCarId(carData.comparisons[2]?.carId) || '');
        } else {
            allVars.car1FullName = (currentLang === 'ar' && carData.comparisons?.car1?.fullNameAr) ? carData.comparisons.car1.fullNameAr : (carData.comparisons?.car1?.name || formatCarId(carData.comparisons?.car1?.carId) || '');
            allVars.car2FullName = (currentLang === 'ar' && carData.comparisons?.car2?.fullNameAr) ? carData.comparisons.car2.fullNameAr : (carData.comparisons?.car2?.name || formatCarId(carData.comparisons?.car2?.carId) || '');
            allVars.car3FullName = (currentLang === 'ar' && carData.comparisons?.car3?.fullNameAr) ? carData.comparisons.car3.fullNameAr : (carData.comparisons?.car3?.name || formatCarId(carData.comparisons?.car3?.carId) || '');
        }
        // Short aliases for quiz and other sections
        allVars.car1 = allVars.car1FullName;
        allVars.car2 = allVars.car2FullName;
        allVars.car3 = allVars.car3FullName;
        
        // Edition aliases for insights
        allVars.performanceEdition = allVars.versionPerformanceName || "Performance";
        allVars.premiumEdition = allVars.versionCarbonName || "Carbon";
        // Depreciation placeholders
        if (carData.depreciation) {
            var dep = carData.depreciation;
            if (dep.year3 && dep.year3.percentage !== undefined) allVars.loss3 = 100 - dep.year3.percentage;
            if (dep.year3 && dep.year3.km !== undefined) allVars.km3 = dep.year3.km.toLocaleString();
            if (dep.year5 && dep.year5.percentage !== undefined) allVars.loss5 = 100 - dep.year5.percentage;
            if (dep.year5 && dep.year5.km !== undefined) allVars.km5 = dep.year5.km.toLocaleString();
        }
    }

    if (Object.keys(allVars).length === 0) return val;

    // Replace both {{key}} and {key} placeholders
    const result = Object.entries(allVars).reduce(
        (str, [k, v]) => {
            // First replace {{key}} (used in some inline strings)
            let s = str.replace(new RegExp("\\{\\{" + k + "\\}\\}", "g"), v || "");
            // Then replace {key} (used in locale files like calc.perKmLine)
            s = s.replace(new RegExp("\\{" + k + "\\}", "g"), v || "");
            return s;
        },
        val
    );
    return result;
}


function translateUnit(unit) {
    if (!unit || currentLang !== 'ar') return unit;
    const map = {
        "L/100 km": "l100km",
        "km/h": "kmh",
        "g/km": "gkm",
        "kg": "kg",
        "km": "km",
        "HP": "hp",
        "PS": "ps",
        "kW": "kw",
        "Nm": "nm",
        "lb-ft": "lbft",
        "s": "s"
    };
    const key = map[unit];
    return (key && translations.units?.[key]) ? translations.units[key] : unit;
}

function countryName(code) {
    return t("countries." + code) || code;
}

function applyTranslations() {

    document.querySelectorAll("[data-i18n]").forEach(el => {

        const key = el.getAttribute("data-i18n");
        const value = t(key);

        if (typeof value !== "string") return;
        // Skip if translation is missing (t() returns the key itself as fallback)
        if (value === key) return;

        if (el.getAttribute("data-i18n-html") === "true") {
            el.innerHTML = value;
        } else {
            el.textContent = value;
        }

    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
        const key = el.getAttribute("data-i18n-placeholder");
        const value = t(key);
        if (value !== key) el.placeholder = value;
    });

    document.querySelectorAll("[data-i18n-list]").forEach(el => {

        const items = t(el.getAttribute("data-i18n-list"));

        if (Array.isArray(items)) {
            const listClass = el.getAttribute("data-i18n-list-class") || "";
            const classAttr = listClass ? ' class="' + listClass + '"' : "";

            // Get current country for dynamic placeholders like {{used3Range}}
            let cc = null;
            if (typeof currentCountry !== 'undefined' && currentCountry) {
                cc = currentCountry;
            } else if (typeof window !== 'undefined' && window.currentCountry) {
                try {
                    cc = (typeof window.currentCountry === 'function') ? window.currentCountry() : window.currentCountry;
                } catch (e) {
                    cc = null;
                }
            }
            const cData = (typeof countryData !== 'undefined' && cc && countryData[cc]) ? countryData[cc] : null;

            el.innerHTML = items.map(item => {
                let processed = item;
                // Replace country-specific placeholders
                if (cData) {
                    Object.keys(cData).forEach(key => {
                        if (typeof cData[key] === 'string') {
                            // Replace both {{key}} and {key}
                            processed = processed.replace(
                                new RegExp('\\{\\{' + key + '\\}\\}', 'g'),
                                cData[key]
                            );
                            processed = processed.replace(
                                new RegExp('\\{' + key + '\\}', 'g'),
                                cData[key]
                            );
                        }
                    });
                }
                return "<li" + classAttr + ">" + processed + "</li>";
            }).join("");
        }

    });

    document.querySelectorAll("[data-i18n-aria]").forEach(el => {
        el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria")));
    });

    document.querySelectorAll("option[data-i18n]").forEach(opt => {
        opt.textContent = t(opt.getAttribute("data-i18n"));
    });

    // Toggle multilingual content blocks
    // On guide pages (applyPageText exists), let applyPageText handle lang-block visibility
    // On other pages, handle it here
    if (typeof applyPageText !== 'function') {
        document.querySelectorAll(".lang-block, .lang-card-content, .lang-title").forEach(el => {
            el.hidden = el.dataset.lang !== currentLang;
        });
    } else {
        // Guide page: only update non-content lang-blocks (e.g. lang-title in header)
        document.querySelectorAll(".lang-title").forEach(el => {
            el.hidden = el.dataset.lang !== currentLang;
        });
    }

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
        if (metaDesc.hasAttribute('data-i18n')) {
            const descTranslation = t(metaDesc.getAttribute('data-i18n'));
            if (descTranslation) metaDesc.content = descTranslation;
        } else {
            const descTranslation = t("meta.description");
            if (!descTranslation.includes('{{')) metaDesc.content = descTranslation;
        }
    }

    // Only override title if it doesn't have data-i18n (let data-i18n elements handle their own translation)
    const titleEl = document.querySelector('title');
    if (titleEl && titleEl.hasAttribute('data-i18n')) {
        const titleTranslation = t(titleEl.getAttribute('data-i18n'));
        if (titleTranslation) document.title = titleTranslation;
    } else if (titleEl) {
        const titleTranslation = t("meta.title");
        if (!titleTranslation.includes('{{')) document.title = titleTranslation;
    }
    document.documentElement.lang = currentLang;
    document.documentElement.dir = RTL_LANGS.includes(currentLang) ? "rtl" : "ltr";
    document.body.classList.toggle("rtl", RTL_LANGS.includes(currentLang));

    document.querySelectorAll(".lang-menu button").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.lang === currentLang);
    });

    const langLabel = document.getElementById("langLabel");
    if (langLabel) {
        const langNames = { es: "Español", en: "English", fr: "Français", ar: "العربية" };
        langLabel.textContent = langNames[currentLang] || currentLang.toUpperCase();
    }

    if (typeof updateProfileLabels === "function") updateProfileLabels();
}

async function loadLanguage(lang) {
    let loaded = false;

    try {
        const urls = langJsonUrls(lang);
        for (const url of urls) {
            const res = await fetch(url);
            if (res.ok) {
                translations = await res.json();
                loaded = true;
                break;
            }
        }
    } catch (err) {
        console.warn("i18n fetch:", err);
    }

    if (!loaded) {
        loaded = loadBundledLang(lang);
    }

    if (!loaded && lang !== "es") {
        await loadLanguage("es");
        return;
    }

    if (!SUPPORTED_LANGS.includes(lang)) {
        await loadLanguage("es");
        return;
    }

    if (!loaded) {
        loadBundledLang("es");
    }

    currentLang = lang;
    localStorage.setItem("carspecio-lang", lang);

    applyTranslations();

    // Re-apply dynamic page text for new language
    if (typeof applyPageText === 'function') {
        applyPageText();
    }

    // Re-run calculator with new locale formatting
    if (typeof updateCalculator === 'function') {
        updateCalculator();
    }

    // Update lang toggle button icon, text, and data-lang
    const langToggle = document.getElementById("langToggle");
    if (langToggle) {
        const iconSpan = langToggle.querySelector('.btn-icon');
        const textSpan = langToggle.querySelector('.btn-text');
        const langToCountry = { es: 'es', en: 'gb', fr: 'fr', ar: 'sa' };
        const countryCode = langToCountry[lang] || lang;
        if (iconSpan) if (window.createFlagImg) { iconSpan.innerHTML = ''; iconSpan.appendChild(window.createFlagImg(countryCode)); } else { iconSpan.textContent = ''; };
        const langNames = { es: 'Español', en: 'English', fr: 'Français', ar: 'العربية' };
        if (textSpan) textSpan.textContent = langNames[lang] || lang.toUpperCase();
        langToggle.setAttribute('data-lang', lang);
    }

    // Update lang label
    const langLabel = document.getElementById("langLabel");
    if (langLabel) {
        const langNames = { es: "Español", en: "English", fr: "Français", ar: "العربية" };
        langLabel.textContent = langNames[lang] || lang;
    }

    // Update country name with new translation
    if (typeof currentCountry !== 'undefined' && currentCountry) {
        const c = (typeof countryData !== 'undefined' && countryData[currentCountry]) ? countryData[currentCountry] : null;
        if (c) {
            const nameEl = document.getElementById("countryName");
            const bannerNameEl = document.getElementById("countryBannerName");
            const translatedName = t("countries." + currentCountry);
            const displayName = translatedName || c.name;
            if (nameEl) nameEl.textContent = displayName;
            if (bannerNameEl) bannerNameEl.textContent = displayName;
        }
    }

    // Sync lang menu active state
    syncLangMenuActive();

    document.dispatchEvent(new CustomEvent("i18n:ready", { detail: { lang } }));
}

function syncLangMenuActive() {
    const langMenu = document.getElementById("langMenu");
    if (!langMenu) return;
    langMenu.querySelectorAll("button[data-lang]").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.lang === currentLang);
    });
}

function initLangSelector() {
    if (langSelectorReady) return;
    langSelectorReady = true;

    // DropdownManager (dropdowns.js) handles all dropdown UI.
    // We only sync the active state here.
    syncLangMenuActive();
}

function bootI18n() {
    loadLanguage(currentLang);
}

document.addEventListener("DOMContentLoaded", () => {
    // Dropdown handling moved to system/js/dropdowns.js
    // initLangSelector();
    bootI18n();
});

window.t = t;
window.countryName = countryName;
window.loadLanguage = loadLanguage;
window.currentLang = () => currentLang;
