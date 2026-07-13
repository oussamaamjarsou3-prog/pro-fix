const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const projectDir = path.join(__dirname, '..');
const sourcePng = path.join(projectDir, 'images/logo/logo-carspesio.webp');
const logoDir = path.join(projectDir, 'assets/logo');

if (!fs.existsSync(sourcePng)) {
  console.error('Source logo not found:', sourcePng);
  process.exit(1);
}

if (!fs.existsSync(logoDir)) {
  fs.mkdirSync(logoDir, { recursive: true });
}

async function generatePng(width, height, outputName, options = {}) {
  const outputPath = path.join(logoDir, outputName);
  let pipeline = sharp(sourcePng)
    .trim()
    .resize(width, height, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } });

  if (options.grayscale) {
    pipeline = pipeline.grayscale();
  }

  await pipeline.png().toFile(outputPath);
  console.log(`Generated PNG: ${outputPath}`);
}

function createPngWrapperSvg(width, height, pngName, outputName, filter = '') {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <image href="${pngName}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid meet"${filter ? ` style="${filter}"` : ''}/>
</svg>`;
  const outputPath = path.join(logoDir, outputName);
  fs.writeFileSync(outputPath, svg, 'utf8');
  console.log(`Generated SVG: ${outputPath}`);
}

async function generateFavicon(size, outputName) {
  const outputPath = path.join(logoDir, outputName);
  await sharp(sourcePng)
    .trim()
    .resize(size, size, { fit: 'contain', background: { r: 37, g: 99, b: 235, alpha: 1 } })
    .flatten({ background: { r: 37, g: 99, b: 235 } })
    .png()
    .toFile(outputPath);
  console.log(`Generated favicon: ${outputPath}`);
}

async function main() {
  // Responsive PNG variants
  await generatePng(232, 54, 'carspecio-desktop.png');
  await generatePng(180, 46, 'carspecio-tablet.png');
  await generatePng(130, 40, 'carspecio-mobile.png');

  // Responsive SVG wrappers that reference the PNGs
  createPngWrapperSvg(232, 54, 'carspecio-desktop.png', 'carspecio-desktop.svg');
  createPngWrapperSvg(180, 46, 'carspecio-tablet.png', 'carspecio-tablet.svg');
  createPngWrapperSvg(130, 40, 'carspecio-mobile.png', 'carspecio-mobile.svg');

  // Dark / light / monochrome variants
  createPngWrapperSvg(232, 54, 'carspecio-desktop.png', 'carspecio-dark.svg', 'filter: brightness(0) invert(1)');
  createPngWrapperSvg(232, 54, 'carspecio-desktop.png', 'carspecio-light.svg');
  createPngWrapperSvg(232, 54, 'carspecio-desktop.png', 'carspecio-monochrome.svg', 'filter: grayscale(1) brightness(0) invert(1)');

  // Favicons
  await generateFavicon(32, 'favicon-32.png');
  await generateFavicon(64, 'favicon-64.png');
  await generateFavicon(180, 'apple-touch-icon.png');

  console.log('All logo assets generated from source PNG.');
}

main().catch(err => {
  console.error('Error generating logos:', err);
  process.exit(1);
});
