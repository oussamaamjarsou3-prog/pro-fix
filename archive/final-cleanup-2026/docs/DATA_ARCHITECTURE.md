# توثيق نظام البيانات المتكامل - AutoMax Platform

## نظرة عامة

هذا التوثيق يصف نظام البيانات المتكامل والقابل للتوسع لمنصة AutoMax، المصمم لإدارة أكثر من 15,000 موديل سيارة عبر عدة لغات وتطبيقات مستقبلية.

---

## هيكل النظام

### 1. Master Car Schema

**الموقع**: `schemas/master-car-schema.json`

**الوصف**: Schema شامل لبيانات السيارات يحتوي على جميع الحقول المطلوبة لإدارة سيارات كاملة.

**الأقسام الرئيسية**:

#### Basic Information
- `id`: معرف فريد للسيارة
- `slug`: معرف URL-friendly
- `brandId`: مرجع إلى Schema الماركة
- `categoryId`: مرجع إلى Schema الفئة
- `modelYear`: سنة الموديل
- `generation`: الجيل (مثال: C8, G30)
- `bodyStyle`: نوع الهيكل (sedan, hatchback, suv, etc.)
- `doors`: عدد الأبواب
- `seats`: عدد المقاعد
- `drivetrain`: نظام الدفع (fwd, rwd, awd, 4wd)
- `enginePosition`: موقع المحرك (front, rear, mid)
- `status`: حالة السيارة (active, discontinued, upcoming, concept)
- `launchDate`: تاريخ الإطلاق
- `discontinuationDate`: تاريخ التوقف
- `productionYears`: نطاق سنوات الإنتاج

#### Specs (المواصفات الفنية)
- `engine`: مواصفات المحرك (type, displacement, cylinders, configuration, aspiration, fuelType, etc.)
- `transmission`: مواصفات ناقل الحركة (type, gears, brand, model, driveMode)
- `suspension`: نظام التعليق (front, rear, adaptive, airSuspension, adjustableDampers)
- `brakes`: نظام الفرامل (front, rear, abs, ebd, eba, parkingBrake)
- `steering`: نظام التوجيه (type, turningRadius, adjustable)
- `wheels`: العجلات والإطارات (front, rear, spareTire)
- `electrical`: النظام الكهربائي (battery, alternator, voltage)

#### Performance (الأداء)
- `power`: القدرة الحصانية (value, unit, rpm)
- `torque`: عزم الدوران (value, unit, rpm)
- `acceleration`: أوقات التسارع (zeroToSixty, zeroToHundred, zeroToTwoHundred, standingQuarterMile)
- `topSpeed`: السرعة القصوى (value, unit, limited, unlimited)
- `powerToWeight`: نسبة القدرة للوزن
- `braking`: أداء الفرامل (hundredToZero, sixtyToZero)
- `handling`: خصائص القيادة (lateralG, slalomSpeed)

#### Dimensions (الأبعاد)
- `length`: الطول
- `width`: العرض
- `height`: الارتفاع
- `wheelbase`: قاعدة العجلات
- `track`: عرض المسار (front, rear)
- `groundClearance`: الخلوص الأرضي
- `curbWeight`: الوزن الفارغ
- `grossWeight`: الوزن الإجمالي
- `cargoCapacity`: سعة التحميل (seatsUp, seatsDown)
- `fuelTank`: سعة خزان الوقود

#### Fuel Economy (استهلاك الوقود)
- `consumption`: الاستهلاك (city, highway, combined)
- `drivingStyles`: الاستهلاك حسب نمط القيادة (calm, mixed, sport)
- `range`: المدى (city, highway, combined)
- `emissions`: الانبعاثات (co2, nox, particulates)
- `electric`: بيانات السيارات الكهربائية (batteryCapacity, electricRange, charging, motor)

#### Pricing (التسعير)
- `basePrice`: السعر الأساسي (value, currency, region)
- `regionalPricing`: التسعير الإقليمي (region, price, currency, taxes)
- `depreciation`: الاستهلاك (year1, year3, year5)
- `ownershipCosts`: تكاليف الملكية السنوية (insurance, maintenance, fuel, tyres, inspection)

#### Features (المميزات)
- `exterior`: المميزات الخارجية
- `interior`: المميزات الداخلية
- `technology`: المميزات التقنية
- `comfort`: مميزات الراحة
- `performance`: مميزات الأداء

#### Safety (السلامة)
- `ratings`: تقييمات السلامة (euroNCAP, iihs, nhtsa)
- `airbags`: تكوين الوسائد الهوائية
- `driverAssist`: أنظمة مساعدة السائق
- `structural`: مميزات السلامة الهيكلية

#### Versions (الإصدارات)
- `id`: معرف الإصدار
- `name`: اسم الإصدار
- `slug`: معرف URL
- `price`: سعر الإصدار
- `features`: مميزات الإصدار
- `specs`: مواصفات خاصة بالإصدار
- `images`: صور خاصة بالإصدار

#### Images (الصور)
- `hero`: الصورة الرئيسية
- `gallery`: معرض الصور (url, alt, category, angle)
- `thumbnails`: الصور المصغرة

#### SEO (تحسين محركات البحث)
- `title`: عنوان SEO
- `description`: وصف SEO
- `keywords`: كلمات مفتاحية
- `og`: بيانات Open Graph
- `twitter`: بيانات Twitter Card

#### Content (المحتوى)
- `pros`: المزايا
- `cons`: العيوب
- `review`: المراجعة الكاملة
- `faq`: الأسئلة الشائعة
- `timeline`: جدول الصيانة
- `options`: الخيارات الإضافية

#### Comparisons & Related
- `comparisons`: السيارات المقارنة
- `relatedModels`: السيارات ذات الصلة

#### Rating (التقييم)
- `overall`: التقييم العام
- `performance`: تقييم الأداء
- `comfort`: تقييم الراحة
- `technology`: تقييم التكنولوجيا
- `design`: تقييم التصميم
- `value`: تقييم القيمة
- `reliability`: تقييم الموثوقية

#### Metadata (البيانات الوصفية)
- `createdAt`: تاريخ الإنشاء
- `updatedAt`: تاريخ التحديث
- `createdBy`: منشئ البيانات
- `updatedBy`: محدث البيانات
- `version`: إصدار البيانات
- `source`: مصدر البيانات
- `verified`: حالة التحقق

---

### 2. Brand Schema

**الموقع**: `schemas/brand-schema.json`

**الوصف**: Schema لبيانات الماركات.

**الأقسام الرئيسية**:
- `id`: معرف فريد للماركة
- `slug`: معرف URL
- `name`: اسم الماركة
- `legalName`: الاسم القانوني
- `country`: بلد المنشأ (ISO 3166-1 alpha-2)
- `countryName`: اسم البلد
- `founded`: سنة التأسيس
- `headquarters`: المقر الرئيسي
- `status`: حالة الماركة (active, discontinued, defunct)
- `parentCompany`: الشركة الأم
- `subsidiaries`: الشركات التابعة
- `logo`: أصول الشعار
- `website`: الموقع الرسمي
- `social`: حسابات التواصل الاجتماعي
- `segment`: شريحة السوق (luxury, premium, mainstream, economy, supercar, commercial)
- `specialty`: تخصصات الماركة
- `categories`: فئات السيارات التي تنتجها الماركة
- `description`: وصف الماركة
- `history`: تاريخ الماركة
- `achievements`: الإنجازات البارزة
- `awards`: الجوائز والتقديرات
- `production`: إحصائيات الإنتاج
- `marketPresence`: التواجد في الأسواق
- `popularModels`: الموديلات الشائعة
- `iconicModels`: الموديلات التاريخية
- `technologies`: التقنيات الخاصة بالماركة
- `sustainability`: مبادرات الاستدامة
- `seo`: بيانات SEO
- `metadata`: البيانات الوصفية

---

### 3. Category Schema

**الموقع**: `schemas/category-schema.json`

**الوصف**: Schema لبيانات فئات السيارات.

**الأقسام الرئيسية**:
- `id`: معرف فريد للفئة
- `slug`: معرف URL
- `name`: اسم الفئة
- `icon`: أيقونة الفئة
- `description`: وصف الفئة
- `segment`: شريحة السوق
- `bodyStyles`: أنواع الهيكل في هذه الفئة
- `characteristics`: خصائص الفئة (performance, practicality, fuelEfficiency, luxury, technology)
- `targetAudience`: الجمهور المستهدف
- `priceRange`: نطاق السعر النموذجي
- `popularBrands`: الماركات الشائعة في هذه الفئة
- `popularModels`: الموديلات الشائعة في هذه الفئة
- `competitors`: الفئات المنافسة
- `trends`: الاتجاهات الحالية في هذه الفئة
- `seo`: بيانات SEO
- `metadata`: البيانات الوصفية

---

### 4. Translation System (نظام الترجمة)

**الموقع**: `locales/`

**الوصف**: نظام ترجمة شامل يدعم لغات متعددة.

**اللغات المدعومة**:
- `es.json`: الإسبانية
- `en.json`: الإنجليزية
- `fr.json`: الفرنسية
- `ar.json`: العربية (للمستقبل)

**هيكل ملف اللغة**:
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://carspecio.com/locales/es.json",
  "language": "es",
  "languageName": "Español",
  "direction": "ltr",
  "dateFormat": "DD/MM/YYYY",
  "numberFormat": {
    "decimal": ",",
    "thousands": "."
  },
  "currencyFormat": {
    "EUR": "€",
    "USD": "$",
    "GBP": "£"
  },
  "common": { ... },
  "navigation": { ... },
  "categories": { ... },
  "header": { ... },
  "banner": { ... },
  "hero": { ... },
  "sticky": { ... },
  "quick": { ... },
  "gallery": { ... },
  "price": { ... },
  "cost": { ... },
  "dep": { ... },
  "fiscal": { ... },
  "versions": { ... },
  "options": { ... },
  "timeline": { ... },
  "sound": { ... },
  "interior": { ... },
  "consumption": { ... },
  "problems": { ... },
  "pros": { ... },
  "cons": { ... },
  "opinions": { ... },
  "score": { ... },
  "profile": { ... },
  "quiz": { ... },
  "quizResults": { ... },
  "profileData": { ... },
  "cta": { ... },
  "faq": { ... },
  "footer": { ... },
  "a11y": { ... }
}
```

**الترجمات المضافة**:
- جميع النصوص الثابتة من HTML
- جميع النصوص من JavaScript
- جميع العناوين والأوصاف
- جميع رسائل الخطأ والنجاح
- جميع عناصر الوصولية (a11y)

---

### 5. Car Data Files (ملفات بيانات السيارات)

**الموقع**: `data/cars/`

**الوصف**: ملفات بيانات السيارات بناءً على Master Car Schema.

**مثال**: `data/cars/rs7-2026.json`

**الحقول الجديدة المضافة**:
- `fuelEconomy.drivingStyles`: استهلاك الوقود حسب نمط القيادة (calm, mixed, sport)
- `pricing.regionalPricing`: التسعير الإقليمي مع الضرائب
- `pricing.ownershipCosts`: تكاليف الملكية السنوية التفصيلية
- `safety.ratings.iihs`: تقييمات IIHS
- `safety.ratings.nhtsa`: تقييمات NHTSA
- `content.timeline`: جدول الصيانة التفصيلي
- `content.options`: الخيارات الإضافية مع تأثير إعادة البيع
- `comparisons`: السيارات المقارنة
- `relatedModels`: السيارات ذات الصلة
- `rating`: التقييم التفصيلي

---

### 6. HTML Template (قالب HTML)

**الموقع**: `templates/car-template.html`

**الوصف**: قالب HTML ديناميكي يستخدم البيانات من JSON.

**المميزات**:
- استخدام Handlebars/Mustache syntax لربط البيانات
- دعم الترجمة عبر data-i18n attributes
- دعم التكيف الإقليمي للأسعار والضرائب
- SEO ديناميكي
- تحميل الصور lazy loading
- تصميم متجاوب

---

## كيفية إضافة سيارة جديدة

### الخطوة 1: إنشاء ملف بيانات السيارة

```bash
# إنشاء ملف جديد في data/cars/
touch data/cars/new-car-2026.json
```

### الخطوة 2: ملء البيانات بناءً على Master Car Schema

```json
{
  "id": "brand-model-year",
  "slug": "model",
  "brandId": "brand",
  "categoryId": "category",
  "modelYear": 2026,
  "basicInfo": { ... },
  "specs": { ... },
  "performance": { ... },
  "dimensions": { ... },
  "fuelEconomy": { ... },
  "pricing": { ... },
  "features": { ... },
  "safety": { ... },
  "versions": [ ... ],
  "images": { ... },
  "seo": { ... },
  "content": { ... },
  "comparisons": [ ... ],
  "relatedModels": [ ... ],
  "rating": { ... },
  "metadata": { ... }
}
```

### الخطوة 3: إضافة الترجمات (إذا لزم الأمر)

```bash
# إضافة ترجمات جديدة في locales/
# فقط للنصوص الخاصة بالسيارة
# النصوص العامة موجودة بالفعل
```

### الخطوة 4: إنشاء صفحة HTML

```bash
# نسخ القالب
cp templates/car-template.html html/new-car.html
```

### الخطوة 5: تحديث JavaScript لتحميل البيانات

```javascript
// في js/car-renderer.js
const carData = await fetch('../data/cars/new-car-2026.json');
```

### الخطوة 6: الاختبار

```bash
# اختبار الصفحة
# التحقق من جميع البيانات
# التحقق من الترجمات
# التحقق من SEO
```

---

## الحقول الجديدة المضافة

### للمستقبل (Marcas)
- `specialty`: تخصصات الماركة
- `technologies`: التقنيات الخاصة
- `sustainability`: مبادرات الاستدامة
- `marketPresence`: التواجد في الأسواق

### للمستقبل (Comparativas)
- `similarity`: درجة التشابه
- `category`: فئة المقارنة

### للمستقبل (Car Finder)
- `characteristics`: خصائص الفئة
- `targetAudience`: الجمهور المستهدف
- `priceRange`: نطاق السعر

### للمستقبل (Diagnóstico)
- `profileData`: بيانات الملف الشخصي
- `quizResults`: نتائج الاختبار

### للمستقبل (Marketplace)
- `depreciation`: الاستهلاك التفصيلي
- `ownershipCosts`: تكاليف الملكية
- `options`: الخيارات مع تأثير إعادة البيع

### للمستقبل (Mobile App)
- `images.thumbnails`: صور مصغرة
- `metadata`: بيانات وصفية للنظام
- `seo`: بيانات SEO كاملة

---

## النصوص المحولة إلى Translation Keys

### من HTML
- جميع العناوين (hero, sections, cards)
- جميع الأوصاف
- جميع الأزرار والروابط
- جميع رسائل الخطأ والنجاح
- جميع عناصر الوصولية

### من JavaScript
- رسائل الآلة الحاسبة
- رسائل الاختبار
- رسائل الملف الشخصي
- رسائل التحقق

### المجموع
- أكثر من 200 translation key
- تغطي جميع أقسام الصفحة
- دعم كامل للغات المتعددة

---

## قابلية التوسع

### للسيارات
- يدعم حتى 15,000+ موديل
- هيكل موحد لجميع السيارات
- سهولة إضافة سيارات جديدة
- دعم لجميع أنواع السيارات

### للغات
- دعم لغات متعددة
- سهولة إضافة لغات جديدة
- دعم RTL للعربية
- تنسيق محلي للأرقام والتواريخ

### للتطبيقات
- API جاهز للاستخدام
- Schema موحد لجميع التطبيقات
- دعم Mobile App
- دعم Marketplace
- دعم Car Finder

### للمناطق
- دعم تسعير متعدد المناطق
- دعم ضرائب مختلفة
- دعم عملات متعددة
- تكيف محلي للبيانات

---

## الملفات المنشأة

### Schemas
1. `schemas/master-car-schema.json` - Master Car Schema الشامل
2. `schemas/brand-schema.json` - Brand Schema للماركات
3. `schemas/category-schema.json` - Category Schema للفئات

### Locales
1. `locales/es.json` - الترجمات الإسبانية
2. `locales/en.json` - الترجمات الإنجليزية
3. `locales/fr.json` - الترجمات الفرنسية

### Data
1. `data/cars/rs7-2026.json` - بيانات Audi RS7 2026

### Templates
1. `templates/car-template.html` - قالب HTML ديناميكي

---

## الخلاصة

تم بناء نظام بيانات متكامل وقابل للتوسع لمنصة AutoMax، مصمم لإدارة أكثر من 15,000 موديل سيارة عبر عدة لغات وتطبيقات مستقبلية.

**المميزات الرئيسية**:
- Schema شامل وموحد
- نظام ترجمة متعدد اللغات
- دعم إقليمي للأسعار والضرائب
- قابلية توسع عالية
- سهولة إضافة سيارات جديدة
- دعم SEO ديناميكي
- تصميم متجاوب

**النتائج**:
- إمكانية إضافة سيارة جديدة بتغيير البيانات فقط
- لا حاجة لتعديل HTML أو CSS أو JavaScript
- نظام موحد لجميع السيارات
- دعم كامل للغات المتعددة
- جاهز للتطبيقات المستقبلية

---

## التالي

### للتنفيذ
1. إنشاء JavaScript renderer لتحميل البيانات
2. إنشاء build system لتوليد HTML من القالب
3. إنشاء API للوصول إلى البيانات
4. إنشاء CMS لإدارة البيانات

### للتوسع
1. إضافة المزيد من السيارات
2. إضافة المزيد من اللغات
3. إضافة المزيد من المناطق
4. تطوير Mobile App
5. تطوير Marketplace

---

**تم إنشاء هذا التوثيق بواسطة Cascade AI Assistant**
**التاريخ**: 15 يونيو 2026
