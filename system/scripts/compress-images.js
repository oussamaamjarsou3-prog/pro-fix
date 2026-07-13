#!/usr/bin/env node
/**
 * Compress all images in /images/ directory using sharp.
 * - Converts PNG/JPEG to WebP (quality 80, max width 1920px)
 * - Keeps originals in /images-original-backup/
 * - Updates all references in .json, .html, .js, .css files
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..', '..');
const IMAGES_DIR = path.join(ROOT, 'images');
const BACKUP_DIR = path.join(ROOT, 'images-original-backup');
const ASSETS_DIR = path.join(ROOT, 'assets');

const MAX_WIDTH = 1920;
const QUALITY = 80;

const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg'];
const SKIP_DIRS = ['images-original-backup'];

// Collect all image files
function collectImages(dir, base = '') {
    const results = [];
    if (!fs.existsSync(dir)) return results;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (SKIP_DIRS.includes(entry.name)) continue;
        const fullPath = path.join(dir, entry.name);
        const relPath = base ? `${base}/${entry.name}` : entry.name;
        if (entry.isDirectory()) {
            results.push(...collectImages(fullPath, relPath));
        } else {
            const ext = path.extname(entry.name).toLowerCase();
            if (IMAGE_EXTENSIONS.includes(ext)) {
                results.push({ fullPath, relPath, ext });
            }
        }
    }
    return results;
}

// Recursively copy directory
function copyDir(src, dest) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

// Find all files to update references in
function findFilesToUpdate(dir, extensions, base = '') {
    const results = [];
    if (!fs.existsSync(dir)) return results;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'images-original-backup') continue;
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            results.push(...findFilesToUpdate(fullPath, extensions, base));
        } else {
            const ext = path.extname(entry.name).toLowerCase();
            if (extensions.includes(ext)) {
                results.push(fullPath);
            }
        }
    }
    return results;
}

async function main() {
    console.log('🖼️  Image Compression Script (sharp → WebP)\n');

    // 1. Collect all images
    const images = collectImages(IMAGES_DIR);
    console.log(`Found ${images.length} images to process\n`);

    if (images.length === 0) {
        console.log('No images found. Exiting.');
        return;
    }

    // 2. Backup originals
    console.log('📦 Backing up originals to images-original-backup/...');
    if (!fs.existsSync(BACKUP_DIR)) {
        copyDir(IMAGES_DIR, BACKUP_DIR);
        console.log('   Backup created.\n');
    } else {
        console.log('   Backup already exists, skipping.\n');
    }

    // 3. Convert each image to WebP
    console.log('🔄 Converting to WebP...\n');
    let totalOriginalSize = 0;
    let totalWebPSize = 0;

    for (const img of images) {
        const webpPath = img.fullPath.replace(/\.png$/i, '.webp').replace(/\.jpe?g$/i, '.webp');
        const relWebp = img.relPath.replace(/\.png$/i, '.webp').replace(/\.jpe?g$/i, '.webp');

        try {
            const originalSize = fs.statSync(img.fullPath).size;
            totalOriginalSize += originalSize;

            await sharp(img.fullPath)
                .resize({ width: MAX_WIDTH, withoutEnlargement: true })
                .webp({ quality: QUALITY })
                .toFile(webpPath);

            const webpSize = fs.statSync(webpPath).size;
            totalWebPSize += webpSize;
            const savings = ((1 - webpSize / originalSize) * 100).toFixed(1);

            console.log(`   ✅ ${img.relPath} → ${relWebp}  (${(originalSize / 1024).toFixed(0)} KB → ${(webpSize / 1024).toFixed(0)} KB, -${savings}%)`);

            // Delete original
            fs.unlinkSync(img.fullPath);
        } catch (err) {
            console.error(`   ❌ ${img.relPath}: ${err.message}`);
        }
    }

    console.log(`\n📊 Total: ${(totalOriginalSize / 1024 / 1024).toFixed(1)} MB → ${(totalWebPSize / 1024 / 1024).toFixed(1)} MB (${((1 - totalWebPSize / totalOriginalSize) * 100).toFixed(1)}% reduction)\n`);

    // 4. Update references in all source files
    console.log('📝 Updating references in source files...\n');

    const filesToUpdate = [
        ...findFilesToUpdate(path.join(ROOT, 'system'), ['.json', '.js', '.html']),
        ...findFilesToUpdate(path.join(ROOT, 'js'), ['.js']),
        ...findFilesToUpdate(path.join(ROOT, 'css'), ['.css']),
        ...findFilesToUpdate(path.join(ROOT, 'html'), ['.html', '.js']),
    ];

    // Also update root HTML files
    if (fs.existsSync(path.join(ROOT, 'index.html'))) {
        filesToUpdate.push(path.join(ROOT, 'index.html'));
    }

    let updatedCount = 0;
    const updateMap = new Map();

    // Build mapping of old → new paths
    for (const img of images) {
        const oldExt = img.ext;
        const oldPath = img.relPath;
        const newPath = oldPath.replace(/\.png$/i, '.webp').replace(/\.jpe?g$/i, '.webp');
        updateMap.set(oldPath, newPath);
        // Also add without ../ prefix variants
        updateMap.set('images/' + oldPath.replace(/^.*\//, ''), 'images/' + newPath.replace(/^.*\//, ''));
    }

    for (const filePath of filesToUpdate) {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        for (const [oldRef, newRef] of updateMap) {
            // Match various patterns: ../images/..., images/..., /images/...
            const variants = [
                oldRef,
                oldRef.replace(/^\.\.\//, ''),
                'images/' + path.basename(oldRef),
            ];
            for (const variant of variants) {
                if (content.includes(variant)) {
                    const newVariant = variant.replace(/\.png$/i, '.webp').replace(/\.jpe?g$/i, '.webp');
                    content = content.split(variant).join(newVariant);
                    modified = true;
                }
            }
        }

        // Also do a general pass: replace any remaining .png/.jpeg/.jpg references to images/ folder
        // that match our converted files
        if (!modified) {
            // General replacement for images/ paths
            content = content.replace(/images\/([^\s"')]+)\.(png|jpg|jpeg)/gi, (match, name, ext) => {
                const webpMatch = match.replace(/\.(png|jpg|jpeg)$/i, '.webp');
                return webpMatch;
            });
            // Check if anything changed
            if (content !== fs.readFileSync(filePath, 'utf8')) {
                modified = true;
            }
        }

        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            updatedCount++;
            console.log(`   ✅ Updated: ${path.relative(ROOT, filePath)}`);
        }
    }

    console.log(`\n📄 Updated ${updatedCount} files.\n`);
    console.log('✨ Image compression complete!');
    console.log(`\n💡 Run "node system/build.js" to regenerate HTML pages with WebP references.`);
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
