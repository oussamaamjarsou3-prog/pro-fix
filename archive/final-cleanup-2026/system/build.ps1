# CarSpecio — Build Script (PowerShell)
# Alternative to Node.js build system
# This script manually generates the output files from registries

Write-Host "Starting CarSpecio build process (PowerShell)..." -ForegroundColor Green

# Load registries
$registryPath = $PSScriptRoot
$carRegistryPath = Join-Path $registryPath "registry\car-registry.json"
$brandRegistryPath = Join-Path $registryPath "registry\brand-registry.json"
$categoryRegistryPath = Join-Path $registryPath "registry\category-registry.json"

if (-not (Test-Path $carRegistryPath)) {
    Write-Host "ERROR: Car registry not found: $carRegistryPath" -ForegroundColor Red
    exit 1
}

$carRegistry = Get-Content $carRegistryPath -Raw | ConvertFrom-Json
$brandRegistry = Get-Content $brandRegistryPath -Raw | ConvertFrom-Json
$categoryRegistry = Get-Content $categoryRegistryPath -Raw | ConvertFrom-Json

Write-Host "Registries loaded successfully" -ForegroundColor Green

# Generate country pricing data for cars
Write-Host "Generating country pricing data..." -ForegroundColor Yellow

$countryDataGeneratorPath = Join-Path $PSScriptRoot "generators\country-data-generator.ps1"
if (Test-Path $countryDataGeneratorPath) {
    & $countryDataGeneratorPath
} else {
    Write-Host "WARNING: Country data generator not found" -ForegroundColor Yellow
}

# Generate country data for frontend
Write-Host "Generating country-data.js for frontend..." -ForegroundColor Yellow

$countryDataFrontendGeneratorPath = Join-Path $PSScriptRoot "generators\country-data-frontend-generator.ps1"
if (Test-Path $countryDataFrontendGeneratorPath) {
    & $countryDataFrontendGeneratorPath
} else {
    Write-Host "WARNING: Country data frontend generator not found" -ForegroundColor Yellow
}

# Generate mega-menu-data.js
Write-Host "Generating mega-menu-data.js..." -ForegroundColor Yellow

$modelPageMap = @{}
$brandLogoMap = @{}
$categoryIconMap = @{}
$brandModels = @{}

# Generate modelPageMap
foreach ($car in $carRegistry.cars) {
    $brand = $brandRegistry.brands | Where-Object { $_.id -eq $car.brandId }
    if ($brand) {
        $carName = "$($brand.name) $($car.basicInfo.name)"
        $modelPageMap[$carName] = $car.htmlFile
        if ($car.basicInfo.fullModelName) {
            $modelPageMap[$car.basicInfo.fullModelName] = $car.htmlFile
        }
    }
}

# Generate brandLogoMap
foreach ($brand in $brandRegistry.brands) {
    $brandLogoMap[$brand.name] = $brand.logo
}

# Generate categoryIconMap
foreach ($category in $categoryRegistry.categories) {
    $categoryIconMap[$category.id] = $category.icon
}

# Generate brandModels
foreach ($brand in $brandRegistry.brands) {
    $brandModels[$brand.name] = @{}
    foreach ($categoryId in $brand.categories) {
        $category = $categoryRegistry.categories | Where-Object { $_.id -eq $categoryId }
        if ($category) {
            $cars = $carRegistry.cars | Where-Object { $_.brandId -eq $brand.id -and $_.categoryId -eq $categoryId }
            if ($cars.Count -gt 0) {
                $carNames = @()
                foreach ($car in $cars) {
                    $b = $brandRegistry.brands | Where-Object { $_.id -eq $car.brandId }
                    if ($b) {
                        $carNames += "$($b.name) $($car.basicInfo.name)"
                    }
                }
                $brandModels[$brand.name][$categoryId] = $carNames
            } else {
                $brandModels[$brand.name][$categoryId] = @()
            }
        }
    }
}

# Convert to JSON
$modelPageMapJson = $modelPageMap | ConvertTo-Json -Depth 10
$brandLogoMapJson = $brandLogoMap | ConvertTo-Json -Depth 10
$categoryIconMapJson = $categoryIconMap | ConvertTo-Json -Depth 10
$brandModelsJson = $brandModels | ConvertTo-Json -Depth 10

# Generate output file
$output = @"
/**
 * AutoMax — Mega Menu Brand/Category/Model Data
 * AUTO-GENERATED from central registries
 * DO NOT EDIT MANUALLY - Use system/build.ps1
 */

/* ── Page links per known model ─────────────────────────── */
const modelPageMap = $modelPageMapJson;

/* ── Brand logo map (SimpleIcons CDN) ───────────────────── */
const brandLogoMap = $brandLogoMapJson;

/* ── Category icon map ──────────────────────────────────── */
const categoryIconMap = $categoryIconMapJson;

/* ── Brand models data ──────────────────────────────────── */
const brandModels = $brandModelsJson;
"@

$outputPath = Join-Path $PSScriptRoot "..\js\mega-menu-data.js"
$output | Out-File -FilePath $outputPath -Encoding UTF8

Write-Host "mega-menu-data.js generated successfully" -ForegroundColor Green

# Generate compare-data.js
Write-Host "Generating compare-data.js..." -ForegroundColor Yellow

$CARSPECIO_COMPARE_CARS = @{}

foreach ($car in $carRegistry.cars) {
    $brand = $brandRegistry.brands | Where-Object { $_.id -eq $car.brandId }
    $category = $categoryRegistry.categories | Where-Object { $_.id -eq $car.categoryId }
    
    if ($brand -and $category) {
        $carData = Get-Content (Join-Path $PSScriptRoot "..\$($car.dataFile)") -Raw | ConvertFrom-Json
        
        $fuelConsumption = 10
        if ($carData.fuelEconomy.petrol.combined) {
            $fuelConsumption = $carData.fuelEconomy.petrol.combined.value
        }
        
        $trunk = 400
        if ($carData.dimensions.cargo) {
            $trunk = $carData.dimensions.cargo.value
        }
        
        $seating = 4
        if ($car.seats) {
            $seating = $car.seats
        }
        
        $drive = "AWD"
        if ($car.drivetrain) {
            $drive = $car.drivetrain.ToUpper()
        }
        
        $carName = "$($brand.name) $($car.basicInfo.name)"
        
        $CARSPECIO_COMPARE_CARS[$carName] = @{
            category = $category.id
            brand = $brand.name
            image = $carData.images.hero
            link = $car.htmlFile
            power = "$($carData.performance.power.value) HP"
            powerNum = $carData.performance.power.value
            torque = "$($carData.performance.torque.value) Nm"
            torqueNum = $carData.performance.torque.value
            zero = "$($carData.performance.acceleration.'0-100')s"
            zeroNum = $carData.performance.acceleration.'0-100'
            speed = "$($carData.performance.topSpeed.value) km/h"
            speedNum = $carData.performance.topSpeed.value
            price = "€$($carData.pricing.current.value)"
            priceNum = $carData.pricing.current.value
            consumption = "$fuelConsumption L/100km"
            consumptionNum = $fuelConsumption
            trunk = "$trunk L"
            trunkNum = $trunk
            co2 = "$($carData.fuelEconomy.petrol.co2.value) g/km"
            co2Num = $carData.fuelEconomy.petrol.co2.value
            insurance = "€$($carData.pricing.insurance.annual)"
            insuranceNum = $carData.pricing.insurance.annual
            maintenance = "€2,000"
            maintenanceNum = 2000
            annualCost = "€5,000"
            annualCostNum = 5000
            reliability = "8/10"
            reliabilityNum = 8
            pros = $carData.content.pros
            cons = $carData.content.cons
            buy = if ($carData.content.pros) { $carData.content.pros[0..2] } else { @() }
            drivetrain = $drive
            seats = $seating.ToString()
            bestFor = if ($category.id -eq "deportivos") { "Rendimiento y lujo" } else { "Uso diario" }
            itv = "€60"
        }
    }
}

$CARSPECIO_COMPARE_PRESETS = @(
    @{ car1 = "Audi RS7"; car2 = "BMW M5"; label = "Lujo vs deportividad" },
    @{ car1 = "BMW M5"; car2 = "Audi RS7"; label = "Berlina vs berlina" },
    @{ car1 = "Porsche 911 Turbo S"; car2 = "Mercedes-AMG GT"; label = "Icono vs GT" },
    @{ car1 = "Nissan GT-R"; car2 = "Porsche 911"; label = "Value vs prestige" },
    @{ car1 = "BMW M5"; car2 = "Mercedes-AMG GT"; label = "Rivales alemanas" }
)

$compareCarsJson = $CARSPECIO_COMPARE_CARS | ConvertTo-Json -Depth 10
$comparePresetsJson = $CARSPECIO_COMPARE_PRESETS | ConvertTo-Json -Depth 10

$compareOutput = @"
/* CarSpecio — datos de coches para comparativas */
/* AUTO-GENERATED from car data files */
/* DO NOT EDIT MANUALLY - Use system/build.ps1 */

window.CARSPECIO_COMPARE_CARS = $compareCarsJson;

window.CARSPECIO_COMPARE_PRESETS = $comparePresetsJson;

// Backward-compatible aliases
window.AUTOMAX_COMPARE_CARS = window.CARSPECIO_COMPARE_CARS;
window.AUTOMAX_COMPARE_PRESETS = window.CARSPECIO_COMPARE_PRESETS;
"@

$compareOutputPath = Join-Path $PSScriptRoot "..\js\compare-data.js"
$compareOutput | Out-File -FilePath $compareOutputPath -Encoding UTF8

Write-Host "compare-data.js generated successfully" -ForegroundColor Green

# Load guide registry for search index and sitemap
$guideRegistryPath = Join-Path $PSScriptRoot "registry\guide-registry.json"
$guideRegistry = Get-Content $guideRegistryPath -Raw | ConvertFrom-Json

# Generate search-index.js
Write-Host "Generating search-index.js..." -ForegroundColor Yellow

$searchIndex = @()

foreach ($car in $carRegistry.cars) {
    $brand = $brandRegistry.brands | Where-Object { $_.id -eq $car.brandId }
    $category = $categoryRegistry.categories | Where-Object { $_.id -eq $car.categoryId }
    
    if ($brand -and $category) {
        $carName = if ($car.basicInfo.name) { $car.basicInfo.name.ToLower() } else { "" }
        $carFullName = if ($car.basicInfo.fullModelName) { $car.basicInfo.fullModelName.ToLower() } else { "" }
        $brandName = if ($brand.name) { $brand.name.ToLower() } else { "" }
        $categoryName = if ($category.name) { $category.name.ToLower() } else { "" }
        $carSlug = if ($car.slug) { $car.slug.ToLower() } else { "" }
        
        $searchIndex += @{
            id = $car.id
            name = $car.basicInfo.name
            fullName = $car.basicInfo.fullModelName
            brand = $brand.name
            brandId = $car.brandId
            category = $category.name
            categoryId = $car.categoryId
            slug = $car.slug
            year = $car.modelYear
            url = $car.htmlFile
            image = $car.images.hero
            price = $car.pricing.current.value
            power = $car.performance.power.value
            keywords = @(
                $carName,
                $carFullName,
                $brandName,
                $categoryName,
                $carSlug
            )
            description = $car.basicInfo.description
        }
    }
}

# Add guides to search index
foreach ($guide in $guideRegistry.guides) {
    if ($guide.status -eq "active") {
        $guideData = Get-Content (Join-Path $PSScriptRoot "..\$($guide.dataFile)") -Raw | ConvertFrom-Json
        $content = $guideData.content.es
        $seo = $content.seo
        $keywords = @(
            ($content.title).ToLower(),
            ($guide.slug).ToLower(),
            ($guide.categoryId).ToLower()
        )
        if ($seo.keywords) {
            $keywords += $seo.keywords | ForEach-Object { $_.ToLower() }
        }
        if ($guideData.tags) {
            $keywords += $guideData.tags | ForEach-Object { $_.ToLower() }
        }
        $searchIndex += @{
            id = $guide.id
            type = "guide"
            name = $content.title
            slug = $guide.slug
            category = $guide.categoryId
            url = $guide.htmlFile
            image = $guideData.heroImage
            keywords = $keywords
            description = $content.excerpt
            tags = $guideData.tags
        }
    }
}

$searchIndexJson = $searchIndex | ConvertTo-Json -Depth 10

$searchOutput = @"
/**
 * CarSpecio — Search Index
 * AUTO-GENERATED from car and guide registries
 * DO NOT EDIT MANUALLY - Use system/build.ps1
 */

window.CARSPECIO_SEARCH_INDEX = $searchIndexJson;

window.CARSPECIO_SEARCH = {
    index: window.CARSPECIO_SEARCH_INDEX,

    search: function(query) {
        if (!query || query.length < 2) return [];
        const lowerQuery = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return window.CARSPECIO_SEARCH_INDEX.filter(item => {
            const text = (item.name + ' ' + item.description + ' ' + (item.category || '')).toLowerCase();
            return item.keywords.some(keyword => keyword.normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(lowerQuery)) ||
                   text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(lowerQuery);
        }).slice(0, 10);
    },

    getUrl: function(item) {
        if (item.type === 'guide') {
            return 'guias/' + item.url;
        }
        return item.url;
    }
};

// Backward-compatible alias
window.searchCars = window.CARSPECIO_SEARCH.search;
"@

$searchOutputPath = Join-Path $PSScriptRoot "..\js\search-index.js"
$searchOutput | Out-File -FilePath $searchOutputPath -Encoding UTF8

Write-Host "search-index.js generated successfully" -ForegroundColor Green

# Generate sitemap.xml
Write-Host "Generating sitemap.xml..." -ForegroundColor Yellow

$BASE_URL = "https://carspecio.com"
$sitemapEntries = @()

# Add homepage
$sitemapEntries += @{
    loc = "$BASE_URL/"
    lastmod = (Get-Date).ToString("o")
    changefreq = "daily"
    priority = 1.0
}

# Add main pages
$mainPages = @(
    @{ path = "/compare.html"; priority = 0.9; changefreq = "daily" },
    @{ path = "/reviews.html"; priority = 0.8; changefreq = "daily" },
    @{ path = "/herramientas.html"; priority = 0.7; changefreq = "weekly" },
    @{ path = "/contacto.html"; priority = 0.5; changefreq = "monthly" },
    @{ path = "/guias/index.html"; priority = 0.8; changefreq = "weekly" }
)

foreach ($page in $mainPages) {
    $sitemapEntries += @{
        loc = "$BASE_URL$($page.path)"
        lastmod = (Get-Date).ToString("o")
        changefreq = $page.changefreq
        priority = $page.priority
    }
}

# Add car pages
foreach ($car in $carRegistry.cars) {
    if ($car.status -eq "active") {
        $sitemapEntries += @{
            loc = "$BASE_URL/$($car.htmlFile)"
            lastmod = (Get-Date).ToString("o")
            changefreq = "weekly"
            priority = 0.8
        }
    }
}

# Add guide pages
foreach ($guide in $guideRegistry.guides) {
    if ($guide.status -eq "active") {
        $sitemapEntries += @{
            loc = "$BASE_URL/$($guide.htmlFile)"
            lastmod = (Get-Date).ToString("o")
            changefreq = "weekly"
            priority = 0.7
        }
    }
}

# Generate XML
$xml = '<?xml version="1.0" encoding="UTF-8"?>' + "`n"
$xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + "`n"

foreach ($entry in $sitemapEntries) {
    $xml += '  <url>' + "`n"
    $xml += "    <loc>$($entry.loc)</loc>`n"
    $xml += "    <lastmod>$($entry.lastmod)</lastmod>`n"
    $xml += "    <changefreq>$($entry.changefreq)</changefreq>`n"
    $xml += "    <priority>$($entry.priority)</priority>`n"
    $xml += '  </url>' + "`n"
}

$xml += '</urlset>'

$sitemapPath = Join-Path $PSScriptRoot "..\sitemap.xml"
$xml | Out-File -FilePath $sitemapPath -Encoding UTF8

Write-Host "sitemap.xml generated successfully" -ForegroundColor Green

# Summary
Write-Host "`nBuild completed successfully!`n" -ForegroundColor Green
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "   - Cars: $($carRegistry.cars.length)" -ForegroundColor White
Write-Host "   - Brands: $($brandRegistry.brands.length)" -ForegroundColor White
Write-Host "   - Categories: $($categoryRegistry.categories.length)" -ForegroundColor White
Write-Host "   - Guides: $($guideRegistry.guides.length)" -ForegroundColor White
Write-Host "   - Output files updated" -ForegroundColor White
Write-Host "`nCarSpecio is ready!" -ForegroundColor Green
