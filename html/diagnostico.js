// =========================================================
// DIAGNOSTICO.JS — Diagnóstico Inteligente
// =========================================================

(function() {

// Translations
const diagTranslations = {
    es: {
        heroTitle: 'Diagnóstico <span class="accent">Inteligente</span>',
        heroSubtitle: 'Descubre posibles averías de tu vehículo respondiendo unas preguntas simples.',
        startButton: 'Comenzar diagnóstico',
        disclaimer: '⚠️ Este diagnóstico es estimativo y no sustituye un examen profesional. Consulta a un mecánico certificado.',
        selectCategory: 'Selecciona una categoría',
        selectCategoryDesc: 'Elige el sistema que presenta problemas',
        vehicleTypeAll: 'Todos los vehículos',
        vehicleTypeTraditional: 'Vehículo tradicional (gasolina/diésel)',
        vehicleTypeHybrid: 'Híbrido',
        vehicleTypeElectric: 'Eléctrico 100%',
        viewHistory: 'Ver historial',
        historyTitle: 'Historial de Diagnósticos',
        historyDesc: 'Tus diagnósticos anteriores',
        close: 'Cerrar',
        noHistory: 'No hay diagnósticos guardados',
        resultTitle: 'Resultado del Diagnóstico',
        newDiagnosis: 'Nuevo diagnóstico',
        sendEmail: '📧 Enviar por email',
        contactWorkshop: 'Contactar taller',
        back: '← Volver',
        next: 'Siguiente',
        problemLabel: 'Problema probable:',
        severityLabel: 'Nivel:',
        costLabel: 'Coste estimado:',
        descriptionLabel: 'Descripción:',
        recommendationLabel: 'Recomendación:',
        severityLow: 'Bajo',
        severityModerate: 'Moderado',
        severityHigh: 'Alto',
        disclaimer: '⚠️ Este diagnóstico es estimativo y no sustituye un examen profesional. Consulta a un mecánico certificado.',
        dontKnow: 'No lo sé',
        // Category titles and descriptions
        motorTitle: 'Motor',
        motorDesc: 'Problemas de encendido, potencia o ruidos',
        bateriaTitle: 'Batería',
        bateriaDesc: 'Fallo de carga, arranque o alternador',
        frenosTitle: 'Frenos',
        frenosDesc: 'Pastillas, discos o fluido de frenos',
        transmisionTitle: 'Transmisión',
        transmisionDesc: 'Embrague, cambios o caja de cambios',
        suspensionTitle: 'Suspensión',
        suspensionDesc: 'Amortiguadores, ruedas o dirección',
        refrigeracionTitle: 'Refrigeración',
        refrigeracionDesc: 'Sobrecalentamiento, termostato o bomba',
        electricidadTitle: 'Electricidad',
        electricidadDesc: 'Fusibles, luces o sistema eléctrico',
        escapeTitle: 'Escape',
        escapeDesc: 'Silenciador, catalizador o tubos',
        direccionTitle: 'Dirección',
        direccionDesc: 'Dirección asistida, alineación o volante',
        aireTitle: 'Aire Acondicionado',
        aireDesc: 'Climatización, refrigeración o filtros',
        neumaticosTitle: 'Neumáticos',
        neumaticosDesc: 'Desgaste, presión o alineación',
        aceiteTitle: 'Aceite',
        aceiteDesc: 'Nivel, calidad o fugas',
        encendidoTitle: 'Encendido',
        encendidoDesc: 'Bujías, bobinas o cables',
        inyeccionTitle: 'Inyección',
        inyeccionDesc: 'Inyectores, bomba o filtro',
        // New EV/Hybrid categories
        bateriaTraccionTitle: 'Batería de Tracción',
        bateriaTraccionDesc: 'Problemas de la batería de alta tensión, degradación de celdas',
        sistemaCargaTitle: 'Sistema de Carga',
        sistemaCargaDesc: 'Puerto de carga, cargador a bordo, cable de carga',
        motorElectricoTitle: 'Motor Eléctrico',
        motorElectricoDesc: 'Problemas del motor eléctrico, bobinado, rodamientos',
        inversorTitle: 'Inversor',
        inversorDesc: 'Convertidor DC-AC, fallos de IGBT/MOSFET',
        frenadoRegenerativoTitle: 'Frenado Regenerativo',
        frenadoRegenerativoDesc: 'Sistema de frenado regenerativo, recuperación de energía',
        gestionTermicaTitle: 'Gestión Térmica de Batería',
        gestionTermicaDesc: 'Sistema de refrigeración de la batería, bomba, termostato',
        convertidorDCTitle: 'Convertidor DC-DC',
        convertidorDCDesc: 'Convertidor de alta tensión a 12V, estabilidad de voltaje',
        sistemaGestionBateriaTitle: 'Sistema de Gestión de Batería',
        sistemaGestionBateriaDesc: 'BMS, equilibrio de celdas, estado de salud',
        cableadoAltaTensionTitle: 'Cableado de Alta Tensión',
        cableadoAltaTensionDesc: 'Cables naranjas de alta tensión, aislamiento, conectores',
        electronicaPotenciaTitle: 'Electrónica de Potencia',
        electronicaPotenciaDesc: 'Módulos de control de potencia, fallos de software'
    },
    en: {
        heroTitle: 'Smart <span class="accent">Diagnostic</span>',
        heroSubtitle: 'Discover possible vehicle issues by answering simple questions.',
        startButton: 'Start diagnostic',
        disclaimer: '⚠️ This diagnosis is estimated and does not replace a professional examination. Consult a certified mechanic.',
        selectCategory: 'Select a category',
        selectCategoryDesc: 'Choose the system with problems',
        vehicleTypeAll: 'All vehicles',
        vehicleTypeTraditional: 'Traditional vehicle (gasoline/diesel)',
        vehicleTypeHybrid: 'Hybrid',
        vehicleTypeElectric: 'Electric 100%',
        viewHistory: 'View history',
        historyTitle: 'Diagnosis History',
        historyDesc: 'Your previous diagnoses',
        close: 'Close',
        noHistory: 'No saved diagnoses',
        resultTitle: 'Diagnosis Result',
        newDiagnosis: 'New diagnosis',
        sendEmail: '📧 Send by email',
        contactWorkshop: 'Contact workshop',
        back: '← Back',
        next: 'Next',
        problemLabel: 'Probable problem:',
        severityLabel: 'Level:',
        costLabel: 'Estimated cost:',
        descriptionLabel: 'Description:',
        recommendationLabel: 'Recommendation:',
        severityLow: 'Low',
        severityModerate: 'Moderate',
        severityHigh: 'High',
        disclaimer: '⚠️ This diagnosis is estimated and does not replace a professional examination. Consult a certified mechanic.',
        dontKnow: "I don't know",
        // Category titles and descriptions
        motorTitle: 'Engine',
        motorDesc: 'Ignition, power or noise problems',
        bateriaTitle: 'Battery',
        bateriaDesc: 'Charging, starting or alternator issues',
        frenosTitle: 'Brakes',
        frenosDesc: 'Pads, discs or brake fluid',
        transmisionTitle: 'Transmission',
        transmisionDesc: 'Clutch, shifts or gearbox',
        suspensionTitle: 'Suspension',
        suspensionDesc: 'Shock absorbers, wheels or steering',
        refrigeracionTitle: 'Cooling',
        refrigeracionDesc: 'Overheating, thermostat or pump',
        electricidadTitle: 'Electricity',
        electricidadDesc: 'Fuses, lights or electrical system',
        escapeTitle: 'Exhaust',
        escapeDesc: 'Muffler, catalytic converter or pipes',
        direccionTitle: 'Steering',
        direccionDesc: 'Power steering, alignment or wheel',
        aireTitle: 'Air Conditioning',
        aireDesc: 'Climate control, cooling or filters',
        neumaticosTitle: 'Tires',
        neumaticosDesc: 'Wear, pressure or alignment',
        aceiteTitle: 'Oil',
        aceiteDesc: 'Level, quality or leaks',
        encendidoTitle: 'Ignition',
        encendidoDesc: 'Spark plugs, coils or cables',
        inyeccionTitle: 'Injection',
        inyeccionDesc: 'Injectors, pump or filter',
        // New EV/Hybrid categories
        bateriaTraccionTitle: 'Traction Battery',
        bateriaTraccionDesc: 'High voltage battery problems, cell degradation',
        sistemaCargaTitle: 'Charging System',
        sistemaCargaDesc: 'Charging port, onboard charger, charging cable',
        motorElectricoTitle: 'Electric Motor',
        motorElectricoDesc: 'Electric motor problems, winding, bearings',
        inversorTitle: 'Inverter',
        inversorDesc: 'DC-AC converter, IGBT/MOSFET failures',
        frenadoRegenerativoTitle: 'Regenerative Braking',
        frenadoRegenerativoDesc: 'Regenerative braking system, energy recovery',
        gestionTermicaTitle: 'Battery Thermal Management',
        gestionTermicaDesc: 'Battery cooling system, pump, thermostat',
        convertidorDCTitle: 'DC-DC Converter',
        convertidorDCDesc: 'High voltage to 12V converter, voltage stability',
        sistemaGestionBateriaTitle: 'Battery Management System',
        sistemaGestionBateriaDesc: 'BMS, cell balancing, state of health',
        cableadoAltaTensionTitle: 'High Voltage Wiring',
        cableadoAltaTensionDesc: 'Orange high voltage cables, insulation, connectors',
        electronicaPotenciaTitle: 'Power Electronics',
        electronicaPotenciaDesc: 'Power control modules, software failures'
    },
    fr: {
        heroTitle: 'Diagnostic <span class="accent">Intelligent</span>',
        heroSubtitle: 'Découvrez les pannes possibles de votre véhicule en répondant à des questions simples.',
        startButton: 'Commencer le diagnostic',
        disclaimer: '⚠️ Ce diagnostic est estimatif et ne remplace pas un examen professionnel. Consultez un mécanicien certifié.',
        selectCategory: 'Sélectionnez une catégorie',
        selectCategoryDesc: 'Choisissez le système avec des problèmes',
        vehicleTypeAll: 'Tous les véhicules',
        vehicleTypeTraditional: 'Véhicule traditionnel (essence/diesel)',
        vehicleTypeHybrid: 'Hybride',
        vehicleTypeElectric: 'Électrique 100%',
        viewHistory: 'Voir l\'historique',
        historyTitle: 'Historique des Diagnostics',
        historyDesc: 'Vos diagnostics précédents',
        close: 'Fermer',
        noHistory: 'Aucun diagnostic enregistré',
        resultTitle: 'Résultat du Diagnostic',
        newDiagnosis: 'Nouveau diagnostic',
        sendEmail: '📧 Envoyer par email',
        contactWorkshop: 'Contacter l\'atelier',
        back: '← Retour',
        next: 'Suivant',
        problemLabel: 'Problème probable:',
        severityLabel: 'Niveau:',
        costLabel: 'Coût estimé:',
        descriptionLabel: 'Description:',
        recommendationLabel: 'Recommandation:',
        severityLow: 'Faible',
        severityModerate: 'Modéré',
        severityHigh: 'Élevé',
        disclaimer: '⚠️ Ce diagnostic est estimé et ne remplace pas un examen professionnel. Consultez un mécanicien certifié.',
        dontKnow: 'Je ne sais pas',
        // Category titles and descriptions
        motorTitle: 'Moteur',
        motorDesc: 'Problèmes d\'allumage, puissance ou bruits',
        bateriaTitle: 'Batterie',
        bateriaDesc: 'Défaillance de charge, démarrage ou alternateur',
        frenosTitle: 'Freins',
        frenosDesc: 'Plaquettes, disques ou liquide de frein',
        transmisionTitle: 'Transmission',
        transmisionDesc: 'Embrayage, vitesses ou boîte de vitesses',
        suspensionTitle: 'Suspension',
        suspensionDesc: 'Amortisseurs, roues ou direction',
        refrigeracionTitle: 'Refroidissement',
        refrigeracionDesc: 'Surchauffe, thermostat ou pompe',
        electricidadTitle: 'Électricité',
        electricidadDesc: 'Fusibles, lumières ou système électrique',
        escapeTitle: 'Échappement',
        escapeDesc: 'Pot catalytique, silencieux ou tuyaux',
        direccionTitle: 'Direction',
        direccionDesc: 'Direction assistée, alignement ou volant',
        aireTitle: 'Climatisation',
        aireDesc: 'Climatisation, refroidissement ou filtres',
        neumaticosTitle: 'Pneus',
        neumaticosDesc: 'Usure, pression ou alignement',
        aceiteTitle: 'Huile',
        aceiteDesc: 'Niveau, qualité ou fuites',
        encendidoTitle: 'Allumage',
        encendidoDesc: 'Bougies, bobines ou câbles',
        inyeccionTitle: 'Injection',
        inyeccionDesc: 'Injecteurs, pompe ou filtre',
        // New EV/Hybrid categories
        bateriaTraccionTitle: 'Batterie de Traction',
        bateriaTraccionDesc: 'Problèmes de batterie haute tension, dégradation des cellules',
        sistemaCargaTitle: 'Système de Charge',
        sistemaCargaDesc: 'Prise de charge, chargeur embarqué, câble de charge',
        motorElectricoTitle: 'Moteur Électrique',
        motorElectricoDesc: 'Problèmes du moteur électrique, enroulements, roulements',
        inversorTitle: 'Onduleur',
        inversorDesc: 'Convertisseur DC-AC, défaillances IGBT/MOSFET',
        frenadoRegenerativoTitle: 'Freinage Régénératif',
        frenadoRegenerativoDesc: 'Système de freinage régénératif, récupération d\'énergie',
        gestionTermicaTitle: 'Gestion Thermique de la Batterie',
        gestionTermicaDesc: 'Système de refroidissement de la batterie, pompe, thermostat',
        convertidorDCTitle: 'Convertisseur DC-DC',
        convertidorDCDesc: 'Convertisseur haute tension vers 12V, stabilité de tension',
        sistemaGestionBateriaTitle: 'Système de Gestion de Batterie',
        sistemaGestionBateriaDesc: 'BMS, équilibrage des cellules, état de santé',
        cableadoAltaTensionTitle: 'Câblage Haute Tension',
        cableadoAltaTensionDesc: 'Câbles orange haute tension, isolation, connecteurs',
        electronicaPotenciaTitle: 'Électronique de Puissance',
        electronicaPotenciaDesc: 'Modules de contrôle de puissance, défaillances logicielles'
    },
    ar: {
        heroTitle: 'تشخيص <span class="accent">ذكي</span>',
        heroSubtitle: 'اكتشف الأعطال المحتملة لسيارتك من خلال الإجابة على أسئلة بسيطة.',
        startButton: 'بدء التشخيص',
        disclaimer: '⚠️ هذا التشخيص تقديري ولا يحل محل الفحص المهني. استشر ميكانيكي معتمد.',
        selectCategory: 'اختر فئة',
        selectCategoryDesc: 'اختر النظام الذي يعاني من مشاكل',
        vehicleTypeAll: 'جميع المركبات',
        vehicleTypeTraditional: 'مركبة تقليدية (بنزين/ديزل)',
        vehicleTypeHybrid: 'هجينة',
        vehicleTypeElectric: 'كهربائية 100%',
        viewHistory: 'عرض السجل',
        historyTitle: 'سجل التشخيصات',
        historyDesc: 'تشخيصاتك السابقة',
        close: 'إغلاق',
        noHistory: 'لا توجد تشخيصات محفوظة',
        resultTitle: 'نتيجة التشخيص',
        newDiagnosis: 'تشخيص جديد',
        sendEmail: '📧 إرسال بالبريد',
        contactWorkshop: 'اتصل بالورشة',
        back: '← رجوع',
        next: 'التالي',
        problemLabel: 'المشكلة المحتملة:',
        severityLabel: 'المستوى:',
        costLabel: 'التكلفة المقدرة:',
        descriptionLabel: 'الوصف:',
        recommendationLabel: 'التوصية:',
        severityLow: 'منخفض',
        severityModerate: 'متوسط',
        severityHigh: 'عالي',
        disclaimer: '⚠️ هذا التشخيص تقديري ولا يغني عن الفحص المهني. استشر ميكانيكي معتمد.',
        dontKnow: 'لا أعرف',
        // Category titles and descriptions
        motorTitle: 'المحرك',
        motorDesc: 'مشاكل الإشعال، القوة أو الأصوات',
        bateriaTitle: 'البطارية',
        bateriaDesc: 'فشل الشحن، التشغيل أو المولد',
        frenosTitle: 'الفرامل',
        frenosDesc: 'الوسائد، الأقراص أو سائل الفرامل',
        transmisionTitle: 'ناقل الحركة',
        transmisionDesc: 'القابض، السرعات أو صندوق السرعات',
        suspensionTitle: 'نظام التعليق',
        suspensionDesc: 'ممتصات الصدمات، العجلات أو التوجيه',
        refrigeracionTitle: 'التبريد',
        refrigeracionDesc: 'السخونة المفرطة، منظم الحرارة أو المضخة',
        electricidadTitle: 'الكهرباء',
        electricidadDesc: 'الصمامات، الأضواء أو النظام الكهربائي',
        escapeTitle: 'العادم',
        escapeDesc: 'الصامت، المحفز أو الأنابيب',
        direccionTitle: 'التوجيه',
        direccionDesc: 'التوجيه المساعد، المحاذاة أو عجلة القيادة',
        aireTitle: 'مكيف الهواء',
        aireDesc: 'التحكم في المناخ، التبريد أو الفلاتر',
        neumaticosTitle: 'الإطارات',
        neumaticosDesc: 'التآكل، الضغط أو المحاذاة',
        aceiteTitle: 'الزيت',
        aceiteDesc: 'المستوى، الجودة أو التسربات',
        encendidoTitle: 'الإشعال',
        encendidoDesc: 'الشموع، الملفات أو الكابلات',
        inyeccionTitle: 'الحقن',
        inyeccionDesc: 'الحقن، المضخة أو الفلتر',
        // New EV/Hybrid categories
        bateriaTraccionTitle: 'بطارية الدفع',
        bateriaTraccionDesc: 'مشاكل بطارية الجهد العالي، تدهور الخلايا',
        sistemaCargaTitle: 'نظام الشحن',
        sistemaCargaDesc: 'مقبس الشحن، الشاحن المدمج، كابل الشحن',
        motorElectricoTitle: 'المحرك الكهربائي',
        motorElectricoDesc: 'مشاكل المحرك الكهربائي، الملفات، المحامل',
        inversorTitle: 'العاكس',
        inversorDesc: 'محوّل DC-AC، أعطال IGBT/MOSFET',
        frenadoRegenerativoTitle: 'الفرامل المُجددة',
        frenadoRegenerativoDesc: 'نظام الفرامل المُجددة، استعادة الطاقة',
        gestionTermicaTitle: 'الإدارة الحرارية للبطارية',
        gestionTermicaDesc: 'نظام تبريد البطارية، مضخة، منظم حرارة',
        convertidorDCTitle: 'محوّل DC-DC',
        convertidorDCDesc: 'محوّل الجهد العالي إلى 12V، استقرار الجهد',
        sistemaGestionBateriaTitle: 'نظام إدارة البطارية',
        sistemaGestionBateriaDesc: 'BMS، موازنة الخلايا، حالة الصحة',
        cableadoAltaTensionTitle: 'توصيلات الجهد العالي',
        cableadoAltaTensionDesc: 'كابلات الجهد العالي البرتقالية، العزل، الموصلات',
        electronicaPotenciaTitle: 'إلكترونيات الطاقة',
        electronicaPotenciaDesc: 'وحدات التحكم في الطاقة، أعطال البرمجيات'
    }
};

// Current language
let diagCurrentLang = 'es';

// Database of common car problems with diagTranslations
const diagnosisDatabase = {
    motor: {
        questions: {
            es: [
                {
                    id: 'check_engine',
                    text: '¿Se enciende la luz Check Engine?',
                    options: ['Sí', 'No']
                },
                {
                    id: 'power_loss',
                    text: '¿El coche pierde potencia?',
                    options: ['Sí', 'No']
                },
                {
                    id: 'strange_noises',
                    text: '¿Escuchas ruidos extraños?',
                    options: ['Sí', 'No']
                },
                {
                    id: 'smoke',
                    text: '¿Hay humo excesivo?',
                    options: ['Blanco', 'Negro', 'Azul', 'Ninguno']
                }
            ],
            en: [
                {
                    id: 'check_engine',
                    text: 'Does the Check Engine light turn on?',
                    options: ['Yes', 'No']
                },
                {
                    id: 'power_loss',
                    text: 'Does the car lose power?',
                    options: ['Yes', 'No']
                },
                {
                    id: 'strange_noises',
                    text: 'Do you hear strange noises?',
                    options: ['Yes', 'No']
                },
                {
                    id: 'smoke',
                    text: 'Is there excessive smoke?',
                    options: ['White', 'Black', 'Blue', 'None']
                }
            ],
            fr: [
                {
                    id: 'check_engine',
                    text: 'Le voyant Check Engine s\'allume-t-il?',
                    options: ['Oui', 'Non']
                },
                {
                    id: 'power_loss',
                    text: 'La voiture perd-elle de la puissance?',
                    options: ['Oui', 'Non']
                },
                {
                    id: 'strange_noises',
                    text: 'Entendez-vous des bruits étranges?',
                    options: ['Oui', 'Non']
                },
                {
                    id: 'smoke',
                    text: 'Y a-t-il de la fumée excessive?',
                    options: ['Blanche', 'Noire', 'Bleue', 'Aucune']
                }
            ],
            ar: [
                {
                    id: 'check_engine',
                    text: 'هل يضيء ضوء Check Engine؟',
                    options: ['نعم', 'لا']
                },
                {
                    id: 'power_loss',
                    text: 'هل تفقد السيارة القوة؟',
                    options: ['نعم', 'لا']
                },
                {
                    id: 'strange_noises',
                    text: 'هل تسمع أصوات غريبة؟',
                    options: ['نعم', 'لا']
                },
                {
                    id: 'smoke',
                    text: 'هل هناك دخان مفرط؟',
                    options: ['أبيض', 'أسود', 'أزرق', 'لا شيء']
                }
            ]
        },
        results: {
            es: [
                {
                    conditions: { check_engine: 'Sí', power_loss: 'Sí', smoke: 'Ninguno' },
                    problem: 'Bujías desgastadas',
                    severity: 'moderate',
                    cost: '80€ - 250€',
                    description: 'Las bujías pueden provocar pérdida de potencia y dificultades de arranque.',
                    recommendation: 'Realizar una inspección mecánica lo antes posible.'
                },
                {
                    conditions: { check_engine: 'Sí', power_loss: 'Sí', smoke: 'Negro' },
                    problem: 'Filtro de aire obstruido',
                    severity: 'low',
                    cost: '30€ - 80€',
                    description: 'Un filtro de aire sucio reduce el flujo de aire al motor.',
                    recommendation: 'Reemplazar el filtro de aire según las recomendaciones del fabricante.'
                },
                {
                    conditions: { check_engine: 'Sí', power_loss: 'Sí', smoke: 'Azul' },
                    problem: 'Consumo excesivo de aceite',
                    severity: 'moderate',
                    cost: '150€ - 400€',
                    description: 'El humo azul indica que el motor está quemando aceite.',
                    recommendation: 'Revisar los sellos de válvulas y anillos de pistón.'
                },
                {
                    conditions: { check_engine: 'Sí', power_loss: 'No', strange_noises: 'Sí' },
                    problem: 'Bobinas de encendido defectuosas',
                    severity: 'moderate',
                    cost: '120€ - 300€',
                    description: 'Las bobinas defectuosas causan fallos de encendido y ruidos.',
                    recommendation: 'Reemplazar las bobinas afectadas.'
                },
                {
                    conditions: { check_engine: 'Sí', power_loss: 'No', strange_noises: 'No' },
                    problem: 'Sensor de oxígeno defectuoso',
                    severity: 'low',
                    cost: '100€ - 200€',
                    description: 'El sensor O2 afecta la mezcla aire-combustible.',
                    recommendation: 'Reemplazar el sensor de oxígeno.'
                },
                {
                    conditions: { check_engine: 'No', power_loss: 'Sí', strange_noises: 'Sí' },
                    problem: 'Bomba de combustible defectuosa',
                    severity: 'high',
                    cost: '200€ - 500€',
                    description: 'La bomba de combustible no suministra suficiente presión.',
                    recommendation: 'Reemplazar la bomba de combustible inmediatamente.'
                },
                {
                    conditions: { check_engine: 'No', power_loss: 'No', strange_noises: 'Sí' },
                    problem: 'Correa de distribución desgastada',
                    severity: 'high',
                    cost: '150€ - 400€',
                    description: 'Una correa desgastada puede causar daños graves al motor.',
                    recommendation: 'Reemplazar la correa de distribución urgentemente.'
                },
                {
                    conditions: { check_engine: 'No', power_loss: 'No', strange_noises: 'No' },
                    problem: 'Mantenimiento preventivo recomendado',
                    severity: 'low',
                    cost: '50€ - 100€',
                    description: 'No se detectaron problemas evidentes, pero se recomienda revisión.',
                    recommendation: 'Realizar mantenimiento preventivo según el manual del fabricante.'
                }
            ],
            en: [
                {
                    conditions: { check_engine: 'Yes', power_loss: 'Yes', smoke: 'None' },
                    problem: 'Worn spark plugs',
                    severity: 'moderate',
                    cost: '80€ - 250€',
                    description: 'Worn spark plugs can cause power loss and starting difficulties.',
                    recommendation: 'Perform a mechanical inspection as soon as possible.'
                },
                {
                    conditions: { check_engine: 'Yes', power_loss: 'Yes', smoke: 'Black' },
                    problem: 'Clogged air filter',
                    severity: 'low',
                    cost: '30€ - 80€',
                    description: 'A dirty air filter reduces airflow to the engine.',
                    recommendation: 'Replace the air filter according to manufacturer recommendations.'
                },
                {
                    conditions: { check_engine: 'Yes', power_loss: 'Yes', smoke: 'Blue' },
                    problem: 'Excessive oil consumption',
                    severity: 'moderate',
                    cost: '150€ - 400€',
                    description: 'Blue smoke indicates the engine is burning oil.',
                    recommendation: 'Check valve seals and piston rings.'
                },
                {
                    conditions: { check_engine: 'Yes', power_loss: 'No', strange_noises: 'Yes' },
                    problem: 'Faulty ignition coils',
                    severity: 'moderate',
                    cost: '120€ - 300€',
                    description: 'Faulty coils cause misfires and noises.',
                    recommendation: 'Replace the affected coils.'
                },
                {
                    conditions: { check_engine: 'Yes', power_loss: 'No', strange_noises: 'No' },
                    problem: 'Faulty oxygen sensor',
                    severity: 'low',
                    cost: '100€ - 200€',
                    description: 'The O2 sensor affects the air-fuel mixture.',
                    recommendation: 'Replace the oxygen sensor.'
                },
                {
                    conditions: { check_engine: 'No', power_loss: 'Yes', strange_noises: 'Yes' },
                    problem: 'Faulty fuel pump',
                    severity: 'high',
                    cost: '200€ - 500€',
                    description: 'The fuel pump is not supplying enough pressure.',
                    recommendation: 'Replace the fuel pump immediately.'
                },
                {
                    conditions: { check_engine: 'No', power_loss: 'No', strange_noises: 'Yes' },
                    problem: 'Worn timing belt',
                    severity: 'high',
                    cost: '150€ - 400€',
                    description: 'A worn timing belt can cause serious engine damage.',
                    recommendation: 'Replace the timing belt urgently.'
                },
                {
                    conditions: { check_engine: 'No', power_loss: 'No', strange_noises: 'No' },
                    problem: 'Preventive maintenance recommended',
                    severity: 'low',
                    cost: '50€ - 100€',
                    description: 'No evident problems detected, but inspection is recommended.',
                    recommendation: 'Perform preventive maintenance according to the manufacturer manual.'
                }
            ],
            fr: [
                {
                    conditions: { check_engine: 'Oui', power_loss: 'Oui', smoke: 'Aucune' },
                    problem: 'Bougies usées',
                    severity: 'moderate',
                    cost: '80€ - 250€',
                    description: 'Les bougies usées peuvent causer une perte de puissance et des difficultés de démarrage.',
                    recommendation: 'Effectuer une inspection mécanique dès que possible.'
                },
                {
                    conditions: { check_engine: 'Oui', power_loss: 'Oui', smoke: 'Noire' },
                    problem: 'Filtre à air obstrué',
                    severity: 'low',
                    cost: '30€ - 80€',
                    description: 'Un filtre à air sale réduit le flux d\'air vers le moteur.',
                    recommendation: 'Remplacer le filtre à air selon les recommandations du fabricant.'
                },
                {
                    conditions: { check_engine: 'Oui', power_loss: 'Oui', smoke: 'Bleue' },
                    problem: 'Consommation excessive d\'huile',
                    severity: 'moderate',
                    cost: '150€ - 400€',
                    description: 'La fumée bleue indique que le moteur brûle de l\'huile.',
                    recommendation: 'Vérifier les joints de soupapes et les segments de piston.'
                },
                {
                    conditions: { check_engine: 'Oui', power_loss: 'Non', strange_noises: 'Oui' },
                    problem: 'Bobines d\'allumage défectueuses',
                    severity: 'moderate',
                    cost: '120€ - 300€',
                    description: 'Les bobines défectueuses causent des ratés et des bruits.',
                    recommendation: 'Remplacer les bobines affectées.'
                },
                {
                    conditions: { check_engine: 'Oui', power_loss: 'Non', strange_noises: 'Non' },
                    problem: 'Capteur d\'oxygène défectueux',
                    severity: 'low',
                    cost: '100€ - 200€',
                    description: 'Le capteur O2 affecte le mélange air-carburant.',
                    recommendation: 'Remplacer le capteur d\'oxygène.'
                },
                {
                    conditions: { check_engine: 'Non', power_loss: 'Oui', strange_noises: 'Oui' },
                    problem: 'Pompe à carburant défectueuse',
                    severity: 'high',
                    cost: '200€ - 500€',
                    description: 'La pompe à carburant ne fournit pas assez de pression.',
                    recommendation: 'Remplacer la pompe à carburant immédiatement.'
                },
                {
                    conditions: { check_engine: 'Non', power_loss: 'Non', strange_noises: 'Oui' },
                    problem: 'Courroie de distribution usée',
                    severity: 'high',
                    cost: '150€ - 400€',
                    description: 'Une courroie usée peut causer des dommages graves au moteur.',
                    recommendation: 'Remplacer la courroie de distribution urgemment.'
                },
                {
                    conditions: { check_engine: 'Non', power_loss: 'Non', strange_noises: 'Non' },
                    problem: 'Maintenance préventive recommandée',
                    severity: 'low',
                    cost: '50€ - 100€',
                    description: 'Aucun problème évident détecté, mais une inspection est recommandée.',
                    recommendation: 'Effectuer une maintenance préventive selon le manuel du fabricant.'
                }
            ],
            ar: [
                {
                    conditions: { check_engine: 'نعم', power_loss: 'نعم', smoke: 'لا شيء' },
                    problem: 'شموع البواليع مستهلكة',
                    severity: 'moderate',
                    cost: '80€ - 250€',
                    description: 'الشموع المستهلكة يمكن أن تسبب فقدان الطاقة وصعوبات في التشغيل.',
                    recommendation: 'قم بإجراء فحص ميكانيكي في أسرع وقت ممكن.'
                },
                {
                    conditions: { check_engine: 'نعم', power_loss: 'نعم', smoke: 'أسود' },
                    problem: 'فلتر الهواء مسدود',
                    severity: 'low',
                    cost: '30€ - 80€',
                    description: 'فلتر الهواء المتسخ يقلل من تدفق الهواء إلى المحرك.',
                    recommendation: 'استبدل فلتر الهواء وفقًا لتوصيات الشركة المصنعة.'
                },
                {
                    conditions: { check_engine: 'نعم', power_loss: 'نعم', smoke: 'أزرق' },
                    problem: 'استهلاك زيت مفرط',
                    severity: 'moderate',
                    cost: '150€ - 400€',
                    description: 'الدخان الأزرق يشير إلى أن المحرك يحترق الزيت.',
                    recommendation: 'افحص أختام الصمامات وحلقات المكبس.'
                },
                {
                    conditions: { check_engine: 'نعم', power_loss: 'لا', strange_noises: 'نعم' },
                    problem: 'ملفات الإشعال معطلة',
                    severity: 'moderate',
                    cost: '120€ - 300€',
                    description: 'الملفات المعطلة تسبب أعطال وأصوات.',
                    recommendation: 'استبدل الملفات المتأثرة.'
                },
                {
                    conditions: { check_engine: 'نعم', power_loss: 'لا', strange_noises: 'لا' },
                    problem: 'مستشعر الأكسجين معطل',
                    severity: 'low',
                    cost: '100€ - 200€',
                    description: 'مستشعر O2 يؤثر على خليط الهواء والوقود.',
                    recommendation: 'استبدل مستشعر الأكسجين.'
                },
                {
                    conditions: { check_engine: 'لا', power_loss: 'نعم', strange_noises: 'نعم' },
                    problem: 'مضخة الوقود معطلة',
                    severity: 'high',
                    cost: '200€ - 500€',
                    description: 'مضخة الوقود لا توفر ضغطًا كافيًا.',
                    recommendation: 'استبدل مضخة الوقود فورًا.'
                },
                {
                    conditions: { check_engine: 'لا', power_loss: 'لا', strange_noises: 'نعم' },
                    problem: 'حزام التوقيت مستهلك',
                    severity: 'high',
                    cost: '150€ - 400€',
                    description: 'الحزام المستهلك يمكن أن يسبب أضرارًا جسيمة للمحرك.',
                    recommendation: 'استبدل حزام التوقيت فورًا.'
                },
                {
                    conditions: { check_engine: 'لا', power_loss: 'لا', strange_noises: 'لا' },
                    problem: 'صيانة وقائية موصى بها',
                    severity: 'low',
                    cost: '50€ - 100€',
                    description: 'لم يتم اكتشاف مشاكل واضحة، لكن يوصى بالفحص.',
                    recommendation: 'قم بالصيانة الوقائية وفقًا لدليل الشركة المصنعة.'
                }
            ]
        }
    },
    bateria: {
        questions: {
            es: [
                {
                    id: 'start_issue',
                    text: '¿El coche tiene problemas para arrancar?',
                    options: ['Sí', 'No']
                },
                {
                    id: 'lights_dim',
                    text: '¿Las luces se atenúan al intentar arrancar?',
                    options: ['Sí', 'No']
                },
                {
                    id: 'jump_start',
                    text: '¿El coche arranca con puente (cables)?',
                    options: ['Sí', 'No']
                },
                {
                    id: 'battery_age',
                    text: '¿Cuántos años tiene la batería?',
                    options: ['Menos de 2 años', '2-4 años', 'Más de 4 años', 'No lo sé']
                }
            ],
            en: [
                {
                    id: 'start_issue',
                    text: 'Does the car have trouble starting?',
                    options: ['Yes', 'No']
                },
                {
                    id: 'lights_dim',
                    text: 'Do lights dim when trying to start?',
                    options: ['Yes', 'No']
                },
                {
                    id: 'jump_start',
                    text: 'Does the car start with jump cables?',
                    options: ['Yes', 'No']
                },
                {
                    id: 'battery_age',
                    text: 'How old is the battery?',
                    options: ['Less than 2 years', '2-4 years', 'More than 4 years', 'I don\'t know']
                }
            ],
            fr: [
                {
                    id: 'start_issue',
                    text: 'La voiture a-t-elle des problèmes de démarrage?',
                    options: ['Oui', 'Non']
                },
                {
                    id: 'lights_dim',
                    text: 'Les lumières s\'atténuent-elles lors du démarrage?',
                    options: ['Oui', 'Non']
                },
                {
                    id: 'jump_start',
                    text: 'La voiture démarre-t-elle avec des câbles?',
                    options: ['Oui', 'Non']
                },
                {
                    id: 'battery_age',
                    text: 'Quel âge a la batterie?',
                    options: ['Moins de 2 ans', '2-4 ans', 'Plus de 4 ans', 'Je ne sais pas']
                }
            ],
            ar: [
                {
                    id: 'start_issue',
                    text: 'هل تواجه السيارة مشاكل في التشغيل؟',
                    options: ['نعم', 'لا']
                },
                {
                    id: 'lights_dim',
                    text: 'هل تضعف الأضواء عند محاولة التشغيل؟',
                    options: ['نعم', 'لا']
                },
                {
                    id: 'jump_start',
                    text: 'هل تعمل السيارة باستخدام كابلات التشغيل؟',
                    options: ['نعم', 'لا']
                },
                {
                    id: 'battery_age',
                    text: 'كم عمر البطارية؟',
                    options: ['أقل من سنتين', '2-4 سنوات', 'أكثر من 4 سنوات', 'لا أعرف']
                }
            ]
        },
        results: {
            es: [
                {
                    conditions: { start_issue: 'Sí', lights_dim: 'Sí', jump_start: 'Sí' },
                    problem: 'Batería descargada',
                    severity: 'low',
                    cost: '80€ - 150€',
                    description: 'La batería no tiene suficiente carga para arrancar el vehículo.',
                    recommendation: 'Cargar la batería o reemplazarla si es muy antigua.'
                },
                {
                    conditions: { start_issue: 'Sí', lights_dim: 'Sí', jump_start: 'No', battery_age: 'Más de 4 años' },
                    problem: 'Batería agotada',
                    severity: 'moderate',
                    cost: '80€ - 150€',
                    description: 'La batería ha alcanzado el final de su vida útil.',
                    recommendation: 'Reemplazar la batería con una nueva.'
                },
                {
                    conditions: { start_issue: 'Sí', lights_dim: 'No', jump_start: 'Sí' },
                    problem: 'Alternador defectuoso',
                    severity: 'high',
                    cost: '200€ - 500€',
                    description: 'El alternador no carga la batería correctamente.',
                    recommendation: 'Revisar y reemplazar el alternador.'
                },
                {
                    conditions: { start_issue: 'Sí', lights_dim: 'No', jump_start: 'No' },
                    problem: 'Motor de arranque defectuoso',
                    severity: 'moderate',
                    cost: '150€ - 350€',
                    description: 'El motor de arranque no gira el motor.',
                    recommendation: 'Reemplazar el motor de arranque.'
                },
                {
                    conditions: { start_issue: 'No', lights_dim: 'No', battery_age: 'Más de 4 años' },
                    problem: 'Batería envejecida',
                    severity: 'low',
                    cost: '80€ - 150€',
                    description: 'La batería está cerca del final de su vida útil.',
                    recommendation: 'Considerar reemplazar la batería preventivamente.'
                },
                {
                    conditions: { start_issue: 'No', lights_dim: 'No', battery_age: 'Menos de 2 años' },
                    problem: 'Terminales sueltos o corrosión',
                    severity: 'low',
                    cost: '0€ - 30€',
                    description: 'Los terminales de la batería pueden estar sucios o sueltos.',
                    recommendation: 'Limpiar y apretar los terminales de la batería.'
                }
            ],
            en: [
                {
                    conditions: { start_issue: 'Yes', lights_dim: 'Yes', jump_start: 'Yes' },
                    problem: 'Dead battery',
                    severity: 'low',
                    cost: '80€ - 150€',
                    description: 'The battery doesn\'t have enough charge to start the vehicle.',
                    recommendation: 'Charge the battery or replace it if very old.'
                },
                {
                    conditions: { start_issue: 'Yes', lights_dim: 'Yes', jump_start: 'No', battery_age: 'More than 4 years' },
                    problem: 'Dead battery',
                    severity: 'moderate',
                    cost: '80€ - 150€',
                    description: 'The battery has reached the end of its life.',
                    recommendation: 'Replace the battery with a new one.'
                },
                {
                    conditions: { start_issue: 'Yes', lights_dim: 'No', jump_start: 'Yes' },
                    problem: 'Faulty alternator',
                    severity: 'high',
                    cost: '200€ - 500€',
                    description: 'The alternator is not charging the battery properly.',
                    recommendation: 'Check and replace the alternator.'
                },
                {
                    conditions: { start_issue: 'Yes', lights_dim: 'No', jump_start: 'No' },
                    problem: 'Faulty starter motor',
                    severity: 'moderate',
                    cost: '150€ - 350€',
                    description: 'The starter motor is not turning the engine.',
                    recommendation: 'Replace the starter motor.'
                },
                {
                    conditions: { start_issue: 'No', lights_dim: 'No', battery_age: 'More than 4 years' },
                    problem: 'Aging battery',
                    severity: 'low',
                    cost: '80€ - 150€',
                    description: 'The battery is near the end of its life.',
                    recommendation: 'Consider replacing the battery preventively.'
                },
                {
                    conditions: { start_issue: 'No', lights_dim: 'No', battery_age: 'Less than 2 years' },
                    problem: 'Loose terminals or corrosion',
                    severity: 'low',
                    cost: '0€ - 30€',
                    description: 'Battery terminals may be dirty or loose.',
                    recommendation: 'Clean and tighten battery terminals.'
                }
            ],
            fr: [
                {
                    conditions: { start_issue: 'Oui', lights_dim: 'Oui', jump_start: 'Oui' },
                    problem: 'Batterie déchargée',
                    severity: 'low',
                    cost: '80€ - 150€',
                    description: 'La batterie n\'a pas assez de charge pour démarrer le véhicule.',
                    recommendation: 'Charger la batterie ou la remplacer si elle est très ancienne.'
                },
                {
                    conditions: { start_issue: 'Oui', lights_dim: 'Oui', jump_start: 'Non', battery_age: 'Plus de 4 ans' },
                    problem: 'Batterie épuisée',
                    severity: 'moderate',
                    cost: '80€ - 150€',
                    description: 'La batterie a atteint la fin de sa vie.',
                    recommendation: 'Remplacer la batterie par une nouvelle.'
                },
                {
                    conditions: { start_issue: 'Oui', lights_dim: 'Non', jump_start: 'Oui' },
                    problem: 'Alternateur défectueux',
                    severity: 'high',
                    cost: '200€ - 500€',
                    description: 'L\'alternateur ne charge pas correctement la batterie.',
                    recommendation: 'Vérifier et remplacer l\'alternateur.'
                },
                {
                    conditions: { start_issue: 'Oui', lights_dim: 'Non', jump_start: 'Non' },
                    problem: 'Démarreur défectueux',
                    severity: 'moderate',
                    cost: '150€ - 350€',
                    description: 'Le démarreur ne fait pas tourner le moteur.',
                    recommendation: 'Remplacer le démarreur.'
                },
                {
                    conditions: { start_issue: 'Non', lights_dim: 'Non', battery_age: 'Plus de 4 ans' },
                    problem: 'Batterie vieillissante',
                    severity: 'low',
                    cost: '80€ - 150€',
                    description: 'La batterie est proche de la fin de sa vie.',
                    recommendation: 'Envisager de remplacer la batterie préventivement.'
                },
                {
                    conditions: { start_issue: 'Non', lights_dim: 'Non', battery_age: 'Moins de 2 ans' },
                    problem: 'Bornes desserrées ou corrosion',
                    severity: 'low',
                    cost: '0€ - 30€',
                    description: 'Les bornes de la batterie peuvent être sales ou desserrées.',
                    recommendation: 'Nettoyer et serrer les bornes de la batterie.'
                }
            ],
            ar: [
                {
                    conditions: { start_issue: 'نعم', lights_dim: 'نعم', jump_start: 'نعم' },
                    problem: 'بطارية فارغة',
                    severity: 'low',
                    cost: '80€ - 150€',
                    description: 'البطارية لا تحتوي على شحن كافٍ لتشغيل المركبة.',
                    recommendation: 'شحن البطارية أو استبدالها إذا كانت قديمة جدًا.'
                },
                {
                    conditions: { start_issue: 'نعم', lights_dim: 'نعم', jump_start: 'لا', battery_age: 'أكثر من 4 سنوات' },
                    problem: 'بطارية تالفة',
                    severity: 'moderate',
                    cost: '80€ - 150€',
                    description: 'البطارية وصلت إلى نهاية عمرها الافتراضي.',
                    recommendation: 'استبدل البطارية ببطارية جديدة.'
                },
                {
                    conditions: { start_issue: 'نعم', lights_dim: 'لا', jump_start: 'نعم' },
                    problem: 'المولد معطل',
                    severity: 'high',
                    cost: '200€ - 500€',
                    description: 'المولد لا يشحن البطارية بشكل صحيح.',
                    recommendation: 'افحص واستبدل المولد.'
                },
                {
                    conditions: { start_issue: 'نعم', lights_dim: 'لا', jump_start: 'لا' },
                    problem: 'محرك البدء معطل',
                    severity: 'moderate',
                    cost: '150€ - 350€',
                    description: 'محرك البدء لا يدور المحرك.',
                    recommendation: 'استبدل محرك البدء.'
                },
                {
                    conditions: { start_issue: 'لا', lights_dim: 'لا', battery_age: 'أكثر من 4 سنوات' },
                    problem: 'بطارية قديمة',
                    severity: 'low',
                    cost: '80€ - 150€',
                    description: 'البطارية قريبة من نهاية عمرها.',
                    recommendation: 'فكر في استبدال البطارية وقائيًا.'
                },
                {
                    conditions: { start_issue: 'لا', lights_dim: 'لا', battery_age: 'أقل من سنتين' },
                    problem: 'أطراف مفكوكة أو تآكل',
                    severity: 'low',
                    cost: '0€ - 30€',
                    description: 'قد تكون أطراف البطارية متسخة أو مفكوكة.',
                    recommendation: 'نظف وأحكم أطراف البطارية.'
                }
            ]
        }
    },
    frenos: {
        questions: {
            es: [
                {
                    id: 'brake_noise',
                    text: '¿Escuchas ruidos al frenar?',
                    options: ['Sí', 'No']
                },
                {
                    id: 'vibration',
                    text: '¿El volante vibra al frenar?',
                    options: ['Sí', 'No']
                },
                {
                    id: 'brake_response',
                    text: '¿Los frenos responden lentamente?',
                    options: ['Sí', 'No']
                },
                {
                    id: 'pulling',
                    text: '¿El coche se desvía al frenar?',
                    options: ['Sí', 'No']
                }
            ],
            en: [
                {
                    id: 'brake_noise',
                    text: 'Do you hear noises when braking?',
                    options: ['Yes', 'No']
                },
                {
                    id: 'vibration',
                    text: 'Does the steering wheel vibrate when braking?',
                    options: ['Yes', 'No']
                },
                {
                    id: 'brake_response',
                    text: 'Do brakes respond slowly?',
                    options: ['Yes', 'No']
                },
                {
                    id: 'pulling',
                    text: 'Does the car pull when braking?',
                    options: ['Yes', 'No']
                }
            ],
            fr: [
                {
                    id: 'brake_noise',
                    text: 'Entendez-vous des bruits lors du freinage?',
                    options: ['Oui', 'Non']
                },
                {
                    id: 'vibration',
                    text: 'Le volant vibre-t-il lors du freinage?',
                    options: ['Oui', 'Non']
                },
                {
                    id: 'brake_response',
                    text: 'Les freins répondent-ils lentement?',
                    options: ['Oui', 'Non']
                },
                {
                    id: 'pulling',
                    text: 'La voiture tire-t-elle lors du freinage?',
                    options: ['Oui', 'Non']
                }
            ],
            ar: [
                {
                    id: 'brake_noise',
                    text: 'هل تسمع أصوات عند الفرملة؟',
                    options: ['نعم', 'لا']
                },
                {
                    id: 'vibration',
                    text: 'هل يهتز عجلة القيادة عند الفرملة؟',
                    options: ['نعم', 'لا']
                },
                {
                    id: 'brake_response',
                    text: 'هل تستجيب الفرامل ببطء؟',
                    options: ['نعم', 'لا']
                },
                {
                    id: 'pulling',
                    text: 'هل تنحرف السيارة عند الفرملة؟',
                    options: ['نعم', 'لا']
                }
            ]
        },
        results: {
            es: [
                {
                    conditions: { brake_noise: 'Sí', vibration: 'No', brake_response: 'No' },
                    problem: 'Pastillas de freno desgastadas',
                    severity: 'moderate',
                    cost: '100€ - 250€',
                    description: 'Las pastillas están gastadas y necesitan reemplazo.',
                    recommendation: 'Reemplazar las pastillas de freno inmediatamente.'
                },
                {
                    conditions: { brake_noise: 'Sí', vibration: 'Sí' },
                    problem: 'Discos de freno dañados',
                    severity: 'moderate',
                    cost: '150€ - 400€',
                    description: 'Los discos están deformados o muy desgastados.',
                    recommendation: 'Rectificar o reemplazar los discos de freno.'
                },
                {
                    conditions: { brake_noise: 'No', vibration: 'Sí' },
                    problem: 'Discos de freno alabeados',
                    severity: 'moderate',
                    cost: '150€ - 400€',
                    description: 'Los discos están deformados causando vibración.',
                    recommendation: 'Rectificar o reemplazar los discos.'
                },
                {
                    conditions: { brake_response: 'Sí', pulling: 'No' },
                    problem: 'Nivel bajo de líquido de frenos',
                    severity: 'high',
                    cost: '30€ - 80€',
                    description: 'El líquido de frenos está bajo, afectando la respuesta.',
                    recommendation: 'Rellenar el líquido de frenos y revisar posibles fugas.'
                },
                {
                    conditions: { pulling: 'Sí' },
                    problem: 'Caliper de freno atascado',
                    severity: 'moderate',
                    cost: '100€ - 300€',
                    description: 'Un caliper está atascado causando desviación.',
                    recommendation: 'Revisar y reparar el caliper afectado.'
                },
                {
                    conditions: { brake_noise: 'No', vibration: 'No', brake_response: 'No', pulling: 'No' },
                    problem: 'Sistema de frenos en buen estado',
                    severity: 'low',
                    cost: '0€',
                    description: 'No se detectaron problemas evidentes en los frenos.',
                    recommendation: 'Realizar mantenimiento preventivo regular.'
                }
            ],
            en: [
                {
                    conditions: { brake_noise: 'Yes', vibration: 'No', brake_response: 'No' },
                    problem: 'Worn brake pads',
                    severity: 'moderate',
                    cost: '100€ - 250€',
                    description: 'Brake pads are worn and need replacement.',
                    recommendation: 'Replace brake pads immediately.'
                },
                {
                    conditions: { brake_noise: 'Yes', vibration: 'Yes' },
                    problem: 'Damaged brake discs',
                    severity: 'moderate',
                    cost: '150€ - 400€',
                    description: 'Brake discs are warped or very worn.',
                    recommendation: 'Resurface or replace brake discs.'
                },
                {
                    conditions: { brake_noise: 'No', vibration: 'Yes' },
                    problem: 'Warped brake discs',
                    severity: 'moderate',
                    cost: '150€ - 400€',
                    description: 'Brake discs are warped causing vibration.',
                    recommendation: 'Resurface or replace discs.'
                },
                {
                    conditions: { brake_response: 'Yes', pulling: 'No' },
                    problem: 'Low brake fluid level',
                    severity: 'high',
                    cost: '30€ - 80€',
                    description: 'Brake fluid is low, affecting response.',
                    recommendation: 'Top up brake fluid and check for leaks.'
                },
                {
                    conditions: { pulling: 'Yes' },
                    problem: 'Stuck brake caliper',
                    severity: 'moderate',
                    cost: '100€ - 300€',
                    description: 'A caliper is stuck causing pulling.',
                    recommendation: 'Check and repair affected caliper.'
                },
                {
                    conditions: { brake_noise: 'No', vibration: 'No', brake_response: 'No', pulling: 'No' },
                    problem: 'Brake system in good condition',
                    severity: 'low',
                    cost: '0€',
                    description: 'No evident problems detected in brakes.',
                    recommendation: 'Perform regular preventive maintenance.'
                }
            ],
            fr: [
                {
                    conditions: { brake_noise: 'Oui', vibration: 'Non', brake_response: 'Non' },
                    problem: 'Plaquettes de frein usées',
                    severity: 'moderate',
                    cost: '100€ - 250€',
                    description: 'Les plaquettes sont usées et nécessitent un remplacement.',
                    recommendation: 'Remplacer les plaquettes de frein immédiatement.'
                },
                {
                    conditions: { brake_noise: 'Oui', vibration: 'Oui' },
                    problem: 'Disques de frein endommagés',
                    severity: 'moderate',
                    cost: '150€ - 400€',
                    description: 'Les disques sont voilés ou très usés.',
                    recommendation: 'Rectifier ou remplacer les disques de frein.'
                },
                {
                    conditions: { brake_noise: 'Non', vibration: 'Oui' },
                    problem: 'Disques de frein voilés',
                    severity: 'moderate',
                    cost: '150€ - 400€',
                    description: 'Les disques sont voilés causant des vibrations.',
                    recommendation: 'Rectifier ou remplacer les disques.'
                },
                {
                    conditions: { brake_response: 'Oui', pulling: 'Non' },
                    problem: 'Niveau bas de liquide de frein',
                    severity: 'high',
                    cost: '30€ - 80€',
                    description: 'Le liquide de frein est bas, affectant la réponse.',
                    recommendation: 'Remplir le liquide de frein et vérifier les fuites.'
                },
                {
                    conditions: { pulling: 'Oui' },
                    problem: 'Étrier de frein bloqué',
                    severity: 'moderate',
                    cost: '100€ - 300€',
                    description: 'Un étrier est bloqué causant une traction.',
                    recommendation: 'Vérifier et réparer l\'étrier affecté.'
                },
                {
                    conditions: { brake_noise: 'Non', vibration: 'Non', brake_response: 'Non', pulling: 'Non' },
                    problem: 'Système de frein en bon état',
                    severity: 'low',
                    cost: '0€',
                    description: 'Aucun problème évident détecté dans les freins.',
                    recommendation: 'Effectuer un entretien préventif régulier.'
                }
            ],
            ar: [
                {
                    conditions: { brake_noise: 'نعم', vibration: 'لا', brake_response: 'لا' },
                    problem: 'وسائد الفرامل مستهلكة',
                    severity: 'moderate',
                    cost: '100€ - 250€',
                    description: 'الوسائد مستهلكة وتحتاج إلى استبدال.',
                    recommendation: 'استبدل وسائد الفرامل فورًا.'
                },
                {
                    conditions: { brake_noise: 'نعم', vibration: 'نعم' },
                    problem: 'أقراص الفرامل تالفة',
                    severity: 'moderate',
                    cost: '150€ - 400€',
                    description: 'الأقراص مشوهة أو مستهلكة جدًا.',
                    recommendation: 'قم بتسوية أو استبدال أقراص الفرامل.'
                },
                {
                    conditions: { brake_noise: 'لا', vibration: 'نعم' },
                    problem: 'أقراص الفرامل مشوهة',
                    severity: 'moderate',
                    cost: '150€ - 400€',
                    description: 'الأقراص مشوهة تسبب الاهتزاز.',
                    recommendation: 'قم بتسوية أو استبدال الأقراص.'
                },
                {
                    conditions: { brake_response: 'نعم', pulling: 'لا' },
                    problem: 'مستوى سائل الفرامل منخفض',
                    severity: 'high',
                    cost: '30€ - 80€',
                    description: 'سائل الفرامل منخفض، مما يؤثر على الاستجابة.',
                    recommendation: 'املأ سائل الفرامل وتحقق من التسربات.'
                },
                {
                    conditions: { pulling: 'نعم' },
                    problem: 'كابح الفرامل عالق',
                    severity: 'moderate',
                    cost: '100€ - 300€',
                    description: 'الكابح عالق يسبب الانحراف.',
                    recommendation: 'افحص وأصلح الكابح المتأثر.'
                },
                {
                    conditions: { brake_noise: 'لا', vibration: 'لا', brake_response: 'لا', pulling: 'لا' },
                    problem: 'نظام الفرامل في حالة جيدة',
                    severity: 'low',
                    cost: '0€',
                    description: 'لم يتم اكتشاف مشاكل واضحة في الفرامل.',
                    recommendation: 'قم بالصيانة الوقائية المنتظمة.'
                }
            ]
        }
    },
    transmision: {
        questions: {
            es: [
                {
                    id: 'gear_slip',
                    text: '¿La transmisión patina al cambiar marcha?',
                    options: ['Sí', 'No']
                },
                {
                    id: 'delay',
                    text: '¿Hay retraso al cambiar marchas?',
                    options: ['Sí', 'No']
                },
                {
                    id: 'noise',
                    text: '¿Escuchas ruidos en la transmisión?',
                    options: ['Sí', 'No']
                },
                {
                    id: 'fluid',
                    text: '¿Cuándo fue la última revisión del fluido?',
                    options: ['Menos de 1 año', '1-3 años', 'Más de 3 años', 'Nunca', 'No lo sé']
                }
            ],
            en: [
                {
                    id: 'gear_slip',
                    text: 'Does the transmission slip when shifting?',
                    options: ['Yes', 'No']
                },
                {
                    id: 'delay',
                    text: 'Is there delay when shifting gears?',
                    options: ['Yes', 'No']
                },
                {
                    id: 'noise',
                    text: 'Do you hear noises in the transmission?',
                    options: ['Yes', 'No']
                },
                {
                    id: 'fluid',
                    text: 'When was the last fluid check?',
                    options: ['Less than 1 year', '1-3 years', 'More than 3 years', 'Never', 'I don\'t know']
                }
            ],
            fr: [
                {
                    id: 'gear_slip',
                    text: 'La transmission patine-t-elle lors du changement de vitesse?',
                    options: ['Oui', 'Non']
                },
                {
                    id: 'delay',
                    text: 'Y a-t-il un retard lors du changement de vitesse?',
                    options: ['Oui', 'Non']
                },
                {
                    id: 'noise',
                    text: 'Entendez-vous des bruits dans la transmission?',
                    options: ['Oui', 'Non']
                },
                {
                    id: 'fluid',
                    text: 'Quand a eu lieu la dernière vérification du fluide?',
                    options: ['Moins d\'un an', '1-3 ans', 'Plus de 3 ans', 'Jamais', 'Je ne sais pas']
                }
            ],
            ar: [
                {
                    id: 'gear_slip',
                    text: 'هل ينزلق ناقل الحركة عند تغيير السرعة؟',
                    options: ['نعم', 'لا']
                },
                {
                    id: 'delay',
                    text: 'هل هناك تأخير عند تغيير السرعات؟',
                    options: ['نعم', 'لا']
                },
                {
                    id: 'noise',
                    text: 'هل تسمع أصوات في ناقل الحركة؟',
                    options: ['نعم', 'لا']
                },
                {
                    id: 'fluid',
                    text: 'متى كانت آخر فحص للسائل؟',
                    options: ['أقل من سنة', '1-3 سنوات', 'أكثر من 3 سنوات', 'أبدًا', 'لا أعرف']
                }
            ]
        },
        results: {
            es: [
                {
                    conditions: { gear_slip: 'Sí', delay: 'Sí' },
                    problem: 'Embrague desgastado',
                    severity: 'high',
                    cost: '300€ - 600€',
                    description: 'El embrague está desgastado y necesita reemplazo.',
                    recommendation: 'Reemplazar el embrague y el volante motor.'
                },
                {
                    conditions: { gear_slip: 'No', delay: 'Sí', fluid: 'Más de 3 años' },
                    problem: 'Fluido de transmisión viejo',
                    severity: 'moderate',
                    cost: '80€ - 150€',
                    description: 'El fluido de transmisión está degradado.',
                    recommendation: 'Cambiar el fluido de transmisión y el filtro.'
                },
                {
                    conditions: { noise: 'Sí', gear_slip: 'No' },
                    problem: 'Cojinetes de transmisión desgastados',
                    severity: 'high',
                    cost: '400€ - 800€',
                    description: 'Los cojinetes están desgastados causando ruido.',
                    recommendation: 'Revisar y reemplazar los cojinetes afectados.'
                },
                {
                    conditions: { gear_slip: 'No', delay: 'No', noise: 'No', fluid: 'Nunca' },
                    problem: 'Mantenimiento de transmisión necesario',
                    severity: 'low',
                    cost: '80€ - 150€',
                    description: 'La transmisión nunca ha tenido mantenimiento.',
                    recommendation: 'Realizar mantenimiento de transmisión urgentemente.'
                },
                {
                    conditions: { gear_slip: 'No', delay: 'No', noise: 'No' },
                    problem: 'Transmisión en buen estado',
                    severity: 'low',
                    cost: '0€',
                    description: 'No se detectaron problemas evidentes en la transmisión.',
                    recommendation: 'Realizar mantenimiento preventivo regular.'
                }
            ],
            en: [
                {
                    conditions: { gear_slip: 'Yes', delay: 'Yes' },
                    problem: 'Worn clutch',
                    severity: 'high',
                    cost: '300€ - 600€',
                    description: 'The clutch is worn and needs replacement.',
                    recommendation: 'Replace the clutch and flywheel.'
                },
                {
                    conditions: { gear_slip: 'No', delay: 'Yes', fluid: 'More than 3 years' },
                    problem: 'Old transmission fluid',
                    severity: 'moderate',
                    cost: '80€ - 150€',
                    description: 'Transmission fluid is degraded.',
                    recommendation: 'Change transmission fluid and filter.'
                },
                {
                    conditions: { noise: 'Yes', gear_slip: 'No' },
                    problem: 'Worn transmission bearings',
                    severity: 'high',
                    cost: '400€ - 800€',
                    description: 'Bearings are worn causing noise.',
                    recommendation: 'Check and replace affected bearings.'
                },
                {
                    conditions: { gear_slip: 'No', delay: 'No', noise: 'No', fluid: 'Never' },
                    problem: 'Transmission maintenance needed',
                    severity: 'low',
                    cost: '80€ - 150€',
                    description: 'Transmission has never had maintenance.',
                    recommendation: 'Perform transmission maintenance urgently.'
                },
                {
                    conditions: { gear_slip: 'No', delay: 'No', noise: 'No' },
                    problem: 'Transmission in good condition',
                    severity: 'low',
                    cost: '0€',
                    description: 'No evident problems detected in transmission.',
                    recommendation: 'Perform regular preventive maintenance.'
                }
            ],
            fr: [
                {
                    conditions: { gear_slip: 'Oui', delay: 'Oui' },
                    problem: 'Embrayage usé',
                    severity: 'high',
                    cost: '300€ - 600€',
                    description: 'L\'embrayage est usé et doit être remplacé.',
                    recommendation: 'Remplacer l\'embrayage et le volant moteur.'
                },
                {
                    conditions: { gear_slip: 'Non', delay: 'Oui', fluid: 'Plus de 3 ans' },
                    problem: 'Fluide de transmission vieux',
                    severity: 'moderate',
                    cost: '80€ - 150€',
                    description: 'Le fluide de transmission est dégradé.',
                    recommendation: 'Changer le fluide de transmission et le filtre.'
                },
                {
                    conditions: { noise: 'Oui', gear_slip: 'Non' },
                    problem: 'Roulements de transmission usés',
                    severity: 'high',
                    cost: '400€ - 800€',
                    description: 'Les roulements sont usés causant du bruit.',
                    recommendation: 'Vérifier et remplacer les roulements affectés.'
                },
                {
                    conditions: { gear_slip: 'Non', delay: 'Non', noise: 'Non', fluid: 'Jamais' },
                    problem: 'Maintenance de transmission nécessaire',
                    severity: 'low',
                    cost: '80€ - 150€',
                    description: 'La transmission n\'a jamais eu d\'entretien.',
                    recommendation: 'Effectuer l\'entretien de transmission urgemment.'
                },
                {
                    conditions: { gear_slip: 'Non', delay: 'Non', noise: 'Non' },
                    problem: 'Transmission en bon état',
                    severity: 'low',
                    cost: '0€',
                    description: 'Aucun problème évident détecté dans la transmission.',
                    recommendation: 'Effectuer un entretien préventif régulier.'
                }
            ],
            ar: [
                {
                    conditions: { gear_slip: 'نعم', delay: 'نعم' },
                    problem: 'القابض مستهلك',
                    severity: 'high',
                    cost: '300€ - 600€',
                    description: 'القابض مستهلك ويحتاج إلى استبدال.',
                    recommendation: 'استبدل القابض وعجلة المحرك.'
                },
                {
                    conditions: { gear_slip: 'لا', delay: 'نعم', fluid: 'أكثر من 3 سنوات' },
                    problem: 'سائل ناقل الحركة قديم',
                    severity: 'moderate',
                    cost: '80€ - 150€',
                    description: 'سائل ناقل الحركة متدهور.',
                    recommendation: 'غيّر سائل ناقل الحركة والفلتر.'
                },
                {
                    conditions: { noise: 'نعم', gear_slip: 'لا' },
                    problem: 'محامل ناقل الحركة مستهلكة',
                    severity: 'high',
                    cost: '400€ - 800€',
                    description: 'المحامل مستهلكة تسبب الصوت.',
                    recommendation: 'افحص واستبدل المحامل المتأثرة.'
                },
                {
                    conditions: { gear_slip: 'لا', delay: 'لا', noise: 'لا', fluid: 'أبدًا' },
                    problem: 'صيانة ناقل الحركة ضرورية',
                    severity: 'low',
                    cost: '80€ - 150€',
                    description: 'ناقل الحركة لم يخضع للصيانة أبدًا.',
                    recommendation: 'قم بصيانة ناقل الحركة فورًا.'
                },
                {
                    conditions: { gear_slip: 'لا', delay: 'لا', noise: 'لا' },
                    problem: 'ناقل الحركة في حالة جيدة',
                    severity: 'low',
                    cost: '0€',
                    description: 'لم يتم اكتشاف مشاكل واضحة في ناقل الحركة.',
                    recommendation: 'قم بالصيانة الوقائية المنتظمة.'
                }
            ]
        }
    },
    suspension: {
        questions: {
            es: [
                {
                    id: 'ride_quality',
                    text: '¿El viaje es más duro de lo normal?',
                    options: ['Sí', 'No']
                },
                {
                    id: 'noise_bumps',
                    text: '¿Escuchas ruidos al pasar por baches?',
                    options: ['Sí', 'No']
                },
                {
                    id: 'pulling',
                    text: '¿El coche se desvía al conducir?',
                    options: ['Sí', 'No']
                },
                {
                    id: 'tire_wear',
                    text: '¿Los neumáticos se desgastan de forma irregular?',
                    options: ['Sí', 'No']
                }
            ],
            en: [
                {
                    id: 'ride_quality',
                    text: 'Is the ride rougher than normal?',
                    options: ['Yes', 'No']
                },
                {
                    id: 'noise_bumps',
                    text: 'Do you hear noises when going over bumps?',
                    options: ['Yes', 'No']
                },
                {
                    id: 'pulling',
                    text: 'Does the car pull when driving?',
                    options: ['Yes', 'No']
                },
                {
                    id: 'tire_wear',
                    text: 'Do tires wear unevenly?',
                    options: ['Yes', 'No']
                }
            ],
            fr: [
                {
                    id: 'ride_quality',
                    text: 'La conduite est-elle plus dure que la normale?',
                    options: ['Oui', 'Non']
                },
                {
                    id: 'noise_bumps',
                    text: 'Entendez-vous des bruits en passant sur les bosses?',
                    options: ['Oui', 'Non']
                },
                {
                    id: 'pulling',
                    text: 'La voiture tire-t-elle en conduisant?',
                    options: ['Oui', 'Non']
                },
                {
                    id: 'tire_wear',
                    text: 'Les pneus s\'usent-ils de manière irrégulière?',
                    options: ['Oui', 'Non']
                }
            ],
            ar: [
                {
                    id: 'ride_quality',
                    text: 'هل القيادة أقوى من المعتاد؟',
                    options: ['نعم', 'لا']
                },
                {
                    id: 'noise_bumps',
                    text: 'هل تسمع أصوات عند المرور فوق المطبات؟',
                    options: ['نعم', 'لا']
                },
                {
                    id: 'pulling',
                    text: 'هل تنحرف السيارة عند القيادة؟',
                    options: ['نعم', 'لا']
                },
                {
                    id: 'tire_wear',
                    text: 'هل تتآكل الإطارات بشكل غير متساوٍ؟',
                    options: ['نعم', 'لا']
                }
            ]
        },
        results: {
            es: [
                {
                    conditions: { ride_quality: 'Sí', noise_bumps: 'Sí' },
                    problem: 'Amortiguadores desgastados',
                    severity: 'moderate',
                    cost: '200€ - 500€',
                    description: 'Los amortiguadores están desgastados y necesitan reemplazo.',
                    recommendation: 'Reemplazar los amortiguadores afectados.'
                },
                {
                    conditions: { pulling: 'Sí', tire_wear: 'Sí' },
                    problem: 'Alineación incorrecta',
                    severity: 'low',
                    cost: '50€ - 100€',
                    description: 'La alineación de las ruedas está incorrecta.',
                    recommendation: 'Realizar alineación de ruedas.'
                },
                {
                    conditions: { pulling: 'Sí', tire_wear: 'No' },
                    problem: 'Dirección desalineada',
                    severity: 'low',
                    cost: '50€ - 120€',
                    description: 'La dirección necesita alineación.',
                    recommendation: 'Realizar alineación de dirección.'
                },
                {
                    conditions: { noise_bumps: 'Sí', ride_quality: 'No' },
                    problem: 'Brazos de suspensión desgastados',
                    severity: 'moderate',
                    cost: '150€ - 350€',
                    description: 'Los brazos de suspensión tienen desgaste.',
                    recommendation: 'Revisar y reemplazar los brazos afectados.'
                },
                {
                    conditions: { ride_quality: 'No', noise_bumps: 'No', pulling: 'No', tire_wear: 'No' },
                    problem: 'Suspensión en buen estado',
                    severity: 'low',
                    cost: '0€',
                    description: 'No se detectaron problemas evidentes en la suspensión.',
                    recommendation: 'Realizar mantenimiento preventivo regular.'
                }
            ],
            en: [
                {
                    conditions: { ride_quality: 'Yes', noise_bumps: 'Yes' },
                    problem: 'Worn shock absorbers',
                    severity: 'moderate',
                    cost: '200€ - 500€',
                    description: 'Shock absorbers are worn and need replacement.',
                    recommendation: 'Replace affected shock absorbers.'
                },
                {
                    conditions: { pulling: 'Yes', tire_wear: 'Yes' },
                    problem: 'Incorrect alignment',
                    severity: 'low',
                    cost: '50€ - 100€',
                    description: 'Wheel alignment is incorrect.',
                    recommendation: 'Perform wheel alignment.'
                },
                {
                    conditions: { pulling: 'Yes', tire_wear: 'No' },
                    problem: 'Steering misaligned',
                    severity: 'low',
                    cost: '50€ - 120€',
                    description: 'Steering needs alignment.',
                    recommendation: 'Perform steering alignment.'
                },
                {
                    conditions: { noise_bumps: 'Yes', ride_quality: 'No' },
                    problem: 'Worn suspension arms',
                    severity: 'moderate',
                    cost: '150€ - 350€',
                    description: 'Suspension arms have wear.',
                    recommendation: 'Check and replace affected arms.'
                },
                {
                    conditions: { ride_quality: 'No', noise_bumps: 'No', pulling: 'No', tire_wear: 'No' },
                    problem: 'Suspension in good condition',
                    severity: 'low',
                    cost: '0€',
                    description: 'No evident problems detected in suspension.',
                    recommendation: 'Perform regular preventive maintenance.'
                }
            ],
            fr: [
                {
                    conditions: { ride_quality: 'Oui', noise_bumps: 'Oui' },
                    problem: 'Amortisseurs usés',
                    severity: 'moderate',
                    cost: '200€ - 500€',
                    description: 'Les amortisseurs sont usés et doivent être remplacés.',
                    recommendation: 'Remplacer les amortisseurs affectés.'
                },
                {
                    conditions: { pulling: 'Oui', tire_wear: 'Oui' },
                    problem: 'Alignement incorrect',
                    severity: 'low',
                    cost: '50€ - 100€',
                    description: 'L\'alignement des roues est incorrect.',
                    recommendation: 'Effectuer l\'alignement des roues.'
                },
                {
                    conditions: { pulling: 'Oui', tire_wear: 'Non' },
                    problem: 'Direction désalignée',
                    severity: 'low',
                    cost: '50€ - 120€',
                    description: 'La direction a besoin d\'alignement.',
                    recommendation: 'Effectuer l\'alignement de la direction.'
                },
                {
                    conditions: { noise_bumps: 'Oui', ride_quality: 'Non' },
                    problem: 'Bras de suspension usés',
                    severity: 'moderate',
                    cost: '150€ - 350€',
                    description: 'Les bras de suspension ont de l\'usure.',
                    recommendation: 'Vérifier et remplacer les bras affectés.'
                },
                {
                    conditions: { ride_quality: 'Non', noise_bumps: 'Non', pulling: 'Non', tire_wear: 'Non' },
                    problem: 'Suspension en bon état',
                    severity: 'low',
                    cost: '0€',
                    description: 'Aucun problème évident détecté dans la suspension.',
                    recommendation: 'Effectuer un entretien préventif régulier.'
                }
            ],
            ar: [
                {
                    conditions: { ride_quality: 'نعم', noise_bumps: 'نعم' },
                    problem: 'ممتصات الصدمات مستهلكة',
                    severity: 'moderate',
                    cost: '200€ - 500€',
                    description: 'ممتصات الصدمات مستهلكة وتحتاج إلى استبدال.',
                    recommendation: 'استبدل ممتصات الصدمات المتأثرة.'
                },
                {
                    conditions: { pulling: 'نعم', tire_wear: 'نعم' },
                    problem: 'محاذاة غير صحيحة',
                    severity: 'low',
                    cost: '50€ - 100€',
                    description: 'محاذاة العجلات غير صحيحة.',
                    recommendation: 'قم بمحاذاة العجلات.'
                },
                {
                    conditions: { pulling: 'نعم', tire_wear: 'لا' },
                    problem: 'التوجيه غير محاذي',
                    severity: 'low',
                    cost: '50€ - 120€',
                    description: 'التوجيه يحتاج إلى محاذاة.',
                    recommendation: 'قم بمحاذاة التوجيه.'
                },
                {
                    conditions: { noise_bumps: 'نعم', ride_quality: 'لا' },
                    problem: 'أذرع نظام التعليق مستهلكة',
                    severity: 'moderate',
                    cost: '150€ - 350€',
                    description: 'أذرع نظام التعليق بها تآكل.',
                    recommendation: 'افحص واستبدل الأذرع المتأثرة.'
                },
                {
                    conditions: { ride_quality: 'لا', noise_bumps: 'لا', pulling: 'لا', tire_wear: 'لا' },
                    problem: 'نظام التعليق في حالة جيدة',
                    severity: 'low',
                    cost: '0€',
                    description: 'لم يتم اكتشاف مشاكل واضحة في نظام التعليق.',
                    recommendation: 'قم بالصيانة الوقائية المنتظمة.'
                }
            ]
        }
    },
    refrigeracion: {
        questions: {
            es: [
                {
                    id: 'overheating',
                    text: '¿El motor se sobrecalienta?',
                    options: ['Sí', 'No']
                },
                {
                    id: 'coolant_leak',
                    text: '¿Hay fugas de refrigerante?',
                    options: ['Sí', 'No']
                },
                {
                    id: 'heater',
                    text: '¿La calefacción no funciona bien?',
                    options: ['Sí', 'No']
                },
                {
                    id: 'fan',
                    text: '¿El ventilador del radiador funciona?',
                    options: ['Sí', 'No']
                }
            ],
            en: [
                {
                    id: 'overheating',
                    text: 'Does the engine overheat?',
                    options: ['Yes', 'No']
                },
                {
                    id: 'coolant_leak',
                    text: 'Is there coolant leak?',
                    options: ['Yes', 'No']
                },
                {
                    id: 'heater',
                    text: 'Does the heater not work well?',
                    options: ['Yes', 'No']
                },
                {
                    id: 'fan',
                    text: 'Does the radiator fan work?',
                    options: ['Yes', 'No']
                }
            ],
            fr: [
                {
                    id: 'overheating',
                    text: 'Le moteur surchauffe-t-il?',
                    options: ['Oui', 'Non']
                },
                {
                    id: 'coolant_leak',
                    text: 'Y a-t-il une fuite de liquide de refroidissement?',
                    options: ['Oui', 'Non']
                },
                {
                    id: 'heater',
                    text: 'Le chauffage ne fonctionne-t-il pas bien?',
                    options: ['Oui', 'Non']
                },
                {
                    id: 'fan',
                    text: 'Le ventilateur du radiateur fonctionne-t-il?',
                    options: ['Oui', 'Non']
                }
            ],
            ar: [
                {
                    id: 'overheating',
                    text: 'هل يسخن المحرك بشكل مفرط؟',
                    options: ['نعم', 'لا']
                },
                {
                    id: 'coolant_leak',
                    text: 'هل هناك تسرب في سائل التبريد؟',
                    options: ['نعم', 'لا']
                },
                {
                    id: 'heater',
                    text: 'هل لا تعمل المدفأة بشكل جيد؟',
                    options: ['نعم', 'لا']
                },
                {
                    id: 'fan',
                    text: 'هل يعمل مروحة الردياتير؟',
                    options: ['نعم', 'لا']
                }
            ]
        },
        results: {
            es: [
                {
                    conditions: { overheating: 'Sí', coolant_leak: 'Sí' },
                    problem: 'Fuga en el sistema de refrigeración',
                    severity: 'high',
                    cost: '100€ - 300€',
                    description: 'Hay una fuga en el sistema que causa sobrecalentamiento.',
                    recommendation: 'Localizar y reparar la fuga inmediatamente.'
                },
                {
                    conditions: { overheating: 'Sí', coolant_leak: 'No', fan: 'No' },
                    problem: 'Ventilador del radiador defectuoso',
                    severity: 'high',
                    cost: '150€ - 350€',
                    description: 'El ventilador no funciona correctamente.',
                    recommendation: 'Reemplazar el ventilador del radiador.'
                },
                {
                    conditions: { overheating: 'Sí', coolant_leak: 'No', fan: 'Sí' },
                    problem: 'Termostato defectuoso',
                    severity: 'moderate',
                    cost: '80€ - 200€',
                    description: 'El termostato no abre correctamente.',
                    recommendation: 'Reemplazar el termostato.'
                },
                {
                    conditions: { overheating: 'No', heater: 'Sí' },
                    problem: 'Bomba de agua defectuosa',
                    severity: 'moderate',
                    cost: '150€ - 350€',
                    description: 'La bomba de agua no circula el refrigerante.',
                    recommendation: 'Reemplazar la bomba de agua.'
                },
                {
                    conditions: { overheating: 'No', heater: 'No' },
                    problem: 'Sistema de refrigeración en buen estado',
                    severity: 'low',
                    cost: '0€',
                    description: 'No se detectaron problemas evidentes en el sistema.',
                    recommendation: 'Realizar mantenimiento preventivo regular.'
                }
            ],
            en: [
                {
                    conditions: { overheating: 'Yes', coolant_leak: 'Yes' },
                    problem: 'Cooling system leak',
                    severity: 'high',
                    cost: '100€ - 300€',
                    description: 'There is a leak in the system causing overheating.',
                    recommendation: 'Locate and repair the leak immediately.'
                },
                {
                    conditions: { overheating: 'Yes', coolant_leak: 'No', fan: 'No' },
                    problem: 'Faulty radiator fan',
                    severity: 'high',
                    cost: '150€ - 350€',
                    description: 'The radiator fan is not working properly.',
                    recommendation: 'Replace the radiator fan.'
                },
                {
                    conditions: { overheating: 'Yes', coolant_leak: 'No', fan: 'Yes' },
                    problem: 'Faulty thermostat',
                    severity: 'moderate',
                    cost: '80€ - 200€',
                    description: 'The thermostat is not opening properly.',
                    recommendation: 'Replace the thermostat.'
                },
                {
                    conditions: { overheating: 'No', heater: 'Yes' },
                    problem: 'Faulty water pump',
                    severity: 'moderate',
                    cost: '150€ - 350€',
                    description: 'The water pump is not circulating coolant.',
                    recommendation: 'Replace the water pump.'
                },
                {
                    conditions: { overheating: 'No', heater: 'No' },
                    problem: 'Cooling system in good condition',
                    severity: 'low',
                    cost: '0€',
                    description: 'No evident problems detected in the system.',
                    recommendation: 'Perform regular preventive maintenance.'
                }
            ],
            fr: [
                {
                    conditions: { overheating: 'Oui', coolant_leak: 'Oui' },
                    problem: 'Fuite dans le système de refroidissement',
                    severity: 'high',
                    cost: '100€ - 300€',
                    description: 'Il y a une fuite dans le système causant une surchauffe.',
                    recommendation: 'Localiser et réparer la fuite immédiatement.'
                },
                {
                    conditions: { overheating: 'Oui', coolant_leak: 'Non', fan: 'Non' },
                    problem: 'Ventilateur du radiateur défectueux',
                    severity: 'high',
                    cost: '150€ - 350€',
                    description: 'Le ventilateur du radiateur ne fonctionne pas correctement.',
                    recommendation: 'Remplacer le ventilateur du radiateur.'
                },
                {
                    conditions: { overheating: 'Oui', coolant_leak: 'Non', fan: 'Oui' },
                    problem: 'Thermostat défectueux',
                    severity: 'moderate',
                    cost: '80€ - 200€',
                    description: 'Le thermostat ne s\'ouvre pas correctement.',
                    recommendation: 'Remplacer le thermostat.'
                },
                {
                    conditions: { overheating: 'Non', heater: 'Oui' },
                    problem: 'Pompe à eau défectueuse',
                    severity: 'moderate',
                    cost: '150€ - 350€',
                    description: 'La pompe à eau ne fait pas circuler le liquide.',
                    recommendation: 'Remplacer la pompe à eau.'
                },
                {
                    conditions: { overheating: 'Non', heater: 'Non' },
                    problem: 'Système de refroidissement en bon état',
                    severity: 'low',
                    cost: '0€',
                    description: 'Aucun problème évident détecté dans le système.',
                    recommendation: 'Effectuer un entretien préventif régulier.'
                }
            ],
            ar: [
                {
                    conditions: { overheating: 'نعم', coolant_leak: 'نعم' },
                    problem: 'تسرب في نظام التبريد',
                    severity: 'high',
                    cost: '100€ - 300€',
                    description: 'هناك تسرب في النظام يسبب السخونة المفرطة.',
                    recommendation: 'حدد موقع التسرب وأصلحه فورًا.'
                },
                {
                    conditions: { overheating: 'نعم', coolant_leak: 'لا', fan: 'لا' },
                    problem: 'مروحة الردياتير معطلة',
                    severity: 'high',
                    cost: '150€ - 350€',
                    description: 'مروحة الردياتير لا تعمل بشكل صحيح.',
                    recommendation: 'استبدل مروحة الردياتير.'
                },
                {
                    conditions: { overheating: 'نعم', coolant_leak: 'لا', fan: 'نعم' },
                    problem: 'منظم حرارة معطل',
                    severity: 'moderate',
                    cost: '80€ - 200€',
                    description: 'منظم الحرارة لا يفتح بشكل صحيح.',
                    recommendation: 'استبدل منظم الحرارة.'
                },
                {
                    conditions: { overheating: 'لا', heater: 'نعم' },
                    problem: 'مضخة المياه معطلة',
                    severity: 'moderate',
                    cost: '150€ - 350€',
                    description: 'مضخة المياه لا تضخ سائل التبريد.',
                    recommendation: 'استبدل مضخة المياه.'
                },
                {
                    conditions: { overheating: 'لا', heater: 'لا' },
                    problem: 'نظام التبريد في حالة جيدة',
                    severity: 'low',
                    cost: '0€',
                    description: 'لم يتم اكتشاف مشاكل واضحة في النظام.',
                    recommendation: 'قم بالصيانة الوقائية المنتظمة.'
                }
            ]
        }
    },
    electricidad: {
        questions: {
            es: [
                {
                    id: 'lights',
                    text: '¿Alguna luz no funciona?',
                    options: ['Sí', 'No']
                },
                {
                    id: 'fuses',
                    text: '¿Has revisado los fusibles?',
                    options: ['Sí', 'No', 'No lo sé']
                },
                {
                    id: 'accessories',
                    text: '¿Los accesorios eléctricos funcionan?',
                    options: ['Sí', 'No']
                },
                {
                    id: 'battery_warning',
                    text: '¿Hay luz de advertencia de batería?',
                    options: ['Sí', 'No']
                }
            ],
            en: [
                {
                    id: 'lights',
                    text: 'Are any lights not working?',
                    options: ['Yes', 'No']
                },
                {
                    id: 'fuses',
                    text: 'Have you checked the fuses?',
                    options: ['Yes', 'No', 'I don\'t know']
                },
                {
                    id: 'accessories',
                    text: 'Do electrical accessories work?',
                    options: ['Yes', 'No']
                },
                {
                    id: 'battery_warning',
                    text: 'Is there a battery warning light?',
                    options: ['Yes', 'No']
                }
            ],
            fr: [
                {
                    id: 'lights',
                    text: 'Y a-t-il des lumières qui ne fonctionnent pas?',
                    options: ['Oui', 'Non']
                },
                {
                    id: 'fuses',
                    text: 'Avez-vous vérifié les fusibles?',
                    options: ['Oui', 'Non', 'Je ne sais pas']
                },
                {
                    id: 'accessories',
                    text: 'Les accessoires électriques fonctionnent-ils?',
                    options: ['Oui', 'Non']
                },
                {
                    id: 'battery_warning',
                    text: 'Y a-t-il un voyant de batterie?',
                    options: ['Oui', 'Non']
                }
            ],
            ar: [
                {
                    id: 'lights',
                    text: 'هل هناك أضواء لا تعمل؟',
                    options: ['نعم', 'لا']
                },
                {
                    id: 'fuses',
                    text: 'هل فحصت الصمامات؟',
                    options: ['نعم', 'لا', 'لا أعرف']
                },
                {
                    id: 'accessories',
                    text: 'هل تعمل الملحقات الكهربائية؟',
                    options: ['نعم', 'لا']
                },
                {
                    id: 'battery_warning',
                    text: 'هل هناك ضوء تحذير البطارية؟',
                    options: ['نعم', 'لا']
                }
            ]
        },
        results: {
            es: [
                {
                    conditions: { lights: 'Sí', fuses: 'No' },
                    problem: 'Fusible fundido',
                    severity: 'low',
                    cost: '5€ - 20€',
                    description: 'Un fusible está fundido causando el fallo.',
                    recommendation: 'Revisar y reemplazar el fusible afectado.'
                },
                {
                    conditions: { lights: 'Sí', fuses: 'Sí' },
                    problem: 'Bombilla o LED defectuoso',
                    severity: 'low',
                    cost: '10€ - 50€',
                    description: 'La bombilla o LED está defectuoso.',
                    recommendation: 'Reemplazar la bombilla o LED afectado.'
                },
                {
                    conditions: { accessories: 'No', battery_warning: 'Sí' },
                    problem: 'Problema de carga',
                    severity: 'moderate',
                    cost: '150€ - 400€',
                    description: 'El sistema eléctrico no recibe carga adecuada.',
                    recommendation: 'Revisar el alternador y el sistema de carga.'
                },
                {
                    conditions: { accessories: 'No', battery_warning: 'No' },
                    problem: 'Cortocircuito o conexión floja',
                    severity: 'moderate',
                    cost: '50€ - 200€',
                    description: 'Hay un cortocircuito o conexión floja en el sistema.',
                    recommendation: 'Revisar el cableado y conexiones eléctricas.'
                },
                {
                    conditions: { lights: 'No', accessories: 'Sí' },
                    problem: 'Sistema eléctrico en buen estado',
                    severity: 'low',
                    cost: '0€',
                    description: 'No se detectaron problemas evidentes en el sistema eléctrico.',
                    recommendation: 'Realizar mantenimiento preventivo regular.'
                }
            ],
            en: [
                {
                    conditions: { lights: 'Yes', fuses: 'No' },
                    problem: 'Blown fuse',
                    severity: 'low',
                    cost: '5€ - 20€',
                    description: 'A fuse is blown causing the failure.',
                    recommendation: 'Check and replace the affected fuse.'
                },
                {
                    conditions: { lights: 'Yes', fuses: 'Yes' },
                    problem: 'Faulty bulb or LED',
                    severity: 'low',
                    cost: '10€ - 50€',
                    description: 'The bulb or LED is faulty.',
                    recommendation: 'Replace the affected bulb or LED.'
                },
                {
                    conditions: { accessories: 'No', battery_warning: 'Yes' },
                    problem: 'Charging problem',
                    severity: 'moderate',
                    cost: '150€ - 400€',
                    description: 'The electrical system is not receiving adequate charge.',
                    recommendation: 'Check the alternator and charging system.'
                },
                {
                    conditions: { accessories: 'No', battery_warning: 'No' },
                    problem: 'Short circuit or loose connection',
                    severity: 'moderate',
                    cost: '50€ - 200€',
                    description: 'There is a short circuit or loose connection in the system.',
                    recommendation: 'Check wiring and electrical connections.'
                },
                {
                    conditions: { lights: 'No', accessories: 'Yes' },
                    problem: 'Electrical system in good condition',
                    severity: 'low',
                    cost: '0€',
                    description: 'No evident problems detected in the electrical system.',
                    recommendation: 'Perform regular preventive maintenance.'
                }
            ],
            fr: [
                {
                    conditions: { lights: 'Oui', fuses: 'Non' },
                    problem: 'Fusible grillé',
                    severity: 'low',
                    cost: '5€ - 20€',
                    description: 'Un fusible est grillé causant la panne.',
                    recommendation: 'Vérifier et remplacer le fusible affecté.'
                },
                {
                    conditions: { lights: 'Oui', fuses: 'Oui' },
                    problem: 'Ampoule ou LED défectueuse',
                    severity: 'low',
                    cost: '10€ - 50€',
                    description: 'L\'ampoule ou LED est défectueuse.',
                    recommendation: 'Remplacer l\'ampoule ou LED affectée.'
                },
                {
                    conditions: { accessories: 'Non', battery_warning: 'Oui' },
                    problem: 'Problème de charge',
                    severity: 'moderate',
                    cost: '150€ - 400€',
                    description: 'Le système électrique ne reçoit pas de charge adéquate.',
                    recommendation: 'Vérifier l\'alternateur et le système de charge.'
                },
                {
                    conditions: { accessories: 'Non', battery_warning: 'Non' },
                    problem: 'Court-circuit ou connexion lâche',
                    severity: 'moderate',
                    cost: '50€ - 200€',
                    description: 'Il y a un court-circuit ou une connexion lâche dans le système.',
                    recommendation: 'Vérifier le câblage et les connexions électriques.'
                },
                {
                    conditions: { lights: 'Non', accessories: 'Oui' },
                    problem: 'Système électrique en bon état',
                    severity: 'low',
                    cost: '0€',
                    description: 'Aucun problème évident détecté dans le système électrique.',
                    recommendation: 'Effectuer un entretien préventif régulier.'
                }
            ],
            ar: [
                {
                    conditions: { lights: 'نعم', fuses: 'لا' },
                    problem: 'صمام محروق',
                    severity: 'low',
                    cost: '5€ - 20€',
                    description: 'صمام محروق يسبب الفشل.',
                    recommendation: 'افحص واستبدل الصمام المتأثر.'
                },
                {
                    conditions: { lights: 'نعم', fuses: 'نعم' },
                    problem: 'مصباح أو LED معطل',
                    severity: 'low',
                    cost: '10€ - 50€',
                    description: 'المصباح أو LED معطل.',
                    recommendation: 'استبدل المصباح أو LED المتأثر.'
                },
                {
                    conditions: { accessories: 'لا', battery_warning: 'نعم' },
                    problem: 'مشكلة في الشحن',
                    severity: 'moderate',
                    cost: '150€ - 400€',
                    description: 'النظام الكهربائي لا يتلقى شحنًا كافيًا.',
                    recommendation: 'افحص المولد ونظام الشحن.'
                },
                {
                    conditions: { accessories: 'لا', battery_warning: 'لا' },
                    problem: 'دائرة قصر أو اتصال مفكوك',
                    severity: 'moderate',
                    cost: '50€ - 200€',
                    description: 'هناك دائرة قصر أو اتصال مفكوك في النظام.',
                    recommendation: 'افحص التوصيلات والاتصالات الكهربائية.'
                },
                {
                    conditions: { lights: 'لا', accessories: 'نعم' },
                    problem: 'النظام الكهربائي في حالة جيدة',
                    severity: 'low',
                    cost: '0€',
                    description: 'لم يتم اكتشاف مشاكل واضحة في النظام الكهربائي.',
                    recommendation: 'قم بالصيانة الوقائية المنتظمة.'
                }
            ]
        }
    },
    escape: {
        questions: {
            es: [
                {
                    id: 'noise',
                    text: '¿Escuchas ruidos del escape?',
                    options: ['Sí', 'No']
                },
                {
                    id: 'smell',
                    text: '¿Hay olor a gasolina o escape?',
                    options: ['Sí', 'No']
                },
                {
                    id: 'performance',
                    text: '¿El coche tiene menos potencia?',
                    options: ['Sí', 'No']
                },
                {
                    id: 'emissions',
                    text: '¿El humo del escape es anormal?',
                    options: ['Sí', 'No']
                }
            ],
            en: [
                {
                    id: 'noise',
                    text: 'Do you hear exhaust noises?',
                    options: ['Yes', 'No']
                },
                {
                    id: 'smell',
                    text: 'Is there a gasoline or exhaust smell?',
                    options: ['Yes', 'No']
                },
                {
                    id: 'performance',
                    text: 'Does the car have less power?',
                    options: ['Yes', 'No']
                },
                {
                    id: 'emissions',
                    text: 'Is the exhaust smoke abnormal?',
                    options: ['Yes', 'No']
                }
            ],
            fr: [
                {
                    id: 'noise',
                    text: 'Entendez-vous des bruits d\'échappement?',
                    options: ['Oui', 'Non']
                },
                {
                    id: 'smell',
                    text: 'Y a-t-il une odeur d\'essence ou d\'échappement?',
                    options: ['Oui', 'Non']
                },
                {
                    id: 'performance',
                    text: 'La voiture a-t-elle moins de puissance?',
                    options: ['Oui', 'Non']
                },
                {
                    id: 'emissions',
                    text: 'La fumée d\'échappement est-elle anormale?',
                    options: ['Oui', 'Non']
                }
            ],
            ar: [
                {
                    id: 'noise',
                    text: 'هل تسمع أصوات من العادم؟',
                    options: ['نعم', 'لا']
                },
                {
                    id: 'smell',
                    text: 'هل هناك رائحة بنزين أو عادم؟',
                    options: ['نعم', 'لا']
                },
                {
                    id: 'performance',
                    text: 'هل السيارة لديها قوة أقل؟',
                    options: ['نعم', 'لا']
                },
                {
                    id: 'emissions',
                    text: 'هل دخان العادم غير طبيعي؟',
                    options: ['نعم', 'لا']
                }
            ]
        },
        results: {
            es: [
                {
                    conditions: { noise: 'Sí', smell: 'Sí' },
                    problem: 'Fuga en el escape',
                    severity: 'moderate',
                    cost: '100€ - 300€',
                    description: 'Hay una fuga en el sistema de escape.',
                    recommendation: 'Localizar y reparar la fuga del escape.'
                },
                {
                    conditions: { noise: 'Sí', smell: 'No' },
                    problem: 'Silenciador dañado',
                    severity: 'low',
                    cost: '80€ - 200€',
                    description: 'El silenciador está dañado o corroído.',
                    recommendation: 'Reemplazar el silenciador.'
                },
                {
                    conditions: { performance: 'Sí', emissions: 'Sí' },
                    problem: 'Catalizador obstruido',
                    severity: 'high',
                    cost: '300€ - 800€',
                    description: 'El catalizador está obstruido afectando el rendimiento.',
                    recommendation: 'Reemplazar el catalizador.'
                },
                {
                    conditions: { performance: 'Sí', emissions: 'No' },
                    problem: 'Tubo de escape obstruido',
                    severity: 'moderate',
                    cost: '100€ - 250€',
                    description: 'Un tubo del escape está obstruido.',
                    recommendation: 'Revisar y limpiar el sistema de escape.'
                },
                {
                    conditions: { noise: 'No', smell: 'No', performance: 'No', emissions: 'No' },
                    problem: 'Sistema de escape en buen estado',
                    severity: 'low',
                    cost: '0€',
                    description: 'No se detectaron problemas evidentes en el escape.',
                    recommendation: 'Realizar mantenimiento preventivo regular.'
                }
            ],
            en: [
                {
                    conditions: { noise: 'Yes', smell: 'Yes' },
                    problem: 'Exhaust leak',
                    severity: 'moderate',
                    cost: '100€ - 300€',
                    description: 'There is a leak in the exhaust system.',
                    recommendation: 'Locate and repair the exhaust leak.'
                },
                {
                    conditions: { noise: 'Yes', smell: 'No' },
                    problem: 'Damaged muffler',
                    severity: 'low',
                    cost: '80€ - 200€',
                    description: 'The muffler is damaged or corroded.',
                    recommendation: 'Replace the muffler.'
                },
                {
                    conditions: { performance: 'Yes', emissions: 'Yes' },
                    problem: 'Clogged catalytic converter',
                    severity: 'high',
                    cost: '300€ - 800€',
                    description: 'The catalytic converter is clogged affecting performance.',
                    recommendation: 'Replace the catalytic converter.'
                },
                {
                    conditions: { performance: 'Yes', emissions: 'No' },
                    problem: 'Clogged exhaust pipe',
                    severity: 'moderate',
                    cost: '100€ - 250€',
                    description: 'An exhaust pipe is clogged.',
                    recommendation: 'Check and clean the exhaust system.'
                },
                {
                    conditions: { noise: 'No', smell: 'No', performance: 'No', emissions: 'No' },
                    problem: 'Exhaust system in good condition',
                    severity: 'low',
                    cost: '0€',
                    description: 'No evident problems detected in the exhaust.',
                    recommendation: 'Perform regular preventive maintenance.'
                }
            ],
            fr: [
                {
                    conditions: { noise: 'Oui', smell: 'Oui' },
                    problem: 'Fuite d\'échappement',
                    severity: 'moderate',
                    cost: '100€ - 300€',
                    description: 'Il y a une fuite dans le système d\'échappement.',
                    recommendation: 'Localiser et réparer la fuite d\'échappement.'
                },
                {
                    conditions: { noise: 'Oui', smell: 'Non' },
                    problem: 'Silencieux endommagé',
                    severity: 'low',
                    cost: '80€ - 200€',
                    description: 'Le silencieux est endommagé ou corrodé.',
                    recommendation: 'Remplacer le silencieux.'
                },
                {
                    conditions: { performance: 'Oui', emissions: 'Oui' },
                    problem: 'Catalyseur bouché',
                    severity: 'high',
                    cost: '300€ - 800€',
                    description: 'Le catalyseur est bouché affectant les performances.',
                    recommendation: 'Remplacer le catalyseur.'
                },
                {
                    conditions: { performance: 'Oui', emissions: 'Non' },
                    problem: 'Tuyau d\'échappement bouché',
                    severity: 'moderate',
                    cost: '100€ - 250€',
                    description: 'Un tuyau d\'échappement est bouché.',
                    recommendation: 'Vérifier et nettoyer le système d\'échappement.'
                },
                {
                    conditions: { noise: 'Non', smell: 'Non', performance: 'Non', emissions: 'Non' },
                    problem: 'Système d\'échappement en bon état',
                    severity: 'low',
                    cost: '0€',
                    description: 'Aucun problème évident détecté dans l\'échappement.',
                    recommendation: 'Effectuer un entretien préventif régulier.'
                }
            ],
            ar: [
                {
                    conditions: { noise: 'نعم', smell: 'نعم' },
                    problem: 'تسرب في العادم',
                    severity: 'moderate',
                    cost: '100€ - 300€',
                    description: 'هناك تسرب في نظام العادم.',
                    recommendation: 'حدد موقع التسرب وأصلحه.'
                },
                {
                    conditions: { noise: 'نعم', smell: 'لا' },
                    problem: 'صامت تالف',
                    severity: 'low',
                    cost: '80€ - 200€',
                    description: 'الصامت تالف أو متآكل.',
                    recommendation: 'استبدل الصامت.'
                },
                {
                    conditions: { performance: 'نعم', emissions: 'نعم' },
                    problem: 'محفز مسدود',
                    severity: 'high',
                    cost: '300€ - 800€',
                    description: 'المحفز مسدود يؤثر على الأداء.',
                    recommendation: 'استبدل المحفز.'
                },
                {
                    conditions: { performance: 'نعم', emissions: 'لا' },
                    problem: 'أنبوب عادم مسدود',
                    severity: 'moderate',
                    cost: '100€ - 250€',
                    description: 'أنبوب عادم مسدود.',
                    recommendation: 'افحص ونظف نظام العادم.'
                },
                {
                    conditions: { noise: 'لا', smell: 'لا', performance: 'لا', emissions: 'لا' },
                    problem: 'نظام العادم في حالة جيدة',
                    severity: 'low',
                    cost: '0€',
                    description: 'لم يتم اكتشاف مشاكل واضحة في العادم.',
                    recommendation: 'قم بالصيانة الوقائية المنتظمة.'
                }
            ]
        }
    },
    direccion: {
        questions: {
            es: [
                {
                    id: 'steering_wheel',
                    text: '¿El volante vibra al conducir?',
                    options: ['Sí', 'No']
                },
                {
                    id: 'steering_response',
                    text: '¿La dirección responde lentamente?',
                    options: ['Sí', 'No']
                },
                {
                    id: 'noise_turning',
                    text: '¿Escuchas ruidos al girar?',
                    options: ['Sí', 'No']
                },
                {
                    id: 'fluid_level',
                    text: '¿Has revisado el nivel de fluido de dirección?',
                    options: ['Sí', 'No', 'No lo sé']
                }
            ],
            en: [
                {
                    id: 'steering_wheel',
                    text: 'Does the steering wheel vibrate while driving?',
                    options: ['Yes', 'No']
                },
                {
                    id: 'steering_response',
                    text: 'Does the steering respond slowly?',
                    options: ['Yes', 'No']
                },
                {
                    id: 'noise_turning',
                    text: 'Do you hear noises when turning?',
                    options: ['Yes', 'No']
                },
                {
                    id: 'fluid_level',
                    text: 'Have you checked the power steering fluid level?',
                    options: ['Yes', 'No', 'I don\'t know']
                }
            ],
            fr: [
                {
                    id: 'steering_wheel',
                    text: 'Le volant vibre-t-il en conduisant?',
                    options: ['Oui', 'Non']
                },
                {
                    id: 'steering_response',
                    text: 'La direction répond-elle lentement?',
                    options: ['Oui', 'Non']
                },
                {
                    id: 'noise_turning',
                    text: 'Entendez-vous des bruits en tournant?',
                    options: ['Oui', 'Non']
                },
                {
                    id: 'fluid_level',
                    text: 'Avez-vous vérifié le niveau de liquide de direction?',
                    options: ['Oui', 'Non', 'Je ne sais pas']
                }
            ],
            ar: [
                {
                    id: 'steering_wheel',
                    text: 'هل يهتز عجلة القيادة أثناء القيادة؟',
                    options: ['نعم', 'لا']
                },
                {
                    id: 'steering_response',
                    text: 'هل تستجيب التوجيه ببطء؟',
                    options: ['نعم', 'لا']
                },
                {
                    id: 'noise_turning',
                    text: 'هل تسمع أصوات عند التدوير؟',
                    options: ['نعم', 'لا']
                },
                {
                    id: 'fluid_level',
                    text: 'هل فحصت مستوى سائل التوجيه المعزز؟',
                    options: ['نعم', 'لا', 'لا أعرف']
                }
            ]
        },
        results: {
            es: [
                {
                    conditions: { steering_wheel: 'Sí', noise_turning: 'Sí' },
                    problem: 'Brazos de dirección desgastados',
                    severity: 'moderate',
                    cost: '150€ - 350€',
                    description: 'Los brazos de dirección están desgastados.',
                    recommendation: 'Reemplazar los brazos de dirección afectados.'
                },
                {
                    conditions: { steering_response: 'Sí', fluid_level: 'No' },
                    problem: 'Nivel bajo de fluido de dirección',
                    severity: 'moderate',
                    cost: '30€ - 80€',
                    description: 'El fluido de dirección asistida está bajo.',
                    recommendation: 'Rellenar el fluido de dirección y revisar fugas.'
                },
                {
                    conditions: { steering_response: 'Sí', fluid_level: 'Sí' },
                    problem: 'Bomba de dirección defectuosa',
                    severity: 'high',
                    cost: '300€ - 600€',
                    description: 'La bomba de dirección asistida está defectuosa.',
                    recommendation: 'Reemplazar la bomba de dirección.'
                },
                {
                    conditions: { steering_wheel: 'Sí', noise_turning: 'No' },
                    problem: 'Alineación incorrecta',
                    severity: 'low',
                    cost: '50€ - 100€',
                    description: 'La alineación de las ruedas está incorrecta.',
                    recommendation: 'Realizar alineación de ruedas.'
                },
                {
                    conditions: { steering_wheel: 'No', steering_response: 'No', noise_turning: 'No' },
                    problem: 'Dirección en buen estado',
                    severity: 'low',
                    cost: '0€',
                    description: 'No se detectaron problemas evidentes en la dirección.',
                    recommendation: 'Realizar mantenimiento preventivo regular.'
                }
            ],
            en: [
                {
                    conditions: { steering_wheel: 'Yes', noise_turning: 'Yes' },
                    problem: 'Worn steering arms',
                    severity: 'moderate',
                    cost: '150€ - 350€',
                    description: 'The steering arms are worn.',
                    recommendation: 'Replace the affected steering arms.'
                },
                {
                    conditions: { steering_response: 'Yes', fluid_level: 'No' },
                    problem: 'Low power steering fluid',
                    severity: 'moderate',
                    cost: '30€ - 80€',
                    description: 'The power steering fluid is low.',
                    recommendation: 'Top up power steering fluid and check for leaks.'
                },
                {
                    conditions: { steering_response: 'Yes', fluid_level: 'Yes' },
                    problem: 'Faulty steering pump',
                    severity: 'high',
                    cost: '300€ - 600€',
                    description: 'The power steering pump is faulty.',
                    recommendation: 'Replace the steering pump.'
                },
                {
                    conditions: { steering_wheel: 'Yes', noise_turning: 'No' },
                    problem: 'Incorrect alignment',
                    severity: 'low',
                    cost: '50€ - 100€',
                    description: 'The wheel alignment is incorrect.',
                    recommendation: 'Perform wheel alignment.'
                },
                {
                    conditions: { steering_wheel: 'No', steering_response: 'No', noise_turning: 'No' },
                    problem: 'Steering in good condition',
                    severity: 'low',
                    cost: '0€',
                    description: 'No evident problems detected in the steering.',
                    recommendation: 'Perform regular preventive maintenance.'
                }
            ],
            fr: [
                {
                    conditions: { steering_wheel: 'Oui', noise_turning: 'Oui' },
                    problem: 'Bras de direction usés',
                    severity: 'moderate',
                    cost: '150€ - 350€',
                    description: 'Les bras de direction sont usés.',
                    recommendation: 'Remplacer les bras de direction affectés.'
                },
                {
                    conditions: { steering_response: 'Oui', fluid_level: 'Non' },
                    problem: 'Niveau bas de liquide de direction',
                    severity: 'moderate',
                    cost: '30€ - 80€',
                    description: 'Le liquide de direction assistée est bas.',
                    recommendation: 'Remplir le liquide de direction et vérifier les fuites.'
                },
                {
                    conditions: { steering_response: 'Oui', fluid_level: 'Oui' },
                    problem: 'Pompe de direction défectueuse',
                    severity: 'high',
                    cost: '300€ - 600€',
                    description: 'La pompe de direction assistée est défectueuse.',
                    recommendation: 'Remplacer la pompe de direction.'
                },
                {
                    conditions: { steering_wheel: 'Oui', noise_turning: 'Non' },
                    problem: 'Alignement incorrect',
                    severity: 'low',
                    cost: '50€ - 100€',
                    description: 'L\'alignement des roues est incorrect.',
                    recommendation: 'Effectuer un alignement des roues.'
                },
                {
                    conditions: { steering_wheel: 'Non', steering_response: 'Non', noise_turning: 'Non' },
                    problem: 'Direction en bon état',
                    severity: 'low',
                    cost: '0€',
                    description: 'Aucun problème évident détecté dans la direction.',
                    recommendation: 'Effectuer un entretien préventif régulier.'
                }
            ],
            ar: [
                {
                    conditions: { steering_wheel: 'نعم', noise_turning: 'نعم' },
                    problem: 'أذرع توجيه متآكلة',
                    severity: 'moderate',
                    cost: '150€ - 350€',
                    description: 'أذرع التوجيه متآكلة.',
                    recommendation: 'استبدل أذرع التوجيه المتأثرة.'
                },
                {
                    conditions: { steering_response: 'نعم', fluid_level: 'لا' },
                    problem: 'مستوى منخفض من سائل التوجيه',
                    severity: 'moderate',
                    cost: '30€ - 80€',
                    description: 'سائل التوجيه المعزز منخفض.',
                    recommendation: 'املأ سائل التوجيه وافحص التسريبات.'
                },
                {
                    conditions: { steering_response: 'نعم', fluid_level: 'نعم' },
                    problem: 'مضخة توجيه معطلة',
                    severity: 'high',
                    cost: '300€ - 600€',
                    description: 'مضخة التوجيه المعزز معطلة.',
                    recommendation: 'استبدل مضخة التوجيه.'
                },
                {
                    conditions: { steering_wheel: 'نعم', noise_turning: 'لا' },
                    problem: 'محاذاة غير صحيحة',
                    severity: 'low',
                    cost: '50€ - 100€',
                    description: 'محاذاة العجلات غير صحيحة.',
                    recommendation: 'قم بمحاذاة العجلات.'
                },
                {
                    conditions: { steering_wheel: 'لا', steering_response: 'لا', noise_turning: 'لا' },
                    problem: 'التوجيه في حالة جيدة',
                    severity: 'low',
                    cost: '0€',
                    description: 'لم يتم اكتشاف مشاكل واضحة في التوجيه.',
                    recommendation: 'قم بالصيانة الوقائية المنتظمة.'
                }
            ]
        }
    },
    aire: {
        questions: {
            es: [
                {
                    id: 'cooling',
                    text: '¿El aire acondicionado enfría?',
                    options: ['Sí', 'No']
                },
                {
                    id: 'airflow',
                    text: '¿El flujo de aire es débil?',
                    options: ['Sí', 'No']
                },
                {
                    id: 'noise',
                    text: '¿Escuchas ruidos extraños?',
                    options: ['Sí', 'No']
                },
                {
                    id: 'smell',
                    text: '¿Hay olor extraño del aire?',
                    options: ['Sí', 'No']
                }
            ],
            en: [
                {
                    id: 'cooling',
                    text: 'Does the air conditioning cool?',
                    options: ['Yes', 'No']
                },
                {
                    id: 'airflow',
                    text: 'Is the airflow weak?',
                    options: ['Yes', 'No']
                },
                {
                    id: 'noise',
                    text: 'Do you hear strange noises?',
                    options: ['Yes', 'No']
                },
                {
                    id: 'smell',
                    text: 'Is there a strange smell from the air?',
                    options: ['Yes', 'No']
                }
            ],
            fr: [
                {
                    id: 'cooling',
                    text: 'La climatisation refroidit-elle?',
                    options: ['Oui', 'Non']
                },
                {
                    id: 'airflow',
                    text: 'Le flux d\'air est-il faible?',
                    options: ['Oui', 'Non']
                },
                {
                    id: 'noise',
                    text: 'Entendez-vous des bruits étranges?',
                    options: ['Oui', 'Non']
                },
                {
                    id: 'smell',
                    text: 'Y a-t-il une odeur étrange de l\'air?',
                    options: ['Oui', 'Non']
                }
            ],
            ar: [
                {
                    id: 'cooling',
                    text: 'هل مكيف الهواء يبرد؟',
                    options: ['نعم', 'لا']
                },
                {
                    id: 'airflow',
                    text: 'هل تدفق الهواء ضعيف؟',
                    options: ['نعم', 'لا']
                },
                {
                    id: 'noise',
                    text: 'هل تسمع أصوات غريبة؟',
                    options: ['نعم', 'لا']
                },
                {
                    id: 'smell',
                    text: 'هل هناك رائحة غريبة من الهواء؟',
                    options: ['نعم', 'لا']
                }
            ]
        },
        results: {
            es: [
                {
                    conditions: { cooling: 'No', noise: 'No' },
                    problem: 'Refrigerante bajo o fugas',
                    severity: 'moderate',
                    cost: '80€ - 200€',
                    description: 'El sistema de climatización tiene bajo nivel de refrigerante.',
                    recommendation: 'Revisar fugas y recargar el sistema de climatización.'
                },
                {
                    conditions: { cooling: 'No', noise: 'Sí' },
                    problem: 'Compresor defectuoso',
                    severity: 'high',
                    cost: '300€ - 700€',
                    description: 'El compresor del aire acondicionado está defectuoso.',
                    recommendation: 'Reemplazar el compresor del aire acondicionado.'
                },
                {
                    conditions: { cooling: 'Sí', airflow: 'Sí' },
                    problem: 'Filtro de aire de cabina obstruido',
                    severity: 'low',
                    cost: '20€ - 50€',
                    description: 'El filtro de aire de cabina está obstruido.',
                    recommendation: 'Reemplazar el filtro de aire de cabina.'
                },
                {
                    conditions: { cooling: 'Sí', smell: 'Sí' },
                    problem: 'Moho o bacterias en el sistema',
                    severity: 'low',
                    cost: '30€ - 80€',
                    description: 'Hay moho o bacterias en el sistema de climatización.',
                    recommendation: 'Realizar limpieza del sistema de climatización.'
                },
                {
                    conditions: { cooling: 'Sí', airflow: 'No', smell: 'No', noise: 'No' },
                    problem: 'Motor del ventilador defectuoso',
                    severity: 'moderate',
                    cost: '100€ - 250€',
                    description: 'El motor del ventilador está defectuoso.',
                    recommendation: 'Reemplazar el motor del ventilador.'
                },
                {
                    conditions: { cooling: 'Sí', airflow: 'No', smell: 'No', noise: 'No' },
                    problem: 'Aire acondicionado en buen estado',
                    severity: 'low',
                    cost: '0€',
                    description: 'No se detectaron problemas evidentes en el aire acondicionado.',
                    recommendation: 'Realizar mantenimiento preventivo regular.'
                }
            ],
            en: [
                {
                    conditions: { cooling: 'No', noise: 'No' },
                    problem: 'Low refrigerant or leaks',
                    severity: 'moderate',
                    cost: '80€ - 200€',
                    description: 'The air conditioning system has low refrigerant level.',
                    recommendation: 'Check for leaks and recharge the air conditioning system.'
                },
                {
                    conditions: { cooling: 'No', noise: 'Yes' },
                    problem: 'Faulty compressor',
                    severity: 'high',
                    cost: '300€ - 700€',
                    description: 'The air conditioning compressor is faulty.',
                    recommendation: 'Replace the air conditioning compressor.'
                },
                {
                    conditions: { cooling: 'Yes', airflow: 'Yes' },
                    problem: 'Clogged cabin air filter',
                    severity: 'low',
                    cost: '20€ - 50€',
                    description: 'The cabin air filter is clogged.',
                    recommendation: 'Replace the cabin air filter.'
                },
                {
                    conditions: { cooling: 'Yes', smell: 'Yes' },
                    problem: 'Mold or bacteria in the system',
                    severity: 'low',
                    cost: '30€ - 80€',
                    description: 'There is mold or bacteria in the air conditioning system.',
                    recommendation: 'Perform air conditioning system cleaning.'
                },
                {
                    conditions: { cooling: 'Yes', airflow: 'No', smell: 'No', noise: 'No' },
                    problem: 'Faulty fan motor',
                    severity: 'moderate',
                    cost: '100€ - 250€',
                    description: 'The fan motor is faulty.',
                    recommendation: 'Replace the fan motor.'
                },
                {
                    conditions: { cooling: 'Yes', airflow: 'No', smell: 'No', noise: 'No' },
                    problem: 'Air conditioning in good condition',
                    severity: 'low',
                    cost: '0€',
                    description: 'No evident problems detected in the air conditioning.',
                    recommendation: 'Perform regular preventive maintenance.'
                }
            ],
            fr: [
                {
                    conditions: { cooling: 'Non', noise: 'Non' },
                    problem: 'Faible niveau de réfrigérant ou fuites',
                    severity: 'moderate',
                    cost: '80€ - 200€',
                    description: 'Le système de climatisation a un faible niveau de réfrigérant.',
                    recommendation: 'Vérifier les fuites et recharger le système de climatisation.'
                },
                {
                    conditions: { cooling: 'Non', noise: 'Oui' },
                    problem: 'Compresseur défectueux',
                    severity: 'high',
                    cost: '300€ - 700€',
                    description: 'Le compresseur de climatisation est défectueux.',
                    recommendation: 'Remplacer le compresseur de climatisation.'
                },
                {
                    conditions: { cooling: 'Oui', airflow: 'Oui' },
                    problem: 'Filtre d\'habitacle bouché',
                    severity: 'low',
                    cost: '20€ - 50€',
                    description: 'Le filtre d\'habitacle est bouché.',
                    recommendation: 'Remplacer le filtre d\'habitacle.'
                },
                {
                    conditions: { cooling: 'Oui', smell: 'Oui' },
                    problem: 'Moisissure ou bactéries dans le système',
                    severity: 'low',
                    cost: '30€ - 80€',
                    description: 'Il y a des moisissures ou des bactéries dans le système de climatisation.',
                    recommendation: 'Effectuer le nettoyage du système de climatisation.'
                },
                {
                    conditions: { cooling: 'Oui', airflow: 'Non', smell: 'Non', noise: 'Non' },
                    problem: 'Moteur de ventilateur défectueux',
                    severity: 'moderate',
                    cost: '100€ - 250€',
                    description: 'Le moteur du ventilateur est défectueux.',
                    recommendation: 'Remplacer le moteur du ventilateur.'
                },
                {
                    conditions: { cooling: 'Oui', airflow: 'Non', smell: 'Non', noise: 'Non' },
                    problem: 'Climatisation en bon état',
                    severity: 'low',
                    cost: '0€',
                    description: 'Aucun problème évident détecté dans la climatisation.',
                    recommendation: 'Effectuer un entretien préventif régulier.'
                }
            ],
            ar: [
                {
                    conditions: { cooling: 'لا', noise: 'لا' },
                    problem: 'مستوى منخفض من المبرد أو تسريبات',
                    severity: 'moderate',
                    cost: '80€ - 200€',
                    description: 'نظام التكييف لديه مستوى منخفض من المبرد.',
                    recommendation: 'افحص التسريبات وأعد شحن نظام التكييف.'
                },
                {
                    conditions: { cooling: 'لا', noise: 'نعم' },
                    problem: 'ضاغط معطل',
                    severity: 'high',
                    cost: '300€ - 700€',
                    description: 'ضاغط مكيف الهواء معطل.',
                    recommendation: 'استبدل ضاغط مكيف الهواء.'
                },
                {
                    conditions: { cooling: 'نعم', airflow: 'نعم' },
                    problem: 'فلتر هواء المقصورة مسدود',
                    severity: 'low',
                    cost: '20€ - 50€',
                    description: 'فلتر هواء المقصورة مسدود.',
                    recommendation: 'استبدل فلتر هواء المقصورة.'
                },
                {
                    conditions: { cooling: 'نعم', smell: 'نعم' },
                    problem: 'عفن أو بكتيريا في النظام',
                    severity: 'low',
                    cost: '30€ - 80€',
                    description: 'هناك عفن أو بكتيريا في نظام التكييف.',
                    recommendation: 'قم بتنظيف نظام التكييف.'
                },
                {
                    conditions: { cooling: 'نعم', airflow: 'لا', smell: 'لا', noise: 'لا' },
                    problem: 'محرك مروحة معطل',
                    severity: 'moderate',
                    cost: '100€ - 250€',
                    description: 'محرك المروحة معطل.',
                    recommendation: 'استبدل محرك المروحة.'
                },
                {
                    conditions: { cooling: 'نعم', airflow: 'لا', smell: 'لا', noise: 'لا' },
                    problem: 'مكيف الهواء في حالة جيدة',
                    severity: 'low',
                    cost: '0€',
                    description: 'لم يتم اكتشاف مشاكل واضحة في مكيف الهواء.',
                    recommendation: 'قم بالصيانة الوقائية المنتظمة.'
                }
            ]
        }
    },
    neumaticos: {
        questions: {
            es: [
                {
                    id: 'wear',
                    text: '¿Los neumáticos están desgastados de forma irregular?',
                    options: ['Sí', 'No']
                },
                {
                    id: 'pressure',
                    text: '¿La presión de los neumáticos es correcta?',
                    options: ['Sí', 'No', 'No lo sé']
                },
                {
                    id: 'vibration',
                    text: '¿Sientes vibración al conducir?',
                    options: ['Sí', 'No']
                },
                {
                    id: 'noise',
                    text: '¿Escuchas ruidos de los neumáticos?',
                    options: ['Sí', 'No']
                }
            ],
            en: [
                {
                    id: 'wear',
                    text: 'Are the tires worn unevenly?',
                    options: ['Yes', 'No']
                },
                {
                    id: 'pressure',
                    text: 'Is the tire pressure correct?',
                    options: ['Yes', 'No', 'I don\'t know']
                },
                {
                    id: 'vibration',
                    text: 'Do you feel vibration while driving?',
                    options: ['Yes', 'No']
                },
                {
                    id: 'noise',
                    text: 'Do you hear tire noises?',
                    options: ['Yes', 'No']
                }
            ],
            fr: [
                {
                    id: 'wear',
                    text: 'Les pneus sont-ils usés de manière irrégulière?',
                    options: ['Oui', 'Non']
                },
                {
                    id: 'pressure',
                    text: 'La pression des pneus est-elle correcte?',
                    options: ['Oui', 'Non', 'Je ne sais pas']
                },
                {
                    id: 'vibration',
                    text: 'Ressentez-vous des vibrations en conduisant?',
                    options: ['Oui', 'Non']
                },
                {
                    id: 'noise',
                    text: 'Entendez-vous des bruits de pneus?',
                    options: ['Oui', 'Non']
                }
            ],
            ar: [
                {
                    id: 'wear',
                    text: 'هل الإطارات متآكلة بشكل غير منتظم؟',
                    options: ['نعم', 'لا']
                },
                {
                    id: 'pressure',
                    text: 'هل ضغط الإطارات صحيح؟',
                    options: ['نعم', 'لا', 'لا أعرف']
                },
                {
                    id: 'vibration',
                    text: 'هل تشعر بالاهتزاز أثناء القيادة؟',
                    options: ['نعم', 'لا']
                },
                {
                    id: 'noise',
                    text: 'هل تسمع أصوات من الإطارات؟',
                    options: ['نعم', 'لا']
                }
            ]
        },
        results: {
            es: [
                {
                    conditions: { wear: 'Sí', pressure: 'No' },
                    problem: 'Desgaste irregular por mala presión',
                    severity: 'moderate',
                    cost: '30€ - 80€',
                    description: 'La presión incorrecta causa desgaste desigual en los neumáticos.',
                    recommendation: 'Ajustar la presión de los neumáticos y revisar alineación.'
                },
                {
                    conditions: { wear: 'Sí', vibration: 'Sí' },
                    problem: 'Desbalanceo de ruedas',
                    severity: 'low',
                    cost: '20€ - 50€',
                    description: 'Las ruedas necesitan balanceo.',
                    recommendation: 'Realizar balanceo de ruedas.'
                },
                {
                    conditions: { vibration: 'Sí', wear: 'No' },
                    problem: 'Alineación incorrecta',
                    severity: 'moderate',
                    cost: '50€ - 100€',
                    description: 'La alineación incorrecta causa vibración.',
                    recommendation: 'Realizar alineación de ruedas.'
                },
                {
                    conditions: { pressure: 'No', vibration: 'No', wear: 'No' },
                    problem: 'Presión de neumáticos baja',
                    severity: 'low',
                    cost: '0€ - 10€',
                    description: 'Los neumáticos tienen baja presión.',
                    recommendation: 'Inflar los neumáticos a la presión recomendada.'
                },
                {
                    conditions: { wear: 'No', pressure: 'Sí', vibration: 'No', noise: 'No' },
                    problem: 'Neumáticos en buen estado',
                    severity: 'low',
                    cost: '0€',
                    description: 'Los neumáticos están en buen estado.',
                    recommendation: 'Continuar con mantenimiento regular.'
                }
            ],
            en: [
                {
                    conditions: { wear: 'Yes', pressure: 'No' },
                    problem: 'Uneven wear due to bad pressure',
                    severity: 'moderate',
                    cost: '30€ - 80€',
                    description: 'Incorrect pressure causes uneven tire wear.',
                    recommendation: 'Adjust tire pressure and check alignment.'
                },
                {
                    conditions: { wear: 'Yes', vibration: 'Yes' },
                    problem: 'Wheel imbalance',
                    severity: 'low',
                    cost: '20€ - 50€',
                    description: 'The wheels need balancing.',
                    recommendation: 'Perform wheel balancing.'
                },
                {
                    conditions: { vibration: 'Yes', wear: 'No' },
                    problem: 'Incorrect alignment',
                    severity: 'moderate',
                    cost: '50€ - 100€',
                    description: 'Incorrect alignment causes vibration.',
                    recommendation: 'Perform wheel alignment.'
                },
                {
                    conditions: { pressure: 'No', vibration: 'No', wear: 'No' },
                    problem: 'Low tire pressure',
                    severity: 'low',
                    cost: '0€ - 10€',
                    description: 'The tires have low pressure.',
                    recommendation: 'Inflate tires to recommended pressure.'
                },
                {
                    conditions: { wear: 'No', pressure: 'Yes', vibration: 'No', noise: 'No' },
                    problem: 'Tires in good condition',
                    severity: 'low',
                    cost: '0€',
                    description: 'The tires are in good condition.',
                    recommendation: 'Continue with regular maintenance.'
                }
            ],
            fr: [
                {
                    conditions: { wear: 'Oui', pressure: 'Non' },
                    problem: 'Usure irrégulière due à une mauvaise pression',
                    severity: 'moderate',
                    cost: '30€ - 80€',
                    description: 'Une pression incorrecte cause une usure inégale des pneus.',
                    recommendation: 'Ajuster la pression des pneus et vérifier l\'alignement.'
                },
                {
                    conditions: { wear: 'Oui', vibration: 'Oui' },
                    problem: 'Déséquilibre des roues',
                    severity: 'low',
                    cost: '20€ - 50€',
                    description: 'Les roues ont besoin d\'équilibrage.',
                    recommendation: 'Effectuer l\'équilibrage des roues.'
                },
                {
                    conditions: { vibration: 'Oui', wear: 'Non' },
                    problem: 'Alignement incorrect',
                    severity: 'moderate',
                    cost: '50€ - 100€',
                    description: 'Un alignement incorrect cause des vibrations.',
                    recommendation: 'Effectuer l\'alignement des roues.'
                },
                {
                    conditions: { pressure: 'Non', vibration: 'Non', wear: 'Non' },
                    problem: 'Pression des pneus basse',
                    severity: 'low',
                    cost: '0€ - 10€',
                    description: 'Les pneus ont une pression basse.',
                    recommendation: 'Gonfler les pneus à la pression recommandée.'
                },
                {
                    conditions: { wear: 'Non', pressure: 'Oui', vibration: 'Non', noise: 'Non' },
                    problem: 'Pneus en bon état',
                    severity: 'low',
                    cost: '0€',
                    description: 'Les pneus sont en bon état.',
                    recommendation: 'Continuer avec l\'entretien régulier.'
                }
            ],
            ar: [
                {
                    conditions: { wear: 'نعم', pressure: 'لا' },
                    problem: 'تآكل غير منتظم بسبب ضغط سيء',
                    severity: 'moderate',
                    cost: '30€ - 80€',
                    description: 'الضغط غير الصحيح يسبب تآكلًا غير متساوٍ للإطارات.',
                    recommendation: 'اضبط ضغط الإطارات وافحص المحاذاة.'
                },
                {
                    conditions: { wear: 'نعم', vibration: 'نعم' },
                    problem: 'عدم توازن العجلات',
                    severity: 'low',
                    cost: '20€ - 50€',
                    description: 'العجلات تحتاج إلى توازن.',
                    recommendation: 'قم بموازنة العجلات.'
                },
                {
                    conditions: { vibration: 'نعم', wear: 'لا' },
                    problem: 'محاذاة غير صحيحة',
                    severity: 'moderate',
                    cost: '50€ - 100€',
                    description: 'المحاذاة غير الصحيحة تسبب الاهتزاز.',
                    recommendation: 'قم بمحاذاة العجلات.'
                },
                {
                    conditions: { pressure: 'لا', vibration: 'لا', wear: 'لا' },
                    problem: 'ضغط الإطارات منخفض',
                    severity: 'low',
                    cost: '0€ - 10€',
                    description: 'الإطارات لديها ضغط منخفض.',
                    recommendation: 'انفخ الإطارات إلى الضغط الموصى به.'
                },
                {
                    conditions: { wear: 'لا', pressure: 'نعم', vibration: 'لا', noise: 'لا' },
                    problem: 'الإطارات في حالة جيدة',
                    severity: 'low',
                    cost: '0€',
                    description: 'الإطارات في حالة جيدة.',
                    recommendation: 'استمر في الصيانة المنتظمة.'
                }
            ]
        }
    },
    aceite: {
        questions: {
            es: [
                {
                    id: 'level',
                    text: '¿El nivel de aceite es bajo?',
                    options: ['Sí', 'No', 'No lo sé']
                },
                {
                    id: 'color',
                    text: '¿El aceite tiene color oscuro?',
                    options: ['Sí', 'No']
                },
                {
                    id: 'leak',
                    text: '¿Hay manchas de aceite debajo del coche?',
                    options: ['Sí', 'No']
                },
                {
                    id: 'consumption',
                    text: '¿El coche consume mucho aceite?',
                    options: ['Sí', 'No']
                }
            ],
            en: [
                {
                    id: 'level',
                    text: 'Is the oil level low?',
                    options: ['Yes', 'No', 'I don\'t know']
                },
                {
                    id: 'color',
                    text: 'Is the oil dark colored?',
                    options: ['Yes', 'No']
                },
                {
                    id: 'leak',
                    text: 'Are there oil stains under the car?',
                    options: ['Yes', 'No']
                },
                {
                    id: 'consumption',
                    text: 'Does the car consume a lot of oil?',
                    options: ['Yes', 'No']
                }
            ],
            fr: [
                {
                    id: 'level',
                    text: 'Le niveau d\'huile est-il bas?',
                    options: ['Oui', 'Non', 'Je ne sais pas']
                },
                {
                    id: 'color',
                    text: 'L\'huile a-t-elle une couleur sombre?',
                    options: ['Oui', 'Non']
                },
                {
                    id: 'leak',
                    text: 'Y a-t-il des taches d\'huile sous la voiture?',
                    options: ['Oui', 'Non']
                },
                {
                    id: 'consumption',
                    text: 'La voiture consomme-t-elle beaucoup d\'huile?',
                    options: ['Oui', 'Non']
                }
            ],
            ar: [
                {
                    id: 'level',
                    text: 'هل مستوى الزيت منخفض؟',
                    options: ['نعم', 'لا', 'لا أعرف']
                },
                {
                    id: 'color',
                    text: 'هل الزيت بلون داكن؟',
                    options: ['نعم', 'لا']
                },
                {
                    id: 'leak',
                    text: 'هل هناك بقع زيت تحت السيارة؟',
                    options: ['نعم', 'لا']
                },
                {
                    id: 'consumption',
                    text: 'هل تستهلك السيارة الكثير من الزيت؟',
                    options: ['نعم', 'لا']
                }
            ]
        },
        results: {
            es: [
                {
                    conditions: { level: 'Sí', leak: 'Sí' },
                    problem: 'Fuga de aceite',
                    severity: 'high',
                    cost: '100€ - 300€',
                    description: 'Hay una fuga de aceite que necesita reparación.',
                    recommendation: 'Localizar y reparar la fuga de aceite urgentemente.'
                },
                {
                    conditions: { level: 'Sí', leak: 'No', consumption: 'Sí' },
                    problem: 'Consumo excesivo de aceite',
                    severity: 'moderate',
                    cost: '150€ - 400€',
                    description: 'El motor consume aceite de forma anormal.',
                    recommendation: 'Revisar sellos de válvulas y anillos de pistón.'
                },
                {
                    conditions: { level: 'No', color: 'Sí' },
                    problem: 'Aceite viejo/degradado',
                    severity: 'low',
                    cost: '50€ - 120€',
                    description: 'El aceite necesita cambio por estar degradado.',
                    recommendation: 'Realizar cambio de aceite y filtro.'
                },
                {
                    conditions: { level: 'Sí', leak: 'No', consumption: 'No' },
                    problem: 'Nivel bajo de aceite',
                    severity: 'moderate',
                    cost: '30€ - 80€',
                    description: 'El nivel de aceite está bajo.',
                    recommendation: 'Rellenar aceite y revisar posible consumo.'
                },
                {
                    conditions: { level: 'No', color: 'No', leak: 'No', consumption: 'No' },
                    problem: 'Sistema de aceite en buen estado',
                    severity: 'low',
                    cost: '0€',
                    description: 'El sistema de aceite está en buen estado.',
                    recommendation: 'Continuar con mantenimiento regular.'
                }
            ],
            en: [
                {
                    conditions: { level: 'Yes', leak: 'Yes' },
                    problem: 'Oil leak',
                    severity: 'high',
                    cost: '100€ - 300€',
                    description: 'There is an oil leak that needs repair.',
                    recommendation: 'Locate and repair the oil leak urgently.'
                },
                {
                    conditions: { level: 'Yes', leak: 'No', consumption: 'Yes' },
                    problem: 'Excessive oil consumption',
                    severity: 'moderate',
                    cost: '150€ - 400€',
                    description: 'The engine consumes oil abnormally.',
                    recommendation: 'Check valve seals and piston rings.'
                },
                {
                    conditions: { level: 'No', color: 'Yes' },
                    problem: 'Old/degraded oil',
                    severity: 'low',
                    cost: '50€ - 120€',
                    description: 'The oil needs to be changed due to degradation.',
                    recommendation: 'Perform oil and filter change.'
                },
                {
                    conditions: { level: 'Yes', leak: 'No', consumption: 'No' },
                    problem: 'Low oil level',
                    severity: 'moderate',
                    cost: '30€ - 80€',
                    description: 'The oil level is low.',
                    recommendation: 'Top up oil and check for possible consumption.'
                },
                {
                    conditions: { level: 'No', color: 'No', leak: 'No', consumption: 'No' },
                    problem: 'Oil system in good condition',
                    severity: 'low',
                    cost: '0€',
                    description: 'The oil system is in good condition.',
                    recommendation: 'Continue with regular maintenance.'
                }
            ],
            fr: [
                {
                    conditions: { level: 'Oui', leak: 'Oui' },
                    problem: 'Fuite d\'huile',
                    severity: 'high',
                    cost: '100€ - 300€',
                    description: 'Il y a une fuite d\'huile qui nécessite une réparation.',
                    recommendation: 'Localiser et réparer la fuite d\'huile urgemment.'
                },
                {
                    conditions: { level: 'Oui', leak: 'Non', consumption: 'Oui' },
                    problem: 'Consommation excessive d\'huile',
                    severity: 'moderate',
                    cost: '150€ - 400€',
                    description: 'Le moteur consomme de l\'huile de manière anormale.',
                    recommendation: 'Vérifier les joints de soupapes et les segments de piston.'
                },
                {
                    conditions: { level: 'Non', color: 'Oui' },
                    problem: 'Huile vieille/dégradée',
                    severity: 'low',
                    cost: '50€ - 120€',
                    description: 'L\'huile doit être changée car elle est dégradée.',
                    recommendation: 'Effectuer la vidange et le changement de filtre.'
                },
                {
                    conditions: { level: 'Oui', leak: 'Non', consumption: 'Non' },
                    problem: 'Niveau d\'huile bas',
                    severity: 'moderate',
                    cost: '30€ - 80€',
                    description: 'Le niveau d\'huile est bas.',
                    recommendation: 'Faire le plein d\'huile et vérifier la consommation possible.'
                },
                {
                    conditions: { level: 'Non', color: 'Non', leak: 'Non', consumption: 'Non' },
                    problem: 'Système d\'huile en bon état',
                    severity: 'low',
                    cost: '0€',
                    description: 'Le système d\'huile est en bon état.',
                    recommendation: 'Continuer avec l\'entretien régulier.'
                }
            ],
            ar: [
                {
                    conditions: { level: 'نعم', leak: 'نعم' },
                    problem: 'تسرب زيت',
                    severity: 'high',
                    cost: '100€ - 300€',
                    description: 'هناك تسرب زيت يحتاج إلى إصلاح.',
                    recommendation: 'حدد موقع التسرب وأصلحه فوراً.'
                },
                {
                    conditions: { level: 'نعم', leak: 'لا', consumption: 'نعم' },
                    problem: 'استهلاك زيت مفرط',
                    severity: 'moderate',
                    cost: '150€ - 400€',
                    description: 'المحرك يستهلك الزيت بشكل غير طبيعي.',
                    recommendation: 'افحص أغطية الصمام وحلقات المكبس.'
                },
                {
                    conditions: { level: 'لا', color: 'نعم' },
                    problem: 'زيت قديم/متدهور',
                    severity: 'low',
                    cost: '50€ - 120€',
                    description: 'الزيت يحتاج إلى التغيير بسبب التدهور.',
                    recommendation: 'قم بتغيير الزيت والفلتر.'
                },
                {
                    conditions: { level: 'نعم', leak: 'لا', consumption: 'لا' },
                    problem: 'مستوى زيت منخفض',
                    severity: 'moderate',
                    cost: '30€ - 80€',
                    description: 'مستوى الزيت منخفض.',
                    recommendation: 'املأ الزيت وافحص الاستهلاك المحتمل.'
                },
                {
                    conditions: { level: 'لا', color: 'لا', leak: 'لا', consumption: 'لا' },
                    problem: 'نظام الزيت في حالة جيدة',
                    severity: 'low',
                    cost: '0€',
                    description: 'نظام الزيت في حالة جيدة.',
                    recommendation: 'استمر في الصيانة المنتظمة.'
                }
            ]
        }
    },
    encendido: {
        questions: {
            es: [
                {
                    id: 'start_difficulty',
                    text: '¿El coche tiene dificultades para arrancar?',
                    options: ['Sí', 'No']
                },
                {
                    id: 'misfire',
                    text: '¿El motor falla al acelerar?',
                    options: ['Sí', 'No']
                },
                {
                    id: 'fuel_consumption',
                    text: '¿El consumo de combustible aumentó?',
                    options: ['Sí', 'No', 'No lo sé']
                },
                {
                    id: 'check_engine',
                    text: '¿Se enciende la luz Check Engine?',
                    options: ['Sí', 'No']
                }
            ],
            en: [
                {
                    id: 'start_difficulty',
                    text: 'Does the car have difficulty starting?',
                    options: ['Yes', 'No']
                },
                {
                    id: 'misfire',
                    text: 'Does the engine misfire when accelerating?',
                    options: ['Yes', 'No']
                },
                {
                    id: 'fuel_consumption',
                    text: 'Has fuel consumption increased?',
                    options: ['Yes', 'No', 'I don\'t know']
                },
                {
                    id: 'check_engine',
                    text: 'Does the Check Engine light turn on?',
                    options: ['Yes', 'No']
                }
            ],
            fr: [
                {
                    id: 'start_difficulty',
                    text: 'La voiture a-t-elle des difficultés à démarrer?',
                    options: ['Oui', 'Non']
                },
                {
                    id: 'misfire',
                    text: 'Le moteur rate-t-il lors de l\'accélération?',
                    options: ['Oui', 'Non']
                },
                {
                    id: 'fuel_consumption',
                    text: 'La consommation de carburant a-t-elle augmenté?',
                    options: ['Oui', 'Non', 'Je ne sais pas']
                },
                {
                    id: 'check_engine',
                    text: 'Le voyant Check Engine s\'allume-t-il?',
                    options: ['Oui', 'Non']
                }
            ],
            ar: [
                {
                    id: 'start_difficulty',
                    text: 'هل تواجه السيارة صعوبة في التشغيل؟',
                    options: ['نعم', 'لا']
                },
                {
                    id: 'misfire',
                    text: 'هل يفشل المحرك عند التسارع؟',
                    options: ['نعم', 'لا']
                },
                {
                    id: 'fuel_consumption',
                    text: 'هل زاد استهلاك الوقود؟',
                    options: ['نعم', 'لا', 'لا أعرف']
                },
                {
                    id: 'check_engine',
                    text: 'هل يضيء مؤشر Check Engine؟',
                    options: ['نعم', 'لا']
                }
            ]
        },
        results: {
            es: [
                {
                    conditions: { start_difficulty: 'Sí', misfire: 'Sí', check_engine: 'Sí' },
                    problem: 'Bujías desgastadas',
                    severity: 'moderate',
                    cost: '80€ - 250€',
                    description: 'Las bujías desgastadas causan fallos de encendido.',
                    recommendation: 'Reemplazar las bujías.'
                },
                {
                    conditions: { start_difficulty: 'Sí', misfire: 'No', check_engine: 'No' },
                    problem: 'Batería débil',
                    severity: 'low',
                    cost: '80€ - 150€',
                    description: 'La batería puede estar débil.',
                    recommendation: 'Revisar y cargar la batería.'
                },
                {
                    conditions: { misfire: 'Sí', fuel_consumption: 'Sí' },
                    problem: 'Bobinas de encendido defectuosas',
                    severity: 'moderate',
                    cost: '120€ - 300€',
                    description: 'Las bobinas defectuosas causan fallos.',
                    recommendation: 'Reemplazar las bobinas afectadas.'
                },
                {
                    conditions: { fuel_consumption: 'Sí', misfire: 'No' },
                    problem: 'Filtro de aire obstruido',
                    severity: 'low',
                    cost: '30€ - 80€',
                    description: 'El filtro de aire sucio afecta el consumo.',
                    recommendation: 'Reemplazar el filtro de aire.'
                },
                {
                    conditions: { start_difficulty: 'No', misfire: 'No', fuel_consumption: 'No', check_engine: 'No' },
                    problem: 'Sistema de encendido en buen estado',
                    severity: 'low',
                    cost: '0€',
                    description: 'El sistema de encendido funciona correctamente.',
                    recommendation: 'Continuar con mantenimiento regular.'
                }
            ],
            en: [
                {
                    conditions: { start_difficulty: 'Yes', misfire: 'Yes', check_engine: 'Yes' },
                    problem: 'Worn spark plugs',
                    severity: 'moderate',
                    cost: '80€ - 250€',
                    description: 'Worn spark plugs cause ignition failures.',
                    recommendation: 'Replace the spark plugs.'
                },
                {
                    conditions: { start_difficulty: 'Yes', misfire: 'No', check_engine: 'No' },
                    problem: 'Weak battery',
                    severity: 'low',
                    cost: '80€ - 150€',
                    description: 'The battery may be weak.',
                    recommendation: 'Check and charge the battery.'
                },
                {
                    conditions: { misfire: 'Yes', fuel_consumption: 'Yes' },
                    problem: 'Faulty ignition coils',
                    severity: 'moderate',
                    cost: '120€ - 300€',
                    description: 'Faulty coils cause misfires.',
                    recommendation: 'Replace the affected coils.'
                },
                {
                    conditions: { fuel_consumption: 'Yes', misfire: 'No' },
                    problem: 'Clogged air filter',
                    severity: 'low',
                    cost: '30€ - 80€',
                    description: 'Dirty air filter affects consumption.',
                    recommendation: 'Replace the air filter.'
                },
                {
                    conditions: { start_difficulty: 'No', misfire: 'No', fuel_consumption: 'No', check_engine: 'No' },
                    problem: 'Ignition system in good condition',
                    severity: 'low',
                    cost: '0€',
                    description: 'The ignition system works correctly.',
                    recommendation: 'Continue with regular maintenance.'
                }
            ],
            fr: [
                {
                    conditions: { start_difficulty: 'Oui', misfire: 'Oui', check_engine: 'Oui' },
                    problem: 'Bougies usées',
                    severity: 'moderate',
                    cost: '80€ - 250€',
                    description: 'Les bougies usées causent des ratés d\'allumage.',
                    recommendation: 'Remplacer les bougies.'
                },
                {
                    conditions: { start_difficulty: 'Oui', misfire: 'Non', check_engine: 'Non' },
                    problem: 'Batterie faible',
                    severity: 'low',
                    cost: '80€ - 150€',
                    description: 'La batterie peut être faible.',
                    recommendation: 'Vérifier et charger la batterie.'
                },
                {
                    conditions: { misfire: 'Oui', fuel_consumption: 'Oui' },
                    problem: 'Bobines d\'allumage défectueuses',
                    severity: 'moderate',
                    cost: '120€ - 300€',
                    description: 'Les bobines défectueuses causent des ratés.',
                    recommendation: 'Remplacer les bobines affectées.'
                },
                {
                    conditions: { fuel_consumption: 'Oui', misfire: 'Non' },
                    problem: 'Filtre à air bouché',
                    severity: 'low',
                    cost: '30€ - 80€',
                    description: 'Le filtre à air sale affecte la consommation.',
                    recommendation: 'Remplacer le filtre à air.'
                },
                {
                    conditions: { start_difficulty: 'Non', misfire: 'Non', fuel_consumption: 'Non', check_engine: 'Non' },
                    problem: 'Système d\'allumage en bon état',
                    severity: 'low',
                    cost: '0€',
                    description: 'Le système d\'allumage fonctionne correctement.',
                    recommendation: 'Continuer avec l\'entretien régulier.'
                }
            ],
            ar: [
                {
                    conditions: { start_difficulty: 'نعم', misfire: 'نعم', check_engine: 'نعم' },
                    problem: 'شموع احتراق متآكلة',
                    severity: 'moderate',
                    cost: '80€ - 250€',
                    description: 'شموع الاحتراق المتآكلة تسبب فشل في الاشتعال.',
                    recommendation: 'استبدل شموع الاحتراق.'
                },
                {
                    conditions: { start_difficulty: 'نعم', misfire: 'لا', check_engine: 'لا' },
                    problem: 'بطارية ضعيفة',
                    severity: 'low',
                    cost: '80€ - 150€',
                    description: 'قد تكون البطارية ضعيفة.',
                    recommendation: 'افحص وشحن البطارية.'
                },
                {
                    conditions: { misfire: 'نعم', fuel_consumption: 'نعم' },
                    problem: 'ملفات إشعال معطلة',
                    severity: 'moderate',
                    cost: '120€ - 300€',
                    description: 'الملفات المعطلة تسبب فشلًا.',
                    recommendation: 'استبدل الملفات المتأثرة.'
                },
                {
                    conditions: { fuel_consumption: 'نعم', misfire: 'لا' },
                    problem: 'فلتر هواء مسدود',
                    severity: 'low',
                    cost: '30€ - 80€',
                    description: 'فلتر الهواء المتسخ يؤثر على الاستهلاك.',
                    recommendation: 'استبدل فلتر الهواء.'
                },
                {
                    conditions: { start_difficulty: 'لا', misfire: 'لا', fuel_consumption: 'لا', check_engine: 'لا' },
                    problem: 'نظام الاشتعال في حالة جيدة',
                    severity: 'low',
                    cost: '0€',
                    description: 'نظام الاشتعال يعمل بشكل صحيح.',
                    recommendation: 'استمر في الصيانة المنتظمة.'
                }
            ]
        }
    },
    inyeccion: {
        questions: {
            es: [
                {
                    id: 'power_loss',
                    text: '¿El coche pierde potencia?',
                    options: ['Sí', 'No']
                },
                {
                    id: 'rough_idle',
                    text: '¿El ralentí es irregular?',
                    options: ['Sí', 'No']
                },
                {
                    id: 'fuel_smell',
                    text: '¿Hay olor a gasolina?',
                    options: ['Sí', 'No']
                },
                {
                    id: 'consumption',
                    text: '¿El consumo de combustible es alto?',
                    options: ['Sí', 'No', 'No lo sé']
                }
            ],
            en: [
                {
                    id: 'power_loss',
                    text: 'Does the car lose power?',
                    options: ['Yes', 'No']
                },
                {
                    id: 'rough_idle',
                    text: 'Is the idle irregular?',
                    options: ['Yes', 'No']
                },
                {
                    id: 'fuel_smell',
                    text: 'Is there a gasoline smell?',
                    options: ['Yes', 'No']
                },
                {
                    id: 'consumption',
                    text: 'Is fuel consumption high?',
                    options: ['Yes', 'No', 'I don\'t know']
                }
            ],
            fr: [
                {
                    id: 'power_loss',
                    text: 'La voiture perd-elle de la puissance?',
                    options: ['Oui', 'Non']
                },
                {
                    id: 'rough_idle',
                    text: 'Le ralenti est-il irrégulier?',
                    options: ['Oui', 'Non']
                },
                {
                    id: 'fuel_smell',
                    text: 'Y a-t-il une odeur d\'essence?',
                    options: ['Oui', 'Non']
                },
                {
                    id: 'consumption',
                    text: 'La consommation de carburant est-elle élevée?',
                    options: ['Oui', 'Non', 'Je ne sais pas']
                }
            ],
            ar: [
                {
                    id: 'power_loss',
                    text: 'هل تفقد السيارة القوة؟',
                    options: ['نعم', 'لا']
                },
                {
                    id: 'rough_idle',
                    text: 'هل الخمول غير منتظم؟',
                    options: ['نعم', 'لا']
                },
                {
                    id: 'fuel_smell',
                    text: 'هل هناك رائحة بنزين؟',
                    options: ['نعم', 'لا']
                },
                {
                    id: 'consumption',
                    text: 'هل استهلاك الوقود مرتفع؟',
                    options: ['نعم', 'لا', 'لا أعرف']
                }
            ]
        },
        results: {
            es: [
                {
                    conditions: { power_loss: 'Sí', rough_idle: 'Sí', fuel_smell: 'Sí' },
                    problem: 'Inyectores obstruidos',
                    severity: 'moderate',
                    cost: '150€ - 400€',
                    description: 'Los inyectores están obstruidos afectando el rendimiento.',
                    recommendation: 'Limpiar o reemplazar los inyectores.'
                },
                {
                    conditions: { power_loss: 'Sí', rough_idle: 'No', fuel_smell: 'No' },
                    problem: 'Filtro de combustible obstruido',
                    severity: 'low',
                    cost: '50€ - 120€',
                    description: 'El filtro de combustible está obstruido.',
                    recommendation: 'Reemplazar el filtro de combustible.'
                },
                {
                    conditions: { rough_idle: 'Sí', power_loss: 'No' },
                    problem: 'Bomba de combustible débil',
                    severity: 'moderate',
                    cost: '200€ - 500€',
                    description: 'La bomba de combustible no suministra suficiente presión.',
                    recommendation: 'Reemplazar la bomba de combustible.'
                },
                {
                    conditions: { fuel_smell: 'Sí', rough_idle: 'No' },
                    problem: 'Fuga en sistema de inyección',
                    severity: 'high',
                    cost: '100€ - 300€',
                    description: 'Hay una fuga en el sistema de inyección.',
                    recommendation: 'Localizar y reparar la fuga urgentemente.'
                },
                {
                    conditions: { power_loss: 'No', rough_idle: 'No', fuel_smell: 'No', consumption: 'No' },
                    problem: 'Sistema de inyección en buen estado',
                    severity: 'low',
                    cost: '0€',
                    description: 'El sistema de inyección funciona correctamente.',
                    recommendation: 'Continuar con mantenimiento regular.'
                }
            ],
            en: [
                {
                    conditions: { power_loss: 'Yes', rough_idle: 'Yes', fuel_smell: 'Yes' },
                    problem: 'Clogged injectors',
                    severity: 'moderate',
                    cost: '150€ - 400€',
                    description: 'The injectors are clogged affecting performance.',
                    recommendation: 'Clean or replace the injectors.'
                },
                {
                    conditions: { power_loss: 'Yes', rough_idle: 'No', fuel_smell: 'No' },
                    problem: 'Clogged fuel filter',
                    severity: 'low',
                    cost: '50€ - 120€',
                    description: 'The fuel filter is clogged.',
                    recommendation: 'Replace the fuel filter.'
                },
                {
                    conditions: { rough_idle: 'Yes', power_loss: 'No' },
                    problem: 'Weak fuel pump',
                    severity: 'moderate',
                    cost: '200€ - 500€',
                    description: 'The fuel pump does not supply enough pressure.',
                    recommendation: 'Replace the fuel pump.'
                },
                {
                    conditions: { fuel_smell: 'Yes', rough_idle: 'No' },
                    problem: 'Leak in injection system',
                    severity: 'high',
                    cost: '100€ - 300€',
                    description: 'There is a leak in the injection system.',
                    recommendation: 'Locate and repair the leak urgently.'
                },
                {
                    conditions: { power_loss: 'No', rough_idle: 'No', fuel_smell: 'No', consumption: 'No' },
                    problem: 'Injection system in good condition',
                    severity: 'low',
                    cost: '0€',
                    description: 'The injection system works correctly.',
                    recommendation: 'Continue with regular maintenance.'
                }
            ],
            fr: [
                {
                    conditions: { power_loss: 'Oui', rough_idle: 'Oui', fuel_smell: 'Oui' },
                    problem: 'Injecteurs bouchés',
                    severity: 'moderate',
                    cost: '150€ - 400€',
                    description: 'Les injecteurs sont bouchés affectant les performances.',
                    recommendation: 'Nettoyer ou remplacer les injecteurs.'
                },
                {
                    conditions: { power_loss: 'Oui', rough_idle: 'Non', fuel_smell: 'Non' },
                    problem: 'Filtre à carburant bouché',
                    severity: 'low',
                    cost: '50€ - 120€',
                    description: 'Le filtre à carburant est bouché.',
                    recommendation: 'Remplacer le filtre à carburant.'
                },
                {
                    conditions: { rough_idle: 'Oui', power_loss: 'Non' },
                    problem: 'Pompe à carburant faible',
                    severity: 'moderate',
                    cost: '200€ - 500€',
                    description: 'La pompe à carburant ne fournit pas assez de pression.',
                    recommendation: 'Remplacer la pompe à carburant.'
                },
                {
                    conditions: { fuel_smell: 'Oui', rough_idle: 'Non' },
                    problem: 'Fuite dans le système d\'injection',
                    severity: 'high',
                    cost: '100€ - 300€',
                    description: 'Il y a une fuite dans le système d\'injection.',
                    recommendation: 'Localiser et réparer la fuite urgemment.'
                },
                {
                    conditions: { power_loss: 'Non', rough_idle: 'Non', fuel_smell: 'Non', consumption: 'Non' },
                    problem: 'Système d\'injection en bon état',
                    severity: 'low',
                    cost: '0€',
                    description: 'Le système d\'injection fonctionne correctement.',
                    recommendation: 'Continuer avec l\'entretien régulier.'
                }
            ],
            ar: [
                {
                    conditions: { power_loss: 'نعم', rough_idle: 'نعم', fuel_smell: 'نعم' },
                    problem: 'حقن مسدودة',
                    severity: 'moderate',
                    cost: '150€ - 400€',
                    description: 'الحقن مسدودة مما يؤثر على الأداء.',
                    recommendation: 'نظف أو استبدل الحقن.'
                },
                {
                    conditions: { power_loss: 'نعم', rough_idle: 'لا', fuel_smell: 'لا' },
                    problem: 'فلتر وقود مسدود',
                    severity: 'low',
                    cost: '50€ - 120€',
                    description: 'فلتر الوقود مسدود.',
                    recommendation: 'استبدل فلتر الوقود.'
                },
                {
                    conditions: { rough_idle: 'نعم', power_loss: 'لا' },
                    problem: 'مضخة وقود ضعيفة',
                    severity: 'moderate',
                    cost: '200€ - 500€',
                    description: 'مضخة الوقود لا توفر ضغطًا كافيًا.',
                    recommendation: 'استبدل مضخة الوقود.'
                },
                {
                    conditions: { fuel_smell: 'نعم', rough_idle: 'لا' },
                    problem: 'تسرب في نظام الحقن',
                    severity: 'high',
                    cost: '100€ - 300€',
                    description: 'هناك تسرب في نظام الحقن.',
                    recommendation: 'حدد موقع التسرب وأصلحه فوراً.'
                },
                {
                    conditions: { power_loss: 'لا', rough_idle: 'لا', fuel_smell: 'لا', consumption: 'لا' },
                    problem: 'نظام الحقن في حالة جيدة',
                    severity: 'low',
                    cost: '0€',
                    description: 'نظام الحقن يعمل بشكل صحيح.',
                    recommendation: 'استمر في الصيانة المنتظمة.'
                }
            ]
        }
    }
};

// State management
let currentCategory = null;
let currentQuestionIndex = 0;
let answers = {};
let currentResult = null;

// DOM elements - will be initialized in DOMContentLoaded
let categoriesSection, wizardSection, resultsSection, historySection;
let btnStart, btnBack, btnRestart, btnViewHistory, btnCloseHistory, btnEmail;
let wizardTitle, wizardContent, progressBar, langSelector;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Get elements after DOM is loaded
    categoriesSection = document.getElementById('categoriesSection');
    wizardSection = document.getElementById('wizardSection');
    resultsSection = document.getElementById('resultsSection');
    historySection = document.getElementById('historySection');
    btnStart = document.getElementById('btnStart');
    btnBack = document.getElementById('btnBack');
    btnRestart = document.getElementById('btnRestart');
    btnViewHistory = document.getElementById('btnViewHistory');
    btnCloseHistory = document.getElementById('btnCloseHistory');
    btnEmail = document.getElementById('btnEmail');
    wizardTitle = document.getElementById('wizardTitle');
    wizardContent = document.getElementById('wizardContent');
    progressBar = document.getElementById('progressBar');
    langSelector = document.getElementById('langSelector');
    
    // Event listeners - only if elements exist
    if (btnStart) btnStart.addEventListener('click', scrollToCategories);
    if (btnBack) btnBack.addEventListener('click', backToCategories);
    if (btnRestart) btnRestart.addEventListener('click', restartDiagnosis);
    if (btnViewHistory) btnViewHistory.addEventListener('click', showHistory);
    if (btnCloseHistory) btnCloseHistory.addEventListener('click', closeHistory);
    if (btnEmail) btnEmail.addEventListener('click', sendEmail);
    if (langSelector) langSelector.addEventListener('change', changeLanguage);
    
    // Vehicle type selector
    const vehicleTypeSelector = document.getElementById('vehicleTypeSelector');
    if (vehicleTypeSelector) {
        vehicleTypeSelector.addEventListener('change', filterCategoriesByVehicleType);
    }
    
    // Initialize category cards
    document.querySelectorAll('.diag-category-card').forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            startWizard(category);
        });
    });
    
    // Load saved language or use i18n language
    const savedLang = localStorage.getItem('diagLang');
    if (savedLang) {
        diagCurrentLang = savedLang;
        if (langSelector) langSelector.value = savedLang;
    } else if (typeof currentLang !== 'undefined') {
        diagCurrentLang = currentLang;
        if (langSelector) langSelector.value = currentLang;
    }
    applyTranslations();
});

// Language functions
function changeLanguage(e) {
    diagCurrentLang = e.target.value;
    localStorage.setItem('diagLang', diagCurrentLang);
    applyTranslations();
}

function applyTranslations() {
    const t = diagTranslations[diagCurrentLang];
    
    // Update all elements with data-diag-i18n
    document.querySelectorAll('[data-diag-i18n]').forEach(el => {
        const key = el.getAttribute('data-diag-i18n');
        if (t[key]) {
            if (el.getAttribute('data-diag-i18n-html') === 'true') {
                el.innerHTML = t[key];
            } else {
                el.textContent = t[key];
            }
        }
    });

    // Set RTL for Arabic
    document.body.dir = diagCurrentLang === 'ar' ? 'rtl' : 'ltr';

    // Update result labels
    if (currentResult) {
        document.querySelector('.diag-result__problem .diag-result__label').textContent = t.problemLabel;
        document.querySelector('.diag-result__severity .diag-result__label').textContent = t.severityLabel;
        document.querySelector('.diag-result__cost .diag-result__label').textContent = t.costLabel;
        document.querySelector('.diag-result__description .diag-result__label').textContent = t.descriptionLabel;
        document.querySelector('.diag-result__recommendation .diag-result__label').textContent = t.recommendationLabel;
    }
}

// Filter categories by vehicle type
function filterCategoriesByVehicleType(e) {
    const selectedType = e.target.value;
    const cards = document.querySelectorAll('.diag-category-card');
    
    cards.forEach(card => {
        const vehicleTypes = card.dataset.vehicleType || 'all';
        
        if (selectedType === 'all' || vehicleTypes.includes(selectedType)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Listen to i18n language changes
document.addEventListener('i18n:ready', (e) => {
    const lang = e.detail.lang;
    diagCurrentLang = lang;
    localStorage.setItem('diagLang', lang);
    applyTranslations();
});

// Also poll for language changes from i18n
let lastcarspecioLang = localStorage.getItem('carspecio-lang');
setInterval(() => {
    const currentcarspecioLang = localStorage.getItem('carspecio-lang');
    if (currentcarspecioLang && currentcarspecioLang !== lastcarspecioLang) {
        lastcarspecioLang = currentcarspecioLang;
        diagCurrentLang = currentcarspecioLang;
        localStorage.setItem('diagLang', currentcarspecioLang);
        applyTranslations();
    }
}, 500);

function scrollToCategories() {
    categoriesSection.scrollIntoView({ behavior: 'smooth' });
}

function startWizard(category) {
    currentCategory = category;
    currentQuestionIndex = 0;
    answers = {};

    // Update UI
    categoriesSection.style.display = 'none';
    wizardSection.style.display = 'block';
    resultsSection.style.display = 'none';

    // Set title with translation
    const categoryNames = {
        es: {
            motor: 'Motor',
            bateria: 'Batería',
            frenos: 'Frenos',
            transmision: 'Transmisión',
            suspension: 'Suspensión',
            refrigeracion: 'Refrigeración',
            electricidad: 'Electricidad',
            escape: 'Escape',
            direccion: 'Dirección',
            aire: 'Aire Acondicionado',
            neumaticos: 'Neumáticos',
            aceite: 'Aceite',
            encendido: 'Encendido',
            inyeccion: 'Inyección'
        },
        en: {
            motor: 'Engine',
            bateria: 'Battery',
            frenos: 'Brakes',
            transmision: 'Transmission',
            suspension: 'Suspension',
            refrigeracion: 'Cooling',
            electricidad: 'Electricity',
            escape: 'Exhaust',
            direccion: 'Steering',
            aire: 'Air Conditioning',
            neumaticos: 'Tires',
            aceite: 'Oil',
            encendido: 'Ignition',
            inyeccion: 'Injection'
        },
        fr: {
            motor: 'Moteur',
            bateria: 'Batterie',
            frenos: 'Freins',
            transmision: 'Transmission',
            suspension: 'Suspension',
            refrigeracion: 'Refroidissement',
            electricidad: 'Électricité',
            escape: 'Échappement',
            direccion: 'Direction',
            aire: 'Climatisation',
            neumaticos: 'Pneus',
            aceite: 'Huile',
            encendido: 'Allumage',
            inyeccion: 'Injection'
        },
        ar: {
            motor: 'المحرك',
            bateria: 'البطارية',
            frenos: 'الفرامل',
            transmision: 'ناقل الحركة',
            suspension: 'نظام التعليق',
            refrigeracion: 'التبريد',
            electricidad: 'الكهرباء',
            escape: 'العادم',
            direccion: 'التوجيه',
            aire: 'مكيف الهواء',
            neumaticos: 'الإطارات',
            aceite: 'الزيت',
            encendido: 'الإشعال',
            inyeccion: 'الحقن'
        }
    };
    
    const t = diagTranslations[diagCurrentLang];
    wizardTitle.textContent = `${t.resultTitle} - ${categoryNames[diagCurrentLang][category]}`;

    // Render first question
    renderQuestion();
}

function renderQuestion() {
    const categoryData = diagnosisDatabase[currentCategory];
    // Check if category has diagTranslations, otherwise use old structure
    const questions = categoryData.questions[diagCurrentLang] || categoryData.questions;
    const question = questions[currentQuestionIndex];

    // Update progress bar
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    progressBar.style.width = `${progress}%`;

    const t = diagTranslations[diagCurrentLang];

    // Render question
    wizardContent.innerHTML = `
        <div class="diag-question">
            <div class="diag-question__text">${question.text}</div>
            <div class="diag-options">
                ${question.options.map((option, index) => `
                    <div class="diag-option" data-value="${option}">
                        <input type="radio" name="answer" id="option_${index}" value="${option}">
                        <label for="option_${index}">${option}</label>
                    </div>
                `).join('')}
            </div>
        </div>
        <div class="diag-wizard__actions">
            <button class="btn-diag-next" id="btnNext" disabled>${t.next}</button>
        </div>
    `;

    // Add event listeners
    document.querySelectorAll('.diag-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('.diag-option').forEach(o => o.classList.remove('selected'));
            option.classList.add('selected');
            option.querySelector('input').checked = true;
            document.getElementById('btnNext').disabled = false;
        });
    });

    document.getElementById('btnNext').addEventListener('click', nextQuestion);
}

function nextQuestion() {
    const categoryData = diagnosisDatabase[currentCategory];
    const questions = categoryData.questions[diagCurrentLang] || categoryData.questions;
    const question = questions[currentQuestionIndex];
    const selectedOption = document.querySelector('.diag-option.selected');
    
    if (selectedOption) {
        answers[question.id] = selectedOption.dataset.value;
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        renderQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    const categoryData = diagnosisDatabase[currentCategory];
    // Check if category has diagTranslations, otherwise use old structure
    const results = categoryData.results[diagCurrentLang] || categoryData.results;
    
    // Find matching result
    let result = results[results.length - 1]; // Default to last result
    
    for (const r of results) {
        let match = true;
        for (const [key, value] of Object.entries(r.conditions)) {
            if (answers[key] !== value) {
                match = false;
                break;
            }
        }
        if (match) {
            result = r;
            break;
        }
    }

    // Save current result
    currentResult = result;

    // Save to localStorage
    saveDiagnosis(currentCategory, result);

    // Update UI
    wizardSection.style.display = 'none';
    resultsSection.style.display = 'block';

    const t = diagTranslations[diagCurrentLang];

    // Set result data
    document.getElementById('resultProblem').textContent = result.problem;
    document.getElementById('resultSeverity').textContent = result.severity === 'low' ? t.severityLow : result.severity === 'moderate' ? t.severityModerate : t.severityHigh;
    document.getElementById('resultSeverity').className = `diag-severity-badge ${result.severity}`;
    document.getElementById('resultCost').textContent = result.cost;
    document.getElementById('resultDescription').textContent = result.description;
    document.getElementById('resultRecommendation').textContent = result.recommendation;

    // Update labels
    document.querySelector('.diag-result__problem .diag-result__label').textContent = t.problemLabel;
    document.querySelector('.diag-result__severity .diag-result__label').textContent = t.severityLabel;
    document.querySelector('.diag-result__cost .diag-result__label').textContent = t.costLabel;
    document.querySelector('.diag-result__description .diag-result__label').textContent = t.descriptionLabel;
    document.querySelector('.diag-result__recommendation .diag-result__label').textContent = t.recommendationLabel;

    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// Save diagnosis to localStorage
function saveDiagnosis(category, result) {
    const history = getHistory();
    const diagnosis = {
        id: Date.now(),
        category: category,
        problem: result.problem,
        severity: result.severity,
        cost: result.cost,
        description: result.description,
        recommendation: result.recommendation,
        date: new Date().toLocaleDateString(diagCurrentLang === 'ar' ? 'ar-MA' : diagCurrentLang === 'fr' ? 'fr-FR' : diagCurrentLang === 'en' ? 'en-US' : 'es-ES')
    };
    
    history.unshift(diagnosis);
    
    // Keep only last 20 diagnoses
    if (history.length > 20) {
        history.pop();
    }
    
    localStorage.setItem('diagHistory', JSON.stringify(history));
}

// Get history from localStorage
function getHistory() {
    const history = localStorage.getItem('diagHistory');
    return history ? JSON.parse(history) : [];
}

// Show history section
function showHistory() {
    categoriesSection.style.display = 'none';
    wizardSection.style.display = 'none';
    resultsSection.style.display = 'none';
    historySection.style.display = 'block';
    
    renderHistory();
}

// Close history section
function closeHistory() {
    historySection.style.display = 'none';
    categoriesSection.style.display = 'block';
}

// Render history cards
function renderHistory() {
    const history = getHistory();
    const historyGrid = document.getElementById('historyGrid');
    const historyEmpty = document.getElementById('historyEmpty');
    const t = diagTranslations[diagCurrentLang];
    
    if (history.length === 0) {
        historyGrid.style.display = 'none';
        historyEmpty.style.display = 'block';
        return;
    }
    
    historyGrid.style.display = 'grid';
    historyEmpty.style.display = 'none';
    
    historyGrid.innerHTML = history.map(diag => `
        <div class="diag-history-card">
            <div class="diag-history-card__header">
                <span class="diag-history-card__category">${diag.category}</span>
                <span class="diag-history-card__date">${diag.date}</span>
            </div>
            <div class="diag-history-card__problem">${diag.problem}</div>
            <span class="diag-history-card__severity ${diag.severity}">${diag.severity === 'low' ? t.severityLow : diag.severity === 'moderate' ? t.severityModerate : t.severityHigh}</span>
            <div class="diag-history-card__cost">${diag.cost}</div>
            <div class="diag-history-card__actions">
                <button class="btn-history-view" onclick="viewDiagnosis(${diag.id})">${t.viewHistory}</button>
                <button class="btn-history-delete" onclick="deleteDiagnosis(${diag.id})">🗑️</button>
            </div>
        </div>
    `).join('');
}

// View specific diagnosis from history
function viewDiagnosis(id) {
    const history = getHistory();
    const diagnosis = history.find(d => d.id === id);
    
    if (diagnosis) {
        currentResult = diagnosis;
        
        historySection.style.display = 'none';
        resultsSection.style.display = 'block';
        
        const t = diagTranslations[diagCurrentLang];
        
        document.getElementById('resultProblem').textContent = diagnosis.problem;
        document.getElementById('resultSeverity').textContent = diagnosis.severity === 'low' ? t.severityLow : diagnosis.severity === 'moderate' ? t.severityModerate : t.severityHigh;
        document.getElementById('resultSeverity').className = `diag-severity-badge ${diagnosis.severity}`;
        document.getElementById('resultCost').textContent = diagnosis.cost;
        document.getElementById('resultDescription').textContent = diagnosis.description;
        document.getElementById('resultRecommendation').textContent = diagnosis.recommendation;
        
        document.querySelector('.diag-result__problem .diag-result__label').textContent = t.problemLabel;
        document.querySelector('.diag-result__severity .diag-result__label').textContent = t.severityLabel;
        document.querySelector('.diag-result__cost .diag-result__label').textContent = t.costLabel;
        document.querySelector('.diag-result__description .diag-result__label').textContent = t.descriptionLabel;
        document.querySelector('.diag-result__recommendation .diag-result__label').textContent = t.recommendationLabel;
        
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Delete diagnosis from history
function deleteDiagnosis(id) {
    const history = getHistory();
    const filtered = history.filter(d => d.id !== id);
    localStorage.setItem('diagHistory', JSON.stringify(filtered));
    renderHistory();
}

// Send diagnosis by email
function sendEmail() {
    if (!currentResult) return;
    
    const t = diagTranslations[diagCurrentLang];
    const subject = encodeURIComponent(`Diagnóstico: ${currentResult.problem}`);
    const body = encodeURIComponent(
        `Problema: ${currentResult.problem}\n` +
        `Nivel: ${currentResult.severity === 'low' ? t.severityLow : currentResult.severity === 'moderate' ? t.severityModerate : t.severityHigh}\n` +
        `Coste estimado: ${currentResult.cost}\n\n` +
        `Descripción:\n${currentResult.description}\n\n` +
        `Recomendación:\n${currentResult.recommendation}`
    );
    
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

function backToCategories() {
    categoriesSection.style.display = 'block';
    wizardSection.style.display = 'none';
    resultsSection.style.display = 'none';
    
    currentCategory = null;
    currentQuestionIndex = 0;
    answers = {};
}

function restartDiagnosis() {
    backToCategories();
    scrollToCategories();
}

})();
