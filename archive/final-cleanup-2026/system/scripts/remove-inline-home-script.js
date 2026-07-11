const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../../html/index.html');
let html = fs.readFileSync(filePath, 'utf8');

// Match the inline script after home.js that handles newsletter and mega-menu
const regex = /(<script src="js\/home\.js"><\/script>\s*)<script>[\s\S]*?<\/script>(\s*<\/body>)/i;

if (!regex.test(html)) {
    console.log('Could not find inline script after home.js');
    process.exit(1);
}

const newHtml = html.replace(regex, '$1</body>');
fs.writeFileSync(filePath, newHtml, 'utf8');
console.log('Removed inline mega-menu script from index.html');
