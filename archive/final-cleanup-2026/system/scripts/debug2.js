'use strict';
const fs = require('fs');
const html = fs.readFileSync('html/index.html', 'utf8');

// Check menu btn
const mbIdx = html.indexOf('menuBtn');
console.log('menuBtn button html:', html.substring(mbIdx - 5, mbIdx + 200));
console.log('---');
// Check Guias nav
const matches = html.match(/href="guias[^"]*">[^<]{0,20}Gu/g);
console.log('guias links:', matches);
const navIdx = html.indexOf('id="siteNav"');
console.log('siteNav block:', html.substring(navIdx, navIdx + 600));
