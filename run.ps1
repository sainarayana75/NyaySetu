# NyaySetu Dual Server Launcher
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host " Starting NyaySetu Platform & Backend " -ForegroundColor Gold
Write-Host "=========================================" -ForegroundColor Cyan

$PYTHONPATH = "$PDK_DIR;backend"
$env:PYTHONPATH = "backend"

# Start FastAPI Backend on Port 8000
Start-Process -FilePath "python.exe" -ArgumentList "-m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload" -WorkingDirectory "$PSScriptRoot\backend"

# Start Vite Frontend on Port 5173
Start-Process -FilePath "npm.cmd" -ArgumentList "run dev" -WorkingDirectory "$PSScriptRoot\frontend"

Write-Host "FastAPI Backend running at: http://127.0.0.1:8000/docs" -ForegroundColor Green
Write-Host "Vite Frontend running at: http://localhost:5173" -ForegroundColor Green
