const fs = require('fs');
const path = require('path');

const PROJECT_DIR = path.join(__dirname, '..', '..');
const HTML_DIR = path.join(PROJECT_DIR, 'html');

test('no target="_blank" without rel="noopener noreferrer" in active pages', () => {
    const files = fs.readdirSync(HTML_DIR, { recursive: true })
        .filter(f => typeof f === 'string' && f.endsWith('.html'));
    for (const file of files) {
        const fullPath = path.join(HTML_DIR, file);
        if (!fs.statSync(fullPath).isFile()) continue;
        const html = fs.readFileSync(fullPath, 'utf8');
        const matches = html.match(/target=["']_blank["'][^>]*>/gi) || [];
        for (const match of matches) {
            const hasRel = /rel=["'][^"']*noopener[^"']*noreferrer[^"']*["']/i.test(match) ||
                           /rel=["'][^"']*noreferrer[^"']*noopener[^"']*["']/i.test(match);
            assertTrue(hasRel, `${file} has target="_blank" without rel="noopener noreferrer": ${match}`);
        }
    }
});

test('no old domain references in active pages', () => {
    const files = fs.readdirSync(HTML_DIR, { recursive: true })
        .filter(f => typeof f === 'string' && f.endsWith('.html'));
    for (const file of files) {
        const fullPath = path.join(HTML_DIR, file);
        if (!fs.statSync(fullPath).isFile()) continue;
        const html = fs.readFileSync(fullPath, 'utf8');
        assertTrue(!html.includes('carspecio.io'), `${file} should not reference carspecio.io`);
        assertTrue(!html.includes('carspecio.io'), `${file} should not reference carspecio.io`);
    }
});

test('no unescaped template literals in static HTML attributes', () => {
    const files = fs.readdirSync(HTML_DIR, { recursive: true })
        .filter(f => typeof f === 'string' && f.endsWith('.html'));
    for (const file of files) {
        const fullPath = path.join(HTML_DIR, file);
        if (!fs.statSync(fullPath).isFile()) continue;
        const html = fs.readFileSync(fullPath, 'utf8');
        // Outside of script tags, ${...} should not appear in attribute values
        const bodyWithoutScripts = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        const matches = bodyWithoutScripts.match(/\$\{[^}]+\}/g);
        assertTrue(!matches || matches.length === 0, `${file} has unescaped template literal ${matches ? matches[0] : ''}`);
    }
});

test('security headers configured in netlify.toml', () => {
    const tomlPath = path.join(PROJECT_DIR, 'netlify.toml');
    const toml = fs.readFileSync(tomlPath, 'utf8');
    assertIncludes(toml, 'X-Frame-Options', 'netlify.toml should include X-Frame-Options');
    assertIncludes(toml, 'X-Content-Type-Options', 'netlify.toml should include X-Content-Type-Options');
    assertIncludes(toml, 'Referrer-Policy', 'netlify.toml should include Referrer-Policy');
});
