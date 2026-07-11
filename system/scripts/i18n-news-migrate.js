const fs = require('fs');
const path = require('path');

const articlesDir = path.join(__dirname, '..', 'data', 'noticias');
const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.json'));

const translations = {
    'porsche-911-hybrid-2026': {
        en: {
            title: 'Porsche 911 GTS T-Hybrid: the purest boxer goes hybrid',
            subtitle: 'The first electrification of the legendary 911 arrives through the GTS, keeping the boxer soul and adding a strategic dose of electricity.',
            excerpt: 'Porsche introduces the T-Hybrid system in the 911 GTS: a 3.6-litre boxer with an electric turbo and a 54 hp motor integrated into the PDK gearbox, for a combined output of 532 hp. The system runs at 400 V with a 1.1 kWh battery and accelerates from 0 to 100 km/h in approximately 2.7 seconds.',
            imageCaption: 'Porsche 911 GTS T-Hybrid (2026).',
            sections: [
                {
                    id: 'introduccion',
                    heading: 'Introduction',
                    paragraphs: [
                        'Porsche has taken a decisive step in the history of the 911 with the arrival of the T-Hybrid system. For the first time, the legendary sports car incorporates electrification without renouncing its essence: a flat-six boxer engine, unmistakable sound and rear-wheel drive (or all-wheel drive in the 4S variants).'
                    ]
                },
                {
                    id: 'motor',
                    heading: 'The T-Hybrid system inside',
                    paragraphs: [
                        'The heart of the 911 GTS T-Hybrid is a 3.6-litre biturbo boxer that, instead of a conventional turbocharger, uses an electric turbo. This system eliminates turbo lag and provides immediate response. It is complemented by a 54 hp electric motor integrated into the eight-speed PDK gearbox, which adds 110 lb-ft of torque.',
                        'The combined output reaches 532 hp, a figure that places the GTS T-Hybrid above the Carrera S and very close to the previous Turbo generation. The system operates at 400 volts and stores energy in a 1.1 kWh lithium-ion battery.'
                    ]
                },
                {
                    id: 'rendimiento',
                    heading: 'Performance worthy of the legend',
                    paragraphs: [
                        'In Car and Driver tests, the 911 GTS T-Hybrid has proven to be as fast as it is refined: the 0 to 100 km/h sprint is completed in approximately 2.7 seconds, maintaining the 911 as the absolute reference among rear-mid-engine sports cars.'
                    ]
                }
            ],
            inBrief: [
                'First series-production Porsche 911 with a hybrid system, although not plug-in.',
                'Combined output of 532 hp thanks to a 3.6-litre boxer with an electric turbo and a 54 hp motor in the PDK gearbox.',
                'The 1.1 kWh battery at 400 V allows energy recovery and eliminates turbo lag.',
                'It retains the looks and philosophy of the 911, with no need for external charging.'
            ],
            previousModel: {
                name: 'Porsche 911 Carrera GTS (992.1)',
                year: '2021-2024',
                summary: 'Powered by a 480 hp 3.0-litre biturbo boxer with no electric assistance. Its main difference from the new GTS T-Hybrid is the absence of an electric turbo and electric motor in the transmission.'
            },
            whatChanged: [
                { title: 'New engine:', text: 'The boxer grows from 3.0 to 3.6 litres, with an electric turbo that eliminates lag and improves low-rev response.' },
                { title: 'Light hybridisation:', text: 'A 54 hp electric motor integrated into the PDK gearbox adds electric torque and allows energy recovery during braking and deceleration.' },
                { title: 'More power:', text: 'The 532 hp exceed the previous GTS by 52 hp and approach the previous 911 Turbo generation.' },
                { title: '400 V architecture:', text: 'The 1.1 kWh battery and thermal management allow sustained track performance without depending on a plug.' }
            ],
            newTechnology: [
                'The electric turbo is the most striking element: an electric motor accelerates the turbine directly, eliminating the typical response delay of large turbos.',
                'The electric unit inside the PDK gearbox acts as launch assistance and fills torque gaps, turning the system into a mechanical extension of the engine.',
                'Unlike a PHEV, the T-Hybrid does not add excessive weight or reduce boot capacity. The battery is small and recharges on the move, maintaining everyday usability.'
            ],
            marketContext: 'Porsche demonstrates that electrification can be an ally of performance without giving up identity. The 911 GTS T-Hybrid is positioned as a more purist alternative to plug-in hybrids such as the Ferrari 296 GTB or McLaren Artura, with a less radical and more traditional 911-user-friendly formula.',
            pricing: {
                price: 'From €170,000',
                market: 'Europe',
                availability: 'Expected to arrive in late 2025',
                note: 'Indicative price for the European market before local taxes.'
            },
            prosCons: {
                pros: [
                    'More power and response without renouncing the naturally aspirated boxer feel.',
                    'No plug needed: it recharges on the move.',
                    'It retains the looks, weight and philosophy of the 911.'
                ],
                cons: [
                    'Greater mechanical complexity and future maintenance cost.',
                    'Higher price than the previous GTS.',
                    'The system\'s behaviour in extreme climates is still unknown.'
                ]
            },
            opinion: 'At CarSpecio we believe the 911 GTS T-Hybrid is the most sensible decision Porsche has made in years: light electrification, without a cable or usage compromises, that improves real-world performance and engine response without distorting the character of the model. It is hybrid, yes, but it does not renounce the boxer soul or the feeling of driving an authentic 911.',
            stats: [
                { value: '532 hp', label: 'Combined power' },
                { value: '2.7 s', label: '0-100 km/h' },
                { value: '1.1 kWh', label: 'Battery' },
                { value: '400 V', label: 'Electric architecture' }
            ],
            timeline: [
                { date: '1963', title: 'Birth of the 911', desc: 'Porsche presents the first 911 with a flat-six boxer engine.' },
                { date: '2011', title: '918 Spyder hybrid', desc: 'Porsche proves that electrification and performance can go hand in hand.' },
                { date: '2025', title: '911 GTS T-Hybrid', desc: 'The first series 911 with a hybrid system reaches the market.' }
            ],
            infoBox: {
                title: 'Key fact',
                text: 'The GTS T-Hybrid electric motor is not between the engine and the gearbox, but integrated into the PDK housing, which reduces inertia and improves response.'
            },
            quote: {
                text: 'The T-Hybrid is not a step towards the electric car; it is a step so that the 911 remains the 911 for decades.',
                author: 'Porsche Engineering'
            },
            warningBox: null
        },
        fr: {
            title: 'Porsche 911 GTS T-Hybrid : le boxer le plus pur s\'électrifie',
            subtitle: 'La première électrification de la légendaire 911 arrive par la porte grande du GTS, en conservant l\'âme du boxer et en ajoutant une dose stratégique d\'électricité.',
            excerpt: 'Porsche introduit le système T-Hybrid dans la 911 GTS : un boxer 3,6 litres avec turbo électrique et un moteur de 54 ch intégré à la boîte PDK, pour une puissance combinée de 532 ch. L\'ensemble fonctionne à 400 V avec une batterie de 1,1 kWh et accélère de 0 à 100 km/h en environ 2,7 secondes.',
            imageCaption: 'Porsche 911 GTS T-Hybrid (2026).',
            sections: [
                {
                    id: 'introduccion',
                    heading: 'Introduction',
                    paragraphs: [
                        'Porsche a fait un pas décisif dans l\'histoire de la 911 avec l\'arrivée du système T-Hybrid. Pour la première fois, la sportive légende intègre l\'électrification sans renier son essence : un moteur boxer six-cylindres à plat, un son inconfondable et une traction arrière (ou intégrale sur les versions 4S).'
                    ]
                },
                {
                    id: 'motor',
                    heading: 'Le système T-Hybrid en détail',
                    paragraphs: [
                        'Le cœur de la 911 GTS T-Hybrid est un boxer 3,6 litres biturbo qui, au lieu d\'un turbocompresseur classique, utilise un turbo électrique. Ce système élimine le turbo lag et offre une réponse immédiate. Il est complété par un moteur électrique de 54 ch intégré à la boîte PDK à huit rapports, qui ajoute 150 Nm de couple supplémentaire.',
                        'La puissance combinée atteint 532 ch, ce qui place la GTS T-Hybrid au-dessus de la Carrera S et très proche de l\'ancienne génération Turbo. Le système fonctionne à 400 volts et stocke l\'énergie dans une batterie lithium-ion de 1,1 kWh.'
                    ]
                },
                {
                    id: 'rendimiento',
                    heading: 'Des performances à la hauteur du mythe',
                    paragraphs: [
                        'Dans les essais de Car and Driver, la 911 GTS T-Hybrid s\'est montrée aussi rapide que raffinée : le 0 à 100 km/h s\'effectue en environ 2,7 secondes, maintenant la 911 comme référence absolue parmi les sportives à moteur arrière-central.'
                    ]
                }
            ],
            inBrief: [
                'Première Porsche 911 de série avec un système hybride, bien que non rechargeable.',
                'Puissance combinée de 532 ch grâce à un boxer 3,6 litres avec turbo électrique et un moteur de 54 ch dans la boîte PDK.',
                'La batterie de 1,1 kWh à 400 V permet la récupération d\'énergie et élimine le turbo lag.',
                'Elle conserve l\'esthétique et la philosophie de la 911, sans besoin de recharge externe.'
            ],
            previousModel: {
                name: 'Porsche 911 Carrera GTS (992.1)',
                year: '2021-2024',
                summary: 'Propulsée par un boxer 3,0 litres biturbo de 480 ch sans assistance électrique. Sa principale différence avec la nouvelle GTS T-Hybrid est l\'absence de turbo électrique et de moteur électrique dans la transmission.'
            },
            whatChanged: [
                { title: 'Nouveau moteur :', text: 'Le boxer passe de 3,0 à 3,6 litres, avec un turbo électrique qui élimine le lag et améliore la réponse aux bas régimes.' },
                { title: 'Hybridation légère :', text: 'Un moteur électrique de 54 ch intégré à la boîte PDK apporte du couple électrique et permet la récupération d\'énergie au freinage et en décélération.' },
                { title: 'Plus de puissance :', text: 'Les 532 ch dépassent de 52 ch la GTS précédente et se rapprochent de l\'ancienne génération 911 Turbo.' },
                { title: 'Architecture 400 V :', text: 'La batterie de 1,1 kWh et la gestion thermique permettent des performances soutenues sur circuit sans dépendre d\'une prise.' }
            ],
            newTechnology: [
                'Le turbo électrique est l\'élément le plus frappant : un moteur électrique accélère directement la turbine, éliminant le retard de réponse typique des gros turbos.',
                'L\'unité électrique dans le carter de la boîte PDK agit comme assistance au démarrage et comble les trous de couple, transformant le système en une extension mécanique du moteur.',
                'Contrairement à un PHEV, le T-Hybrid n\'ajoute pas de poids excessif ni ne réduit le volume du coffre. La batterie est petite et se recharge en roulant, maintenant l\'usabilité quotidienne.'
            ],
            marketContext: 'Porsche démontre que l\'électrification peut être une alliée de la performance sans renier l\'identité. La 911 GTS T-Hybrid se positionne comme une alternative plus puriste face aux hybrides rechargeables comme la Ferrari 296 GTB ou la McLaren Artura, avec une formule moins radicale et plus proche de l\'utilisateur traditionnel de la 911.',
            pricing: {
                price: 'À partir de 170 000 €',
                market: 'Europe',
                availability: 'Arrivée prévue fin 2025',
                note: 'Prix indicatif pour le marché européen avant taxes locales.'
            },
            prosCons: {
                pros: [
                    'Plus de puissance et de réponse sans renier la sensation du boxer atmosphérique.',
                    'Pas besoin de prise : elle se recharge en roulant.',
                    'Elle conserve l\'esthétique, le poids et la philosophie de la 911.'
                ],
                cons: [
                    'Complexité mécanique accrue et coût d\'entretien futur.',
                    'Prix supérieur à celui de la GTS précédente.',
                    'Le comportement du système par climats extrêmes reste inconnu.'
                ]
            },
            opinion: 'Chez CarSpecio, nous pensons que la 911 GTS T-Hybrid est la décision la plus sensée de Porsche depuis des années : une électrification légère, sans câble ni compromis d\'utilisation, qui améliore les performances réelles et la réponse du moteur sans dénaturer le caractère du modèle. C\'est hybride, oui, mais cela ne renie pas l\'âme du boxer ni la sensation de conduire une 911 authentique.',
            stats: [
                { value: '532 ch', label: 'Puissance combinée' },
                { value: '2,7 s', label: '0-100 km/h' },
                { value: '1,1 kWh', label: 'Batterie' },
                { value: '400 V', label: 'Architecture électrique' }
            ],
            timeline: [
                { date: '1963', title: 'Naissance de la 911', desc: 'Porsche présente la première 911 avec un moteur boxer six-cylindres à plat.' },
                { date: '2011', title: '918 Spyder hybride', desc: 'Porsche prouve que l\'électrification et la performance peuvent aller de pair.' },
                { date: '2025', title: '911 GTS T-Hybrid', desc: 'La première 911 de série avec système hybride arrive sur le marché.' }
            ],
            infoBox: {
                title: 'Fait clé',
                text: 'Le moteur électrique de la GTS T-Hybrid n\'est pas entre le moteur et la boîte, mais intégré dans le carter de la PDK, ce qui réduit l\'inertie et améliore la réponse.'
            },
            quote: {
                text: 'Le T-Hybrid n\'est pas un pas vers la voiture électrique ; c\'est un pas pour que la 911 reste la 911 pendant des décennies.',
                author: 'Porsche Engineering'
            },
            warningBox: null
        },
        ar: {
            title: 'بورش 911 GTS T-Hybrid: المحرك الأكثر نقاءً يتحول للهجينة',
            subtitle: 'يصل التهجين الأول للأسطورة 911 عبر باب GTS الكبير، محافظاً على روح البوكسر ويضيف جرعة استراتيجية من الكهرباء.',
            excerpt: 'تقدم بورش نظام T-Hybrid في 911 GTS: محرك بوكسر 3.6 لتر مع توربين كهربائي ومحرك 54 حصان مدمج في علبة PDK، لقوة إجمالية 532 حصان. يعمل النظام على 400 فولت مع بطارية 1.1 كيلوواط ساعة ويتسارع من 0 إلى 100 كم/س في حوالي 2.7 ثانية.',
            imageCaption: 'بورش 911 GTS T-Hybrid (2026).',
            sections: [
                {
                    id: 'introduccion',
                    heading: 'مقدمة',
                    paragraphs: [
                        'خطت بورش خطوة حاسمة في تاريخ 911 مع وصول نظام T-Hybrid. للمرة الأولى، تحصل السيارة الرياضية الأسطورية على التهجين دون التخلي عن جوهرها: محرك بوكسر سداسي الأسطوانات بشكل مسطح، صوت لا يُخطئ، ودفع خلفي (أو كلي في نسخ 4S).'
                    ]
                },
                {
                    id: 'motor',
                    heading: 'نظام T-Hybrid من الداخل',
                    paragraphs: [
                        'قلب 911 GTS T-Hybrid هو محرك بوكسر 3.6 لتر مزدوج التوربين، بدلاً من التوربين التقليدي يستخدم توربين كهربائي. يزيل هذا النظام تأخر التوربين ويوفر استجابة فورية. كما يضاف محرك كهربائي 54 حصان مدمج داخل علبة PDK من ثماني سرعات، يضيف 150 نيوتن متر من العزم الإضافي.',
                        'تصل القوة الإجمالية إلى 532 حصان، رقم يضع GTS T-Hybrid فوق Carrera S وقريباً جداً من جيل Turbo السابق. يعمل النظام على 400 فولت ويخزن الطاقة في بطارية ليثيوم أيون 1.1 كيلوواط ساعة.'
                    ]
                },
                {
                    id: 'rendimiento',
                    heading: 'أداء يعكس الأسطورة',
                    paragraphs: [
                        'في اختبارات Car and Driver، أثبتت 911 GTS T-Hybrid أنها سريعة ورفيعة المستوى: تنجز السرعة من 0 إلى 100 كم/س في حوالي 2.7 ثانية، محافظةً على 911 كمرجع مطلق بين السيارات الرياضية بمحرك وسطي خلفي.'
                    ]
                }
            ],
            inBrief: [
                'أول بورش 911 إنتاجية بنظام هجين، رغم أنها غير قابلة للشحن.',
                'قوة إجمالية 532 حصان بفضل بوكسر 3.6 لتر مع توربين كهربائي ومحرك 54 حصان في علبة PDK.',
                'بطارية 1.1 كيلوواط ساعة على 400 فولت تسمح باستعادة الطاقة وإزالة تأخر التوربين.',
                'تحتفظ بمظهر وفلسفة 911، دون الحاجة إلى شحن خارجي.'
            ],
            previousModel: {
                name: 'بورش 911 Carrera GTS (992.1)',
                year: '2021-2024',
                summary: 'محرك بوكسر 3.0 لتر مزدوج التوربين بقوة 480 حصان بدون مساعدة كهربائية. الفرق الرئيسي مع GTS T-Hybrid الجديدة هو غياب التوربين الكهربائي والمحرك الكهربائي في ناقل الحركة.'
            },
            whatChanged: [
                { title: 'محرك جديد:', text: 'يزيد حجم البوكسر من 3.0 إلى 3.6 لتر، مع توربين كهربائي يزيل التأخر ويحسن الاستجابة عند الانخفاض.' },
                { title: 'تهجين خفيف:', text: 'محرك كهربائي 54 حصان مدمج في علبة PDK يوفر عزم كهربائي ويسمح باستعادة الطاقة عند الكبح والتباطؤ.' },
                { title: 'قوة أكبر:', text: 'تتجاوز 532 حصان بـ 52 حصان GTS السابقة وتقترب من جيل 911 Turbo السابق.' },
                { title: 'بنية 400 فولت:', text: 'البطارية 1.1 كيلوواط ساعة وإدارة الحرارة تسمح بأداء مستدام على الحلبة دون الاعتماد على قابس.' }
            ],
            newTechnology: [
                'التوربين الكهربائي هو العنصر الأبرز: محرك كهربائي يسرع التوربين مباشرة، مما يزيل التأخر النموذجي للتوربينات الكبيرة.',
                'الوحدة الكهربائية داخل علبة PDK تعمل كمساعدة للانطلاق وتملأ فجوات العزم، محولة النظام إلى امتداد ميكانيكي للمحرك.',
                'على عكس PHEV، لا يضيف T-Hybrid وزناً مفرطاً ولا يقلل سعة الصندوق. البطارية صغيرة وتشحن أثناء الحركة، مما يحافظ على قابلية الاستخدام اليومي.'
            ],
            marketContext: 'تثبت بورش أن التهجين يمكن أن يكون حليفاً للأداء دون التخلي عن الهوية. تتموضع 911 GTS T-Hybrid كبديل أكثر نقاءً مقابل الهجينات القابلة للشحن مثل Ferrari 296 GTB أو McLaren Artura، بصيغة أقل تطرفاً وأقرب لمستخدم 911 التقليدي.',
            pricing: {
                price: 'ابتداءً من 170,000 يورو',
                market: 'أوروبا',
                availability: 'من المتوقع الوصول في أواخر 2025',
                note: 'سعر تقريبي للسوق الأوروبي قبل الضرائب المحلية.'
            },
            prosCons: {
                pros: [
                    'المزيد من القوة والاستجابة دون التخلي عن إحساس البوكسر الطبيعي.',
                    'لا حاجة للقابس: تشحن أثناء الحركة.',
                    'تحتفظ بمظهر 911 ووزنها وفلسفتها.'
                ],
                cons: [
                    'تعقيد ميكانيكي أكبر وتكلفة صيانة مستقبلية.',
                    'سعر أعلى من GTS السابقة.',
                    'السلوك في المناخات القصية لا يزال مجهولاً.'
                ]
            },
            opinion: 'في CarSpecio، نعتقد أن 911 GTS T-Hybrid هي القرار الأكثر عقلانية لبورش خلال سنوات: تهجين خفيف، بدون كابل أو تنازلات في الاستخدام، يحسن الأداء الفعلي واستجابة المحرك دون تشويه طابع السيارة. إنها هجينة، نعم، لكنها لا تتنازل عن روح البوكسر أو إحساس قيادة 911 أصيلة.',
            stats: [
                { value: '532 حصان', label: 'القوة الإجمالية' },
                { value: '2.7 ثانية', label: '0-100 كم/س' },
                { value: '1.1 كيلوواط ساعة', label: 'البطارية' },
                { value: '400 فولت', label: 'البنية الكهربائية' }
            ],
            timeline: [
                { date: '1963', title: 'ولادة 911', desc: 'تقدم بورش أول 911 بمحرك بوكسر سداسي الأسطوانات بشكل مسطح.' },
                { date: '2011', title: '918 Spyder الهجينة', desc: 'تثبت بورش أن التهجين والأداء يمكن أن يسيرا جنباً إلى جنب.' },
                { date: '2025', title: '911 GTS T-Hybrid', desc: 'تصل أول 911 إنتاجية بنظام هجين إلى السوق.' }
            ],
            infoBox: {
                title: 'حقيقة أساسية',
                text: 'المحرك الكهربائي في GTS T-Hybrid ليس بين المحرك وعلبة التروس، بل مدمج في علبة PDK، مما يقلل العطالة ويحسن الاستجابة.'
            },
            quote: {
                text: 'T-Hybrid ليست خطوة نحو السيارة الكهربائية؛ إنها خطوة لكي تبقى 911 هي 911 لعقود.',
                author: 'Porsche Engineering'
            },
            warningBox: null
        }
    },
    'bmw-m5-phev-record': {
        en: {
            title: 'BMW M5 PHEV: 727 hp and a record at the Nürburgring',
            subtitle: 'The first plug-in hybrid M5 redefines the boundary between luxury, daily use and extreme performance.',
            excerpt: 'BMW introduces the M5 PHEV, a plug-in hybrid sports saloon with a 4.4-litre V8 biturbo and an electric motor that together produce 727 hp. The M5 PHEV has become the fastest production saloon on the Nürburgring Nordschleife, with a time of 7:35.060.',
            imageCaption: 'BMW M5 PHEV on the Nürburgring.',
            sections: [
                {
                    id: 'concepto',
                    heading: 'A hybrid, but a real M5',
                    paragraphs: [
                        'The seventh generation of the BMW M5 abandons the pure combustion engine formula to adopt a plug-in hybrid system. The recipe is still dominated by the 4.4-litre V8 biturbo, but an electric motor integrated into the eight-speed automatic gearbox raises the combined output to 727 hp. The result is the most powerful M5 in history, but also the heaviest.'
                    ]
                },
                {
                    id: 'datos',
                    heading: 'Supercar figures',
                    paragraphs: [
                        'The result is a combined power output of 727 hp and 1,000 Nm of torque, figures that surpass even many mid-engined supercars. The M xDrive all-wheel drive system distributes power with precision between the four wheels, allowing the 0 to 100 km/h sprint to be completed in just 3.0 seconds, according to Motor Trend measurements.',
                        'In addition to performance, the M5 PHEV offers an electric range of up to 69 km, enabling daily urban journeys without consuming petrol.'
                    ]
                }
            ],
            inBrief: [
                'New generation of the BMW M5 with plug-in hybrid (PHEV) system.',
                'V8 4.4 biturbo + electric motor for 727 hp and 1,000 Nm of torque.',
                '0-100 km/h in 3.0 seconds and 69 km of electric range.',
                'Direct rival of the Porsche Panamera Turbo S E-Hybrid and Mercedes-AMG GT 63 S E Performance.'
            ],
            previousModel: {
                name: 'BMW M5 Competition / M5 CS (F90)',
                year: '2018-2024',
                summary: 'Powered by a 4.4-litre V8 biturbo of 625-635 hp, all-wheel drive and ZF eight-speed gearbox. Powerful and balanced, but without electric assistance or zero-emission range.'
            },
            whatChanged: [
                { title: 'Plug-in hybridisation:', text: 'The M5 adds an electric motor and an 18.6 kWh battery, allowing electric driving and a combined output of 727 hp.' },
                { title: 'Weight increase:', text: 'The battery and electric system add around 400 kg, but the 1,000 Nm of torque and M xDrive traction compensate in acceleration.' },
                { title: 'Comparable performance:', text: 'The 0-100 km/h in 3.0 s matches or improves the previous M5 CS, despite the extra weight.' },
                { title: 'Real daily use:', text: 'The electric range makes the M5 a viable option for urban journeys without starting the V8.' }
            ],
            newTechnology: [
                'The PHEV system combines the S63 V8 with an electric unit integrated into the gearbox, allowing pure electric propulsion, electric assistance or combustion engine power as required.',
                'The high-voltage battery is located under the floor, preserving interior space and lowering the centre of gravity compared to the previous M5.',
                'The M xDrive power management distributes torque between the four wheels with millimetric precision, taking advantage of the instant torque of the electric motor.'
            ],
            marketContext: 'The plug-in hybrid super-saloon segment is increasingly competitive. The M5 PHEV competes directly with the Porsche Panamera Turbo S E-Hybrid and the Mercedes-AMG GT 63 S E Performance. BMW bets on the traditional V8 as a differentiator against Porsche\'s six cylinders or AMG\'s strategy.',
            pricing: {
                price: 'From €150,000',
                market: 'Europe and USA',
                availability: 'Available from spring 2025',
                note: 'The PHEV price may vary by country and equipment.'
            },
            prosCons: {
                pros: [
                    'Supercar power with daily electric range.',
                    'V8 biturbo preserved against rivals with smaller displacement.',
                    'Spacious interior and real use as a family saloon.'
                ],
                cons: [
                    'High weight due to the battery and hybrid system.',
                    'Access price much higher than the previous M5.',
                    'Slow home charging if no wallbox is available.'
                ]
            },
            opinion: 'The BMW M5 PHEV proves that a family saloon can be intimidating on track and civilised in the city. Its weight remains its Achilles heel, but the acceleration figures and electric range more than compensate. It is the most logical transition for an M5 that could no longer ignore electrification.',
            stats: [
                { value: '727 hp', label: 'Combined power' },
                { value: '3.0 s', label: '0-100 km/h' },
                { value: '69 km', label: 'Electric range' },
                { value: '1,000 Nm', label: 'Maximum torque' }
            ],
            timeline: [
                { date: '1984', title: 'Birth of the M5', desc: 'BMW launches the first M5 based on the E28 5 Series.' },
                { date: '2018', title: 'M5 Competition', desc: 'The M5 reaches 625 hp and becomes the reference among sports saloons.' },
                { date: '2025', title: 'M5 PHEV', desc: 'The first plug-in hybrid M5 arrives with 727 hp.' }
            ],
            infoBox: {
                title: 'Key fact',
                text: 'The M5 PHEV\'s electric motor is not between the engine and the gearbox: it is integrated into the housing of the M Steptronic 8-speed automatic, which reduces inertia.'
            },
            quote: {
                text: 'The M5 PHEV is not the end of the combustion engine; it is the V8 proving that it still has a future.',
                author: 'BMW M Engineering'
            },
            warningBox: null
        },
        fr: {
            title: 'BMW M5 PHEV : 727 ch et un record au Nürburgring',
            subtitle: 'La première M5 hybride rechargeable redéfinit la frontière entre le luxe, l\'usage quotidien et la performance extrême.',
            excerpt: 'BMW présente la M5 PHEV, une berline sportive hybride rechargeable avec un V8 biturbo 4,4 litres et un moteur électrique qui produisent ensemble 727 ch. La M5 PHEV est devenue la berline de série la plus rapide du Nürburgring Nordschleife, avec un temps de 7:35,060.',
            imageCaption: 'BMW M5 PHEV sur le Nürburgring.',
            sections: [
                {
                    id: 'concepto',
                    heading: 'Une hybride, mais une vraie M5',
                    paragraphs: [
                        'La septième génération de la BMW M5 abandonne la formule moteur purement thermique pour adopter un système hybride rechargeable. La recette reste dominée par le V8 biturbo 4,4 litres, mais un moteur électrique intégré à la boîte automatique à huit rapports élève la puissance combinée à 727 ch. Le résultat est la M5 la plus puissante de l\'histoire, mais aussi la plus lourde.'
                    ]
                },
                {
                    id: 'datos',
                    heading: 'Des chiffres de supercar',
                    paragraphs: [
                        'Le résultat est une puissance combinée de 727 ch et un couple de 1 000 Nm, des chiffres qui surpassent même de nombreuses supercars à moteur central. Le système de traction intégrale M xDrive distribue la puissance avec précision entre les quatre roues, permettant au 0 à 100 km/h de s\'effectuer en seulement 3,0 secondes, selon les mesures de Motor Trend.',
                        'En plus des performances, la M5 PHEV offre une autonomie électrique allant jusqu\'à 69 km, permettant des déplacements urbains quotidiens sans consommer d\'essence.'
                    ]
                }
            ],
            inBrief: [
                'Nouvelle génération de la BMW M5 avec système hybride rechargeable (PHEV).',
                'V8 4,4 biturbo + moteur électrique pour 727 ch et 1 000 Nm de couple.',
                '0 à 100 km/h en 3,0 secondes et 69 km d\'autonomie électrique.',
                'Rival direct de la Porsche Panamera Turbo S E-Hybrid et de la Mercedes-AMG GT 63 S E Performance.'
            ],
            previousModel: {
                name: 'BMW M5 Competition / M5 CS (F90)',
                year: '2018-2024',
                summary: 'Propulsée par un V8 biturbo 4,4 litres de 625-635 ch, traction intégrale et boîte ZF à huit rapports. Puissante et équilibrée, mais sans assistance électrique ni autonomie en mode zéro émission.'
            },
            whatChanged: [
                { title: 'Hybridation rechargeable :', text: 'La M5 ajoute un moteur électrique et une batterie de 18,6 kWh, permettant une conduite électrique et une puissance combinée de 727 ch.' },
                { title: 'Augmentation du poids :', text: 'La batterie et le système électrique ajoutent environ 400 kg, mais les 1 000 Nm de couple et la traction M xDrive compensent à l\'accélération.' },
                { title: 'Performance comparable :', text: 'Le 0 à 100 km/h en 3,0 s égale ou améliore l\'ancienne M5 CS, malgré le poids supplémentaire.' },
                { title: 'Usage quotidien réel :', text: 'L\'autonomie électrique fait de la M5 une option viable pour les trajets urbains sans démarrer le V8.' }
            ],
            newTechnology: [
                'Le système PHEV combine le V8 S63 avec une unité électrique intégrée à la boîte, permettant une propulsion purement électrique, une assistance électrique ou un moteur thermique selon les besoins.',
                'La batterie haute tension est située sous le plancher, préservant l\'espace intérieur et abaissant le centre de gravité par rapport à l\'ancienne M5.',
                'La gestion de puissance M xDrive distribue le couple entre les quatre roues avec une précision millimétrique, profitant du couple instantané du moteur électrique.'
            ],
            marketContext: 'Le segment des super-berlines hybrides rechargeables est de plus en plus disputé. La M5 PHEV concurrence directement la Porsche Panamera Turbo S E-Hybrid et la Mercedes-AMG GT 63 S E Performance. BMW mise sur le V8 traditionnel comme différentiel face aux six cylindres de Porsche ou à la stratégie AMG.',
            pricing: {
                price: 'À partir de 150 000 €',
                market: 'Europe et États-Unis',
                availability: 'Disponible à partir du printemps 2025',
                note: 'Le prix de la version PHEV peut varier selon le pays et l\'équipement.'
            },
            prosCons: {
                pros: [
                    'Puissance de supercar avec autonomie électrique quotidienne.',
                    'V8 biturbo conservé face aux rivaux plus petits en cylindrée.',
                    'Intérieur spacieux et usage réel comme berline familiale.'
                ],
                cons: [
                    'Poids élevé dû à la batterie et au système hybride.',
                    'Prix d\'accès bien supérieur à celui de l\'ancienne M5.',
                    'Recharge domestique lente si aucun wallbox n\'est disponible.'
                ]
            },
            opinion: 'La BMW M5 PHEV prouve qu\'une berline familiale peut être intimidante sur circuit et civilisée en ville. Son poids reste son talon d\'Achille, mais les chiffres d\'accélération et l\'autonomie électrique compensent largement. C\'est la transition la plus logique pour une M5 qui ne pouvait plus ignorer l\'électrification.',
            stats: [
                { value: '727 ch', label: 'Puissance combinée' },
                { value: '3,0 s', label: '0-100 km/h' },
                { value: '69 km', label: 'Autonomie électrique' },
                { value: '1 000 Nm', label: 'Couple maximum' }
            ],
            timeline: [
                { date: '1984', title: 'Naissance de la M5', desc: 'BMW lance la première M5 basée sur la Série 5 E28.' },
                { date: '2018', title: 'M5 Competition', desc: 'La M5 atteint 625 ch et devient la référence parmi les berlines sportives.' },
                { date: '2025', title: 'M5 PHEV', desc: 'La première M5 hybride rechargeable arrive avec 727 ch.' }
            ],
            infoBox: {
                title: 'Fait clé',
                text: 'Le moteur électrique de la M5 PHEV n\'est pas entre le moteur et la boîte : il est intégré dans le carter de la M Steptronic automatique à huit rapports, ce qui réduit l\'inertie.'
            },
            quote: {
                text: 'La M5 PHEV n\'est pas la fin du moteur thermique ; c\'est le V8 prouvant qu\'il a encore un avenir.',
                author: 'BMW M Engineering'
            },
            warningBox: null
        },
        ar: {
            title: 'BMW M5 PHEV: 727 حصان ورقم قياسي في نوربرغرينغ',
            subtitle: 'أول M5 هجينة قابلة للشحن تعيد تعريف الحدود بين الفخامة والاستخدام اليومي والأداء المتطرف.',
            excerpt: 'تقدم BMW M5 PHEV، سيدان رياضية هجينة قابلة للشحن مع محرك V8 مزدوج التوربين 4.4 لتر ومحرك كهربائي ينتجان معاً 727 حصان. أصبحت M5 PHEV أسرع سيدان إنتاجية في حلبة نوربرغرينغ نوردشلايفه، بزمن 7:35.060.',
            imageCaption: 'BMW M5 PHEV في نوربرغرينغ.',
            sections: [
                {
                    id: 'concepto',
                    heading: 'هجينة، لكن M5 حقيقية',
                    paragraphs: [
                        'تتخلى الجيل السابع من BMW M5 عن صيغة المحرك الحرقية النقي لاعتماد نظام هجين قابل للشحن. لا تزال الوصفة تهيمن عليها V8 biturbo 4.4 لتر، لكن محرك كهربائي مدمج في علبة التغيير الأوتوماتيكية بثماني سرعات يرفع القوة الإجمالية إلى 727 حصان. النتيجة هي أقوى M5 في التاريخ، لكنها أيضاً الأثقل.'
                    ]
                },
                {
                    id: 'datos',
                    heading: 'أرقام خارقة',
                    paragraphs: [
                        'النتيجة هي قوة إجمالية 727 حصان وعزم 1,000 نيوتن متر، أرقام تتجاوز حتى العديد من السيارات الخارقة بمحرك وسطي. يوزع نظام الدفع الرباعي M xDrive القوة بدقة بين العجلات الأربع، مما يسمح بإنجاز التسارع من 0 إلى 100 كم/س في 3.0 ثانية فقط، وفقاً لقياسات Motor Trend.',
                        'بالإضافة إلى الأداء، توفر M5 PHEV مدى كهربائياً يصل إلى 69 كم، مما يسمح بالتنقلات اليومية الحضرية دون استهلاك الوقود.'
                    ]
                }
            ],
            inBrief: [
                'جيل جديد من BMW M5 بنظام هجين قابل للشحن (PHEV).',
                'V8 4.4 biturbo + محرك كهربائي لـ 727 حصان و 1,000 نيوتن متر من العزم.',
                '0-100 كم/س في 3.0 ثانية ومدى كهربائي 69 كم.',
                'منافس مباشر لـ Porsche Panamera Turbo S E-Hybrid و Mercedes-AMG GT 63 S E Performance.'
            ],
            previousModel: {
                name: 'BMW M5 Competition / M5 CS (F90)',
                year: '2018-2024',
                summary: 'محرك V8 biturbo 4.4 لتر بقوة 625-635 حصان، دفع كلي وعلبة ZF بثماني سرعات. قوية ومتوازنة، لكن بدون مساعدة كهربائية أو مدى في وضع الانبعاثات الصفرية.'
            },
            whatChanged: [
                { title: 'التهجين القابل للشحن:', text: 'تضيف M5 محركاً كهربائياً وبطارية 18.6 كيلوواط ساعة، مما يسمح بالقيادة الكهربائية والقوة الإجمالية 727 حصان.' },
                { title: 'زيادة الوزن:', text: 'تضيف البطارية والنظام الكهربائي حوالي 400 كجم، لكن عزم 1,000 نيوتن متر والدفع الرباعي M xDrive يعوضان في التسارع.' },
                { title: 'أداء مقارن:', text: '0-100 كم/س في 3.0 ثانية يعادل أو يحسن M5 CS السابقة، على الرغم من الوزن الإضافي.' },
                { title: 'استخدام يومي حقيقي:', text: 'المدى الكهربائي يجعل M5 خياراً قابلاً للتطبيق للتنقلات الحضرية دون تشغيل V8.' }
            ],
            newTechnology: [
                'يجمع نظام PHEV بين V8 S63 ووحدة كهربائية مدمجة في العلبة، مما يسمح بالدفع النقي الكهربائي أو المساعدة الكهربائية أو المحرك الحرقية حسب الطلب.',
                'تقع البطارية عالية الجهد تحت الأرضية، محافظةً على مساحة المقصورة وخافضةً مركز الثقل مقارنة بـ M5 السابقة.',
                'توزع إدارة الطاقة M xDrive العزم بين العجلات الأربع بدقة مليمترية، مستفيدة من عزم المحرك الكهربائي الفوري.'
            ],
            marketContext: 'يصبح قطاع السيدان الفائقة الهجينة القابلة للشحن أكثر تنافسية. تتنافس M5 PHEV مباشرة مع Porsche Panamera Turbo S E-Hybrid و Mercedes-AMG GT 63 S E Performance. تراهن BMW على V8 التقليدي كميزة تمييز مقابل أسطوانات Porsche الست أو استراتيجية AMG.',
            pricing: {
                price: 'ابتداءً من 150,000 يورو',
                market: 'أوروبا والولايات المتحدة',
                availability: 'متاحة اعتباراً من ربيع 2025',
                note: 'قد يختلف سعر نسخة PHEV حسب البلد والتجهيزات.'
            },
            prosCons: {
                pros: [
                    'قوة خارقة مع مدى كهربائي يومي.',
                    'V8 biturbo محتفظ به مقابل منافسين بسعة أصغر.',
                    'مقصورة فسيحة واستخدام حقيقي كسيدان عائلية.'
                ],
                cons: [
                    'وزن مرتفع بسبب البطارية ونظام الهجين.',
                    'سعر الوصول أعلى بكثير من M5 السابقة.',
                    'شحن منزلي بطيء إذا لم يتوفر wallbox.'
                ]
            },
            opinion: 'تثبت BMW M5 PHEV أن السيدان العائلية يمكن أن تكون مخيفة في الحلبة ومهذبة في المدينة. يبقى وزنها نقطة الضعف، لكن أرقام التسارع والمدى الكهربائي يعوضان بكثير. إنها الانتقال الأكثر منطقية لـ M5 لم تكن تستطيع مواصلة تجاهل التهجين.',
            stats: [
                { value: '727 حصان', label: 'القوة الإجمالية' },
                { value: '3.0 ثانية', label: '0-100 كم/س' },
                { value: '69 كم', label: 'المدى الكهربائي' },
                { value: '1,000 نيوتن متر', label: 'العزم الأقصى' }
            ],
            timeline: [
                { date: '1984', title: 'ولادة M5', desc: 'تطلق BMW أول M5 بناءً على سلسلة 5 E28.' },
                { date: '2018', title: 'M5 Competition', desc: 'تصل M5 إلى 625 حصان وتصبح مرجعاً بين السيدان الرياضية.' },
                { date: '2025', title: 'M5 PHEV', desc: 'تصل أول M5 هجينة قابلة للشحن بقوة 727 حصان.' }
            ],
            infoBox: {
                title: 'حقيقة أساسية',
                text: 'المحرك الكهربائي في M5 PHEV ليس بين المحرك والعلبة: إنه مدمج في علبة M Steptronic الأوتوماتيكية بثماني سرعات، مما يقلل العطالة.'
            },
            quote: {
                text: 'M5 PHEV ليست نهاية المحرك الحرق؛ إنها V8 تثبت أنها لا تزال تمتلك مستقبلاً.',
                author: 'BMW M Engineering'
            },
            warningBox: null
        }
    },
    'audi-rs7-performance-2026': {
        en: {
            title: 'Audi RS7 Performance 2026: 630 hp of pure sports elegance',
            subtitle: 'Audi raises the bar for its sports fastback with a Performance version that sacrifices neither comfort nor usability.',
            excerpt: 'Audi renews the RS7 with the Performance version, raising the power of the V8 biturbo to 630 hp and improving dynamics without giving up daily comfort.',
            imageCaption: 'Audi RS7 Performance 2026.',
            sections: [
                {
                    id: 'motor',
                    heading: 'Even more powerful V8 biturbo',
                    paragraphs: [
                        'Audi presents the Performance version of its RS7 Sportback, an evolution that raises the power of the 4.0 TFSI V8 biturbo to 630 hp, 39 hp more than the standard RS7. Maximum torque is 850 Nm, available almost from idle thanks to the two turbos placed inside the V of the engine.'
                    ]
                },
                {
                    id: 'dinamica',
                    heading: 'Dynamics and comfort in balance',
                    paragraphs: [
                        'Permanent Quattro traction remains the hallmark of the RS7 Performance. With more aggressive electronic management of the rear differential and specific air suspension, the German sports car improves its cornering behaviour without losing the smoothness that makes it usable every day.',
                        'Despite exceeding 2,000 kg, the RS7 Performance accelerates from 0 to 100 km/h in less than 3.4 seconds and reaches a top speed limited to 305 km/h, extendable to 320 km/h with the RS Dynamic package.'
                    ]
                }
            ],
            inBrief: [
                'New Performance variant of the Audi RS7 Sportback.',
                'Power of the 4.0 TFSI V8 raised to 630 hp (+39 hp) and 850 Nm of torque.',
                'Acceleration from 0 to 100 km/h in less than 3.4 seconds and top speed of 305 km/h.',
                'Fastback design, Quattro traction and room for five passengers.'
            ],
            previousModel: {
                name: 'Audi RS7 Sportback (2020-2025)',
                year: '2020-2025',
                summary: '4.0 TFSI V8 of 591 hp and 800 Nm, with Quattro traction and a chassis more oriented to comfort. The Performance amplifies the sporty side without losing usability.'
            },
            whatChanged: [
                { title: 'More power and torque:', text: 'It rises from 591 to 630 hp and from 800 to 850 Nm, with more aggressive turbo management.' },
                { title: 'Sport differential:', text: 'The rear torque distribution is more proactive, allowing more agile behaviour in tight corners.' },
                { title: 'Specific suspension:', text: 'The Performance air suspension is 10% stiffer in dynamic mode, reducing body roll.' },
                { title: 'Top speed:', text: '305 km/h as standard, extendable to 320 km/h with the RS Dynamic package.' }
            ],
            newTechnology: [
                'The 4.0 TFSI V8 with cylinder deactivation maintains its efficiency in gentle driving, despite the 630 hp. The intake and cooling system has been reinforced to withstand the power increase.',
                'Quattro traction management is synchronised with the sport rear differential, sending more torque to the outer wheel to reduce understeer.',
                'Progressive steering and optional carbon-ceramic brakes improve the ability to repeat intense driving.'
            ],
            marketContext: 'The RS7 Performance sits between the BMW M5 PHEV and the Mercedes-AMG GT 4-door. Audi does not opt for plug-in hybridisation, but competes with a classic V8, coupé design and a more spacious interior than the GT 4-door.',
            pricing: {
                price: 'From €145,000',
                market: 'Europe',
                availability: 'Expected arrival at the end of 2025',
                note: 'The RS Dynamic package and carbon options increase the final price.'
            },
            prosCons: {
                pros: [
                    'Fastback design with room for five passengers.',
                    'Classic V8 and Quattro traction without relying on a plug.',
                    'Balance between daily comfort and extreme performance.'
                ],
                cons: [
                    'Weight higher than lighter rivals.',
                    'High price once carbon options are added.',
                    'No hybrid or electric option in this generation.'
                ]
            },
            opinion: 'The RS7 Performance is the perfect car for those looking for a four-door coupé design, a luxurious interior and a mechanics capable of humbling many sports cars. Audi continues to dominate the high-performance saloon formula, and this Performance version adds the temperament that the standard RS7 lacked.',
            stats: [
                { value: '630 hp', label: 'Power' },
                { value: '850 Nm', label: 'Maximum torque' },
                { value: '3.4 s', label: '0-100 km/h' },
                { value: '305 km/h', label: 'Top speed' }
            ],
            timeline: [
                { date: '2010', title: 'RS7 Sportback born', desc: 'Audi introduces the first generation of its sports fastback.' },
                { date: '2019', title: 'Second generation', desc: 'The RS7 is renewed with a more aggressive design and a more advanced chassis.' },
                { date: '2026', title: 'RS7 Performance', desc: 'Audi raises the power of the V8 to 630 hp in the new Performance variant.' }
            ],
            infoBox: {
                title: 'Key fact',
                text: 'The RS7 Performance\'s 4.0 TFSI V8 uses cylinder deactivation, allowing it to drive as a four-cylinder on gentle journeys to save fuel.'
            },
            quote: {
                text: 'The RS7 Performance proves that a four-door car can be as exciting as a pure sports car.',
                author: 'Audi Sport'
            },
            warningBox: null
        },
        fr: {
            title: 'Audi RS7 Performance 2026 : 630 ch de pure élégance sportive',
            subtitle: 'Audi relève le niveau de son fastback sportif avec une version Performance qui ne sacrifie ni le confort ni l\'usabilité.',
            excerpt: 'Audi renouvelle le RS7 avec la version Performance, élevant la puissance du V8 biturbo à 630 ch et améliorant la dynamique sans renoncer au confort quotidien.',
            imageCaption: 'Audi RS7 Performance 2026.',
            sections: [
                {
                    id: 'motor',
                    heading: 'V8 biturbo encore plus puissant',
                    paragraphs: [
                        'Audi présente la version Performance de son RS7 Sportback, une évolution qui élève la puissance du V8 4.0 TFSI biturbo à 630 ch, soit 39 ch de plus que le RS7 standard. Le couple maximum atteint 850 Nm, disponible presque depuis le ralenti grâce aux deux turbos placés à l\'intérieur du V du moteur.'
                    ]
                },
                {
                    id: 'dinamica',
                    heading: 'Dynamique et confort en équilibre',
                    paragraphs: [
                        'La traction Quattro permanente reste la marque de fabrique du RS7 Performance. Avec une gestion électronique plus agressive du différentiel arrière et une suspension pneumatique spécifique, la sportive allemande améliore son comportement en courbe sans perdre la douceur qui la rend utilisable au quotidien.',
                        'Malgré une masse supérieure à 2 000 kg, le RS7 Performance accélère de 0 à 100 km/h en moins de 3,4 secondes et atteint une vitesse maximale limitée à 305 km/h, extensible à 320 km/h avec le pack RS Dynamic.'
                    ]
                }
            ],
            inBrief: [
                'Nouvelle variante Performance de l\'Audi RS7 Sportback.',
                'Puissance du V8 4.0 TFSI élevée à 630 ch (+39 ch) et 850 Nm de couple.',
                'Accélération de 0 à 100 km/h en moins de 3,4 secondes et vitesse de pointe de 305 km/h.',
                'Design fastback, traction Quattro et habitabilité pour cinq passagers.'
            ],
            previousModel: {
                name: 'Audi RS7 Sportback (2020-2025)',
                year: '2020-2025',
                summary: 'V8 4.0 TFSI de 591 ch et 800 Nm, avec traction Quattro et châssis plus orienté vers le confort. Le Performance amplifie le côté sportif sans perdre l\'usabilité.'
            },
            whatChanged: [
                { title: 'Plus de puissance et de couple :', text: 'Il passe de 591 à 630 ch et de 800 à 850 Nm, avec une gestion plus agressive des turbos.' },
                { title: 'Différentiel sport :', text: 'Le répartition du couple arrière est plus proactive, permettant un comportement plus agile dans les virages serrés.' },
                { title: 'Suspension spécifique :', text: 'La suspension pneumatique du Performance est 10 % plus rigide en mode dynamique, réduisant les roulis.' },
                { title: 'Vitesse de pointe :', text: '305 km/h de série, extensible à 320 km/h avec le pack RS Dynamic.' }
            ],
            newTechnology: [
                'Le V8 4.0 TFSI avec désactivation de cylindres maintient son efficacité en conduite douce, malgré les 630 ch. Le système d\'admission et de refroidissement a été renforcé pour supporter l\'augmentation de puissance.',
                'La gestion de la traction Quattro se synchronise avec le différentiel arrière sport, envoyant plus de couple à la roue extérieure pour réduire le sous-virage.',
                'La direction progressive et les freins en carbo-céramique optionnels améliorent la capacité de répétition en conduite intense.'
            ],
            marketContext: 'Le RS7 Performance se situe entre la BMW M5 PHEV et la Mercedes-AMG GT 4 portes. Audi n\'opta pas pour l\'hybridation rechargeable, mais compétit avec un V8 classique, un design coupé et un intérieur plus spacieux que le GT 4 portes.',
            pricing: {
                price: 'À partir de 145 000 €',
                market: 'Europe',
                availability: 'Arrivée prévue fin 2025',
                note: 'Le pack RS Dynamic et les options en carbone augmentent le prix final.'
            },
            prosCons: {
                pros: [
                    'Design fastback avec habitabilité pour cinq passagers.',
                    'V8 classique et traction Quattro sans dépendre d\'une prise.',
                    'Équilibre entre confort quotidien et performance extrême.'
                ],
                cons: [
                    'Poids supérieur à des rivaux plus légers.',
                    'Prix élevé une fois ajoutées les options en carbone.',
                    'Sans option hybride ni électrique sur cette génération.'
                ]
            },
            opinion: 'Le RS7 Performance est la voiture parfaite pour qui recherche un design de coupé quatre portes, un intérieur de luxe et une mécanique capable de humilier beaucoup de sportives. Audi continue de dominer la formule de la berline de haute performance, et cette version Performance ajoute le tempérament qui manquait au RS7 standard.',
            stats: [
                { value: '630 ch', label: 'Puissance' },
                { value: '850 Nm', label: 'Couple maximum' },
                { value: '3,4 s', label: '0-100 km/h' },
                { value: '305 km/h', label: 'Vitesse maximale' }
            ],
            timeline: [
                { date: '2010', title: 'Naissance du RS7 Sportback', desc: 'Audi présente la première génération de son fastback sportif.' },
                { date: '2019', title: 'Deuxième génération', desc: 'Le RS7 se renouvelle avec un design plus agressif et un châssis plus avancé.' },
                { date: '2026', title: 'RS7 Performance', desc: 'Audi porte la puissance du V8 à 630 ch dans la nouvelle variante Performance.' }
            ],
            infoBox: {
                title: 'Fait clé',
                text: 'Le V8 4.0 TFSI du RS7 Performance utilise la désactivation de cylindres, lui permettant de rouler en quatre cylindres sur les trajets doux pour économiser du carburant.'
            },
            quote: {
                text: 'Le RS7 Performance prouve qu\'une voiture quatre portes peut être aussi excitante qu\'une sportive pure.',
                author: 'Audi Sport'
            },
            warningBox: null
        },
        ar: {
            title: 'أودي RS7 Performance 2026: 630 حصان من الأناقة الرياضية النقية',
            subtitle: 'ترفع أودي سقف فاستباك الرياضي بنسخة Performance لا تضحي بالراحة أو القابلية للاستخدام.',
            excerpt: 'تجدد أودي RS7 بنسخة Performance، رافعةً قوة V8 المزدوج التوربين إلى 630 حصان وتحسين الديناميكيات دون التخلي عن الراحة اليومية.',
            imageCaption: 'أودي RS7 Performance 2026.',
            sections: [
                {
                    id: 'motor',
                    heading: 'V8 مزدوج التوربين أكثر قوة',
                    paragraphs: [
                        'تقدم أودي نسخة Performance من RS7 Sportback، تطوير يرفع قوة V8 4.0 TFSI المزدوج التوربين إلى 630 حصان، بزيادة 39 حصان عن RS7 القياسي. يصل العزم الأقصى إلى 850 نيوتن متر، متاحاً تقريباً من الخمول بفضل التوربينين المثبتين داخل V المحرك.'
                    ]
                },
                {
                    id: 'dinamica',
                    heading: 'توازن بين الديناميكية والراحة',
                    paragraphs: [
                        'يظل الدفع الرباعي Quattro الدائم السمة المميزة لـ RS7 Performance. مع إدارة إلكترونية أكثر عدوانية للنفور الخلفي ونظام تعليق هوائي خاص، تحسن السيارة الرياضية الألمانية سلوكها في المنعطفات دون فقدان السلاسة التي تجعلها قابلة للاستخدام يومياً.',
                        'على الرغم من تجاوزها 2,000 كجم، تتسارع RS7 Performance من 0 إلى 100 كم/س في أقل من 3.4 ثانية وتصل إلى سرعة قصوى محدودة 305 كم/س، قابلة للتمديد إلى 320 كم/س مع حزمة RS Dynamic.'
                    ]
                }
            ],
            inBrief: [
                'نسخة Performance جديدة من Audi RS7 Sportback.',
                'قوة V8 4.0 TFSI مرتفعة إلى 630 حصان (+39 حصان) وعزم 850 نيوتن متر.',
                'تسارع 0-100 كم/س في أقل من 3.4 ثانية وسرعة قصوى 305 كم/س.',
                'تصميم فاستباك، دفع Quattro ومساحة لخمسة ركاب.'
            ],
            previousModel: {
                name: 'أودي RS7 Sportback (2020-2025)',
                year: '2020-2025',
                summary: 'V8 4.0 TFSI بقوة 591 حصان وعزم 800 نيوتن متر، مع دفع Quattro وهيكل أكثر توجهاً نحو الراحة. تضخم Performance الجانب الرياضي دون فقدان القابلية للاستخدام.'
            },
            whatChanged: [
                { title: 'قوة وعزم أكبر:', text: 'تزيد من 591 إلى 630 حصان ومن 800 إلى 850 نيوتن متر، مع إدارة أكثر عدوانية للتوربينات.' },
                { title: 'نفور رياضي:', text: 'توزيع العزم الخلفي أكثر استباقية، مما يسمح بسلوك أكثر رشاقة في المنعطفات الضيقة.' },
                { title: 'تعليق خاص:', text: 'التعليق الهوائي لـ Performance أكثر صلابة بنسبة 10% في الوضع الديناميكي، مما يقلل التمايل.' },
                { title: 'السرعة القصوى:', text: '305 كم/س قياسياً، قابلة للتمديد إلى 320 كم/س مع حزمة RS Dynamic.' }
            ],
            newTechnology: [
                'يحافظ V8 4.0 TFSI مع إلغاء أسطوانات على كفاءته في القيادة الهادئة، على الرغم من 630 حصان. تم تعزيز نظام التهوية والتبريد لتحمل زيادة القوة.',
                'تتزامن إدارة الدفع الرباعي Quattro مع النفور الخلفي الرياضي، إرسال المزيد من العزم للعجلة الخارجية لتقليل الانزلاق الأمامي.',
                'تحسن التوجيه التدريجي ومكابح الكربون-سيراميك الاختيارية القدرة على تكرار القيادة المكثفة.'
            ],
            marketContext: 'تقع RS7 Performance بين BMW M5 PHEV وMercedes-AMG GT 4 أبواب. لا تختار أودي الهجين القابل للشحن، بل تتنافس بمحرك V8 كلاسيكي وتصميم كوبيه ومقصورة أكثر اتساعاً من GT 4 أبواب.',
            pricing: {
                price: 'ابتداءً من 145,000 يورو',
                market: 'أوروبا',
                availability: 'من المتوقع الوصول في أواخر 2025',
                note: 'تزيد حزمة RS Dynamic وخيارات الكربون من السعر النهائي.'
            },
            prosCons: {
                pros: [
                    'تصميم فاستباك مع مساحة لخمسة ركاب.',
                    'V8 كلاسيكي ودفع Quattro دون الحاجة إلى قابس.',
                    'توازن بين الراحة اليومية والأداء المتطرف.'
                ],
                cons: [
                    'وزن أعلى من المنافسين الأخف.',
                    'سعر مرتفع بمجرد إضافة خيارات الكربون.',
                    'لا توجد خيار هجين أو كهربائي في هذا الجيل.'
                ]
            },
            opinion: 'RS7 Performance هي السيارة المثالية لمن يبحث عن تصميم كوبيه بأربعة أبواب، ومقصورة فاخرة، وميكانيكا قادرة على إحراج العديد من السيارات الرياضية. تواصل أودي هيمنة على صيغة السيدان عالية الأداء، وتضيف هذه النسخة Performance الحماسة التي كان ينقصها RS7 القياسي.',
            stats: [
                { value: '630 حصان', label: 'القوة' },
                { value: '850 نيوتن متر', label: 'العزم الأقصى' },
                { value: '3.4 ثانية', label: '0-100 كم/س' },
                { value: '305 كم/س', label: 'السرعة القصوى' }
            ],
            timeline: [
                { date: '2010', title: 'ولادة RS7 Sportback', desc: 'تقدم أودي الجيل الأول من فاستباك الرياضي.' },
                { date: '2019', title: 'الجيل الثاني', desc: 'تتجدد RS7 بتصميم أكثر عدوانية وهيكل أكثر تقدماً.' },
                { date: '2026', title: 'RS7 Performance', desc: 'ترفع أودي قوة V8 إلى 630 حصان في نسخة Performance الجديدة.' }
            ],
            infoBox: {
                title: 'حقيقة أساسية',
                text: 'يستخدم V8 4.0 TFSI في RS7 Performance إلغاء الأسطوانات، مما يسمح له بالسير بأربع أسطوانات في الرحلات الهادئة لتوفير الوقود.'
            },
            quote: {
                text: 'تثبت RS7 Performance أن سيارة بأربعة أبواب يمكن أن تكون مثيرة مثل السيارة الرياضية النقية.',
                author: 'Audi Sport'
            },
            warningBox: null
        }
    },
    'tesla-model-s-plaid-refresh': {
        en: {
            title: 'Tesla updates the Model S Plaid with more range and faster charging',
            subtitle: 'Tesla\'s fastest electric saloon receives an update focused on efficiency and user experience.',
            excerpt: 'The high-performance electric saloon receives improvements in the battery and power electronics, achieving up to 640 km of real range.',
            imageCaption: 'Tesla Model S Plaid refresh.',
            sections: [
                {
                    id: 'autonomia',
                    heading: 'More real range',
                    paragraphs: [
                        'Tesla has updated the Model S Plaid with improvements focused on efficiency and recharging. The high-performance electric saloon maintains its three motors and 1,020 hp of power, but new thermal management and revised power electronics allow more range to be extracted from the same battery.',
                        'According to Motor1 estimates, real-world mixed-use range is around 640 km, a notable increase over the previous generation.'
                    ]
                },
                {
                    id: 'tecnologia',
                    heading: 'Improved charging and technology',
                    paragraphs: [
                        'The Model S Plaid refresh is compatible with higher maximum charging power at V4 Superchargers, reducing the time needed to recover from 10 to 80% of the battery under optimal conditions. The central screen also receives a new graphics processor for a smoother interface.',
                        'In the dynamic section, Tesla has adjusted the adaptive suspension and steering to offer greater precision without sacrificing comfort.'
                    ]
                }
            ],
            inBrief: [
                'Update of the Tesla Model S Plaid focused on efficiency and charging.',
                'Maintains the 1,020 hp and three motors, but gains real range.',
                'Estimated mixed-use range of 640 km, according to Motor1.',
                'Improved compatibility with V4 Superchargers and new graphics processor.'
            ],
            previousModel: {
                name: 'Tesla Model S Plaid (2021-2025)',
                year: '2021-2025',
                summary: 'Three motors, 1,020 hp and a real range of about 550-600 km depending on conditions. Reference in acceleration, but with thermal throttling in intensive uses and maximum charging limited to V3.'
            },
            whatChanged: [
                { title: 'More real range:', text: 'Thermal management and improved power electronics allow better use of the battery capacity, approaching 640 km real.' },
                { title: 'Faster charging:', text: 'Compatibility with V4 Superchargers, which reduce the 10 to 80% time under optimal conditions.' },
                { title: 'Better interface:', text: 'New graphics processor for the central screen, with lower latency and smoother graphics.' },
                { title: 'Tweaked suspension:', text: 'Adaptive damping and steering adjusted for greater precision without sacrificing comfort.' }
            ],
            newTechnology: [
                'The thermal management of the inverter and battery pack has been revised to reduce thermal throttling in repeated sporty driving.',
                'The fourth-generation power electronics allow higher and more sustained charging peaks, key for V4 Superchargers.',
                'The new entertainment processor improves the fluidity of games, navigation and camera system response.'
            ],
            marketContext: 'The premium electric saloon segment has filled with rivals: Lucid Air, Porsche Taycan, Mercedes EQS and BMW i7. Tesla responds with a conservative update that improves the weak points of the Model S Plaid without altering its successful formula.',
            pricing: {
                price: 'From $110,000 / €120,000',
                market: 'USA and Europe',
                availability: 'Available for order since late 2024',
                note: 'Price may vary by market and Tesla tariff updates.'
            },
            prosCons: {
                pros: [
                    'Improved real range without losing the 1,020 hp.',
                    'Compatibility with V4 Superchargers for faster recharges.',
                    'Smoother infotainment system.'
                ],
                cons: [
                    'Exterior and interior design without significant changes.',
                    'Build quality remains a point of discussion.',
                    'Competition with better finishes in the premium segment.'
                ]
            },
            opinion: 'The Model S Plaid was already the reference for electric acceleration. Now, with better range, faster charging and a smoother digital experience, Tesla responds to the two main objections of the most demanding buyers without touching the power or identity of the model.',
            stats: [
                { value: '1,020 hp', label: 'Power' },
                { value: '640 km', label: 'Real range' },
                { value: '~2 s', label: '0-100 km/h' }
            ],
            timeline: [
                { date: '2012', title: 'Model S born', desc: 'Tesla launches the Model S, revolutionising the electric saloon.' },
                { date: '2021', title: 'Plaid arrives', desc: 'The Model S Plaid reaches 1,020 hp and becomes the fastest electric saloon.' },
                { date: '2026', title: 'Plaid refresh', desc: 'Tesla improves range, charging and technology without changing the formula.' }
            ],
            infoBox: {
                title: 'Key fact',
                text: 'The Model S Plaid retains its three motors and 1,020 hp, but the revised thermal management allows it to maintain peak performance for longer and extend real range.'
            },
            quote: {
                text: 'We did not change what makes the Plaid fast; we improved everything that makes it usable.',
                author: 'Tesla Engineering'
            },
            warningBox: {
                title: 'Keep in mind',
                text: 'Real range figures can vary significantly depending on temperature, cruising speed and climate control use.'
            }
        },
        fr: {
            title: 'Tesla actualise la Model S Plaid avec plus d\'autonomie et une charge plus rapide',
            subtitle: 'La berline électrique la plus rapide de Tesla reçoit une mise à jour axée sur l\'efficacité et l\'expérience utilisateur.',
            excerpt: 'La berline électrique haute performance reçoit des améliorations de la batterie et de l\'électronique de puissance, atteignant jusqu\'à 640 km d\'autonomie réelle.',
            imageCaption: 'Tesla Model S Plaid refresh.',
            sections: [
                {
                    id: 'autonomia',
                    heading: 'Plus d\'autonomie réelle',
                    paragraphs: [
                        'Tesla a actualisé la Model S Plaid avec des améliorations axées sur l\'efficacité et la recharge. La berline électrique haute performance conserve ses trois moteurs et ses 1 020 ch, mais la nouvelle gestion thermique et la révision de l\'électronique de puissance permettent d\'extraire plus d\'autonomie de la même batterie.',
                        'Selon les estimations de Motor1, l\'autonomie réelle en usage mixte se situe autour de 640 km, une augmentation notable par rapport à la génération précédente.'
                    ]
                },
                {
                    id: 'tecnologia',
                    heading: 'Charge et technologie améliorées',
                    paragraphs: [
                        'La Model S Plaid refresh est compatible avec une puissance de charge maximale plus élevée sur les Superchargeurs V4, ce qui réduit le temps nécessaire pour récupérer de 10 à 80 % de la batterie dans des conditions optimales. L\'écran central reçoit également un nouveau processeur graphique pour une interface plus fluide.',
                        'Côté dynamique, Tesla a retouché la suspension adaptative et la direction pour offrir plus de précision sans sacrifier le confort.'
                    ]
                }
            ],
            inBrief: [
                'Mise à jour de la Tesla Model S Plaid axée sur l\'efficacité et la recharge.',
                'Conserve les 1 020 ch et les trois moteurs, mais gagne en autonomie réelle.',
                'Autonomie estimée en usage mixte de 640 km, selon Motor1.',
                'Compatibilité améliorée avec les Superchargeurs V4 et nouveau processeur graphique.'
            ],
            previousModel: {
                name: 'Tesla Model S Plaid (2021-2025)',
                year: '2021-2025',
                summary: 'Trois moteurs, 1 020 ch et une autonomie réelle d\'environ 550-600 km selon les conditions. Référence en accélération, mais avec thermal throttling lors des usages intensifs et charge maximale limitée aux V3.'
            },
            whatChanged: [
                { title: 'Plus d\'autonomie réelle :', text: 'La gestion thermique et l\'électronique de puissance améliorée permettent de mieux exploiter la capacité de la batterie, approchant les 640 km réels.' },
                { title: 'Charge plus rapide :', text: 'Compatibilité avec les Superchargeurs V4, qui réduisent le temps de 10 à 80 % dans des conditions optimales.' },
                { title: 'Meilleure interface :', text: 'Nouveau processeur graphique pour l\'écran central, avec moins de latence et des graphismes plus fluides.' },
                { title: 'Suspension retouchée :', text: 'Amortissement adaptatif et direction ajustés pour plus de précision sans sacrifier le confort.' }
            ],
            newTechnology: [
                'La gestion thermique de l\'onduleur et du pack de batteries a été révisée pour réduire le thermal throttling en conduite sportive répétée.',
                'L\'électronique de puissance de quatrième génération permet des pics de charge plus élevés et soutenus, clés pour les Superchargeurs V4.',
                'Le nouveau processeur de divertissement améliore la fluidité des jeux, de la navigation et de la réponse du système de caméras.'
            ],
            marketContext: 'Le segment des berlines électriques premium s\'est rempli de rivaux : Lucid Air, Porsche Taycan, Mercedes EQS et BMW i7. Tesla répond par une mise à jour conservatrice qui améliore les points faibles de la Model S Plaid sans altérer sa formule de succès.',
            pricing: {
                price: 'À partir de 110 000 $ / 120 000 €',
                market: 'États-Unis et Europe',
                availability: 'Disponible à commande depuis fin 2024',
                note: 'Le prix peut varier selon le marché et les mises à jour tarifaires de Tesla.'
            },
            prosCons: {
                pros: [
                    'Autonomie réelle améliorée sans perdre les 1 020 ch.',
                    'Compatibilité avec les Superchargeurs V4 pour des recharges plus rapides.',
                    'Système d\'infodivertissement plus fluide.'
                ],
                cons: [
                    'Design extérieur et intérieur sans changements significatifs.',
                    'La qualité d\'assemblage reste un point de discussion.',
                    'Concurrence avec de meilleures finitions dans le segment premium.'
                ]
            },
            opinion: 'La Model S Plaid était déjà la référence de l\'accélération électrique. Aujourd\'hui, avec une meilleure autonomie, une charge plus rapide et une expérience numérique plus fluide, Tesla répond aux deux principales objections des acheteurs les plus exigeants sans toucher à la puissance ni à l\'identité du modèle.',
            stats: [
                { value: '1 020 ch', label: 'Puissance' },
                { value: '640 km', label: 'Autonomie réelle' },
                { value: '~2 s', label: '0-100 km/h' }
            ],
            timeline: [
                { date: '2012', title: 'Naissance de la Model S', desc: 'Tesla lance la Model S, révolutionnant la berline électrique.' },
                { date: '2021', title: 'Arrivée de la Plaid', desc: 'La Model S Plaid atteint 1 020 ch et devient la berline électrique la plus rapide.' },
                { date: '2026', title: 'Refresh Plaid', desc: 'Tesla améliore l\'autonomie, la charge et la technologie sans changer la formule.' }
            ],
            infoBox: {
                title: 'Fait clé',
                text: 'La Model S Plaid conserve ses trois moteurs et ses 1 020 ch, mais la gestion thermique révisée lui permet de maintenir les performances de pointe plus longtemps et d\'étendre l\'autonomie réelle.'
            },
            quote: {
                text: 'Nous n\'avons pas changé ce qui rend la Plaid rapide ; nous avons amélioré tout ce qui la rend utilisable.',
                author: 'Tesla Engineering'
            },
            warningBox: {
                title: 'À prendre en compte',
                text: 'Les chiffres d\'autonomie réelle peuvent varier considérablement selon la température, la vitesse de croisière et l\'utilisation du climatiseur.'
            }
        },
        ar: {
            title: 'تحديث تسلا Model S Plaid بمدى أطول وشحن أسرع',
            subtitle: 'تحصل أسرع سيدان كهربائي من تسلا على تحديث يركز على الكفاءة وتجربة المستخدم.',
            excerpt: 'تحصل السيدان الكهربائي عالي الأداء على تحسينات في البطارية وإلكترونيات الطاقة، لتحقيق ما يصل إلى 640 كم من المدى الفعلي.',
            imageCaption: 'تحديث تسلا Model S Plaid.',
            sections: [
                {
                    id: 'autonomia',
                    heading: 'مدى فعلي أكبر',
                    paragraphs: [
                        'حدثت تسلا Model S Plaid بتحسينات تركز على الكفاءة والشحن. تحتفظ السيدان الكهربائي عالية الأداء بمحركاتها الثلاثة و 1,020 حصان، لكن الإدارة الحرارية الجديدة ومراجعة إلكترونيات الطاقة تسمحان باستخراج مزيد من المدى من نفس البطارية.',
                        'وفقاً لتقديرات Motor1، يبلغ المدى الفعلي في الاستخدام المختلط حوالي 640 كم، زيادة ملحوظة مقارنة بالجيل السابق.'
                    ]
                },
                {
                    id: 'tecnologia',
                    heading: 'شحن وتقنية محسّنان',
                    paragraphs: [
                        'تتوافق Model S Plaid refresh مع قدرة شحن قصوى أعلى في شواحن V4 Superchargers، مما يقلل الوقت اللازم لاستعادة من 10 إلى 80% من البطارية في ظروف مثالية. كما يحصل الشاشة المركزية على معالج رسومات جديد لواجهة أكثر سلاسة.',
                        'في الجانب الديناميكي، قامت تسلا بضبط التعليق التكيفي والتوجيه لتقديم دقة أكبر دون التضحية بالراحة.'
                    ]
                }
            ],
            inBrief: [
                'تحديث تسلا Model S Plaid يركز على الكفاءة والشحن.',
                'تحافظ على 1,020 حصان والمحركات الثلاثة، لكنها تكسب مدىً فعلياً.',
                'المدى المقدر في الاستخدام المختلط 640 كم، وفقاً لـ Motor1.',
                'توافق محسّن مع شواحن V4 Superchargers ومعالج رسومات جديد.'
            ],
            previousModel: {
                name: 'تسلا Model S Plaid (2021-2025)',
                year: '2021-2025',
                summary: 'ثلاثة محركات، 1,020 حصان ومدى فعلي حوالي 550-600 كم حسب الظروف. مرجع في التسارع، لكن مع انخفاض الأداء الحراري في الاستخدامات المكثفة وشحن أقصى محدود بـ V3.'
            },
            whatChanged: [
                { title: 'مدى فعلي أكبر:', text: 'تتيح الإدارة الحرارية وإلكترونيات الطاقة المحسّنة استغلال سعة البطارية بشكل أفضل، لتقترب من 640 كم فعلياً.' },
                { title: 'شحن أسرع:', text: 'التوافق مع شواحن V4 Superchargers، التي تقلل الوقت من 10 إلى 80% في ظروف مثالية.' },
                { title: 'واجهة أفضل:', text: 'معالج رسومات جديد للشاشة المركزية، مع زمن استجابة أقل ورسومات أكثر سلاسة.' },
                { title: 'تعليق معدل:', text: 'مخمدات تكيفية وتوجيه مضبوطان لدقة أكبر دون التضحية بالراحة.' }
            ],
            newTechnology: [
                'تم مراجعة الإدارة الحرارية للعاكس وحزمة البطاريات لتقليل انخفاض الأداء الحراري في القيادة الرياضية المتكررة.',
                'تتيح إلكترونيات الطاقة من الجيل الرابع قمم شحن أعلى ومستدامة، وهو أمر حاسم لشواحن V4 Superchargers.',
                'يحسن معالج الترفيه الجديد سلاسة الألعاب والتنقل واستجابة نظام الكاميرات.'
            ],
            marketContext: 'ازدحم قطاع السيدان الكهربائية الفاخرة بالمنافسين: Lucid Air، Porsche Taycan، Mercedes EQS و BMW i7. ترد تسلا بتحديث محافظ يحسن نقاط ضعف Model S Plaid دون تغيير صيغة نجاحها.',
            pricing: {
                price: 'ابتداءً من 110,000 دولار / 120,000 يورو',
                market: 'الولايات المتحدة وأوروبا',
                availability: 'متاح للطلب منذ أواخر 2024',
                note: 'قد يختلف السعر حسب السوق وتحديثات أسعار تسلا.'
            },
            prosCons: {
                pros: [
                    'مدى فعلي محسّن دون فقدان 1,020 حصان.',
                    'توافق مع شواحن V4 Superchargers لشحن أسرع.',
                    'نظام معلومات وتسلية أكثر سلاسة.'
                ],
                cons: [
                    'تصميم خارجي وداخلي دون تغييرات كبيرة.',
                    'جودة التجميع لا تزال نقطة خلاف.',
                    'منافسة بتشطيبات أفضل في القطاع الفاخر.'
                ]
            },
            opinion: 'كانت Model S Plaid بالفعل مرجع التسارع الكهربائي. الآن، مع مدى أفضل وشحن أسرع وتجربة رقمية أكثر سلاسة، ترد تسلا على اعتراضي المشترين الأكثر تطلباً دون المساس بالقوة أو هوية الطراز.',
            stats: [
                { value: '1,020 حصان', label: 'القوة' },
                { value: '640 كم', label: 'المدى الفعلي' },
                { value: '~2 ثانية', label: '0-100 كم/س' }
            ],
            timeline: [
                { date: '2012', title: 'ولادة Model S', desc: 'تطلق تسلا Model S، ثورة في السيدان الكهربائية.' },
                { date: '2021', title: 'وصول Plaid', desc: 'تصل Model S Plaid إلى 1,020 حصان وتصبح أسرع سيدان كهربائية.' },
                { date: '2026', title: 'تحديث Plaid', desc: 'تحسن تسلا المدى والشحن والتقنية دون تغيير الصيغة.' }
            ],
            infoBox: {
                title: 'حقيقة أساسية',
                text: 'تحتفظ Model S Plaid بمحركاتها الثلاثة و 1,020 حصان، لكن الإدارة الحرارية المراجعة تتيح لها الحفاظ على الأداء القصوي لفترة أطول وتوسيع المدى الفعلي.'
            },
            quote: {
                text: 'لم نغير ما يجعل Plaid سريعة؛ حسّننا كل ما يجعلها قابلة للاستخدام.',
                author: 'Tesla Engineering'
            },
            warningBox: {
                title: 'يرجى الأخذ بعين الاعتبار',
                text: 'قد تختلف أرقام المدى الفعلي بشكل كبير حسب درجة الحرارة وسرعة السير واستخدام التكييف.'
            }
        }
    },
    'mercedes-amg-gt-4-door-update': {
        en: {
            title: 'Mercedes-AMG GT 4 Door receives a technological tune-up',
            subtitle: 'The update of the GT 4 Door improves the digital experience, safety and customisation options.',
            excerpt: 'Mercedes renews the infotainment system and assisted driving of the AMG GT 4 Door, in addition to introducing new customisation options.',
            imageCaption: 'Mercedes-AMG GT 4 Door.',
            sections: [
                {
                    id: 'mbux',
                    heading: 'MBUX evolves',
                    paragraphs: [
                        'Mercedes-AMG has updated the GT 4 Door with a technology package that notably improves the on-board experience. The MBUX infotainment system evolves to a newer version, with improved graphics, faster response and more complete integration with cloud services.',
                        'The 11.9-inch central touchscreen now includes navigation with augmented reality, wireless connection for Android Auto and Apple CarPlay, and a new voice assistant that reconstructs more complex commands.'
                    ]
                },
                {
                    id: 'seguridad',
                    heading: 'Safety and customisation',
                    paragraphs: [
                        'In terms of safety, the AMG GT 4 Door expands its assisted driving equipment with an improved lane keeping system, lane change assistance and a more precise emergency braking function in urban environments.',
                        'The mechanical range remains with six and eight-cylinder options, including the plug-in hybrid 63 S E Performance versions. Customisation grows with new body colours, exclusive design wheels and interior finishes in wood or carbon fibre.'
                    ]
                }
            ],
            inBrief: [
                'Technological update of the Mercedes-AMG GT 4 Door.',
                'New version of MBUX with improved graphics and augmented reality navigation.',
                'Wireless Android Auto and Apple CarPlay, and improved voice assistant.',
                'The mechanical range remains, with six and eight-cylinder options and PHEV.'
            ],
            previousModel: {
                name: 'Mercedes-AMG GT 4 Door (2019-2024)',
                year: '2019-2024',
                summary: 'Six and eight-cylinder variants, including the plug-in hybrid 63 S E Performance. Its main weakness was a slightly lagging digital and assistance experience compared to more recent rivals.'
            },
            whatChanged: [
                { title: 'MBUX updated:', text: 'New interface, sharper graphics, faster response and augmented reality navigation.' },
                { title: 'Wireless connectivity:', text: 'Android Auto and Apple CarPlay no longer need a cable on the 11.9-inch central screen.' },
                { title: 'Improved assistance:', text: 'More precise lane keeping, lane change assistance and urban emergency braking.' },
                { title: 'New options:', text: 'Expanded colour palette, exclusive wheels and interior finishes in wood or carbon fibre.' }
            ],
            newTechnology: [
                'The latest version of MBUX introduces a cloud layer that allows more frequent updates and a voice assistant with understanding of more complex commands.',
                'Augmented reality in navigation overlays arrows and street names onto the front camera image, reducing errors at intersections.',
                'The assisted driving systems benefit from revised sensors and software, especially in high-density urban environments.'
            ],
            marketContext: 'Instead of a new generation, Mercedes prefers a deep update to keep the GT 4 Door current against the Porsche Panamera and Audi RS7. The strategy is rational: the product is still mechanically competitive, but it needed a digital experience to match.',
            pricing: {
                price: 'From €130,000',
                market: 'Europe',
                availability: 'Available in dealerships from mid-2025',
                note: 'The 63 S E Performance range starts from a significantly higher price.'
            },
            prosCons: {
                pros: [
                    'Updated digital experience without changing a platform that already works.',
                    'Wide mechanical range, including high-performance PHEV.',
                    'More customisation in colours and finishes.'
                ],
                cons: [
                    'It is not a new generation: the interior design is still not renewed.',
                    'The access price remains high compared to more recent rivals.',
                    'Some driving assistance will still depend on subscriptions.'
                ]
            },
            opinion: 'Mercedes understands that the GT 4 Door does not need more power: it needs a digital experience worthy of its price. This update goes in the right direction, although we are still waiting for a more profound revision of the interior design so that the whole does not feel dated against more recent rivals.',
            stats: null,
            timeline: [
                { date: '2019', title: 'GT 4 Door launched', desc: 'Mercedes introduces the AMG GT four-door as a rival to the Panamera and RS7.' },
                { date: '2023', title: '63 S E Performance', desc: 'The plug-in hybrid variant reaches 843 hp.' },
                { date: '2026', title: 'Technology update', desc: 'The GT 4 Door renews MBUX, connectivity and assistance systems.' }
            ],
            infoBox: {
                title: 'Key fact',
                text: 'The updated GT 4 Door retains the same mechanical range, but its new MBUX processor enables up to five times faster response in navigation and voice commands.'
            },
            quote: {
                text: 'A grand tourer must not only be fast; it must also feel up to date in the digital age.',
                author: 'Mercedes-AMG'
            },
            warningBox: null
        },
        fr: {
            title: 'Mercedes-AMG GT 4 Portes reçoit une mise au point technologique',
            subtitle: 'La mise à jour du GT 4 Portes améliore l\'expérience digitale, la sécurité et les options de personnalisation.',
            excerpt: 'Mercedes renouvelle le système d\'infodivertissement et la conduite assistée de l\'AMG GT 4 Portes, en plus d\'introduire de nouvelles options de personnalisation.',
            imageCaption: 'Mercedes-AMG GT 4 Portes.',
            sections: [
                {
                    id: 'mbux',
                    heading: 'MBUX évolue',
                    paragraphs: [
                        'Mercedes-AMG a actualisé le GT 4 Portes avec un pack technologique qui améliore notablement l\'expérience à bord. Le système d\'infodivertissement MBUX évolue vers une version plus récente, avec des graphismes améliorés, une réponse plus rapide et une intégration plus complète avec les services en ligne.',
                        'L\'écran tactile central de 11,9 pouces inclut désormais la navigation avec réalité augmentée, la connexion sans fil pour Android Auto et Apple CarPlay, et un nouvel assistant vocal qui reconstruit des commandes plus complexes.'
                    ]
                },
                {
                    id: 'seguridad',
                    heading: 'Sécurité et personnalisation',
                    paragraphs: [
                        'En matière de sécurité, l\'AMG GT 4 Portes étend son équipement de conduite assistée avec un système de maintien de voie amélioré, une assistance au changement de voie et une fonction de freinage d\'urgence plus précise en milieu urbain.',
                        'La gamme mécanique se maintient avec des options de six et huit cylindres, incluant les versions hybrides rechargeables 63 S E Performance. La personnalisation s\'élargit avec de nouvelles couleurs de carrosserie, des jantes de design exclusif et des finitions intérieures en bois ou en fibre de carbone.'
                    ]
                }
            ],
            inBrief: [
                'Mise à jour technologique de la Mercedes-AMG GT 4 Portes.',
                'Nouvelle version de MBUX avec graphismes améliorés et navigation en réalité augmentée.',
                'Android Auto et Apple CarPlay sans fil, et assistant vocal amélioré.',
                'La gamme mécanique se maintient, avec des options de six et huit cylindres et PHEV.'
            ],
            previousModel: {
                name: 'Mercedes-AMG GT 4 Portes (2019-2024)',
                year: '2019-2024',
                summary: 'Variantes de six et huit cylindres, incluant la hybride rechargeable 63 S E Performance. Sa principale carence était une expérience digitale et des assistances légèrement en retard face à des rivaux plus récents.'
            },
            whatChanged: [
                { title: 'MBUX actualisé :', text: 'Nouvelle interface, graphismes plus nets, réponse plus rapide et navigation en réalité augmentée.' },
                { title: 'Connectivité sans fil :', text: 'Android Auto et Apple CarPlay n\'ont plus besoin de câble sur l\'écran central de 11,9 pouces.' },
                { title: 'Assistances améliorées :', text: 'Maintien de voie, assistance au changement de voie et freinage d\'urgence urbain plus précis.' },
                { title: 'Nouvelles options :', text: 'Palette de couleurs élargie, jantes exclusives et finitions intérieures en bois ou en fibre de carbone.' }
            ],
            newTechnology: [
                'La dernière version de MBUX introduit une couche de cloud qui permet des mises à jour plus fréquentes et un assistant vocal avec compréhension de commandes plus complexes.',
                'La réalité augmentée dans la navigation superpose des flèches et des noms de rues sur l\'image de la caméra frontale, réduisant les erreurs aux intersections.',
                'Les systèmes de conduite assistée bénéficient de capteurs et de logiciels révisés, notamment en milieu urbain de haute densité.'
            ],
            marketContext: 'Plutôt qu\'une nouvelle génération, Mercedes préfère une mise à jour profonde pour maintenir le GT 4 Portes à jour face à la Porsche Panamera et à l\'Audi RS7. La stratégie est rationnelle : le produit reste compétitif mécaniquement, mais il avait besoin d\'une expérience digitale à la hauteur.',
            pricing: {
                price: 'À partir de 130 000 €',
                market: 'Europe',
                availability: 'Disponible en concession dès le milieu de 2025',
                note: 'La gamme 63 S E Performance part d\'un prix nettement supérieur.'
            },
            prosCons: {
                pros: [
                    'Expérience digitale actualisée sans changer une plateforme qui fonctionne déjà.',
                    'Gamme mécanique large, incluant un PHEV de hautes performances.',
                    'Plus de personnalisation en couleurs et finitions.'
                ],
                cons: [
                    'Ce n\'est pas une nouvelle génération : le design intérieur ne se renouvelle pas encore.',
                    'Le prix d\'accès reste élevé face à des rivaux plus récents.',
                    'Certaines assistances de conduite continueront à dépendre d\'abonnements.'
                ]
            },
            opinion: 'Mercedes comprend que le GT 4 Portes n\'a pas besoin de plus de puissance : il a besoin d\'une expérience digitale à la hauteur de son prix. Cette mise à jour va dans la bonne direction, bien que nous attendions toujours une révision plus profonde du design intérieur pour que l\'ensemble ne semble pas daté face à des rivaux plus récents.',
            stats: null,
            timeline: [
                { date: '2019', title: 'Lancement du GT 4 Portes', desc: 'Mercedes présente l\'AMG GT quatre portes comme rival de la Panamera et de la RS7.' },
                { date: '2023', title: '63 S E Performance', desc: 'La variante hybride rechargeable atteint 843 ch.' },
                { date: '2026', title: 'Mise à jour technologique', desc: 'Le GT 4 Portes renouvelle MBUX, la connectivité et les systèmes d\'assistance.' }
            ],
            infoBox: {
                title: 'Fait clé',
                text: 'Le GT 4 Portes actualisé conserve la même gamme mécanique, mais son nouveau processeur MBUX offre une réponse jusqu\'à cinq fois plus rapide en navigation et commandes vocales.'
            },
            quote: {
                text: 'Un grand tourisme doit non seulement être rapide ; il doit aussi se sentir à jour à l\'ère digitale.',
                author: 'Mercedes-AMG'
            },
            warningBox: null
        },
        ar: {
            title: 'تحديث تقني لـ Mercedes-AMG GT 4 أبواب',
            subtitle: 'يحسّن تحديث GT 4 أبواب التجربة الرقمية والأمان وخيارات التخصيص.',
            excerpt: 'تجدد Mercedes نظام المعلومات والترفيه والقيادة المساعدة في AMG GT 4 أبواب، بالإضافة إلى تقديم خيارات تخصيص جديدة.',
            imageCaption: 'Mercedes-AMG GT 4 أبواب.',
            sections: [
                {
                    id: 'mbux',
                    heading: 'تطور MBUX',
                    paragraphs: [
                        'حدّثت Mercedes-AMG GT 4 أبواب بحزمة تقنية تحسّن بشكل ملحوظ تجربة الركاب. يتطور نظام المعلومات والترفيه MBUX إلى إصدار أحدث، برسومات محسّنة واستجابة أسرع وتكامل أكثر اكتمالاً مع خدمات السحابة.',
                        'تتضمن شاشة اللمس المركزية 11.9 بوصة الآن تنقلاً مع الواقع المعزز، واتصالاً لاسلكياً لـ Android Auto و Apple CarPlay، ومساعداً صوتياً جديداً يعيد بناء أوامر أكثر تعقيداً.'
                    ]
                },
                {
                    id: 'seguridad',
                    heading: 'الأمان والتخصيص',
                    paragraphs: [
                        'في مجال الأمان، يوسع AMG GT 4 أبواب معدات القيادة المساعدة بنظام الحفاظ على المسار المحسّن، ومساعدة تغيير المسار، ووظيفة مكابح الطوارئ الأكثر دقة في البيئات الحضرية.',
                        'تبقى المجموعة الميكانيكية بنفس خيارات ست وثمانية أسطوانات، بما في ذلك نسخ PHEV 63 S E Performance. ينمو التخصيص بألوان هيكل جديدة، وعجلات بتصميم حصري، وتشطيبات داخلية من الخشب أو ألياف الكربون.'
                    ]
                }
            ],
            inBrief: [
                'تحديث تقني لـ Mercedes-AMG GT 4 أبواب.',
                'إصدار جديد من MBUX برسومات محسّنة وتنقل بالواقع المعزز.',
                'Android Auto و Apple CarPlay لاسلكياً، ومساعد صوتي محسّن.',
                'تبقى المجموعة الميكانيكية، مع خيارات ست وثمانية أسطوانات و PHEV.'
            ],
            previousModel: {
                name: 'Mercedes-AMG GT 4 أبواب (2019-2024)',
                year: '2019-2024',
                summary: 'نسخ بست وثمانية أسطوانات، بما في ذلك PHEV 63 S E Performance. نقطة الضعف الرئيسية كانت تجربة رقمية ومساعدات متأخرة قليلاً مقارنة بالمنافسين الأحدث.'
            },
            whatChanged: [
                { title: 'MBUX محدث:', text: 'واجهة جديدة، رسومات أوضح، استجابة أسرع وتنقل بالواقع المعزز.' },
                { title: 'اتصال لاسلكي:', text: 'لم يعد Android Auto و Apple CarPlay بحاجة إلى كابل في الشاشة المركزية 11.9 بوصة.' },
                { title: 'مساعدات محسّنة:', text: 'حفاظ على المسار بدقة أكبر، ومساعدة تغيير المسار، ومكابح طوارئ حضرية أكثر دقة.' },
                { title: 'خيارات جديدة:', text: 'لوحة ألوان موسعة، وعجلات حصرية، وتشطيبات داخلية من الخشب أو ألياف الكربون.' }
            ],
            newTechnology: [
                'تقدم أحدث نسخة من MBUX طبقة سحابية تتيح تحديثات أكثر تكراراً ومساعداً صوتياً يفهم أوامر أكثر تعقيداً.',
                'يضيف الواقع المعزز في التنقل أسهم وأسماء شوارع فوق صورة الكاميرا الأمامية، مما يقلل الأخطاء في التقاطعات.',
                'تستفيد أنظمة القيادة المساعدة من مستشعرات وبرمجيات مراجعة، خاصة في البيئات الحضرية الكثيفة.'
            ],
            marketContext: 'بدلاً من جيل جديد، تفضّل Mercedes تحديثاً عميقاً للحفاظ على GT 4 أبواب محدّثاً أمام Porsche Panamera و Audi RS7. الاستراتيجية عقلانية: المنتج لا يزال تنافسياً ميكانيكياً، لكنه احتاج إلى تجربة رقمية تناسب سعره.',
            pricing: {
                price: 'ابتداءً من 130,000 يورو',
                market: 'أوروبا',
                availability: 'متاح في الصالات من منتصف 2025',
                note: 'تبدأ سلسلة 63 S E Performance من سعر أعلى بكثير.'
            },
            prosCons: {
                pros: [
                    'تجربة رقمية محدّثة دون تغيير منصة تعمل بالفعل.',
                    'مجموعة ميكانيكية واسعة، بما في ذلك PHEV عالي الأداء.',
                    'تخصيص أكثر في الألوان والتشطيبات.'
                ],
                cons: [
                    'ليس جيلاً جديداً: التصميم الداخلي لا يزال غير مجدّد.',
                    'سعر الوصول لا يزال مرتفعاً مقارنة بالمنافسين الأحدث.',
                    'بعض مساعدات القيادة ستظل تعتمد على الاشتراكات.'
                ]
            },
            opinion: 'تدرك Mercedes أن GT 4 أبواب لا يحتاج إلى المزيد من القوة: يحتاج إلى تجربة رقمية تليق بسعره. يذهب هذا التحديث في الاتجاه الصحيح، على الرغم من أننا لا نزال ننتظر مراجعة أعمق للتصميم الداخلي حتى لا يبدو المجموع قديماً أمام المنافسين الأحدث.',
            stats: null,
            timeline: [
                { date: '2019', title: 'إطلاق GT 4 أبواب', desc: 'تقدم Mercedes AMG GT بأربعة أبواب كمنافس لـ Panamera و RS7.' },
                { date: '2023', title: '63 S E Performance', desc: 'تصل النسخة الهجينة القابلة للشحن إلى 843 حصان.' },
                { date: '2026', title: 'تحديث تقني', desc: 'يجدّد GT 4 أبواب MBUX والاتصال وأنظمة المساعدة.' }
            ],
            infoBox: {
                title: 'حقيقة أساسية',
                text: 'يحتفظ GT 4 أبواب المحدّث بنفس المجموعة الميكانيكية، لكن معالج MBUX الجديد يتيح استجابة أسرع بخمس مرات في التنقل والأوامر الصوتية.'
            },
            quote: {
                text: 'يجب ألا تكون السيارة السياحية الفاخرة سريعة فقط؛ يجب أن تشعر أيضاً بالحداثة في العصر الرقمي.',
                author: 'Mercedes-AMG'
            },
            warningBox: null
        }
    },
    'nissan-gt-r-final-edition': {
        en: {
            title: 'Nissan GT-R Final Edition: the farewell of the Japanese myth',
            subtitle: 'Nissan closes the chapter of the GT-R R35 with a limited edition that pays tribute to one of the legends of modern motoring.',
            excerpt: 'Nissan announces the farewell edition of the GT-R R35 with 600 hp, limited production and a tribute to decades of dominance on the sports scene.',
            imageCaption: 'Nissan GT-R Final Edition.',
            sections: [
                {
                    id: 'despedida',
                    heading: 'The end of an era',
                    paragraphs: [
                        'Nissan has confirmed the Final Edition of the GT-R R35, the car that for more than a decade has been the Japanese reference in terms of accessible sportiness. With limited production and numerous exclusive details, this version marks the end of an era for the iconic model.'
                    ]
                },
                {
                    id: 'mecanica',
                    heading: 'Mechanics and exclusive details',
                    paragraphs: [
                        'The GT-R Final Edition retains the 3.8-litre VR38DETT V6 biturbo engine, but with a tune that raises power to 600 hp. The six-speed dual-clutch transmission and the ATTESA E-TS all-wheel drive system remain responsible for distributing all that power to the asphalt.',
                        'The aesthetic changes include 20-inch golden bronze alloy wheels, red brake calipers, a carbon fibre rear spoiler and a plaque with the unit number.'
                    ]
                }
            ],
            inBrief: [
                'Farewell edition of the Nissan GT-R R35, limited production.',
                'VR38DETT 3.8 V6 biturbo engine tuned to 600 hp.',
                'Exclusive details: golden bronze wheels, carbon spoiler and numbered plaque.',
                'Closes the era of the R35 after almost two decades in production.'
            ],
            previousModel: {
                name: 'Nissan GT-R Premium / Nismo (R35)',
                year: '2007-2025',
                summary: 'R35 platform with 3.8-litre VR38DETT engine. In its Nismo version it reached 600 hp, but most conventional units were around 570 hp. The design and architecture remained virtually unchanged since 2007.'
            },
            whatChanged: [
                { title: 'Maximum power:', text: 'The Final Edition sits at 600 hp, on a par with the old Nismo, but accessible as a limited farewell edition.' },
                { title: 'Exclusive details:', text: '20-inch golden bronze wheels, red brake calipers, carbon fibre spoiler and plaque with unit number.' },
                { title: 'No structural changes:', text: 'There is no new platform or radically different mechanics: it is a tribute to the R35, not a revolution.' },
                { title: 'Limited production:', text: 'Nissan reserves a reduced number of units for selected markets, making it a collector\'s item.' }
            ],
            newTechnology: [
                'The VR38DETT is an almost handcrafted engine, hand-built in Yokohama. The Final Edition does not introduce mechanical novelties, but it does include the highest degree of tuning available for the R35.',
                'The ATTESA E-TS all-wheel drive system and the six-speed dual-clutch gearbox remain responsible for managing the 600 hp with the reliability that characterises the GT-R.',
                'The absence of hybrid or electric technology is deliberate: it is the last opportunity to enjoy the GT-R in its purest form.'
            ],
            marketContext: 'The R35 GT-R bids farewell at a time when Japanese sports cars are seeking new identities: the Toyota GR Supra already shares a platform with BMW, and the future of the GT-R points towards electrification. The Final Edition is both celebration and transition for one of the most respected legends in the motoring world.',
            pricing: {
                price: 'From €150,000',
                market: 'Japan and selected markets',
                availability: 'Limited production, reservations open until the end of 2025',
                note: 'Limited edition; price and availability vary by region.'
            },
            prosCons: {
                pros: [
                    'Limited edition with virtually guaranteed collector value.',
                    'Proven VR38DETT mechanics and proven reliability.',
                    'Emotional farewell to one of the Japanese legends.'
                ],
                cons: [
                    'R35 platform with no structural changes since 2007.',
                    'Technology and connectivity lag behind current rivals.',
                    'Very limited availability outside Japan.'
                ]
            },
            opinion: 'The GT-R Final Edition is not just a car; it is a chapter that closes. Its legacy is enormous: it democratised supercar performance at an affordable price. Its future, probably electric, will have to work hard to maintain the respect that this Japanese myth generates. The limited edition is a deserved farewell.',
            stats: [
                { value: '600 hp', label: 'Power' },
                { value: '3.8 L', label: 'V6 biturbo' },
                { value: '6 spd.', label: 'DCT gearbox' },
                { value: 'Limited', label: 'Edition' }
            ],
            timeline: [
                { date: '2007', title: 'R35 debut', desc: 'Nissan presents the modern GT-R, capable of rivalling European supercars.' },
                { date: '2017', title: 'Nismo and Track Edition', desc: 'The most radical versions for the track arrive.' },
                { date: '2026', title: 'Final Edition', desc: 'Nissan bids farewell to the GT-R R35 with a limited, nostalgia-filled edition.' }
            ],
            infoBox: {
                title: 'Key fact',
                text: 'The VR38DETT engine of the GT-R Final Edition is still hand-built by takumi technicians in Yokohama, one of the few artisanal processes that remain at Nissan.'
            },
            quote: {
                text: 'The GT-R does not need to be perfect; it needs to be unforgettable.',
                author: 'Nismo Heritage'
            },
            warningBox: null
        },
        fr: {
            title: 'Nissan GT-R Final Edition : l\'adieu du mythe japonais',
            subtitle: 'Nissan referme le chapitre du GT-R R35 avec une édition limitée qui rend hommage à l\'une des légendes de l\'automobile moderne.',
            excerpt: 'Nissan annonce l\'édition d\'adieu du GT-R R35 avec 600 ch, une production limitée et un hommage aux décennies de domination sur la scène sportive.',
            imageCaption: 'Nissan GT-R Final Edition.',
            sections: [
                {
                    id: 'despedida',
                    heading: 'La fin d\'une époque',
                    paragraphs: [
                        'Nissan a confirmé l\'édition Final du GT-R R35, la voiture qui pendant plus d\'une décennie a été la référence japonaise en matière de sportivité accessible. Avec une production limitée et de nombreux détails exclusifs, cette version marque la fin d\'une ère pour le modèle emblématique.'
                    ]
                },
                {
                    id: 'mecanica',
                    heading: 'Mécanique et détails exclusifs',
                    paragraphs: [
                        'Le GT-R Final Edition conserve le moteur VR38DETT 3,8 litres V6 biturbo, mais avec une mise au point qui élève la puissance à 600 ch. La transmission à double embrayage de six rapports et le système de traction intégrale ATTESA E-TS restent responsables de distribuer toute cette puissance sur l\'asphalte.',
                        'Les changements esthétiques incluent des jantes en alliage de 20 pouces en bronze doré, des étriers de frein rouges, un aileron arrière en fibre de carbone et une plaque avec le numéro d\'unité.'
                    ]
                }
            ],
            inBrief: [
                'Édition d\'adieu du Nissan GT-R R35, production limitée.',
                'Moteur VR38DETT 3,8 V6 biturbo mis au point en 600 ch.',
                'Détails exclusifs : jantes bronze doré, aileron de carbone et plaque numérotée.',
                'Clôture l\'ère du R35 après près de deux décennies de production.'
            ],
            previousModel: {
                name: 'Nissan GT-R Premium / Nismo (R35)',
                year: '2007-2025',
                summary: 'Plateforme R35 avec moteur VR38DETT 3,8 litres. En version Nismo, il atteignait 600 ch, mais la plupart des unités conventionnelles tournaient autour de 570 ch. Le design et l\'architecture sont restés pratiquement inchangés depuis 2007.'
            },
            whatChanged: [
                { title: 'Puissance maximale :', text: 'La Final Edition se situe à 600 ch, au niveau de l\'ancienne Nismo, mais accessible en tant qu\'édition limitée d\'adieu.' },
                { title: 'Détails exclusifs :', text: 'Jantes de 20 pouces en bronze doré, étriers de frein rouges, aileron en fibre de carbone et plaque avec numéro d\'unité.' },
                { title: 'Pas de changements structurels :', text: 'Il n\'y a pas de nouvelle plateforme ni de mécanique radicalement différente : c\'est un hommage au R35, pas une révolution.' },
                { title: 'Production limitée :', text: 'Nissan réserve un nombre réduit d\'unités pour des marchés sélectionnés, en faisant un objet de collection.' }
            ],
            newTechnology: [
                'Le VR38DETT est un moteur presque artisanal, assemblé à la main à Yokohama. La Final Edition n\'introduit pas de nouveautés mécaniques, mais inclut le degré maximal de mise au point disponible pour le R35.',
                'Le système de traction intégrale ATTESA E-TS et la boîte à double embrayage de six rapports restent responsables de gérer les 600 ch avec la fiabilité qui caractérise le GT-R.',
                'L\'absence de technologie hybride ou électrique est délibérée : c\'est la dernière occasion de profiter du GT-R dans sa formule la plus pure.'
            ],
            marketContext: 'Le GT-R R35 fait ses adieux à un moment où les sportives japonaises cherchent de nouvelles identités : la Toyota GR Supra partage déjà sa plateforme avec BMW, et l\'avenir du GT-R pointe vers l\'électrification. La Final Edition est à la fois célébration et transition pour l\'une des légendes les plus respectées du monde automobile.',
            pricing: {
                price: 'À partir de 150 000 €',
                market: 'Japon et marchés sélectionnés',
                availability: 'Production limitée, réservations ouvertes jusqu\'à fin 2025',
                note: 'Édition limitée ; le prix et la disponibilité varient selon la région.'
            },
            prosCons: {
                pros: [
                    'Édition limitée avec une valeur de collection quasi assurée.',
                    'Mécanique VR38DETT éprouvée et fiabilité avérée.',
                    'Adieu émotionnel à l\'une des légendes japonaises.'
                ],
                cons: [
                    'Plateforme R35 sans changements structurels depuis 2007.',
                    'Technologie et connectivité en retrait face aux rivaux actuels.',
                    'Disponibilité très limitée en dehors du Japon.'
                ]
            },
            opinion: 'Le GT-R Final Edition n\'est pas seulement une voiture ; c\'est un chapitre qui se ferme. Son héritage est immense : il a démocratisé les performances de supercar à un prix accessible. Son avenir, probablement électrique, devra se battre pour conserver le respect que génère ce mythe japonais. L\'édition limitée est une adieu méritée.',
            stats: [
                { value: '600 ch', label: 'Puissance' },
                { value: '3,8 L', label: 'V6 biturbo' },
                { value: '6 vit.', label: 'Boîte DCT' },
                { value: 'Édition', label: 'Limitée' }
            ],
            timeline: [
                { date: '2007', title: 'Début du R35', desc: 'Nissan présente le GT-R moderne, capable de rivaliser avec les supercars européens.' },
                { date: '2017', title: 'Nismo et Track Edition', desc: 'Arrivent les versions les plus radicales pour circuit.' },
                { date: '2026', title: 'Final Edition', desc: 'Nissan fait ses adieux au GT-R R35 avec une édition limitée et chargée de nostalgie.' }
            ],
            infoBox: {
                title: 'Fait clé',
                text: 'Le moteur VR38DETT de la GT-R Final Edition est toujours assemblé à la main par des techniciens takumi à Yokohama, l\'un des rares processus artisanaux qui subsistent chez Nissan.'
            },
            quote: {
                text: 'Le GT-R n\'a pas besoin d\'être parfait ; il a besoin d\'être inoubliable.',
                author: 'Nismo Heritage'
            },
            warningBox: null
        },
        ar: {
            title: 'Nissan GT-R Final Edition: وداع الأسطورة اليابانية',
            subtitle: 'تغلق Nissan فصل GT-R R35 بنسخة محدودة تخلّد ذكرى إحدى أساطير عالم السيارات الحديث.',
            excerpt: 'تعلن Nissan عن نسخة الوداع من GT-R R35 بقوة 600 حصان، إنتاج محدود، وتحية لعقود من الهيمنة على الساحة الرياضية.',
            imageCaption: 'Nissan GT-R Final Edition.',
            sections: [
                {
                    id: 'despedida',
                    heading: 'نهاية عصر',
                    paragraphs: [
                        'أكدت Nissan نسخة Final من GT-R R35، السيارة التي كانت على مدى أكثر من عقد مرجعاً يابانياً فيما يتعلق بالرياضية في متناول الجميع. مع إنتاج محدود وتفاصيل حصرية عديدة، ترمز هذه النسخة إلى نهاية عصر للطراز الأيقوني.'
                    ]
                },
                {
                    id: 'mecanica',
                    heading: 'الميكانيكا والتفاصيل الحصرية',
                    paragraphs: [
                        'يحتفظ GT-R Final Edition بمحرك VR38DETT V6 مزدوج التوربين 3.8 لتر، لكن مع ضبط يرفع القوة إلى 600 حصان. يظل ناقل الحركة مزدوج القابض بست سرعات ونظام الدفع الرباعي ATTESA E-TS مسؤولين عن توزيع كل هذه القوة على الأسفلت.',
                        'تشمل التغييرات الجمالية عجلات سبائك 20 بوصة بالبرونز الذهبي، ومكابح حمراء، وجناح خلفي من ألياف الكربون، ولوحة تحمل رقم الوحدة.'
                    ]
                }
            ],
            inBrief: [
                'نسخة الوداع من Nissan GT-R R35، إنتاج محدود.',
                'محرك VR38DETT 3.8 V6 مزدوج التوربين مضبوط على 600 حصان.',
                'تفاصيل حصرية: عجلات برونز ذهبي، وجناح كربون، ولوحة مرقمة.',
                'يختتم عصر R35 بعد قرابة عقدين من الإنتاج.'
            ],
            previousModel: {
                name: 'Nissan GT-R Premium / Nismo (R35)',
                year: '2007-2025',
                summary: 'منصة R35 مع محرك VR38DETT 3.8 لتر. في نسختها Nismo وصلت إلى 600 حصان، لكن معظم الوحدات العادية كانت حوالي 570 حصان. بقي التصميم والهيكل دون تغيير تقريباً منذ 2007.'
            },
            whatChanged: [
                { title: 'أقصى قوة:', text: 'تقع Final Edition عند 600 حصان، بمستوى Nismo القديمة، لكنها متاحة كنسخة محدودة للوداع.' },
                { title: 'تفاصيل حصرية:', text: 'عجلات 20 بوصة بالبرونز الذهبي، ومكابح حمراء، وجناح من ألياف الكربون، ولوحة تحمل رقم الوحدة.' },
                { title: 'لا تغييرات هيكلية:', text: 'لا يوجد منصة جديدة أو ميكانيكا مختلفة جذرياً: إنها تحية للـ R35، لا ثورة.' },
                { title: 'إنتاج محدود:', text: 'تحتفظ Nissan بعدد محدود من الوحدات لأسواق مختارة، مما يجعلها قطعة جمع.' }
            ],
            newTechnology: [
                'يعد VR38DETT محركاً شبه يدوي، مُجمَّع يدوياً في يوكوهاما. لا تقدم Final Edition مستجدات ميكانيكية، لكنها تتضمن أعلى درجة من الضبط المتاحة لـ R35.',
                'يظل نظام الدفع الرباعي ATTESA E-TS وناقل الحركة مزدوج القابض بست سرعات مسؤولين عن إدارة 600 حصان بالموثوقية التي تتميز بها GT-R.',
                'غياب التقنية الهجينة أو الكهربائية متعمد: إنها الفرصة الأخيرة للاستمتاع بـ GT-R بصورتها النقية.'
            ],
            marketContext: 'يودّع GT-R R35 في وقت تبحث فيه السيارات الرياضية اليابانية عن هويات جديدة: Toyota GR Supra تشارك بالفعل منصتها مع BMW، ومستقبل GT-R يتجه نحو التكهرب. Final Edition هي احتفال وانتقال في آن واحد لإحدى أكثر الأساطير احتراماً في عالم السيارات.',
            pricing: {
                price: 'ابتداءً من 150,000 يورو',
                market: 'اليابان والأسواق المختارة',
                availability: 'إنتاج محدود، الحجوزات مفتوحة حتى نهاية 2025',
                note: 'نسخة محدودة؛ السعر والتوفر يختلفان حسب المنطقة.'
            },
            prosCons: {
                pros: [
                    'نسخة محدودة بقيمة جمعية شبه مضمونة.',
                    'ميكانيكا VR38DETT مجربة وموثوقية مثبتة.',
                    'وداع عاطفي لإحدى الأساطير اليابانية.'
                ],
                cons: [
                    'منصة R35 دون تغييرات هيكلية منذ 2007.',
                    'التقنية والاتصال متأخّران عن المنافسين الحاليين.',
                    'توفر محدود للغاية خارج اليابان.'
                ]
            },
            opinion: 'GT-R Final Edition ليست مجرد سيارة؛ إنها فصل يُغلق. إرثها هائل: لقد جعلت أداء السيارات الخارقة في متناول الجميع بسعر معقول. مستقبلها، ربما كهربائي، سيجب أن يبذل جهداً كبيراً للحفاظ على الاحترام الذي تولده هذه الأسطورة اليابانية. النسخة المحدودة وداع مستحق.',
            stats: [
                { value: '600 حصان', label: 'القوة' },
                { value: '3.8 لتر', label: 'V6 مزدوج التوربين' },
                { value: '6 سرعات', label: 'علبة DCT' },
                { value: 'نسخة', label: 'محدودة' }
            ],
            timeline: [
                { date: '2007', title: 'ظهور R35', desc: 'تقدم Nissan GT-R الحديث، القادر على منافسة السيارات الخارقة الأوروبية.' },
                { date: '2017', title: 'Nismo و Track Edition', desc: 'تصل النسخ الأكثر تطرفاً للحلبة.' },
                { date: '2026', title: 'Final Edition', desc: 'تودّع Nissan GT-R R35 بنسخة محدودة محمّلة بالحنين.' }
            ],
            infoBox: {
                title: 'حقيقة أساسية',
                text: 'لا يزال محرك VR38DETT في GT-R Final Edition مُبنى يدوياً من تقنيي takumi في يوكوهاما، واحداً من العمليات الحرفية القليلة المتبقية في Nissan.'
            },
            quote: {
                text: 'لا يحتاج GT-R إلى الكمال؛ يحتاج إلى أن يكون لا يُنسى.',
                author: 'Nismo Heritage'
            },
            warningBox: null
        }
    }
};

files.forEach(file => {
    const filePath = path.join(articlesDir, file);
    const article = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const slug = article.slug || article.id;
    const langData = translations[slug] || { en: {}, fr: {}, ar: {} };

    const newArticle = {
        id: article.id,
        slug: article.slug,
        source: article.source,
        category: article.category,
        date: article.date,
        readingTime: article.readingTime,
        image: article.image,
        externalUrl: article.externalUrl,
        tags: article.tags,
        relatedCars: article.relatedCars,
        relatedNews: article.relatedNews,
        translations: {
            es: article.translations?.es || {
                title: article.title,
                subtitle: article.subtitle,
                excerpt: article.excerpt,
                imageCaption: article.imageCaption,
                sections: article.sections,
                inBrief: article.inBrief,
                previousModel: article.previousModel,
                whatChanged: article.whatChanged,
                newTechnology: article.newTechnology,
                marketContext: article.marketContext,
                pricing: article.pricing,
                prosCons: article.prosCons,
                opinion: article.opinion,
                stats: article.stats,
                timeline: article.timeline,
                infoBox: article.infoBox,
                quote: article.quote,
                warningBox: article.warningBox
            },
            en: langData.en,
            fr: langData.fr,
            ar: langData.ar
        }
    };

    fs.writeFileSync(filePath, JSON.stringify(newArticle, null, 4), 'utf8');
    console.log(`Migrated ${file}`);
});

console.log('Migration complete.');
