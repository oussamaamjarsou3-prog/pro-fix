'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '../../');
const INDEX = path.join(ROOT, 'html/index.html');

let html = fs.readFileSync(INDEX, 'utf8');

// Mojibake table: UTF-8 bytes of latin1-misread characters
const MOJIBAKE = [
    ['\u00c3\u00a1', '\u00e1'],  // Ã¡ -> á
    ['\u00c3\u00a9', '\u00e9'],  // Ã© -> é
    ['\u00c3\u00ad', '\u00ed'],  // Ã­ -> í
    ['\u00c3\u00b3', '\u00f3'],  // Ã³ -> ó
    ['\u00c3\u00ba', '\u00fa'],  // Ãº -> ú
    ['\u00c3\u0081', '\u00c1'],  // Ã\x81 -> Á
    ['\u00c3\u0089', '\u00c9'],  // Ã\x89 -> É
    ['\u00c3\u008d', '\u00cd'],  // Ã\x8d -> Í
    ['\u00c3\u0093', '\u00d3'],  // Ã\x93 -> Ó
    ['\u00c3\u009a', '\u00da'],  // Ã\x9a -> Ú
    ['\u00c3\u00b1', '\u00f1'],  // Ã± -> ñ
    ['\u00c3\u0091', '\u00d1'],  // Ã\x91 -> Ñ
    ['\u00c3\u00bc', '\u00fc'],  // Ã¼ -> ü
    ['\u00c3\u009c', '\u00dc'],  // Ã\x9c -> Ü
    ['\u00c2\u00bf', '\u00bf'],  // Â¿ -> ¿
    ['\u00c2\u00a1', '\u00a1'],  // Â¡ -> ¡
    ['\u00c2\u00a9', '\u00a9'],  // Â© -> ©
    ['\u00c2\u00ae', '\u00ae'],  // Â® -> ®
    ['\u00e2\u0082\u00ac', '\u20ac'], // â‚¬ -> €
    ['\u00e2\u0080\u0094', '\u2014'], // â€" -> —
    ['\u00e2\u0080\u0093', '\u2013'], // â€" -> –
    ['\u00e2\u0080\u009c', '\u201c'], // â€œ -> "
    ['\u00e2\u0080\u009d', '\u201d'], // â€\x9d -> "
    ['\u00e2\u0080\u0098', '\u2018'], // â€˜ -> '
    ['\u00e2\u0080\u0099', '\u2019'], // â€™ -> '
    ['\u00e2\u0080\u00a2', '\u2022'], // â€¢ -> •
    ['\u00e2\u0080\u00a6', '\u2026'], // â€¦ -> …
    ['\u00c2\u00b7', '\u00b7'],  // Â· -> ·
    ['\u00c2\u00ba', '\u00ba'],  // Âº -> º
    ['\u00c2\u00aa', '\u00aa'],  // Âª -> ª
    ['\u00c2\u00ab', '\u00ab'],  // Â« -> «
    ['\u00c2\u00bb', '\u00bb'],  // Â» -> »
    ['\u00c2\u00b0', '\u00b0'],  // Â° -> °
    ['\u00c2\u00b1', '\u00b1'],  // Â± -> ±
    ['\u00c2\u00b5', '\u00b5'],  // Âµ -> µ
    ['\u00ef\u00bf\u00bd', ''],  // replacement char -> remove
];

// Apply longer sequences first to avoid partial replacements
MOJIBAKE.sort((a, b) => b[0].length - a[0].length);

for (const [bad, good] of MOJIBAKE) {
    html = html.split(bad).join(good);
}

// Restore copyright line which may have lost its symbols
html = html.replace(
    /(<p class="copyright">)\s*([^<]*2026[^<]*)<\/p>/,
    '<p class="copyright">\u00a9 <span id="footerYear">2026</span> CarSpecio \u2014 Todos los derechos reservados</p>'
);

// Add dynamic year script right after footer if missing
if (!html.includes('footerYear')) {
    html = html.replace(
        '</footer>',
        '</footer>\n    <script>var y=document.getElementById("footerYear");if(y)y.textContent=new Date().getFullYear();</script>'
    );
}

// Fix any remaining specific broken strings we know about
const SPECIFIC_FIXES = [
    // aria-labels
    [/aria-label="Abrir men[^"]{0,10}"/, 'aria-label="Abrir men\u00fa"'],
    [/aria-label="Cerrar men[^"]{0,10}"/, 'aria-label="Cerrar men\u00fa"'],
    [/aria-label="Navegaci[^"]{0,20}men[^"]{0,10}"/, 'aria-label="Navegaci\u00f3n mega men\u00fa"'],
    [/aria-label="Estad[^"]{0,20}sticas CarSpecio"/, 'aria-label="Estad\u00edsticas CarSpecio"'],
    // headings & text
    [/<h2>Explorar por categor[^<]{0,10}<\/h2>/, '<h2>Explorar por categor\u00eda</h2>'],
    [/<h4 id="catHeaderTitle">Categor[^<]{0,10}<\/h4>/, '<h4 id="catHeaderTitle">Categor\u00edas</h4>'],
    [/art[^c<]{0,4}culos/g, 'art\u00edculos'],
    [/<h3>El[^<]{0,6}ctricos<\/h3>/, '<h3>El\u00e9ctricos</h3>'],
    [/<h3>Sed[^<]{0,4}n<\/h3>/, '<h3>Sed\u00e1n</h3>'],
    [/<h3>Econ[^<]{0,6}micos<\/h3>/, '<h3>Econ\u00f3micos</h3>'],
    [/Diagn[^<"]{0,6}stico/, 'Diagn\u00f3stico'],
    [/placeholder="Marca o modelo[^"]{0,6}"/, 'placeholder="Marca o modelo\u2026"'],
    [/<option>Todas las categor[^<]{0,10}<\/option>/, '<option>Todas las categor\u00edas</option>'],
    [/<option>El[^<]{0,6}ctricos<\/option>/g, '<option>El\u00e9ctricos</option>'],
    [/<option>Sed[^<]{0,4}n<\/option>/g, '<option>Sed\u00e1n</option>'],
    [/<option>Hasta [^€<]{0,8}50\.000<\/option>/, '<option>Hasta \u20ac50.000</option>'],
    [/<option>[^<]{0,8}50\.000[^<]{0,8}100\.000<\/option>/, '<option>\u20ac50.000 \u2013 \u20ac100.000</option>'],
    [/<option>[^<]{0,8}100\.000[^<]{0,8}150\.000<\/option>/, '<option>\u20ac100.000 \u2013 \u20ac150.000</option>'],
    [/<option>M[^<]{0,6}s de [^<]{0,8}150\.000<\/option>/, '<option>M\u00e1s de \u20ac150.000</option>'],
    [/pr[^<]{0,6}ximo auto/, 'pr\u00f3ximo auto'],
    [/Desde <strong>[^€<]{0,6}145\.000<\/strong>/, 'Desde <strong>\u20ac145.000</strong>'],
    [/Desde <strong>[^€<]{0,6}132\.000<\/strong>/, 'Desde <strong>\u20ac132.000</strong>'],
    [/Desde <strong>[^€<]{0,6}158\.000<\/strong>/, 'Desde <strong>\u20ac158.000</strong>'],
    [/Desde <strong>[^€<]{0,6}245\.000<\/strong>/, 'Desde <strong>\u20ac245.000</strong>'],
    [/Din[^<]{0,6}mica excepcional/, 'Din\u00e1mica excepcional'],
    [/Motor h[^<]{0,6}brido potente/, 'Motor h\u00edbrido potente'],
    [/Peso elevado vs generaci[^<]{0,6}n anterior/, 'Peso elevado vs generaci\u00f3n anterior'],
    [/Dise[^<]{0,4}o espectacular/, 'Dise\u00f1o espectacular'],
    [/Valor de reventa s[^<]{0,6}lido/, 'Valor de reventa s\u00f3lido'],
    [/Top 10 en Espa[^<]{0,6}/, 'Top 10 en Espa\u00f1a'],
    [/Mejores el[^<]{0,6}ctricos 2026/, 'Mejores el\u00e9ctricos 2026'],
    [/Autonom[^<]{0,4}a y carga r[^<]{0,6}pida/, 'Autonom\u00eda y carga r\u00e1pida'],
    [/nueva l[^<]{0,4}nea AMG/, 'nueva l\u00ednea AMG'],
    [/BMW ampl[^<]{0,4}a gama i con m[^<]{0,4}s autonom[^<]{0,4}a WLTP/, 'BMW ampl\u00eda gama i con m\u00e1s autonom\u00eda WLTP'],
    [/evoluci[^<]{0,4}n de la familia RS/, 'evoluci\u00f3n de la familia RS'],
    [/<h2>[^<]{0,6}ltimas noticias<\/h2>/, '<h2>\u00daltimas noticias</h2>'],
    [/aria-label="Correo electr[^"]{0,10}"/, 'aria-label="Correo electr\u00f3nico"'],
    [/compradores en Espa[^<"]{0,6}\./, 'compradores en Espa\u00f1a.'],
    [/<h3>Navegaci[^<]{0,6}n<\/h3>/, '<h3>Navegaci\u00f3n</h3>'],
    [/<h3>Categor[^<]{0,6}as<\/h3>/, '<h3>Categor\u00edas</h3>'],
    [/<a href="#explorar">El[^<]{0,6}ctricos<\/a>/, '<a href="#explorar">El\u00e9ctricos</a>'],
    [/<a href="#explorar">Sed[^<]{0,4}n<\/a>/, '<a href="#explorar">Sed\u00e1n</a>'],
    [/<span>Sed[^<]{0,4}n deportivo<\/span>/, '<span>Sed\u00e1n deportivo</span>'],
    [/<span>El[^<]{0,6}ctrico<\/span>/, '<span>El\u00e9ctrico</span>'],
    [/alt="BMW el[^"]{0,6}ctrico"/, 'alt="BMW el\u00e9ctrico"'],
    [/>EL[^<]{0,6}CTRICO</, '>\u00c9LECTRICO<'],
    [/title="Espa[^"]{0,6}l"/, 'title="Espa\u00f1ol"'],
];

for (const [pattern, replacement] of SPECIFIC_FIXES) {
    if (typeof pattern === 'string') {
        html = html.split(pattern).join(replacement);
    } else {
        html = html.replace(pattern, replacement);
    }
}

// Fix mega menu category option text (Sedán, Híbridos, Eléctricos, Compactos, etc.)
html = html.replace(/data-category="sedan">Sed[^<]{0,6}n</g, 'data-category="sedan">Sed\u00e1n<');
html = html.replace(/data-category="electricos">El[^<]{0,6}ctricos</g, 'data-category="electricos">El\u00e9ctricos<');
html = html.replace(/data-category="h[^"]{0,6}bridos">[^<]{0,10}bridos</g, 'data-category="hibridos">H\u00edbridos<');
html = html.replace(/data-category="compactos">Compactos</g, 'data-category="compactos">Compactos<');
html = html.replace(/Citro[^<"]{0,6}n/g, 'Citro\u00ebn');
// Model headings with Sedán
html = html.replace(/><h4>[^<]{0,30}Sed[^<]{0,4}n<\/h4>/g, (m) => m.replace(/Sed[^<]{0,4}n/, 'Sed\u00e1n'));
// El\u00e9ctricos in model headings
html = html.replace(/><h4>[^<]{0,30}El[^<]{0,6}ctricos<\/h4>/g, (m) => m.replace(/El[^<]{0,6}ctricos/, 'El\u00e9ctricos'));

// Write output
fs.writeFileSync(INDEX, html, 'utf8');
console.log('fix-encoding.js complete');

// Verify key strings
const verify = [
    ['España', html.includes('Espa\u00f1a')],
    ['categoría', html.includes('categor\u00eda')],
    ['próximo', html.includes('pr\u00f3ximo')],
    ['Eléctricos', html.includes('El\u00e9ctricos')],
    ['Sedán', html.includes('Sed\u00e1n')],
    ['©', html.includes('\u00a9')],
    ['€145', html.includes('\u20ac145')],
    ['Últimas', html.includes('\u00daltimas')],
    ['No replacement char', !html.includes('\ufffd')],
];
verify.forEach(([k, v]) => console.log((v ? '  OK' : '  FAIL') + ' ' + k));
