# Neteg — Resumen Ejecutivo de Reglas Críticas

## 🚀 Proyecto: Neteg
Sistema moderno de gestión de eventos y certificación digital automatizada.

## 🛠️ Stack Tecnológico Real
- **Frontend:** Next.js 15+ (App Router), TailwindCSS 4+, TypeScript.
- **Backend API:** ASP.NET Core 8 Web API.
- **Worker:** ASP.NET Core Worker Service + Playwright (Chromium).
- **Cola/Jobs:** Redis 7 + Hangfire.
- **Base de Datos:** PostgreSQL 16.
- **Storage:** MinIO (Dev) / Cloudflare R2 (Prod) — Compatible con S3.

## 🛑 Las 5 Reglas de Oro (NUNCA romper)
1. **Responsabilidad Única de Rendering:** La API **NUNCA** genera PDFs. Solo el Worker puede hacerlo usando Playwright.
2. **Desacoplamiento Total:** La comunicación API → Worker es **exclusivamente** vía Hangfire/Redis. Nunca por HTTP directo.
3. **Persistencia Externa:** Los archivos (PDFs/QR) **NUNCA** se guardan en el disco local. Siempre en Storage (MinIO/R2).
4. **Operaciones Asíncronas:** Los endpoints de generación deben ser **asíncronos**. Devuelven un `jobId` inmediatamente; el cliente hace polling.
5. **Networking Interno:** Dentro de Docker, usar nombres de servicio (`postgres`, `redis`, `minio`). **NUNCA** `localhost`.

## 🔄 Flujo del Pipeline
`Usuario` → `Frontend (React)` → `API (ASP.NET)` → `Redis (Job)` → `Worker (.NET)` → `Playwright (PDF)` → `Storage (S3)` → `DB (Update)` → `Frontend (Polling)`.

## 📂 Ubicación de Archivos (Resumen)
- **Endpoints/Controllers:** `backend/Controllers/`
- **Lógica de Negocio:** `backend/Services/`
- **Entidades/Modelos:** `backend/Models/`
- **Jobs/Procesadores:** `worker/Jobs/`
- **Renderizado PDF:** `worker/Renderers/`
- **DTOs Compartidos (Jobs):** `shared/DTOs/`
- **Vistas/Páginas:** `frontend/src/app/`
- **Componentes UI:** `frontend/src/components/`
- **Llamadas API:** `frontend/src/lib/api.ts`

---
> Priorizar simplicidad operacional sobre arquitecturas complejas. No introducir MediatR, CQRS o Clean Architecture extrema sin necesidad real.
