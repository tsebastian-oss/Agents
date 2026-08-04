import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Boxes,
  BrainCircuit,
  CheckCircle2,
  Gauge,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";

const capabilities = [
  {
    icon: BrainCircuit,
    title: "Créalo conversando",
    text: "Describe el trabajo. La plataforma convierte tu necesidad en objetivos, reglas y herramientas.",
  },
  {
    icon: Workflow,
    title: "Conéctalo al trabajo real",
    text: "Documentos, correo, CRM, formularios y APIs desde un catálogo autoadministrable.",
  },
  {
    icon: ShieldCheck,
    title: "Controla su autonomía",
    text: "Define qué puede ejecutar, qué necesita aprobación y cuánto puede consumir.",
  },
];

const steps = [
  "Elige una plantilla o describe el cargo",
  "Entrénalo con la información de tu empresa",
  "Prueba situaciones reales antes de publicarlo",
  "Mide tareas, resultados, consumo y ahorro",
];

export default function Home() {
  return (
    <main className="marketing-page">
      <nav className="topbar container">
        <Link className="brand" href="/">
          <span className="brand-mark">
            <Sparkles size={18} />
          </span>
          <span>Agents</span>
        </Link>

        <div className="topbar-actions">
          <a className="text-link hide-mobile" href="#producto">
            Producto
          </a>
          <Link className="button button-secondary" href="/login">
            Ingresar
          </Link>
          <Link className="button button-primary" href="/login">
            Crear mi agente <ArrowRight size={16} />
          </Link>
        </div>
      </nav>

      <section className="hero container">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="pulse-dot" />
            Tu fuerza laboral digital, autoadministrable
          </div>
          <h1>
            Crea agentes de IA que <span>trabajan de verdad.</span>
          </h1>
          <p className="hero-lead">
            Diseña empleados digitales, entrénalos con tus documentos,
            conéctalos con tus herramientas y administra su trabajo sin código
            ni consultores.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary button-large" href="/login">
              Comenzar gratis <ArrowRight size={18} />
            </Link>
            <a className="button button-ghost button-large" href="#producto">
              Ver cómo funciona
            </a>
          </div>
          <div className="trust-line">
            <CheckCircle2 size={16} /> Sin código
            <CheckCircle2 size={16} /> Aprobaciones humanas
            <CheckCircle2 size={16} /> Datos aislados por empresa
          </div>
        </div>

        <div className="hero-visual" aria-label="Vista previa del producto">
          <div className="glow glow-one" />
          <div className="glow glow-two" />
          <div className="product-window">
            <div className="window-top">
              <div className="window-dots"><i /><i /><i /></div>
              <span>Equipo digital</span>
              <span className="live-badge">En línea</span>
            </div>
            <div className="mini-layout">
              <aside className="mini-sidebar">
                <div className="mini-logo"><Sparkles size={14} /></div>
                <div className="mini-nav active" />
                <div className="mini-nav" />
                <div className="mini-nav" />
                <div className="mini-nav" />
              </aside>
              <div className="mini-content">
                <div className="mini-header">
                  <div>
                    <small>Buenos días, Sebastián</small>
                    <strong>Tu equipo está trabajando</strong>
                  </div>
                  <button>+ Nuevo agente</button>
                </div>
                <div className="metric-grid">
                  <div className="metric-card">
                    <Bot size={17} />
                    <span>Agentes activos</span>
                    <b>4</b>
                  </div>
                  <div className="metric-card">
                    <Gauge size={17} />
                    <span>Tareas completadas</span>
                    <b>1.284</b>
                  </div>
                  <div className="metric-card">
                    <Boxes size={17} />
                    <span>Horas ahorradas</span>
                    <b>96 h</b>
                  </div>
                </div>
                <div className="agent-list-card">
                  <div className="list-title">
                    <strong>Agentes recientes</strong>
                    <span>Ver todos</span>
                  </div>
                  {[
                    ["Sofía", "Seguimiento comercial", "Trabajando", "86%"],
                    ["Atlas", "Análisis de campañas", "En espera", "72%"],
                    ["Nora", "Documentos y reportes", "Trabajando", "91%"],
                  ].map(([name, role, status, score]) => (
                    <div className="agent-row" key={name}>
                      <div className="agent-avatar">{name[0]}</div>
                      <div className="agent-info">
                        <strong>{name}</strong>
                        <small>{role}</small>
                      </div>
                      <span className="status-dot">{status}</span>
                      <b>{score}</b>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section container" id="producto">
        <div className="section-heading">
          <div className="eyebrow">Producto</div>
          <h2>Flexible por dentro. Simple por fuera.</h2>
          <p>
            El cliente configura todo mediante una experiencia guiada, mientras
            el sistema administra permisos, versiones y ejecución.
          </p>
        </div>
        <div className="feature-grid">
          {capabilities.map(({ icon: Icon, title, text }) => (
            <article className="feature-card" key={title}>
              <div className="feature-icon"><Icon size={22} /></div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section container">
        <div className="split-card">
          <div>
            <div className="eyebrow">Primer agente</div>
            <h2>De una necesidad a un agente publicado.</h2>
            <p>
              El flujo completo está diseñado para que cualquier empresa pueda
              operar sin soporte técnico.
            </p>
          </div>
          <ol className="steps">
            {steps.map((step, index) => (
              <li key={step}>
                <span>{index + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <footer className="footer container">
        <div className="brand">
          <span className="brand-mark"><Sparkles size={18} /></span>
          <span>Agents</span>
        </div>
        <p>Construido para empresas que quieren trabajar mejor con IA.</p>
      </footer>
    </main>
  );
}
