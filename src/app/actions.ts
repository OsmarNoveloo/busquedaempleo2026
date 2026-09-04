"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { analyzeJobDescription, type JobAnalysis } from "@/lib/ai";
import { searchJobs, type JobModality, type JobResult } from "@/lib/jobs";
import type { ApplicationStatus } from "@/lib/types";

export type ActionState = { error: string | null; success?: boolean };

export async function addApplication(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const company = String(formData.get("company") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim();
  const job_url = String(formData.get("job_url") ?? "").trim();
  const job_description = String(formData.get("job_description") ?? "").trim();

  if (!company || !role) {
    return { error: "Empresa y puesto son obligatorios." };
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return { error: "Supabase no esta configurado. Revisa tu archivo .env.local." };
  }

  const { error } = await supabase.from("applications").insert({
    company,
    role,
    job_url: job_url || null,
    job_description: job_description || null,
    status: "wishlist",
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  return { error: null, success: true };
}

export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus
) {
  const supabase = getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase no esta configurado.");

  const { error } = await supabase
    .from("applications")
    .update({ status })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/");
}

export async function deleteApplication(id: string) {
  const supabase = getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase no esta configurado.");

  const { error } = await supabase.from("applications").delete().eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/");
}

export async function updateNotes(id: string, notes: string) {
  const supabase = getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase no esta configurado.");

  const { error } = await supabase
    .from("applications")
    .update({ notes })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/");
}

export type AnalysisState = {
  error: string | null;
  result?: JobAnalysis;
};

export async function analyzeApplication(
  _prevState: AnalysisState,
  formData: FormData
): Promise<AnalysisState> {
  const jobDescription = String(formData.get("job_description") ?? "");
  const cv = String(formData.get("cv") ?? "");

  try {
    const result = await analyzeJobDescription(jobDescription, cv);
    return { error: null, result };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Error desconocido." };
  }
}

export type JobSearchState = {
  error: string | null;
  results: JobResult[];
};

export async function searchJobsAction(
  _prevState: JobSearchState,
  formData: FormData
): Promise<JobSearchState> {
  const query = String(formData.get("query") ?? "").trim() || "desarrollador web";
  const city = String(formData.get("city") ?? "").trim();
  const modality = String(formData.get("modality") ?? "any") as JobModality;

  try {
    const results = await searchJobs({ query, city, modality });
    return { error: null, results };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Error desconocido.",
      results: [],
    };
  }
}

export async function addApplicationFromJob(job: {
  company: string;
  role: string;
  job_url: string;
  job_description: string;
}) {
  const supabase = getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase no esta configurado.");

  const { error } = await supabase.from("applications").insert({
    company: job.company,
    role: job.role,
    job_url: job.job_url || null,
    job_description: job.job_description || null,
    status: "wishlist",
  });

  if (error) throw new Error(error.message);

  revalidatePath("/");
}
