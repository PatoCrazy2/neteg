---
trigger: always_on
---

# 01 — Stack Tecnológico
 
> Versiones y tecnologías reales en uso. No cambies el stack sin actualizar este archivo.
 
---
 
## 🟦 Frontend — `frontend/`
 
| Tecnología | Versión | Rol |
|------------|---------|-----|
| Next.js | latest (App Router) | Framework UI principal |
| React | 19+ | Base de Next.js |
| TypeScript | 5+ | Tipado estático — obligatorio en todos los archivos |
| TailwindCSS | 4+ | Estilos — no usar CSS custom salvo excepciones justificadas |
| ESLint | latest | Linter — configurado por create-next-app |
 
**Estructura generada por `create-next-app`:**
- App Router activado → todo vive en `src/app/`
- `src/` directory activado → el código vive en `src/`, no en la raíz
- Import alias `@/*` configurado → usar siempre `@/components/...` nunca rutas relativas largas
- AGENTS.md incluido → guía adicional para agentes sobre patrones de Next.js
---
 
## 🟦 Backend — `backend/`
 
| Tecnología | Versión | Rol |
|------------|---------|-----|
| ASP.NET Core Web API | .NET 8 | Endpoints HTTP, orquestación |
| Entity Framework Core | 8.x | ORM — Code First con migraciones |
| Npgsql.EntityFrameworkCore | 8.x | Driver PostgreSQL para EF Core |
| Hangfire | latest | Gestión de jobs, reintentos, dashboard |
| Hangfire.Redis.StackExchange | latest | Storage de Hangfire en Redis |
| JWT Bearer | latest | Autenticación stateless |
| BCrypt.Net | latest | Hash de contraseñas |
| AWSSDK.S3 | latest | Cliente S3 (apunta a MinIO en dev, S3 en prod) |
 
**Proyecto generado con:** `dotnet new webapi --use-controllers`
Usa Controllers (no Minimal API). Patrón: `Controller → Service → Repository → DB`
 
---
 
## 🟥 Worker — `worker/`
 
| Tecnología | Versión | Rol |
|------------|---------|-----|
| ASP.NET Core Worker Service | .NET 8 | Proceso de fondo continuo |
| Hangfire | latest | Consume jobs de Redis |
| Microsoft.Playwright | latest | Renderizado HTML → PDF (headless Chromium) |
| AWSSDK.S3 | latest | Subida de PDFs a MinIO/S3 |
| Npgsql.EntityFrameworkCore | 8.x | Acceso a DB para leer/actualizar estado |
 
**Proyecto generado con:** `dotnet new worker`
No expone puertos HTTP. Es un proceso de fondo puro.
 
---
 
## 🟨 Cola de Jobs
 
| Tecnología | Entorno | Rol |
|------------|---------|-----|
| Redis 7 (Docker) | Local | Broker de mensajes |
| Upstash Redis | Producción | Redis serverless compatible |
| Hangfire | Ambos | Gestión de jobs sobre Redis |
 
---
 
## 🟩 Base de Datos
 
| Tecnología | Entorno | Detalle |
|------------|---------|---------|
| PostgreSQL 16 Alpine (Docker) | Local | `localhost:5432`, DB: `netegdb` |
| Neon (serverless PostgreSQL) | Producción | Mismo esquema, connection string diferente |
 
---
 
## 🟪 Storage de Archivos
 
| Tecnología | Entorno | Detalle |
|------------|---------|---------|
| MinIO (Docker) | Local | API en `localhost:9000`, dashboard en `localhost:9001` |
| Cloudflare R2 | Producción | Compatible con S3 — el código del Worker no cambia |
 
El Worker usa **AWSSDK.S3** en ambos entornos. Solo cambia el `endpoint` y las credenciales via variables de entorno.
 
---
 
## 🟣 Shared — `shared/`
 
| Tipo | Rol |
|------|-----|
| Class Library (.NET 8) | Código compartido entre backend y worker |
 
Referenciado por `backend/backend.csproj` y `worker/worker.csproj`.
 
---
 
## 🐳 Infraestructura Local
 
| Tecnología | Rol |
|------------|-----|
| Docker Desktop | Containerización |
| Docker Compose | Orquestación local (postgres + redis + minio + api + worker) |
 
**El frontend corre fuera de Docker en desarrollo** con `npm run dev`.
 
---
 
## 🚀 Despliegue (Producción)
 
| Capa | Plataforma |
|------|------------|
| Frontend | Vercel |
| API | Azure App Service (F1 Free) |
| Worker | Azure Container Apps |
| DB | Neon |
| Redis | Upstash |
| Storage | Cloudflare R2 |