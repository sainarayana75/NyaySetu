# Automated Firebase Deployment Script for NyaySetu
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host " Building & Deploying NyaySetu to Firebase       " -ForegroundColor Gold
Write-Host "=================================================" -ForegroundColor Cyan

# 1. Build React Frontend Production Bundle
Write-Host "Building React production bundle..." -ForegroundColor Yellow
Set-Location "$PSScriptRoot\frontend"
npm.cmd run build
Set-Location "$PSScriptRoot"

# 2. Deploy to Firebase
Write-Host "Deploying assets & API rewrites to Firebase Hosting..." -ForegroundColor Yellow
npx.cmd -y firebase-tools deploy

Write-Host "Firebase Deployment Complete!" -ForegroundColor Green
