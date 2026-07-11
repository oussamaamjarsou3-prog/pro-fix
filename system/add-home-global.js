const fs = require('fs');
const path = require('path');

const htmlDir = path.join(__dirname, '../html');
const files = [
  'article.html',
  'compare.html',
  'contacto.html',
  'diagnostico.html',
  'herramientas.html',
  'marcas.html',
  'reviews.html'
];

for (const file of files) {
  const filePath = path.join(htmlDir, file);
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${file} (not found)`);
    continue;
  }
  let content = fs.readFileSync(filePath, 'utf8');

  if (content.includes('home-global.css')) {
    console.log(`Already has home-global.css: ${file}`);
    continue;
  }

  content = content.replace(
    /<link rel="stylesheet" href="css\/variables\.css">/,
    `<link rel="stylesheet" href="css/variables.css">\n    <link rel="stylesheet" href="css/home-global.css">`
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Added home-global.css to ${file}`);
}
