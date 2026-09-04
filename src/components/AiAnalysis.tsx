"use client";

import { useActionState, useEffect, useState } from "react";
import { analyzeApplication, type AnalysisState } from "@/app/actions";

const CV_STORAGE_KEY = "job-tracker:cv";
const initialState: AnalysisState = { error: null };

export function AiAnalysis({
  jobDescription,
}: {
  jobDescription: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [cv, setCv] = useState("");
  const [state, formAction, isPending] = useActionState(
    analyzeApplication,
    initialState
  );

  useEffect(() => {
    if (open) {
      setCv(localStorage.getItem(CV_STORAGE_KEY) ?? "");
    }
  }, [open]);

  function handleCvChange(value: string) {
    setCv(value);
    localStorage.setItem(CV_STORAGE_KEY, value);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="self-start text-xs text-blue-600 underline"
      >
        Analizar con IA
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-2 rounded-md border border-neutral-200 p-2 text-xs dark:border-neutral-800">
      <div className="flex items-center justify-between">
        <p className="font-medium">Analisis con IA</p>
        <button
          onClick={() => setOpen(false)}
          className="text-neutral-400 hover:text-neutral-600"
        >
          Cerrar
        </button>
      </div>

      {!jobDescription ? (
        <p className="text-neutral-500">
          Esta aplicacion no tiene descripcion de vacante guardada.
        </p>
      ) : (
        <form action={formAction} className="flex flex-col gap-2">
          <input type="hidden" name="job_description" value={jobDescription} />
          <textarea
            name="cv"
            value={cv}
            onChange={(e) => handleCvChange(e.target.value)}
            placeholder="Pega tu CV aqui (se guarda en este navegador para la proxima vez)"
            rows={4}
            className="rounded-md border border-neutral-300 bg-transparent px-2 py-1 text-xs dark:border-neutral-700"
          />
          <button
            type="submit"
            disabled={isPending || !cv.trim()}
            className="self-start rounded-md bg-neutral-900 px-3 py-1 text-xs font-medium text-white disabled:opacity-50 dark:bg-white dark:text-neutral-900"
          >
            {isPending ? "Analizando..." : "Analizar"}
          </button>
        </form>
      )}

      {state.error ? <p className="text-red-600">{state.error}</p> : null}

      {state.result ? (
        <div className="flex flex-col gap-2 border-t border-neutral-200 pt-2 dark:border-neutral-800">
          <div>
            <p className="font-medium">Habilidades clave</p>
            <ul className="list-disc pl-4 text-neutral-600 dark:text-neutral-400">
              {state.result.keySkills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-medium">Que tanto haces match</p>
            <p className="text-neutral-600 dark:text-neutral-400">
              {state.result.matchSummary}
            </p>
          </div>
          <div>
            <p className="font-medium">Borrador de carta de presentacion</p>
            <p className="whitespace-pre-wrap text-neutral-600 dark:text-neutral-400">
              {state.result.coverLetter}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
