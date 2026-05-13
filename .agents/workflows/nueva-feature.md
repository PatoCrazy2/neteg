---
description: Workflow para implementar una nueva feature en Neteg siguiendo la arquitectura correcta
---

# Workflow: Nueva Feature

Sigue estos pasos en orden para asegurar que la nueva funcionalidad cumple con la arquitectura y convenciones del proyecto.

## 🏁 Pasos a seguir

1. **Modelado de Datos:**
   - Crear/Modificar entidades en `backend/Models/`.
   - Ejecutar `dotnet ef migrations add ... --project backend`.
   - Aplicar con `dotnet ef database update --project backend`.

2. **Definición de Contratos:**
   - Crear DTOs de Request/Response en `backend/DTOs/{Recurso}/`.
   - Si la feature usa el Worker, añadir el payload en `shared/DTOs/`.

3. **Capa de Datos:**
   - Crear o actualizar el Repository en `backend/Repositories/`.

4. **Lógica de Negocio:**
   - Implementar la lógica en `backend/Services/`.
   - Si genera un job asíncrono, usar `BackgroundJob.Enqueue`.

5. **Exposición de API:**
   - Crear/Actualizar el Controller en `backend/Controllers/`.
   - Inyectar el Service en el constructor.

6. **Implementación en Worker (Si aplica):**
   - Crear la clase del Job en `worker/Jobs/`.
   - Implementar la lógica pesada (ej: rendering, uploads).
   - Registrar el job y dependencias en `worker/Program.cs`.

7. **Consumo en Frontend:**
   - Definir los tipos TS en `frontend/src/types/`.
   - Crear la función de llamada en `frontend/src/lib/api.ts`.
   - Crear componentes UI en `frontend/src/components/`.
   - Crear la página/ruta en `frontend/src/app/`.

8. **Validación:**
   - Verificar que no hay `localhost` hardcodeado.
   - Verificar que no hay secrets en el código.
   - Probar el flujo completo: Frontend → API → Redis → Worker → Storage.

---
> **Recuerda:** Siempre consulta `GEMINI.md` para las reglas de oro antes de empezar.
