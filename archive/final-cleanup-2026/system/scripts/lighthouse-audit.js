/**
 * CarSpecio — Lighthouse Audit
 * Runs Lighthouse against homepage, car page, and guide page.
 */

const lighthouse = require('lighthouse').default;
const chromeLauncher = require('chrome-launcher');
const http = require('http');
const fs = require('fs');
const path = require('path');

const HTML_DIR = path.join(__dirname, '../../html');
const PORT = 8765;

const PAGES = [
    { name: 'Homepage', path: '/' },
    { name: 'Car Page', path: '/rs7.html' },
    { name: 'Guide Page', path: '/guias/cambiar-aceite.html' }
];

const MIME = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.svg': 'image/svg+xml',
    '.jpg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon'
};

function startServer() {
    return new Promise((resolve) => {
        const server = http.createServer((req, res) => {
            let filePath = path.join(HTML_DIR, req.url === '/' ? 'index.html' : req.url);
            if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
                filePath = path.join(filePath, 'index.html');
            }
            if (!fs.existsSync(filePath)) {
                res.writeHead(404);
                res.end('Not found');
                return;
            }
            const ext = path.extname(filePath).toLowerCase();
            res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
            fs.createReadStream(filePath).pipe(res);
        });
        server.listen(PORT, () => resolve(server));
    });
}

async function run() {
    const server = await startServer();
    const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu'] });
    const results = [];

    for (const page of PAGES) {
        const url = `http://localhost:${PORT}${page.path}`;
        console.log(`\n🔍 Auditing ${page.name}: ${url}`);
        const runnerResult = await lighthouse(url, {
            port: chrome.port,
            output: 'json',
            logLevel: 'silent',
            onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo']
        });
        const detailPath = path.join(__dirname, `../../lighthouse-${page.name.toLowerCase().replace(/\s+/g, '-')}.json`);
        fs.writeFileSync(detailPath, JSON.stringify(runnerResult.lhr, null, 2), 'utf8');
        const scores = runnerResult.lhr.categories;
        results.push({
            name: page.name,
            url,
            performance: Math.round(scores.performance.score * 100),
            accessibility: Math.round(scores.accessibility.score * 100),
            bestPractices: Math.round(scores['best-practices'].score * 100),
            seo: Math.round(scores.seo.score * 100)
        });
    }

    await chrome.kill();
    server.close();

    console.log('\n📊 Lighthouse Results\n');
    console.log('Page                 | Performance | Accessibility | Best Practices | SEO');
    console.log('---------------------|-------------|---------------|----------------|-----');
    for (const r of results) {
        console.log(`${r.name.padEnd(20)} | ${String(r.performance).padEnd(11)} | ${String(r.accessibility).padEnd(13)} | ${String(r.bestPractices).padEnd(14)} | ${r.seo}`);
    }

    const outputPath = path.join(__dirname, '../../lighthouse-results.json');
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), 'utf8');
    console.log(`\n💾 Results saved to ${outputPath}`);
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});
