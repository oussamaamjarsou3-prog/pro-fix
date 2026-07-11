# Folder Review Report

**Date:** 2026-06-26  
**Goal:** Final review of all remaining folders and identify which are not useful for the current working system.

---

## Root-level Folders

| Folder | Status | Reason |
|--------|--------|--------|
| `.archived-backup/` | **Deleted** | Old archive containing `rs7.html` and `temp_index.html` from earlier stages. Not referenced by the current build or site. |
| `.cursor/` | **Deleted** | Empty Cursor IDE workspace directory. |
| `.git/` | **Depends** | Git repository. Contains worktrees and refs. Keep only if you use version control. |
| `.uploads/` | **Deleted** | Empty upload directory. Not used by the site. |
| `archive/` | **Archive** | Contains the files moved during the final cleanup (`archive/final-cleanup-2026/`). Not part of the live system, but useful for recovery. |
| `css/` | **Core** | Source stylesheets used by `system/build.js` to generate CSS bundles. |
| `html/` | **Core** | Generated static site (car pages, guides, homepage, static pages). |
| `images/` | **Core** | Source images used by the site and copied to `html/images/` during build. |
| `js/` | **Core** | Frontend JavaScript files and generated data files (`compare-data.js`, `mega-menu-data.js`, `search-index.js`, `country-data.js`). |
| `node_modules/` | **Required** | npm dependencies (`jsdom`, `lighthouse`, `sharp`). Required for `npm run build`, `npm test`, and `npm run validate`. Not part of the source code, but needed for the toolchain. |
| `system/` | **Core** | The entire build/validation/runtime system: data, locales, templates, generators, validators, schemas, tests, registry, runtime JS. |

---

## System Subfolders

All subfolders inside `system/` are core and required:

| Folder | Status | Reason |
|--------|--------|--------|
| `system/data/` | **Core** | Car and guide data files (single source of truth). |
| `system/generators/` | **Core** | Live generators invoked by `system/build.js`. |
| `system/js/` | **Core** | Runtime JS copied to `html/system/js/` (country-manager, dropdowns). |
| `system/locales/` | **Core** | Interface translations (es, en, fr, ar). |
| `system/registry/` | **Core** | Brand, car, category, country, guide registries. |
| `system/schemas/` | **Core** | JSON schemas used by validators. |
| `system/templates/` | **Core** | HTML templates for car pages, guides, and guide index. |
| `system/tests/` | **Core** | Test suite run by `npm test`. |
| `system/validators/` | **Core** | Validators run by `npm run validate`. |

---

## HTML Subfolders

All subfolders inside `html/` are generated output and are required for deployment:

| Folder | Status | Reason |
|--------|--------|--------|
| `html/css/` | **Core** | Generated CSS bundles and source copies. |
| `html/guias/` | **Core** | Generated guide pages. |
| `html/images/` | **Core** | Copied images for deployment. |
| `html/js/` | **Core** | Copied and generated JS for deployment. |
| `html/system/` | **Core** | Copied `system/js`, `system/locales`, and `system/registry` for runtime. |

---

## Recommended Action

### Folders that were removed
- `.archived-backup/`
- `.cursor/`
- `.uploads/`

These folders were not referenced by `build`, `validate`, `tests`, or the deployed site. Removed after user confirmation.

### Folders that should be kept as archives
- `archive/` — Keep if you may need to recover any of the files removed during the final cleanup. If you are sure you no longer need them, this can also be deleted later.

### Folders that are not "source code" but are required
- `node_modules/` — Needed for npm commands. Do not delete unless you will reinstall dependencies with `npm install`.

### Folder that depends on your workflow
- `.git/` — Keep if you use Git. Delete only if you do not use version control at all.

---

## Verification

After any further folder removal, re-run:

```bash
npm run build
npm run validate
npm test
```

to confirm the system still works correctly.
