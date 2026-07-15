const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const srcDir = path.join(__dirname, 'images', 'Hyundai-Ioniq-6-N');
const outDir = path.join(__dirname, 'html', 'images');

async function main() {
  // Hero image: 1536x864
  const heroSrc = path.join(srcDir, 'Hyundai-Ioniq-hero.png');
  const heroOut = path.join(outDir, 'hyundai-ioniq-6n.hero.2026.webp');
  await sharp(heroSrc)
    .resize(1536, 864, { fit: 'cover', position: 'centre' })
    .webp({ quality: 80 })
    .toFile(heroOut);
  console.log('hero done:', Math.round(fs.statSync(heroOut).size / 1024) + 'KB');

  // Hero medium and thumb
  const heroMedium = path.join(outDir, 'hyundai-ioniq-6n.hero.2026-medium.webp');
  await sharp(heroSrc)
    .resize(768, 432, { fit: 'cover', position: 'centre' })
    .webp({ quality: 75 })
    .toFile(heroMedium);
  console.log('hero medium done:', Math.round(fs.statSync(heroMedium).size / 1024) + 'KB');

  const heroThumb = path.join(outDir, 'hyundai-ioniq-6n.hero.2026-thumb.webp');
  await sharp(heroSrc)
    .resize(400, 225, { fit: 'cover', position: 'centre' })
    .webp({ quality: 70 })
    .toFile(heroThumb);
  console.log('hero thumb done:', Math.round(fs.statSync(heroThumb).size / 1024) + 'KB');

  // Gallery images: 800x600
  const galleryFiles = [
    { src: 'Hyundai-Ioniq-galeria.1.png', out: 'hyundai-ioniq-6n.1.2026.webp' },
    { src: 'Hyundai-Ioniq-galeria.2.png', out: 'hyundai-ioniq-6n.2.2026.webp' },
    { src: 'Hyundai-Ioniq-galeria.3.png', out: 'hyundai-ioniq-6n.3.2026.webp' },
    { src: 'Hyundai-Ioniq-galeria.png', out: 'hyundai-ioniq-6n.4.2026.webp' }
  ];

  for (const g of galleryFiles) {
    const srcPath = path.join(srcDir, g.src);
    if (!fs.existsSync(srcPath)) {
      console.log('skipping (not found):', g.src);
      continue;
    }
    const outPath = path.join(outDir, g.out);
    await sharp(srcPath)
      .resize(800, 600, { fit: 'cover', position: 'centre' })
      .webp({ quality: 78 })
      .toFile(outPath);
    console.log(g.out + ' done:', Math.round(fs.statSync(outPath).size / 1024) + 'KB');
  }

  console.log('All images compressed successfully');
}

main().catch(e => { console.error(e); process.exit(1); });
