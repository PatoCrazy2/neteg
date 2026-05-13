# NETEG 🚀

<div align="center">

### Sistema moderno de automatización de eventos y generación de documentos digitales

NETEG centraliza el registro de asistentes, generación de pases QR, validación de acceso y emisión automática de certificados en una arquitectura moderna, desacoplada y escalable.

<br>

![Next.js](https://img.shields.io/badge/Next.js-15+-000000?style=for-the-badge&logo=nextdotjs)
![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?style=for-the-badge&logo=dotnet)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-316192?style=for-the-badge&logo=postgresql)
![Redis](https://img.shields.io/badge/Redis-7-DC382D?style=for-the-badge&logo=redis)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker)

</div>

---

# ✨ ¿Qué es NETEG?

NETEG es una plataforma enfocada en la automatización integral de eventos, diseñada para reducir la complejidad operativa en procesos como:

- Registro de asistentes
- Generación de pases digitales
- Validación mediante códigos QR
- Control de asistencia
- Generación automática de certificados y diplomas

La arquitectura está pensada para soportar procesamiento asíncrono, generación masiva de documentos y una infraestructura fácilmente desplegable mediante Docker.

---

# 🎯 Objetivo del Proyecto

El objetivo principal es construir una plataforma moderna, mantenible y escalable que permita administrar eventos de forma eficiente mediante automatización y procesamiento desacoplado.

## Principales capacidades planeadas

| Funcionalidad | Estado |
|---|---|
| Registro de asistentes | 🟡 En desarrollo |
| Generación de pases QR | 🔜 Pendiente |
| Validación de acceso | 🔜 Pendiente |
| Control de asistencia | 🔜 Pendiente |
| Generación automática de certificados | 🔜 Pendiente |
| Procesamiento asíncrono | 🟢 Arquitectura preparada |

---

# 🏗️ Arquitectura General

NETEG utiliza una arquitectura desacoplada basada en servicios especializados.

```text
Frontend (Next.js)
        │
        ▼
ASP.NET Core API
        │
        ▼
Redis Queue / Cache
        │
        ▼
Worker Service
        │
        ▼
Generación de PDFs / QR / Certificados
        │
        ▼
MinIO Object Storage
```

## Decisiones arquitectónicas importantes

### 🔹 Frontend desacoplado
El frontend consume la API mediante HTTP, permitiendo independencia entre interfaz y backend.

### 🔹 Worker Service separado
Las tareas pesadas como:
- generación de certificados
- renderizado de PDFs
- procesamiento masivo
- futuros envíos de correos

se ejecutan fuera de la API principal para evitar bloqueos y mejorar escalabilidad.

### 🔹 Redis como capa de procesamiento
Redis se utiliza para:
- cache
- colas
- comunicación async entre servicios

### 🔹 MinIO como almacenamiento S3-compatible
MinIO almacena:
- certificados
- imágenes
- pases digitales
- assets generados

evitando depender del filesystem local.

---

# 🛠️ Stack Tecnológico

| Área | Tecnología |
|---|---|
| Frontend | Next.js 15 + TypeScript |
| UI | Tailwind CSS |
| Backend | ASP.NET Core 8 Web API |
| Worker Async | ASP.NET Background Worker |
| Base de Datos | PostgreSQL 16 |
| Cache / Colas | Redis 7 |
| Storage | MinIO |
| Infraestructura | Docker + Docker Compose |

---

# 📂 Estructura del Proyecto

```text
neteg/
│
├── backend/              # ASP.NET Core Web API
├── worker/               # Background Worker Service
├── shared/               # DTOs y contratos compartidos
├── frontend/             # Aplicación Next.js
│
├── infra/
│   ├── docker/           # Dockerfiles
│   └── postgres/         # Scripts de inicialización
│
├── docker-compose.yml
├── .env.example
└── Neteg.sln
```

---

# ⚙️ Requisitos Previos

Antes de ejecutar el proyecto necesitas:

- Docker Desktop
- .NET 8 SDK
- Node.js 20+

---

# 🚀 Instalación

## 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/TU-USUARIO/neteg.git
cd neteg
```

---

## 2️⃣ Configurar variables de entorno

Crear archivo `.env` basado en `.env.example`:

```bash
cp .env.example .env
```

---

## 3️⃣ Levantar infraestructura y backend

El proyecto utiliza Docker Compose para garantizar un entorno consistente entre desarrollo y despliegue.

```bash
docker compose up --build
```

Esto levantará:

- PostgreSQL
- Redis
- MinIO
- ASP.NET API
- Worker Service

---

## 4️⃣ Ejecutar frontend

En desarrollo, el frontend corre fuera de Docker para aprovechar:
- hot reload más rápido
- mejor experiencia de desarrollo
- menor consumo de recursos

```bash
cd frontend
pnpm install
pnpm dev
```

---

# 🔌 Servicios y Puertos

| Servicio | URL / Puerto |
|---|---|
| Frontend | `http://localhost:3000` |
| API Backend | `http://localhost:5000` |
| PostgreSQL | `localhost:5432` |
| Redis | `localhost:6379` |
| MinIO API | `localhost:9000` |
| MinIO Console | `http://localhost:9001` |

---

# 🐳 Docker

NETEG utiliza Docker Compose para orquestar todos los servicios backend.

## Servicios dockerizados

| Servicio | Docker |
|---|---|
| PostgreSQL | ✅ |
| Redis | ✅ |
| MinIO | ✅ |
| API Backend | ✅ |
| Worker Service | ✅ |
| Frontend | ❌ (solo desarrollo local) |

---

# 📈 Estado Actual del Proyecto

Actualmente el proyecto se encuentra en etapa inicial de desarrollo (MVP).

## Infraestructura
- ✅ Docker Compose
- ✅ PostgreSQL
- ✅ Redis
- ✅ MinIO
- ✅ Networking entre servicios
- ✅ Healthchecks

## Backend
- ✅ ASP.NET Core API inicializada
- ✅ Worker Service inicializado
- ✅ Shared Library configurada

## Frontend
- ✅ Next.js configurado
- ✅ TypeScript
- ✅ Tailwind CSS

## Pendiente
- 🔜 Autenticación JWT
- 🔜 Modelado de base de datos
- 🔜 Gestión de eventos
- 🔜 Sistema de asistentes
- 🔜 Generación QR
- 🔜 Renderizado de certificados

---

# 🛡️ Buenas Prácticas Aplicadas

- Arquitectura desacoplada
- Separación de responsabilidades
- Procesamiento asíncrono
- Variables de entorno
- Infraestructura reproducible
- Contenedorización con Docker
- Shared contracts entre servicios
- Frontend y backend independientes

---

# 📌 Filosofía del Proyecto

NETEG prioriza:

- mantenibilidad
- escalabilidad
- separación clara de responsabilidades
- automatización
- experiencia moderna de desarrollo

---

<div align="center">

### NETEG
*Automatizando la gestión moderna de eventos.*

</div>