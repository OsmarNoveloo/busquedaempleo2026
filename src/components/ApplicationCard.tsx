"use client";

import type { ApplicationStatus, JobApplication } from "@/lib/types";
import { STATUS_COLUMNS } from "@/lib/types";

export function ApplicationCard({
  application,
  onStatusChange,
  onDelete,
}: {
  application: JobApplication;
  onStatusChange: (id: string, status: ApplicationStatus) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-neutral-200 bg-white p-3 text-sm shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-medium">{application.role}</p>
          <p className="text-neutral-500">{application.company}</p>
        </div>
        <button
          onClick={() => onDelete(application.id)}
          className="text-xs text-neutral-400 hover:text-red-600"
          aria-label="Eliminar"
        >
          ✕
        </button>
      </div>

      {application.job_url ? (
        <a
          href={application.job_url}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-blue-600 underline"
        >
          Ver vacante
        </a>
      ) : null}

      <select
        value={application.status}
        onChange={(e) =>
          onStatusChange(application.id, e.target.value as ApplicationStatus)
        }
        className="rounded-md border border-neutral-300 bg-transparent px-2 py-1 text-xs dark:border-neutral-700"
      >
        {STATUS_COLUMNS.map((col) => (
          <option key={col.id} value={col.id}>
            {col.label}
          </option>
        ))}
      </select>
    </div>
  );
}
