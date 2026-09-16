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

# Custom Exception Handler for Clean Errors
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An unexpected error occurred during processing.", "type": type(exc).__name__}
    )

# Register Routers under /api/v1
app.include_router(documents.router, prefix=settings.API_V1_STR)
app.include_router(clauses.router, prefix=settings.API_V1_STR)
app.include_router(findings.router, prefix=settings.API_V1_STR)
app.include_router(obligations.router, prefix=settings.API_V1_STR)
app.include_router(ask.router, prefix=settings.API_V1_STR)
app.include_router(compare.router, prefix=settings.API_V1_STR)
app.include_router(legal_info.router, prefix=settings.API_V1_STR)
app.include_router(lawyer_prep.router, prefix=settings.API_V1_STR)

# Static Files & SPA Fallback serving for Production Container
STATIC_DIR = os.path.join(os.path.dirname(__file__), "static")
if os.path.exists(STATIC_DIR):
    app.mount("/assets", StaticFiles(directory=os.path.join(STATIC_DIR, "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        if full_path.startswith("api/") or full_path.startswith("docs") or full_path.startswith("openapi.json"):
            return JSONResponse(status_code=404, content={"detail": "API endpoint not found"})
        index_file = os.path.join(STATIC_DIR, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        return JSONResponse(status_code=404, content={"detail": "Static frontend not found"})
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

@app.get("/api/v1/health")
def health_check():
    return {"status": "ok", "service": "NyaySetu Core API"}
