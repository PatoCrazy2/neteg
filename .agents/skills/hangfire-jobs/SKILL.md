---
name: hangfire-jobs
description: Crear, encolar y consumir jobs con Hangfire en el proyecto Neteg.
---

# Skill: Hangfire Jobs

Usa esta skill para gestionar procesos asíncronos como la generación de diplomas o envío masivo de correos.

## 🎯 Cuándo usar
- Al implementar un nuevo proceso de fondo.
- Al modificar la lógica de encolamiento en la API.
- Al configurar el Worker para procesar nuevas tareas.

## 🛠️ Configuración
- **API (Client):** Configurado en `backend/Program.cs` para encolar.
- **Worker (Server):** Configurado en `worker/Program.cs` para procesar.

## 🔄 Flujo Completo

### 1. Definir Payload (`shared/DTOs/DiplomaJobPayload.cs`)
```csharp
namespace Neteg.Shared.DTOs;
public class DiplomaJobPayload {
    public Guid DiplomaId { get; set; }
}
```

### 2. Encolar desde la API (`backend/Services/DiplomaService.cs`)
```csharp
using Hangfire;
// ...
BackgroundJob.Enqueue<IDiplomaGenerationJob>(job => job.ExecuteAsync(payload));
```

### 3. Implementar en el Worker (`worker/Jobs/DiplomaGenerationJob.cs`)
```csharp
public class DiplomaGenerationJob : IDiplomaGenerationJob {
    public async Task ExecuteAsync(DiplomaJobPayload payload) {
        // Lógica de procesamiento
        // Si falla, throw exception para que Hangfire reintente
    }
}
```

## 🛡️ Reglas de Oro
- **No tragar excepciones:** Deja que la excepción suba para que Hangfire registre el fallo y aplique la política de reintentos (3 intentos por defecto).
- **Idempotencia:** Asegúrate de que el job pueda ejecutarse varias veces sin causar inconsistencias (ej: verificar si el PDF ya existe antes de sobreescribir).
- **Dashboard:** Accede a `http://localhost:5000/hangfire` en desarrollo para monitorear.

## 💡 Política de Reintentos
Usamos el atributo `[AutomaticRetry(Attempts = 3)]` en las clases de Job.
