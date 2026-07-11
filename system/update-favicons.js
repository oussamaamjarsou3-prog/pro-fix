const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, 'templates');
const htmlDir = path.join(__dirname, '../html');

const templateFiles = [
  { file: 'news-template.html', rootPrefix: '' },
  { file: 'news-magazine-template.html', rootPrefix: '../' },
  { file: 'news-article-template.html', rootPrefix: '../' },
  { file: 'guide-template.html', rootPrefix: '../' },
  { file: 'guide-index-template.html', rootPrefix: '../' },
  { file: 'car-template.html', rootPrefix: '../' },
  { file: 'home-template.html', rootPrefix: '' }
];

const staticFiles = [
  'article.html',
  'compare.html',
  'contacto.html',
  'diagnostico.html',
  'herramientas.html',
  'index.html',
  'marcas.html',
  'noticias.html',
  'reviews.html',
  'guias/index.html'
];

function getRootPrefix(file) {
  const depth = file.split('/').length - 1;
  return depth === 0 ? '' : '../'.repeat(depth);
}

function buildFaviconBlock(rootPrefix) {
  return `<link rel="icon" href="${rootPrefix}assets/logo/favicon-32.png" type="image/png" sizes="32x32">
  <link rel="icon" href="${rootPrefix}assets/logo/favicon-64.png" type="image/png" sizes="64x64">
  <link rel="apple-touch-icon" href="${rootPrefix}assets/logo/apple-touch-icon.png">`;
}

function updateFile(filePath, rootPrefix) {
  let content = fs.readFileSync(filePath, 'utf8');
  const newBlock = buildFaviconBlock(rootPrefix);

  // Replace existing favicon.svg links
  content = content.replace(
    /<link rel="icon"[^>]*href="[^"]*favicon\.svg"[^>]*>/g,
    newBlock
  );

  // If no favicon link exists, add it before the theme script
  if (!content.includes('assets/logo/favicon-32.png')) {
    content = content.replace(
      /<script>try\{if\(localStorage\.getItem/,
      `${newBlock}\n  <script>try{if(localStorage.getItem`
    );
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated favicons in ${path.relative(__dirname, filePath)}`);
}

for (const { file, rootPrefix } of templateFiles) {
  const filePath = path.join(templatesDir, file);
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${file} (not found)`);
    continue;
  }
  updateFile(filePath, rootPrefix);
}

for (const file of staticFiles) {
  const filePath = path.join(htmlDir, file);
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${file} (not found)`);
    continue;
  }
  updateFile(filePath, getRootPrefix(file));
}

console.log('Favicon links updated.');
