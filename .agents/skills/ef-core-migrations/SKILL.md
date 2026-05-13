---
name: ef-core-migrations
description: Crear y aplicar migraciones de Entity Framework Core en el proyecto Neteg.
---

# Skill: EF Core Migrations

Usa esta skill cuando necesites modificar el esquema de la base de datos (añadir tablas, columnas, índices) o al inicializar el proyecto.

## 🎯 Cuándo usar
- Al modificar una clase en `backend/Models/`.
- Al añadir una nueva entidad al `AppDbContext`.
- Cuando se requiere actualizar la base de datos local o de producción.

## 🔄 Flujo de Trabajo
1. **Modificar Model:** Edita el archivo en `backend/Models/`.
2. **Crear Migración:** Genera el archivo de migración con un nombre descriptivo.
3. **Revisar SQL:** Verifica que el cambio sea el esperado.
4. **Aplicar:** Impacta los cambios en la base de datos.

## 💻 Comandos (Ejecutar desde la raíz)
```powershell
# 1. Crear la migración
dotnet ef migrations add NombreDescriptivo --project backend

# 2. (Opcional) Revisar el SQL generado
dotnet ef migrations script --project backend

# 3. Aplicar cambios a la DB
dotnet ef database update --project backend
```

## 📏 Convenciones
- **Nombres:** PascalCase descriptivo. Ejemplo: `AddParticipantEmailColumn`, `CreateEventsTable`.
- **Limpieza:** Si te equivocas antes de aplicar, usa `dotnet ef migrations remove --project backend`.

## 💡 Ejemplo: Nueva Entidad
**Model (`backend/Models/Event.cs`):**
```csharp
public class Event {
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime Date { get; set; }
}
```

**Migración Resultante:**
```csharp
migrationBuilder.CreateTable(
    name: "Events",
    columns: table => new {
        Id = table.Column<Guid>(type: "uuid", nullable: false),
        Name = table.Column<string>(type: "text", nullable: false),
        Date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
    },
    constraints: table => { table.PrimaryKey("PK_Events", x => x.Id); }
);
```
