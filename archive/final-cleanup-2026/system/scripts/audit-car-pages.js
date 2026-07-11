'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../../');
const gen = fs.readFileSync(path.join(ROOT, 'system/generators/car-page-generator.js'), 'utf8');
const tmpl = fs.readFileSync(path.join(ROOT, 'system/templates/car-template.html'), 'utf8');

console.log('\n=== GENERATOR: OG/Twitter injection ===');
console.log('og:image set:', gen.includes('og:image'));
console.log('twitter:image set:', gen.includes('twitter:image'));
console.log('og:type set:', gen.includes('og:type'));
console.log('twitter:card set:', gen.includes('twitter:card'));
console.log('FAQPage schema:', gen.includes('FAQPage'));
console.log('Product schema:', gen.includes('Product'));
console.log('galleryGrid injection:', gen.includes('galleryGrid'));

console.log('\n=== TEMPLATE: section IDs ===');
['profile-score','fiscal-table','interior','gallery','car-nav','profile',
 'comparison','quiz','used-guide','faq','versions','options','timeline',
 'depreciation','cost-calculator','problems'].forEach(id => {
  console.log('  id="' + id + '":', tmpl.includes('id="' + id + '"') ? 'YES' : 'NO');
});

console.log('\n=== TEMPLATE: JSON-LD types ===');
['BreadcrumbList','FAQPage','Product','Car','Vehicle'].forEach(t => {
  console.log('  ' + t + ':', tmpl.includes(t) ? 'YES' : 'NO');
});

console.log('\n=== TEMPLATE: default country ===');
const countryMatch = tmpl.match(/applyCountry\(['"]([A-Z]+)['"]\)/);
console.log('  applyCountry default:', countryMatch ? countryMatch[1] : 'not found');

console.log('\n=== TEMPLATE: skip link ===');
console.log('  skip-link:', tmpl.includes('skip-link') ? 'YES' : 'NO');
console.log('  tabindex main:', tmpl.includes('tabindex="-1"') ? 'YES' : 'NO');

console.log('\n=== TEMPLATE: menu button icon ===');
const menuBtnMatch = tmpl.match(/menu-btn[^>]*>([^<]{0,20})</);
console.log('  menu-btn content:', menuBtnMatch ? JSON.stringify(menuBtnMatch[1]) : 'not found');

console.log('\n=== TEMPLATE: search btn icon ===');
const searchBtnMatch = tmpl.match(/mega-menu__search-btn[^>]*>([^<]{0,20})</);
console.log('  search-btn content:', searchBtnMatch ? JSON.stringify(searchBtnMatch[1]) : 'not found');

console.log('\n=== TEMPLATE: sticky nav link ===');
const stickyMatch = tmpl.match(/href="#timeline[^"]*"[^>]*>([^<]+)</);
console.log('  timeline sticky text:', stickyMatch ? stickyMatch[1] : 'not found');

// Check sticky nav for "Entretien" (French typo)
console.log('  Entretien typo:', tmpl.includes('Entretien') ? 'YES - BUG' : 'NO');

console.log('\n=== TEMPLATE: footer social links ===');
const socialLinks = tmpl.match(/href="#">(Instagram|YouTube|TikTok|Twitter)/g);
console.log('  dead social hrefs:', socialLinks ? socialLinks.join(', ') : 'none');

console.log('\n=== TEMPLATE: hreflang ===');
const hreflang = tmpl.match(/hreflang="[^"]+"/g);
console.log('  hreflang tags:', hreflang ? [...new Set(hreflang)].join(', ') : 'none');
// All hreflang point to same URL?
const hreflangs = tmpl.match(/hreflang="[^"]+" href="([^"]+)"/g);
console.log('  all same URL:', hreflangs ? 'CHECK MANUALLY' : 'no hreflang hrefs found');

// Check generated pages for specific issues
console.log('\n=== GENERATED PAGES: hero images ===');
const carPages = ['rs7','bmw-m5','mercedes-amg-gt','nissan-gtr','porsche-911','rs3'];
carPages.forEach(slug => {
  const p = path.join(ROOT, 'html', slug + '.html');
  if (!fs.existsSync(p)) { console.log('  ' + slug + ': NOT FOUND'); return; }
  const h = fs.readFileSync(p, 'utf8');
  const heroMatch = h.match(/car-hero[^>]*style="background-image: url\('([^']+)'\)"/);
  const preloadMatch = h.match(/rel="preload" as="image" href="([^"]+)"/);
  const ogImageMatch = h.match(/og:image" content="([^"]*)"/);
  const twitterImageMatch = h.match(/twitter:image" content="([^"]*)"/);
  const ogTypeMatch = h.match(/og:type" content="([^"]*)"/);
  const twitterCardMatch = h.match(/twitter:card" content="([^"]*)"/);
  console.log('\n  ' + slug + ':');
  console.log('    hero bg:', heroMatch ? heroMatch[1] : 'not found');
  console.log('    preload:', preloadMatch ? preloadMatch[1] : 'not found');
  console.log('    og:image:', ogImageMatch ? ogImageMatch[1] : 'not found');
  console.log('    og:type:', ogTypeMatch ? ogTypeMatch[1] : 'not found');
  console.log('    twitter:card:', twitterCardMatch ? twitterCardMatch[1] : 'not found');
  console.log('    related-guides section:', h.includes('guide-related') ? 'YES' : 'NO');
  console.log('    Entretien typo:', h.includes('Entretien') ? 'YES - BUG' : 'NO');
  console.log('    defaultCountry US:', h.includes("applyCountry('US')") ? 'YES - BUG (should be ES)' : 'NO');
  console.log('    tabindex main:', h.includes('tabindex="-1"') ? 'YES' : 'NO');
  console.log('    keywords empty:', h.match(/seoKeywords" content="([^"]*)"\s*id/) ? 
    (h.match(/seoKeywords" content="([^"]*)"/) || [])[1] === '' ? 'EMPTY' : 'has value' : 'not found');
});
