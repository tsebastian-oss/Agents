import { Users, Construction } from "lucide-react";

export default function Page() {
  return (
    <>
      <header className="dashboard-header">
        <div>
          <p className="page-kicker">Primera versión</p>
          <h1>Equipo</h1>
          <p>Invita usuarios y administra roles por espacio de trabajo.</p>
        </div>
      </header>
      <main className="dashboard-content">
        <div className="empty-panel">
          <div className="state-icon"><Users size={26} /></div>
          <h2>Módulo preparado</h2>
          <p>La estructura y navegación ya están creadas. Esta funcionalidad se activará en la siguiente tanda.</p>
          <span className="coming-tag"><Construction size={15} /> Próximamente</span>
        </div>
      </main>
    </>
  );
}
