$bytes = [System.IO.File]::ReadAllBytes('system\data\rs7-2026.json')
if ($bytes[0] -eq 239 -and $bytes[1] -eq 187 -and $bytes[2] -eq 191) {
    Write-Host "UTF8 BOM detected"
} else {
    Write-Host "NO BOM"
}
