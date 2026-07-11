/**
 * CarSpecio — Image Optimization
 * Converts large hero images to WebP for better performance.
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const IMAGES_DIR = path.join(__dirname, '../../images');
const OUTPUT_DIR = path.join(__dirname, '../../html/images');
const REGISTRY_PATH = path.join(__dirname, '../../system/registry/car-registry.json');

async function optimize() {
    const files = fs.readdirSync(IMAGES_DIR);
    const heroFiles = files.filter(f => /\.(jpg|jpeg|png)$/i.test(f) && f.toLowerCase().includes('hero'));
    const renames = [];

    for (const file of heroFiles) {
        const inputPath = path.join(IMAGES_DIR, file);
        const outputName = file.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        const inputSize = fs.statSync(inputPath).size;

        const webpBuffer = await sharp(inputPath)
            .resize({ width: 1920, height: 1080, fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 80, effort: 4 })
            .toBuffer();

        fs.writeFileSync(path.join(IMAGES_DIR, outputName), webpBuffer);
        fs.writeFileSync(path.join(OUTPUT_DIR, outputName), webpBuffer);
        const outputSize = webpBuffer.length;
        const savings = Math.round((1 - outputSize / inputSize) * 100);
        console.log(`✅ ${file} -> ${outputName} (${Math.round(inputSize/1024)}KB -> ${Math.round(outputSize/1024)}KB, ${savings}% smaller)`);
        renames.push({ old: `/${path.posix.join('images', file).replace(/\\/g, '/')}`, new: `/${path.posix.join('images', outputName).replace(/\\/g, '/')}` });
    }

    // Update registry references from old image to webp
    if (renames.length && fs.existsSync(REGISTRY_PATH)) {
        const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
        let changed = false;
        for (const car of registry.cars) {
            if (car.images && car.images.hero) {
                const rename = renames.find(r => r.old === car.images.hero || r.old === `/${car.images.hero.replace(/^\//, '')}`);
                if (rename) {
                    car.images.hero = rename.new;
                    changed = true;
                }
            }
            if (car.images && Array.isArray(car.images.gallery)) {
                car.images.gallery = car.images.gallery.map(img => {
                    const rename = renames.find(r => r.old === img || r.old === `/${img.replace(/^\//, '')}`);
                    return rename ? rename.new : img;
                });
                changed = true;
            }
        }
        if (changed) {
            fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2), 'utf8');
            console.log('📝 Updated car registry image references to WebP');
        }
    }
}

optimize().catch(err => {
    console.error(err);
    process.exit(1);
});
