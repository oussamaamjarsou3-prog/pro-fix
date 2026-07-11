/**
 * carspecio — Registry Validator
 * Validates registry consistency and integrity
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating registries...\n');

let errors = [];
let warnings = [];

// Load registries
const carRegistry = JSON.parse(fs.readFileSync(path.join(__dirname, '../registry/car-registry.json'), 'utf8'));
const brandRegistry = JSON.parse(fs.readFileSync(path.join(__dirname, '../registry/brand-registry.json'), 'utf8'));
const categoryRegistry = JSON.parse(fs.readFileSync(path.join(__dirname, '../registry/category-registry.json'), 'utf8'));

// Validate car registry
console.log('📋 Validating car registry...');

// Check for duplicate car IDs
const carIds = carRegistry.cars.map(car => car.id);
const duplicateCarIds = carIds.filter((id, index) => carIds.indexOf(id) !== index);
if (duplicateCarIds.length > 0) {
  errors.push(`Duplicate car IDs found: ${duplicateCarIds.join(', ')}`);
}

// Check for missing required fields
carRegistry.cars.forEach(car => {
  const requiredFields = ['id', 'slug', 'brandId', 'categoryId', 'modelYear', 'status', 'htmlFile', 'dataFile'];
  requiredFields.forEach(field => {
    if (!car[field]) {
      errors.push(`Car ${car.id} is missing required field: ${field}`);
    }
  });
});

// Check brand references
carRegistry.cars.forEach(car => {
  const brandExists = brandRegistry.brands.some(brand => brand.id === car.brandId);
  if (!brandExists) {
    errors.push(`Car ${car.id} references non-existent brand: ${car.brandId}`);
  }
});

// Check category references
carRegistry.cars.forEach(car => {
  const categoryExists = categoryRegistry.categories.some(category => category.id === car.categoryId);
  if (!categoryExists) {
    errors.push(`Car ${car.id} references non-existent category: ${car.categoryId}`);
  }
});

// Check data files exist
carRegistry.cars.forEach(car => {
  const dataPath = path.join(__dirname, '../../', car.dataFile);
  if (!fs.existsSync(dataPath)) {
    errors.push(`Car ${car.id} data file not found: ${car.dataFile}`);
  }
});

// Validate brand registry
console.log('🏷️  Validating brand registry...');

// Check for duplicate brand IDs
const brandIds = brandRegistry.brands.map(brand => brand.id);
const duplicateBrandIds = brandIds.filter((id, index) => brandIds.indexOf(id) !== index);
if (duplicateBrandIds.length > 0) {
  errors.push(`Duplicate brand IDs found: ${duplicateBrandIds.join(', ')}`);
}

// Check for missing required fields
brandRegistry.brands.forEach(brand => {
  const requiredFields = ['id', 'name', 'country'];
  requiredFields.forEach(field => {
    if (!brand[field]) {
      errors.push(`Brand ${brand.id} is missing required field: ${field}`);
    }
  });
});

// Validate category registry
console.log('📂 Validating category registry...');

// Check for duplicate category IDs
const categoryIds = categoryRegistry.categories.map(category => category.id);
const duplicateCategoryIds = categoryIds.filter((id, index) => categoryIds.indexOf(id) !== index);
if (duplicateCategoryIds.length > 0) {
  errors.push(`Duplicate category IDs found: ${duplicateCategoryIds.join(', ')}`);
}

// Check for missing required fields
categoryRegistry.categories.forEach(category => {
  const requiredFields = ['id', 'name', 'icon'];
  requiredFields.forEach(field => {
    if (!category[field]) {
      errors.push(`Category ${category.id} is missing required field: ${field}`);
    }
  });
});

// Validate brand models consistency
console.log('🔗 Validating brand models consistency...');

brandRegistry.brands.forEach(brand => {
  const brandCars = carRegistry.cars.filter(car => car.brandId === brand.id);
  if (brand.models && brand.models.length > 0) {
    brand.models.forEach(modelId => {
      const carExists = brandCars.some(car => car.id === modelId);
      if (!carExists) {
        warnings.push(`Brand ${brand.id} has model ${modelId} in models array but car not found in registry`);
      }
    });
  }
});

// Output results
console.log('\n📊 Validation Results:');
console.log(`   ✅ Cars: ${carRegistry.cars.length}`);
console.log(`   ✅ Brands: ${brandRegistry.brands.length}`);
console.log(`   ✅ Categories: ${categoryRegistry.categories.length}`);

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
  console.log('\n✅ All registries are valid!');
}
