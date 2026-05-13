import { useNavigate } from "react-router-dom";
import "./css/Navbar.css";

function Navbar() {

  const navigate = useNavigate();

  const usuario = (() => {
    const u = localStorage.getItem("usuario");
    return u ? JSON.parse(u) : null;
  })();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("perfil");
    localStorage.removeItem("rutinaCalendario");
    localStorage.removeItem("rutinaGenerada");
    navigate("/login");
  };

  return (
    <nav className="navbar">

      {/* LOGO */}
      <div className="navbar-logo" onClick={() => navigate("/")}>
        <span className="navbar-logo-icono">💪</span>
        <span className="navbar-logo-texto">FitRecommend</span>
      </div>

      {/* LADO DERECHO */}
      {usuario && (
        <div className="navbar-derecha">

          <div className="navbar-perfil">
            <div className="navbar-avatar">
              {usuario.username.charAt(0).toUpperCase()}
            </div>
            <div className="navbar-perfil-info">
              <span className="navbar-username">{usuario.username}</span>
              <span className="navbar-correo">{usuario.correo}</span>
            </div>
          </div>

          <div className="navbar-separador" />

          <button className="navbar-logout" onClick={handleLogout}>
            <span className="navbar-logout-icono">🚪</span>
            <span>Cerrar Sesión</span>
          </button>

        </div>
      )}

    </nav>
  );
}

export default Navbar;