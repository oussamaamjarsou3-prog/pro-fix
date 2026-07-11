'use strict';
const fs = require('fs');
const html = fs.readFileSync('html/index.html', 'utf8');
// Find all "guias" occurrences
const re = /[^\n]{0,40}[Gg]u[^\n]{0,10}as[^\n]{0,40}/g;
let m;
while ((m = re.exec(html)) !== null) {
    console.log('match:', JSON.stringify(m[0]));
    if (re.lastIndex > 10000) break; // limit search to head
}
