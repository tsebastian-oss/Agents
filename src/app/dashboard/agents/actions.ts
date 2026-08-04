"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function createAgent(formData: FormData) {
  if (!isSupabaseConfigured()) {
    redirect("/dashboard/agents/new?message=Conecta Supabase para guardar agentes");
  }

  const name = String(formData.get("name") ?? "").trim();
  const objective = String(formData.get("objective") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const autonomyLevel = String(
    formData.get("autonomy_level") ?? "assistant",
  );

  if (name.length < 2 || objective.length < 10) {
    redirect(
      "/dashboard/agents/new?message=Completa el nombre y un objetivo más específico",
    );
  }

  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (!userId) {
    redirect("/login");
  }

  const { data: memberships } = await supabase
    .from("organization_members")
    .select("organization_id")
    .limit(1);

  const organizationId = memberships?.[0]?.organization_id;

  if (!organizationId) {
    redirect("/dashboard/onboarding");
  }

  const { error } = await supabase.from("agents").insert({
    organization_id: organizationId,
    name,
    description: description || objective,
    objective,
    instructions: `Trabaja para cumplir este objetivo: ${objective}`,
    autonomy_level: autonomyLevel,
    created_by: userId,
  });

  if (error) {
    redirect(`/dashboard/agents/new?message=${encodeURIComponent(error.message)}`);
  }

  redirect("/dashboard/agents");
}
