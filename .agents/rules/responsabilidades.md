---
trigger: manual
---

# 03 — Responsabilidades por Componente

> Cada componente tiene responsabilidades fijas.
> Si una tarea no está en esta lista, no pertenece a ese componente.

---

## 🖥️ Frontend — `frontend/src/`

**Puede hacer:**
- Renderizar UI con componentes React en `src/app/` (App Router)
- Llamar a la API vía HTTP desde `src/lib/api.ts` o similar
- Mostrar estado de un job en progreso (polling cada N segundos)
- Mostrar preview del diploma antes de generarlo
- Descargar PDFs desde URLs presignadas del storage
- Manejar sesión del usuario con JWT (guardar token, adjuntarlo en headers)

**NO puede hacer:**
- Contener lógica de negocio
- Acceder directamente a PostgreSQL
- Acceder directamente a Redis
- Comunicarse con MinIO/R2 directamente (solo a través de URLs que da la API)
- Generar PDFs

**Patrones obligatorios:**
- Todo fetch a la API va en `src/lib/` o `src/services/` — nunca inline en componentes
- Usar App Router — no crear archivos en `pages/`
- Imports siempre con alias `@/` — nunca `../../components/...`
- Componentes en `src/components/`, páginas en `src/app/`

---

## ⚙️ Backend API — `backend/`

**Puede hacer:**
- Autenticar usuarios (registro, login, refresh token con JWT)
- CRUD de Eventos
- CRUD de Participantes
- CRUD de Plantillas de diploma
- CRUD de Diplomas
- Crear jobs en Hangfire (encolar generación de PDF)
- Consultar y devolver el estado de un job
- Generar URLs presignadas del storage para descarga
- Exponer dashboard de Hangfire en `/hangfire` (solo en Development)

**NO puede hacer:**
- Renderizar PDFs
- Subir archivos al storage (eso es exclusivo del Worker)
- Ejecutar lógica bloqueante en el hilo del request
- Responder síncronamente con un PDF generado

**Patrón obligatorio de capas:**
```
Controller → Service → Repository → DbContext (EF Core)
```
- Controllers: solo validación de input y delegación al Service
- Services: lógica de negocio
- Repositories: acceso a datos, queries EF Core
- DTOs: lo que entra y sale por HTTP — nunca exponer entidades de dominio directamente

---

## 🔧 Worker Service — `worker/`

**Puede hacer:**
- Consumir jobs desde Redis vía Hangfire Server
- Leer datos del diploma desde PostgreSQL
- Cargar la plantilla HTML correspondiente
- Inyectar datos del participante en la plantilla
- Renderizar HTML → PDF con Playwright (headless Chromium)
- Subir el PDF generado a MinIO (dev) o R2 (prod) con AWS SDK S3
- Actualizar el estado del diploma y del job en PostgreSQL

**NO puede hacer:**
- Exponer endpoints HTTP
- Depender del proyecto `backend/` directamente
- Crear jobs (solo los consume)
- Comunicarse con el frontend

**Estructura interna:**
```
worker/
├── Jobs/        → Un archivo por tipo de job (DiplomaGenerationJob.cs)
├── Renderers/   → Playwright wrapper (HtmlToPdfRenderer.cs)
├── Services/    → Lógica de generación y upload
└── Program.cs   → Registro de Hangfire Server + DI
```

---

## 📦 Shared — `shared/`

**Solo puede contener:**
- DTOs de jobs (payload que viaja en la cola)
- Enums compartidos (`JobStatus`, `DiplomaStatus`, `EventStatus`)
- Interfaces/contratos sin implementación

**Prohibido:**
- Lógica de negocio
- Acceso a DB
- Dependencias de infraestructura (NuGet packages de EF, Redis, etc.)

---

## 🗄️ Modelos de dominio (PostgreSQL)

Entidades principales del sistema:

| Entidad | Descripción |
|---------|-------------|
| `User` | Organizadores del sistema — se autentican con JWT |
| `Event` | Evento con nombre, fecha, descripción |
| `Participant` | Persona registrada a un evento |
| `Template` | Plantilla HTML para el diploma |
| `Diploma` | Diploma generado para un participante |
| `DiplomaJob` | Estado del proceso de generación del diploma |
| `AccessTicket` | Boleto QR para acceso al evento |
| `Attendance` | Registro de asistencia (scan de QR) |

---

## 🎯 Features del sistema por módulo

### Gestión de Eventos
- Crear, editar, eliminar eventos
- Formulario de registro personalizable por evento
- Dashboard de métricas del evento

### Participantes
- Registro público vía formulario
- Boleto QR generado automáticamente al registrarse
- Envío del boleto por email (SendGrid / Resend)
- Registro de asistencia por scan de QR

### Certificación
- Plantillas HTML editables por evento
- Generación de fondos con IA (API de Gemini)
- Preview del diploma antes de generar
- Generación individual o masiva de diplomas
- Envío automático del diploma por email
- Verificación pública de autenticidad (`/verificar/:id`)
- Descarga del PDF vía URL presignada