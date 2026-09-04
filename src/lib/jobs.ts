// Busqueda de vacantes reales en Mexico via Adzuna (developer.adzuna.com).
// Adzuna no tiene un filtro estructurado de "remoto/hibrido": se aproxima
// agregando esas palabras a la busqueda de texto.

export interface JobResult {
  id: string;
  title: string;
  company: string;
  location: string;
  url: string;
  description: string;
}

export type JobModality = "any" | "remote" | "hybrid";

export interface JobSearchOptions {
  query: string;
  city?: string;
  modality?: JobModality;
}

export async function searchJobs({
  query,
  city,
  modality = "any",
}: JobSearchOptions): Promise<JobResult[]> {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;

  if (!appId || !appKey) {
    throw new Error(
      "No hay credenciales de Adzuna configuradas. Agrega ADZUNA_APP_ID y ADZUNA_APP_KEY en tu archivo .env.local."
    );
  }

  const modalityKeyword =
    modality === "remote" ? "remoto" : modality === "hybrid" ? "hibrido" : "";
  const what = [query, modalityKeyword].filter(Boolean).join(" ");

  const params = new URLSearchParams({
    app_id: appId,
    app_key: appKey,
    what,
    results_per_page: "20",
    "content-type": "application/json",
  });

  // Los remotos no estan atados a una ciudad: si se pide remoto, ignoramos
  // el filtro de ubicacion para no descartar vacantes de otras ciudades.
  if (city && modality !== "remote") {
    params.set("where", city);
  }

  const response = await fetch(
    `https://api.adzuna.com/v1/api/jobs/mx/search/1?${params}`
  );

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      `Adzuna respondio con error ${response.status}. ${detail.slice(0, 200)}`
    );
  }

  const data = await response.json();
  type AdzunaResult = {
    id: number | string;
    title: string;
    company?: { display_name?: string };
    location?: { display_name?: string };
    redirect_url: string;
    description?: string;
  };

  return ((data.results ?? []) as AdzunaResult[]).map((r) => ({
    id: String(r.id),
    title: r.title,
    company: r.company?.display_name ?? "Empresa no especificada",
    location: r.location?.display_name ?? "",
    url: r.redirect_url,
    description: r.description ?? "",
  }));
}
