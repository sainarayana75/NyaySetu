# Automated Firebase Deployment Script for NyaySetu
param (
    [string]$ProjectId = "mythic-producer-508813-q3"
)

Write-Host "=================================================" -ForegroundColor Cyan
Write-Host " Building & Deploying NyaySetu to Firebase       " -ForegroundColor Gold
Write-Host " Project: $ProjectId                             " -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Cyan

# 1. Build React Frontend Production Bundle
Write-Host "Building React production bundle..." -ForegroundColor Yellow
Set-Location "$PSScriptRoot\frontend"
npm.cmd run build
Set-Location "$PSScriptRoot"

# 2. Deploy to Firebase
Write-Host "Deploying assets & API rewrites to Firebase Hosting..." -ForegroundColor Yellow
npx.cmd -y firebase-tools deploy --project $ProjectId

Write-Host "Firebase Deployment Complete!" -ForegroundColor Green
