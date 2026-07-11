const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, 'templates');
const htmlDir = path.join(__dirname, '../html');

const templates = [
  { file: 'guide-template.html', active: 'Guías' },
  { file: 'guide-index-template.html', active: 'Guías' },
  { file: 'news-template.html', active: 'Noticias' },
  { file: 'news-article-template.html', active: 'Noticias' },
  { file: 'news-magazine-template.html', active: 'Noticias' }
];

const staticPages = [
  { file: 'compare.html', active: 'Comparar' },
  { file: 'reviews.html', active: 'Reviews' },
  { file: 'diagnostico.html', active: 'Diagnóstico' },
  { file: 'herramientas.html', active: 'Herramientas' },
  { file: 'marcas.html', active: 'Marcas' },
  { file: 'contacto.html', active: 'Contacto' },
  { file: 'article.html', active: 'Noticias' }
];

function setActive(content, label) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  if (label === 'Marcas') {
    return content.replace(
      /<a class="mega-menu-link"(?![^>]*\bactive\b)/,
      '<a class="mega-menu-link active"'
    );
  }
  return content.replace(
    new RegExp(`(<a href="[^"]*"[^>]*?)(>\\s*${escaped}\\s*</a>)`),
    '$1 class="active"$2'
  );
}

for (const { file, active } of templates) {
  const filePath = path.join(templatesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  content = setActive(content, active);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Set active ${active} in ${file}`);
}

for (const { file, active } of staticPages) {
  const filePath = path.join(htmlDir, file);
  if (!fs.existsSync(filePath)) continue;
  let content = fs.readFileSync(filePath, 'utf8');
  content = setActive(content, active);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Set active ${active} in ${file}`);
}
