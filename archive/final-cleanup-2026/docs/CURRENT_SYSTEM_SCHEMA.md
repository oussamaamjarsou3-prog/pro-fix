# مخطط النظام الحالي (Current System Schema)
## تاريخ التحديث: 2026-06-15

---

## نظرة عامة

هذا المخطط يوضح جميع الملفات المستعملة حالياً في مشروع AutoMax بعد إعادة الهيكلة الكاملة.

---

## الهيكل العام للمشروع

```
pro-fix/
├── html/                    # صفحات HTML (13 ملف)
├── css/                     # أنماط CSS
├── js/                      # ملفات JavaScript (19 ملف محتفظ به)
├── data/                    # بيانات السيارات
│   └── cars/               # بيانات السيارات الجديدة
├── locales/                # الترجمات العامة (النظام الجديد)
├── schemas/                # الهياكل (Schemas)
├── system/                 # النظام الموحد لبناء صفحات جديدة
├── templates/              # القوالب
├── scripts/                # السكريبتات (فارغ حالياً)
├── docs/                   # الوثائق
├── archive/                # الملفات المؤرشفة
└── root files             # ملفات الجذر
```

---

## 1. صفحات HTML (13 ملف)

### 1.1 الصفحات المحدثة (4 ملفات)
```
html/
├── rs7.html              # تم تحديثه - يستخدم النظام الجديد
├── porsche-911.html      # تم تحديثه - يستخدم النظام الجديد
├── herramientas.html     # تم تحديثه - يستخدم النظام الجديد
└── compare.html          # تم تحديثه - يستخدم النظام الجديد
```

### 1.2 الصفحات المحتفظ بها (2 ملف)
```
html/
├── rs3.html              # محتفظ به - يستخدم rs3-lang-data.js
└── bmw-m5.html           # محتفظ به - يستخدم bmw-m5-lang-data.js
```

### 1.3 الصفحات التي لا تحتاج تحديث (7 ملفات)
```
html/
├── index.html            # الصفحة الرئيسية
├── article.html          # صفحة المقالات
├── reviews.html          # صفحة المراجعات
├── contacto.html         # صفحة الاتصال
├── mercedes-amg-gt.html # صفحة Mercedes AMG GT
├── nissan-gtr.html       # صفحة Nissan GTR
└── diagnostico.html      # صفحة التشخيص
```

---

## 2. ملفات JavaScript (19 ملف محتفظ به)

### 2.1 ملفات JavaScript المحتفظ بها
```
js/
├── compare-data.js       # محتفظ به - بيانات المقارنات
├── compare.js            # وظائف المقارنات
├── compare-page.js       # وظائف صفحة المقارنات
├── herramientas.js       # وظائف الأدوات
├── home.js               # وظائف الصفحة الرئيسية
├── rs3-lang-data.js      # محتفظ به - بيانات RS3
├── rs3-country.js        # بيانات الدول RS3
├── rs7-country.js        # بيانات الدول RS7
├── bmw-m5-country.js     # بيانات الدول BMW M5
├── mercedes-amg-gt-country.js  # بيانات الدول Mercedes AMG GT
├── nissan-gtr-country.js        # بيانات الدول Nissan GTR
├── porsche-911-country.js       # بيانات الدول Porsche 911
├── i18n.js               # نظام الترجمة الجديد
├── mega-menu-data.js     # بيانات القائمة الرئيسية
├── mega-menu.js          # وظائف القائمة الرئيسية
├── script.js             # السكريبت الرئيسي
├── html/diagnostico.js   # وظائف التشخيص
└── templates/car-data-template.js  # قالب بيانات السيارات
```

---

## 3. بيانات السيارات (النظام الجديد)

### 3.1 بيانات السيارات الجديدة
```
data/
└── cars/
    └── rs7-2026.json     # بيانات RS7 باستخدام Master Car Schema
```

---

## 4. الترجمات العامة (النظام الجديد)

### 4.1 ملفات الترجمات
```
locales/
├── en.json               # الترجمة الإنجليزية (40 مفتاح)
├── es.json               # الترجمة الإسبانية (40 مفتاح)
├── fr.json               # الترجمة الفرنسية (40 مفتاح)
└── ar.json               # الترجمة العربية (40 مفتاح، RTL)
```

**الملاحظة:** جميع الملفات تحتوي على نفس 40 مفتاحاً مطابقاً تماماً.

---

## 5. الهياكل (Schemas)

### 5.1 ملفات الهياكل
```
schemas/
├── master-car-schema.json  # الهيكل الرئيسي لبيانات السيارات
├── brand-schema.json       # هيكل بيانات الماركات
└── category-schema.json    # هيكل بيانات الفئات
```

---

## 6. النظام الموحد (System)

### 6.1 هيكل النظام الموحد
```
system/
├── schemas/              # الهياكل (نسخ)
│   ├── master-car-schema.json
│   ├── brand-schema.json
│   └── category-schema.json
├── locales/              # الترجمات (نسخ)
│   ├── en.json
│   ├── es.json
│   ├── fr.json
│   └── ar.json
├── templates/            # القوالب (نسخ)
│   ├── car-template.html
│   └── car-data-template.js
├── data/                 # البيانات (نسخ)
│   └── example-car.json  (مثال)
├── css/                  # أنماط CSS (نسخ)
│   └── css-template.css
└── README.md            # دليل الاستخدام
```

**الاستخدام:** هذا المجلد يحتوي على كل الملفات المطلوبة لبناء صفحات سيارات جديدة.

---

## 7. القوالب (Templates)

### 7.1 ملفات القوالب
```
templates/
├── car-template.html     # القالب الجديد لصفحات السيارات
├── car-data-template.js  # قالب بيانات السيارات (منقول من js/)
└── data/                 # مجلد جديد للبيانات
```

---

## 8. السكريبتات (Scripts)

### 8.1 مجلد السكريبتات
```
scripts/                  # فارغ حالياً
```

**الملاحظة:** جميع السكريبتات القديمة تم أرشفتها في `archive/scripts_*`.

---

## 9. الوثائق (Docs)

### 9.1 ملفات الوثائق
```
docs/
├── TRANSLATION_REFACTORING_REPORT.md  # تقرير إعادة هيكلة الترجمات
├── DATA_AUDIT_REPORT.md              # تقرير مراجعة البيانات
├── CAR_DATA_ANALYSIS.md             # تحليل بيانات السيارة
└── CURRENT_SYSTEM_SCHEMA.md         # هذا الملف
```

---

## 10. الملفات المؤرشفة (Archive)

### 10.1 ملفات JSON المؤرشفة (19 ملف)
```
archive/
├── lang/                  # مجلد كامل (14 ملف)
│   ├── ar.json
│   ├── bmw-m5-ar.json
│   ├── bmw-m5-en.json
│   ├── bmw-m5-es.json
│   ├── bmw-m5-fr.json
│   ├── en.json
│   ├── es.json
│   ├── fr.json
│   ├── rs3-ar.json
│   ├── rs3-en.json
│   ├── rs3-es.json
│   ├── rs3-fr.json
│   ├── rs7-extra-en.json
│   └── rs7-extra-es.json
├── templates_car-data-ar.json
├── templates_car-data-de.json
├── templates_car-data-en.json
├── templates_car-data-es.json
├── templates_car-data-fr.json
├── templates_data-template.json
└── temp_es.json
```

### 10.2 ملفات JavaScript المؤرشفة (9 ملف)
```
archive/
├── js_lang-data.js
├── js_lang-data-backup.js
├── js_lang-data-full.js
├── js_car-data.js
├── js_bmw-m5-lang-data.js
├── scripts_locale-ar.js
├── scripts_locale-fr.js
├── scripts_merge-i18n.js
└── scripts_build-fr-ar.js
```

### 10.3 ملفات HTML المؤرشفة (1 ملف)
```
archive/
└── templates_html-template.html
```

**إجمالي الملفات المؤرشفة:** 24 ملف

---

## 11. الملفات في الجذر

### 11.1 ملفات الجذر
```
pro-fix/
├── CODE_WIKI.md          # ويكي الكود
├── temp_index.html       # ملف مؤقت
└── ... (ملفات أخرى)
```

---

## ملخص الإحصائيات

### الملفات النشطة
- **HTML:** 13 ملف (4 محدثة، 2 محتفظ بها، 7 لا تحتاج تحديث)
- **JavaScript:** 19 ملف محتفظ به
- **JSON (جديد):** 8 ملف (4 schemas + 4 locales)
- **JSON (بيانات):** 1 ملف (rs7-2026.json)
- **CSS:** 1 ملف (css-template.css في system/css/)

### الملفات المؤرشفة
- **JSON:** 19 ملف
- **JavaScript:** 9 ملف
- **HTML:** 1 ملف
- **إجمالي:** 29 ملف مؤرشف

### الملفات المحذوفة
- **JavaScript:** 1 ملف (templates/car-data-template.js تم نقله)
- **HTML:** 1 ملف (templates/html-template.html تم أرشفته)

---

## النظام الجديد vs النظام القديم

### النظام القديم (تم أرشفته)
- ملفات `lang/` محددة لكل سيارة
- ملفات `js/*-lang-data.js` مدمجة
- ملفات `scripts/` للبناء والدمج
- بيانات مكررة في أماكن متعددة
- `templates/html-template.html` (القالب القديم)

### النظام الجديد (محتفظ به)
- ملفات `locales/` عامة وقابلة لإعادة الاستخدام
- بيانات `data/cars/` منفصلة باستخدام Master Car Schema
- متغيرات ديناميكية بدلاً من نصوص ثابتة
- `templates/car-template.html` (القالب الجديد)
- `system/` (النظام الموحد لبناء صفحات جديدة)
- Single Source of Truth

---

## التوصيات

### 1. استخدام النظام الموحد
عند بناء صفحات سيارات جديدة، استخدم مجلد `system/` الذي يحتوي على كل الملفات المطلوبة.

### 2. اتبع Master Car Schema
عند إنشاء بيانات سيارات جديدة، اتبع `schemas/master-car-schema.json` بدقة.

### 3. استخدم المتغيرات الديناميكية
استخدم المتغيرات الديناميكية في `locales/` بدلاً من نصوص ثابتة.

### 4. احتفظ بالملفات المحتفظ بها
الملفات المحتفظ بها (rs3-lang-data.js, bmw-m5-lang-data.js, compare-data.js) مهمة للنظام الحالي.

---

**تاريخ التحديث:** 2026-06-15  
**تم بواسطة:** Cascade AI Assistant  
**الحالة:** جاهز للاستخدام
