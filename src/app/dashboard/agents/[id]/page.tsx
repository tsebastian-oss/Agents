import Link from "next/link";
import { ArrowLeft, Bot, BookOpen, PlugZap, Settings2, TestTube2 } from "lucide-react";

export default async function AgentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <header className="dashboard-header compact">
        <div>
          <Link className="back-link" href="/dashboard/agents">
            <ArrowLeft size={16} /> Mis agentes
          </Link>
          <h1>Configurar agente</h1>
          <p>ID: {id}</p>
        </div>
        <span className="status-pill draft">Borrador</span>
      </header>
      <main className="dashboard-content">
        <div className="agent-config-grid">
          {[
            [Settings2, "Instrucciones", "Define objetivo, personalidad y reglas."],
            [BookOpen, "Conocimiento", "Asigna documentos y fuentes autorizadas."],
            [PlugZap, "Herramientas", "Elige acciones e integraciones disponibles."],
            [TestTube2, "Pruebas", "Simula escenarios antes de publicar."],
          ].map(([Icon, title, description]) => {
            const ConfigIcon = Icon as typeof Bot;
            return (
              <article className="feature-card" key={String(title)}>
                <div className="feature-icon"><ConfigIcon size={21} /></div>
                <h3>{String(title)}</h3>
                <p>{String(description)}</p>
              </article>
            );
          })}
        </div>
      </main>
    </>
  );
}
