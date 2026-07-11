/**
 * carspecio — Car Data Validator
 * Validates car data files against master-car-schema.json
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating car data files...\n');

let errors = [];
let warnings = [];

// Load master schema
const schemaPath = path.join(__dirname, '../schemas/master-car-schema.json');
if (!fs.existsSync(schemaPath)) {
  console.error('❌ Master schema not found:', schemaPath);
  process.exit(1);
}

const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

// Load car registry
const carRegistry = JSON.parse(fs.readFileSync(path.join(__dirname, '../registry/car-registry.json'), 'utf8'));

// Validate each car data file
console.log('📋 Validating car data files...\n');

carRegistry.cars.forEach(car => {
  const dataPath = path.join(__dirname, '../../', car.dataFile);
  
  if (!fs.existsSync(dataPath)) {
    errors.push(`Car data file not found: ${car.dataFile}`);
    return;
  }
  
  try {
    const carData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    
    // Check required fields from schema
    const requiredFields = schema.required || [];
    requiredFields.forEach(field => {
      if (!carData[field]) {
        errors.push(`Car ${car.id} is missing required field: ${field}`);
      }
    });
    
    // Check basicInfo
    if (carData.basicInfo) {
      const basicInfoRequired = ['name', 'fullModelName', 'description'];
      basicInfoRequired.forEach(field => {
        if (!carData.basicInfo[field]) {
          errors.push(`Car ${car.id} basicInfo is missing: ${field}`);
        }
      });
    }
    
    // Check specs
    if (carData.specs) {
      if (!carData.specs.engine) {
        errors.push(`Car ${car.id} specs is missing: engine`);
      }
      if (!carData.specs.transmission) {
        errors.push(`Car ${car.id} specs is missing: transmission`);
      }
    }
    
    // Check performance
    if (carData.performance) {
      if (!carData.performance.power) {
        errors.push(`Car ${car.id} performance is missing: power`);
      }
      if (!carData.performance.acceleration) {
        errors.push(`Car ${car.id} performance is missing: acceleration`);
      }
    }
    
    // Check dimensions
    if (carData.dimensions) {
      if (!carData.dimensions.length) {
        errors.push(`Car ${car.id} dimensions is missing: length`);
      }
      if (!carData.dimensions.curbWeight && !carData.dimensions.weight) {
        errors.push(`Car ${car.id} dimensions is missing: curbWeight (or weight)`);
      }
    }

    // Check powertrain (optional but recommended)
    if (!carData.powertrain) {
      warnings.push(`Car ${car.id} is missing powertrain object (recommended for new architecture)`);
    } else {
      const allowedTypes = ['petrol', 'diesel', 'mild-hybrid', 'hybrid', 'phev', 'electric'];
      if (carData.powertrain.type && !allowedTypes.includes(carData.powertrain.type)) {
        errors.push(`Car ${car.id} has invalid powertrain.type: ${carData.powertrain.type}`);
      }
    }

    // Check pricing
    if (carData.pricing) {
      if (!carData.pricing.basePrice && !carData.pricing.current) {
        errors.push(`Car ${car.id} pricing is missing: basePrice (or current)`);
      }
    }
    
    // Check images
    if (carData.images) {
      if (!carData.images.hero) {
        warnings.push(`Car ${car.id} images is missing: hero`);
      }
    }
    
    // Check seo
    if (carData.seo) {
      if (!carData.seo.title) {
        errors.push(`Car ${car.id} seo is missing: title`);
      }
      if (!carData.seo.description) {
        errors.push(`Car ${car.id} seo is missing: description`);
      }
    }
    
    // Check content
    if (carData.content) {
      if (!carData.content.pros || carData.content.pros.length === 0) {
        warnings.push(`Car ${car.id} content has no pros`);
      }
      if (!carData.content.cons || carData.content.cons.length === 0) {
        warnings.push(`Car ${car.id} content has no cons`);
      }
    }

    // Check multilingual architecture sections
    const multilingualSections = ['review', 'drivingExperience', 'exteriorDesign', 'interior', 'technology', 'safety', 'runningCosts', 'ownership'];
    const supportedLangs = ['es', 'en', 'fr', 'ar'];
    multilingualSections.forEach(section => {
      const data = carData[section];
      if (!data) return;
      const hasLangKeys = supportedLangs.some(l => data[l] !== undefined && typeof data[l] === 'object' && !Array.isArray(data[l]));
      if (hasLangKeys) {
        const missing = supportedLangs.filter(l => !data[l]);
        if (missing.length > 0) {
          warnings.push(`Car ${car.id} section "${section}" is multilingual but missing languages: ${missing.join(', ')}`);
        }
      } else {
        warnings.push(`Car ${car.id} section "${section}" uses legacy flat format (recommended: wrap in language keys)`);
      }
    });

    console.log(`✅ ${car.id} validated`);
    
  } catch (error) {
    errors.push(`Failed to parse ${car.dataFile}: ${error.message}`);
  }
});

// Output results
console.log('\n📊 Validation Results:');
console.log(`   ✅ Cars validated: ${carRegistry.cars.length}`);

if (warnings.length > 0) {
  console.log(`\n⚠️  Warnings (${warnings.length}):`);
  warnings.forEach(warning => console.log(`   - ${warning}`));
}

if (errors.length > 0) {
  console.log(`\n❌ Errors (${errors.length}):`);
  errors.forEach(error => console.log(`   - ${error}`));
  console.log('\n❌ Validation failed!');
  process.exit(1);
} else {
  console.log('\n✅ All car data files are valid!');
}
