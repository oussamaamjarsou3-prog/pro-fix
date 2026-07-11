'use strict';
const fs = require('fs');

// Read as buffer
const buf = fs.readFileSync('html/index.html');
// Check BOM
console.log('First 4 bytes (hex):', buf.slice(0,4).toString('hex'));
// Look for "pr" followed by some bytes
for (let i = 0; i < buf.length - 10; i++) {
    if (buf[i] === 0x70 && buf[i+1] === 0x72) { // "pr"
        const ctx = buf.slice(i, i+12);
        console.log('pr... at', i, ':', ctx.toString('hex'), '|', ctx.toString('latin1'));
        break;
    }
}
// Find the "men" in "menú" 
for (let i = 0; i < buf.length - 10; i++) {
    if (buf[i] === 0x6d && buf[i+1] === 0x65 && buf[i+2] === 0x6e) { // "men"
        const ctx = buf.slice(i, i+10);
        if (buf[i+3] !== 0x74 && buf[i+3] !== 0x6f) { // not "ment" or "meno"
            console.log('men... at', i, ':', ctx.toString('hex'), '|', ctx.toString('latin1'));
            break;
        }
    }
}
// Check around España
const espStr = Buffer.from('Espa');
for (let i = 0; i < buf.length - 10; i++) {
    if (buf[i] === 0x45 && buf[i+1] === 0x73 && buf[i+2] === 0x70 && buf[i+3] === 0x61) {
        const ctx = buf.slice(i, i+10);
        console.log('Espa at', i, ':', ctx.toString('hex'), '|', ctx.toString('latin1'));
        break;
    }
}
// Check around categorí
for (let i = 0; i < buf.length - 12; i++) {
    if (buf[i] === 0x63 && buf[i+1] === 0x61 && buf[i+2] === 0x74) { // "cat"
        if (buf[i+3] === 0x65 && buf[i+4] === 0x67) { // "categ"
            const ctx = buf.slice(i, i+14);
            console.log('categ at', i, ':', ctx.toString('hex'), '|', ctx.toString('latin1'));
            break;
        }
    }
}
// How © appears
for (let i = 0; i < buf.length - 4; i++) {
    if (buf[i] === 0xC2 && buf[i+1] === 0xA9) {
        console.log('UTF-8 © (C2 A9) found at', i);
        break;
    }
    if (buf[i] === 0xA9) {
        console.log('Latin1 © (A9) found at', i);
        break;
    }
}
// How ñ appears
for (let i = 0; i < buf.length - 4; i++) {
    if (buf[i] === 0xC3 && buf[i+1] === 0xB1) {
        console.log('UTF-8 ñ (C3 B1) found at', i, 'context:', buf.slice(i-4, i+6).toString('latin1'));
        break;
    }
    if (buf[i] === 0xF1) {
        console.log('Latin1 ñ (F1) found at', i, 'context:', buf.slice(i-4, i+6).toString('latin1'));
        break;
    }
}
