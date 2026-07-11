const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, 'templates');
const partialsDir = path.join(templatesDir, 'partials');

const headerPartial = fs.readFileSync(path.join(partialsDir, 'site-header.html'), 'utf8');
const footerPartial = fs.readFileSync(path.join(partialsDir, 'site-footer.html'), 'utf8');

const templates = [
  { file: 'guide-template.html', rootPrefix: '../' },
  { file: 'guide-index-template.html', rootPrefix: '../' },
  { file: 'news-template.html', rootPrefix: '' },
  { file: 'news-article-template.html', rootPrefix: '../' },
  { file: 'news-magazine-template.html', rootPrefix: '../' },
];

for (const { file, rootPrefix } of templates) {
  const filePath = path.join(templatesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  const headerReplacement = headerPartial
    .replace(/\{\{rootPrefix\}\}/g, rootPrefix);

  const footerReplacement = footerPartial
    .replace(/\{\{rootPrefix\}\}/g, rootPrefix)
    .replace(/\{\{year\}\}/g, '2026');

  // Replace header block from <header class="site-header"> to closing </header>
  content = content.replace(
    /<header class="site-header"[\s\S]*?<\/header>/,
    headerReplacement.trim()
  );

  // Replace footer block from <footer class="site-footer"> to closing </footer>
  content = content.replace(
    /<footer class="site-footer"[\s\S]*?<\/footer>/,
    footerReplacement.trim()
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
}
