const fs = require('fs');
const path = require('path');

// Add missing keys to all locale files
const missingKeys = {
  "nav": {
    "home": "Inicio",
    "compare": "Comparar",
    "gallery": "Galería",
    "price": "Precio",
    "faq": "FAQ"
  },
  "calc": {
    "km": "km",
    "purchaseType": "Tipo de compra",
    "drivingStyle": "Estilo de conducción",
    "calm": "Tranquilo",
    "mixed": "Mixto",
    "sport": "Deportivo",
    "fuelYear": "Combustible/año",
    "maintYear": "Mantenimiento/año",
    "depYear": "Depreciación/año",
    "totalYear": "Total/año",
    "compareTitle": "Comparativa de costes anuales"
  },
  "timeline": {
    "titleFull": "Timeline de mantenimiento {{shortName}}"
  },
  "worth": {
    "tag": "CONCLUSIÓN"
  },
  "cta": {
    "btn": "Comparar con rivals"
  },
  "footer": {
    "desc": "Información técnica verificada y opiniones reales de propietarios.",
    "pages": "Páginas"
  }
};

function mergeKeys(target, source) {
  for (const [key, value] of Object.entries(source)) {
    if (typeof value === 'object' && value !== null) {
      if (!target[key]) target[key] = {};
      mergeKeys(target[key], value);
    } else {
      if (!target[key]) target[key] = value;
    }
  }
}

// Process all locale files
const localesDir = path.join(__dirname, '../locales');
const files = ['es.json', 'fr.json', 'en.json', 'ar.json'];

files.forEach(file => {
  const filePath = path.join(localesDir, file);
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${file}`);
    return;
  }
  
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  mergeKeys(data, missingKeys);
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`✅ Updated: ${file}`);
});

console.log('Done!');
