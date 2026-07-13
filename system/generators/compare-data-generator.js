/**
 * CarSpecio — Compare Index Generator
 * Generates compare-index.js with car registry only (no car data duplication)
 * Car data is loaded dynamically from system/data/*.json at runtime
 */

const fs = require('fs');
const path = require('path');

// Load registries
const carRegistry = JSON.parse(fs.readFileSync(path.join(__dirname, '../registry/car-registry.json'), 'utf8'));
const brandRegistry = JSON.parse(fs.readFileSync(path.join(__dirname, '../registry/brand-registry.json'), 'utf8'));
const categoryRegistry = JSON.parse(fs.readFileSync(path.join(__dirname, '../registry/category-registry.json'), 'utf8'));

// Helper: load car data for name
function loadCarData(car) {
  const dataFile = car.dataFile || `system/data/${car.id}.json`;
  const dataPath = path.join(__dirname, '../..', dataFile);
  try {
    return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  } catch (e) {
    return null;
  }
}

// Generate car index (lightweight, no data duplication)
const CARSPECIO_COMPARE_INDEX = carRegistry.cars
  .filter(car => car.status === 'active')
  .map(car => {
    const brand = brandRegistry.brands.find(b => b.id === car.brandId);
    const category = categoryRegistry.categories.find(c => c.id === car.categoryId);
    const carData = loadCarData(car);
    
    // Use actual car name from data if available
    const carName = carData?.basicInfo?.fullModelName || 
                    carData?.basicInfo?.name || 
                    `${brand?.name || car.brandId} ${car.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`;
    
    // Get Arabic name for i18n support
    const carNameAr = carData?.basicInfo?.fullModelNameAr || 
                      carData?.basicInfo?.nameAr || 
                      carName;
    
    // Get hero image from car JSON data (single source of truth)
    let heroImage = '';
    if (carData && carData.images && carData.images.hero) {
      heroImage = carData.images.hero;
      // Normalize to absolute web path
      if (!heroImage.startsWith('http')) {
        heroImage = heroImage.replace(/^(\.\.\/)+/, '').replace(/^\//, '');
        heroImage = '/' + heroImage;
      }
    } else {
      heroImage = car.images?.hero || '';
    }
    
    return {
      id: car.id,
      name: carName,
      nameAr: carNameAr,
      brandId: car.brandId,
      brand: brand?.name || car.brandId,
      categoryId: car.categoryId,
      category: category?.id || 'unknown',
      slug: car.slug,
      htmlFile: car.htmlFile,
      dataFile: '../' + car.dataFile,  // Make path relative to html/ directory
      image: heroImage,
      modelYear: car.modelYear,
      generation: car.generation
    };
  });

// Generate comparison presets from registry
const CARSPECIO_COMPARE_PRESETS = [];
carRegistry.cars.forEach(car => {
  if (car.comparisons && car.comparisons.length > 0) {
    const carIndex = CARSPECIO_COMPARE_INDEX.find(c => c.id === car.id);
    const carName = carIndex?.name || car.slug;
    
    car.comparisons.forEach(compId => {
      const compCar = carRegistry.cars.find(c => c.id === compId);
      if (compCar) {
        const compIndex = CARSPECIO_COMPARE_INDEX.find(c => c.id === compId);
        const compName = compIndex?.name || compCar.slug;
        
        // Add preset if not already exists
        const exists = CARSPECIO_COMPARE_PRESETS.some(p => 
          (p.car1 === carName && p.car2 === compName) ||
          (p.car1 === compName && p.car2 === carName)
        );
        
        if (!exists) {
          CARSPECIO_COMPARE_PRESETS.push({
            car1: carName,
            car2: compName,
            label: `${carName} vs ${compName}`
          });
        }
      }
    });
  }
});

// Generate output file
const output = `/* CarSpecio — Compare Index */
/* AUTO-GENERATED from car registry */
/* DO NOT EDIT MANUALLY - Use system/generators/compare-data-generator.js */
/* Car data is loaded dynamically from system/data/*.json */

window.CARSPECIO_COMPARE_INDEX = ${JSON.stringify(CARSPECIO_COMPARE_INDEX, null, 4)};

window.CARSPECIO_COMPARE_CARS = window.CARSPECIO_COMPARE_INDEX;

window.CARSPECIO_COMPARE_PRESETS = ${JSON.stringify(CARSPECIO_COMPARE_PRESETS, null, 4)};

// Backward-compatible aliases
window.carspecio_COMPARE_CARS = window.CARSPECIO_COMPARE_INDEX;
window.carspecio_COMPARE_PRESETS = window.CARSPECIO_COMPARE_PRESETS;
`;

// Write output file
const outputPath = path.join(__dirname, '../../js/compare-data.js');
fs.writeFileSync(outputPath, output);

console.log('✅ compare-data.js (index) generated successfully');
console.log(`📁 Output: ${outputPath}`);
console.log(`📊 Cars indexed: ${CARSPECIO_COMPARE_INDEX.length}`);
console.log(`🔗 Presets: ${CARSPECIO_COMPARE_PRESETS.length}`);
console.log('📝 Note: Car data is loaded dynamically from system/data/*.json');
