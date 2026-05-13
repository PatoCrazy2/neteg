---
name: dto-mapping
description: Crear y mapear DTOs en el backend de Neteg.
---

# Skill: DTO Mapping

Usa esta skill para definir los contratos de entrada y salida de la API, desacoplando la base de datos de la interfaz pública.

## 🎯 Cuándo usar
- Al crear un nuevo endpoint en un Controller.
- Al modificar un Model de EF Core que necesita ser expuesto.
- Para evitar problemas de referencia circular o sobre-exposición de datos (PasswordHash, etc).

## 📁 Estructura
```
backend/DTOs/
├── Auth/
├── Events/
│   ├── EventRequest.cs  (Input)
│   └── EventResponse.cs (Output)
└── Diplomas/
```

## 🛠️ Implementación (Mapeo Manual)
Para mantener el sistema simple y explícito, no usamos AutoMapper. El mapeo se realiza en el **Service**.

### Ejemplo: Recurso Diploma
**Request DTO (`backend/DTOs/Diplomas/CreateDiplomaRequest.cs`):**
```csharp
public class CreateDiplomaRequest {
    [Required]
    public Guid ParticipantId { get; set; }
    [Required]
    public Guid TemplateId { get; set; }
}
```

**Response DTO (`backend/DTOs/Diplomas/DiplomaResponse.cs`):**
```csharp
public class DiplomaResponse {
    public Guid Id { get; set; }
    public string ParticipantName { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? DownloadUrl { get; set; }
}
```

**Lógica en el Service (`backend/Services/DiplomaService.cs`):**
```csharp
public async Task<DiplomaResponse> GetByIdAsync(Guid id) {
    var diploma = await _repository.GetByIdAsync(id);
    
    return new DiplomaResponse {
        Id = diploma.Id,
        ParticipantName = diploma.Participant.FullName,
        Status = diploma.Status.ToString(),
        DownloadUrl = diploma.PdfPath != null ? _storage.GetPresignedUrl(diploma.PdfPath) : null
    };
}
```

## 🛡️ Reglas
1. **Validación:** Usar `DataAnnotations` en los DTOs de Request.
2. **Seguridad:** Nunca incluir campos como `PasswordHash` o `InternalJobId` en los DTOs de Response.
3. **Contratos:** Los DTOs de jobs deben vivir en `shared/DTOs/` si los usa el Worker.
