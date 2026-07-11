# نظام بناء صفحات السيارات الجديد (Car Page Builder System)

## نظرة عامة

هذا النظام الموحد يحتوي على كل الملفات المطلوبة لبناء صفحات سيارات جديدة في AutoMax. كل شيء موجود في مجلد واحد `system/` لتسهيل عملية البناء.

---

## هيكل المجلد

```
system/
├── schemas/              # الهياكل (Schemas)
│   ├── master-car-schema.json
│   ├── brand-schema.json
│   └── category-schema.json
├── locales/              # الترجمات (Locales)
│   ├── en.json
│   ├── es.json
│   ├── fr.json
│   └── ar.json
├── templates/            # القوالب (Templates)
│   ├── car-template.html
│   └── car-data-template.js
├── data/                 # بيانات السيارات (Data)
│   └── example-car.json (مثال)
└── README.md            # هذا الملف
```

---

## كيفية بناء صفحة سيارة جديدة

### الخطوة 1: إنشاء بيانات السيارة

1. انسخ `data/example-car.json` كنقطة بداية
2. سمِّ الملف الجديد باسم السيارة (مثال: `bmw-m5-2026.json`)
3. املأ البيانات وفق `schemas/master-car-schema.json`

```bash
# مثال
cp system/data/example-car.json system/data/bmw-m5-2026.json
```

### الخطوة 2: التحقق من البيانات

تأكد من أن بياناتك تتبع الهيكل الصحيح:

```bash
# تحقق من JSON
node -e "console.log(JSON.parse(require('fs').readFileSync('system/data/bmw-m5-2026.json', 'utf8')))"
```

### الخطوة 3: إنشاء صفحة HTML

1. انسخ `templates/car-template.html` إلى مجلد `html/`
2. سمِّ الملف الجديد باسم السيارة (مثال: `bmw-m5.html`)
3. عدّل مسار ملف البيانات في السطر 442:

```javascript
// عدّل هذا السطر
const carDataFile = '../data/cars/bmw-m5-2026.json';
```

### الخطوة 4: إضافة السيارة إلى القائمة

أضف السيارة إلى `js/mega-menu-data.js` إذا لزم الأمر.

---

## الملفات المطلوبة

### 1. Schemas (الهياكل)

- **master-car-schema.json**: الهيكل الرئيسي لبيانات السيارات
- **brand-schema.json**: هيكل بيانات الماركات
- **category-schema.json**: هيكل بيانات الفئات

### 2. Locales (الترجمات)

- **en.json**: الترجمة الإنجليزية
- **es.json**: الترجمة الإسبانية
- **fr.json**: الترجمة الفرنسية
- **ar.json**: الترجمة العربية (RTL)

### 3. Templates (القوالب)

- **car-template.html**: قالب HTML لصفحة السيارة
- **car-data-template.js**: قالب JavaScript لبيانات السيارة (النظام القديم - للمرجعية فقط)

### 4. Data (البيانات)

- **example-car.json**: مثال على بيانات سيارة كاملة

---

## المتغيرات الديناميكية

النظام الجديد يستخدم متغيرات ديناميكية في `locales/`:

- `{{fullModelName}}`: الاسم الكامل للسيارة
- `{{modelYear}}`: سنة الموديل
- `{{engineType}}`: نوع المحرك
- `{{dynamicPackage}}`: الحزمة الديناميكية
- `{{country}}`: البلد
- `{{brandBadge}}`: شارة الماركة
- وغيرها الكثير...

---

## مثال عملي

### بناء صفحة BMW M5 2026

```bash
# 1. إنشاء بيانات السيارة
cp system/data/example-car.json system/data/bmw-m5-2026.json

# 2. تعديل البيانات في bmw-m5-2026.json
# - غير id إلى "bmw-m5-2026"
# - غير slug إلى "bmw-m5"
# - غير brandId إلى "bmw"
# - املأ باقي البيانات

# 3. إنشاء صفحة HTML
cp system/templates/car-template.html html/bmw-m5.html

# 4. تعديل مسار البيانات في bmw-m5.html
# عدّل السطر 442 إلى:
# const carDataFile = '../system/data/bmw-m5-2026.json';
```

---

## التحقق من الصحة

### التحقق من JSON

```bash
# تحقق من صحة JSON
node -e "JSON.parse(require('fs').readFileSync('system/data/bmw-m5-2026.json', 'utf8'))"
```

### التحقق من Schema

```bash
# تحقق من التوافق مع Schema
# (يتطلب أداة مثل ajv)
```

---

## الملاحظات

### النظام القديم vs النظام الجديد

**النظام القديم:**
- ملفات `lang/` محددة لكل سيارة
- ملفات `js/*-lang-data.js` مدمجة
- بيانات مكررة في أماكن متعددة

**النظام الجديد:**
- ملفات `system/locales/` عامة وقابلة لإعادة الاستخدام
- بيانات `system/data/` منفصلة
- متغيرات ديناميكية بدلاً من نصوص ثابتة
- Single Source of Truth

### الملفات المحتفظ بها

- `system/templates/car-data-template.js`: محتفظ به للمرجعية فقط (النظام القديم)
- `system/data/rs7-2026.json`: بيانات RS7 الحالية
- `system/locales/*`: الترجمات العامة

---

## الدعم

إذا واجهت أي مشاكل:
1. تحقق من أن بياناتك تتبع `system/schemas/master-car-schema.json`
2. تأكد من أن جميع المتغيرات الديناميكية موجودة في `system/locales/`
3. تحقق من مسارات الملفات في صفحة HTML

---

**تاريخ الإنشاء:** 2026-06-15  
**الإصدار:** 1.0.0  
**الحالة:** جاهز للاستخدام
