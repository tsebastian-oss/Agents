import Link from "next/link";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Clock3,
  Plus,
  Sparkles,
  TriangleAlert,
  Zap,
} from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

const demoAgents = [
  {
    id: "demo-1",
    name: "Sofía",
    description: "Califica leads y prepara seguimientos comerciales.",
    status: "active",
    autonomy_level: "supervised",
  },
  {
    id: "demo-2",
    name: "Atlas",
    description: "Analiza campañas y detecta oportunidades de optimización.",
    status: "draft",
    autonomy_level: "assistant",
  },
  {
    id: "demo-3",
    name: "Nora",
    description: "Resume documentos y crea reportes ejecutivos.",
    status: "active",
    autonomy_level: "supervised",
  },
];

async function getDashboardData() {
  if (!isSupabaseConfigured()) {
    return { agents: demoAgents, hasOrganization: true };
  }

  const supabase = await createClient();
  const { data: memberships } = await supabase
    .from("organization_members")
    .select("organization_id")
    .limit(1);

  const organizationId = memberships?.[0]?.organization_id;

  if (!organizationId) {
    return { agents: [], hasOrganization: false };
  }

  const { data: agents } = await supabase
    .from("agents")
    .select("id,name,description,status,autonomy_level")
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: false })
    .limit(5);

  return { agents: agents ?? [], hasOrganization: true };
}

export default async function DashboardPage() {
  const { agents, hasOrganization } = await getDashboardData();

  if (!hasOrganization) {
    return (
      <div className="centered-state">
        <div className="state-icon"><Sparkles size={28} /></div>
        <h1>Crea tu espacio de trabajo</h1>
        <p>
          Configura tu empresa antes de crear agentes, invitar personas o
          conectar herramientas.
        </p>
        <Link className="button button-primary" href="/dashboard/onboarding">
          Configurar empresa <ArrowRight size={17} />
        </Link>
      </div>
    );
  }

  return (
    <>
      <header className="dashboard-header">
        <div>
          <p className="page-kicker">Martes, 4 de agosto</p>
          <h1>Buenos días, Sebastián</h1>
          <p>Esto es lo que está haciendo tu equipo digital.</p>
        </div>
        <Link className="button button-primary" href="/dashboard/agents/new">
          <Plus size={17} /> Crear agente
        </Link>
      </header>

      <main className="dashboard-content">
        <section className="stats-grid">
          <article className="stat-card">
            <div className="stat-icon"><Bot size={20} /></div>
            <div><span>Agentes</span><strong>{agents.length}</strong></div>
            <small><CheckCircle2 size={14} /> {agents.filter((a) => a.status === "active").length} activos</small>
          </article>
          <article className="stat-card">
            <div className="stat-icon"><Zap size={20} /></div>
            <div><span>Tareas completadas</span><strong>1.284</strong></div>
            <small className="positive">+18% este mes</small>
          </article>
          <article className="stat-card">
            <div className="stat-icon"><Clock3 size={20} /></div>
            <div><span>Tiempo ahorrado</span><strong>96 h</strong></div>
            <small>Estimación mensual</small>
          </article>
          <article className="stat-card">
            <div className="stat-icon"><TriangleAlert size={20} /></div>
            <div><span>Requieren atención</span><strong>3</strong></div>
            <small>2 aprobaciones · 1 error</small>
          </article>
        </section>

        <section className="dashboard-grid">
          <article className="panel panel-wide">
            <div className="panel-heading">
              <div><h2>Mis agentes</h2><p>Actividad y desempeño reciente.</p></div>
              <Link href="/dashboard/agents">Ver todos <ArrowRight size={15} /></Link>
            </div>

            <div className="agents-table">
              {agents.map((agent, index) => (
                <div className="agents-table-row" key={agent.id}>
                  <div className="agent-avatar large">{agent.name.slice(0, 1)}</div>
                  <div className="agent-info">
                    <strong>{agent.name}</strong>
                    <small>{agent.description}</small>
                  </div>
                  <span className={`status-pill ${agent.status}`}>
                    {agent.status === "active" ? "Activo" : "Borrador"}
                  </span>
                  <div className="agent-progress">
                    <span><i style={{ width: `${82 - index * 8}%` }} /></span>
                    <small>{82 - index * 8}% éxito</small>
                  </div>
                  <button className="icon-button">•••</button>
                </div>
              ))}
            </div>
          </article>

          <aside className="panel">
            <div className="panel-heading">
              <div><h2>Aprobaciones</h2><p>Acciones pendientes.</p></div>
            </div>
            <div className="approval-list">
              <div className="approval-item">
                <span className="approval-icon"><Bot size={18} /></span>
                <div><strong>Sofía quiere enviar 12 correos</strong><small>Hace 8 minutos</small></div>
              </div>
              <div className="approval-item">
                <span className="approval-icon"><Bot size={18} /></span>
                <div><strong>Nora preparó el reporte semanal</strong><small>Hace 34 minutos</small></div>
              </div>
            </div>
            <Link className="button button-secondary button-full" href="/dashboard/tasks">
              Revisar aprobaciones
            </Link>
          </aside>
        </section>
      </main>
    </>
  );
}
