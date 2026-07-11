'use strict';
const fs = require('fs');
const files = ['rs7-2026','audi-rs3-2026','bmw-m5-2026','mercedes-amg-gt-2026','nissan-gtr-2026','porsche-911-2026'];
files.forEach(f => {
  const d = fs.readFileSync('system/data/' + f + '.json', 'utf8');
  const m = (d.match(/\uFFFD|\u00C3\u00A9|\u00C3\u00B3|\u00C3\u00AD|\u00C3\u00B1|\u00C3\u00A1|\u00C3\u00BA/g) || []).length;
  console.log(f.padEnd(22), 'mojibake in source JSON:', m);
});

const tmpl = fs.readFileSync('system/templates/car-template.html', 'utf8');
const rgIdx = tmpl.indexOf('guide-related');
console.log('\ntemplate guide-related index:', rgIdx);
if (rgIdx > -1) console.log(tmpl.substring(rgIdx-50, rgIdx+200));

const gen = fs.readFileSync('system/generators/car-page-generator.js', 'utf8');
const fnIdx = gen.indexOf('generateRelatedGuides');
if (fnIdx > -1) console.log('\ngenerator fn:', gen.substring(fnIdx, fnIdx+700));
