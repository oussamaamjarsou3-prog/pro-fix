/**
 * CarSpecio — Link & Asset Validator
 * Walks generated HTML files and checks that all referenced assets exist.
 * Checks: internal links, images, scripts, stylesheets, sitemap URLs.
 */

const fs = require('fs');
const path = require('path');

const PROJECT_DIR = path.join(__dirname, '../..');
const HTML_DIR = path.join(PROJECT_DIR, 'html');
const SITEMAP_PATH = path.join(HTML_DIR, 'sitemap.xml');

const broken = [];
const checked = new Set();

function resolveUrl(baseDir, url) {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) return null;
    if (url.startsWith('#') || url.startsWith('mailto:') || url.startsWith('tel:')) return null;
    if (url.startsWith('/')) return path.join(PROJECT_DIR, 'html', url);
    // Relative URLs resolve from the current page's URL directory (relative to html root)
    const relativeBase = path.relative(HTML_DIR, baseDir).replace(/\\/g, '/');
    const baseUrlDir = path.posix.normalize('/' + relativeBase + '/');
    const resolvedUrl = path.posix.normalize(baseUrlDir + url);
    return path.join(PROJECT_DIR, 'html', resolvedUrl);
}

function checkFile(baseDir, url, type, sourceFile) {
    const cleanUrl = url.split('#')[0].split('?')[0];
    const resolved = resolveUrl(baseDir, cleanUrl);
    if (!resolved) return;
    const key = `${resolved}|${url}`;
    if (checked.has(key)) return;
    checked.add(key);
    if (!fs.existsSync(resolved)) {
        broken.push({ source: sourceFile, type, url, resolved });
    }
}

function checkHtmlFile(filePath) {
    let html = fs.readFileSync(filePath, 'utf8');
    const baseDir = path.dirname(filePath);

    // Capture script src attributes before stripping tags
    const scriptSrcRegex = /<script[^>]*\ssrc=["']([^"']+)["'][^>]*>/gi;
    let match;
    while ((match = scriptSrcRegex.exec(html)) !== null) {
        const url = match[1];
        if (url.startsWith('http') || url.startsWith('#') || url.startsWith('mailto:') || url.startsWith('tel:')) continue;
        checkFile(baseDir, url, 'src', filePath);
    }

    // Strip script and style tag contents to avoid false positives from JS/CSS literals
    html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    html = html.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

    // Links
    const linkRegex = /href=["']([^"']+)["']/g;
    while ((match = linkRegex.exec(html)) !== null) {
        const url = match[1];
        if (url.startsWith('http') || url.startsWith('#') || url.startsWith('mailto:') || url.startsWith('tel:')) continue;
        checkFile(baseDir, url, 'link', filePath);
    }

    // Images / scripts / sources
    const srcRegex = /src=["']([^"']+)["']/g;
    while ((match = srcRegex.exec(html)) !== null) {
        const url = match[1];
        checkFile(baseDir, url, 'src', filePath);
    }

    // Background images
    const bgRegex = /url\(["']?([^"')]+)["']?\)/g;
    while ((match = bgRegex.exec(html)) !== null) {
        const url = match[1];
        if (url.startsWith('http') || url.startsWith('data:')) continue;
        checkFile(baseDir, url, 'background', filePath);
    }
}

function walkHtml(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            walkHtml(fullPath);
        } else if (entry.name.endsWith('.html')) {
            checkHtmlFile(fullPath);
        }
    }
}

function checkSitemap() {
    if (!fs.existsSync(SITEMAP_PATH)) {
        broken.push({ source: SITEMAP_PATH, type: 'sitemap', url: 'sitemap.xml', resolved: SITEMAP_PATH });
        return;
    }
    const sitemap = fs.readFileSync(SITEMAP_PATH, 'utf8');
    const locRegex = /<loc>([^<]+)<\/loc>/g;
    let match;
    while ((match = locRegex.exec(sitemap)) !== null) {
        const url = match[1];
        const urlPath = new URL(url).pathname;
        const resolved = path.join(PROJECT_DIR, 'html', urlPath);
        if (!fs.existsSync(resolved)) {
            broken.push({ source: SITEMAP_PATH, type: 'sitemap', url, resolved });
        }
    }
}

console.log('🔍 Validating links and assets...\n');

walkHtml(HTML_DIR);
checkSitemap();

if (broken.length === 0) {
    console.log('✅ All links and assets are valid');
    process.exit(0);
} else {
    console.log(`❌ Found ${broken.length} broken references:\n`);
    broken.forEach(item => {
        console.log(`  [${item.type}] ${item.url}`);
        console.log(`    Source: ${path.relative(PROJECT_DIR, item.source)}`);
        console.log(`    Expected: ${path.relative(PROJECT_DIR, item.resolved)}`);
    });
    process.exit(1);
}
