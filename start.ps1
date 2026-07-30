# Biodata Generator - Startup Script
Write-Host "Starting Biodata Generator..." -ForegroundColor Cyan

# Start Backend
Write-Host "Starting Backend on http://localhost:5000 ..." -ForegroundColor Yellow
Start-Process -FilePath "cmd.exe" -ArgumentList "/k cd `"$PSScriptRoot\backend`" && node server.js" -NoNewWindow:$false

Start-Sleep -Seconds 2

# Start Frontend  
Write-Host "Starting Frontend on http://localhost:5173 ..." -ForegroundColor Yellow
Start-Process -FilePath "cmd.exe" -ArgumentList "/k cd `"$PSScriptRoot\frontend`" && npm run dev"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host " App is starting up!" -ForegroundColor Green
Write-Host " Open: http://localhost:5173" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
