# AutoMax — Country Data Generator (PowerShell)
# Generates country pricing data for car data files from country registry

Write-Host "Generating country pricing data for cars..." -ForegroundColor Yellow

# Load country registry
$countryRegistryPath = Join-Path $PSScriptRoot "..\registry\country-registry.json"
$countryRegistry = Get-Content $countryRegistryPath -Raw | ConvertFrom-Json

# Load car registry
$carRegistryPath = Join-Path $PSScriptRoot "..\registry\car-registry.json"
$carRegistry = Get-Content $carRegistryPath -Raw | ConvertFrom-Json

# Base pricing template (adjust per car)
$basePricing = @{
    es = @{ priceNew = 148000; pricePerformance = 168000; priceCarbon = 185000 }
    de = @{ priceNew = 148000; pricePerformance = 168000; priceCarbon = 185000 }
    fr = @{ priceNew = 148000; pricePerformance = 168000; priceCarbon = 185000 }
    it = @{ priceNew = 148000; pricePerformance = 168000; priceCarbon = 185000 }
    gb = @{ priceNew = 125000; pricePerformance = 142000; priceCarbon = 156000 }
    us = @{ priceNew = 135000; pricePerformance = 153000; priceCarbon = 169000 }
    ma = @{ priceNew = 1600000; pricePerformance = 1810000; priceCarbon = 2000000 }
    sa = @{ priceNew = 580000; pricePerformance = 657000; priceCarbon = 725000 }
    ae = @{ priceNew = 570000; pricePerformance = 646000; priceCarbon = 713000 }
}

# Generate country pricing for a car
function Generate-CountryPricing {
    param($carId, $carPricing = $null)
    
    if (-not $carPricing) { $carPricing = @{} }
    
    $countryPricing = @{}
    
    foreach ($country in $countryRegistry.countries) {
        $base = $basePricing[$country.id]
        if (-not $base) { $base = $basePricing.es }
        
        $custom = if ($carPricing[$country.id]) { $carPricing[$country.id] } else { @{} }
        
        # Calculate depreciation
        $dep3 = [math]::Round($base.priceNew * 0.68)
        $dep5 = [math]::Round($base.priceNew * 0.54)
        
        # Calculate annual depreciation
        $depAnnualNew = [math]::Round(($base.priceNew - $dep3) / 3)
        $depAnnualUsed3 = [math]::Round(($dep3 - $dep5) / 2)
        $depAnnualUsed5 = [math]::Round($dep5 / 5)
        
        $countryPricing[$country.id] = @{
            flag = $country.flag
            name = $country.name
            currency = $country.currency
            locale = $country.locale
            fuelMetric = $country.fuelMetric
            fuelMin = if ($country.fuelMetric) { 130 } else { 15 }
            fuelMax = if ($country.fuelMetric) { 230 } else { 25 }
            fuelStep = if ($country.fuelMetric) { 5 } else { 1 }
            fuelDefault = if ($country.fuelMetric) { 178 } else { 20 }
            priceNew = if ($custom.priceNew) { $custom.priceNew } else { $base.priceNew }
            pricePerformance = if ($custom.pricePerformance) { $custom.pricePerformance } else { $base.pricePerformance }
            priceCarbon = if ($custom.priceCarbon) { $custom.priceCarbon } else { $base.priceCarbon }
            dep3 = if ($custom.dep3) { $custom.dep3 } else { $dep3 }
            dep5 = if ($custom.dep5) { $custom.dep5 } else { $dep5 }
            insurance = if ($custom.insurance) { $custom.insurance } else { $country.insuranceBase }
            inspection = if ($custom.inspection) { $custom.inspection } else { $country.inspection }
            maintenance = if ($custom.maintenance) { $custom.maintenance } else { $country.maintenanceBase }
            tyres = if ($custom.tyres) { $custom.tyres } else { $country.tyresBase }
            oilChange = if ($custom.oilChange) { $custom.oilChange } else { $country.oilChangeBase }
            depAnnual = @{
                new = if ($custom.depAnnualNew) { $custom.depAnnualNew } else { $depAnnualNew }
                used3 = if ($custom.depAnnualUsed3) { $custom.depAnnualUsed3 } else { $depAnnualUsed3 }
                used5 = if ($custom.depAnnualUsed5) { $custom.depAnnualUsed5 } else { $depAnnualUsed5 }
            }
            rivalM5 = if ($custom.rivalM5) { $custom.rivalM5 } else { [math]::Round($base.priceNew * 0.175) }
            rivalAmg = if ($custom.rivalAmg) { $custom.rivalAmg } else { [math]::Round($base.priceNew * 0.19) }
            used3Range = if ($custom.used3Range) { $custom.used3Range } else { "$([math]::Round($dep3 * 0.95)) - $([math]::Round($dep3 * 1.05)) $($country.currency)" }
            used5Range = if ($custom.used5Range) { $custom.used5Range } else { "$([math]::Round($dep5 * 0.95)) - $([math]::Round($dep5 * 1.05)) $($country.currency)" }
            options = if ($custom.options) { $custom.options } else { @( [math]::Round($base.priceNew * 0.031), [math]::Round($base.priceNew * 0.0074), [math]::Round($base.priceNew * 0.062), [math]::Round($base.priceNew * 0.0155), [math]::Round($base.priceNew * 0.023), 0, [math]::Round($base.priceNew * 0.041), [math]::Round($base.priceNew * 0.012) ) }
            fiscalHead = Get-FiscalHeader $country.id
            fiscalRows = Get-FiscalRows $country $base.priceNew
        }
    }
    
    return $countryPricing
}

# Get fiscal header
function Get-FiscalHeader {
    param($countryId)
    
    $headers = @{
        es = @("Región", "Impuesto matriculación", "ITV", "Precio final")
        de = @("Bundesland", "Kfz-Steuer/Jahr", "Zulassung", "Endpreis")
        fr = @("Région", "Malus CO₂", "Carte grise", "Prix final")
        it = @("Regione", "Imposta immatricolazione", "Bollo", "Prezzo finale")
        gb = @("Region", "Road Tax", "MOT", "Final Price")
        us = @("State", "Sales Tax", "Registration", "Final Price")
        ma = @("Region", "Registration Tax", "Inspection", "Final Price")
        sa = @("Region", "Registration Tax", "Inspection", "Final Price")
        ae = @("Region", "Registration Tax", "Inspection", "Final Price")
    }
    
    if ($headers[$countryId]) {
        return $headers[$countryId]
    } else {
        return $headers.es
    }
}

# Get fiscal rows
function Get-FiscalRows {
    param($country, $price)
    
    $rows = @()
    foreach ($region in $country.regions) {
        $tax = $country.taxRate * 100
        $registrationFee = $region.registrationFee
        $finalPrice = [math]::Round($price * (1 + $country.registrationTax) + $registrationFee)
        
        $taxStr = if ($country.id -eq "us") { "$("{0:N2}" -f $tax)%" } else { "~$("{0:N0}" -f $tax)%" }
        
        $rows += ,@($region.name, $taxStr, "$registrationFee $($country.currency)", $finalPrice)
    }
    
    return $rows
}

# Update car data files
foreach ($car in $carRegistry.cars) {
    $dataPath = Join-Path $PSScriptRoot "..\..\$($car.dataFile)"
    
    if (-not (Test-Path $dataPath)) {
        Write-Host "WARNING: Car data file not found: $($car.dataFile)" -ForegroundColor Yellow
        continue
    }
    
    $carData = Get-Content $dataPath -Raw | ConvertFrom-Json
    
    # Generate country pricing
    $countryPricing = Generate-CountryPricing $car.id ($carData.countryPricing)
    
    # Add or update country pricing
    $carData | Add-Member -MemberType NoteProperty -Name "countryPricing" -Value $countryPricing -Force
    
    # Write back to file with UTF8 BOM for proper Unicode support
    $jsonOutput = $carData | ConvertTo-Json -Depth 20
    $utf8WithBom = New-Object System.Text.UTF8Encoding $true
    [System.IO.File]::WriteAllLines($dataPath, $jsonOutput, $utf8WithBom)
    
    Write-Host "Updated $($car.id) with country pricing data" -ForegroundColor Green
}

Write-Host "`nCountry pricing data generated successfully!" -ForegroundColor Green
Write-Host "Updated $($carRegistry.cars.length) car data files" -ForegroundColor Cyan
