/**
 * CarSpecio — Sitemap Generator
 * Generates sitemap.xml from car and guide registries
 */

const fs = require('fs');
const path = require('path');
const { BASE_URL } = require('../config');

// Load registries
const carRegistry = JSON.parse(fs.readFileSync(path.join(__dirname, '../registry/car-registry.json'), 'utf8'));
const guideRegistry = JSON.parse(fs.readFileSync(path.join(__dirname, '../registry/guide-registry.json'), 'utf8'));

// Generate sitemap entries
const sitemapEntries = [];

// Add homepage
sitemapEntries.push({
  loc: `${BASE_URL}/`,
  lastmod: new Date().toISOString(),
  changefreq: 'daily',
  priority: 1.0
});

// Add main pages
const mainPages = [
  { path: '/compare.html', priority: 0.9, changefreq: 'daily' },
  { path: '/reviews.html', priority: 0.8, changefreq: 'daily' },
  { path: '/herramientas.html', priority: 0.7, changefreq: 'weekly' },
  { path: '/diagnostico.html', priority: 0.7, changefreq: 'weekly' },
  { path: '/budget.html', priority: 0.6, changefreq: 'weekly' },
  { path: '/category.html', priority: 0.6, changefreq: 'weekly' },
  { path: '/marcas.html', priority: 0.6, changefreq: 'weekly' },
  { path: '/noticias.html', priority: 0.8, changefreq: 'daily' },
  { path: '/contacto.html', priority: 0.5, changefreq: 'monthly' },
  { path: '/privacidad.html', priority: 0.3, changefreq: 'yearly' },
  { path: '/cookies-policy.html', priority: 0.3, changefreq: 'yearly' },
  { path: '/terms-of-service.html', priority: 0.3, changefreq: 'yearly' },
  { path: '/guias/index.html', priority: 0.8, changefreq: 'weekly' }
];

mainPages.forEach(page => {
  sitemapEntries.push({
    loc: `${BASE_URL}${page.path}`,
    lastmod: new Date().toISOString(),
    changefreq: page.changefreq,
    priority: page.priority
  });
});

// Add car pages
carRegistry.cars.forEach(car => {
  if (car.status === 'active') {
    sitemapEntries.push({
      loc: `${BASE_URL}/${car.htmlFile}`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.8
    });
  }
});

// Add guide pages
guideRegistry.guides.forEach(guide => {
  if (guide.status === 'active') {
    sitemapEntries.push({
      loc: `${BASE_URL}/${guide.htmlFile}`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.7
    });
  }
});

// Add news articles
const noticiasDir = path.join(__dirname, '../data/noticias');
if (fs.existsSync(noticiasDir)) {
  const newsFiles = fs.readdirSync(noticiasDir).filter(f => f.endsWith('.json'));
  newsFiles.forEach(file => {
    try {
      const article = JSON.parse(fs.readFileSync(path.join(noticiasDir, file), 'utf8'));
      if (article.slug) {
        sitemapEntries.push({
          loc: `${BASE_URL}/noticias/${article.slug}.html`,
          lastmod: new Date().toISOString(),
          changefreq: 'weekly',
          priority: 0.6
        });
      }
    } catch (e) { /* skip invalid */ }
  });
}

// Generate XML sitemap
let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

sitemapEntries.forEach(entry => {
  xml += '  <url>\n';
  xml += `    <loc>${entry.loc}</loc>\n`;
  xml += `    <lastmod>${entry.lastmod}</lastmod>\n`;
  xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
  xml += `    <priority>${entry.priority}</priority>\n`;
  xml += '  </url>\n';
});

xml += '</urlset>';

// Write output file to the deployable html/ folder
const outputPath = path.join(__dirname, '../../html/sitemap.xml');
fs.writeFileSync(outputPath, xml);

console.log('✅ sitemap.xml generated successfully');
console.log(`📁 Output: ${outputPath}`);
console.log(`📊 Total URLs: ${sitemapEntries.length}`);
console.log(`🚗 Car pages: ${carRegistry.cars.filter(c => c.status === 'active').length}`);
console.log(`📚 Guide pages: ${guideRegistry.guides.filter(g => g.status === 'active').length}`);
