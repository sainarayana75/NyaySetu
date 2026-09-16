import os
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from app.config import settings
from app.database import engine, Base
from app.routers import (
    documents,
    clauses,
    findings,
    obligations,
    ask,
    compare,
    legal_info,
    lawyer_prep
)

# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="India-focused GenAI-powered legal information, document intelligence, comparison, and preparation platform."
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security Middleware for Hardened Headers
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response

# Register Routers under /api/v1
app.include_router(documents.router, prefix=settings.API_V1_STR)
app.include_router(clauses.router, prefix=settings.API_V1_STR)
app.include_router(findings.router, prefix=settings.API_V1_STR)
app.include_router(obligations.router, prefix=settings.API_V1_STR)
app.include_router(ask.router, prefix=settings.API_V1_STR)
app.include_router(compare.router, prefix=settings.API_V1_STR)
app.include_router(legal_info.router, prefix=settings.API_V1_STR)
app.include_router(lawyer_prep.router, prefix=settings.API_V1_STR)

@app.get("/api/v1/health")
def health_check():
    return {"status": "ok", "service": "NyaySetu Core API"}

# Mount Static Frontend Distribution if built (Production Deployment Mode)
dist_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "frontend", "dist")
if os.path.exists(dist_path):
    app.mount("/assets", StaticFiles(directory=os.path.join(dist_path, "assets")), name="assets")
    
    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        if full_path.startswith("api/"):
            return JSONResponse(status_code=404, content={"detail": "API route not found"})
        target_file = os.path.join(dist_path, full_path)
        if os.path.exists(target_file) and os.path.isfile(target_file):
            return FileResponse(target_file)
        return FileResponse(os.path.join(dist_path, "index.html"))
else:
    @app.get("/")
    def root():
        return {
            "product": settings.PROJECT_NAME,
            "tagline": "Bridging Legal Complexity and Understanding.",
            "version": settings.VERSION,
            "status": "healthy",
            "docs_url": "/docs"
        }
