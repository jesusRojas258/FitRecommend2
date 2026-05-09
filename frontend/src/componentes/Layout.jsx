import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Perfil from "../paginas/Perfil";
import "./css/Sidebar.css";

function Layout() {

  const [perfilData, setPerfilData] = useState(() => {
    const p = localStorage.getItem("perfil");
    return p ? JSON.parse(p) : null;
  });

  const [mostrarPerfil, setMostrarPerfil] = useState(false);

  const handlePerfilGuardado = (nuevoPerfil) => {
    setPerfilData(nuevoPerfil);
    setMostrarPerfil(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#0F172A" }}>

      <Navbar />

      {/* padding top igual a la altura del navbar */}
      <div style={{ display: "flex", flex: 1, paddingTop: "64px" }}>

        <Sidebar
          perfilData={perfilData}
          onAbrirPerfil={() => setMostrarPerfil(true)}
        />

        <div style={{ flex: 1, padding: "40px", overflowY: "auto" }}>
          <Outlet />
        </div>

      </div>

      {mostrarPerfil && (
        <div className="perfil-modal-overlay" onClick={() => setMostrarPerfil(false)}>
          <div className="perfil-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="perfil-modal-close" onClick={() => setMostrarPerfil(false)}>
              ✕
            </button>
            <Perfil onGuardado={handlePerfilGuardado} />
          </div>
        </div>
      )}

    </div>
);
}

export default Layout;