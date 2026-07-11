import json, re, os

AR_JSON = 'system/locales/ar.json'

# Map of exact feature strings used in car data to Arabic translations.
FEATURES = {
    "0-100 km/h in 2.5 s": "تسارع 0-100 كم/س في 2.5 ثانية",
    "0-100 km/h in 2.7 s": "تسارع 0-100 كم/س في 2.7 ثانية",
    "0-100 km/h in 2.8 s": "تسارع 0-100 كم/س في 2.8 ثانية",
    "0-100 km/h in 2.9 s": "تسارع 0-100 كم/س في 2.9 ثانية",
    "0-100 km/h in 3.8 s": "تسارع 0-100 كم/س في 3.8 ثانية",
    "17-touchscreen": "شاشة 17 بوصة",
    "570 HP VR38DETT": "محرك ڤي آر 38 دي إي تي تي بقوة 570 حصان",
    "580 PS T-Hybrid": "نظام تي هجين بقوة 580 حصان",
    "585 HP V8 biturbo": "محرك 8 أسطوانات بشاحنين توربينيين بقوة 585 حصان",
    "600 HP VR38DETT": "محرك ڤي آر 38 دي إي تي تي بقوة 600 حصان",
    "711 PS T-Hybrid": "نظام تي هجين بقوة 711 حصان",
    "727 HP y tracción M xDrive": "727 حصان ودفع أم إكس درايف",
    "831 HP V8 hybrid": "محرك 8 أسطوانات هجين بقوة 831 حصان",
    "AMG 4MATIC+": "نظام دفع أم جي رباعي فورماتيك بلس",
    "AMG Performance seats": "مقاعد أم جي الأدائية",
    "AMG RIDE CONTROL+": "نظام تحكم أم جي في التعليق زائد",
    "ATTESA E-TS AWD": "نظام الدفع الرباعي أتيسا إي-تي-إس",
    "Ajustes de chasis más deportivos": "إعدادات هيكل أكثر رياضية",
    "BMW OS 8.5 con pantalla curva": "نظام بي إم دبليو 8.5 بشاشة منحنية",
    "Bose audio": "نظام صوت بوز",
    "Carbon-ceramic brakes": "فرامل كربون-سيراميك",
    "Elementos de carbono M": "عناصر كربون أم",
    "Llantas de 21 pulgadas opcionales": "عجلات 21 بوصة اختيارية",
    "MBUX Hyperscreen": "شاشة إم بي يو إكس هايبرسكرين",
    "MBUX standard": "نظام إم بي يو إكس قياسي",
    "NISMO Recaro seats": "مقاعد ريكارو نيسمو",
    "Nissan Connect": "نظام نيسان كونكت",
    "PASM": "نظام تعليق باسم",
    "PDK 8": "ناقل حركة بي دي كي بـ 8 سرعات",
    "PTM AWD": "نظام الدفع الرباعي بي تي إم",
    "Sedan body style": "هيكل سيدان",
    "Standard equipment": "التجهيزات القياسية",
    "Suspensión adaptativa M": "تعليق أم تكيفي",
    "apple-carplay": "أبل كاربلاي",
    "autopilot": "القيادة الذاتية",
    "bmw-os8": "نظام بي إم دبليو 8.5",
    "comfort": "الراحة",
    "curved-display": "شاشة منحنية",
    "exterior": "الخارجية",
    "interior": "الداخلية",
    "performance": "الأداء",
    "safety": "الأمان",
    "technology": "التقنية",
}

with open(AR_JSON, 'r', encoding='utf-8') as f:
    data = json.load(f)

features = data.setdefault('features', {})
added = 0
updated = 0
for k, v in FEATURES.items():
    if k not in features:
        features[k] = v
        added += 1
    elif features[k] != v:
        features[k] = v
        updated += 1

with open(AR_JSON, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Added {added} and updated {updated} feature translations in {AR_JSON}")
