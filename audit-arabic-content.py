import json, os, re

latin_re = re.compile(r'[A-Za-zÀ-ÖØ-öø-ÿ]')
PLACEHOLDER_RE = re.compile(r'\{\{[^}]+\}\}|\{[^}]+\}')
URL_RE = re.compile(r'https?://\S+')
HTML_TAG_RE = re.compile(r'<[^>]+>')
# Keys that are internal config and not user-facing Arabic content
config_keys = {'language', 'direction', 'dateFormat'}
# Internal keys whose values are identifiers/paths/colors and not displayed Arabic text
internal_keys = {'id', 'icon', 'category', 'hex', 'image', 'carId', 'relation'}

out = []

def clean(text):
    text = PLACEHOLDER_RE.sub('', text)
    text = URL_RE.sub('', text)
    text = HTML_TAG_RE.sub('', text)
    return text

with open('c:/Users/oussa/Desktop/pro-fix/system/locales/ar.json', 'r', encoding='utf8') as f:
    locale = json.load(f)

def walk_locale(prefix, obj):
    if isinstance(obj, str):
        if latin_re.search(clean(obj)) and prefix.split('.')[-1] not in config_keys:
            out.append(f'locale:{prefix}: {obj[:120]}')
    elif isinstance(obj, dict):
        for k, v in obj.items():
            walk_locale(f'{prefix}.{k}', v)
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            walk_locale(f'{prefix}[{i}]', v)

walk_locale('ar', locale)

def check_arabic_fields(prefix, obj):
    if isinstance(obj, dict):
        for k, v in obj.items():
            if k == 'pageText':
                continue
            if k in internal_keys:
                continue
            if isinstance(v, str) and k.endswith('Ar') and latin_re.search(clean(v)):
                out.append(f'{fname}:{prefix}.{k}: {v[:120]}')
            else:
                check_arabic_fields(f'{prefix}.{k}', v)
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            check_arabic_fields(f'{prefix}[{i}]', v)

for fname in sorted(os.listdir('c:/Users/oussa/Desktop/pro-fix/system/data')):
    if not fname.endswith('.json'): continue
    with open(f'c:/Users/oussa/Desktop/pro-fix/system/data/{fname}', 'r', encoding='utf8') as f:
        data = json.load(f)
    check_arabic_fields(fname, data)
    pt = data.get('pageText', {}).get('ar', {})
    def walk(prefix, obj):
        if isinstance(obj, str):
            if latin_re.search(clean(obj)):
                out.append(f'{fname}:{prefix}: {obj[:120]}')
        elif isinstance(obj, dict):
            for k, v in obj.items():
                if k in internal_keys:
                    continue
                walk(f'{prefix}.{k}', v)
        elif isinstance(obj, list):
            for i, v in enumerate(obj):
                walk(f'{prefix}[{i}]', v)
    walk('pageText.ar', pt)
    # Check Arabic branches of all multilingual sections
    MULTILINGUAL_SECTIONS = {
        'review', 'drivingExperience', 'exteriorDesign', 'interior', 'technology',
        'interiorCards', 'interiorText', 'tires', 'safety', 'ownership', 'runningCosts',
        'problems', 'ownerReviews', 'profileData', 'usedGuide', 'countryPricing', 'options'
    }
    for section in MULTILINGUAL_SECTIONS:
        if section not in data: continue
        ar = data[section]
        if not (isinstance(ar, dict) and 'ar' in ar and set(ar.keys()) <= {'es', 'en', 'fr', 'ar'}):
            continue
        ar = ar['ar']
        if ar is None: continue
        walk(f'{section}.ar', ar)

with open('c:/Users/oussa/Desktop/pro-fix/audit-arabic-content.txt', 'w', encoding='utf8') as f:
    f.write('\n'.join(out))
print(f'Done. {len(out)} Latin snippets remain in Arabic content.')
