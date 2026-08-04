"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

function loginError(message: string): never {
  redirect(`/login?message=${encodeURIComponent(message)}`);
}

export async function signIn(formData: FormData) {
  if (!isSupabaseConfigured()) {
    loginError("Primero debemos conectar el proyecto de Supabase.");
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    loginError("Ingresa tu correo y contraseña.");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    loginError(error.message);
  }

  redirect("/dashboard");
}

export async function signUp(formData: FormData) {
  if (!isSupabaseConfigured()) {
    loginError("Primero debemos conectar el proyecto de Supabase.");
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || password.length < 8) {
    loginError("Usa un correo válido y una contraseña de al menos 8 caracteres.");
  }

  const headerStore = await headers();
  const origin =
    headerStore.get("origin") ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000";

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    loginError(error.message);
  }

  redirect(
    "/login?message=Cuenta creada. Revisa tu correo para confirmar el acceso.",
  );
}

export async function signOut() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }

  redirect("/");
}
