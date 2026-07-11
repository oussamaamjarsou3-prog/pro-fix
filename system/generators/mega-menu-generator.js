/**
 * carspecio — Mega Menu Generator
 * Generates mega-menu-data.js from central registries
 */

const fs = require('fs');
const path = require('path');

// Load registries
const carRegistry = JSON.parse(fs.readFileSync(path.join(__dirname, '../registry/car-registry.json'), 'utf8'));
const brandRegistry = JSON.parse(fs.readFileSync(path.join(__dirname, '../registry/brand-registry.json'), 'utf8'));
const categoryRegistry = JSON.parse(fs.readFileSync(path.join(__dirname, '../registry/category-registry.json'), 'utf8'));

// Helper: load car data to get name
function loadCarData(car) {
  const dataFile = car.dataFile || `system/data/${car.id}.json`;
  const dataPath = path.join(__dirname, '../..', dataFile);
  try {
    return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  } catch (e) {
    return null;
  }
}

// Generate modelPageMap
const modelPageMap = {};
carRegistry.cars.forEach(car => {
  const brand = brandRegistry.brands.find(b => b.id === car.brandId);
  const carData = loadCarData(car);
  if (brand && carData) {
    const carName = `${brand.name} ${carData.basicInfo.name}`;
    modelPageMap[carName] = car.htmlFile;
    
    // Add variations
    if (carData.basicInfo.fullModelName) {
      modelPageMap[carData.basicInfo.fullModelName] = car.htmlFile;
    }
  }
});

// Generate brandLogoMap
const brandLogoMap = {};
brandRegistry.brands.forEach(brand => {
  brandLogoMap[brand.name] = brand.logo;
});

// Generate categoryIconMap
const categoryIconMap = {};
categoryRegistry.categories.forEach(category => {
  categoryIconMap[category.id] = category.icon;
});

// Popular extra models to show in the mega menu even without dedicated pages
const extraModels = {
  "Audi": {
    "deportivos": ["Audi TT RS", "Audi R8"],
    "suv": ["Audi Q3", "Audi Q5", "Audi Q7", "Audi Q8", "Audi SQ5", "Audi SQ7", "Audi e-tron"],
    "electricos": ["Audi e-tron GT", "Audi Q4 e-tron", "Audi Q8 e-tron"],
    "sedan": ["Audi A3 Sedán", "Audi A4", "Audi A5 Sportback", "Audi A6", "Audi A7", "Audi A8", "Audi S4", "Audi S6"],
    "hatchback": ["Audi A3 Sportback", "Audi A1"],
    "compactos": ["Audi A1", "Audi A3 Sportback"],
    "familiar": ["Audi A4 Avant", "Audi A6 Avant"],
    "híbridos": ["Audi A6 TFSI e", "Audi Q5 TFSI e"],
    "lujo": ["Audi A8", "Audi S8"]
  },
  "BMW": {
    "deportivos": ["BMW M3", "BMW M4", "BMW M2", "BMW M8"],
    "suv": ["BMW X1", "BMW X3", "BMW X5", "BMW X6", "BMW X7", "BMW XM"],
    "electricos": ["BMW i4", "BMW iX", "BMW iX3", "BMW i5", "BMW i7"],
    "sedan": ["BMW Serie 3", "BMW Serie 5", "BMW Serie 7", "BMW Serie 2 Gran Coupé"],
    "hatchback": ["BMW Serie 1"],
    "compactos": ["BMW Serie 1", "BMW Serie 2"],
    "familiar": ["BMW Serie 3 Touring", "BMW Serie 5 Touring"],
    "híbridos": ["BMW 330e", "BMW 530e", "BMW X5 xDrive45e"],
    "lujo": ["BMW Serie 7", "BMW i7"]
  },
  "Mercedes-Benz": {
    "deportivos": ["Mercedes-AMG C63", "Mercedes-AMG E63", "Mercedes-AMG A45"],
    "suv": ["Mercedes-Benz GLA", "Mercedes-Benz GLC", "Mercedes-Benz GLE", "Mercedes-Benz GLS", "Mercedes-Benz G-Clase"],
    "electricos": ["Mercedes-Benz EQA", "Mercedes-Benz EQB", "Mercedes-Benz EQC", "Mercedes-Benz EQE", "Mercedes-Benz EQS"],
    "sedan": ["Mercedes-Benz Clase A Sedán", "Mercedes-Benz Clase C", "Mercedes-Benz Clase E", "Mercedes-Benz Clase S"],
    "hatchback": ["Mercedes-Benz Clase A", "Mercedes-Benz Clase B"],
    "compactos": ["Mercedes-Benz Clase A", "Mercedes-Benz Clase B"],
    "familiar": ["Mercedes-Benz Clase C Estate", "Mercedes-Benz Clase E Estate"],
    "híbridos": ["Mercedes-Benz C 300 e", "Mercedes-Benz E 300 e"],
    "lujo": ["Mercedes-Benz Clase S", "Mercedes-Benz Maybach"]
  },
  "Nissan": {
    "deportivos": ["Nissan 370Z", "Nissan Z"],
    "suv": ["Nissan Juke", "Nissan Qashqai", "Nissan X-Trail", "Nissan Ariya", "Nissan Pathfinder"],
    "electricos": ["Nissan Leaf", "Nissan Ariya"],
    "sedan": ["Nissan Sentra", "Nissan Altima"],
    "hatchback": ["Nissan Micra", "Nissan Leaf"],
    "compactos": ["Nissan Micra", "Nissan Juke"],
    "familiar": ["Nissan X-Trail", "Nissan Pathfinder"],
    "pickup": ["Nissan Navara", "Nissan Frontier"],
    "híbridos": ["Nissan X-Trail e-Power", "Nissan Qashqai e-Power"],
    "lujo": []
  },
  "Porsche": {
    "deportivos": ["Porsche 718 Cayman", "Porsche 718 Boxster"],
    "suv": ["Porsche Cayenne", "Porsche Macan"],
    "electricos": ["Porsche Taycan", "Porsche Taycan Cross Turismo", "Porsche Macan EV"],
    "sedan": ["Porsche Panamera", "Porsche Taycan"],
    "hatchback": [],
    "compactos": ["Porsche 718 Cayman"],
    "familiar": ["Porsche Panamera Sport Turismo", "Porsche Cayenne Coupé"],
    "híbridos": ["Porsche Cayenne E-Hybrid", "Porsche Panamera 4 E-Hybrid"],
    "lujo": ["Porsche Panamera", "Porsche 911 Turbo S"]
  },
  "Tesla": {
    "deportivos": ["Tesla Roadster"],
    "suv": ["Tesla Model X", "Tesla Model Y"],
    "electricos": ["Tesla Model 3", "Tesla Model Y", "Tesla Model S Plaid", "Tesla Model X"],
    "sedan": ["Tesla Model S Plaid", "Tesla Model 3"],
    "hatchback": [],
    "compactos": ["Tesla Model 3"],
    "familiar": ["Tesla Model X", "Tesla Model Y"],
    "pickup": ["Tesla Cybertruck"],
    "híbridos": [],
    "lujo": ["Tesla Model S Plaid"]
  },
  "Toyota": {
    "deportivos": ["Toyota GR Supra", "Toyota GR86", "Toyota GR Yaris"],
    "suv": ["Toyota RAV4", "Toyota C-HR", "Toyota Highlander", "Toyota Land Cruiser", "Toyota Hilux"],
    "electricos": ["Toyota bZ4X"],
    "sedan": ["Toyota Corolla", "Toyota Camry", "Toyota Avensis"],
    "hatchback": ["Toyota Corolla", "Toyota Yaris", "Toyota GR Yaris"],
    "compactos": ["Toyota Yaris", "Toyota Aygo"],
    "familiar": ["Toyota RAV4", "Toyota Highlander", "Toyota Land Cruiser"],
    "pickup": ["Toyota Hilux"],
    "híbridos": ["Toyota Prius", "Toyota Corolla Hybrid", "Toyota RAV4 Hybrid"],
    "lujo": []
  },
  "Honda": {
    "deportivos": ["Honda Civic Type R", "Honda NSX"],
    "suv": ["Honda CR-V", "Honda HR-V", "Honda Pilot"],
    "electricos": ["Honda e", "Honda Prologue"],
    "sedan": ["Honda Civic", "Honda Accord"],
    "hatchback": ["Honda Civic", "Honda Jazz"],
    "compactos": ["Honda Jazz", "Honda Civic"],
    "familiar": ["Honda CR-V", "Honda Pilot"],
    "híbridos": ["Honda CR-V Hybrid", "Honda Accord Hybrid"],
    "lujo": ["Honda Accord", "Honda Legend"]
  },
  "Ford": {
    "deportivos": ["Ford Mustang Mach-E GT"],
    "suv": ["Ford Puma", "Ford Kuga", "Ford Explorer", "Ford Bronco"],
    "electricos": ["Ford Mustang Mach-E", "Ford F-150 Lightning"],
    "sedan": ["Ford Focus", "Ford Mondeo"],
    "hatchback": ["Ford Focus", "Ford Fiesta"],
    "compactos": ["Ford Fiesta", "Ford Focus"],
    "familiar": ["Ford Explorer", "Ford S-MAX"],
    "pickup": ["Ford Ranger", "Ford F-150", "Ford F-150 Lightning"],
    "híbridos": ["Ford Kuga PHEV", "Ford Transit Custom PHEV"],
    "lujo": ["Ford Mustang", "Ford Explorer"]
  },
  "Chevrolet": {
    "deportivos": ["Chevrolet Camaro", "Chevrolet Corvette"],
    "suv": ["Chevrolet Trax", "Chevrolet Equinox", "Chevrolet Tahoe", "Chevrolet Suburban"],
    "electricos": ["Chevrolet Bolt", "Chevrolet Equinox EV"],
    "sedan": ["Chevrolet Malibu", "Chevrolet Onix"],
    "hatchback": ["Chevrolet Bolt"],
    "compactos": ["Chevrolet Onix", "Chevrolet Spark"],
    "familiar": ["Chevrolet Tahoe", "Chevrolet Suburban"],
    "pickup": ["Chevrolet Silverado", "Chevrolet Colorado"],
    "híbridos": [],
    "lujo": ["Chevrolet Corvette", "Chevrolet Tahoe"]
  },
  "Hyundai": {
    "deportivos": ["Hyundai i30 N", "Hyundai Elantra N"],
    "suv": ["Hyundai Kona", "Hyundai Tucson", "Hyundai Santa Fe", "Hyundai Palisade"],
    "electricos": ["Hyundai Ioniq 5", "Hyundai Ioniq 6", "Hyundai Kona Electric"],
    "sedan": ["Hyundai Elantra", "Hyundai Sonata"],
    "hatchback": ["Hyundai i30", "Hyundai i20"],
    "compactos": ["Hyundai i10", "Hyundai i20"],
    "familiar": ["Hyundai Santa Fe", "Hyundai Palisade"],
    "híbridos": ["Hyundai Tucson Hybrid", "Hyundai Sonata Hybrid"],
    "lujo": ["Hyundai Genesis G80", "Hyundai Genesis G90"]
  },
  "Kia": {
    "deportivos": ["Kia Stinger", "Kia EV6 GT"],
    "suv": ["Kia Sportage", "Kia Sorento", "Kia Telluride", "Kia Niro"],
    "electricos": ["Kia EV6", "Kia EV9", "Kia Niro EV"],
    "sedan": ["Kia K5", "Kia Rio Sedán"],
    "hatchback": ["Kia Rio", "Kia Ceed"],
    "compactos": ["Kia Picanto", "Kia Rio"],
    "familiar": ["Kia Sorento", "Kia Carnival"],
    "híbridos": ["Kia Sportage Hybrid", "Kia Sorento Hybrid"],
    "lujo": ["Kia K9", "Kia EV9"]
  },
  "Renault": {
    "deportivos": ["Renault Megane RS", "Renault Alpine A110"],
    "suv": ["Renault Captur", "Renault Arkana", "Renault Koleos", "Renault Austral"],
    "electricos": ["Renault Zoe", "Renault Megane E-Tech", "Renault Scenic E-Tech"],
    "sedan": ["Renault Talisman", "Renault Logan"],
    "hatchback": ["Renault Clio", "Renault Megane"],
    "compactos": ["Renault Clio", "Renault Twingo"],
    "familiar": ["Renault Scenic", "Renault Espace"],
    "híbridos": ["Renault Clio E-Tech", "Renault Captur E-Tech"],
    "lujo": ["Renault Talisman", "Renault Espace"]
  },
  "Peugeot": {
    "deportivos": ["Peugeot 208 GTi", "Peugeot 308 GTi"],
    "suv": ["Peugeot 2008", "Peugeot 3008", "Peugeot 5008"],
    "electricos": ["Peugeot e-208", "Peugeot e-2008", "Peugeot e-308"],
    "sedan": ["Peugeot 508", "Peugeot 301"],
    "hatchback": ["Peugeot 208", "Peugeot 308"],
    "compactos": ["Peugeot 208", "Peugeot 108"],
    "familiar": ["Peugeot 5008", "Peugeot Rifter"],
    "híbridos": ["Peugeot 308 Hybrid", "Peugeot 508 Hybrid"],
    "lujo": ["Peugeot 508", "Peugeot 5008"]
  },
  "Volkswagen": {
    "deportivos": ["Volkswagen Golf GTI", "Volkswagen Golf R", "Volkswagen Arteon R"],
    "suv": ["Volkswagen T-Cross", "Volkswagen T-Roc", "Volkswagen Tiguan", "Volkswagen Touareg", "Volkswagen Taigo"],
    "electricos": ["Volkswagen ID.3", "Volkswagen ID.4", "Volkswagen ID.5", "Volkswagen ID.7", "Volkswagen ID. Buzz"],
    "sedan": ["Volkswagen Passat", "Volkswagen Jetta", "Volkswagen Arteon"],
    "hatchback": ["Volkswagen Golf", "Volkswagen Polo"],
    "compactos": ["Volkswagen Polo", "Volkswagen Golf"],
    "familiar": ["Volkswagen Passat Variant", "Volkswagen Tiguan Allspace"],
    "híbridos": ["Volkswagen Golf GTE", "Volkswagen Passat GTE"],
    "lujo": ["Volkswagen Arteon", "Volkswagen Touareg"]
  },
  "Volvo": {
    "deportivos": ["Volvo S60 Recharge", "Volvo V60 Polestar"],
    "suv": ["Volvo XC40", "Volvo XC60", "Volvo XC90"],
    "electricos": ["Volvo EX30", "Volvo EX90", "Volvo XC40 Recharge"],
    "sedan": ["Volvo S60", "Volvo S90"],
    "hatchback": [],
    "compactos": ["Volvo EX30", "Volvo XC40"],
    "familiar": ["Volvo V60", "Volvo V90", "Volvo XC90"],
    "híbridos": ["Volvo XC60 Recharge", "Volvo XC90 Recharge"],
    "lujo": ["Volvo S90", "Volvo XC90"]
  },
  "Mazda": {
    "deportivos": ["Mazda MX-5", "Mazda 3 Turbo"],
    "suv": ["Mazda CX-3", "Mazda CX-30", "Mazda CX-5", "Mazda CX-60", "Mazda CX-90"],
    "electricos": ["Mazda MX-30 EV"],
    "sedan": ["Mazda 3", "Mazda 6"],
    "hatchback": ["Mazda 3", "Mazda 2"],
    "compactos": ["Mazda 2", "Mazda 3"],
    "familiar": ["Mazda CX-5", "Mazda CX-60"],
    "híbridos": ["Mazda CX-60 PHEV"],
    "lujo": ["Mazda 6", "Mazda CX-90"]
  },
  "Subaru": {
    "deportivos": ["Subaru BRZ", "Subaru WRX STI"],
    "suv": ["Subaru XV", "Subaru Forester", "Subaru Outback"],
    "electricos": ["Subaru Solterra"],
    "sedan": ["Subaru Impreza", "Subaru WRX"],
    "hatchback": ["Subaru Impreza", "Subaru XV"],
    "compactos": ["Subaru Impreza"],
    "familiar": ["Subaru Outback", "Subaru Forester"],
    "híbridos": ["Subaru Crosstrek Hybrid", "Subaru Forester Hybrid"],
    "lujo": ["Subaru Outback", "Subaru WRX"]
  },
  "Lexus": {
    "deportivos": ["Lexus RC F", "Lexus LC"],
    "suv": ["Lexus UX", "Lexus NX", "Lexus RX", "Lexus RZ", "Lexus LX"],
    "electricos": ["Lexus RZ", "Lexus UX 300e"],
    "sedan": ["Lexus IS", "Lexus ES", "Lexus LS"],
    "hatchback": [],
    "compactos": ["Lexus UX"],
    "familiar": ["Lexus RX", "Lexus TX"],
    "híbridos": ["Lexus RX 450h", "Lexus ES 300h", "Lexus NX 350h"],
    "lujo": ["Lexus LS", "Lexus LX"]
  },
  "Jeep": {
    "deportivos": ["Jeep Wrangler Rubicon", "Jeep Grand Cherokee Trackhawk"],
    "suv": ["Jeep Renegade", "Jeep Compass", "Jeep Cherokee", "Jeep Grand Cherokee", "Jeep Wrangler"],
    "electricos": ["Jeep Avenger", "Jeep Wrangler 4xe"],
    "sedan": [],
    "hatchback": [],
    "compactos": ["Jeep Renegade", "Jeep Avenger"],
    "familiar": ["Jeep Grand Cherokee", "Jeep Wrangler"],
    "pickup": ["Jeep Gladiator"],
    "híbridos": ["Jeep Wrangler 4xe", "Jeep Grand Cherokee 4xe"],
    "lujo": ["Jeep Grand Cherokee", "Jeep Wagoneer"]
  },
  "Land Rover": {
    "deportivos": ["Land Rover Range Rover Sport SVR", "Land Rover Defender V8"],
    "suv": ["Land Rover Range Rover Evoque", "Land Rover Range Rover Velar", "Land Rover Range Rover Sport", "Land Rover Defender", "Land Rover Discovery"],
    "electricos": ["Land Rover Range Rover Electric"],
    "sedan": [],
    "hatchback": [],
    "compactos": ["Land Rover Range Rover Evoque"],
    "familiar": ["Land Rover Discovery", "Land Rover Defender 110"],
    "pickup": [],
    "híbridos": ["Land Rover Range Rover PHEV", "Land Rover Defender PHEV"],
    "lujo": ["Land Rover Range Rover", "Land Rover Range Rover SV"]
  },
  "Ferrari": {
    "deportivos": ["Ferrari 296 GTB", "Ferrari 812 Superfast", "Ferrari F8 Tributo", "Ferrari SF90 Stradale"],
    "suv": ["Ferrari Purosangue"],
    "electricos": [],
    "sedan": [],
    "hatchback": [],
    "compactos": [],
    "familiar": [],
    "híbridos": ["Ferrari 296 GTB", "Ferrari SF90 Stradale"],
    "lujo": ["Ferrari Roma", "Ferrari 812 Superfast"]
  },
  "Lamborghini": {
    "deportivos": ["Lamborghini Huracán", "Lamborghini Revuelto"],
    "suv": ["Lamborghini Urus"],
    "electricos": [],
    "sedan": [],
    "hatchback": [],
    "compactos": [],
    "familiar": [],
    "híbridos": ["Lamborghini Revuelto", "Lamborghini Urus SE"],
    "lujo": ["Lamborghini Huracán", "Lamborghini Urus"]
  }
};

// Generate brandModels from mega-menu-data.js structure
const brandModels = {};
brandRegistry.brands.forEach(brand => {
  brandModels[brand.name] = {};
  brand.categories.forEach(categoryId => {
    const category = categoryRegistry.categories.find(c => c.id === categoryId);
    if (category) {
      // Get cars for this brand and category
      const cars = carRegistry.cars.filter(car => 
        car.brandId === brand.id && car.categoryId === categoryId
      );
      
      const registryModels = cars.map(car => {
        const carData = loadCarData(car);
        const brandName = brandRegistry.brands.find(b => b.id === car.brandId)?.name || '';
        const carName = carData ? carData.basicInfo.name : car.id;
        return `${brandName} ${carName}`;
      });
      
      // Merge registry models with extra popular models (avoid duplicates)
      const extras = (extraModels[brand.name] && extraModels[brand.name][category.id]) || [];
      const merged = [...new Set([...registryModels, ...extras])];
      brandModels[brand.name][category.id] = merged;
    }
  });
});

// Generate output file
const output = `/**
 * carspecio — Mega Menu Brand/Category/Model Data
 * AUTO-GENERATED from central registries
 * DO NOT EDIT MANUALLY - Use system/generators/mega-menu-generator.js
 */

/* ── Page links per known model ─────────────────────────── */
const modelPageMap = ${JSON.stringify(modelPageMap, null, 4)};

/* ── Brand logo map (SimpleIcons CDN) ───────────────────── */
const brandLogoMap = ${JSON.stringify(brandLogoMap, null, 4)};

/* ── Category icon map ──────────────────────────────────── */
const categoryIconMap = ${JSON.stringify(categoryIconMap, null, 4)};

/* ── Brand models data ──────────────────────────────────── */
const brandModels = ${JSON.stringify(brandModels, null, 4)};
`;

// Write output file
const outputPath = path.join(__dirname, '../../js/mega-menu-data.js');
fs.writeFileSync(outputPath, output);

console.log('✅ mega-menu-data.js generated successfully');
console.log(`📁 Output: ${outputPath}`);
console.log(`📊 Cars: ${Object.keys(modelPageMap).length}`);
console.log(`🏷️  Brands: ${Object.keys(brandLogoMap).length}`);
console.log(`📂 Categories: ${Object.keys(categoryIconMap).length}`);
