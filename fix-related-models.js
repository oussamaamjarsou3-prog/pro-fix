const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'system', 'data');

const cars = [
  { file: 'rs7-2026.json', id: 'audi-rs7-2026' },
  { file: 'audi-rs3-2026.json', id: 'audi-rs3-2026' },
  { file: 'bmw-m5-2026.json', id: 'bmw-m5-2026' },
  { file: 'bmw-520d-xdrive-2026.json', id: 'bmw-520d-xdrive-2026' },
  { file: 'mercedes-amg-gt-2026.json', id: 'mercedes-amg-gt-2026' },
  { file: 'nissan-gtr-2026.json', id: 'nissan-gtr-2026' },
  { file: 'porsche-911-2026.json', id: 'porsche-911-2026' },
  { file: 'tesla-model-s-plaid-2026.json', id: 'tesla-model-s-plaid-2026' },
  { file: 'vw-passat-variant-2026.json', id: 'vw-passat-variant-2026' },
  { file: 'hyundai-ioniq-6n-2026.json', id: 'hyundai-ioniq-6n-2026' }
];

const carInfo = {};
cars.forEach(c => {
  const d = JSON.parse(fs.readFileSync(path.join(dataDir, c.file), 'utf8'));
  carInfo[c.id] = {
    slug: d.slug,
    name: d.basicInfo.name,
    fullModelName: d.basicInfo.fullModelName,
    nameAr: d.basicInfo.nameAr || '',
    brandId: d.brandId,
    categoryId: d.categoryId
  };
});

const relationships = {
  'audi-rs7-2026': ['audi-rs3-2026', 'bmw-m5-2026', 'mercedes-amg-gt-2026'],
  'audi-rs3-2026': ['audi-rs7-2026', 'bmw-m5-2026', 'nissan-gtr-2026'],
  'bmw-m5-2026': ['audi-rs7-2026', 'mercedes-amg-gt-2026', 'porsche-911-2026'],
  'bmw-520d-xdrive-2026': ['vw-passat-variant-2026', 'bmw-m5-2026', 'audi-rs7-2026'],
  'mercedes-amg-gt-2026': ['porsche-911-2026', 'nissan-gtr-2026', 'bmw-m5-2026'],
  'nissan-gtr-2026': ['porsche-911-2026', 'mercedes-amg-gt-2026', 'audi-rs3-2026'],
  'porsche-911-2026': ['nissan-gtr-2026', 'mercedes-amg-gt-2026', 'audi-rs7-2026'],
  'tesla-model-s-plaid-2026': ['hyundai-ioniq-6n-2026', 'porsche-911-2026', 'bmw-m5-2026'],
  'vw-passat-variant-2026': ['bmw-520d-xdrive-2026', 'bmw-m5-2026', 'audi-rs7-2026'],
  'hyundai-ioniq-6n-2026': ['tesla-model-s-plaid-2026', 'porsche-911-2026', 'nissan-gtr-2026']
};

cars.forEach(c => {
  const filePath = path.join(dataDir, c.file);
  const d = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const related = (relationships[c.id] || []).map(rid => {
    const info = carInfo[rid];
    if (!info) return null;
    return {
      name: info.fullModelName,
      slug: info.slug,
      nameAr: info.nameAr
    };
  }).filter(Boolean);

  d.relatedModels = related;
  fs.writeFileSync(filePath, JSON.stringify(d, null, 2), 'utf8');
  console.log(c.id + ': ' + related.map(r => r.slug).join(', '));
});

console.log('\nAll relatedModels updated!');
