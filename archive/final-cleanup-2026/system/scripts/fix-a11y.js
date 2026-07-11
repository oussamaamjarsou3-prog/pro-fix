/**
 * Temporary a11y helper: adds skip links and main-content IDs to hand-written pages.
 */

const fs = require('fs');
const path = require('path');

const PAGES = ['index.html', 'contacto.html', 'diagnostico.html', 'herramientas.html', 'reviews.html'];
const HTML_DIR = path.join(__dirname, '../../html');

for (const name of PAGES) {
    const filePath = path.join(HTML_DIR, name);
    if (!fs.existsSync(filePath)) {
        console.log(`Skip: ${name} not found`);
        continue;
    }
    let html = fs.readFileSync(filePath, 'utf8');

    // Add skip link after <body> if missing
    if (!html.includes('href="#main-content"')) {
        html = html.replace(/<body([^>]*)>/i, (match, attrs) => {
            return `${match}\n<a href="#main-content" class="skip-link">Saltar al contenido principal</a>`;
        });
    }

    // Add id="main-content" to first <main> or first top-level <section> if missing
    if (!html.includes('id="main-content"')) {
        if (html.includes('<main')) {
            html = html.replace(/<main\b/i, '<main id="main-content"');
        } else {
            // Find first <section ...> after <body>
            const bodyIndex = html.toLowerCase().indexOf('<body');
            if (bodyIndex > -1) {
                const sectionMatch = html.slice(bodyIndex).match(/<section\b/i);
                if (sectionMatch) {
                    const idx = bodyIndex + sectionMatch.index;
                    html = html.slice(0, idx) + '<section id="main-content"' + html.slice(idx + 8);
                }
            }
        }
    }

    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`✅ ${name}`);
}
