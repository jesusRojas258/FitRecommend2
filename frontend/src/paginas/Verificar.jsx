import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./css/Auth.css";

function Verificar() {

  const { token }  = useParams();
  const navigate   = useNavigate();
  const [estado, setEstado] = useState("cargando");
  const ejecutado  = useRef(false);

  useEffect(() => {
    if (ejecutado.current) return;
    ejecutado.current = true;

    fetch(`http://localhost:3000/api/auth/verificar/${token}`)
      .then(r => r.json())
      .then(data => setEstado(data.ok ? "ok" : "error"))
      .catch(() => setEstado("error"));
  }, [token]);

  return (
    <div className="auth-bg">

      <div className="auth-decoracion">
        <div className="auth-circulo auth-circulo-1" />
        <div className="auth-circulo auth-circulo-2" />
      </div>

      <div className="auth-card auth-card-exito">

        {estado === "cargando" && (
          <>
            <div className="verificar-spinner-wrap">
              <div className="verificar-spinner" />
            </div>
            <h2>Verificando tu cuenta...</h2>
            <p className="auth-sub">Esto solo tomará un momento.</p>
          </>
        )}

        {estado === "ok" && (
          <>
            <div className="verificar-icono verificar-icono-ok">✓</div>
            <h2>¡Cuenta verificada!</h2>
            <p className="auth-sub">
              Tu cuenta está activa. Ya puedes iniciar sesión y empezar a entrenar.
            </p>
            <div className="auth-exito-pasos">
              <div className="auth-paso">
                <span className="auth-paso-num">✓</span>
                <span>Cuenta creada</span>
              </div>
              <div className="auth-paso">
                <span className="auth-paso-num">✓</span>
                <span>Correo verificado</span>
              </div>
              <div className="auth-paso auth-paso-pendiente">
                <span className="auth-paso-num">3</span>
                <span>Iniciar sesión</span>
              </div>
            </div>
            <button
              className="auth-btn"
              onClick={() => navigate("/login")}
            >
              Ir al login →
            </button>
          </>
        )}

        {estado === "error" && (
          <>
            <div className="verificar-icono verificar-icono-error">✕</div>
            <h2>Enlace inválido</h2>
            <p className="auth-sub">
              El enlace de verificación expiró o ya fue usado.
            </p>
            <div className="verificar-sugerencias">
              <p>¿Qué puedes hacer?</p>
              <ul>
                <li>Revisa si ya verificaste tu cuenta e intenta iniciar sesión</li>
                <li>Regístrate de nuevo si el enlace expiró</li>
              </ul>
            </div>
            <button
              className="auth-btn"
              onClick={() => navigate("/login")}
            >
              Volver al login
            </button>
          </>
        )}

      </div>
    </div>
  );
}

export default Verificar;