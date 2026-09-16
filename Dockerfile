# =========================================================
# Stage 1: Build React Frontend
# =========================================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ .
RUN npm run build

# =========================================================
# Stage 2: Build FastAPI Backend & Serve Unified Application
# =========================================================
FROM python:3.11-slim
WORKDIR /app

# Prevent Python buffering
ENV PYTHONUNBUFFERED=1

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .
COPY --from=frontend-builder /app/frontend/dist ./app/static_frontend

EXPOSE 8080

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
