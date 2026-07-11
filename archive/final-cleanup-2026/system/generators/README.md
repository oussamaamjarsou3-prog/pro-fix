# Country Data Generators

## ⚠️ IMPORTANT: Use Node.js version (recommended)

The **Node.js version** (`country-data-generator.js`) is the **primary and recommended** generator because Node.js handles UTF-8 natively without encoding issues.

## Quick Start

```bash
# Recommended: Use Node.js version
node system/generators/country-data-generator.js

# Alternative: PowerShell version (has encoding issues on Windows)
powershell -ExecutionPolicy Bypass -File system/generators/country-data-generator.ps1
```

## Why Node.js version is better?

| Feature | Node.js (`.js`) | PowerShell (`.ps1`) |
|---------|----------------|---------------------|
| UTF-8 native support | ✅ Yes | ❌ No (needs BOM hack) |
| Cross-platform | ✅ Yes | ❌ Windows only |
| Special characters (é, ñ, ô, etc.) | ✅ Works | ⚠️ May corrupt |
| Performance | ✅ Fast | ✅ Fast |

## What was fixed?

1. **ES header**: `"Zulassung"` → `"ITV"`
2. **DE header**: `"Precio final"` → `"Endpreis"`, `"Kfz-Steuer/año"` → `"Kfz-Steuer/Jahr"`
3. **UTF-8 BOM**: Both versions now write with BOM to prevent character corruption

## If you see corrupted characters in car data files

Run this to fix all car data files:

```bash
node system/generators/country-data-generator.js
```

This will regenerate all `countryPricing` sections with correct UTF-8 encoding.
