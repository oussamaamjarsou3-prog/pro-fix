#!/usr/bin/env python3
"""
AutoMax -- Car Page Generator
Generates static HTML pages for each car from car-template.html
Output: html/[slug].html
"""

import json
import os
import re

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
TEMPLATE_PATH = os.path.join(BASE_DIR, 'system', 'templates', 'car-template.html')
OUTPUT_DIR = os.path.join(BASE_DIR, 'html')
DATA_DIR = os.path.join(BASE_DIR, 'system', 'data')
REGISTRY_PATH = os.path.join(BASE_DIR, 'system', 'registry', 'car-registry.json')
BRAND_REGISTRY_PATH = os.path.join(BASE_DIR, 'system', 'registry', 'brand-registry.json')

# Load registries
with open(REGISTRY_PATH, 'r', encoding='utf-8-sig') as f:
    car_registry = json.load(f)

with open(BRAND_REGISTRY_PATH, 'r', encoding='utf-8-sig') as f:
    brand_registry = json.load(f)

# Read template
with open(TEMPLATE_PATH, 'r', encoding='utf-8-sig') as f:
    template = f.read()

# Ensure output directory exists
os.makedirs(OUTPUT_DIR, exist_ok=True)

generated_count = 0

for car in car_registry.get('cars', []):
    if car.get('status') != 'active':
        continue

    brand = next((b for b in brand_registry.get('brands', []) if b['id'] == car['brandId']), None)
    if not brand:
        print(f"  ! Skipping {car['id']}: brand not found")
        continue

    # Load car data for SEO and names
    data_file = car.get('dataFile') or f"system/data/{car['id']}.json"
    car_data_path = os.path.join(BASE_DIR, data_file)
    car_data = None
    try:
        with open(car_data_path, 'r', encoding='utf-8-sig') as f:
            car_data = json.load(f)
    except Exception as e:
        print(f"  ! Could not load data for {car['id']} from {car_data_path}: {e}")

    page = template

    # Fix relative paths for html/ folder
    # In html/ folder: css is at ../css/, js is at ../js/, system is at ../system/, images at ../images/
    page = page.replace('../css/', '../css/')
    page = page.replace('../js/', '../js/')
    page = page.replace('../system/', '../system/')
    page = page.replace('../images/', '../images/')

    # Set car-specific data file path
    data_file_path = f"../system/data/{car['id']}.json"
    page = re.sub(r"const carDataFile = '[^']*';", f"const carDataFile = '{data_file_path}';", page)

    # SEO: title
    seo_title = car.get('seo', {}).get('title', f"{brand['name']} {car.get('basicInfo', {}).get('name', car['id'])} {car['modelYear']} - Review y Comparativa")
    # Replace both <title> tag and data-i18n title
    page = re.sub(r'<title[^>]*>[^<]*</title>', f'<title>{seo_title}</title>', page)

    # SEO: meta description
    seo_desc = car.get('seo', {}).get('description', f"{brand['name']} {car.get('basicInfo', {}).get('name', '')} review completa.")
    page = re.sub(
        r'<meta name="description"[^>]*content="[^"]*"',
        f'<meta name="description" content="{seo_desc}"',
        page
    )

    # SEO: canonical
    canonical_url = f"https://carspecio.com/{car['htmlFile']}"
    page = re.sub(
        r'href="" id="canonicalUrl"',
        f'href="{canonical_url}" id="canonicalUrl"',
        page
    )

    # OG tags
    page = re.sub(
        r'<meta property="og:title" content="[^"]*"',
        f'<meta property="og:title" content="{seo_title}"',
        page
    )
    page = re.sub(
        r'<meta property="og:description" content="[^"]*"',
        f'<meta property="og:description" content="{seo_desc}"',
        page
    )
    page = re.sub(
        r'<meta property="og:url" content="[^"]*"',
        f'<meta property="og:url" content="{canonical_url}"',
        page
    )

    # Hero image
    hero_image = car.get('images', {}).get('hero') or (car_data and car_data.get('images', {}).get('hero'))
    if hero_image:
        fixed_hero = f"..{hero_image}" if hero_image.startswith('/') else hero_image
        page = re.sub(
            r'style="background-image: url\(\'[^\']*\'\)"',
            f'style="background-image: url(\'{fixed_hero}\')"',
            page
        )

    # Default country
    default_country = 'ES'
    if car_data and car_data.get('countryPricing'):
        default_country = list(car_data['countryPricing'].keys())[0].upper()
    page = re.sub(r"applyCountry\('ES'\)", f"applyCountry('{default_country}')", page)

    # Write output
    output_path = os.path.join(OUTPUT_DIR, car['htmlFile'])
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(page)

    # Get car name from data or registry
    car_name = car.get('basicInfo', {}).get('name')
    if not car_name and car_data:
        car_name = car_data.get('basicInfo', {}).get('name') or car_data.get('basicInfo', {}).get('fullModelName')
    if not car_name:
        car_name = car['id']

    generated_count += 1
    print(f"  + {car['htmlFile']} -> {brand['name']} {car_name}")

print(f"\nDone! Generated {generated_count} car pages in {OUTPUT_DIR}")
