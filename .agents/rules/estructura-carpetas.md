---
trigger: model_decision
description: al crear carpetas, archivos
---

# 04 — Estructura de Carpetas (Monorepo Real)

> Estructura real del repositorio después de inicializar todos los proyectos.
> Ante cualquier duda de dónde crear un archivo, consulta este documento.

---

## 🗂️ Árbol Completo

```
/neteg                               ← Raíz del monorepo
│
├── Neteg.sln                        ← Solution file (.NET) — agrupa backend, worker, shared
├── docker-compose.yml               ← Orquestación local
├── .env                             ← Variables locales — NO sube a Git
├── .env.example                     ← Plantilla de variables — SÍ sube a Git
├── .gitignore                       ← Ignorar bin/, obj/, node_modules/, .env
├── README.md
│
├── backend/                         ← ASP.NET Core Web API
│   ├── backend.csproj               ← Referencia a shared/shared.csproj
│   ├── Program.cs                   ← Entry point, DI container, middleware
│   ├── Controllers/                 ← Endpoints HTTP (un archivo por recurso)
│   │   ├── AuthController.cs
│   │   ├── EventsController.cs
│   │   ├── ParticipantsController.cs
│   │   ├── TemplatesController.cs
│   │   └── DiplomasController.cs
│   ├── Services/                    ← Lógica de negocio
│   │   ├── AuthService.cs
│   │   ├── EventService.cs
│   │   ├── ParticipantService.cs
│   │   ├── TemplateService.cs
│   │   └── DiplomaService.cs
│   ├── Repositories/                ← Acceso a datos (abstracción sobre EF Core)
│   │   ├── UserRepository.cs
│   │   ├── EventRepository.cs
│   │   └── DiplomaRepository.cs
│   ├── Models/                      ← Entidades de dominio (tablas de la DB)
│   │   ├── User.cs
│   │   ├── Event.cs
│   │   ├── Participant.cs
│   │   ├── Template.cs
│   │   ├── Diploma.cs
│   │   └── DiplomaJob.cs
│   ├── DTOs/                        ← Contratos HTTP de entrada/salida
│   │   ├── Auth/
│   │   ├── Events/
│   │   ├── Participants/
│   │   └── Diplomas/
│   ├── Infrastructure/              ← Configuración de servicios externos
│   │   ├── AppDbContext.cs          ← EF Core DbContext
│   │   ├── HangfireConfig.cs
│   │   └── StorageConfig.cs
│   └── appsettings.json             ← Config no sensible (logging, etc.)
│
├── worker/                          ← ASP.NET Core Worker Service
│   ├── worker.csproj                ← Referencia a shared/shared.csproj
│   ├── Program.cs                   ← Entry point, Hangfire Server, DI
│   ├── Jobs/                        ← Procesadores de jobs (uno por tipo)
│   │   └── DiplomaGenerationJob.cs
│   ├── Renderers/                   ← Conversión HTML → PDF
│   │   └── HtmlToPdfRenderer.cs     ← Playwright wrapper
│   └── Services/                    ← Lógica de generación y upload
│       ├── TemplateEngine.cs        ← Inyección de datos en HTML
│       └── StorageUploader.cs       ← Upload a MinIO/R2 con AWS SDK S3
│
├── shared/                          ← Class Library compartida
│   ├── shared.csproj
│   ├── DTOs/                        ← Payloads de jobs
│   │   └── DiplomaJobPayload.cs
│   └── Enums/                       ← Estados compartidos
│       ├── JobStatus.cs
│       └── DiplomaStatus.cs
│
├── frontend/                        ← Next.js App Router
│   ├── package.json
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── AGENTS.md                    ← Guía de Next.js para agentes de IA
│   ├── .env.local                   ← Variables del frontend — NO sube a Git
│   └── src/
│       ├── app/                     ← App Router — rutas y layouts
│       │   ├── layout.tsx           ← Layout raíz
│       │   ├── page.tsx             ← Homepage
│       │   ├── (auth)/              ← Grupo de rutas de autenticación
│       │   │   ├── login/
│       │   │   └── register/
│       │   ├── dashboard/           ← Panel principal
│       │   ├── events/              ← Gestión de eventos
│       │   ├── diplomas/            ← Gestión de diplomas
│       │   └── verify/              ← Verificación pública de diplomas
│       ├── components/              ← Componentes React reutilizables
│       │   ├── ui/                  ← Componentes base (Button, Input, etc.)
│       │   ├── forms/               ← Formularios específicos
│       │   └── layouts/             ← Layouts reutilizables
│       ├── lib/                     ← Utilidades y cliente API
│       │   ├── api.ts               ← Fetch wrapper con base URL y auth headers
│       │   └── utils.ts
│       ├── hooks/                   ← Custom React hooks
│       └── types/                   ← Tipos TypeScript del dominio
│
└── infra/                           ← Solo configuración de infraestructura
    ├── docker/
    │   ├── Dockerfile.api
    │   ├── Dockerfile.worker
    │   └── Dockerfile.frontend      ← Solo para producción/CI
    ├── postgres/
    │   └── init.sql
    └── redis/
```

---

## 📌 Guía de decisión: ¿dónde va este archivo?

| Si estás creando... | Va en... |
|---------------------|----------|
| Un endpoint HTTP nuevo | `backend/Controllers/` |
| Lógica de negocio del backend | `backend/Services/` |
| Una query a la DB | `backend/Repositories/` |
| Una entidad de la DB | `backend/Models/` |
| Un DTO de request/response HTTP | `backend/DTOs/` |
| El procesador de un job | `worker/Jobs/` |
| Código que convierte HTML a PDF | `worker/Renderers/` |
| Un enum usado por backend Y worker | `shared/Enums/` |
| El payload que viaja en un job | `shared/DTOs/` |
| Una página o ruta del frontend | `frontend/src/app/` |
| Un componente React reutilizable | `frontend/src/components/` |
| Una llamada fetch a la API | `frontend/src/lib/api.ts` |
| Un custom hook | `frontend/src/hooks/` |
| Un tipo TypeScript del dominio | `frontend/src/types/` |
| Un Dockerfile | `infra/docker/` |

---

## 📌 Reglas de nomenclatura

| Capa | Convención |
|------|-----------|
| Archivos C# | PascalCase (`DiplomaService.cs`) |
| Archivos TypeScript/React | camelCase para utils (`api.ts`), PascalCase para componentes (`DiplomaCard.tsx`) |
| Carpetas backend | PascalCase (`Controllers/`, `Services/`) |
| Carpetas frontend | camelCase (`components/`, `hooks/`) |
| Rutas Next.js | kebab-case (`/my-events`) |
| Variables de entorno | UPPER_SNAKE_CASE |