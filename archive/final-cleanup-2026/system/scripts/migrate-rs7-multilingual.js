const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/rs7-2026.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

function toMultilingual(sectionData, translations) {
    if (!sectionData || typeof sectionData !== 'object') return sectionData;
    const result = { es: sectionData };
    ['en','fr','ar'].forEach(lang => {
        if (translations && translations[lang]) {
            result[lang] = deepMerge(JSON.parse(JSON.stringify(sectionData)), translations[lang]);
        }
    });
    return result;
}

function deepMerge(base, overlay) {
    if (!overlay || typeof overlay !== 'object' || Array.isArray(overlay)) return overlay;
    const result = JSON.parse(JSON.stringify(base));
    for (const [k, v] of Object.entries(overlay)) {
        if (v === null || v === undefined) { delete result[k]; }
        else if (typeof v === 'object' && !Array.isArray(v) && typeof result[k] === 'object' && !Array.isArray(result[k])) {
            result[k] = deepMerge(result[k], v);
        } else { result[k] = v; }
    }
    return result;
}

// ===== REVIEW =====
data.review = toMultilingual(data.review, {
    en: {
        summary: "The Audi RS7 is a high-performance luxury sportback that combines grand-touring refinement with supercar-level brutality. Its twin-turbo V8 produces 591 hp, launching the car to 100 km/h in 3.1 seconds, while the Valcona leather interior and MMI technology create an atmosphere of uncompromising premium quality.",
        fullText: "The Audi RS7 represents the pinnacle of performance within the A7 family. Under the hood lies a 4.0 TFSI twin-turbo V8 delivering 591 hp and 800 Nm of torque, paired with an eight-speed Tiptronic automatic and Quattro all-wheel drive. The result is a 0-100 km/h sprint of 3.1 seconds and a top speed of 305 km/h with the Dynamic Plus package.\n\nOn the road, the RS7 is surprisingly comfortable thanks to adaptive air suspension and dynamic steering. Drive modes transform the character from relaxed GT to razor-sharp sports sedan. Build quality is impeccable, with noble materials on every surface and sound insulation that silences the outside world when desired.\n\nOnboard technology is cutting-edge: haptic MMI touchscreens, a 12.3-inch Virtual Cockpit, and a 19-speaker Bang & Olufsen Advanced system delivering 755 watts. Connectivity includes wireless Apple CarPlay, wireless Android Auto, and inductive smartphone charging.\n\nDrawbacks include real-world urban consumption of 15-18 L/100 km, rapid rear tire wear when the potential is exploited, and a starting price above €140,000. However, for those seeking a sedan that does everything at an excellent level, the RS7 is hard to beat.",
        bestFor: [
            "Drivers seeking luxury and sportiness without sacrificing practicality",
            "V8 sound enthusiasts who value acoustic drama in dynamic modes",
            "Families needing space but refusing a conventional SUV",
            "Long-distance travellers who appreciate comfort and technology"
        ]
    },
    fr: {
        summary: "L'Audi RS7 est une berline sportive de hautes performances qui allie le raffinement d'un grand tourisme à la brutalité d'une supercar. Son V8 biturbo de 591 ch propulse la voiture de 0 à 100 km/h en 3,1 secondes, tandis que l'intérieur en cuir Valcona et la technologie MMI créent une atmosphère premium sans compromis.",
        fullText: "L'Audi RS7 représente le sommet des performances de la famille A7. Sous le capot repose un V8 4.0 TFSI biturbo développant 591 ch et 800 Nm de couple, associé à une boîte automatique Tiptronic à huit rapports et à la transmission intégrale Quattro. Le résultat est une accélération de 0 à 100 km/h en 3,1 secondes et une vitesse de pointe de 305 km/h avec le pack Dynamic Plus.\n\nSur la route, la RS7 est étonnamment confortable grâce à la suspension pneumatique adaptative et à la direction dynamique. Les modes de conduite transforment le caractère de berline GT relaxée à sportive affûtée. La qualité de fabrication est impeccable, avec des matériaux nobles sur chaque surface et une insonorisation qui silence le monde extérieur quand on le souhaite.\n\nLa technologie embarquée est de dernière génération : écrans tactiles MMI avec retour haptique, Virtual Cockpit de 12,3 pouces et système Bang & Olufsen Advanced de 19 haut-parleurs délivrant 755 watts. La connectivité inclut Apple CarPlay sans fil, Android Auto sans fil et recharge par induction pour smartphone.\n\nLes inconvénients incluent une consommation réelle en ville de 15-18 L/100 km, une usure rapide des pneus arrière quand on exploite le potentiel, et un prix de départ supérieur à 140 000 €. Cependant, pour ceux qui recherchent une berline qui fait tout à un niveau excellent, la RS7 est difficile à battre.",
        bestFor: [
            "Conducteurs recherchant luxe et sportivité sans sacrifier la praticité",
            "Amateurs de sonorité V8 qui valorisent le drama acoustique en modes dynamiques",
            "Familles ayant besoin d'espace mais refusant un SUV conventionnel",
            "Voyageurs de longue distance qui apprécient le confort et la technologie"
        ]
    },
    ar: {
        summary: "أودي RS7 هي سيارة سيدان رياضية فاخرة عالية الأداء تجمع بين راحة سيارات الجران توريزمو وقوة السوبركار. محرك V8 التوين تيربو بقوة 591 حصان يدفع السيارة من 0 إلى 100 كم/س في 3.1 ثانية، بينما الجلد فالكونا والتقنية MMI يخلقان أجواء فاخرة بلا تنازلات.",
        fullText: "تُمثل أودي RS7 قمة الأداء في عائلة A7. تحت الغطاء يوجد محرك V8 4.0 TFSI توين تيربو بقوة 591 حصان وعزم 800 نيوتن متر، مزود بناقل حركة أوتوماتيكي تيبترونيك بثماني سرعات ونظام دفع رباعي كواترو. النتيجة هي تسارع من 0 إلى 100 كم/س في 3.1 ثانية وسرعة قصوى 305 كم/س مع حزمة Dynamic Plus.\n\nعلى الطريق، تبدو RS7 مريحة بشكل مدهش بفضل التعليق الهوائي التكيفي والتوجيه الديناميكي. أوضاع القيادة تحول طابع السيارة من جران توريزمو مريح إلى سيدان رياضية حادة. جودة التصنيع لا تشوبها شائبة، مع مواد نبيلة على كل سطح وعزل صوتي يخفي العالم الخارجي عند الرغبة.\n\nالتقنية على متنها من الجيل الأخير: شاشات MMI اللمسية بالاستجابة اللمسية، Virtual Cockpit مقاس 12.3 بوصة، ونظام Bang & Olufsen Advanced المكون من 19 مكبر صوت بقوة 755 واط. الاتصال يشمل Apple CarPlay لاسلكي و Android Auto لاسلكي وشحن حثي للهواتف الذكية.\n\nالعيوب تشمل استهلاك وقود فعلي في المدينة يتراوح بين 15-18 لتر/100 كم، وتآكل سريع لإطارات الخلف عند استغلال الإمكانات الكاملة، وسعر يتجاوز 140,000 يورو. ولكن لمن يبحث عن سيارة سيدان تفعل كل شيء على مستوى ممتاز، RS7 خيار صعب التفوق عليه.",
        bestFor: [
            "السائقين الباحثين عن الفخامة والرياضية دون التضحية بالعملية",
            "عشاق صوت V8 الذين يقدرون الدراما الصوتية في الأوضاع الديناميكية",
            "العائلات التي تحتاج مساحة لكنها ترفض سيارات الدفع الرباعي التقليدية",
            "المسافرين لمسافات طويلة الذين يقدرون الراحة والتقنية"
        ]
    }
});

// ===== DRIVING EXPERIENCE =====
data.drivingExperience = toMultilingual(data.drivingExperience, {
    en: {
        handling: {
            summary: "The RS7 chassis is firmly planted thanks to Quattro all-wheel drive and the optional sport rear differential. Progressive steering allows precise high-speed cornering, though the near 2,100 kg weight becomes apparent during very rapid direction changes.",
            steeringFeel: "Precise and well-weighted, with progressive response that firms up in Dynamic mode. Not as communicative as a Porsche, but inspires sufficient confidence.",
            bodyRoll: "Minimal thanks to active sport air suspension. Comfort mode allows slightly more lean to absorb bumps, while Dynamic keeps the car completely flat.",
            gripLevels: "Extraordinary. The Quattro system intelligently distributes torque, allowing full-throttle corner exits without wheelspin. The 285/30 R22 tires provide ample dry grip.",
            rideQuality: "In Comfort it is surprisingly smooth for a 22-inch sport sedan. In Dynamic it becomes firm and connected, transmitting every road imperfection."
        },
        performanceFeel: {
            acceleration: "Brutal and immediate. The 800 Nm torque is available from 2,050 rpm, propelling the RS7 with controlled violence. Launch control consistently delivers 0-100 km/h in 3.1 seconds.",
            braking: "The 420 mm front steel discs provide powerful, progressive bite. Optional ceramics improve track fade resistance, though they are noisy when cold.",
            sound: "The twin-turbo V8 produces a deep idle murmur that transforms into a metallic roar under acceleration. Exhaust valves open in Dynamic mode to unleash an eight-cylinder symphony.",
            transmission: "The eight-speed Tiptronic shifts smoothly in auto mode and rapidly in manual. Aluminium paddle shifters behind the wheel allow total control."
        },
        dailyDriving: {
            comfort: "Excellent for long journeys. Sport seats with 22-way electric adjustment, heating, ventilation and massage eliminate fatigue. Four-zone climate maintains ideal temperature.",
            visibility: "Good forward visibility, though the thick C-pillar hinders three-quarter rear vision. Parking sensors and the 360° camera more than compensate.",
            parking: "Manageable for its size thanks to optional four-wheel steering. The turning circle is significantly reduced. The 3D camera facilitates manoeuvres in tight spaces.",
            motorway: "Where the RS7 feels most at home. Adaptive cruise maintains safe distance, lane assist centres the vehicle, and abundant power enables instant overtaking."
        }
    },
    fr: {
        handling: {
            summary: "Le châssis de la RS7 est fermement ancré grâce au Quattro AWD et au différentiel sport arrière optionnel. La direction progressive permet un virage rapide précis, bien que le poids de près de 2 100 kg se fasse sentir lors des changements de direction très brusques.",
            steeringFeel: "Précise et bien pondérée, avec une réponse progressive qui se durcit en mode Dynamic. Pas aussi communicative qu'une Porsche, mais inspire une confiance suffisante.",
            bodyRoll: "Minimal grâce à la suspension pneumatique sport active. Le mode Comfort autorise un peu plus de roulis pour absorber les bosses, tandis que Dynamic maintient la voiture complètement plate.",
            gripLevels: "Extraordinaires. Le système Quattro distribue intelligemment le couple, permettant des sorties de virage à fond sans patinage. Les pneus 285/30 R22 offrent une adhérence largement suffisante sur sec.",
            rideQuality: "En Comfort, elle est étonnamment souple pour une berline sport avec jantes de 22 pouces. En Dynamic, elle devient ferme et connectée, transmettant chaque irrégularité de la route."
        },
        performanceFeel: {
            acceleration: "Brutale et immédiate. Les 800 Nm de couple sont disponibles dès 2 050 tr/min, propulsant la RS7 avec une violence contrôlée. Le launch control permet des 0-100 km/h en 3,1 secondes de manière constante.",
            braking: "Les disques d'acier avant de 420 mm offrent une mordance puissante et progressive. Les céramiques optionnels améliorent la résistance à la fatigue sur circuit, bien qu'ils soient bruyants à froid.",
            sound: "Le V8 biturbo produit un murmure grave au ralenti qui se transforme en rugissement métallique à l'accélération. Les soupapes d'échappement s'ouvrent en mode Dynamic pour libérer une symphonie de huit cylindres.",
            transmission: "La Tiptronic à huit rapports change de rapport avec douceur en mode automatique et rapidité en mode manuel. Les palettes en aluminium derrière le volant permettent un contrôle total."
        },
        dailyDriving: {
            comfort: "Excellent pour les longs trajets. Les sièges sport avec réglage électrique en 22 directions, chauffage, ventilation et massage éliminent la fatigue. La climatisation quatre zones maintient la température idéale.",
            visibility: "Bonne visibilité vers l'avant, bien que le montant C épais gêne la vision arrière en trois quarts. Les capteurs de stationnement et la caméra 360° compensent largement.",
            parking: "Maniable pour ses dimensions grâce à la direction sur quatre roues optionnelle. Le diamètre de braquage est considérablement réduit. La caméra 3D facilite les manœuvres dans les espaces étroits.",
            motorway: "C'est là que la RS7 se sent le mieux. Le régulateur de vitesse adaptatif maintient la distance de sécurité, l'assistant de voie centre le véhicule, et la puissance abondante permet des dépassements instantanés."
        }
    },
    ar: {
        handling: {
            summary: "تبدو هيكلية RS7 متصلة بقوة بالأسفلت بفضل الدفع الرباعي كواترو والدفيرنسيال الرياضي الخلفي الاختياري. التوجيه التدريجي يسمح بالدخول الدقيق في المنعطفات السريعة، على الرغم من أن الوزن البالغ 2,100 كجم يظهر خلال تغييرات الاتجاه السريعة جداً.",
            steeringFeel: "دقيق ومتوازن الوزن، مع استجابة تدريجية تتصلب في الوضع الديناميكي. ليس بنفس مستوى تواصل بورش، لكنه يمنح ثقة كافية.",
            bodyRoll: "قليل بفضل التعليق الهوائي الرياضي النشط. وضع الراحة يسمح بقليل من الاتزان لامتصاص المطبات، بينما يبقي الوضع الديناميكي السيارة مسطحة تماماً.",
            gripLevels: "استثنائي. ينظم نظام كواترو العزم بذكاء، مما يسمح بالخروج من المنعطفات بدواسة بنزين كاملة دون انزلاق. الإطارات 285/30 R22 توفر قبضة وفيرة في الجفاف.",
            rideQuality: "في وضع الراحة، مريحة بشكل مدهش لسيارة سيدان رياضية بعجلات 22 بوصة. في الوضع الديناميكي تصبح صلبة ومتصلة، تنقل كل عيب في الطريق."
        },
        performanceFeel: {
            acceleration: "وحشية وفورية. عزم الدوران البالغ 800 نيوتن متر متاح من 2,050 دورة في الدقيقة، مدفعاً بـ RS7 بعنف منضبط. نظام الإطلاق يسمح بثبات بـ 0-100 كم/س في 3.1 ثانية.",
            braking: "أقراص الفرامل الأمامية الصلبة مقاس 420 ملم تقدم قوة كبح تدريجية فعالة. أقراص السيراميك الاختيارية تحسن مقاومة التآكل في الحلبة، لكنها صاخبة عند البرودة.",
            sound: "يُنتج محرك V8 التوين تيربو همساً عميقاً عند الخمول يتحول إلى زئير معدني عند التسارع. صمامات العادم تنفتح في الوضع الديناميكي لتحرير سيمفونية ثمانية أسطوانات.",
            transmission: "ناقل الحركة تيبترونيك بثماني سرعات يتحول بسلاسة في الوضع التلقائي وبسرعة في الوضع اليدوي. مجدافات الألومنيوم خلف عجلة القيادة تتيح تحكماً كاملاً."
        },
        dailyDriving: {
            comfort: "ممتاز للرحلات الطويلة. المقاعد الرياضية بضبط كهربائي بـ 22 اتجاهاً، وتدفئة، وتبريد، وتدليك تزيل التعب. التكييف رباعي المناطق يحافظ على درجة الحرارة المثالية.",
            visibility: "رؤية جيدة للأمام، لكن العمود C السميك يعيق الرؤية الخلفية. مستشعرات الوقوف والكاميرا المحيطية تعوض بشكل كافٍ.",
            parking: "قابلة للمناورة بالنسبة لحجمها بفضل التوجيه على العجلات الأربع الاختياري. نصف قطر الدوران يقل بشكل كبير. الكاميرا ثلاثية الأبعاد تسهل المناورات في الأماكن الضيقة.",
            motorway: "هنا تشعر RS7 بأنها في بيتها. مثبت السرعة التكيفي يحافظ على مسافة الأمان، مساعد المسار يُوسطّت السيارة، والقوة الوفيرة تتيح المناورة الفورية."
        }
    }
});

// ===== EXTERIOR DESIGN =====
data.exteriorDesign = toMultilingual(data.exteriorDesign, {
    en: {
        summary: "The Audi RS7 wears a five-door fastback silhouette that balances elegance and aggression. The black Singleframe honeycomb grille, massive air intakes, and widened side sills make it clear this is no ordinary A7.",
        stylingNotes: [
            "Power-domed hood housing the twin-turbo V8",
            "Front bumper with high-flow air intakes",
            "Wheel arches widened 40 mm over the standard A7",
            "Integrated rear diffuser with twin oval RS exhaust outlets",
            "Active rear spoiler deploying at 100 km/h",
            "Matrix LED headlights with sequential light signature"
        ],
        dimensionsContext: "At 5,009 mm long and 1,950 mm wide including mirrors, the RS7 is an imposing sedan. Its 1,424 mm height gives it a low, athletic stance, while the 2,930 mm wheelbase guarantees interior space.",
        lighting: {
            headlights: "Matrix LED HD with optional laser. Adaptive illumination avoids dazzling oncoming vehicles while keeping high beams permanently active on the road.",
            taillights: "Continuous LED with arrival and departure animation. The light graphic is exclusive to the RS range.",
            signature: "Dynamic ignition sequence in both headlights and taillights. The daytime running light signature presents a double horizontal line with three-dimensional effect."
        },
        wheels: {
            standard: "21-inch alloy wheels in 10-V-spoke design, anthracite diamond-cut finish",
            optional: [
                "22-inch 5-twin-spoke design in matte black finish",
                "22-inch 5-Y-spoke design in titanium anthracite finish"
            ]
        }
    },
    fr: {
        summary: "L'Audi RS7 arbore une silhouette fastback cinq portes qui équilibre élégance et agressivité. La calandre Singleframe noire en nid d'abeille, les entrées d'air massives et les bas de caisse élargis indiquent clairement qu'il ne s'agit pas d'un A7 ordinaire.",
        stylingNotes: [
            "Capot bombé abritant le V8 biturbo",
            "Pare-chocs avant avec prises d'air à haut débit",
            "Ailes élargies de 40 mm par rapport à l'A7 standard",
            "Diffuseur arrière intégré avec sorties d'échappement ovales RS doubles",
            "Aileron arrière actif se déployant à 100 km/h",
            "Phares Matrix LED avec signature lumineuse séquentielle"
        ],
        dimensionsContext: "Avec 5 009 mm de long et 1 950 mm de large avec rétroviseurs, la RS7 est une berline imposante. Sa hauteur de 1 424 mm lui confère une posture basse et athlétique, tandis que l'empattement de 2 930 mm garantit l'espace intérieur.",
        lighting: {
            headlights: "Matrix LED HD avec laser optionnel. L'éclairage adaptatif évite d'éblouir les véhicules en sens inverse tout en maintenant les feux de route activement allumés.",
            taillights: "LED continues avec animation d'arrivée et de départ. Le graphique lumineux est exclusif à la gamme RS.",
            signature: "Séquence d'allumage dynamique à la fois dans les phares et les feux arrière. La signature de lumière diurne présente une double ligne horizontale avec effet tridimensionnel."
        },
        wheels: {
            standard: "Jantes alliage de 21 pouces en design à 10 branches en V, finition anthracite diamantée",
            optional: [
                "22 pouces en design à 5 doubles branches, finition noir mat",
                "22 pouces en design à 5 branches en Y, finition titane anthracite"
            ]
        }
    },
    ar: {
        summary: "تتزين أودي RS7 بصيحة فاستباك خمس أبواب توازن بين الأناقة والعدوانية. الشبكة Singleframe السوداء على شكل خلية النحل، وفتحات الهواء الضخمة، والحواف الجانبية الموسعة تجعل الأمر واضحاً أن هذه ليست A7 عادية.",
        stylingNotes: [
            "غطاء محرك مقبب يحتضن محرك V8 التوين تيربو",
            "مصد أمامي بفتحات هواء عالية التدفق",
            "قوس العجلات موسع 40 ملم مقارنة بـ A7 القياسية",
            "موزع هواء خلفي متكامل بمخارج عادم RS بيضاوية مزدوجة",
            "جناح خلفي نشط ينبثق عند 100 كم/س",
            "مصابيح Matrix LED بتوقيع إضاءة متسلسل"
        ],
        dimensionsContext: "بطول 5,009 ملم وعرض 1,950 ملم بما في ذلك المرايا، تُعد RS7 سيدان مهيبة. ارتفاعها 1,424 ملم يمنحها مظهراً منخفضاً ورياضياً، بينما قاعدة العجلات 2,930 ملم تضمن مساحة داخلية واسعة.",
        lighting: {
            headlights: "Matrix LED HD مع ليزر اختياري. الإضاءة التكيفية تتجنب إبهار المركبات المقابلة مع الحفاظ على الضوء العالي نشطاً بشكل دائم على الطريق.",
            taillights: "LED متصلة مع رسوم متحركة للوصول والمغادرة. الرسم الضوئي حصرية لمجموعة RS.",
            signature: "تسلسل تشغيل ديناميكي في كل من المصابيح الأمامية والخلفية. توقيع الإضاءة النهارية يقدم خطين أفقيين مزدوجين بتأثير ثلاثي الأبعاد."
        },
        wheels: {
            standard: "عجلات ألمنيوم مقاس 21 بوصة بتصميم 10 أشعاع على شكل V، بلمسة ألماسية باللون الأنثراسيت",
            optional: [
                "22 بوصة بتصميم 5 أشعاع مزدوجة، بلمسة سوداء مطفأة",
                "22 بوصة بتصميم 5 أشعاع على شكل Y، بلمسة تيتانيوم أنثراسيت"
            ]
        }
    }
});

// Save intermediate to avoid losing work if next block fails
fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
// ===== INTERIOR =====
data.interior = toMultilingual(data.interior, {
    en: {
        summary: "The RS7 interior is a sanctuary of technological luxury. Valcona leather with contrasting diamond stitching, carbon-fibre or brushed-aluminium inserts, and multi-colour ambient lighting create an enveloping atmosphere.",
        frontSeats: {
            comfort: "RS sport seats with generous lateral support, 22-way electric adjustment, memory function, heating, ventilation, and lumbar massage.",
            adjustment: "22 directions including thigh extension, backrest inclination adjustment, and four-way pneumatic lumbar support.",
            material: "Perforated Valcona leather with diamond stitching and RS logos on the headrests."
        },
        rearSeats: {
            legroom: "Generous for two adults. The 2,930 mm wheelbase allows comfortable leg stretching. The centre position is usable for short journeys.",
            headroom: "Adequate thanks to the sloping roof, though occupants over 1.85 m will notice the roofline in the rear seats.",
            comfort: "40:20:40 split-folding backrests with centre armrest, cupholders, and independent climate control."
        },
        boot: {
            practicality: "The liftback tailgate offers an enormous loading aperture. The 535-litre capacity grows to 1,390 litres with seats folded, surpassing many compact SUVs.",
            loadingLip: "Low and wide loading threshold. The electric tailgate with optional foot-activated opening facilitates loading when carrying objects."
        },
        infotainment: {
            system: "MMI touch response with natural voice control and haptic feedback",
            connectivity: ["Wireless Apple CarPlay", "Wireless Android Auto", "Audi connect with Wi-Fi hotspot", "Bluetooth 5.0", "Two USB-C ports"],
            soundSystem: "Bang & Olufsen Advanced Sound System with 19 speakers and 755 watts"
        }
    },
    fr: {
        summary: "L'intérieur de la RS7 est un sanctuaire de luxe technologique. Le cuir Valcona avec coutures en losange contrastantes, les inserts en fibre de carbone ou aluminium brossé, et l'éclairage ambiant multicolore créent une atmosphère enveloppante.",
        frontSeats: {
            comfort: "Sièges sport RS avec maintien latéral généreux, réglage électrique en 22 directions, fonction mémoire, chauffage, ventilation et massage lombaire.",
            adjustment: "22 directions incluant l'extension de la cuisse, le réglage de l'inclinaison du dossier et le soutien lombaire pneumatique en 4 directions.",
            material: "Cuir Valcona perforé avec coutures en losange et logos RS sur les appuie-têtes."
        },
        rearSeats: {
            legroom: "Généreux pour deux adultes. L'empattement de 2 930 mm permet d'étirer les jambes confortablement. La place centrale est utilisable pour de courts trajets.",
            headroom: "Adéquat grâce au toit en pente, bien que les personnes de plus de 1,85 m remarquent la ligne de toit aux places arrière.",
            comfort: "Dossiers rabattables 40:20:40 avec accoudoir central, porte-gobelets et commande de climatisation indépendante."
        },
        boot: {
            practicality: "Le hayon liftback offre une énorme ouverture de chargement. La capacité de 535 litres passe à 1 390 litres avec les sièges rabattus, dépassant de nombreux SUV compacts.",
            loadingLip: "Seuil de chargement bas et large. Le hayon électrique avec ouverture par pied optionnelle facilite le chargement quand on porte des objets."
        },
        infotainment: {
            system: "MMI touch response avec commande vocale naturelle et retour haptique",
            connectivity: ["Apple CarPlay sans fil", "Android Auto sans fil", "Audi connect avec point d'accès Wi-Fi", "Bluetooth 5.0", "Deux ports USB-C"],
            soundSystem: "Bang & Olufsen Advanced Sound System avec 19 haut-parleurs et 755 watts"
        }
    },
    ar: {
        summary: "مقصورة RS7 هي ملاذ من الفخامة التقنية. الجلد فالكونا بخياطة الماس المتباينة، وإدراج ألياف الكربون أو الألومنيوم المصقول، والإضاءة المحيطة متعددة الألوان تخلق أجواءً محيطة.",
        frontSeats: {
            comfort: "مقاعد RS الرياضية بدعم جانبي سخي، وضبط كهربائي بـ 22 اتجاهاً، وذاكرة، وتدفئة، وتبريد، وتدليك قطني.",
            adjustment: "22 اتجاه تشمل تمديد الفخذ، وضبط ميل المسند، ودعم قطني هوائي بأربع اتجاهات.",
            material: "جلد Valcona مثقب بخياطة الماس وشعارات RS على مسندات الرأس."
        },
        rearSeats: {
            legroom: "سخي لشخصين بالغين. قاعدة العجلات 2,930 ملم تتيح تمديد الساقين بارتياح. المقعد الأوسط صالح للرحلات القصيرة.",
            headroom: "كافٍ بفضل السقف المنحدر، لكن الركاب الذين يتجاوز طولهم 1.85 م يلاحظون انخفاض السقف في المقاعد الخلفية.",
            comfort: "مساند ظهر قابلة للطي 40:20:40 مع مسند ذراع مركزي، وحاملات أكواب، وتحكم منفصل بالمناخ."
        },
        boot: {
            practicality: "الباب الخلفي اللفتباك يوفر فتحة تحميل ضخمة. السعة 535 لتر تتوسع إلى 1,390 لتر مع طي المقاعد، متفوقة على العديد من سيارات الدفع الرباعي المدمجة.",
            loadingLip: "عتبة تحميل منخفضة وعريضة. الباب الخلفي الكهربائي بفتح بالقدم الاختياري يسهل التحميل عند حمل الأشياء."
        },
        infotainment: {
            system: "MMI touch response بالتحكم الصوتي الطبيعي والاستجابة اللمسية",
            connectivity: ["Apple CarPlay لاسلكي", "Android Auto لاسلكي", "Audi connect بنقطة اتصال Wi-Fi", "Bluetooth 5.0", "منفذان USB-C"],
            soundSystem: "Bang & Olufsen Advanced Sound System بـ 19 مكبر صوت وقوة 755 واط"
        }
    }
});

// ===== TECHNOLOGY =====
data.technology = toMultilingual(data.technology, {
    en: {
        headUnit: {
            system: "MMI touch response with NVIDIA Tegra X1 processor",
            voiceControl: "Audi natural voice control with cloud processing"
        },
        connectivity: ["5G", "Wi-Fi hotspot", "Audi connect", "myAudi app"],
        audio: { system: "Bang & Olufsen Advanced" },
        driverDisplays: { instrumentCluster: "Virtual Cockpit Plus 12.3-inch with exclusive RS graphics" },
        appIntegration: ["myAudi", "Spotify", "Amazon Music", "Apple Music", "Google Earth"]
    },
    fr: {
        headUnit: {
            system: "MMI touch response avec processeur NVIDIA Tegra X1",
            voiceControl: "Commande vocale naturelle Audi avec traitement cloud"
        },
        connectivity: ["5G", "Point d'accès Wi-Fi", "Audi connect", "Application myAudi"],
        audio: { system: "Bang & Olufsen Advanced" },
        driverDisplays: { instrumentCluster: "Virtual Cockpit Plus de 12,3 pouces avec graphismes RS exclusifs" },
        appIntegration: ["myAudi", "Spotify", "Amazon Music", "Apple Music", "Google Earth"]
    },
    ar: {
        headUnit: {
            system: "MMI touch response بمعالج NVIDIA Tegra X1",
            voiceControl: "التحكم الصوتي الطبيعي من أودي بمعالجة سحابية"
        },
        connectivity: ["5G", "نقطة اتصال Wi-Fi", "Audi connect", "تطبيق myAudi"],
        audio: { system: "Bang & Olufsen Advanced" },
        driverDisplays: { instrumentCluster: "Virtual Cocklet Plus مقاس 12.3 بوصة برسومات RS حصرية" },
        appIntegration: ["myAudi", "Spotify", "Amazon Music", "Apple Music", "Google Earth"]
    }
});

// ===== SAFETY =====
data.safety = toMultilingual(data.safety, {
    en: {
        airbags: ["Driver", "Passenger", "Front side", "Rear side", "Front and rear curtain", "Driver knee"],
        driverAssist: [
            "Adaptive cruise control with Stop & Go",
            "Audi pre sense front with pedestrian and cyclist detection",
            "Audi pre sense rear",
            "Lane keep assist",
            "Lane departure warning",
            "Traffic jam assist",
            "Intersection assist",
            "Exit warning",
            "Cross-traffic assist rear",
            "Night vision assistant with pedestrian detection",
            "Top view camera system (360°)",
            "Head-up display",
            "Parking assist plus with 3D visualisation"
        ],
        structural: "Multi-material body with ultra high-strength steel, aluminium bonnet, doors and tailgate, and structural reinforcements in sills and B-pillars."
    },
    fr: {
        airbags: ["Conducteur", "Passager", "Latéraux avant", "Latéraux arrière", "Rideaux avant et arrière", "Genou conducteur"],
        driverAssist: [
            "Régulateur de vitesse adaptatif avec Stop & Go",
            "Audi pre sense front avec détection de piétons et cyclistes",
            "Audi pre sense rear",
            "Assistance au maintien de voie",
            "Avertisseur de franchissement de ligne",
            "Assistance aux embouteillages",
            "Assistance aux intersections",
            "Avertisseur d'ouverture de porte",
            "Assistance aux intersections arrière",
            "Assistant vision nocturne avec détection de piétons",
            "Système de caméra top view (360°)",
            "Affichage tête haute",
            "Parking assist plus avec visualisation 3D"
        ],
        structural: "Carrosserie multimateriaux avec acier ultra haute résistance, capot, portes et hayon en aluminium, et renforcements structurels dans les seuils et montants B."
    },
    ar: {
        airbags: ["السائق", "الراكب", "جانبي أمامي", "جانبي خلفي", "ستائري أمامي وخلفي", "ركبة السائق"],
        driverAssist: [
            "مثبت السرعة التكيفي مع Stop & Go",
            "Audi pre sense front مع كشف المشاة والدراجات",
            "Audi pre sense rear",
            "مساعد الحفاظ على المسار",
            "تحذير مغادرة المسار",
            "مساعد الازدحام المروري",
            "مساعد التقاطعات",
            "تحذير الخروج",
            "مساعد حركة المرور العرضية الخلفي",
            "مساعد الرؤية الليلية مع كشف المشاة",
            "نظام كاميرا منظر علوي (360°)",
            "شاشة عرض على الزجاج الأمامي",
            "مساعد الوقوف plus مع تصور ثلاثي الأبعاد"
        ],
        structural: "هيكل متعدد المواد مع فولاذ فائق القوة، وغطاء محرك وأبواب وباب خلفي من الألمنيوم، وتعزيزات هيكلية في الأعتاب وأعمدة B."
    }
});

// ===== RUNNING COSTS =====
data.runningCosts = toMultilingual(data.runningCosts, {
    en: {
        insuranceGroups: { spain: "Group 20 (maximum)", uk: "Group 50", germany: "TK25" },
        roadTax: { spain: "Approximately €650/year depending on autonomous community", uk: "£2,365 first year, £600 subsequent years" },
        servicing: {
            costMinor: { value: 850, currency: "EUR" },
            costMajor: { value: 2200, currency: "EUR" }
        },
        fuel: { type: "Premium unleaded 98 RON" }
    },
    fr: {
        insuranceGroups: { spain: "Groupe 20 (maximum)", uk: "Groupe 50", germany: "TK25" },
        roadTax: { spain: "Environ 650 €/an selon la communauté autonome", uk: "2 365 £ première année, 600 £ années suivantes" },
        servicing: {
            costMinor: { value: 850, currency: "EUR" },
            costMajor: { value: 2200, currency: "EUR" }
        },
        fuel: { type: "Sans plomb 98 RON" }
    },
    ar: {
        insuranceGroups: { spain: "المجموعة 20 (الحد الأقصى)", uk: "المجموعة 50", germany: "TK25" },
        roadTax: { spain: "حوالي 650 يورو/سنة حسب المجتمع الذاتي", uk: "2,365 جنيه استرليني السنة الأولى، 600 جنيه السنوات التالية" },
        servicing: {
            costMinor: { value: 850, currency: "EUR" },
            costMajor: { value: 2200, currency: "EUR" }
        },
        fuel: { type: "بنزين ممتاز 98 أوكتان" }
    }
});

// ===== OWNERSHIP =====
data.ownership = toMultilingual(data.ownership, {
    en: {
        ownerReviews: [
            {
                quote: "I have covered 40,000 km with my RS7 and it still excites me every time I start it. Fuel consumption is high, but the smile it puts on my face is worth every cent.",
                author: "Marcus T.",
                location: "Munich, Germany",
                ownsSince: "2024",
                rating: 9.5
            },
            {
                quote: "I use it for business trips and weekend getaways. In Comfort mode it is as quiet as an A8, but press the RS button and it transforms.",
                author: "Sophie L.",
                location: "Lyon, France",
                ownsSince: "2025",
                rating: 9.0
            }
        ],
        commonIssues: [
            {
                issue: "Premature rear tyre wear due to high torque and Quattro all-wheel drive",
                frequency: "common",
                cost: "€1,800 every 15,000-20,000 km"
            },
            {
                issue: "Air suspension noise when cold during first seconds of operation",
                frequency: "occasional",
                cost: "Usually resolved with lubrication, ~€150"
            },
            {
                issue: "Minor MMI system glitches after software updates",
                frequency: "occasional",
                cost: "Resolved under warranty or via OTA update"
            }
        ]
    },
    fr: {
        ownerReviews: [
            {
                quote: "J'ai parcouru 40 000 km avec ma RS7 et elle m'excite encore à chaque démarrage. La consommation est élevée, mais le sourire qu'elle me procure vaut chaque centime.",
                author: "Marcus T.",
                location: "Munich, Allemagne",
                ownsSince: "2024",
                rating: 9.5
            },
            {
                quote: "Je l'utilise pour les voyages d'affaires et les escapades de week-end. En mode Comfort, elle est aussi silencieuse qu'une A8, mais appuyez sur le bouton RS et elle se transforme.",
                author: "Sophie L.",
                location: "Lyon, France",
                ownsSince: "2025",
                rating: 9.0
            }
        ],
        commonIssues: [
            {
                issue: "Usure prématurée des pneus arrière due au couple élevé et à la transmission intégrale Quattro",
                frequency: "common",
                cost: "1 800 € tous les 15 000-20 000 km"
            },
            {
                issue: "Bruits de suspension pneumatique à froid pendant les premières secondes",
                frequency: "occasional",
                cost: "Généralement résolu par lubrification, ~150 €"
            },
            {
                issue: "Pannes mineures du système MMI après mises à jour logicielles",
                frequency: "occasional",
                cost: "Résolu sous garantie ou par mise à jour OTA"
            }
        ]
    },
    ar: {
        ownerReviews: [
            {
                quote: "قطعت 40,000 كم مع RS7 الخاصة بي وما زالت تثيرني في كل مرة أشغلها فيها. استهلاك الوقود مرتفع، لكن الابتسامة التي ترسمها على وجهي تستحق كل سنت.",
                author: "Marcus T.",
                location: "ميونخ، ألمانيا",
                ownsSince: "2024",
                rating: 9.5
            },
            {
                quote: "أستخدمها للرحلات العمل والعطلات الأسبوعية. في وضع الراحة، هي هادئة مثل A8، لكن اضغط زر RS وتتحول.",
                author: "Sophie L.",
                location: "ليون، فرنسا",
                ownsSince: "2025",
                rating: 9.0
            }
        ],
        commonIssues: [
            {
                issue: "تآكل مبكر لإطارات الخلف بسبب العزم العالي والدفع الرباعي كواترو",
                frequency: "common",
                cost: "1,800 يورو كل 15,000-20,000 كم"
            },
            {
                issue: "ضوضاء التعليق الهوائي في البرودة خلال الثواني الأولى",
                frequency: "occasional",
                cost: "عادة ما يُحل بالتشحيم، ~150 يورو"
            },
            {
                issue: "مشاكل طفيفة في نظام MMI بعد تحديثات البرمجيات",
                frequency: "occasional",
                cost: "يُحل بموجب الضمان أو عبر تحديث OTA"
            }
        ]
    }
});

fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
console.log('RS7 multilingual migration complete');

