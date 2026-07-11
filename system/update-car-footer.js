const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'templates/car-template.html');
let content = fs.readFileSync(filePath, 'utf8');

const replacement = `<div class="footer-logo" aria-label="CarSpecio">
                <picture>
                    <source srcset="../assets/logo/carspecio-mobile.png" media="(max-width: 600px)">
                    <source srcset="../assets/logo/carspecio-tablet.png" media="(max-width: 1024px)">
                    <img src="../assets/logo/carspecio-desktop.png" alt="CarSpecio" width="232" height="54">
                </picture>
            </div>`;

content = content.replace(/<div class="footer-logo">Car<span>Specio<\/span><\/div>/g, replacement);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Updated car-template footer');
