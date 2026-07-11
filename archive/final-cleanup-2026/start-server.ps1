# AutoMax — Local Server Starter
# Starts a simple HTTP server to avoid CORS issues

Write-Host "Starting AutoMax Local Server..." -ForegroundColor Green

# Check if Python is available
$python = Get-Command python -ErrorAction SilentlyContinue
if ($python) {
    Write-Host "Using Python HTTP server..." -ForegroundColor Cyan
    Write-Host "Server running at: http://localhost:8000" -ForegroundColor Green
    Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
    python -m http.server 8000
    exit
}

# Check if Python3 is available
$python3 = Get-Command python3 -ErrorAction SilentlyContinue
if ($python3) {
    Write-Host "Using Python3 HTTP server..." -ForegroundColor Cyan
    Write-Host "Server running at: http://localhost:8000" -ForegroundColor Green
    Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
    python3 -m http.server 8000
    exit
}

# Check if Node.js is available
$node = Get-Command node -ErrorAction SilentlyContinue
if ($node) {
    Write-Host "Using Node.js HTTP server..." -ForegroundColor Cyan
    Write-Host "Server running at: http://localhost:8000" -ForegroundColor Green
    Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
    node -e "const http = require('http'); const fs = require('fs'); const path = require('path'); const server = http.createServer((req, res) => { const filePath = '.' + (req.url === '/' ? '/index.html' : req.url); const ext = path.extname(filePath); const contentType = {'.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.gif': 'image/gif', '.svg': 'image/svg+xml', '.ico': 'image/x-icon'}[ext] || 'text/plain'; fs.readFile(filePath, (err, content) => { if (err) { res.writeHead(404); res.end('File not found'); } else { res.writeHead(200, {'Content-Type': contentType}); res.end(content); }}); }); server.listen(8000, () => console.log('Server running at http://localhost:8000'));"
    exit
}

Write-Host "ERROR: No Python or Node.js found" -ForegroundColor Red
Write-Host "Please install Python or Node.js to run a local server" -ForegroundColor Yellow
Write-Host "Or use VS Code Live Server extension" -ForegroundColor Yellow
