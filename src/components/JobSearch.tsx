"use client";

import { startTransition, useActionState, useState } from "react";
import {
  searchJobsAction,
  addApplicationFromJob,
  type JobSearchState,
} from "@/app/actions";

const initialState: JobSearchState = { error: null, results: [] };

const COMMON_CITIES = [
  "Ciudad de México",
  "Guadalajara",
  "Monterrey",
  "Puebla",
  "Querétaro",
  "Tijuana",
  "Mérida",
  "León",
];

export function JobSearch() {
  const [state, formAction, isPending] = useActionState(
    searchJobsAction,
    initialState
  );
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [addingId, setAddingId] = useState<string | null>(null);
  const [modality, setModality] = useState<"any" | "remote" | "hybrid">("any");

  function handleAdd(job: (typeof state.results)[number]) {
    setAddingId(job.id);
    startTransition(async () => {
      await addApplicationFromJob({
        company: job.company,
        role: job.title,
        job_url: job.url,
        job_description: job.description,
      });
      setAddedIds((prev) => new Set(prev).add(job.id));
      setAddingId(null);
    });
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
      <h2 className="text-sm font-semibold">Buscar vacantes (Mexico)</h2>
      <form action={formAction} className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <input
          name="query"
          defaultValue="desarrollador web"
          placeholder="Ej. desarrollador web, frontend, react"
          className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-transparent"
        />
        <input
          name="city"
          list="mx-cities"
          placeholder="Ciudad (opcional)"
          disabled={modality === "remote"}
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm disabled:opacity-50 sm:w-48 dark:border-neutral-700 dark:bg-transparent"
        />
        <datalist id="mx-cities">
          {COMMON_CITIES.map((city) => (
            <option key={city} value={city} />
          ))}
        </datalist>
        <select
          name="modality"
          value={modality}
          onChange={(e) => setModality(e.target.value as typeof modality)}
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm sm:w-40 dark:border-neutral-700 dark:bg-transparent"
        >
          <option value="any">Cualquier modalidad</option>
          <option value="remote">Remoto</option>
          <option value="hybrid">Híbrido</option>
        </select>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-neutral-900"
        >
          {isPending ? "Buscando..." : "Buscar"}
        </button>
      </form>

      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}

      {state.results.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {state.results.map((job) => {
            const added = addedIds.has(job.id);
            return (
              <li
                key={job.id}
                className="flex items-start justify-between gap-3 rounded-lg border border-neutral-200 p-3 text-sm dark:border-neutral-800"
              >
                <div>
                  <p className="font-medium">{job.title}</p>
                  <p className="text-neutral-500">
                    {job.company}
                    {job.location ? ` · ${job.location}` : ""}
                  </p>
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-600 underline"
                  >
                    Ver vacante
                  </a>
                </div>
                <button
                  onClick={() => handleAdd(job)}
                  disabled={added || addingId === job.id}
                  className="shrink-0 rounded-md border border-neutral-300 px-3 py-1 text-xs font-medium disabled:opacity-50 dark:border-neutral-700"
                >
                  {added
                    ? "Agregada"
                    : addingId === job.id
                      ? "Agregando..."
                      : "Agregar al tablero"}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
