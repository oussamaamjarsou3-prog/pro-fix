// Paste this in Console (F12)
console.clear();
console.log('🔍 === DIAGNOSTIC RS7 ===\n');

// 1. PLACEHOLDERS
console.log('❌ PLACEHOLDERS MAZAL:');
let foundPH = false;
document.querySelectorAll('*').forEach(el => {
    const text = el.textContent;
    if (text.includes('{{') && text.includes('}}')) {
        console.log('  ', el.tagName, el.getAttribute('data-i18n') || '(no key)', '→', text.substring(0, 50).trim());
        foundPH = true;
    }
});
if (!foundPH) console.log('  ✅ Aucun placeholder visible');

// 2. KEYS 9ASSERA
console.log('\n❌ KEYS 9ASSERA:');
let count = 0;
document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const text = el.textContent.trim();
    if (text === key || (text.includes('.') && text.length < 25 && !text.includes(' '))) {
        console.log('  ', key);
        count++;
    }
});
console.log('  Total:', count);

// 3. HARDCODED TITLES
console.log('\n⚠️ HARDCODED (sans data-i18n):');
document.querySelectorAll('h1:not([data-i18n]), h2:not([data-i18n])').forEach(el => {
    const text = el.textContent.trim();
    if (text.length > 3 && text.length < 80 && !text.match(/^[€$0-9]/)) {
        console.log('  ', el.tagName, '→', text.substring(0, 60));
    }
});

console.log('\n✅ === FIN ===');
