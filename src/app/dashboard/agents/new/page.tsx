import Link from "next/link";
import { ArrowLeft, Bot, Info, Sparkles } from "lucide-react";
import { createAgent } from "@/app/dashboard/agents/actions";

export default async function NewAgentPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const { message } = await searchParams;

  return (
    <>
      <header className="dashboard-header compact">
        <div>
          <Link className="back-link" href="/dashboard/agents">
            <ArrowLeft size={16} /> Mis agentes
          </Link>
          <h1>Crea tu primer agente</h1>
          <p>Comienza por el cargo y el resultado que debe producir.</p>
        </div>
      </header>

      <main className="dashboard-content builder-layout">
        <form className="panel builder-form" action={createAgent}>
          <div className="form-section">
            <div className="section-number">1</div>
            <div className="form-section-body">
              <h2>Identidad y propósito</h2>
              <p>Dale un nombre y explica qué trabajo debe resolver.</p>
              {message && <div className="notice">{message}</div>}
              <div className="form-grid">
                <label>
                  Nombre del agente
                  <input name="name" placeholder="Ej. Sofía" required />
                </label>
                <label>
                  Rol o descripción breve
                  <input
                    name="description"
                    placeholder="Ej. Asistente comercial"
                  />
                </label>
              </div>
              <label>
                Objetivo principal
                <textarea
                  name="objective"
                  placeholder="Ej. Revisar todos los leads nuevos, calificarlos y preparar un seguimiento para el ejecutivo correspondiente."
                  required
                  rows={5}
                />
              </label>
            </div>
          </div>

          <div className="form-section">
            <div className="section-number">2</div>
            <div className="form-section-body">
              <h2>Nivel de autonomía</h2>
              <p>Podrás cambiar permisos y aprobaciones después.</p>
              <div className="radio-cards">
                <label>
                  <input defaultChecked name="autonomy_level" type="radio" value="assistant" />
                  <span><strong>Asistente</strong><small>Analiza y prepara acciones.</small></span>
                </label>
                <label>
                  <input name="autonomy_level" type="radio" value="supervised" />
                  <span><strong>Supervisado</strong><small>Ejecuta después de aprobación.</small></span>
                </label>
                <label>
                  <input name="autonomy_level" type="radio" value="autonomous" />
                  <span><strong>Autónomo</strong><small>Actúa dentro de reglas definidas.</small></span>
                </label>
              </div>
            </div>
          </div>

          <div className="form-footer">
            <span><Info size={15} /> Se guardará como borrador.</span>
            <button className="button button-primary">
              Crear borrador <Sparkles size={17} />
            </button>
          </div>
        </form>

        <aside className="panel builder-preview">
          <div className="agent-orb"><Bot size={30} /></div>
          <div className="eyebrow">Vista previa</div>
          <h2>Tu nuevo agente</h2>
          <p>
            Después de crearlo podrás agregar documentos, herramientas,
            activadores, pruebas y criterios de éxito.
          </p>
          <div className="preview-checklist">
            <span>1. Identidad y objetivo</span>
            <span>2. Conocimiento</span>
            <span>3. Herramientas</span>
            <span>4. Pruebas</span>
            <span>5. Publicación</span>
          </div>
        </aside>
      </main>
    </>
  );
}
