'use strict';
const fs = require('fs');
const path = require('path');
const INDEX = path.resolve(__dirname, '../../html/index.html');
let html = fs.readFileSync(INDEX, 'utf8');

const MENU_SVG = '<svg aria-hidden="true" focusable="false" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';

// Fix menu button — replace any content between the button tags
html = html.replace(
    /(<button[^>]*id="menuBtn"[^>]*>)[^<]*(<\/button>)/,
    '$1' + MENU_SVG + '$2'
);

// Fix Guías nav link (now encoded correctly as Guías)
html = html.replace(
    /href="#explorar">Gu\u00edas<\/a>/,
    'href="guias/index.html">Gu\u00edas</a>'
);
// Also try the plain ASCII form just in case
html = html.replace(
    'href="#explorar">Guías</a>',
    'href="guias/index.html">Guías</a>'
);

fs.writeFileSync(INDEX, html, 'utf8');
console.log('fix-final.js done');

// Quick verify
const h2 = fs.readFileSync(INDEX, 'utf8');
console.log('Menu SVG:', /<button[^>]*menuBtn[^>]*>[^?]*<svg/.test(h2) ? 'OK' : 'FAIL');
console.log('Guías nav:', h2.includes('href="guias/index.html">Gu') ? 'OK' : 'FAIL');
