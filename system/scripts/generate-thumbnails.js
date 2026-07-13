#!/usr/bin/env node
/**
 * Generate thumbnail versions (400px wide) of all hero images for card usage.
 * Uses sharp to create -thumb.webp variants.
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..', '..');
const IMAGES_DIR = path.join(ROOT, 'images');

const SIZES = [
    { suffix: '-thumb', width: 400 },
    { suffix: '-medium', width: 800 }
];
const QUALITY = 75;

function findHeroImages(dir, base = '') {
    const results = [];
    if (!fs.existsSync(dir)) return results;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.name === 'images-original-backup' || entry.name === 'node_modules') continue;
        const fullPath = path.join(dir, entry.name);
        const relPath = base ? `${base}/${entry.name}` : entry.name;
        if (entry.isDirectory()) {
            results.push(...findHeroImages(fullPath, relPath));
        } else {
            const name = entry.name.toLowerCase();
            if ((name.includes('hero') || name.includes('-hero')) && name.endsWith('.webp') && !name.includes('-thumb')) {
                results.push({ fullPath, relPath });
            }
        }
    }
    return results;
}

async function main() {
    console.log('🖼️  Generating thumbnail versions of hero images...\n');
    const heroes = findHeroImages(IMAGES_DIR);
    console.log(`Found ${heroes.length} hero images\n`);

    for (const img of heroes) {
        const originalSize = fs.statSync(img.fullPath).size;
        for (const size of SIZES) {
            const outPath = img.fullPath.replace(/\.webp$/i, size.suffix + '.webp');
            const relOut = img.relPath.replace(/\.webp$/i, size.suffix + '.webp');

            try {
                await sharp(img.fullPath)
                    .resize({ width: size.width, withoutEnlargement: true })
                    .webp({ quality: QUALITY })
                    .toFile(outPath);

                const outSize = fs.statSync(outPath).size;
                const savings = ((1 - outSize / originalSize) * 100).toFixed(1);
                console.log(`  ✅ ${img.relPath} → ${relOut}  (${(originalSize / 1024).toFixed(0)} KB → ${(outSize / 1024).toFixed(0)} KB, -${savings}%)`);
            } catch (err) {
                console.error(`  ❌ ${img.relPath} → ${relOut}: ${err.message}`);
            }
        }
    }

    console.log('\n✨ Thumbnail generation complete!');
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
