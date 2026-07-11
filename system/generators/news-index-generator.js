/* CarSpecio — News Index Generator */
/* Reads all news JSON files and generates a lightweight index for dynamic rendering */
/* Run: node system/generators/news-index-generator.js */

const fs = require('fs');
const path = require('path');

const newsDir = path.join(__dirname, '../data/noticias');
const outputPath = path.join(__dirname, '../../js/news-index.js');
const outputHtmlPath = path.join(__dirname, '../../html/js/news-index.js');

const files = fs.readdirSync(newsDir).filter(f => f.endsWith('.json') && !f.endsWith('.backup.json'));

const index = files.map(file => {
    const data = JSON.parse(fs.readFileSync(path.join(newsDir, file), 'utf8'));
    return {
        id: data.id,
        slug: data.slug,
        htmlFile: 'noticias/' + (data.slug || data.id) + '.html',
        dataFile: 'system/data/noticias/' + file,
        category: data.category,
        date: data.date,
        source: data.source,
        image: (data.image || '').replace(/^\.\.\//, ''),
        tags: data.tags || [],
        title: {
            es: data.translations?.es?.title || data.title || '',
            en: data.translations?.en?.title || '',
            fr: data.translations?.fr?.title || '',
            ar: data.translations?.ar?.title || ''
        },
        excerpt: {
            es: data.translations?.es?.excerpt || '',
            en: data.translations?.en?.excerpt || '',
            fr: data.translations?.fr?.excerpt || '',
            ar: data.translations?.ar?.excerpt || ''
        }
    };
}).sort((a, b) => new Date(b.date) - new Date(a.date));

const sourceLabels = {
    'autocar': { icon: '🇬🇧', name: 'Autocar' },
    'car-and-driver': { icon: '🇺🇸', name: 'Car and Driver' },
    'motor-trend': { icon: '🇺🇸', name: 'Motor Trend' },
    'motor1': { icon: '🌍', name: 'Motor1.com' },
    'autoblog': { icon: '🇺🇸', name: 'Autoblog' },
    'audi-media-center': { icon: '🇩🇪', name: 'Audi Media Center' },
    'top-gear': { icon: '🇬🇧', name: 'Top Gear' },
    'auto-express': { icon: '🇬🇧', name: 'Auto Express' },
    'carsguide': { icon: '🇦🇺', name: 'CarsGuide' },
    'carbuzz': { icon: '🇺🇸', name: 'CarBuzz' }
};

const output = `/* CarSpecio — News Index */
/* AUTO-GENERATED from system/data/noticias/*.json */
/* DO NOT EDIT MANUALLY - Use system/generators/news-index-generator.js */

window.CARSPECIO_NEWS_INDEX = ${JSON.stringify(index, null, 4)};

window.CARSPECIO_NEWS_SOURCES = ${JSON.stringify(sourceLabels, null, 4)};
`;

fs.writeFileSync(outputPath, output);
fs.writeFileSync(outputHtmlPath, output);

console.log('✅ news-index.js generated successfully');
console.log(`📁 Output: ${outputPath}`);
console.log(`📁 Output: ${outputHtmlPath}`);
console.log(`📊 News articles indexed: ${index.length}`);
