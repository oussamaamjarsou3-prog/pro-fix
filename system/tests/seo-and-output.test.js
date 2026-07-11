const fs = require('fs');
const path = require('path');

const PROJECT_DIR = path.join(__dirname, '..', '..');

test('guide pages have canonical URL and structured data', () => {
    const guideDir = path.join(PROJECT_DIR, 'html', 'guias');
    const files = fs.readdirSync(guideDir).filter(f => f.endsWith('.html') && f !== 'index.html');
    assertTrue(files.length > 0, 'Should have guide pages');
    for (const file of files) {
        const html = fs.readFileSync(path.join(guideDir, file), 'utf8');
        assertIncludes(html, '<link rel="canonical" href="https://carspecio.com/', `${file} should have canonical URL`);
        assertIncludes(html, 'hreflang="es"', `${file} should have es hreflang`);
        assertIncludes(html, '"@type": "Article"', `${file} should have Article JSON-LD`);
        assertIncludes(html, '"@type": "FAQPage"', `${file} should have FAQPage JSON-LD`);
        assertIncludes(html, '"@type": "BreadcrumbList"', `${file} should have BreadcrumbList JSON-LD`);
    }
});

test('car pages have canonical URL and breadcrumb JSON-LD', () => {
    const carRegistry = JSON.parse(fs.readFileSync(path.join(PROJECT_DIR, 'system', 'registry', 'car-registry.json'), 'utf8'));
    const htmlDir = path.join(PROJECT_DIR, 'html');
    const files = carRegistry.cars.filter(c => c.status === 'active').map(c => c.htmlFile);
    assertTrue(files.length > 0, 'Should have active car pages');
    for (const file of files) {
        const html = fs.readFileSync(path.join(htmlDir, file), 'utf8');
        assertIncludes(html, '<link rel="canonical" href="https://carspecio.com/', `${file} should have canonical URL`);
        assertIncludes(html, 'hreflang="es"', `${file} should have es hreflang`);
        assertIncludes(html, '"@type": "BreadcrumbList"', `${file} should have BreadcrumbList JSON-LD`);
    }
});

test('no old domain references remain in generated output', () => {
    const carRegistry = JSON.parse(fs.readFileSync(path.join(PROJECT_DIR, 'system', 'registry', 'car-registry.json'), 'utf8'));
    const guideRegistry = JSON.parse(fs.readFileSync(path.join(PROJECT_DIR, 'system', 'registry', 'guide-registry.json'), 'utf8'));
    const filesToCheck = [
        ...carRegistry.cars.filter(c => c.status === 'active').map(c => path.join(PROJECT_DIR, 'html', c.htmlFile)),
        ...guideRegistry.guides.filter(g => g.status === 'active').map(g => path.join(PROJECT_DIR, 'html', g.htmlFile)),
        path.join(PROJECT_DIR, 'html', 'guias', 'index.html')
    ];
    for (const fullPath of filesToCheck) {
        if (!fs.existsSync(fullPath)) continue;
        const html = fs.readFileSync(fullPath, 'utf8');
        const relPath = path.relative(PROJECT_DIR, fullPath);
        assertTrue(!html.includes('carspecio.io'), `${relPath} should not reference carspecio.io`);
        assertTrue(!html.includes('carspecio.io'), `${relPath} should not reference carspecio.io`);
    }
});

test('sitemap contains all expected URL types', () => {
    const sitemap = fs.readFileSync(path.join(PROJECT_DIR, 'sitemap.xml'), 'utf8');
    assertIncludes(sitemap, '<loc>https://carspecio.com/</loc>', 'Sitemap should include homepage');
    assertIncludes(sitemap, 'guias/index.html', 'Sitemap should include guide index');
    const urlMatches = sitemap.match(/<loc>/g) || [];
    assertTrue(urlMatches.length >= 10, `Sitemap should have at least 10 URLs, got ${urlMatches.length}`);
});
