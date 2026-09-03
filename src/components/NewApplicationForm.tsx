"use client";

import { useActionState, useRef, useEffect } from "react";
import { addApplication, type ActionState } from "@/app/actions";

const initialState: ActionState = { error: null };

export function NewApplicationForm() {
  const [state, formAction, isPending] = useActionState(
    addApplication,
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="flex flex-col gap-3 rounded-xl border border-neutral-200 p-4 dark:border-neutral-800"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          name="company"
          placeholder="Empresa"
          required
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-transparent"
        />
        <input
          name="role"
          placeholder="Puesto"
          required
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-transparent"
        />
        <input
          name="job_url"
          placeholder="Link de la vacante (opcional)"
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm sm:col-span-2 dark:border-neutral-700 dark:bg-transparent"
        />
        <textarea
          name="job_description"
          placeholder="Pega aqui la descripcion de la vacante (opcional, la usara el analisis con IA mas adelante)"
          rows={3}
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm sm:col-span-2 dark:border-neutral-700 dark:bg-transparent"
        />
      </div>

      {state.error ? (
        <p className="text-sm text-red-600">{state.error}</p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="self-start rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-neutral-900"
      >
        {isPending ? "Guardando..." : "Agregar aplicacion"}
      </button>
    </form>
  );
}
