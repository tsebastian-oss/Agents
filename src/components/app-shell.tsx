import Link from "next/link";
import {
  BarChart3,
  Blocks,
  Bot,
  BrainCircuit,
  CheckSquare2,
  ChevronDown,
  Gauge,
  LogOut,
  PlugZap,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";
import { signOut } from "@/app/auth/actions";

const nav = [
  { href: "/dashboard", label: "Resumen", icon: Gauge },
  { href: "/dashboard/agents", label: "Mis agentes", icon: Bot },
  { href: "/dashboard/knowledge", label: "Conocimiento", icon: BrainCircuit },
  { href: "/dashboard/integrations", label: "Integraciones", icon: PlugZap },
  { href: "/dashboard/tasks", label: "Tareas", icon: CheckSquare2 },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
];

export function AppShell({
  children,
  demoMode,
}: {
  children: React.ReactNode;
  demoMode: boolean;
}) {
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <Link className="brand sidebar-brand" href="/dashboard">
          <span className="brand-mark"><Sparkles size={18} /></span>
          <span>Agents</span>
        </Link>

        <button className="workspace-switcher" type="button">
          <span className="workspace-avatar">M</span>
          <span>
            <small>Espacio de trabajo</small>
            <strong>MGP</strong>
          </span>
          <ChevronDown size={16} />
        </button>

        <nav className="sidebar-nav">
          <small>TRABAJO</small>
          {nav.map(({ href, label, icon: Icon }) => (
            <Link href={href} key={href}>
              <Icon size={18} /> {label}
            </Link>
          ))}
          <small>ADMINISTRACIÓN</small>
          <Link href="/dashboard/team"><Users size={18} /> Equipo</Link>
          <Link href="/dashboard/settings"><Settings size={18} /> Configuración</Link>
        </nav>

        <div className="sidebar-bottom">
          <div className="usage-card">
            <div><Blocks size={17} /> Consumo mensual</div>
            <div className="usage-bar"><span style={{ width: "36%" }} /></div>
            <small>3.620 de 10.000 créditos</small>
          </div>
          <form action={signOut}>
            <button className="logout-button"><LogOut size={17} /> Cerrar sesión</button>
          </form>
        </div>
      </aside>

      <div className="app-main">
        {demoMode && (
          <div className="demo-banner">
            Modo demostración: conecta Supabase para habilitar datos y usuarios reales.
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
