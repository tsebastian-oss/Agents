import Link from "next/link";
import { ArrowLeft, Bot, CheckCircle2, Sparkles } from "lucide-react";
import { signIn, signUp } from "@/app/auth/actions";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata = { title: "Ingresar" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const { message } = await searchParams;
  const configured = isSupabaseConfigured();

  return (
    <main className="auth-page">
      <section className="auth-panel auth-story">
        <Link className="brand brand-light" href="/">
          <span className="brand-mark"><Sparkles size={18} /></span>
          <span>Agents</span>
        </Link>
        <div className="auth-story-content">
          <div className="eyebrow eyebrow-dark">El trabajo del futuro</div>
          <h1>Crea tu equipo digital en minutos.</h1>
          <p>
            Cada empresa administra sus propios agentes, información,
            integraciones, reglas y aprobaciones.
          </p>
          <div className="auth-benefits">
            <span><CheckCircle2 size={17} /> Constructor conversacional</span>
            <span><CheckCircle2 size={17} /> Seguridad multiempresa</span>
            <span><CheckCircle2 size={17} /> Control de autonomía y consumo</span>
          </div>
          <div className="floating-agent">
            <div className="floating-icon"><Bot size={24} /></div>
            <div>
              <small>Agente comercial</small>
              <strong>“Ya clasifiqué los 38 leads nuevos.”</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="auth-panel auth-form-panel">
        <div className="auth-form-wrap">
          <Link className="back-link" href="/">
            <ArrowLeft size={16} /> Volver
          </Link>
          <div className="auth-title">
            <h2>Bienvenido a Agents</h2>
            <p>Ingresa o crea tu cuenta para comenzar.</p>
          </div>

          {!configured && (
            <div className="notice notice-warning">
              El frontend está listo. Falta crear y conectar el proyecto de
              Supabase para habilitar cuentas reales.
            </div>
          )}

          {message && <div className="notice">{message}</div>}

          <form className="auth-form">
            <label>
              Correo de trabajo
              <input
                autoComplete="email"
                name="email"
                placeholder="nombre@empresa.cl"
                required
                type="email"
              />
            </label>
            <label>
              Contraseña
              <input
                autoComplete="current-password"
                minLength={8}
                name="password"
                placeholder="Mínimo 8 caracteres"
                required
                type="password"
              />
            </label>
            <button className="button button-primary button-full" formAction={signIn}>
              Ingresar
            </button>
            <button className="button button-secondary button-full" formAction={signUp}>
              Crear cuenta
            </button>
          </form>
          <p className="auth-legal">
            Al continuar aceptas los términos de servicio y la política de
            privacidad.
          </p>
        </div>
      </section>
    </main>
  );
}
