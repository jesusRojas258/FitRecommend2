import "./css/Sidebar.css";
import { useNavigate, useLocation } from "react-router-dom";

function Sidebar({ perfilData, onAbrirPerfil }) {

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("perfil");
    localStorage.removeItem("rutinaCalendario");
    localStorage.removeItem("rutinaGenerada");
    navigate("/login");
  };

  const objetivoLabel = {
    musculo:      "Ganar músculo",
    perder_grasa: "Perder grasa",
    resistencia:  "Resistencia"
  };

  const links = [
    { path: "/",            icon: "🏠", label: "Inicio"      },
    { path: "/rutinas",     icon: "⚡", label: "Rutinas"     },
    { path: "/calendario",  icon: "📅", label: "Calendario"  },
    { path: "/mis-rutinas", icon: "📋", label: "Mis rutinas" },
  ];

  const usuario = (() => {
    const u = localStorage.getItem("usuario");
    return u ? JSON.parse(u) : null;
  })();

  return (
    <aside className="sidebar">

      {/* PERFIL */}
      {perfilData ? (
        <div className="sidebar-perfil-card" onClick={onAbrirPerfil}>
          <div className="sidebar-perfil-avatar">
            {perfilData.nombre.charAt(0).toUpperCase()}
          </div>
          <div className="sidebar-perfil-info">
            <span className="sidebar-perfil-nombre">{perfilData.nombre}</span>
            <span className="sidebar-perfil-nivel">{perfilData.nivel}</span>
            <span className="sidebar-perfil-objetivo">
              {objetivoLabel[perfilData.objetivo] || perfilData.objetivo}
            </span>
          </div>
          <span className="sidebar-perfil-edit">✏️</span>
        </div>
      ) : (
        <div
          className="sidebar-perfil-card sidebar-perfil-vacio"
          onClick={onAbrirPerfil}
        >
          <div className="sidebar-perfil-avatar sidebar-perfil-avatar-vacio">
            {usuario?.username?.charAt(0).toUpperCase() ?? "?"}
          </div>
          <div className="sidebar-perfil-info">
            <span className="sidebar-perfil-nombre">
              {usuario?.username ?? "Usuario"}
            </span>
            <span className="sidebar-perfil-completar">Completar perfil →</span>
          </div>
        </div>
      )}

      <div className="sidebar-divider" />

      {/* NAVEGACIÓN */}
      <p className="sidebar-seccion">Navegación</p>

      {links.map((link) => {
        const activo = location.pathname === link.path;
        return (
          <button
            key={link.path}
            className={`sidebar-btn ${activo ? "active" : ""}`}
            onClick={() => navigate(link.path)}
          >
            <span className="sidebar-btn-icon">{link.icon}</span>
            <span className="sidebar-btn-label">{link.label}</span>
            {activo && <span className="sidebar-btn-dot" />}
          </button>
        );
      })}

    </aside>
  );
}

export default Sidebar;