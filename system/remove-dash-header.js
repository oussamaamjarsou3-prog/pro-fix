const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '../css/home-dashboard.css');
let content = fs.readFileSync(cssPath, 'utf8');

const startMarker = '/* ================= HEADER ================= */';
const endMarker = '/* Let mobile-nav.css handle menu-btn styling */';

const startIdx = content.indexOf(startMarker);
const endIdx = content.indexOf(endMarker);

if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
  const before = content.slice(0, startIdx);
  const after = content.slice(endIdx + endMarker.length);
  content = before + after;
  fs.writeFileSync(cssPath, content, 'utf8');
  console.log('Removed header section from home-dashboard.css');
} else {
  console.log('Markers not found or invalid order');
}
