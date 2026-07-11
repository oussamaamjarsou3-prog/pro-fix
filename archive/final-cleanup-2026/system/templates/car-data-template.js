/**
 * AutoMax — Car Data Template
 * 
 * Use this template to add new car models to car-data.js
 * Copy this structure and replace the placeholder values with real data
 * 
 * REQUIRED FIXES FOR NEW CAR PAGES (see car-template.html):
 * - FOUT Protection: Add CSS loader (body opacity transition)
 * - Mega Menu: Include mega-menu-base.css + mega-menu-full.css
 * - Mega Menu: Remove mega-menu__footer (no "Ver todas las marcas")
 * - Back Buttons: Use "← Volver a Marcas" / "← Volver a Categorías"
 * - Short Titles: "Problemas comunes", "Veredicto", "¿Merece la pena?"
 * - Problems Section: Include fallback content in HTML (not just data-i18n)
 * - Fiscal Table: Requires countryPricing data with UTF-8 encoding
 * - Quiz: Use "TEST" tag, "¿Cuál es tu coche ideal?" title
 * - Remove decorative symbols: ✔ ✖ ⚠ ± − (use styling instead)
 * 
 * ENCODING FIXES (for countryPricing):
 * - Spanish: Región, matriculación, Cataluña, País Vasco, Andalucía, España
 * - French: Région, CO₂, Île-de-France, Côte, Rhône
 * - German: Württemberg
 * 
 * STEPS TO ADD A NEW CAR:
 * 1. Copy this entire template
 * 2. Replace 'CAR_NAME' with the actual car name (e.g., 'BMW M3')
 * 3. Fill in all the placeholder values with real data
 * 4. Paste it into car-data.js
 * 5. Add the car to mega-menu-data.js modelPageMap
 * 6. Create the car's HTML page (e.g., bmw-m3.html) using car-template.html
 * 7. Add the car to reviews.html if needed
 */

const carDataTemplate = {
    'CAR_NAME': {
        // Basic Info
        brand: 'BRAND_NAME',           // e.g., 'Audi', 'BMW', 'Mercedes'
        model: 'MODEL_NAME',           // e.g., 'RS7 Sportback', 'M3 Competition'
        category: 'CATEGORY',         // 'deportivos', 'suv', 'electricos', 'sedan', 'hatchback', 'compactos', 'familiar', 'pickup', 'híbridos', 'lujo'
        price: PRICE_IN_EUR,           // e.g., 145000
        currency: 'EUR',
        rating: RATING_0_TO_10,        // e.g., 9.4
        image: '../path/to/image.jpg',
        
        // Technical Specifications
        specs: {
            engine: 'ENGINE_SPEC',              // e.g., '4.0L V8 Twin Turbo'
            power: POWER_IN_HP,                 // e.g., 591
            torque: TORQUE_IN_NM,               // e.g., 800
            acceleration: ZERO_TO_100_IN_SEC,   // e.g., 3.1
            topSpeed: TOP_SPEED_KMH,            // e.g., 305
            fuelConsumption: MIXED_L_PER_100KM, // e.g., 12.8
            fuelConsumptionCity: CITY_L_PER_100KM,   // e.g., 15
            fuelConsumptionHighway: HIGHWAY_L_PER_100KM, // e.g., 10
            fuelConsumptionMixed: MIXED_L_PER_100KM,    // e.g., 12.8
            seating: SEATING_CAPACITY,          // e.g., 5
            trunk: TRUNK_CAPACITY_LITERS,      // e.g., 535
            weight: WEIGHT_KG,                 // e.g., 2065
            transmission: 'TRANSMISSION',       // e.g., 'Automática 8 velocidades'
            drive: 'DRIVE_TYPE'                // e.g., 'Quattro AWD'
        },
        
        // Available Versions/Trims
        versions: [
            {
                name: 'VERSION_NAME_1',
                price: PRICE_IN_EUR,
                description: 'Brief description of this version'
            },
            {
                name: 'VERSION_NAME_2',
                price: PRICE_IN_EUR,
                description: 'Brief description of this version'
            }
        ],
        
        // Optional Extras/Packages
        options: [
            { 
                name: 'OPTION_NAME', 
                price: PRICE_IN_EUR, 
                worth: true/false,           // Is it worth buying?
                resaleImpact: 'high/medium/low/negative', // Impact on resale value
                note: 'Additional notes (optional)' 
            }
        ],
        
        // Pros and Cons
        features: {
            pros: [
                'PRO_1',
                'PRO_2',
                'PRO_3'
            ],
            cons: [
                'CON_1',
                'CON_2',
                'CON_3'
            ]
        },
        
        // Comparison Data
        comparison: {
            vsCompetitors: [
                { model: 'COMPETITOR_MODEL_1', score: SCORE_0_TO_10 },
                { model: 'COMPETITOR_MODEL_2', score: SCORE_0_TO_10 }
            ]
        },
        
        // Tools Data (for herramientas.html)
        tools: {
            // Financing Calculator
            financing: {
                downPayment: DOWN_PAYMENT_EUR,    // e.g., 29000 (20% of price)
                monthlyPayment: MONTHLY_PAYMENT,  // e.g., 1850
                term: TERM_IN_MONTHS              // e.g., 60
            },

            // Insurance
            insurance: {
                annual: ANNUAL_INSURANCE_EUR      // e.g., 1200
            },

            // Tax Info (Fiscal Spain)
            tax: {
                annual: ANNUAL_TAX_EUR,          // e.g., 450
                co2: CO2_G_PER_KM,               // e.g., 276
                taxBand: 'tax_band',              // e.g., 'tramo alto', 'tramo medio', 'tramo bajo'
                // Fiscal data by CCAA (Spain)
                fiscal: {
                    basePrice: PRICE_IN_EUR,     // Base price for tax calculation
                    regions: [
                        { name: 'Andalucía', rate: 3.0 },
                        { name: 'Aragón', rate: 4.0 },
                        { name: 'Asturias', rate: 3.0 },
                        { name: 'Baleares', rate: 3.0 },
                        { name: 'Canarias', rate: 0.0 },
                        { name: 'Cantabria', rate: 3.0 },
                        { name: 'Castilla-La Mancha', rate: 3.0 },
                        { name: 'Castilla y León', rate: 3.0 },
                        { name: 'Cataluña', rate: 5.0 },
                        { name: 'Comunidad Valenciana', rate: 3.0 },
                        { name: 'Extremadura', rate: 3.0 },
                        { name: 'Galicia', rate: 3.0 },
                        { name: 'Madrid', rate: 3.0 },
                        { name: 'Murcia', rate: 3.0 },
                        { name: 'Navarra', rate: 4.0 },
                        { name: 'País Vasco', rate: 5.0 },
                        { name: 'La Rioja', rate: 3.0 },
                        { name: 'Ceuta', rate: 3.0 },
                        { name: 'Melilla', rate: 3.0 }
                    ]
                }
            },

            // Maintenance
            maintenance: {
                oilChange: OIL_CHANGE_EUR,       // e.g., 350
                tyres: TYRES_EUR,                // e.g., 1600
                annualInsurance: ANNUAL_INSURANCE_EUR, // e.g., 2500
                timeline: [
                    {
                        km: KILOMETERS,
                        title: 'SERVICE_TITLE',
                        desc: 'SERVICE_DESCRIPTION',
                        audiOfficial: OFFICIAL_PRICE,
                        independent: INDEPENDENT_PRICE
                    }
                ]
            },

            // Depreciation
            depreciation: {
                newPrice: NEW_PRICE_EUR,         // e.g., 145000
                year3: PRICE_AFTER_3_YEARS,      // e.g., 98000
                year5: PRICE_AFTER_5_YEARS,      // e.g., 78000
                loss3: PERCENTAGE_LOSS_3_YEARS,  // e.g., 32
                loss5: PERCENTAGE_LOSS_5_YEARS,  // e.g., 46
                insight: [
                    'INSIGHT_1',
                    'INSIGHT_2',
                    'INSIGHT_3'
                ]
            },

            // Annual Cost
            annualCost: {
                fuel: FUEL_COST_EUR,             // e.g., 3168
                insurance: INSURANCE_COST_EUR,   // e.g., 2570
                maintenance: MAINTENANCE_COST_EUR, // e.g., 4800
                depreciation: DEPRECIATION_COST_EUR, // e.g., 15600
                total: TOTAL_ANNUAL_COST_EUR     // e.g., 26138
            },

            // Used Car Buying Guide
            usedGuide: {
                year3Range: 'YEAR3_RANGE_EUR',    // e.g., '€95.000 – €105.000'
                year5Range: 'YEAR5_RANGE_EUR',    // e.g., '€72.000 – €82.000'
                idealKm: 'IDEAL_KM_RANGE',        // e.g., '40.000 – 70.000 km'
                avoid: 'AVOID_CONDITION',        // e.g., '>100.000 km sin historial completo'
                checklist: [
                    'CHECKLIST_ITEM_1',
                    'CHECKLIST_ITEM_2',
                    'CHECKLIST_ITEM_3'
                ],
                warnings: [
                    'WARNING_1',
                    'WARNING_2',
                    'WARNING_3'
                ],
                whereToBuy: [
                    'WHERE_TO_BUY_1',
                    'WHERE_TO_BUY_2',
                    'WHERE_TO_BUY_3'
                ]
            },

            // Rival Comparison
            rival: {
                name: 'RIVAL_CAR_NAME',          // e.g., 'BMW M5'
                description: 'RIVAL_DESCRIPTION', // e.g., 'Más deportivo y agresivo'
                pros: [
                    'RIVAL_PRO_1',
                    'RIVAL_PRO_2'
                ],
                cons: [
                    'RIVAL_CON_1',
                    'RIVAL_CON_2'
                ]
            }
        },
        
        // Country-specific pricing and fiscal data (for fiscal table)
        countryPricing: {
            es: {
                name: 'España',
                flag: '🇪🇸',
                currency: 'EUR',
                locale: 'es-ES',
                fuelMetric: true,
                priceNew: 145000,
                dep3: 98000,
                dep5: 78000,
                fiscalHead: ['Región', 'Impuesto matriculación', 'ITV', 'Precio final'],
                fiscalRows: [
                    ['Madrid', '~21%', '380 EUR', 169100],
                    ['Cataluña', '~21%', '420 EUR', 169140],
                    ['País Vasco', '~21%', '350 EUR', 169070]
                ],
                fiscalNote: '* Precios estimados. Consulta con tu concesionario oficial.',
                fuelMin: 150,
                fuelMax: 220,
                fuelStep: 5,
                fuelDefault: 178,
                options: [4800, 1200, 9500, 2400, 3500, 0, 6300, 1900],
                maintenance: 2000,
                used3Range: '€95.000 – €105.000',
                used5Range: '€72.000 – €82.000',
                rivalM5: 25900,
                rivalAmg: 28120
            }
            // Add more countries as needed (de, fr, it, gb, us, etc.)
        }
    }
};

/**
 * EXAMPLE: Audi RS7 (for reference)
 */
const exampleRS7 = {
    'Audi RS7': {
        brand: 'Audi',
        model: 'RS7 Sportback',
        category: 'deportivos',
        price: 145000,
        currency: 'EUR',
        rating: 9.4,
        image: '../audi-rs7.jpg',
        specs: {
            engine: '4.0L V8 Twin Turbo',
            power: 591,
            torque: 800,
            acceleration: 3.1,
            topSpeed: 305,
            fuelConsumption: 12.8,
            fuelConsumptionCity: 15,
            fuelConsumptionHighway: 10,
            fuelConsumptionMixed: 12.8,
            seating: 5,
            trunk: 535,
            weight: 2065,
            transmission: 'Automática 8 velocidades',
            drive: 'Quattro AWD'
        },
        versions: [
            {
                name: 'Audi RS7 Sportback',
                price: 145000,
                description: 'La versión más equilibrada entre lujo y rendimiento'
            },
            {
                name: 'Audi RS7 Performance',
                price: 165000,
                description: 'Más potencia y experiencia extrema'
            },
            {
                name: 'Audi RS7 Carbon Edition',
                price: 180000,
                description: 'La versión más exclusiva y premium'
            }
        ],
        options: [
            { name: 'RS Dynamic Package Plus', price: 4800, worth: true, resaleImpact: 'high' },
            { name: 'Escape RS Sport', price: 1200, worth: true, resaleImpact: 'medium' },
            { name: 'Frenos cerámicos', price: 9500, worth: false, resaleImpact: 'neutral', note: 'Solo track' },
            { name: 'Matrix LED / Laser', price: 2400, worth: true, resaleImpact: 'medium' },
            { name: 'Interior Carbon / Valcona', price: 3500, worth: true, resaleImpact: 'high' },
            { name: 'Asientos traseros individuales', price: 0, worth: true, resaleImpact: 'high', note: 'Estándar' },
            { name: 'Bang & Olufsen 3D Advanced', price: 6300, worth: false, resaleImpact: 'low', note: 'Gustos' },
            { name: 'Techo solar panorámico', price: 1900, worth: false, resaleImpact: 'negative', note: 'No recomendado' }
        ],
        features: {
            pros: [
                'V8 591 CV, acabado premium',
                'Gran maletero para su segmento',
                'Tracción quattro avanzada',
                'Interior de alta calidad',
                'Interior ultra premium'
            ],
            cons: [
                'Consumo elevado en ciudad',
                'Precio elevado',
                'Peso considerable'
            ]
        },
        comparison: {
            vsCompetitors: [
                { model: 'BMW M5 Competition', score: 8.5 },
                { model: 'Mercedes-AMG E63 S', score: 8.7 }
            ]
        },
        tools: {
            financing: {
                downPayment: 29000,
                monthlyPayment: 1850,
                term: 60
            },
            insurance: {
                annual: 1200
            },
            tax: {
                annual: 450,
                co2: 276,
                taxBand: 'tramo alto'
            },
            maintenance: {
                oilChange: 350,
                tyres: 1600,
                annualInsurance: 2500,
                timeline: [
                    { km: 20000, title: 'Revisión intermedia', desc: 'Cambio aceite + filtros + inspección frenos', audiOfficial: 650, independent: 420 },
                    { km: 40000, title: 'Gran servicio', desc: 'Aceite, filtros, bujías, líquido frenos, revisión suspensión neumática', audiOfficial: 1400, independent: 950 },
                    { km: 60000, title: 'Transmisión + diferencial', desc: 'Aceite caja Tiptronic, revisión turbos, embrague (inspección)', audiOfficial: 2100, independent: 1500 },
                    { km: 80000, title: 'Neumáticos + correas', desc: 'Juego neumáticos performance (~€1.600), correa distribución si aplica', total: 2800 },
                    { km: 100000, title: 'Revisión mayor V8', desc: 'Inspección turbos, suspensión neumática, actualización software MMI', audiOfficial: 3500 }
                ]
            },
            depreciation: {
                newPrice: 145000,
                year3: 98000,
                year5: 78000,
                loss3: 32,
                loss5: 46,
                insight: [
                    'La versión Performance pierde más rápido por precio inicial alto',
                    'Mejor momento para comprar ocasión: 3–4 años (depreciación ya absorbida)',
                    'El Carbon Edition mantiene mejor valor por exclusividad',
                    'Color negro/gris: mayor demanda en reventa en España'
                ]
            },
            annualCost: {
                fuel: 3168,
                insurance: 2570,
                maintenance: 4800,
                depreciation: 15600,
                total: 26138
            }
        }
    }
};
