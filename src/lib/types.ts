export type ApplicationStatus =
  | "wishlist"
  | "applied"
  | "interview"
  | "offer"
  | "rejected";

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  status: ApplicationStatus;
  job_url: string | null;
  job_description: string | null;
  notes: string | null;
  applied_at: string | null;
  created_at: string;
}

export const STATUS_COLUMNS: { id: ApplicationStatus; label: string }[] = [
  { id: "wishlist", label: "Por aplicar" },
  { id: "applied", label: "Aplicado" },
  { id: "interview", label: "Entrevista" },
  { id: "offer", label: "Oferta" },
  { id: "rejected", label: "Rechazado" },
];
