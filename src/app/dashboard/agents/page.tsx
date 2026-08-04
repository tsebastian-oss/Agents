import Link from "next/link";
import { Bot, Plus, Search, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const demoAgents = [
  { id: "1", name: "Sofía", description: "Seguimiento comercial", status: "active", autonomy_level: "supervised" },
  { id: "2", name: "Atlas", description: "Análisis de marketing", status: "draft", autonomy_level: "assistant" },
  { id: "3", name: "Nora", description: "Reportes y documentos", status: "active", autonomy_level: "supervised" },
];

async function getAgents() {
  if (!isSupabaseConfigured()) return demoAgents;

  const supabase = await createClient();
  const { data: memberships } = await supabase
    .from("organization_members")
    .select("organization_id")
    .limit(1);
  const organizationId = memberships?.[0]?.organization_id;
  if (!organizationId) return [];

  const { data } = await supabase
    .from("agents")
    .select("id,name,description,status,autonomy_level")
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: false });

  return data ?? [];
}

export default async function AgentsPage() {
  const agents = await getAgents();

  return (
    <>
      <header className="dashboard-header">
        <div>
          <p className="page-kicker">Equipo digital</p>
          <h1>Mis agentes</h1>
          <p>Crea, prueba, publica y supervisa cada agente.</p>
        </div>
        <Link className="button button-primary" href="/dashboard/agents/new">
          <Plus size={17} /> Crear agente
        </Link>
      </header>

      <main className="dashboard-content">
        <div className="toolbar">
          <div className="search-box"><Search size={17} /><input placeholder="Buscar agentes" /></div>
          <select defaultValue="all"><option value="all">Todos los estados</option><option>Activos</option><option>Borradores</option></select>
        </div>

        {agents.length === 0 ? (
          <div className="empty-panel">
            <div className="state-icon"><Sparkles size={26} /></div>
            <h2>Aún no tienes agentes</h2>
            <p>Describe una tarea de trabajo y conviértela en tu primer agente.</p>
            <Link className="button button-primary" href="/dashboard/agents/new">
              Crear mi primer agente
            </Link>
          </div>
        ) : (
          <div className="agent-card-grid">
            {agents.map((agent) => (
              <article className="agent-card" key={agent.id}>
                <div className="agent-card-top">
                  <div className="agent-avatar xlarge"><Bot size={22} /></div>
                  <span className={`status-pill ${agent.status}`}>
                    {agent.status === "active" ? "Activo" : "Borrador"}
                  </span>
                </div>
                <h2>{agent.name}</h2>
                <p>{agent.description}</p>
                <div className="agent-meta">
                  <span>Autonomía</span>
                  <strong>{agent.autonomy_level === "supervised" ? "Supervisado" : agent.autonomy_level === "autonomous" ? "Autónomo" : "Asistente"}</strong>
                </div>
                <div className="agent-card-footer">
                  <span>0 ejecuciones hoy</span>
                  <Link href={`/dashboard/agents/${agent.id}`}>Configurar</Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
