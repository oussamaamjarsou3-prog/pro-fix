'use strict';
const fs = require('fs');
const buf = fs.readFileSync('html/index.html');
// Find "Guas" in buffer
const needle = Buffer.from('Guas');
for (let i = 0; i < buf.length - 20; i++) {
    if (buf[i] === 0x47 && buf[i+1] === 0x75 && buf[i+2] === 0x61 && buf[i+3] === 0x73) {
        console.log('Guas at', i, ':', buf.slice(i-10, i+15).toString('hex'));
        console.log('as latin1:', buf.slice(i-10, i+15).toString('latin1'));
        break;
    }
}
