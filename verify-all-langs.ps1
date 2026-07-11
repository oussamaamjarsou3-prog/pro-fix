$cars = @('nissan-gtr','mercedes-amg-gt','rs7','rs3','bmw-m5','bmw-520d','porsche-911','model-s-plaid')
$langs = @(
    @{code='es';country='es';marker='Especificaciones'},
    @{code='en';country='us';marker='Specs'},
    @{code='fr';country='fr';marker='Fiche'},
    @{code='ar';country='ma';marker='ARABIC_REGEX'}
)
$allOk = $true
foreach ($car in $cars) {
  foreach ($l in $langs) {
    $url = "http://localhost:3000/$car.html?nocache=$($l.code)120"
    agent-browser open $url --hard-reload 2>&1 | Out-Null
    Start-Sleep -Milliseconds 500
    agent-browser eval "localStorage.setItem('carspecio-lang','$($l.code)'); localStorage.setItem('carspecio-country','$($l.country)'); window.location.reload(true);" 2>&1 | Out-Null
    Start-Sleep -Milliseconds 2500
    $markerExpr = if ($l.marker -eq 'ARABIC_REGEX') { "const markerFound=/[\\u0600-\\u06FF]/.test(text);" } else { "const markerFound=text.includes('$($l.marker)');" }
    $raw = agent-browser eval "(function(){const text=document.body.innerText; const htmlLang=document.documentElement.lang; const objCount=(text.split('[object Object]').length-1); $markerExpr return JSON.stringify({htmlLang:htmlLang, objCount:objCount, markerFound:markerFound});})()" 2>&1 | Out-String
    # agent-browser returns quoted JSON like '"{...}"'; extract the last quoted JSON object.
    $quotedJson = $raw -split "`r?`n" | Where-Object { $_.Trim() -match '^"\{.*\}"$' } | Select-Object -Last 1
    $jsonLine = if ($quotedJson) { $quotedJson.Trim().Trim('"').Replace('\"','"').Replace('\\','\') } else { $null }
    $r = $null
    if ($jsonLine) { try { $r = $jsonLine | ConvertFrom-Json } catch {} }
    if (-not $r) {
      Write-Host "FAIL $car $($l.code) parse error: $quotedJson"
      $allOk = $false
      continue
    }
    $ok = ($r.htmlLang -eq $l.code) -and ($r.objCount -eq 0) -and ($r.markerFound -eq $true)
    if ($ok) { Write-Host "PASS $car $($l.code)" } else { Write-Host "FAIL $car $($l.code) lang=$($r.htmlLang) obj=$($r.objCount) marker=$($r.markerFound)"; $allOk=$false }
  }
}
Write-Host $(if($allOk){'ALL_OK'}else{'SOME_FAILED'})
