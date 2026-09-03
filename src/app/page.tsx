import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { JobApplication } from "@/lib/types";
import { KanbanBoard } from "@/components/KanbanBoard";
import { NewApplicationForm } from "@/components/NewApplicationForm";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return (
      <main className="mx-auto max-w-2xl p-8">
        <h1 className="text-xl font-semibold">Falta configurar Supabase</h1>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-neutral-600 dark:text-neutral-400">
          <li>Crea un proyecto gratis en supabase.com</li>
          <li>
            Corre el contenido de <code>supabase/schema.sql</code> en el SQL
            Editor de tu proyecto
          </li>
          <li>
            Copia <code>.env.local.example</code> a <code>.env.local</code> y
            pega tu Project URL y anon key (Settings → API)
          </li>
          <li>
            Reinicia <code>npm run dev</code>
          </li>
        </ol>
      </main>
    );
  }

  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="mx-auto max-w-3xl p-8">
        <h1 className="text-xl font-semibold text-red-600">
          No se pudo leer de Supabase
        </h1>
        <p className="mt-2 text-sm text-neutral-500">{error.message}</p>
        <p className="mt-4 text-sm text-neutral-500">
          Revisa que hayas corrido supabase/schema.sql en tu proyecto.
        </p>
      </main>
    );
  }

  const applications = (data ?? []) as JobApplication[];

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Job Tracker</h1>
        <p className="text-sm text-neutral-500">
          Tu busqueda de empleo, organizada.
        </p>
      </header>

      <NewApplicationForm />

      <KanbanBoard initialApplications={applications} />
    </main>
  );
}
