"use client";

import { startTransition, useOptimistic } from "react";
import type { ApplicationStatus, JobApplication } from "@/lib/types";
import { STATUS_COLUMNS } from "@/lib/types";
import { updateApplicationStatus, deleteApplication } from "@/app/actions";
import { ApplicationCard } from "@/components/ApplicationCard";

type OptimisticUpdate = {
  id: string;
  status?: ApplicationStatus;
  remove?: boolean;
};

export function KanbanBoard({
  initialApplications,
}: {
  initialApplications: JobApplication[];
}) {
  const [applications, setOptimisticApplications] = useOptimistic(
    initialApplications,
    (current: JobApplication[], update: OptimisticUpdate) => {
      if (update.remove) {
        return current.filter((app) => app.id !== update.id);
      }
      return current.map((app) =>
        app.id === update.id && update.status
          ? { ...app, status: update.status }
          : app
      );
    }
  );

  function handleStatusChange(id: string, status: ApplicationStatus) {
    startTransition(async () => {
      setOptimisticApplications({ id, status });
      await updateApplicationStatus(id, status);
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      setOptimisticApplications({ id, remove: true });
      await deleteApplication(id);
    });
  }

  return (
    <div className="grid flex-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {STATUS_COLUMNS.map((column) => {
        const items = applications.filter((app) => app.status === column.id);
        return (
          <div
            key={column.id}
            className="flex flex-col gap-3 rounded-xl bg-neutral-50 p-3 dark:bg-neutral-900"
          >
            <h2 className="flex items-center justify-between text-sm font-semibold text-neutral-600 dark:text-neutral-300">
              {column.label}
              <span className="rounded-full bg-neutral-200 px-2 py-0.5 text-xs dark:bg-neutral-800">
                {items.length}
              </span>
            </h2>
            <div className="flex flex-col gap-2">
              {items.map((app) => (
                <ApplicationCard
                  key={app.id}
                  application={app}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
