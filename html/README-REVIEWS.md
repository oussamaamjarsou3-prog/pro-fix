# Sistema de Reviews de Coches — Guía de Arquitectura

## Estructura de archivos

```
pro-fix/
├── system/
│   ├── registry/
│   │   ├── car-registry.json          ← 1. REGISTRO de coches (Single Source of Truth)
│   │   ├── brand-registry.json        ← Registro de marcas
│   │   └── country-registry.json      ← Registro de países
│   │
│   ├── data/
│   │   ├── audi-rs3-2026.json         ← 2. DATOS del coche (JSON completo)
│   │   ├── audi-rs7-2026.json
│   │   ├── bmw-m5-2026.json
│   │   ├── bmw-520d-xdrive-2026.json
│   │   ├── mercedes-amg-gt-2026.json
│   │   ├── nissan-gtr-2026.json
│   │   ├── porsche-911-2026.json
│   │   └── tesla-model-s-plaid-2026.json
│   │
│   ├── templates/
│   │   └── car-template.html          ← Plantilla HTML base (NO editar directamente)
│   │
│   ├── generators/
│   │   └── car-page-generator.js      ← 3. GENERADOR de páginas HTML
│   │
│   ├── validators/
│   │   └── car-validator.js           ← Validador de datos
│   │
│   ├── locales/
│   │   ├── es.json                    ← Traducciones UI (es, en, fr, ar)
│   │   ├── en.json
│   │   ├── fr.json
│   │   └── ar.json
│   │
│   ├── config.js                      ← Configuración (BASE_URL, idiomas)
│   └── build.js                       ← Build global (ejecuta todos los generadores)
│
├── html/
│   ├── rs7.html                       ← Páginas generadas (NO editar manualmente)
│   ├── rs3.html
│   ├── bmw-m5.html
│   ├── bmw-520d.html
│   ├── mercedes-amg-gt.html
│   ├── nissan-gtr.html
│   ├── porsche-911.html
│   ├── model-s-plaid.html
│   └── reviews.html                   ← Listing de reviews (dinámico)
│
├── js/
│   ├── car-renderer.js                ← Renderer dinámico (carga datos JSON en runtime)
│   ├── car-renderer-registry.js       ← Registro de renderers por sección
│   ├── car-sections-anim.js           ← Animaciones de secciones
│   ├── cost-calculator.js             ← Calculadora de costes
│   └── home-dynamic.js                ← Cards dinámicas en homepage
│
└── images/
    ├── audi-rs3.2026/                 ← Imágenes del coche
    ├── Porsche 911 GTS T-Hybrid/
    └── ...
```

## Flujo para añadir un coche nuevo

### Paso 1 — Registrar el coche en `car-registry.json`

Añade una entrada en `system/registry/car-registry.json`:

```json
{
    "id": "toyota-supra-2026",
    "slug": "toyota-supra",
    "brandId": "toyota",
    "categoryId": "deportivos",
    "modelYear": 2026,
    "generation": "A90",
    "status": "active",
    "htmlFile": "toyota-supra.html",
    "dataFile": "system/data/toyota-supra-2026.json",
    "images": {
        "hero": "/images/toyota-supra.2026/supra-hero.png",
        "gallery": [
            "/images/toyota-supra.2026/supra-1.png",
            "/images/toyota-supra.2026/supra-2.png"
        ]
    },
    "seo": {
        "title": "Toyota Supra 2026 - Review y Comparativa",
        "description": "El Toyota Supra 2026 combina deportividad japonesa con ingeniería BMW.",
        "keywords": ["toyota", "supra", "deportivo", "japonés", "6-cilindros"]
    },
    "relatedCars": ["nissan-gtr-2026", "porsche-911-2026"],
    "comparisons": ["nissan-gtr-2026", "bmw-m5-2026"]
}
```

**Si la marca no existe**, añádela también en `system/registry/brand-registry.json`:

```json
{
    "id": "toyota",
    "name": "Toyota",
    "logo": "https://cdn.simpleicons.org/toyota/94a3b8",
    "country": "Japan",
    "website": "https://www.toyota.com",
    "founded": 1937,
    "models": ["toyota-supra-2026"],
    "categories": ["deportivos", "sedan", "suv", "hatchback", "híbridos"]
}
```

### Paso 2 — Crear el archivo de datos JSON

Crea `system/data/toyota-supra-2026.json` con toda la información del coche.

#### Estructura completa del JSON de coche

```json
{
    "id": "toyota-supra-2026",
    "slug": "toyota-supra",
    "brandId": "toyota",
    "categoryId": "deportivos",
    "modelYear": 2026,
    "generation": "A90",
    "bodyStyle": "coupe",
    "doors": 2,
    "seats": 2,
    "drivetrain": "rwd",
    "enginePosition": "front",
    "powertrain": {
        "type": "petrol",
        "description": "3.0L inline-6 turbo with 382 HP"
    },
    "status": "active",
    "launchDate": "2026-01-01",
    "productionYears": { "start": 2019, "end": null },

    "basicInfo": {
        "name": "Supra",
        "fullModelName": "Toyota Supra GR",
        "badge": "GR TOYOTA",
        "tagline": "Deportivo japonés con motor 6 cilindros turbo",
        "description": "...",
        "longDescription": "...",
        "highlights": ["...", "...", "..."]
    },

    "specs": {
        "engine": {
            "type": "Inline-6 Turbo",
            "displacement": { "value": 2998, "unit": "cc" },
            "cylinders": 6,
            "configuration": "Inline",
            "aspiration": "Turbo",
            "fuelType": "petrol",
            "fuelOctane": "98"
        },
        "transmission": {
            "type": "Automatic",
            "gears": 8,
            "brand": "ZF",
            "driveMode": "RWD"
        },
        "suspension": {
            "front": "MacPherson",
            "rear": "Multi-link",
            "adaptive": true,
            "airSuspension": false
        },
        "brakes": {
            "front": "Ventilated disc",
            "rear": "Ventilated disc"
        },
        "wheels": {
            "front": { "size": "19", "tire": "255/35 R19" },
            "rear": { "size": "19", "tire": "275/35 R19" }
        }
    },

    "performance": {
        "power": { "value": 382, "unit": "HP" },
        "torque": { "value": 500, "unit": "Nm" },
        "acceleration": { "zeroToHundred": "3.9" },
        "topSpeed": { "value": 250, "unit": "km/h" }
    },

    "dimensions": {
        "length": 4380,
        "width": 1865,
        "height": 1290,
        "wheelbase": 2470,
        "curbWeight": 1542,
        "fuelTank": 52
    },

    "fuelEconomy": {
        "petrol": {
            "combined": { "value": 7.5, "unit": "L/100km" },
            "city": { "value": 9.5, "unit": "L/100km" },
            "highway": { "value": 6.2, "unit": "L/100km" },
            "co2": 171
        }
    },

    "pricing": {
        "basePrice": 55000,
        "currency": "EUR"
    },

    "countryPricing": {
        "es": { "priceNew": 55000, "used3Range": "42K-48K", "used5Range": "32K-38K" },
        "fr": { "priceNew": 58000, "used3Range": "44K-50K", "used5Range": "34K-40K" },
        "de": { "priceNew": 56000, "used3Range": "43K-49K", "used5Range": "33K-39K" },
        "us": { "priceNew": 56000, "used3Range": "42K-48K", "used5Range": "32K-38K" },
        "gb": { "priceNew": 52000, "used3Range": "40K-46K", "used5Range": "30K-36K" },
        "it": { "priceNew": 57000, "used3Range": "43K-49K", "used5Range": "33K-39K" },
        "ma": { "priceNew": 620000, "used3Range": "480K-540K", "used5Range": "360K-420K" },
        "ae": { "priceNew": 210000, "used3Range": "160K-180K", "used5Range": "120K-140K" },
        "sa": { "priceNew": 220000, "used3Range": "170K-190K", "used5Range": "130K-150K" }
    },

    "images": {
        "hero": "/images/toyota-supra.2026/supra-hero.png",
        "gallery": ["/images/toyota-supra.2026/supra-1.png"]
    },

    "rating": {
        "overall": 8.5,
        "performance": 9,
        "comfort": 7,
        "technology": 8,
        "design": 9,
        "value": 8
    },

    "content": {
        "pros": ["Motor 6 cilindros con gran sonido", "Dinámica de conducción pura"],
        "cons": ["Solo 2 plazas", "Maletero pequeño"]
    },

    "review": {
        "es": { "title": "Review del Toyota Supra 2026", "text": "..." },
        "en": { "title": "Toyota Supra 2026 Review", "text": "..." },
        "fr": { "title": "Essai Toyota Supra 2026", "text": "..." },
        "ar": { "title": "مراجعة تويوتا سوبرا 2026", "text": "..." }
    },

    "drivingExperience": {
        "es": { "title": "Experiencia de conducción", "text": "..." },
        "en": { ... }, "fr": { ... }, "ar": { ... }
    },

    "exteriorDesign": {
        "es": { "title": "Diseño exterior", "text": "..." },
        "en": { ... }, "fr": { ... }, "ar": { ... }
    },

    "interior": {
        "es": { "title": "Interior y practicidad", "text": "..." },
        "en": { ... }, "fr": { ... }, "ar": { ... }
    },

    "interiorCards": {
        "es": [{ "label": "Calidad", "value": "Premium" }],
        "en": { ... }, "fr": { ... }, "ar": { ... }
    },

    "technology": {
        "es": { "title": "Tecnología", "text": "..." },
        "en": { ... }, "fr": { ... }, "ar": { ... }
    },

    "safety": {
        "es": { "title": "Seguridad", "text": "..." },
        "en": { ... }, "fr": { ... }, "ar": { ... }
    },

    "tires": {
        "es": [{ "label": "Delanteras", "value": "255/35 R19" }],
        "en": { ... }, "fr": { ... }, "ar": { ... }
    },

    "runningCosts": {
        "es": { "title": "Costes de mantenimiento", "text": "..." },
        "en": { ... }, "fr": { ... }, "ar": { ... }
    },

    "ownership": {
        "es": { "title": "Propiedad", "text": "..." },
        "en": { ... }, "fr": { ... }, "ar": { ... }
    },

    "options": [
        { "name": "Paquete Premium", "price": "€3,500", "worth": "Sí", "resale": "Alto" }
    ],

    "problems": [
        { "issue": "Desgaste de neumáticos traseros", "severity": "Medio", "cost": "€800" }
    ],

    "comparisons": [
        { "name": "Nissan GT-R", "fullName": "Nissan GT-R R35" }
    ],

    "pageText": {
        "es": {
            "faq": {
                "q1": "¿Cuánto cuesta el Supra?", "a1": "Desde 55.000€.",
                "q2": "¿Es fiable?", "a2": "Sí, el motor BMW B58 es muy fiable."
            }
        },
        "en": { ... }, "fr": { ... }, "ar": { ... }
    },

    "seo": {
        "title": "Toyota Supra 2026 - Review y Comparativa",
        "description": "El Toyota Supra 2026 combina deportividad japonesa con ingeniería BMW.",
        "keywords": ["toyota", "supra", "deportivo"]
    },

    "relatedModels": ["nissan-gtr-2026", "porsche-911-2026"]
}
```

### Paso 3 — Añadir las imágenes

Coloca las imágenes en `images/toyota-supra.2026/`:
- `supra-hero.png` (imagen principal)
- `supra-1.png`, `supra-2.png`, etc. (galería)

### Paso 4 — Ejecutar el generador

```bash
# Generar solo las páginas de coches
node system/generators/car-page-generator.js

# O ejecutar el build completo (todos los generadores)
node system/build.js
```

### Paso 5 — Validar los datos (opcional pero recomendado)

```bash
node system/validators/car-validator.js
```

### Paso 6 — Listo

La página `html/toyota-supra.html` se genera automáticamente con:
- Header, footer y navegación consistentes
- SEO completo (meta tags, Open Graph, Twitter Cards, Schema.org)
- 4 idiomas (es, en, fr, ar)
- Todas las secciones: specs, performance, precio, galería, costes, mantenimiento, FAQ, etc.
- Calculadora de costes interactiva
- Comparativa con rivales
- Quiz interactivo
- Guía de compra de ocasión

El coche también aparece automáticamente en:
- `reviews.html` (listing de reviews)
- `index.html` (homepage dinámica)
- Mega menú de marcas
- Comparador

## Campos del car-registry.json

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | string | ID único (ej: `toyota-supra-2026`) |
| `slug` | string | URL slug (ej: `toyota-supra`) |
| `brandId` | string | ID de marca (debe existir en brand-registry) |
| `categoryId` | string | Categoría: deportivos, sedan, suv, electricos, etc. |
| `modelYear` | number | Año del modelo |
| `generation` | string | Generación (ej: `A90`, `C8`, `992`) |
| `status` | string | `active` o `inactive` |
| `htmlFile` | string | Nombre del archivo HTML de salida |
| `dataFile` | string | Ruta al JSON de datos |
| `images` | object | Hero y galería de imágenes |
| `seo` | object | Título, descripción y keywords para SEO |
| `relatedCars` | array | IDs de coches relacionados |
| `comparisons` | array | IDs de coches para comparativa |

## Secciones multilingües del JSON de datos

Estas secciones deben tener traducciones en los 4 idiomas (es, en, fr, ar):

- `review` — Review principal
- `drivingExperience` — Experiencia de conducción
- `exteriorDesign` — Diseño exterior
- `interior` — Interior y practicidad
- `interiorCards` — Cards del interior (label, value)
- `interiorText` — Texto adicional del interior
- `technology` — Tecnología e infotenimiento
- `safety` — Seguridad y asistencias
- `tires` — Neumáticos y ruedas
- `runningCosts` — Costes de mantenimiento
- `ownership` — Experiencia de propiedad
- `relatedModels` — Modelos relacionados

## Placeholders dinámicos en pageText

El generador reemplaza estos placeholders en los textos:

| Placeholder | Descripción |
|------------|-------------|
| `{{fullModelName}}` | Nombre completo del modelo |
| `{{shortName}}` | Nombre corto |
| `{{modelYear}}` | Año del modelo |
| `{{scoreOverall}}` | Puntuación global |
| `{{power}}` | Potencia (ej: "382 HP") |
| `{{torque}}` | Par motor (ej: "500 Nm") |
| `{{acceleration}}` | Aceleración 0-100 |
| `{{topSpeed}}` | Velocidad máxima |
| `{{consumption}}` | Consumo combinado |
| `{{co2}}` | Emisiones CO2 |
| `{{country}}` | País seleccionado |
| `{{currency}}` | Moneda del país |
| `{{priceNew}}` | Precio nuevo |
| `{{used3Range}}` | Rango de ocasión 3 años |
| `{{used5Range}}` | Rango de ocasión 5 años |
| `{{car1}}` | Nombre rival 1 |
| `{{car2}}` | Nombre rival 2 |

## Reglas importantes

- **Nunca edites** `html/*.html` (páginas de coches) manualmente — se sobreescriben al generar
- **Nunca edites** `system/templates/car-template.html` directamente — usa el generador
- **Solo edita** los JSONs en `system/data/` y los registros en `system/registry/`
- Si cambias un JSON, ejecuta `node system/generators/car-page-generator.js` para regenerar
- Usa `node system/build.js` para regenerar todo (coches, guías, noticias, mega menú, etc.)
- Valida los datos con `node system/validators/car-validator.js` antes de generar
- Las imágenes deben estar en `images/` con rutas `/images/...` en el registry y el JSON
- Todos los coches deben tener los 4 idiomas (es, en, fr, ar) en las secciones multilingües
- `countryPricing` debe tener 9 países: us, it, es, fr, ma, de, ae, gb, sa

## Categorías disponibles

| ID | Nombre |
|----|--------|
| `deportivos` | Deportivos |
| `sedan` | Sedán |
| `suv` | SUV |
| `electricos` | Eléctricos |
| `hatchback` | Hatchback |
| `compactos` | Compactos |
| `familiar` | Familiar |
| `pickup` | Pickup |
| `híbridos` | Híbridos |
| `lujo` | Lujo |
