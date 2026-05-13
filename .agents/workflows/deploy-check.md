---
description: Checklist antes de hacer deploy a producción
---

# Workflow: Deploy Check

Realiza estas validaciones antes de realizar un merge a `main` o intentar un despliegue a producción.

## 📋 Lista de Verificación

### 1. Seguridad 🛡️
- [ ] No hay secrets (API Keys, Passwords, Connection Strings) hardcodeados.
- [ ] El archivo `.env` está en `.gitignore`.
- [ ] Las variables de entorno necesarias están documentadas en `.env.example`.

### 2. Estabilidad 🏗️
- [ ] `dotnet build backend/` compila sin errores.
- [ ] `dotnet build worker/` compila sin errores.
- [ ] `npm run build` en `frontend/` termina exitosamente.
- [ ] Todas las migraciones de EF Core han sido generadas.

### 3. Arquitectura 🏛️
- [ ] La API no tiene dependencias de Playwright o renderizado de PDF.
- [ ] El Worker no tiene dependencias de Controllers de la API.
- [ ] Todas las rutas del frontend usan `@/` para imports.
- [ ] No hay llamadas directas a la DB desde el Frontend.

### 4. Producción 🚀
- [ ] Se ha verificado que los servicios en Docker usan variables de entorno para sus credenciales.
- [ ] El Storage (MinIO/R2) está configurado correctamente para el entorno de destino.
- [ ] Las URLs base de la API en el frontend apuntan a la variable de entorno `NEXT_PUBLIC_API_URL`.

---
**¿Algo falló?** No realices el deploy hasta corregir el punto marcado.
