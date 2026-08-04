"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function createOrganization(formData: FormData) {
  if (!isSupabaseConfigured()) {
    redirect("/dashboard?message=Supabase pendiente");
  }

  const name = String(formData.get("name") ?? "").trim();
  const industry = String(formData.get("industry") ?? "").trim();

  if (name.length < 2) {
    redirect("/dashboard/onboarding?message=Ingresa el nombre de la empresa");
  }

  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (!userId) {
    redirect("/login");
  }

  const slug = `${slugify(name)}-${crypto.randomUUID().slice(0, 6)}`;

  const { error } = await supabase.from("organizations").insert({
    name,
    slug,
    industry: industry || null,
    owner_user_id: userId,
  });

  if (error) {
    redirect(`/dashboard/onboarding?message=${encodeURIComponent(error.message)}`);
  }

  redirect("/dashboard");
}
