# Powertrain Architecture Migration Report

## Summary

The car page system has been refactored to support multiple powertrain types without requiring future template or renderer rewrites. The architecture is built around a `powertrain.type` switch, a renderer registry pattern, and optional schema extensions.

## Architecture Decisions

- **Primary Switch:** `powertrain.type` accepts `petrol`, `diesel`, `mild-hybrid`, `hybrid`, `phev`, `electric`.
- **Registry Pattern:** `SECTION_RENDERERS` (common sections) and `POWERTRAIN_RENDERERS` (powertrain-specific sections) are defined in `js/car-renderer-registry.js` and consumed by `CarRenderer.renderSections()`.
- **Backward Compatibility:** All existing fields remain required. New fields are optional. Old inline rendering logic in `car-renderer.js` is preserved; registry sections are additive only.
- **Template Strategy:** New `<section>` containers in `car-template.html` are `hidden` by default. The renderer shows them only when data is present.

## Files Modified

| File | Change |
|------|--------|
| `system/schemas/master-car-schema.json` | Added optional `powertrain`, `review`, `drivingExperience`, `exteriorDesign`, `interior`, `technology`, `runningCosts`, `modelHistory`, `video`, `ownership` |
| `system/templates/car-template.html` | Added hidden sections: review, driving experience, exterior design, interior, technology, safety, powertrain, related cars |
| `js/car-renderer.js` | Added `_getLang()`, `_getPowertrainType()`, `renderSections()`, and registry invocation |
| `js/car-renderer-registry.js` | **New** — defines `SECTION_RENDERERS` and `POWERTRAIN_RENDERERS` |
| `system/validators/car-validator.js` | Added powertrain type validation and migration warnings |
| `system/data/rs7-2026.json` | Added `powertrain.type: "petrol"` as pilot |

## Migration Checklist per Powertrain Type

### Petrol (Pilot: Audi RS7)
- [x] Schema supports `powertrain.type: "petrol"`
- [x] Renderer registry handles petrol via `_renderPowertrainCommon`
- [x] `specs.engine` fields are rendered (type, displacement, cylinders, fuelType)
- [x] `specs.transmission` fields are rendered
- [x] Optional: add `review`, `drivingExperience`, `exteriorDesign`, etc.

### Diesel
- [ ] Add `powertrain.type: "diesel"` to car data
- [ ] Populate `specs.engine` (turbo-diesel specific details optional)
- [ ] Renderer will reuse petrol path; no template changes needed

### Mild Hybrid
- [ ] Add `powertrain.type: "mild-hybrid"` to car data
- [ ] Populate `specs.engine` plus mild-hybrid assist notes under `powertrain.description`
- [ ] Renderer will reuse petrol path; consider adding starter-generator fields to schema later if needed

### Full Hybrid
- [ ] Add `powertrain.type: "hybrid"` to car data
- [ ] Populate both `specs.engine` and `specs.electricMotor` if desired (schema already allows extensible `specs` properties)
- [ ] Renderer will reuse petrol path; EV-specific fields can be added to `powertrain.description`

### PHEV (Plug-in Hybrid)
- [ ] Add `powertrain.type: "phev"` to car data
- [ ] Populate `specs.engine` and `specs.battery` (range, capacity)
- [ ] Renderer automatically renders engine + battery cards
- [ ] Optional: add `runningCosts` for charging vs fuel breakdown

### Electric
- [ ] Add `powertrain.type: "electric"` to car data
- [ ] Populate `specs.battery` (capacity, range, charging AC/DC)
- [ ] Populate `specs.electricMotor` (power, torque)
- [ ] Renderer automatically renders battery + motor cards
- [ ] Optional: add `runningCosts.fuel` with `unit: "kWh/100km"` or "mi/kWh"

## Backward Compatibility Notes

- Cars without `powertrain` object validate with **warnings only**, not errors.
- Existing `pageText`, `content`, `interiorCards`, `interiorText` continue to render exactly as before.
- `dimensions.weight` fallback is preserved alongside `dimensions.curbWeight`.
- Template sections are `hidden` until populated, so empty data does not produce empty UI blocks.
- Build pipeline, search index generator, sitemap generator, and guide system were **not modified**.

## Verification Results

```
✅ Build completed successfully
✅ Car Data Validator: 0 errors, 5 warnings (missing powertrain on non-pilot cars)
✅ Guide Data Validator: 0 errors
✅ Car Registry Validator: 0 errors
✅ Generators: 7/7 passed
✅ Sitemap: 15 URLs generated
```

## Next Steps (Phase 4B — Content Population)

1. Populate `powertrain` object for remaining 5 cars (RS3, BMW M5, AMG GT, GT-R, 911).
2. Add structured `review`, `drivingExperience`, `exteriorDesign`, `interior`, `technology` objects to cars on a per-priority basis.
3. Extend `POWERTRAIN_RENDERERS` if new powertrain-specific visual layouts are needed (no template rewrites required).
4. Remove migration warnings from validator once all cars are migrated.

---
*Report generated after Phase 4A architecture refactor.*
