# Phase 1 — تحليل الاعتماديات + خطة التنفيذ
## Migration آمنة — RS7 → النظام المركزي

---

## A. قائمة الملفات التي سيتم تعديلها (Backup List)

### ملفات جديدة (إنشاء — لا خطر)
| # | الملف | الوصف |
|---|---|---|
| 1 | `js/car-renderer.js` | جديد — استخراج loadCarData + rendering من RS7 |
| 2 | `js/cost-calculator.js` | جديد — استخراج calculator كامل من RS7 |
| 3 | `js/emergency-fallback.js` | جديد — fallback عام بدون hardcoded |
| 4 | `system/data/test-car.json` | جديد — سيارة تجريبية للاختبار |

### ملفات موجودة (تعديل — خطر منخفض إلى متوسط)
| # | الملف | التعديل | الخطر | احتياطي |
|---|---|---|---|---|
| 5 | `system/templates/car-template.html` | إضافة script tags فقط | 🔵 منخفض | النسخة الأصلية 752 سطر، نضيف 3 أسطر `<script src>` |
| 6 | `system/generators/car-page-generator.js` | تحسين injection Hero/Gallery/SEO | 🟡 متوسط | التعديل على regex replacements الموجودة |
| 7 | `system/locales/es.json` | استبدال نصوص hardcoded بمتغيرات | 🟡 متوسط | فقط if يوجد Audi/BMW/RS7/M5/Spain... |
| 8 | `system/locales/en.json` | نفس السابق | 🟡 متوسط | — |
| 9 | `system/locales/fr.json` | نفس السابق | 🟡 متوسط | — |
| 10 | `system/locales/ar.json` | نفس السابق | 🟡 متوسط | — |

### ملفات لن يتم تعديلها (آمنة 100%)
| # | الملف | السبب |
|---|---|---|
| — | `css/*.css` | التصميم لا يحتاج تعديل |
| — | `js/i18n.js` | الترجمة تعمل |
| — | `js/script.js` | الـ dark mode / menu يعمل |
| — | `js/mega-menu.js` | الميجا منيو تعمل |
| — | `js/country-data.js` | بيانات البلدان تعمل |
| — | `system/js/country-manager.js` | يعمل |
| — | `system/js/dropdowns.js` | يعمل |
| — | `rs7.html` | لن يتم حذف أي شيء الآن — فقط تقرير |
| — | `html/*.html` (الصفحات المولدة) | سيتم إعادة توليدها من build.js |
| — | `system/schemas/master-car-schema.json` | لا يحتاج تعديل |
| — | `system/registry/*.json` | لا يحتاج تعديل |
| — | `system/build.js` | لا يحتاج تعديل — يستدعي generators |

---

## B. ما الذي يعتمد عليه RS7

### اعتماديات بيانات
| المصدر | الموقع | الاستخدام في RS7 |
|---|---|---|
| `system/data/rs7-2026.json` | fetch('system/data/rs7-2026.json') | كل البيانات — specs, versions, FAQ, timeline, images |
| `js/country-data.js` | global `countryData` | Calculator + Pricing |
| `system/js/country-manager.js` | `setupCountryData()`, `applyCountry()` | تحميل بيانات البلد |

### اعتماديات JS مشتركة
| الملف | الدالة/المتغير | الاستخدام في RS7 |
|---|---|---|
| `js/i18n.js` | `setCarData()`, `applyTranslations()`, `t()`, `currentLang` | الترجمة + placeholders |
| `js/script.js` | `darkbtn`, `menuBtn` | UI Header |
| `js/mega-menu.js` | `initMegaMenu()` | Navigation |
| `system/js/dropdowns.js` | `DropdownManager` | Country/Language dropdowns |

### DOM Elements يعتمد عليها الكود المضمن في RS7
| الـ ID / Selector | الاستخدام |
|---|---|
| `#annualKm, #fuelPrice, #purchaseType, #drivingStyle` | Calculator inputs |
| `#kmDisplay, #fuelDisplay` | Calculator displays |
| `#costFuel, #costInsurance, #costMaint, #costDep, #costTotal, #costPerKm` | Calculator results |
| `#barRs7, #barRs7Val` | Comparison bar (في كود RS7 فقط!) |
| `[data-i18n="score.desc"], [data-i18n="worth.desc"]` | pageText injection |
| `[data-i18n-list="pros.items"], [data-i18n-list="cons.items"]` | Pros/Cons lists |
| `#versionsContainer` | Versions rendering |
| `#interiorGrid` | Interior cards |
| `#problemsList` | Problems list |
| `.profile-bar-row` | Profile score bars |
| `.timeline-item` | Timeline costs |
| `.quiz-step, #quizResult, #quizProgress` | Quiz logic |
| `#scrollTopBtn` | Scroll to top (يُنشأ ديناميكياً) |

**ملاحظة مهمة:** الكود المضمن في RS7 يستخدم `barRs7` و `barRs7Val` — هذه أسماء **specific لـ RS7** داخل كود المقارنة. في Template يوجد quiz عام بدون أسماء سيارات hardcoded.

---

## C. ما الذي يعتمد عليه Template

### البنية الحالية لـ `car-template.html`:
1. **Header + Nav + Mega Menu** — ثابت، مشترك
2. **Hero** — يحصل على `background-image` من generator فقط
3. **Quick Info / Specs / Gallery / Price** — IDs فارغة، يحتاج renderer
4. **Calculator** — كود مضمن بسيط (بدون animation)
5. **Depreciation / Versions / Options / Timeline** — هياكل فارغة
6. **Pros & Cons / Score / Problems / Comparison / Quiz** — هياكل فارغة
7. **Used Guide / FAQ / Footer** — هياكل فارغة
8. **Scripts** — يحتاج `car-renderer.js` (غير موجود حالياً)

### العيب الحرج:
الـ Template يحتوي على:
```html
<script src="../js/car-renderer.js"></script>
<script>
    window.carRenderer = new CarRenderer(carDataFile);
    window.carRenderer.render();
</script>
```
لكن `js/car-renderer.js` **غير موجود** في المشروع!

**التأثير:** أي صفحة مولدة حالياً من الـ Template ستفشل في `new CarRenderer()` → `ReferenceError`.

---

## D. ما الذي سيتم نقله (Extract)

### من `rs7.html` (الخطوط 2418–3365) → `js/car-renderer.js`

| الدالة/المنطق | السطور في RS7 | الوصف |
|---|---|---|
| `loadCarData()` | 2426–2763 | تحميل JSON + setCarData + applyPageText |
| `replacePlaceholders()` | 2456–2503 | استبدال {{variable}} (نفس i18n.js) |
| `applyPageText()` | 2505–2562 | حقن pageText في DOM (score, worth, pros, cons, FAQ, timeline...) |
| `showContent()` + `safeLoadCarData()` | 2768–2807 | إدارة الـ loader |
| `setupCountryData()` wrapping | 2568–2586 | ربط بيانات البلد + إعادة applyPageText |
| Render problems | 2589–2593 | `#problemsList` |
| Render interior cards | 2596–2623 | `#interiorGrid` + SVG icons |
| Populate specs map | 2626–2654 | تعبئة الـ IDs بالقيم من JSON |
| Render versions | 2657–2683 | `#versionsContainer` |
| Update profile/score | 2685–2708 | `carData.rating` → bars + score box |
| Update timeline costs | 2710–2724 | `carData.content.timeline` |
| Re-apply translations | 2726–2745 | safety net delays |
| Diagnostic logs | 2809–2849 | فحص حالة الـ DOM |

### من `rs7.html` (الخطوط 2858–3365) → `js/cost-calculator.js`

| الدالة/المنطق | السطور في RS7 | الوصف |
|---|---|---|
| `getConsumptionMap()` | 2874–2879 | قراءة consumption من carData أو fallback |
| `animateCounter()` | 2885–2933 | animation بـ requestAnimationFrame |
| `highlightValue()` | 2935–2946 | تنسيق العملة + استدعاء animateCounter |
| `updateCalculator()` (الكامل) | 2949–3028 | الحساب + update كل الـ DOM |
| Event listeners | 3031–3035 | input events على الـ sliders |
| Profile quiz logic | 3041–3117 | `profileBarsData`, `setProfile()`, `updateProfileLabels()` |
| Quiz logic (RS7 vs M5) | 3120–3223 | quiz خطوات + نتيجة |
| Scroll top button | 3232–3254 | إنشاء + toggle button |
| Footer newsletter | 3257–3291 | `handleFooterSubscribe()` |
| Overflow diagnostic | 3294–3364 | `diagnoseOverflow()` |

### من `rs7.html` (الخطوط 3369–3399) → `js/emergency-fallback.js`

| الدالة/المنطق | السطور في RS7 | الوصف |
|---|---|---|
| `emergencyFill()` | 3371–3398 | fallback عام بدون نصوص RS7 hardcoded |

---

## E. ما الذي سيبقى كما هو (لا تعديل)

| الملف/المنطق | السبب |
|---|---|
| **CSS كامل** | التصميم يعمل. لا نلمسه. |
| **js/i18n.js** | يعمل. car-renderer.js سيتصل به فقط. |
| **js/script.js** | يعمل. لا تغيير. |
| **js/mega-menu.js** | يعمل. لا تغيير. |
| **js/mega-menu-data.js** | يعمل. لا تغيير. |
| **js/country-data.js** | يعمل. لا تغيير. |
| **system/js/country-manager.js** | يعمل. لا تغيير. |
| **system/js/dropdowns.js** | يعمل. لا تغيير. |
| **system/build.js** | يعمل. سيستدعي generators المحدثة. |
| **system/schemas/master-car-schema.json** | Schema كامل. لا يحتاج تعديل. |
| **system/registry/*.json** | Registry يعمل. |
| **system/data/*.json (الموجودة)** | بيانات السيارات لا تتغير. |
| **rs7.html** | لن نحذف أو نعدل شيئاً فيه الآن. |
| **html/*.html (ما عدا المولدة)** | الصفحات المولدة ستُستبدل بالكامل من build.js |

---

## F. خطة التنفيذ — خطوة بخطوة

### المرحلة 2 — إنشاء الملفات المركزية

**الخطوة 2.1:** إنشاء `js/car-renderer.js`
- استخراج `loadCarData()` من RS7 كاملاً
- استخراج كل دوال الـ rendering (specs, versions, interior, problems, timeline, FAQ, pros/cons, score)
- جعل مسار JSON ديناميكياً (يُمرر من الخارج)
- إزالة console.log التشخيصية الزائدة (نحتفظ بـ errors فقط)

**الخطوة 2.2:** إنشاء `js/cost-calculator.js`
- استخراج `updateCalculator()` + `animateCounter()` + `highlightValue()`
- استخراج `getConsumptionMap()`
- استخراج `setProfile()` + `updateProfileLabels()` + `profileBarsData`
- استخراج quiz logic (جعله عاماً — يقرأ أسماء السيارات من carData.comparisons)
- استخراج scroll-top button + footer newsletter + overflow diagnostic
- كل هذه وظائف مستقلة — لا تعتمد على renderer

**الخطوة 2.3:** إنشاء `js/emergency-fallback.js`
- `emergencyFill()` عام
- بدون نصوص hardcoded — يقرأ fallback من `carData.pageText`
- يعمل بعد 2 ثانية من load

### المرحلة 3 — تحديث Template

**الخطوة 3.1:** في `system/templates/car-template.html`:
- **إضافة** `<script src="../js/car-renderer.js"></script>` قبل closing `</body>`
- **إضافة** `<script src="../js/cost-calculator.js"></script>`
- **إضافة** `<script src="../js/emergency-fallback.js"></script>`
- **إزالة** الكود المضمن الخاص بالـ Calculator (السطور 669–733) — لأنه أصبح في `cost-calculator.js`
- **إزالة** الكود المضمن الخاص بـ `showContent` الثاني (السطور 737–746) — لأنه أصبح في `car-renderer.js`
- **تعديل** initialization block (السطور 625–650) لاستدعاء `loadCarData()` بدلاً من `CarRenderer`

**ملاحظة أمان:** هذه التعديلات على Template فقط. الصفحات الموجودة في `html/` **لن تتأثر** لأنها ملفات مولدة سابقة. عند تشغيل `build.js` ستُولد صفحات جديدة من التحديث.

### المرحلة 4 — تحديث Generator

**الخطوة 4.1:** في `system/generators/car-page-generator.js`:
- **إضافة** توليد `gallery-grid` من `carData.images.gallery`
- **إضافة** توليد `faq-list` من `carData.content.faq`
- **إضافة** توليد `versions-grid` من `carData.versions`
- **إضافة** توليد `timeline-grid` من `carData.content.timeline`
- **إضافة** توليد `options-table-body` من `carData.options`
- **التحقق** أن Hero image يأتي من `carData.images.hero` (موجود بالفعل)
- **إضافة** injection لـ `related cars` في Footer

**ملاحظة أمان:** هذه تعديلات على generator. الصفحات الموجودة لن تتغير إلا بعد تشغيل `build.js`.

### المرحلة 5 — مراجعة الترجمة

**الخطوة 5.1:** البحث في locales:
```bash
# سيتم تنفيذه تلقائياً
```
- البحث عن "Audi", "BMW", "RS7", "M5", "Porsche", "Mercedes", "Nissan", "GT-R", "911"
- البحث عن "Spain", "España", "France", "Germany", "Italia", "2025", "2026"
- استبدال أي قيمة hardcoded بـ `{{fullModelName}}`, `{{brand}}`, `{{country}}`, `{{modelYear}}`

**ملاحظة أمان:** التعديلات على ملفات JSON. أي خطأ يمكن التراجع عنه.

### المرحلة 6 — اختبار التوافق

**الخطوة 6.1:** إنشاء `system/data/test-car.json` (نسخة مبسطة من rs7-2026.json)
**الخطوة 6.2:** إضافة entry في `system/registry/car-registry.json`
**الخطوة 6.3:** تشغيل `node system/build.js`
**الخطوة 6.4:** فتح `html/test-car.html` وفحص:
- Header ✓, Footer ✓, Mega Menu ✓
- Hero ✓, Gallery ✓, Specs ✓
- Calculator ✓ (مع animation)
- Timeline ✓, FAQ ✓, Reviews ✓
- Comparativas ✓, SEO ✓
- Country/Language selectors ✓

### المرحلة 7 — تقرير التنظيف

**الخطوة 7.1:** مقارنة `rs7.html` مع النظام الجديد
**الخطوة 7.2:** إنشاء تقرير يوضح:
- أي أجزاء من RS7 أصبحت redundant
- أي كود مكرر يمكن حذفه
- توصية بحذف آمن

---

## G. تحليل المخاطر

| المخاطرة | الاحتمال | التأثير | الاحتياطي |
|---|---|---|---|
| `car-renderer.js` لا يعمل كما في RS7 | متوسط | صفحة جديدة فارغة | اختبار test-car قبل أي حذف |
| `cost-calculator.js` يفقد animation | منخفض | Calculator يعمل بدون animation | ننقل الكود حرفياً |
| Generator ينتج HTML غير صالح | منخفض | build.js يفشل | نتحقق من syntax قبل تشغيل build |
| Locales تحتوي على hardcoded بعد التعديل | منخفض | ترجمة خاطئة لسيارة جديدة | grep على أسماء سيارات بعد التعديل |
| صفحة موجودة تتكسر | **صفر** | — | **لا نعدل أي صفحة موجودة. نعدل template + generator فقط.** |

**الخلاصة:** هذه migration آمنة لأننا لا نلمس أي ملف HTML موجود. كل التعديلات على Template (يُولد منه) + ملفات JS جديدة + generator.

---

*Phase 1 complete — awaiting approval to proceed*
