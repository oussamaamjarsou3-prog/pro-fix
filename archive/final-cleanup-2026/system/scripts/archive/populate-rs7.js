const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/rs7-2026.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// 1. Update relatedModels
const existingIds = (data.relatedModels || []).map(m => m.carId);
const desired = [
    { carId: 'audi-rs6-2026', relation: 'same-brand' },
    { carId: 'audi-rs5-2026', relation: 'same-brand' },
    { carId: 'bmw-m5-2026', relation: 'competitor' },
    { carId: 'mercedes-amg-gt63-2026', relation: 'competitor' },
    { carId: 'porsche-panamera-turbo-2026', relation: 'competitor' }
];
data.relatedModels = desired;

// 2. Review
data.review = {
    summary: "El Audi RS7 es una berlina deportiva de altas prestaciones que combina el lujo de un gran turismo con la brutalidad de un superdeportivo. Su motor V8 biturbo de 591 CV ofrece una aceleración demoledora, mientras que el interior de cuero Valcona y la tecnología MMI crean un ambiente premium sin concesiones.",
    fullText: "El Audi RS7 representa la cúspide del rendimiento dentro de la gama A7. Bajo su capó descansa un V8 4.0 TFSI biturbo con 591 CV y 800 Nm de par, asociado a una transmisión automática Tiptronic de ocho velocidades y el sistema de tracción total Quattro. El resultado es una aceleración de 0 a 100 km/h en 3,1 segundos y una velocidad máxima de 305 km/h con el paquete Dynamic Plus.\n\nEn carretera, el RS7 se muestra sorprendentemente cómodo gracias a la suspensión neumática adaptativa y al sistema de dirección dinámica. Los modos de conducción permiten transformar el carácter del coche desde un GT relajado hasta un deportivo afilado. La calidad de construcción es impecable, con materiales nobles en cada superficie y una insonorización que silencia el exterior cuando se desea.\n\nLa tecnología a bordo es de última generación: pantalla táctil MMI con respuesta háptica, Virtual Cockpit digital de 12,3 pulgadas y sistema Bang & Olufsen Advanced de 19 altavoces. La conectividad incluye Apple CarPlay y Android Auto inalámbricos, además de carga inductiva para smartphone.\n\nComo inconvenientes, el consumo real en ciudad ronda los 15-18 L/100 km, los neumáticos traseros se desgastan rápidamente si se explota el potencial del coche, y el precio de partida supera los 140.000 €. Sin embargo, para quien busca una berlina que lo haga todo a nivel excelente, el RS7 es una opción difícil de superar.",
    verdict: "buy",
    bestFor: [
        "Conductores que buscan lujo y deportividad sin renunciar a la practicidad",
        "Entusiastas del sonido V8 que valoran la acústica en modos dinámicos",
        "Familias que necesitan espacio pero no quieren un SUV convencional",
        "Viajeros de larga distancia que aprecian el confort y la tecnología"
    ],
    scoreBreakdown: {
        performance: 9.8,
        comfort: 9.0,
        practicality: 8.5,
        runningCosts: 6.5,
        reliability: 8.8
    }
};

// 3. Driving Experience
data.drivingExperience = {
    handling: {
        summary: "El chasis del RS7 está firmemente plantado en el asfalto gracias al tren Quattro y al diferencial deportivo trasero opcional. La dirección progresiva permite maniobrar con precisión en curvas rápidas, aunque el peso de casi 2.100 kg se nota en cambios de apoyo muy bruscos.",
        steeringFeel: "Precisa y bien ponderada, con respuesta progresiva que se endurece en modo dinámico. No es tan comunicativa como la de un Porsche, pero transmite suficiente confianza.",
        bodyRoll: "Mínimo gracias a la suspensión neumática deportiva activa. En modo Comfort permite algo más de balanceo para absorber baches, mientras que en Dynamic el coche se mantiene completamente plano.",
        gripLevels: "Extraordinarios. El sistema Quattro distribuye el par de forma inteligente, permitiendo salidas de curva con el acelerador a fondo sin patinar. Los neumáticos 285/30 R22 ofrecen adherencia de sobra en seco.",
        rideQuality: "En Comfort es sorprendentemente suave para una berlina deportiva con llantas de 22 pulgadas. En Dynamic se vuelve firme y conectada, transmitiendo cada irregularidad del asfalto."
    },
    performanceFeel: {
        acceleration: "Brutal e inmediata. El par de 800 Nm está disponible desde las 2.050 rpm, propulsando al RS7 con una violencia controlada. El lanzamiento controlado permite 0-100 en 3,1 s de forma consistente.",
        braking: "Los discos de acero de 420 mm delanteros ofrecen una mordida potente y progresiva. Los opcionales cerámicos mejoran la resistencia a la fatiga en circuito, aunque son ruidosos en frío.",
        sound: "El V8 biturbo produce un murmullo grave en ralentí que se transforma en un rugido metálico al acelerar. Las válvulas de escape se abren en Dynamic para liberar una sinfonía de ocho cilindros.",
        transmission: "La Tiptronic de ocho velocidades cambia con suavidad en modo automático y con rapidez en modo manual. Las levas de aluminio tras el volante permiten control total."
    },
    dailyDriving: {
        comfort: "Excelente para trayectos largos. Los asientos deportivos con ajuste eléctrico, calefacción, ventilación y masaje eliminan la fatiga. La climatización de cuatro zonas mantiene la temperatura ideal.",
        visibility: "Buena hacia adelante, aunque el pilar C grueso dificulta la visión trasera tricuerpo. Los sensores de aparcamiento y la cámara 360° compensan ampliamente.",
        parking: "Manejable para sus dimensiones gracias a la dirección en las cuatro ruedas opcional. El giro de batalla se reduce significativamente. La cámara 3D facilita las maniobras en espacios estrechos.",
        motorway: "Donde mejor se siente el RS7. El control de crucero adaptativo mantiene la distancia de seguridad, el asistente de carril centra el vehículo y la potencia de sobra permite adelantamientos instantáneos."
    }
};

// 4. Exterior Design
data.exteriorDesign = {
    summary: "El Audi RS7 luce una silueta de cinco puertas fastback que equilibra elegancia y agresividad. La parrilla Singleframe negra con estructura en nido de abeja, las entradas de aire masivas y los faldones laterales ensanchados dejan claro que no es un A7 convencional.",
    stylingNotes: [
        "Capó con nervios que albergan el V8 biturbo",
        "Paragolpes delantero con tomas de aire de alto flujo",
        "Arcos de rueda ensanchados 40 mm respecto al A7",
        "Difusor trasero integrado con escape oval RS de doble salida",
        "Alerón activo trasero que se despliega a 100 km/h",
        "Ópticas Matrix LED con firma lumínica secuencial"
    ],
    dimensionsContext: "Con 5.009 mm de largo y 1.950 mm de ancho con retrovisores, el RS7 es una berlina imponente. Su altura de 1.424 mm le confiere una postura baja y atlética, mientras que la batalla de 2.930 mm garantiza espacio interior.",
    aerodynamics: {
        dragCoefficient: 0.30,
        activeAero: true
    },
    lighting: {
        headlights: "Matrix LED HD con láser opcional. Iluminación adaptativa que evita deslumbrar a vehículos de frente mientras mantiene la luz de carretera activa permanentemente.",
        taillights: "LED continuas con animación de llegada y salida. El gráfico lumínico es exclusivo de la gama RS.",
        signature: "Secuencia dinámica de encendido tanto en faros como en pilotos. La firma de luz diurna presenta doble línea horizontal con efecto tridimensional."
    },
    wheels: {
        standard: "Llantas de aleación de 21 pulgadas en diseño de 10 radios en V, acabado antracita diamantado",
        optional: [
            "22 pulgadas en diseño de 5 radios dobles, acabado negro mate",
            "22 pulgadas en diseño de 5 radios en Y, acabado titanio antracita"
        ]
    },
    colors: [
        { name: "Negro Mythos", hex: "#0a0a0a", type: "metallic", priceExtra: 0 },
        { name: "Blanco Ibis", hex: "#f0f0f0", type: "solid", priceExtra: 0 },
        { name: "Gris Daytona", hex: "#4a4a4a", type: "metallic", priceExtra: 1200 },
        { name: "Azul Ascari", hex: "#001a4d", type: "metallic", priceExtra: 1200 },
        { name: "Rojo Tango", hex: "#8b0000", type: "metallic", priceExtra: 1200 },
        { name: "Verde Sonoma", hex: "#2f4f4f", type: "pearl", priceExtra: 2500 }
    ]
};

// 5. Interior
data.interior = {
    qualityRating: 9.5,
    spaceRating: 8.5,
    infotainmentRating: 9.5,
    summary: "El interior del RS7 es un santuario de lujo tecnológico. El cuero Valcona con costuras en rombo contrastante, los insertos de carbono o aluminio cepillado y la iluminación ambiental multicolor crean una atmósfera envolvente.",
    frontSeats: {
        comfort: "Asientos deportivos RS con refuerzo lateral generoso, ajuste eléctrico de 22 vías, función memoria, calefacción, ventilación y masaje lumbar.",
        adjustment: "22 direcciones incluyendo extensión del muslo, ajuste de la inclinación del respaldo y sujeción lumbar neumática de 4 vías.",
        material: "Cuero Valcona perforado con costuras en rombo y logotipo RS en los reposacabezas."
    },
    rearSeats: {
        legroom: "Generoso para dos adultos. La batalla de 2.930 mm permite estirar las piernas cómodamente. La plaza central es usable para trayectos cortos.",
        headroom: "Adecuado gracias al techo abatido, aunque personas de más de 1,85 m notarán el techo en plazas traseras.",
        comfort: "Respaldos abatibles 40:20:40 con reposabrazos central, portavasillas y control de climatización independiente.",
        seatsDown: true
    },
    boot: {
        capacity: 535,
        seatsDownCapacity: 1390,
        practicality: "El portón liftback ofrece una boca de carga enorme. La capacidad de 535 litros crece hasta 1.390 litros con los asientos abatidos, superando a muchos SUV compactos.",
        loadingLip: "Umbral de carga bajo y ancho. El portón eléctrico con apertura a pie opcional facilita la carga cuando se llevan objetos en las manos."
    },
    infotainment: {
        screenSize: "10,1 pulgadas superior + 8,6 pulgadas inferior",
        system: "MMI touch response con navegación natural por voz y respuesta háptica",
        connectivity: ["Apple CarPlay inalámbrico", "Android Auto inalámbrico", "Audi connect con Wi-Fi hotspot", "Bluetooth 5.0", "Dos puertos USB-C"],
        soundSystem: "Bang & Olufsen Advanced Sound System de 19 altavoces y 755 W",
        digitalCluster: true
    },
    cards: [
        { id: "interior-quality", icon: "seat", category: "materials" },
        { id: "infotainment", icon: "screen", category: "technology" },
        { id: "sound-system", icon: "sound", category: "audio" },
        { id: "ambient-lighting", icon: "light", category: "comfort" }
    ]
};

// 6. Technology
data.technology = {
    headUnit: {
        screenSize: "10,1\" + 8,6\"",
        resolution: "1540 x 720 px (superior) / 1280 x 660 px (inferior)",
        system: "MMI touch response con procesador NVIDIA Tegra",
        processor: "NVIDIA Tegra X1",
        wirelessCarPlay: true,
        wirelessAndroidAuto: true,
        voiceControl: "Audi natural voice control con procesamiento en la nube"
    },
    connectivity: ["5G", "Wi-Fi hotspot", "Audi connect", "myAudi app"],
    audio: {
        system: "Bang & Olufsen Advanced",
        speakers: 19,
        watts: 755
    },
    driverDisplays: {
        instrumentCluster: "Virtual Cockpit Plus de 12,3 pulgadas con gráficos RS exclusivos",
        headUpDisplay: true,
        augmentedRealityNav: true
    },
    appIntegration: ["myAudi", "Spotify", "Amazon Music", "Apple Music", "Google Earth"]
};

// 7. Safety — replace old structure with new renderer-compatible format
data.safety = {
    ratings: {
        overall: 5,
        adultOccupant: 93,
        childOccupant: 85,
        pedestrian: 72,
        safetyAssist: 81
    },
    airbags: ["Conductor", "Pasajero", "Laterales delanteros", "Laterales traseros", "De cortina frontales y traseras", "De rodilla para conductor"],
    driverAssist: [
        "Adaptive cruise control con Stop & Go",
        "Audi pre sense front con detección de peatones y ciclistas",
        "Audi pre sense rear",
        "Lane keep assist",
        "Lane departure warning",
        "Traffic jam assist",
        "Intersection assist",
        "Exit warning",
        "Cross-traffic assist rear",
        "Night vision assistant con detección de peatones",
        "Top view camera system (360°)",
        "Head-up display",
        "Parking assist plus con visualización 3D"
    ],
    structural: "Carrocería multimaterial con acero de ultra alta resistencia, aluminio en capó, puertas y portón, y refuerzos estructurales en los umbrales y pilares B."
};

// 8. Running Costs
data.runningCosts = {
    insuranceGroups: {
        spain: "Grupo 20 (máximo)",
        uk: "Grupo 50",
        germany: "TK25"
    },
    roadTax: {
        spain: "Aproximadamente 650 €/año en función de la comunidad autónoma",
        uk: "£2.365 primer año, £600 siguientes años"
    },
    servicing: {
        intervalKm: 15000,
        intervalMonths: 12,
        costMinor: { value: 850, currency: "EUR" },
        costMajor: { value: 2200, currency: "EUR" }
    },
    tyres: {
        front: {
            size: "285/30 R22",
            costPerTyre: { value: 450, currency: "EUR" }
        },
        rear: {
            size: "285/30 R22",
            costPerTyre: { value: 450, currency: "EUR" }
        }
    },
    fuel: {
        type: "Gasolina 98 RON",
        tankCapacity: { value: 73, unit: "L" },
        realWorldCombined: { value: 13.5, unit: "L/100km" }
    },
    warranty: {
        years: 2,
        km: 0,
        powertrain: {
            years: 5,
            km: 150000
        }
    }
};

// 9. Ownership
data.ownership = {
    ownerReviews: [
        {
            quote: "Llevo 40.000 km con mi RS7 y sigue emocionándome cada vez que arranco. El consumo es alto, pero la sonrisa que me saca vale cada céntimo.",
            author: "Marcus T.",
            location: "Munich, Alemania",
            ownsSince: "2024",
            rating: 9.5
        },
        {
            quote: "Lo utilizo para viajes de negocios y escapadas de fin de semana. En modo Comfort es tan silencioso como un A8, pero presionas el botón RS y se transforma.",
            author: "Sophie L.",
            location: "Lyon, Francia",
            ownsSince: "2025",
            rating: 9.0
        }
    ],
    commonIssues: [
        {
            issue: "Desgaste prematuro de neumáticos traseros debido al alto par y tracción Quattro",
            frequency: "common",
            cost: "1.800 € cada 15.000-20.000 km"
        },
        {
            issue: "Ruido de la suspensión neumática en frío durante los primeros segundos",
            frequency: "occasional",
            cost: "Normalmente resuelto con lubricación, ~150 €"
        },
        {
            issue: "Problemas menores con el sistema MMI tras actualizaciones de software",
            frequency: "occasional",
            cost: "Resuelto por garantía o actualización OTA"
        }
    ],
    satisfactionRating: 9.2
};

fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
console.log('RS7 data updated successfully');
