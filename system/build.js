/**
 * CarSpecio — Build System
 * Main build script that runs all generators and validators
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting CarSpecio build process...\n');

// Minimal CSS minifier: remove comments and collapse whitespace
function minifyCss(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,])\s*/g, '$1')
    .replace(/;\}/g, '}')
    .trim();
}

function buildCssBundle(name, files) {
  const projectDir = path.join(__dirname, '..');
  const srcDir = path.join(projectDir, 'css');
  const destPath = path.join(srcDir, `${name}.min.css`);
  const bundle = files.map(file => fs.readFileSync(path.join(srcDir, file), 'utf8')).join('\n');
  const minified = minifyCss(bundle);
  fs.writeFileSync(destPath, minified, 'utf8');
  const originalSize = Buffer.byteLength(bundle, 'utf8');
  const minSize = Buffer.byteLength(minified, 'utf8');
  console.log(`📦 ${name}.min.css: ${Math.round(originalSize/1024)}KB -> ${Math.round(minSize/1024)}KB`);
  return minified;
}

// Create CSS bundles before generating pages
const cssBundles = [
  {
    name: 'car-page-bundle',
    files: ['variables.css', 'car-page.css', 'footer.css', 'responsive.css', 'home-global.css', 'mega-menu-base.css', 'mega-menu-full.css', 'lang-dropdown.css', 'mobile-nav.css', 'cookie-consent.css']
  },
  {
    name: 'guide-page-bundle',
    files: ['variables.css', 'guide-page.css', 'footer.css', 'responsive.css', 'home-global.css', 'mega-menu-base.css', 'mega-menu-full.css', 'lang-dropdown.css', 'mobile-nav.css', 'cookie-consent.css']
  },
  {
    name: 'home-bundle',
    files: ['variables.css', 'style.css', 'home-global.css', 'footer.css', 'mega-menu-base.css', 'mega-menu-full.css', 'lang-dropdown.css', 'responsive.css', 'mobile-nav.css', 'cookie-consent.css']
  },
  {
    name: 'home-critical',
    files: ['variables.css', 'style.css', 'home-global.css', 'mobile-nav.css', 'mega-menu-base.css']
  },
  {
    name: 'home-deferred',
    files: ['home-global.css', 'footer.css', 'mega-menu-full.css', 'responsive.css', 'cookie-consent.css']
  }
];

console.log('📦 Building CSS bundles...\n');
cssBundles.forEach(bundle => buildCssBundle(bundle.name, bundle.files));
console.log('');

// Sync shared nav/footer on templates before generators run
console.log('🔗 Syncing shared nav on templates...\n');
try {
  execSync(`node "${path.join(__dirname, 'update-shared-nav.js')}"`, { cwd: __dirname, stdio: 'inherit' });
  console.log('✅ Shared nav synced on templates\n');
} catch (error) {
  console.error('❌ Shared nav sync failed:', error.message);
  process.exit(1);
}

// Create output directories
const outputDirs = [
  path.join(__dirname, '../js'),
  path.join(__dirname, '../html'),
  path.join(__dirname, '../html/guias'),
  path.join(__dirname, '../html/css'),
  path.join(__dirname, '../html/js'),
  path.join(__dirname, '../html/images'),
  path.join(__dirname, '../html/system/js'),
  path.join(__dirname, '../html/system/locales')
];

outputDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
});

// Run all generators
const generators = [
  { name: 'Car Page Generator', script: 'car-page-generator.js' },
  { name: 'Guide Page Generator', script: 'guide-generator.js' },
  { name: 'Guide Index Generator', script: 'guide-index-generator.js' },
  { name: 'News Page Generator', script: 'news-generator.js' },
  { name: 'Home Page Generator', script: 'home-generator.js' },
  { name: 'Reviews Page Generator', script: null, customScript: 'generate-reviews-page.js' },
  { name: 'Mega Menu Generator', script: 'mega-menu-generator.js' },
  { name: 'Compare Data Generator', script: 'compare-data-generator.js' },
  { name: 'Search Index Generator', script: 'search-index-generator.js' },
  { name: 'Sitemap Generator', script: 'sitemap-generator.js' }
];

console.log('📦 Running generators...\n');

generators.forEach(generator => {
  try {
    console.log(`⚙️  Running ${generator.name}...`);
    const scriptPath = generator.customScript
      ? path.join(__dirname, generator.customScript)
      : path.join(__dirname, 'generators', generator.script);
    execSync(`node "${scriptPath}"`, {
      cwd: __dirname,
      stdio: 'inherit'
    });
    console.log(`✅ ${generator.name} completed\n`);
  } catch (error) {
    console.error(`❌ ${generator.name} failed:`, error.message);
    process.exit(1);
  }
});

// Sync shared nav/footer on static pages and set active states
console.log('🔗 Syncing shared nav on static pages...\n');
try {
  execSync(`node "${path.join(__dirname, 'update-static-nav.js')}"`, { cwd: __dirname, stdio: 'inherit' });
  console.log('✅ Static nav synced\n');
} catch (error) {
  console.error('❌ Static nav sync failed:', error.message);
  process.exit(1);
}

console.log('🔗 Setting active nav states...\n');
try {
  execSync(`node "${path.join(__dirname, 'set-active-nav.js')}"`, { cwd: __dirname, stdio: 'inherit' });
  console.log('✅ Active nav states set\n');
} catch (error) {
  console.error('❌ Active nav setup failed:', error.message);
  process.exit(1);
}

// Run validators
const validators = [
  { name: 'Car Data Validator', script: 'car-validator.js' },
  { name: 'Guide Data Validator', script: 'guide-validator.js' },
  { name: 'Car Registry Validator', script: 'registry-validator.js' }
];

console.log('🔍 Running validators...\n');

validators.forEach(validator => {
  try {
    console.log(`⚙️  Running ${validator.name}...`);
    execSync(`node ${path.join(__dirname, 'validators', validator.script)}`, {
      cwd: __dirname,
      stdio: 'inherit'
    });
    console.log(`✅ ${validator.name} completed\n`);
  } catch (error) {
    console.error(`❌ ${validator.name} failed:`, error.message);
    process.exit(1);
  }
});

// Copy static assets into html/ for deployment
function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

const projectDir = path.join(__dirname, '..');
copyDir(path.join(projectDir, 'css'), path.join(projectDir, 'html', 'css'));
copyDir(path.join(projectDir, 'js'), path.join(projectDir, 'html', 'js'));
copyDir(path.join(projectDir, 'images'), path.join(projectDir, 'html', 'images'));
copyDir(path.join(projectDir, 'assets'), path.join(projectDir, 'html', 'assets'));
copyDir(path.join(projectDir, 'system', 'js'), path.join(projectDir, 'html', 'system', 'js'));
copyDir(path.join(projectDir, 'system', 'data'), path.join(projectDir, 'html', 'system', 'data'));
copyDir(path.join(projectDir, 'system', 'locales'), path.join(projectDir, 'html', 'system', 'locales'));
copyDir(path.join(projectDir, 'system', 'registry'), path.join(projectDir, 'html', 'system', 'registry'));

console.log('📁 Copied static assets into html/\n');

console.log('✨ Build completed successfully!\n');
console.log('📊 Summary:');
console.log(`   - Generators: ${generators.length}`);
console.log(`   - Validators: ${validators.length}`);
console.log(`   - Output files updated`);
console.log('\n🎉 CarSpecio is ready!');
