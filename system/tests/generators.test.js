const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SYSTEM_DIR = path.join(__dirname, '..');
const PROJECT_DIR = path.join(SYSTEM_DIR, '..');

function runGenerator(name) {
    const scriptPath = path.join(SYSTEM_DIR, 'generators', name);
    execSync(`node "${scriptPath}"`, { cwd: SYSTEM_DIR, stdio: 'pipe' });
}

test('guide generator produces guide pages', () => {
    runGenerator('guide-generator.js');
    const outputDir = path.join(PROJECT_DIR, 'html', 'guias');
    assertTrue(fs.existsSync(outputDir), 'Output directory should exist');
    const files = fs.readdirSync(outputDir).filter(f => f.endsWith('.html'));
    assertTrue(files.length > 0, 'Should generate at least one guide page');
});

test('guide index generator produces index page', () => {
    runGenerator('guide-index-generator.js');
    const indexPath = path.join(PROJECT_DIR, 'html', 'guias', 'index.html');
    assertTrue(fs.existsSync(indexPath), 'Guide index page should exist');
    const html = fs.readFileSync(indexPath, 'utf8');
    assertIncludes(html, 'carspecio.com', 'Guide index should use carspecio.com');
    assertIncludes(html, 'ItemList', 'Guide index should have ItemList JSON-LD');
    assertIncludes(html, 'BreadcrumbList', 'Guide index should have BreadcrumbList JSON-LD');
});

test('search index generator produces search index', () => {
    runGenerator('search-index-generator.js');
    const searchIndexPath = path.join(PROJECT_DIR, 'js', 'search-index.js');
    assertTrue(fs.existsSync(searchIndexPath), 'search-index.js should exist');
    const content = fs.readFileSync(searchIndexPath, 'utf8');
    assertIncludes(content, 'CARSPECIO_SEARCH', 'Should expose CARSPECIO_SEARCH');
    assertIncludes(content, 'carspecio.com', 'Search index should use carspecio.com');
});

test('sitemap generator produces sitemap', () => {
    runGenerator('sitemap-generator.js');
    const sitemapPath = path.join(PROJECT_DIR, 'sitemap.xml');
    assertTrue(fs.existsSync(sitemapPath), 'sitemap.xml should exist');
    const sitemap = fs.readFileSync(sitemapPath, 'utf8');
    assertIncludes(sitemap, 'https://carspecio.com', 'Sitemap should use carspecio.com');
    assertIncludes(sitemap, 'guias/index.html', 'Sitemap should include guide index');
});

test('car page generator produces car pages', () => {
    runGenerator('car-page-generator.js');
    const outputDir = path.join(PROJECT_DIR, 'html');
    const files = fs.readdirSync(outputDir).filter(f => f.endsWith('.html') && f !== 'index.html');
    assertTrue(files.length > 0, 'Should generate at least one car page');
});

test('compare data generator produces compare data', () => {
    runGenerator('compare-data-generator.js');
    const comparePath = path.join(PROJECT_DIR, 'js', 'compare-data.js');
    assertTrue(fs.existsSync(comparePath), 'compare-data.js should exist');
    const content = fs.readFileSync(comparePath, 'utf8');
    assertIncludes(content, 'CARSPECIO_COMPARE_CARS', 'Should expose CARSPECIO_COMPARE_CARS');
});

test('mega menu generator produces mega menu data', () => {
    runGenerator('mega-menu-generator.js');
    const megaMenuPath = path.join(PROJECT_DIR, 'js', 'mega-menu-data.js');
    assertTrue(fs.existsSync(megaMenuPath), 'mega-menu-data.js should exist');
});
