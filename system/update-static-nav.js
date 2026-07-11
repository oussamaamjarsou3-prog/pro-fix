const fs = require('fs');
const path = require('path');

const htmlDir = path.join(__dirname, '../html');
const partialsDir = path.join(__dirname, 'templates/partials');

const headerPartial = fs.readFileSync(path.join(partialsDir, 'site-header.html'), 'utf8');
const footerPartial = fs.readFileSync(path.join(partialsDir, 'site-footer.html'), 'utf8');

const staticFiles = [
  'article.html',
  'compare.html',
  'contacto.html',
  'diagnostico.html',
  'herramientas.html',
  'marcas.html',
  'noticias.html',
  'reviews.html',
  'guias/index.html',
  'privacidad.html',
  'cookies-policy.html',
  'terms-of-service.html'
];

function getRootPrefix(file) {
  const depth = file.split('/').length - 1;
  return depth === 0 ? '' : '../'.repeat(depth);
}

for (const file of staticFiles) {
  const filePath = path.join(htmlDir, file);
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${file} (not found)`);
    continue;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  const rootPrefix = getRootPrefix(file);

  const headerReplacement = headerPartial.replace(/\{\{rootPrefix\}\}/g, rootPrefix);
  const footerReplacement = footerPartial
    .replace(/\{\{rootPrefix\}\}/g, rootPrefix)
    .replace(/\{\{year\}\}/g, '2026');

  // Add lang-dropdown.css if missing
  if (!content.includes('lang-dropdown.css')) {
    content = content.replace(
      /<link rel="stylesheet" href="css\/variables\.css">/,
      `<link rel="stylesheet" href="css/variables.css">\n    <link rel="stylesheet" href="css/lang-dropdown.css">`
    );
  }

  // Replace header
  content = content.replace(
    /<header[^>]*class="site-header"[^>]*>[\s\S]*?<\/header>/,
    headerReplacement.trim()
  );

  // Replace footer (match any footer class, or no class)
  content = content.replace(
    /<footer[\s\S]*?<\/footer>/,
    footerReplacement.trim()
  );

  // Add i18n and dropdowns scripts if missing
  if (!content.includes('js/i18n.js')) {
    content = content.replace(
      /<script src="js\/script\.js"><\/script>/,
      `<script src="js/i18n.js"></script>\n<script src="system/js/dropdowns.js"></script>\n<script src="js/script.js"></script>`
    );
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
}
