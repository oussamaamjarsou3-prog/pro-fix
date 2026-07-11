const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '../css/home-dashboard.css');
let content = fs.readFileSync(cssPath, 'utf8');

const startMarker = '/* ================= FOOTER ================= */';
const endMarker = '/* ================= RESPONSIVE ================= */';

const startIdx = content.indexOf(startMarker);
const endIdx = content.indexOf(endMarker);

if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
  const before = content.slice(0, startIdx);
  const after = content.slice(endIdx);
  content = before + after;
  fs.writeFileSync(cssPath, content, 'utf8');
  console.log('Removed footer section from home-dashboard.css');
} else {
  console.log('Markers not found or invalid order');
}
