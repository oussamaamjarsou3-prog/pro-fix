# AutoMax — Country Data Frontend Generator (PowerShell)
# Generates country-data.js for frontend use

Write-Host "Generating country-data.js for frontend..." -ForegroundColor Yellow

# Load country registry
$countryRegistryPath = Join-Path $PSScriptRoot "..\registry\country-registry.json"
$countryRegistry = Get-Content $countryRegistryPath -Raw | ConvertFrom-Json

# Generate country data for frontend
$countryData = @{}

foreach ($country in $countryRegistry.countries) {
    $countryData[$country.id] = @{
        flag = $country.flag
        name = $country.name
        currency = $country.currency
        locale = $country.locale
        fuelMetric = $country.fuelMetric
        regions = $country.regions | ForEach-Object {
            @{
                id = $_.id
                name = $_.name
                taxMultiplier = $_.taxMultiplier
                registrationFee = $_.registrationFee
            }
        }
    }
}

# Generate output file
$output = @"
/**
 * AutoMax — Country Data
 * AUTO-GENERATED from country registry
 * DO NOT EDIT MANUALLY - Use system/build.ps1
 */

window.AUTOMAX_COUNTRIES = $($countryData | ConvertTo-Json -Depth 10);

// Get country data by ID
window.getCountryData = function(countryId) {
    return window.AUTOMAX_COUNTRIES[countryId] || null;
};

// Get all countries
window.getAllCountries = function() {
    return Object.keys(window.AUTOMAX_COUNTRIES).map(id => ({
        id: id,
        ...window.AUTOMAX_COUNTRIES[id]
    }));
};

// Get regions for a country
window.getCountryRegions = function(countryId) {
    const country = window.AUTOMAX_COUNTRIES[countryId];
    return country ? country.regions : [];
};
"@

$outputPath = Join-Path $PSScriptRoot "..\..\js\country-data.js"
$output | Out-File -FilePath $outputPath -Encoding UTF8

Write-Host "country-data.js generated successfully" -ForegroundColor Green
Write-Host "Output: $outputPath" -ForegroundColor Cyan
