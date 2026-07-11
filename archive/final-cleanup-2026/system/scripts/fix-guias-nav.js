'use strict';
const fs = require('fs');
const p = 'html/index.html';
let h = fs.readFileSync(p, 'utf8');

// Fix the nav link: "Guas" -> "Guías" + fix href
h = h.replace('href="#explorar">Guas</a>', 'href="guias/index.html">Gu\u00edas</a>');

// Also scan for any other broken "Gu.as" patterns in nav/footer
h = h.replace(/<a href="#explorar">Gu[^<]{0,4}as<\/a>/g, '<a href="guias/index.html">Gu\u00edas</a>');

fs.writeFileSync(p, h, 'utf8');
const result = h.includes('href="guias/index.html">Gu\u00edas</a>');
console.log('Gu\u00edas nav link fixed:', result ? 'OK' : 'FAIL');
