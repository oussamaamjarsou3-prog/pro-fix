/* CarSpecio Porsche 911 Turbo S — Country selector & localized data */

let currentCountry = localStorage.getItem("automax-porsche-911-country") || "es";
let countrySelectorReady = false;

const countryData = {

    es: {
        flag: "🇪🇸", name: "España", currency: "EUR", locale: "es-ES",
        fuelMetric: true,
        fuelMin: 120, fuelMax: 220, fuelStep: 5, fuelDefault: 165,
        priceNew: 220000, pricePerformance: 245000, priceCarbon: 280000,
        dep3: 150000, dep5: 120000,
        insurance: 3500, inspection: 70, maintenance: 5000, tyres: 2000, oilChange: 450,
        depAnnual: { new: 23333, used3: 12500, used5: 7500 },
        rivalM5: 30234, rivalAmg: 32600,
        used3Range: "€145.000 - €160.000", used5Range: "€110.000 - €130.000",
        options: [3500, 12000, 4500, 4000, 6000, 2500, 8000, 0],
        fiscalHead: ["Comunidad", "Tramo CO₂", "Impuesto est.", "Precio final"],
        fiscalRows: [
            ["Madrid", "Tramo IV (>200 g/km)", 27500, 247500],
            ["Cataluña", "Tramo IV", 27500, 247500],
            ["Andalucía", "Tramo IV", 27500, 247500],
            ["País Vasco", "Tramo IV", 26200, 246200],
            ["Canarias", "IGIC especial", 15500, 235500],
        ]
    },

    de: {
        flag: "🇩🇪", name: "Alemania", currency: "EUR", locale: "de-DE",
        fuelMetric: true,
        fuelMin: 140, fuelMax: 240, fuelStep: 5, fuelDefault: 189,
        priceNew: 215000, pricePerformance: 240000, priceCarbon: 275000,
        dep3: 145000, dep5: 115000,
        insurance: 3200, inspection: 150, maintenance: 4700, tyres: 1900, oilChange: 420,
        depAnnual: { new: 22000, used3: 12000, used5: 7000 },
        rivalM5: 28800, rivalAmg: 31200,
        used3Range: "€140.000 - €155.000", used5Range: "€105.000 - €125.000",
        options: [3400, 11500, 4300, 3800, 5800, 2400, 7700, 0],
        fiscalHead: ["Bundesland", "Kfz-Steuer/año", "Zulassung", "Precio final"],
        fiscalRows: [
            ["Bayern", "~€520/año", "~€380", 237200],
            ["NRW", "~€520/año", "~€420", 237400],
            ["Berlin", "~€520/año", "~€350", 237000],
            ["Baden-Württemberg", "~€520/año", "~€400", 237300],
            ["Hamburg", "~€520/año", "~€360", 237100]
        ]
    },

    fr: {
        flag: "🇫🇷", name: "Francia", currency: "EUR", locale: "fr-FR",
        fuelMetric: true,
        fuelMin: 130, fuelMax: 230, fuelStep: 5, fuelDefault: 178,
        priceNew: 225000, pricePerformance: 250000, priceCarbon: 285000,
        dep3: 155000, dep5: 125000,
        insurance: 3400, inspection: 90, maintenance: 4900, tyres: 1950, oilChange: 440,
        depAnnual: { new: 24000, used3: 13000, used5: 7800 },
        rivalM5: 31000, rivalAmg: 33500,
        used3Range: "€150.000 - €165.000", used5Range: "€115.000 - €135.000",
        options: [3600, 12500, 4600, 4100, 6200, 2600, 8200, 0],
        fiscalHead: ["Région", "Malus CO₂", "Carte grise", "Prix final"],
        fiscalRows: [
            ["Île-de-France", "Malus max.", "~€1.200", 254400],
            ["PACA", "Malus max.", "~€1.100", 254300],
            ["Auvergne-Rhône", "Malus max.", "~€1.000", 254200],
            ["Occitanie", "Malus max.", "~€950", 254150],
            ["Corse", "Malus réduit", "~€800", 253900]
        ]
    },

    pt: {
        flag: "🇵🇹", name: "Portugal", currency: "EUR", locale: "pt-PT",
        fuelMetric: true,
        fuelMin: 130, fuelMax: 220, fuelStep: 5, fuelDefault: 172,
        priceNew: 210000, pricePerformance: 235000, priceCarbon: 270000,
        dep3: 140000, dep5: 110000,
        insurance: 3100, inspection: 65, maintenance: 4500, tyres: 1800, oilChange: 400,
        depAnnual: { new: 22000, used3: 12000, used5: 7200 },
        rivalM5: 27800, rivalAmg: 30000,
        used3Range: "€135.000 - €150.000", used5Range: "€100.000 - €120.000",
        options: [3300, 11000, 4200, 3700, 5700, 2300, 7500, 0],
        fiscalHead: ["Região", "ISV estimado", "Registo", "Preço final"],
        fiscalRows: [
            ["Lisboa", "ISV alto", "~€35.000", 247000],
            ["Porto", "ISV alto", "~€35.000", 247000],
            ["Algarve", "ISV alto", "~€34.500", 246500],
            ["Madeira", "ISV reduzido", "~€26.000", 238000],
            ["Açores", "ISV reduzido", "~€25.000", 237000]
        ]
    },

    us: {
        flag: "🇺🇸", name: "Estados Unidos", currency: "USD", locale: "en-US",
        fuelMetric: false,
        fuelMin: 280, fuelMax: 550, fuelStep: 10, fuelDefault: 380,
        priceNew: 207000, pricePerformance: 232000, priceCarbon: 267000,
        dep3: 145000, dep5: 115000,
        insurance: 5500, inspection: 85, maintenance: 6000, tyres: 2200, oilChange: 380,
        depAnnual: { new: 21000, used3: 11500, used5: 7000 },
        rivalM5: 33000, rivalAmg: 35500,
        used3Range: "$145,000 - $165,000", used5Range: "$115,000 - $135,000",
        options: [3800, 13000, 5000, 4500, 7000, 2800, 9000, 0],
        fiscalHead: ["State", "Sales tax", "Doc fees", "Final price"],
        fiscalRows: [
            ["California", "7.25%", "~$85", 222400],
            ["Texas", "6.25%", "~$150", 220100],
            ["Florida", "6.00%", "~$799", 219900],
            ["New York", "8.00%", "~$175", 223400],
            ["Montana", "0%", "~$200", 207200]
        ]
    }

};

function formatMoney(n, code) {
    const c = countryData[code || currentCountry];
    if (c.currency === "USD") return "$" + Math.round(n).toLocaleString("en-US");
    return "€" + Math.round(n).toLocaleString(c.locale);
}

function formatFuelDisplay(raw, code) {
    const c = countryData[code || currentCountry];
    if (c.fuelMetric) return (raw / 100).toFixed(2).replace(".", ",") + " €";
    return "$" + (raw / 100).toFixed(2);
}

function getFuelCostPerLiter(raw, code) {
    const c = countryData[code || currentCountry];
    if (c.fuelMetric) return raw / 100;
    return (raw / 100) / 3.785;
}

function applyCountry(code) {

    currentCountry = code;
    localStorage.setItem("automax-porsche-911-country", code);

    const c = countryData[code];
    if (!c) return;

    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    const cName = typeof countryName === "function" ? countryName(code) : c.name;
    const tr = typeof t === "function" ? t : (k) => k;

    set("countryFlag", c.flag);
    set("countryName", cName);
    set("countryBannerName", cName);

    document.querySelectorAll(".country-menu button").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.country === code);
    });

    set("countryQuickPrice", formatMoney(c.priceNew));
    set("countryQuickPriceLabel", tr("country.priceQuickLabel", { country: cName }));
    set("priceSectionTag", tr("country.priceTag", { country: cName.toUpperCase() }));
    set("priceSectionTitle", tr("country.priceTitle", { country: cName }));
    set("priceIntro", tr("country.priceIntro", { country: cName }));
    set("priceMain", formatMoney(c.priceNew));
    set("depreciationTitle", tr("country.depTitle", { country: cName }));
    set("depreciationDesc", tr("country.depDesc", { country: cName }));
    set("depNew", formatMoney(c.priceNew));
    set("depNewDesc", tr("country.depNewDesc", { country: cName }));
    set("dep3", formatMoney(c.dep3));
    set("dep5", formatMoney(c.dep5));
    set("insightResale", tr("country.insightResale", { country: cName }));
    set("fiscalTag", tr("country.fiscalTag", { country: cName.toUpperCase() }));
    set("fiscalTitle", tr("country.fiscalTitle"));
    set("fiscalDesc", tr("country.fiscalDesc"));
    set("fiscalNote", tr("country.fiscalNote"));
    set("versionPrice1", formatMoney(c.priceNew));
    set("versionPrice2", formatMoney(c.pricePerformance));
    set("versionPrice3", formatMoney(c.priceCarbon));
    set("calcCountryDesc", tr("country.calcDesc", { country: cName }));

    const fuelKey = c.currency === "USD" ? "country.fuelLabelUs" : "country.fuelLabel";
    set("fuelLabel", tr(fuelKey));
    set("insuranceCalcLabel", tr("country.inspectionLabel"));
    set("usedGuideTitle", tr("country.usedGuideTitle", { country: cName }));
    set("used3Range", c.used3Range);
    set("used5Range", c.used5Range);
    set("maintOil", formatMoney(c.oilChange));
    set("maintTyres", formatMoney(c.tyres));
    set("maintInsurance", formatMoney(c.insurance));
    set("barM5Val", formatMoney(c.rivalM5));
    set("barAmgVal", formatMoney(c.rivalAmg));

    const fiscalHead = document.getElementById("fiscalTableHead");
    const fiscalBody = document.getElementById("fiscalTableBody");

    if (fiscalHead) {
        fiscalHead.innerHTML = "<tr>" + c.fiscalHead.map(h => "<th>" + h + "</th>").join("") + "</tr>";
    }

    if (fiscalBody) {
        fiscalBody.innerHTML = c.fiscalRows.map(row =>
            "<tr><td>" + row[0] + "</td><td>" + row[1] + "</td><td>" +
            (typeof row[2] === "number" ? formatMoney(row[2]) : row[2]) +
            "</td><td><strong>" + formatMoney(row[3]) + "</strong></td></tr>"
        ).join("");
    }

    const stdLabel = typeof t === "function" ? t("options.standard") : "estándar";

    document.querySelectorAll(".option-price").forEach((cell, i) => {
        const val = c.options[i];
        if (val === undefined) return;
        cell.textContent = val === 0 ? formatMoney(0) + " (" + stdLabel + ")" : formatMoney(val);
    });

    const fuelSlider = document.getElementById("fuelPrice");
    if (fuelSlider) {
        fuelSlider.min = c.fuelMin;
        fuelSlider.max = c.fuelMax;
        fuelSlider.step = c.fuelStep;
        fuelSlider.value = c.fuelDefault;
    }

    const purchaseSelect = document.getElementById("purchaseType");
    if (purchaseSelect) {
        purchaseSelect.innerHTML =
            '<option value="new">' + tr("calc.new") + " (" + formatMoney(c.priceNew) + ")</option>" +
            '<option value="used3">' + tr("calc.used3") + " (" + formatMoney(c.dep3) + ")</option>" +
            '<option value="used5">' + tr("calc.used5") + " (" + formatMoney(c.dep5) + ")</option>";
    }

    if (typeof window.updateCalculator === "function") window.updateCalculator();
}

function initCountrySelector() {

    if (countrySelectorReady) {
        applyCountry(currentCountry);
        return;
    }

    countrySelectorReady = true;

    const countryToggle = document.getElementById("countryToggle");
    const countryMenu = document.getElementById("countryMenu");

    if (!countryToggle || !countryMenu) return;

    countryToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        countryMenu.classList.toggle("active");
        countryToggle.setAttribute("aria-expanded", countryMenu.classList.contains("active"));

        const langMenu = document.getElementById("langMenu");
        if (langMenu) langMenu.classList.remove("active");
    });

    countryMenu.querySelectorAll("button[data-country]").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            applyCountry(btn.dataset.country);
            countryMenu.classList.remove("active");
            countryToggle.setAttribute("aria-expanded", "false");
        });
    });

    document.addEventListener("click", (e) => {
        if (!e.target.closest(".country-selector")) {
            countryMenu.classList.remove("active");
            countryToggle.setAttribute("aria-expanded", "false");
        }
    });

    applyCountry(currentCountry);
}

document.addEventListener("DOMContentLoaded", initCountrySelector);

document.addEventListener("i18n:ready", () => {
    applyCountry(currentCountry);
});

window.applyCountry = applyCountry;
window.currentCountry = () => currentCountry;
window.countryData = countryData;
window.formatMoney = formatMoney;
window.getFuelCostPerLiter = getFuelCostPerLiter;
window.formatFuelDisplay = formatFuelDisplay;

// Calculator function for Porsche 911 Turbo S
window.updateCalculator = function() {
    const kmInput = document.getElementById('annualKm');
    const fuelPriceInput = document.getElementById('fuelPrice');
    const purchaseType = document.getElementById('purchaseType');
    const drivingStyle = document.getElementById('drivingStyle');
    
    const kmDisplay = document.getElementById('kmDisplay');
    const fuelDisplay = document.getElementById('fuelDisplay');
    const costFuel = document.getElementById('costFuel');
    const costInsurance = document.getElementById('costInsurance');
    const costMaint = document.getElementById('costMaint');
    const costDep = document.getElementById('costDep');
    const costTotal = document.getElementById('costTotal');
    const costPerKm = document.getElementById('costPerKm');
    const barRs7Val = document.getElementById('barRs7Val');
    
    if (!kmInput || !fuelPriceInput) return;
    
    const km = Number(kmInput.value) || 15000;
    const fuelPriceRaw = Number(fuelPriceInput.value) || 165;
    const fuelPrice = fuelPriceRaw / 100;
    const purchase = purchaseType ? purchaseType.value : 'new';
    const style = drivingStyle ? drivingStyle.value : 'mixed';
    
    const c = countryData[currentCountry];
    
    // Update displays
    if (kmDisplay) kmDisplay.textContent = km.toLocaleString('es-ES') + ' km';
    if (fuelDisplay) fuelDisplay.textContent = (fuelPriceRaw / 100).toFixed(2).replace('.', ',') + ' €';
    
    // Consumption based on driving style
    let consumption = 11.5;
    if (style === 'calm') consumption = 9;
    if (style === 'sport') consumption = 16;
    
    // Price based on purchase type
    let price = c.priceNew;
    if (purchase === 'used3') price = c.dep3;
    if (purchase === 'used5') price = c.dep5;
    
    // Calculations
    const fuelAnnual = Math.round(consumption * (km / 100) * fuelPrice);
    const insurance = c.insurance;
    const maintenance = c.maintenance;
    const depreciation = Math.round(price * 0.1); // 10% annual depreciation
    
    const total = fuelAnnual + insurance + maintenance + depreciation;
    const perKm = total / km;
    
    // Update results
    if (costFuel) costFuel.textContent = formatMoney(fuelAnnual);
    if (costInsurance) costInsurance.textContent = formatMoney(insurance);
    if (costMaint) costMaint.textContent = formatMoney(maintenance);
    if (costDep) costDep.textContent = formatMoney(depreciation);
    if (costTotal) costTotal.textContent = formatMoney(total);
    if (costPerKm) costPerKm.textContent = '≈ ' + formatMoney(perKm) + ' / km';
    if (barRs7Val) barRs7Val.textContent = formatMoney(total);
};

// Attach calculator listeners
document.addEventListener('DOMContentLoaded', () => {
    const kmInput = document.getElementById('annualKm');
    const fuelPriceInput = document.getElementById('fuelPrice');
    const purchaseType = document.getElementById('purchaseType');
    const drivingStyle = document.getElementById('drivingStyle');
    
    if (kmInput) kmInput.addEventListener('input', window.updateCalculator);
    if (fuelPriceInput) fuelPriceInput.addEventListener('input', window.updateCalculator);
    if (purchaseType) purchaseType.addEventListener('change', window.updateCalculator);
    if (drivingStyle) drivingStyle.addEventListener('change', window.updateCalculator);
    
    // Initial calculation
    setTimeout(window.updateCalculator, 100);
});
