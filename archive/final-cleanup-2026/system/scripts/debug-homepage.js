'use strict';
const fs = require('fs');
const html = fs.readFileSync('html/index.html', 'utf8');

console.log('España:', html.includes('Espa\u00f1a'));
console.log('categoría:', html.includes('categor\u00eda'));
console.log('próximo:', html.includes('pr\u00f3ximo'));

const btnIdx = html.indexOf('id="menuBtn"');
console.log('menuBtn ctx:', html.substring(btnIdx, btnIdx + 120));

const copyIdx = html.indexOf('copyright');
console.log('copyright ctx:', html.substring(copyIdx, copyIdx + 180));

const navIdx = html.indexOf('id="siteNav"');
console.log('siteNav snippet:', html.substring(navIdx + 20, navIdx + 350));
