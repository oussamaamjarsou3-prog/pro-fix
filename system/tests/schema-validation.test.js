const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SYSTEM_DIR = path.join(__dirname, '..');

// 1. Guide schema validation

test('guide schema is valid JSON', () => {
    const schemaPath = path.join(SYSTEM_DIR, 'schemas', 'guide-schema.json');
    const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
    assertTrue(schema && schema.$id, 'Schema should have $id');
    assertIncludes(schema.$id, 'carspecio.com', 'Schema $id should use carspecio.com');
});

test('master car schema is valid JSON', () => {
    const schemaPath = path.join(SYSTEM_DIR, 'schemas', 'master-car-schema.json');
    const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
    assertTrue(schema && schema.$id, 'Schema should have $id');
    assertIncludes(schema.$id, 'carspecio.com', 'Schema $id should use carspecio.com');
});

test('guide validator passes for all active guides', () => {
    const validatorPath = path.join(SYSTEM_DIR, 'validators', 'guide-validator.js');
    execSync(`node "${validatorPath}"`, { cwd: SYSTEM_DIR, stdio: 'pipe' });
});

test('car data validator passes for all cars', () => {
    const validatorPath = path.join(SYSTEM_DIR, 'validators', 'car-validator.js');
    execSync(`node "${validatorPath}"`, { cwd: SYSTEM_DIR, stdio: 'pipe' });
});

test('registry validator passes with no warnings', () => {
    const validatorPath = path.join(SYSTEM_DIR, 'validators', 'registry-validator.js');
    execSync(`node "${validatorPath}"`, { cwd: SYSTEM_DIR, stdio: 'pipe' });
});

test('link validator passes with no broken references', () => {
    const validatorPath = path.join(SYSTEM_DIR, 'validators', 'link-validator.js');
    execSync(`node "${validatorPath}"`, { cwd: SYSTEM_DIR, stdio: 'pipe' });
});
