# Job Tracker

Rastreador personal de aplicaciones de empleo, con espacio para IA.

## Por que existe

Buscar trabajo implica juntar decenas de vacantes en distintos estados
(por aplicar, aplicado, entrevista, oferta, rechazado) y perder de vista
el contexto de cada una. Esta app es un tablero tipo kanban para llevar
ese seguimiento dia a dia, con una arquitectura lista para agregar
analisis de vacantes con IA (comparar la descripcion del puesto contra tu
CV y sugerir un borrador de carta de presentacion) en cuanto tengas una
API key de Anthropic u OpenAI.

## Stack y decisiones

- **Next.js 16 (App Router) + React 19**: Server Components para leer los
  datos directo en el servidor, y Server Actions (`src/app/actions.ts`)
  para las mutaciones (crear, mover de columna, borrar) sin tener que
  escribir endpoints REST aparte.
- **`useOptimistic`** (`src/components/KanbanBoard.tsx`): al cambiar el
  estado de una aplicacion o borrarla, la UI se actualiza al instante,
  sin esperar la respuesta del servidor, y revierte sola si algo falla.
- **`useActionState`** (`src/components/NewApplicationForm.tsx`): maneja
  el estado de envio/errores del formulario sin `useState` manual.
- **Supabase (Postgres)** como base de datos. El esquema vive en
  `supabase/schema.sql`. Al ser de uso personal (un solo usuario) la
  tabla queda abierta con la anon key; si mas adelante compartes la app,
  hay que agregar autenticacion y policies de RLS por usuario.
- **Tailwind CSS v4** para estilos.

## Como correrlo

1. Instala dependencias (hazlo en tu maquina, no en un disco en red, para
   que sea rapido):

   ```bash
   npm install
   ```

2. Crea un proyecto gratis en [supabase.com](https://supabase.com).
3. En el SQL Editor de tu proyecto, corre el contenido de
   `supabase/schema.sql`.
4. Copia `.env.local.example` a `.env.local` y completa
   `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   (Project Settings -> API).
5. Levanta el servidor de desarrollo:

   ```bash
   npm run dev
   ```

6. Abre [http://localhost:3000](http://localhost:3000).

## Roadmap

- [ ] Conectar `src/lib/ai.ts` a la API de Anthropic o OpenAI para
      analizar la vacante pegada en el formulario (streaming de la
      respuesta con Suspense).
- [ ] Boton "Analizar con IA" en cada tarjeta, usando la descripcion
      guardada.
- [ ] Drag and drop real entre columnas (hoy el cambio de estado es con
      un select, a proposito, para no complicar el MVP).
- [ ] Notas por aplicacion (el campo `notes` ya existe en la base de
      datos).
