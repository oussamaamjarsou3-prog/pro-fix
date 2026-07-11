import json

REGISTRY = 'c:/Users/oussa/Desktop/pro-fix/system/registry/country-registry.json'

REGION_AR = {
    'california': 'كاليفورنيا',
    'texas': 'تكساس',
    'florida': 'فلوريدا',
    'new-york': 'نيويورك',
    'illinois': 'إلينوي',
    'england': 'إنجلترا',
    'scotland': 'اسكتلندا',
    'wales': 'ويلز',
    'northern-ireland': 'أيرلندا الشمالية',
    'madrid': 'مدريد',
    'catalonia': 'كاتالونيا',
    'basque': 'إقليم الباسك',
    'andalusia': 'أندلوسيا',
    'valencia': 'منطقة بلنسية',
    'bavaria': 'بافاريا',
    'nrw': 'شمال الراين-وستفاليا',
    'berlin': 'برلين',
    'baden-wurttemberg': 'بادن-فورتمبيرغ',
    'hamburg': 'هامبورغ',
    'ile-de-france': 'إيل دو فرانس',
    'provence': 'بروفانس-ألب-كوت دازور',
    'auvergne': 'أوفرن-رون-ألب',
    'nouvelle-aquitaine': 'نيوفيل-أكيتين',
    'occitanie': 'أوكسيتانيا',
    'lombardy': 'لومبارديا',
    'lazio': 'لاتسيو',
    'piedmont': 'بييمونتي',
    'veneto': 'فينيتو',
    'emilia-romagna': 'إميليا-رومانيا',
    'casablanca': 'الدار البيضاء',
    'rabat': 'الرباط',
    'marrakech': 'مراكش',
    'fes': 'فاس',
    'tangier': 'طنجة',
    'riyadh': 'الرياض',
    'jeddah': 'جدة',
    'dammam': 'الدمام',
    'mecca': 'مكة',
    'medina': 'المدينة',
    'dubai': 'دبي',
    'abu-dhabi': 'أبو ظبي',
    'sharjah': 'الشارقة',
    'ajman': 'عجمان',
    'ras-al-khaimah': 'رأس الخيمة',
}

COUNTRY_AR = {
    'es': 'إسبانيا',
    'de': 'ألمانيا',
    'fr': 'فرنسا',
    'it': 'إيطاليا',
    'gb': 'المملكة المتحدة',
    'us': 'الولايات المتحدة',
    'ma': 'المغرب',
    'sa': 'السعودية',
    'ae': 'الإمارات',
}

with open(REGISTRY, 'r', encoding='utf-8') as f:
    data = json.load(f)

for country in data['countries']:
    code = country['id']
    if code in COUNTRY_AR and not country.get('nameAr'):
        country['nameAr'] = COUNTRY_AR[code]
    for region in country.get('regions', []):
        rid = region['id']
        if rid in REGION_AR and not region.get('nameAr'):
            region['nameAr'] = REGION_AR[rid]

with open(REGISTRY, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print('Added Arabic country/region names to country registry.')
