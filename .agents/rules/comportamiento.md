---
trigger: always_on
---

# 06 — Reglas del Agente (CRÍTICO)

> Estas reglas son no negociables.
> Ante cualquier ambigüedad, aplica estas reglas antes de escribir código.

---

## 🚫 NUNCA hagas esto

| ❌ Prohibido | ✅ Correcto |
|-------------|------------|
| Generar PDF en un Controller o Service del backend | Solo en `worker/Renderers/` |
| Poner lógica de negocio en el frontend | Solo en `backend/Services/` |
| Usar `localhost` dentro del docker-compose | Usar nombre del servicio: `postgres`, `redis`, `minio` |
| Exponer entidades de dominio directamente en la API | Siempre usar DTOs en los Controllers |
| Poner DTOs que usan backend Y worker en `backend/` | Moverlos a `shared/DTOs/` |
| Crear endpoints síncronos que esperen el PDF | Siempre asíncrono: crear job → devolver jobId |
| Guardar PDFs en el filesystem del servidor | Siempre MinIO (dev) o Cloudflare R2 (prod) |
| Hardcodear credenciales, connection strings o secrets | Variables de entorno siempre |
| Poner lógica en Controllers | Controllers solo validan y delegan a Services |
| Usar rutas relativas largas en el frontend | Siempre import alias `@/` |
| Crear archivos en `frontend/pages/` | Usar siempre App Router en `frontend/src/app/` |
| Poner fetch calls inline en componentes React | Siempre en `src/lib/api.ts` o hooks |
| Agregar lógica o dependencias de infraestructura a `shared/` | `shared/` solo tiene DTOs, Enums, interfaces |

---

## ✅ SIEMPRE haz esto

### Backend
- Flujo de capas estricto: `Controller → Service → Repository → DbContext`
- Toda respuesta HTTP usa DTOs — nunca retornar modelos de EF Core directamente
- Validar inputs con DataAnnotations o FluentValidation en el Controller
- Toda comunicación API → Worker pasa por Hangfire/Redis — nunca HTTP directo entre servicios
- Registrar dependencias en `Program.cs` con inyección de dependencias

### Worker
- El Worker actualiza el estado del job Y del diploma al terminar (COMPLETED o FAILED)
- Los archivos generados siempre tienen nombre con UUID: `diplomas/{diplomaId}.pdf`
- Manejar excepciones en el job para que Hangfire pueda reintentarlo correctamente
- Liberar recursos de Playwright después de cada renderizado

### Frontend
- Todo fetch a la API centralizado en `src/lib/api.ts`
- Usar el alias `@/` en todos los imports
- Componentes en `src/components/`, páginas en `src/app/`
- Tipado TypeScript estricto — nunca usar `any`
- Variables de entorno del frontend solo con prefijo `NEXT_PUBLIC_` si son públicas

### General
- Variables de entorno para toda configuración sensible
- Nunca commitear `.env` — solo `.env.example`
- Seguir el orden de implementación de fases definido en `05-COMPORTAMIENTO-SISTEMA.md`

---

## 🔑 Reglas de `shared/`

**Permitido:**
```csharp
// DTOs de jobs
public class DiplomaJobPayload
{
    public Guid DiplomaId { get; set; }
    public Guid TemplateId { get; set; }
    public Guid ParticipantId { get; set; }
}

// Enums
public enum JobStatus { Pending, Processing, Completed, Failed }
public enum DiplomaStatus { Pending, Generated, Sent }
```

**Prohibido en `shared/`:**
- Clases que usen EF Core, Hangfire, Redis, S3, Playwright
- Lógica de negocio
- Servicios con dependencias externas

---

## 🔑 Reglas de `infra/`

**Permitido:**
- Dockerfiles
- `docker-compose.yml`
- `infra/postgres/init.sql`
- Scripts de CI/CD

**Prohibido:**
- Código de aplicación
- Lógica de negocio
- Tests

---

## 🧪 Checklist antes de hacer commit

1. ¿Estoy generando un PDF fuera del Worker? → **Mover a `worker/Renderers/`**
2. ¿Hay lógica de negocio en un Controller? → **Mover a un Service**
3. ¿Hay lógica de negocio en el Frontend? → **Mover al backend**
4. ¿Este DTO lo usan backend Y worker? → **Mover a `shared/DTOs/`**
5. ¿Hay un endpoint que espera el PDF síncronamente? → **Refactorizar a asíncrono**
6. ¿Hay un secret hardcodeado? → **Mover a variable de entorno**
7. ¿Estoy guardando un archivo en disco local del servidor? → **Mover a storage**
8. ¿Hay un import con `../../` en el frontend? → **Cambiar a `@/`**
9. ¿Estoy usando `localhost` dentro de Docker? → **Cambiar al nombre del servicio**
10. ¿Estoy retornando un Model de EF Core directamente desde un Controller? → **Crear un DTO**

---

## 📋 Convenciones de código C#

```csharp
// Controllers — solo routing y delegación
[ApiController]
[Route("api/[controller]")]
public class DiplomasController : ControllerBase
{
    private readonly IDiplomaService _diplomaService;

    public DiplomasController(IDiplomaService diplomaService)
        => _diplomaService = diplomaService;

    [HttpPost("generate")]
    public async Task<IActionResult> Generate([FromBody] GenerateDiplomaRequest request)
    {
        var result = await _diplomaService.GenerateAsync(request);
        return Ok(result);
    }
}

// Services — lógica de negocio
public class DiplomaService : IDiplomaService
{
    // Recibe repositorios y clientes por DI
    // Nunca accede a DbContext directamente
}

// Repositories — solo acceso a datos
public class DiplomaRepository : IDiplomaRepository
{
    private readonly AppDbContext _context;
    // Solo queries EF Core — sin lógica de negocio
}
```

---

## 📋 Convenciones de código TypeScript/React

```typescript
// ✅ Correcto — fetch centralizado
// src/lib/api.ts
export async function getDiploma(id: string): Promise<Diploma> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/diplomas/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return res.json();
}

// ✅ Correcto — componente tipado sin lógica de fetch inline
// src/components/DiplomaCard.tsx
interface DiplomaCardProps {
  diploma: Diploma;
  onDownload: (id: string) => void;
}

export function DiplomaCard({ diploma, onDownload }: DiplomaCardProps) {
  return <div>...</div>;
}

// ❌ Incorrecto — fetch inline en componente
export function DiplomaCard({ id }: { id: string }) {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch(`/api/diplomas/${id}`).then(...); // ❌ nunca así
  }, []);
}
```