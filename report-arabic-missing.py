import json, os

DATA_DIR = 'c:/Users/oussa/Desktop/pro-fix/system/data'
LOCALE_PATH = 'c:/Users/oussa/Desktop/pro-fix/system/locales/ar.json'

LANGS = ['es', 'en', 'fr', 'ar']

# Sections expected to be multilingual (from renderer logic)
MULTI_SECTIONS = [
    'review', 'drivingExperience', 'exteriorDesign', 'interior', 'technology',
    'interiorText', 'tires', 'safety', 'ownership', 'runningCosts', 'problems',
    'interiorCards', 'countryPricing', 'options', 'pageText', 'ownerReviews',
    'profileData', 'usedGuide'
]

out = []

with open(LOCALE_PATH, 'r', encoding='utf8') as f:
    locale = json.load(f)

# Collect all feature keys used in car data and check ar.json
used_features = set()
for fname in sorted(os.listdir(DATA_DIR)):
    if not fname.endswith('.json'): continue
    with open(f'{DATA_DIR}/{fname}', 'r', encoding='utf8') as f:
        data = json.load(f)
    # features list at top level
    for k in data.get('features', []):
        used_features.add(k)
    # options.features
    opts = data.get('options', {})
    if isinstance(opts, dict):
        for k in opts.get('features', []):
            used_features.add(k)
    # versions.features
    for v in data.get('versions', []):
        if isinstance(v, dict):
            for f in v.get('features', []):
                used_features.add(f)
    # comparisons.features
    for c in data.get('comparisons', []):
        if isinstance(c, dict):
            for f in c.get('features', []):
                used_features.add(f)

locale_features = set(locale.get('features', {}).keys())
missing_features = sorted(used_features - locale_features)
out.append('=== Missing feature translations in ar.json ===')
out.extend(missing_features)
out.append('')

# Per-car missing Arabic translations
for fname in sorted(os.listdir(DATA_DIR)):
    if not fname.endswith('.json'): continue
    with open(f'{DATA_DIR}/{fname}', 'r', encoding='utf8') as f:
        data = json.load(f)
    car = fname.replace('.json', '')
    out.append(f'=== {car} ===')
    for section in MULTI_SECTIONS:
        if section not in data:
            continue
        val = data[section]
        if isinstance(val, dict):
            langs = [l for l in LANGS if l in val and val[l] is not None]
            if 'ar' not in langs:
                out.append(f'  {section}: missing ar (has {langs})')
        elif isinstance(val, list):
            # list of multilingual objects? e.g. versions, comparisons
            pass
        else:
            pass
    # Arabic fields existence
    arabic_fields = [
        ('basicInfo.nameAr', data.get('basicInfo', {}).get('nameAr')),
        ('basicInfo.fullModelNameAr', data.get('basicInfo', {}).get('fullModelNameAr')),
        ('basicInfo.badgeAr', data.get('basicInfo', {}).get('badgeAr')),
        ('basicInfo.taglineAr', data.get('basicInfo', {}).get('taglineAr')),
        ('specs.engine.typeAr', data.get('specs', {}).get('engine', {}).get('typeAr')),
        ('specs.drivetrainAr', data.get('specs', {}).get('drivetrainAr')),
        ('specs.transmission.typeAr', data.get('specs', {}).get('transmission', {}).get('typeAr')),
    ]
    for path, v in arabic_fields:
        if not v:
            out.append(f'  missing {path}')
    # versions/comparisons Arabic names
    for i, v in enumerate(data.get('versions', [])):
        if isinstance(v, dict) and not v.get('nameAr'):
            out.append(f'  versions[{i}].nameAr missing')
    for i, c in enumerate(data.get('comparisons', [])):
        if isinstance(c, dict):
            if not c.get('nameAr'):
                out.append(f'  comparisons[{i}].nameAr missing')
            if not c.get('fullNameAr'):
                out.append(f'  comparisons[{i}].fullNameAr missing')
    out.append('')

with open('c:/Users/oussa/Desktop/pro-fix/report-arabic-missing.txt', 'w', encoding='utf8') as f:
    f.write('\n'.join(out))
print('Report written to report-arabic-missing.txt')
print(f'Missing features: {len(missing_features)}')
