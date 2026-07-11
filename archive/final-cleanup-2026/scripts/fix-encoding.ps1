# Fix encoding: read as Windows-1252, write as UTF-8 (no BOM)
$filePath = 'c:\Users\oussa\Desktop\pro-fix\html\rs7.html'
$enc1252 = [System.Text.Encoding]::GetEncoding(1252)
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

$bytes = [System.IO.File]::ReadAllBytes($filePath)
$content = $enc1252.GetString($bytes)
[System.IO.File]::WriteAllText($filePath, $content, $utf8NoBom)
Write-Host "Done: rs7.html re-encoded to UTF-8 (no BOM)"
