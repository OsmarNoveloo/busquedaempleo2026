"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";
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
