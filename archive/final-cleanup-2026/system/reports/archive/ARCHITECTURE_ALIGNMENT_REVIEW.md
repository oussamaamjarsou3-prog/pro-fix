# Architecture Alignment Review — CarSpecio Multilingual Content

**Date:** 2026-06-23 | **Scope:** Evaluate long-term architecture before scaling beyond 6 cars  
**Status:** Report Only — No Migration

---

## 1. Executive Summary

Phase 4A.1 made 8 narrative sections multilingual by embedding `{es,en,fr,ar}` inside each car JSON. It works technically, but `rs7-2026.json` is now **158 KB** (5x larger than cars without narrative content), and **~75% of that payload is editorial text never used on a single-language page view**.

This review compares the current monolithic approach against the original Carspecio principle: separate language-independent facts from language-dependent editorial content.

---

## 2. Current Architecture (Option 1 — Embedded)

### 2.1 Directory Structure

```
system/
  data/
    rs7-2026.json          ← 158 KB (facts + 4 languages embedded)
    bmw-m5-2026.json       ← 31 KB (facts only)
    ...
  locales/
    es.json, en.json, fr.json, ar.json   ← UI translations only
  registry/
    car-registry.json
```

### 2.2 Data Flow

**Build:** `car-page-generator.js` reads `system/data/{car}.json` (monolith) → injects into template → writes `html/{slug}.html`.

**Runtime:** Browser fetches `system/data/{car}.json` (158 KB) → `CarRenderer` parses entire JSON → `_getLocalized()` extracts one language → renders. On language switch, same JSON is re-parsed; 3 unused languages are ignored.

### 2.3 Size Metrics

| Metric | Value |
|--------|-------|
| RS7 total | 158.3 KB |
| Non-narrative cars avg | 30.5 KB |
| Narrative content in RS7 | ~118 KB (75%) |
| Base facts in RS7 | ~40 KB (25%) |
| Per-language narrative | ~30 KB |
| Words per language | ~1,300–1,500 |

### 2.4 Scalability Projection

| Fleet | Total Data | Per-Page Transfer | Wasted |
|-------|-----------|-------------------|--------|
| 6 cars | 0.9 MB | 158 KB | 118 KB (75%) |
| 100 cars | 15.4 MB | 158 KB | 118 KB (75%) |
| 500 cars | 77.2 MB | 158 KB | 118 KB (75%) |
| 1,000 cars | 154.5 MB | 158 KB | 118 KB (75%) |

**Every page fetches 4x the editorial content actually displayed.**

---

## 3. Proposed Architecture (Option 2 — Separated)

### 3.1 Directory Structure

```
system/
  cars/
    audi-rs7-2026.json          ← ~40 KB (facts only)
    bmw-m5-2026.json            ← ~30 KB
    ...
  car-content/
    audi-rs7-2026-es.json       ← ~30 KB (Spanish editorial)
    audi-rs7-2026-en.json       ← ~30 KB (English editorial)
    audi-rs7-2026-fr.json       ← ~30 KB (French editorial)
    audi-rs7-2026-ar.json       ← ~30 KB (Arabic editorial)
  locales/
    es.json, en.json, fr.json, ar.json   ← UI translations only
  countries/
    spain.json, uk.json, france.json, ...  ← Currency, taxes, units
  registry/
    car-registry.json           ← dataFile + contentFile pointers
```

### 3.2 Data Flow

**Build:** Generator reads `cars/{car}.json` + `car-content/{car}-{lang}.json` → merges → writes HTML.

**Runtime:** Browser fetches `cars/{car}.json` (~40 KB, facts render immediately) + `car-content/{car}-{lang}.json` (~30 KB, narrative renders). On language switch, only the ~30 KB content file is re-fetched; facts stay cached.

### 3.3 Scalability Projection

| Fleet | Facts Total | Content Total (all langs) | Per-Page Transfer | Saving |
|-------|------------|---------------------------|-------------------|--------|
| 6 cars | 0.2 MB | 0.7 MB | 70 KB | 56% |
| 100 cars | 3.9 MB | 11.7 MB | 70 KB | 56% |
| 500 cars | 19.4 MB | 58.6 MB | 70 KB | 56% |
| 1,000 cars | 38.8 MB | 117.2 MB | 70 KB | 56% |

---

## 4. Detailed Comparison

### 4.1 Powertrain Types

| Type | Option 1 Impact | Option 2 Impact |
|------|----------------|-----------------|
| Petrol / Diesel | Same narrative pattern | Same content structure |
| Hybrid / PHEV | More technology content | `technology` section larger, facts unchanged |
| EV | **Fundamentally different narrative** (range, charging, no engine sound) | Same fact structure; `drivingExperience`, `review`, `runningCosts` content diverges naturally |

EVs highlight Option 2's strength: facts file stays structurally identical (`powertrain.type: "electric"`), while content files diverge dramatically without polluting the fact schema.

### 4.2 Translation Workflow

| Criterion | Option 1 | Option 2 |
|-----------|----------|----------|
| File per translator | One 158 KB monolith | One 30 KB focused file |
| Context needed | Full schema understanding | Editorial context only |
| Risk of breaking facts | **High** | **None** |
| Parallel translation | Impossible (same file) | Possible (4 files, 4 translators) |
| Git diff readability | Poor (huge diffs) | Excellent (focused changes) |
| CAT tool compatibility | Poor (deeply nested JSON) | Good (flat text JSON) |

### 4.3 AI Content Generation Workflow

| Criterion | Option 1 | Option 2 |
|-----------|----------|----------|
| Prompt complexity | High — must constrain schema | Low — simple text generation |
| Fact hallucination risk | **High** — AI can output wrong specs | **None** — facts are read-only context |
| Output validation | Must validate entire file | Validate text content only |
| Per-language generation | Must regenerate full file | Generate one 30 KB file independently |
| Rollback capability | Roll back entire car | Roll back one language |

### 4.4 Maintenance Complexity

| Criterion | Option 1 | Option 2 |
|-----------|----------|----------|
| Schema | One monolithic schema | Two focused schemas |
| Validator | Complex (flat + multilingual logic) | Simple (car-validator + content-validator) |
| Renderer | `_getLocalized()` in registry | Same `_getLocalized()`, different fetch target |
| Build script | Copy one `data/` dir | Copy `cars/` + `car-content/` |
| New language addition | Modify every car file | Add `{id}-{lang}.json` files |

### 4.5 Generator Impact

| Generator | Option 1 Change | Option 2 Change |
|-----------|-----------------|-----------------|
| car-page-generator.js | Reads one file | Reads two files, merges at build |
| search-index-generator.js | None (doesn't index narrative) | None |
| sitemap-generator.js | None | None |
| compare-data-generator.js | None | None |
| mega-menu-generator.js | None | None |
| Build time (6 cars) | ~2s | ~3s (negligible) |

---

## 5. Technical Debt

### Current Debt (Option 1)

| # | Item | Severity |
|---|------|----------|
| 1 | File bloat — RS7 is 5x larger than peers | High |
| 2 | Wasted transfer — 75% of JSON unused per view | High |
| 3 | Mixed concerns — facts + editorial in same file | Medium |
| 4 | Hardcoded labels ("Handling", "Veredicto") in registry | Medium |
| 5 | No team separation — content/data teams collide | Medium |
| 6 | AI generation risks hallucinating specs | Medium |
| 7 | Translation bottleneck — single file per car | Medium |

### Debt Under Option 2

| # | Item | Severity | Notes |
|---|------|----------|-------|
| 1 | Migration effort (~2-3 dev days) | Medium | One-time |
| 2 | Dual-path during transition | Medium | Temporary |
| 3 | Missing content file | Low | Fallback to ES built in |
| 4 | Additional HTTP request | Low | ~30 KB, cached |

---

## 6. Migration Cost Estimate

| Task | Effort |
|------|--------|
| Create `cars/` and `car-content/` directories | 5 min |
| Split `master-car-schema.json` → `car-schema.json` + `car-content-schema.json` | 2 hours |
| Write migration script (split 6 existing files) | 2 hours |
| Update `car-page-generator.js` (two-path read) | 2 hours |
| Update `car-renderer.js` (fetch content separately) | 2 hours |
| Update `car-validator.js` + add `car-content-validator.js` | 2 hours |
| Update `build.js` (copy `car-content/`) | 30 min |
| Update `car-registry.json` (`contentFile` pointer) | 30 min |
| Regression testing (build, validators, 4 languages) | 4 hours |
| Update documentation | 1 hour |
| **Total** | **~17 hours (~2-3 dev days)** |

---

## 7. Backward Compatibility Strategy

**Phase 1: Dual-path support (1 sprint)**
- Renderer checks `car-content/{id}-{lang}.json` first; falls back to embedded narrative if missing.
- Old cars (BMW, Porsche, GT-R, RS3) continue working without content files.
- New/populated cars use content files.

**Phase 2: Gradual migration (2-3 sprints)**
- Migrate RS7 first (validates the pipeline).
- Migrate BMW M5, Mercedes-AMG GT, Porsche 911 as content is populated.
- Leave placeholders until editorial is ready.

**Phase 3: Cleanup (1 sprint)**
- Once all cars have content files, remove embedded narrative support.
- Archive old monolithic files.

---

## 8. Architecture Diagrams

### Current (Option 1 — Embedded)

```
BUILD TIME:
  car-registry.json ──→ car-page-generator.js
                              │
                              ▼
                    ┌─────────────────────┐
                    │ system/data/        │
                    │   rs7-2026.json     │
                    │   (158 KB monolith) │
                    │   facts + 4 langs   │
                    └─────────────────────┘
                              │
                              ▼
                         html/rs7.html

RUN TIME:
  Browser ──→ fetch(system/data/rs7-2026.json) ──→ 158 KB
                    │
                    ▼
              CarRenderer parses JSON
                    │
                    ▼
              _getLocalized(data, 'en')  →  extracts 30 KB
                    │                         ignores 88 KB
                    ▼
              renderSections() → DOM

  Language switch: same JSON re-parsed,
  no extra fetch, but 75% bandwidth wasted.
```

### Proposed (Option 2 — Separated)

```
BUILD TIME:
  car-registry.json ──→ car-page-generator.js
                              │
              ┌───────────────┴───────────────┐
              │                               │
              ▼                               ▼
      system/cars/                system/car-content/
        rs7-2026.json               rs7-2026-es.json
        (40 KB facts)               rs7-2026-en.json
                                      rs7-2026-fr.json
                                      rs7-2026-ar.json
                              │       (~30 KB each)
                              ▼
                         html/rs7.html

RUN TIME:
  Browser ──→ fetch(cars/rs7-2026.json) ──→ 40 KB
                    │
                    ▼
              render facts (immediate)
                    │
                    └──→ fetch(car-content/rs7-2026-en.json) ──→ 30 KB
                              │
                              ▼
                        renderSections() → DOM

  Language switch: fetch car-content/rs7-2026-fr.json ──→ 30 KB
  cars/ JSON stays cached. Facts never re-fetched.
```

---

## 9. Benefits & Risks

### Option 1 Benefits
- No migration work
- Single file per car (simple mental model)
- One fetch per page

### Option 2 Benefits
- **56% reduction** in per-page data transfer (158 KB → 70 KB)
- Content editors never touch facts
- AI generation is safer (facts = read-only context)
- Parallel translation (4 translators, 4 files)
- Readable git diffs
- Easy language addition without touching facts
- Independent versioning of content vs facts
- Aligns with original Carspecio principles

### Option 1 Risks
- Performance degradation at scale (High probability, High impact)
- Content editors can break specs (Medium, High)
- Translation bottleneck (High, Medium)
- AI hallucination corrupts data (Medium, High)

### Option 2 Risks
- Migration effort: ~2-3 dev days (Certain, Low impact)
- Temporary dual-path complexity (Medium, Low)
- Missing content file for language (Low, Low — fallback to ES)
- Additional HTTP request (Certain, Low — ~30 KB, cached)

---

## 10. Final Recommendation

### **MIGRATE TO SEPARATED CONTENT ARCHITECTURE (Option 2)**

**Why:**

1. **The RS7 file is 5x larger than peers.** At 1,000 cars, the data directory exceeds 150 MB. Git, editors, and validators will slow.
2. **75% of every page load is wasted bandwidth.** On mobile networks, this directly hurts Core Web Vitals.
3. **Content editors cannot safely edit car files.** A single mistake corrupts immutable specs or pricing.
4. **AI-assisted generation is unnecessarily risky.** With monolithic files, the AI must be constrained not to hallucinate specs. With separated files, the AI only generates editorial text.
5. **The original Carspecio architecture already envisioned this.** The `locales/` and `countries/` directories prove the principle: separate language-dependent content from language-independent facts.
6. **Migration cost is small and one-time.** ~2-3 dev days. The long-term savings (simpler validation, parallel translation, AI safety) far exceed this cost.
7. **Guides already use the pattern.** Guide files keep `content.es/en/fr/ar`, but guide content is tiny. Car narrative is 30x larger per language, making the monolithic approach unsustainable.

### Recommended Next Steps

1. **Approve this architecture review.**
2. **Schedule migration sprint** (2-3 days dev + 1 day testing).
3. **Do NOT populate BMW, Mercedes, Porsche, GT-R content** until architecture is migrated.
4. Write migration script → update generator → update renderer → add content validator.
5. Migrate RS7 first, then begin populating other cars using `car-content/`.

---

## Appendix: Metrics Reference

| Metric | Value |
|--------|-------|
| Current cars | 6 |
| Fully populated | 1 (RS7) |
| Languages | 4 (ES, EN, FR, AR) |
| RS7 file size | 158.3 KB |
| Non-narrative avg | 30.5 KB |
| Narrative content | ~118 KB (75%) |
| Base facts | ~40 KB (25%) |
| Words per language | ~1,300–1,500 |
| Option 1 per-page | 158 KB |
| Option 2 per-page | 70 KB |
| Transfer reduction | 56% |
| Migration effort | ~2-3 dev days |
