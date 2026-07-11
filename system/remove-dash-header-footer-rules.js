const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '../css/home-dashboard.css');
let content = fs.readFileSync(cssPath, 'utf8');

const selectors = [
  '.dash-home .header-tools',
  '.dash-home .tool-btn-lang',
  '.dash-home .header-search',
  '.dash-home .site-header',
  '.dash-home .footer-grid'
];

for (const selector of selectors) {
  let idx = content.indexOf(selector);
  while (idx !== -1) {
    // Find the start of the rule block (including any preceding comma-separated selectors)
    let blockStart = idx;
    // Walk back to find the start of the line (or media query indent)
    while (blockStart > 0 && content[blockStart - 1] !== '\n') {
      blockStart--;
    }
    // Find the opening brace
    let braceIdx = content.indexOf('{', idx);
    if (braceIdx === -1) break;
    // Find the matching closing brace (CSS has no nested braces)
    let closeIdx = content.indexOf('}', braceIdx);
    if (closeIdx === -1) break;
    // Remove the whole block including the trailing newline
    let removeEnd = closeIdx + 1;
    if (content[removeEnd] === '\n') removeEnd++;
    content = content.slice(0, blockStart) + content.slice(removeEnd);
    idx = content.indexOf(selector);
  }
}

fs.writeFileSync(cssPath, content, 'utf8');
console.log('Removed remaining dash-home header/footer rules');
