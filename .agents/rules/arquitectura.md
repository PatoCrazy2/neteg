---
trigger: always_on
---

 Arquitectura del Sistema
 
> Describe cómo fluye una solicitud de principio a fin.
> El agente debe respetar este flujo sin excepciones.
 
---
 
## 🔁 Flujo Principal — Generación de Diploma
 
```
[Usuario]
    ↓
[Next.js Frontend — src/app/]     → Formulario, estado de progreso, descarga
    ↓ HTTP REST
[ASP.NET Core API — backend/]     → Valida, persiste en DB, crea job
    ↓ Encola job
[Redis + Hangfire]                 → Job persistido con payload
    ↓ Consume job
[Worker Service — worker/]        → Proceso de fondo independiente
    ↓ Renderiza
[Playwright — headless Chromium]  → HTML + datos → PDF
    ↓ Sube archivo
[MinIO (dev) / Cloudflare R2 (prod)] → PDF almacenado
    ↓ Actualiza estado
[PostgreSQL — netegdb]            → Job marcado COMPLETED + URL del PDF
    ↓ Polling / notificación
[Frontend]                        → Muestra link de descarga al usuario
```
 
---
 
## 🧠 Principios Clave — El agente DEBE conocerlos
 
### ❌ La API NO genera PDFs
La API crea el job y responde inmediatamente. El rendering es responsabilidad exclusiva del Worker.
 
### ✅ El Worker es el único motor de rendering
Todo lo CPU-intensivo o I/O pesado vive en el Worker. Nunca en la API.
 
### ✅ Redis desacopla API y Worker
La API puede escalar sin afectar al Worker y viceversa. Se comunican solo a través de la cola.
 
### ✅ Storage siempre externo
Los PDFs nunca se guardan en el filesystem del servidor. Siempre en MinIO (dev) o R2 (prod).
 
### ✅ Todo proceso pesado es ASÍNCRONO
No existen endpoints que bloqueen esperando un PDF. Siempre: crear job → devolver jobId → el cliente hace polling.
 
### ✅ Comunicación interna por nombre de servicio Docker
Dentro de Docker los servicios se llaman por nombre: `postgres`, `redis`, `minio`. Nunca `localhost`.
 
---
 
## 📊 Diagrama de Capas
 
```
┌──────────────────────────────────────────┐
│         FRONTEND (Next.js)               │
│  src/app/ · src/components/ · src/lib/   │
│  Corre fuera de Docker en desarrollo     │
└──────────────────┬───────────────────────┘
                   │ HTTP REST (localhost:5000 dev)
┌──────────────────▼───────────────────────┐
│         API (ASP.NET Core)               │
│  Controllers → Services → Repositories  │
│  Puerto interno 8080 → externo 5000      │
└──────────────────┬───────────────────────┘
                   │ Hangfire enqueue
┌──────────────────▼───────────────────────┐
│         REDIS + HANGFIRE                 │
│  Cola persistente · reintentos automáticos│
└──────────────────┬───────────────────────┘
                   │ Hangfire consume
┌──────────────────▼───────────────────────┐
│         WORKER SERVICE (.NET)            │
│  Jobs/ · Renderers/ · Services/          │
│  Sin puertos HTTP — proceso puro         │
└──────────────────┬───────────────────────┘
                   │ Upload
┌──────────────────▼───────────────────────┐
│         STORAGE (MinIO dev / R2 prod)    │
│  PDFs generados · URLs presignadas       │
└──────────────────────────────────────────┘
                   │ Compartido por todas las capas
┌──────────────────▼───────────────────────┐
│         POSTGRESQL (netegdb)             │
│  Usuarios · Eventos · Diplomas · Jobs    │
└──────────────────────────────────────────┘
```
 
---
 
## 🔄 Estados de un Job
 
```
PENDING → PROCESSING → COMPLETED
                     ↘ FAILED → (Hangfire reintenta automáticamente)
```
 
| Estado | Quién lo asigna | Significado |
|--------|----------------|-------------|
| `PENDING` | API | Job creado, en cola |
| `PROCESSING` | Worker | Worker tomó el job |
| `COMPLETED` | Worker | PDF generado y disponible |
| `FAILED` | Worker / Hangfire | Error — se reintentará |
 
---
 
## 🔗 Comunicación entre capas
 
| Desde | Hacia | Cómo |
|-------|-------|------|
| Frontend | API | HTTP REST con JSON |
| API | Redis | Hangfire client (enqueue) |
| Worker | Redis | Hangfire server (consume) |
| API | PostgreSQL | EF Core |
| Worker | PostgreSQL | EF Core |
| Worker | MinIO/R2 | AWS SDK S3 |
| Frontend | MinIO/R2 | URL presignada (nunca directo) |
 