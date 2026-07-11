/**
 * CarSpecio -- Guide Validator
 * Validates guide data files against guide-schema.json using JSON Schema validation.
 */

const fs = require('fs');
const path = require('path');

const REGISTRY_PATH = path.join(__dirname, '../registry/guide-registry.json');
const CAR_REGISTRY_PATH = path.join(__dirname, '../registry/car-registry.json');
const SCHEMA_PATH = path.join(__dirname, '../schemas/guide-schema.json');

const guideRegistry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
const carRegistry = JSON.parse(fs.readFileSync(CAR_REGISTRY_PATH, 'utf8'));
const schema = JSON.parse(fs.readFileSync(SCHEMA_PATH, 'utf8'));

const validCategories = new Set(guideRegistry.categories.map(c => c.id));
const validGuideIds = new Set(guideRegistry.guides.map(g => g.id));
const validCarIds = new Set(carRegistry.cars.map(c => c.id));

let errors = 0;
let warnings = 0;

function resolveRef(ref, rootSchema) {
    if (!ref.startsWith('#/')) return null;
    return ref.split('/').slice(1).reduce((obj, key) => obj?.[key], rootSchema);
}

function checkType(value, expectedType) {
    if (expectedType === 'integer') {
        return Number.isInteger(value);
    }
    if (expectedType === 'number') {
        return typeof value === 'number' && !Number.isNaN(value);
    }
    if (Array.isArray(expectedType)) {
        return expectedType.some(t => checkType(value, t));
    }
    if (expectedType === 'array') return Array.isArray(value);
    if (expectedType === 'object') return typeof value === 'object' && value !== null && !Array.isArray(value);
    return typeof value === expectedType;
}

function validateSchema(value, subSchema, rootSchema, pathStr) {
    const messages = [];
    if (subSchema && subSchema.$ref) {
        const resolved = resolveRef(subSchema.$ref, rootSchema);
        if (!resolved) {
            messages.push(`${pathStr}: cannot resolve ${subSchema.$ref}`);
            return messages;
        }
        return validateSchema(value, resolved, rootSchema, pathStr);
    }

    if (subSchema.type) {
        if (value !== undefined && value !== null && !checkType(value, subSchema.type)) {
            messages.push(`${pathStr}: expected type ${subSchema.type}, got ${typeof value}`);
            return messages;
        }
    }

    if (value === undefined || value === null) {
        return messages;
    }

    if (typeof value === 'string') {
        if (subSchema.minLength !== undefined && value.length < subSchema.minLength) {
            messages.push(`${pathStr}: length must be >= ${subSchema.minLength}`);
        }
        if (subSchema.maxLength !== undefined && value.length > subSchema.maxLength) {
            messages.push(`${pathStr}: length must be <= ${subSchema.maxLength}`);
        }
        if (subSchema.pattern && !(new RegExp(subSchema.pattern)).test(value)) {
            messages.push(`${pathStr}: must match pattern ${subSchema.pattern}`);
        }
        if (subSchema.format === 'date' && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            messages.push(`${pathStr}: must be a valid date (YYYY-MM-DD)`);
        }
    }

    if (typeof value === 'number') {
        if (subSchema.minimum !== undefined && value < subSchema.minimum) {
            messages.push(`${pathStr}: must be >= ${subSchema.minimum}`);
        }
        if (subSchema.maximum !== undefined && value > subSchema.maximum) {
            messages.push(`${pathStr}: must be <= ${subSchema.maximum}`);
        }
    }

    if (subSchema.enum && !subSchema.enum.includes(value)) {
        messages.push(`${pathStr}: must be one of ${subSchema.enum.join(', ')}`);
    }

    if (Array.isArray(value)) {
        if (subSchema.minItems !== undefined && value.length < subSchema.minItems) {
            messages.push(`${pathStr}: array must have >= ${subSchema.minItems} items`);
        }
        if (subSchema.items) {
            value.forEach((item, idx) => {
                messages.push(...validateSchema(item, subSchema.items, rootSchema, `${pathStr}[${idx}]`));
            });
        }
    }

    if (typeof value === 'object' && !Array.isArray(value)) {
        if (subSchema.required) {
            for (const field of subSchema.required) {
                if (value[field] === undefined || value[field] === null) {
                    messages.push(`${pathStr}: missing required property "${field}"`);
                }
            }
        }
        if (subSchema.properties) {
            for (const [prop, propSchema] of Object.entries(subSchema.properties)) {
                if (value[prop] !== undefined) {
                    messages.push(...validateSchema(value[prop], propSchema, rootSchema, `${pathStr}.${prop}`));
                }
            }
        }
        if (subSchema.additionalProperties === false) {
            const knownKeys = new Set([
                ...(subSchema.required || []),
                ...Object.keys(subSchema.properties || {})
            ]);
            for (const key of Object.keys(value)) {
                if (!knownKeys.has(key)) {
                    messages.push(`${pathStr}: unexpected property "${key}"`);
                }
            }
        }
    }

    return messages;
}

function validateGuide(guide) {
    const dataFile = guide.dataFile || `system/data/guides/${guide.id}.json`;
    const dataPath = path.join(__dirname, '../..', dataFile);

    if (!fs.existsSync(dataPath)) {
        console.error(`❌ ${guide.id}: Data file not found: ${dataPath}`);
        errors++;
        return;
    }

    let data;
    try {
        data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    } catch (e) {
        console.error(`❌ ${guide.id}: Invalid JSON - ${e.message}`);
        errors++;
        return;
    }

    // JSON Schema validation against guide-schema.json
    const schemaErrors = validateSchema(data, schema, schema, 'root');
    if (schemaErrors.length) {
        errors += schemaErrors.length;
        schemaErrors.forEach(msg => console.error(`❌ ${guide.id}: ${msg}`));
    }

    // Schema version check
    if (!data.schemaVersion) {
        console.warn(`⚠️  ${guide.id}: missing schemaVersion`);
        warnings++;
    }

    // Cross-reference checks
    if (data.category && !validCategories.has(data.category)) {
        console.error(`❌ ${guide.id}: Invalid category "${data.category}". Not found in guide-registry.json`);
        errors++;
    }

    if (data.relatedGuides && Array.isArray(data.relatedGuides)) {
        for (const relatedId of data.relatedGuides) {
            if (!validGuideIds.has(relatedId)) {
                console.error(`❌ ${guide.id}: relatedGuides contains invalid ID "${relatedId}"`);
                errors++;
            }
        }
    }

    if (data.relatedCars && Array.isArray(data.relatedCars)) {
        for (const carId of data.relatedCars) {
            if (!validCarIds.has(carId)) {
                console.error(`❌ ${guide.id}: relatedCars contains invalid ID "${carId}"`);
                errors++;
            }
        }
    }

    if (data.id !== undefined && data.id !== guide.id) {
        console.warn(`⚠️  ${guide.id}: guide.id "${data.id}" does not match registry id "${guide.id}"`);
        warnings++;
    }
    if (data.slug !== undefined && data.slug !== guide.slug) {
        console.warn(`⚠️  ${guide.id}: guide.slug "${data.slug}" does not match registry slug "${guide.slug}"`);
        warnings++;
    }

    if (schemaErrors.length === 0 && errors === 0 && warnings === 0) {
        console.log(`✅ ${guide.id}: Valid`);
    }
}

console.log('🔍 Validating guides against schema...\n');

// Only active guides must be fully valid; still warn for draft/archived data issues
const guidesToValidate = guideRegistry.guides.filter(g => g.status === 'active');
if (guidesToValidate.length === 0) {
    console.warn('⚠️  No active guides found in registry');
}

guidesToValidate.forEach(guide => validateGuide(guide));

console.log(`\n📊 Validation complete:`);
console.log(`   Active guides validated: ${guidesToValidate.length}`);
console.log(`   Errors: ${errors}`);
console.log(`   Warnings: ${warnings}`);

if (errors > 0) {
    process.exit(1);
}
