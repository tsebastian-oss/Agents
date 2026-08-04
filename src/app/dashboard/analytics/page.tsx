import { BarChart3, Construction } from "lucide-react";

export default function Page() {
  return (
    <>
      <header className="dashboard-header">
        <div>
          <p className="page-kicker">Primera versión</p>
          <h1>Analytics</h1>
          <p>Mide productividad, consumo, resultados y ahorro generado.</p>
        </div>
      </header>
      <main className="dashboard-content">
        <div className="empty-panel">
          <div className="state-icon"><BarChart3 size={26} /></div>
          <h2>Módulo preparado</h2>
          <p>La estructura y navegación ya están creadas. Esta funcionalidad se activará en la siguiente tanda.</p>
          <span className="coming-tag"><Construction size={15} /> Próximamente</span>
        </div>
      </main>
    </>
  );
}
