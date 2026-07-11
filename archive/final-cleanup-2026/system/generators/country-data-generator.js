/**
 * AutoMax — Country Data Generator
 * Generates country pricing data for car data files from country registry
 */

const fs = require('fs');
const path = require('path');

// Load country registry
const countryRegistry = JSON.parse(fs.readFileSync(path.join(__dirname, '../registry/country-registry.json'), 'utf8'));

// Load car registry
const carRegistry = JSON.parse(fs.readFileSync(path.join(__dirname, '../registry/car-registry.json'), 'utf8'));

// Base pricing template (adjust per car)
const basePricing = {
  es: { priceNew: 148000, pricePerformance: 168000, priceCarbon: 185000 },
  de: { priceNew: 148000, pricePerformance: 168000, priceCarbon: 185000 },
  fr: { priceNew: 148000, pricePerformance: 168000, priceCarbon: 185000 },
  it: { priceNew: 148000, pricePerformance: 168000, priceCarbon: 185000 },
  gb: { priceNew: 125000, pricePerformance: 142000, priceCarbon: 156000 },
  us: { priceNew: 135000, pricePerformance: 153000, priceCarbon: 169000 },
  ma: { priceNew: 1600000, pricePerformance: 1810000, priceCarbon: 2000000 },
  sa: { priceNew: 580000, pricePerformance: 657000, priceCarbon: 725000 },
  ae: { priceNew: 570000, pricePerformance: 646000, priceCarbon: 713000 }
};

// Generate country pricing for a car
function generateCountryPricing(carId, carPricing = {}) {
  const countryPricing = {};
  
  countryRegistry.countries.forEach(country => {
    const base = basePricing[country.id] || basePricing.es;
    const custom = carPricing[country.id] || {};
    
    // Calculate depreciation
    const dep3 = Math.round(base.priceNew * 0.68);
    const dep5 = Math.round(base.priceNew * 0.54);
    
    // Calculate annual depreciation
    const depAnnualNew = Math.round((base.priceNew - dep3) / 3);
    const depAnnualUsed3 = Math.round((dep3 - dep5) / 2);
    const depAnnualUsed5 = Math.round(dep5 / 5);
    
    countryPricing[country.id] = {
      flag: country.flag,
      name: country.name,
      currency: country.currency,
      locale: country.locale,
      fuelMetric: country.fuelMetric,
      fuelMin: country.fuelMetric ? 130 : 15,
      fuelMax: country.fuelMetric ? 230 : 25,
      fuelStep: country.fuelMetric ? 5 : 1,
      fuelDefault: country.fuelMetric ? 178 : 20,
      priceNew: custom.priceNew || base.priceNew,
      pricePerformance: custom.pricePerformance || base.pricePerformance,
      priceCarbon: custom.priceCarbon || base.priceCarbon,
      dep3: custom.dep3 || dep3,
      dep5: custom.dep5 || dep5,
      insurance: custom.insurance || country.insuranceBase,
      inspection: custom.inspection || country.inspection,
      maintenance: custom.maintenance || country.maintenanceBase,
      tyres: custom.tyres || country.tyresBase,
      oilChange: custom.oilChange || country.oilChangeBase,
      depAnnual: {
        new: custom.depAnnualNew || depAnnualNew,
        used3: custom.depAnnualUsed3 || depAnnualUsed3,
        used5: custom.depAnnualUsed5 || depAnnualUsed5
      },
      rivalM5: custom.rivalM5 || Math.round(base.priceNew * 0.175),
      rivalAmg: custom.rivalAmg || Math.round(base.priceNew * 0.19),
      used3Range: custom.used3Range || `${formatNumber(dep3 * 0.95)} - ${formatNumber(dep3 * 1.05)} ${country.currency}`,
      used5Range: custom.used5Range || `${formatNumber(dep5 * 0.95)} - ${formatNumber(dep5 * 1.05)} ${country.currency}`,
      options: custom.options || generateOptions(base.priceNew),
      fiscalHead: generateFiscalHead(country.id),
      fiscalRows: generateFiscalRows(country, base.priceNew)
    };
  });
  
  return countryPricing;
}

// Format number with locale
function formatNumber(num) {
  return num.toLocaleString('es-ES');
}

// Generate options array
function generateOptions(price) {
  return [
    Math.round(price * 0.031),
    Math.round(price * 0.0074),
    Math.round(price * 0.062),
    Math.round(price * 0.0155),
    Math.round(price * 0.023),
    0,
    Math.round(price * 0.041),
    Math.round(price * 0.012)
  ];
}

// Generate fiscal header
function generateFiscalHead(countryId) {
  const headers = {
    es: ["Región", "Impuesto matriculación", "ITV", "Precio final"],
    de: ["Bundesland", "Kfz-Steuer/Jahr", "Zulassung", "Endpreis"],
    fr: ["Région", "Malus CO₂", "Carte grise", "Prix final"],
    it: ["Regione", "Imposta immatricolazione", "Bollo", "Prezzo finale"],
    gb: ["Region", "Road Tax", "MOT", "Final Price"],
    us: ["State", "Sales Tax", "Registration", "Final Price"],
    ma: ["المنطقة", "ضريبة التسجيل", "الفحص", "السعر النهائي"],
    sa: ["المنطقة", "ضريبة التسجيل", "الفحص", "السعر النهائي"],
    ae: ["المنطقة", "ضريبة التسجيل", "الفحص", "السعر النهائي"]
  };
  return headers[countryId] || headers.es;
}

// Generate fiscal rows
function generateFiscalRows(country, price) {
  return country.regions.map(region => {
    const tax = country.taxRate * 100;
    const registrationFee = region.registrationFee;
    const finalPrice = Math.round(price * (1 + country.registrationTax) + registrationFee);
    
    return [
      region.name,
      country.id === 'us' ? `${tax.toFixed(2)}%` : `~${tax}%`,
      `${registrationFee} ${country.currency}`,
      finalPrice
    ];
  });
}

// Update car data files
console.log('🌍 Generating country pricing data for cars...\n');

carRegistry.cars.forEach(car => {
  const dataPath = path.join(__dirname, '../../', car.dataFile);
  
  if (!fs.existsSync(dataPath)) {
    console.log(`⚠️  Car data file not found: ${car.dataFile}`);
    return;
  }
  
  const carData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  
  // Generate country pricing
  const countryPricing = generateCountryPricing(car.id, carData.countryPricing || {});
  
  // Add or update country pricing
  carData.countryPricing = countryPricing;
  
  // Write back to file with UTF-8 BOM for proper Unicode support
  const jsonOutput = JSON.stringify(carData, null, 2);
  const bom = '\uFEFF';
  fs.writeFileSync(dataPath, bom + jsonOutput, 'utf8');
  
  console.log(`✅ Updated ${car.id} with country pricing data`);
});

console.log('\n🎉 Country pricing data generated successfully!');
console.log(`📊 Updated ${carRegistry.cars.length} car data files`);
