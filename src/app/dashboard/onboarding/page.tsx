import { Building2, Sparkles } from "lucide-react";
import { createOrganization } from "@/app/dashboard/onboarding/actions";

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const { message } = await searchParams;

  return (
    <main className="focused-page">
      <div className="focused-card">
        <div className="state-icon"><Building2 size={27} /></div>
        <div className="eyebrow">Paso 1 de 2</div>
        <h1>Configura tu empresa</h1>
        <p>
          Este espacio mantendrá separados tus agentes, documentos,
          integraciones, usuarios y consumo.
        </p>
        {message && <div className="notice">{message}</div>}
        <form className="stack-form" action={createOrganization}>
          <label>
            Nombre de la empresa
            <input name="name" placeholder="Ej. MGP" required />
          </label>
          <label>
            Industria
            <select name="industry" defaultValue="">
              <option value="" disabled>Selecciona una opción</option>
              <option>Servicios profesionales</option>
              <option>Automotriz</option>
              <option>Retail</option>
              <option>Educación</option>
              <option>Inmobiliario</option>
              <option>Otra</option>
            </select>
          </label>
          <button className="button button-primary button-full">
            Crear espacio <Sparkles size={17} />
          </button>
        </form>
      </div>
    </main>
  );
}
