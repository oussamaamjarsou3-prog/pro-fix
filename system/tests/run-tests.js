/**
 * CarSpecio Test Runner
 * Runs all *.test.js files in this directory.
 * Output format matches requested: PASS / All tests passed
 */

const fs = require('fs');
const path = require('path');

const TEST_DIR = __dirname;

let passed = 0;
let failed = 0;
const failures = [];

function test(name, fn) {
    try {
        fn();
        passed++;
        console.log(`  ✅ ${name}`);
    } catch (err) {
        failed++;
        failures.push({ name, error: err.message });
        console.log(`  ❌ ${name}`);
        console.log(`     ${err.message}`);
    }
}

function assertEqual(actual, expected, message) {
    if (actual !== expected) {
        throw new Error(`${message || 'Assertion failed'}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
    }
}

function assertTrue(value, message) {
    if (!value) {
        throw new Error(message || 'Expected true');
    }
}

function assertIncludes(haystack, needle, message) {
    if (!haystack.includes(needle)) {
        throw new Error(`${message || 'Expected inclusion'}: ${JSON.stringify(needle)} not found in ${JSON.stringify(haystack)}`);
    }
}

const globals = { test, assertEqual, assertTrue, assertIncludes };

const testFiles = fs.readdirSync(TEST_DIR)
    .filter(f => f.endsWith('.test.js'))
    .sort();

if (testFiles.length === 0) {
    console.log('No test files found');
    process.exit(0);
}

console.log('Running tests...\n');

for (const file of testFiles) {
    console.log(`\n📄 ${file}`);
    const filePath = path.join(TEST_DIR, file);
    const testCode = fs.readFileSync(filePath, 'utf8');

    // Create a sandboxed function with test helpers
    const sandbox = new Function('require', 'module', 'exports', 'console', '__dirname', ...Object.keys(globals), testCode);
    const moduleExports = {};
    sandbox(
        require,
        { exports: moduleExports },
        moduleExports,
        console,
        TEST_DIR,
        ...Object.values(globals)
    );
}

console.log(`\n${'-'.repeat(40)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);

if (failed === 0) {
    console.log('PASS');
    console.log('All tests passed');
    process.exit(0);
} else {
    console.log('FAIL');
    process.exit(1);
}
