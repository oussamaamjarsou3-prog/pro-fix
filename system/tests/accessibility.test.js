const fs = require('fs');
const path = require('path');

const PROJECT_DIR = path.join(__dirname, '..', '..');
const HTML_DIR = path.join(PROJECT_DIR, 'html');

function getHtmlFiles(dir) {
    const files = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...getHtmlFiles(fullPath));
        } else if (entry.name.endsWith('.html')) {
            files.push(fullPath);
        }
    }
    return files;
}

test('all pages have skip-to-content link pointing to main-content', () => {
    const files = getHtmlFiles(HTML_DIR);
    assertTrue(files.length > 0, 'Should have HTML files');
    for (const file of files) {
        const html = fs.readFileSync(file, 'utf8');
        const hasSkipLink = html.includes('href="#main-content"');
        assertTrue(hasSkipLink, `${path.relative(PROJECT_DIR, file)} should have skip link to #main-content`);
        const hasMainContent = html.includes('id="main-content"');
        assertTrue(hasMainContent, `${path.relative(PROJECT_DIR, file)} should have id="main-content"`);
    }
});

test('all images have alt attributes', () => {
    const files = getHtmlFiles(HTML_DIR);
    for (const file of files) {
        const html = fs.readFileSync(file, 'utf8');
        const imgRegex = /<img[^>]*>/gi;
        let match;
        while ((match = imgRegex.exec(html)) !== null) {
            const tag = match[0];
            const hasAlt = /alt=/i.test(tag);
            assertTrue(hasAlt, `${path.relative(PROJECT_DIR, file)}: image missing alt: ${tag}`);
        }
    }
});

test('all interactive elements have accessible labels or text', () => {
    const files = getHtmlFiles(HTML_DIR);
    for (const file of files) {
        const html = fs.readFileSync(file, 'utf8');
        // Buttons without aria-label or text content
        const buttonRegex = /<button\b[^>]*>/gi;
        let match;
        while ((match = buttonRegex.exec(html)) !== null) {
            const tag = match[0];
            const hasLabel = /aria-label=/i.test(tag);
            // Check if the opening tag is followed by any non-whitespace content before </button>
            const snippet = html.substring(match.index, match.index + 300);
            const closeIndex = snippet.toLowerCase().indexOf('</button>');
            const content = closeIndex > 0 ? snippet.substring(0, closeIndex) : snippet;
            const hasTextContent = /[\p{L}\p{N}]/u.test(content.replace(/<[^>]+>/g, '').replace(/&\w+;/g, 'x'));
            assertTrue(hasLabel || hasTextContent, `${path.relative(PROJECT_DIR, file)}: button may be unlabeled: ${tag}`);
        }
    }
});

test('all pages have lang attribute', () => {
    const files = getHtmlFiles(HTML_DIR);
    for (const file of files) {
        const html = fs.readFileSync(file, 'utf8');
        const hasLang = /<html[^>]*lang=/i.test(html);
        assertTrue(hasLang, `${path.relative(PROJECT_DIR, file)} should have lang attribute`);
    }
});

test('no empty links with only emojis or icons without aria-label', () => {
    const files = getHtmlFiles(HTML_DIR);
    for (const file of files) {
        const html = fs.readFileSync(file, 'utf8');
        const linkRegex = /<a\b[^>]*>[^<]*<\/a>/gi;
        let match;
        while ((match = linkRegex.exec(html)) !== null) {
            const tag = match[0];
            const text = tag.replace(/<[^>]+>/g, '').trim();
            if (text.length === 0 && !/aria-label=/i.test(tag)) {
                assertTrue(false, `${path.relative(PROJECT_DIR, file)}: empty link without aria-label: ${tag}`);
            }
        }
    }
});
