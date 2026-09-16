# Automated Google Cloud Run Deployment for NyaySetu
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host " Deploying NyaySetu to Google Cloud Run          " -ForegroundColor Yellow
Write-Host " Project: My Project 70303 (mythic-producer-508813-q3)" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Cyan

# Set active project
gcloud.cmd config set project mythic-producer-508813-q3

# Enable required Google Cloud services
Write-Host "Enabling Cloud Run, Artifact Registry & Build services..." -ForegroundColor Yellow
gcloud.cmd services enable run.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com

# Deploy to Cloud Run
Write-Host "Building and deploying unified container to Cloud Run..." -ForegroundColor Yellow
gcloud.cmd run deploy nyaysetu --source . --region asia-south1 --allow-unauthenticated
