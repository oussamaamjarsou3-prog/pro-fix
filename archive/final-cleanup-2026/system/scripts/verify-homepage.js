'use strict';
const fs = require('fs');
const html = fs.readFileSync('html/index.html', 'utf8');

const checks = [
  ['UTF-8 no BOM', !html.startsWith('\uFEFF')],
  ['á é ó ú ñ present', html.includes('España') && html.includes('categoría') && html.includes('próximo')],
  ['No replacement char (\\uFFFD)', !html.includes('\uFFFD')],
  ['No simpleicons.org', !html.includes('simpleicons.org')],
  ['No unsplash.com', !html.includes('unsplash.com')],
  ['Uses audi-rs7-hero.webp', html.includes('audi-rs7-hero.webp')],
  ['Menu-btn has SVG', html.includes('menu-btn') && /<button[^>]*menu-btn[^>]*>[^?]*<svg/.test(html)],
  ['Stat-icons have SVG', /<div class="stat-icon"[^>]*>[^?]*<svg/.test(html)],
  ['Trophy has SVG', /<div class="trophy"[^>]*>[^?]*<svg/.test(html)],
  ['Guides section present', html.includes('id="guias"') && html.includes('guide-card-home')],
  ['cambiar-aceite linked', html.includes('guias/cambiar-aceite.html')],
  ['cambiar-frenos linked', html.includes('guias/cambiar-frenos.html')],
  ['cambiar-bateria linked', html.includes('guias/cambiar-bateria.html')],
  ['Footer Guias link', html.includes('guias/index.html')],
  ['Canonical tag', html.includes('rel="canonical"')],
  ['OG title tag', html.includes('og:title')],
  ['tabindex on main', html.includes('tabindex="-1"')],
  ['Copyright year script', html.includes('footerYear')],
  ['Social links have class', html.includes('class="social-link"')],
  ['Instagram SVG', /aria-label="Instagram"/.test(html) && /social-link/.test(html)],
  ['No placeholder.svg bg-image', !html.includes("url('images/placeholder.svg')")],
  ['RESEÑA COMPLETA fixed', html.includes('RESEÑA COMPLETA')],
  ['Comparar arrow SVG in hero', /btn-hero-compare[^<]*Comparar[^<]*<svg/.test(html)],
  ['Mega breadcrumb separator › not garbled', html.includes('›')],
  ['No lone ? icons in stat-icon', !/<div class="stat-icon"[^>]*>\s*\?+\s*<\/div>/.test(html)],
  ['Guías nav link fixed', html.includes('href="guias/index.html">Guías</a>')],
];

let pass = 0, fail = 0;
checks.forEach(([label, ok]) => {
  console.log((ok ? '  ✅' : '  ❌') + ' ' + label);
  ok ? pass++ : fail++;
});
console.log('\n' + pass + ' pass / ' + fail + ' fail');
process.exit(fail > 0 ? 1 : 0);
