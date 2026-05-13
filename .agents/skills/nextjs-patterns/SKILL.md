---
name: nextjs-patterns
description: Patrones de Next.js App Router para el proyecto Neteg.
---

# Skill: Next.js Patterns (App Router)

Usa esta skill para desarrollar la interfaz de usuario en `frontend/src/app/`.

## 🎯 Cuándo usar
- Al crear nuevas páginas o componentes UI.
- Al implementar lógica de fetching de datos.
- Al manejar estados de formularios o autenticación.

## 🏗️ Estructura de Rutas
- `/dashboard`: Panel principal.
- `/(auth)/login`: Grupo de ruta para autenticación.
- `/events`: Listado y gestión de eventos.
- `/verify/[id]`: Ruta dinámica para validación pública.

## 🔄 Fetching de Datos

### Server Components (Por defecto)
Usa para SEO y velocidad inicial. Fetch directo con async/await.
```tsx
// src/app/events/page.tsx
import { getEvents } from '@/lib/api';

export default async function EventsPage() {
    const events = await getEvents();
    return (
        <ul>
            {events.map(e => <li key={e.id}>{e.name}</li>)}
        </ul>
    );
}
```

### Client Components (`"use client"`)
Usa para interactividad (hooks, events, polling).
```tsx
'use client';
import { useEffect, useState } from 'react';
import { getJobStatus } from '@/lib/api';

export function JobStatus({ jobId }: { jobId: string }) {
    const [status, setStatus] = useState('Pending');

    useEffect(() => {
        const interval = setInterval(async () => {
            const res = await getJobStatus(jobId);
            setStatus(res.status);
            if (res.status === 'Completed') clearInterval(interval);
        }, 3000);
        return () => clearInterval(interval); // Cleanup
    }, [jobId]);

    return <div>Estado: {status}</div>;
}
```

## 📏 Reglas del Frontend
- **Alias:** Siempre `@/components/...`, `@/lib/...`.
- **Estilos:** TailwindCSS 4 únicamente.
- **Formularios:** Validar en cliente y servidor.
- **JWT:** Almacenar en `localStorage` o `cookies` y adjuntar en el header `Authorization: Bearer <token>` vía `src/lib/api.ts`.
