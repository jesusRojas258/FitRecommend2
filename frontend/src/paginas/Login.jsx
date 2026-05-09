import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/Auth.css";

function Login() {

  const navigate = useNavigate();
  const [modo, setModo] = useState("login");

  const [form, setForm] = useState({
    username: "",
    correo:   "",
    password: ""
  });

  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [mostrarPass, setMostrarPass] = useState(false);
  const [errores, setErrores]       = useState({});

  const validarCampo = (name, value) => {
    const nuevosErrores = { ...errores };
    if (name === "correo") {
      if (!value) nuevosErrores.correo = "El correo es obligatorio";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        nuevosErrores.correo = "Correo inválido";
      else delete nuevosErrores.correo;
    }
    if (name === "password") {
      if (!value) nuevosErrores.password = "La contraseña es obligatoria";
      else if (modo === "registro" && value.length < 6)
        nuevosErrores.password = "Mínimo 6 caracteres";
      else delete nuevosErrores.password;
    }
    if (name === "username") {
      if (!value) nuevosErrores.username = "El usuario es obligatorio";
      else if (value.length < 3) nuevosErrores.username = "Mínimo 3 caracteres";
      else delete nuevosErrores.username;
    }
    setErrores(nuevosErrores);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    validarCampo(name, value);
    setError("");
  };

  const handleModo = (nuevoModo) => {
    setModo(nuevoModo);
    setError("");
    setErrores({});
    setForm({ username: "", correo: "", password: "" });
  };

  const handleLogin = async () => {
    if (!form.correo || !form.password) {
      setError("Todos los campos son obligatorios");
      return;
    }
    if (Object.keys(errores).length > 0) return;

    setLoading(true);
    try {
      const res  = await fetch("http://localhost:3000/api/auth/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ correo: form.correo, password: form.password })
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }

      localStorage.setItem("token",   data.token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));
      navigate("/");

    } catch {
      setError("Error de conexión. Verifica tu internet.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegistro = async () => {
    if (!form.username || !form.correo || !form.password) {
      setError("Todos los campos son obligatorios");
      return;
    }
    if (Object.keys(errores).length > 0) return;

    setLoading(true);
    try {
      const res  = await fetch("http://localhost:3000/api/auth/registro", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setModo("exito");

    } catch {
      setError("Error de conexión. Verifica tu internet.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      modo === "login" ? handleLogin() : handleRegistro();
    }
  };

  if (modo === "exito") {
    return (
      <div className="auth-bg">
        <div className="auth-card auth-card-exito">
          <div className="auth-exito-icono">📧</div>
          <h2>¡Revisa tu correo!</h2>
          <p className="auth-sub">
            Enviamos un enlace de verificación a
          </p>
          <span className="auth-correo-destacado">{form.correo}</span>
          <p className="auth-sub">
            Haz clic en el enlace para activar tu cuenta.
          </p>
          <div className="auth-exito-pasos">
            <div className="auth-paso">
              <span className="auth-paso-num">1</span>
              <span>Abre tu correo</span>
            </div>
            <div className="auth-paso">
              <span className="auth-paso-num">2</span>
              <span>Haz clic en "Verificar cuenta"</span>
            </div>
            <div className="auth-paso">
              <span className="auth-paso-num">3</span>
              <span>Inicia sesión</span>
            </div>
          </div>
          <button className="auth-btn" onClick={() => handleModo("login")}>
            Ir al login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-bg">

      {/* FONDO DECORATIVO */}
      <div className="auth-decoracion">
        <div className="auth-circulo auth-circulo-1" />
        <div className="auth-circulo auth-circulo-2" />
      </div>

      <div className="auth-card">

        {/* LOGO */}
        <div className="auth-logo-wrap">
          <span className="auth-logo-icono">💪</span>
          <h1 className="auth-logo">FitRecommend</h1>
          <p className="auth-logo-sub">
            {modo === "login"
              ? "Bienvenido de vuelta"
              : "Crea tu cuenta gratis"}
          </p>
        </div>

        {/* TABS */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${modo === "login" ? "active" : ""}`}
            onClick={() => handleModo("login")}
          >
            Iniciar sesión
          </button>
          <button
            className={`auth-tab ${modo === "registro" ? "active" : ""}`}
            onClick={() => handleModo("registro")}
          >
            Registrarse
          </button>
        </div>

        {/* FORMULARIO */}
        <div className="auth-form" onKeyDown={handleKeyDown}>

          {modo === "registro" && (
            <div className="auth-campo">
              <label>Nombre de usuario</label>
              <input
                type="text"
                name="username"
                placeholder="tu_username"
                value={form.username}
                onChange={handleChange}
                className={errores.username ? "input-error" : ""}
                autoComplete="username"
              />
              {errores.username && (
                <span className="auth-campo-error">{errores.username}</span>
              )}
            </div>
          )}

          <div className="auth-campo">
            <label>Correo electrónico</label>
            <input
              type="email"
              name="correo"
              placeholder="correo@ejemplo.com"
              value={form.correo}
              onChange={handleChange}
              className={errores.correo ? "input-error" : ""}
              autoComplete="email"
            />
            {errores.correo && (
              <span className="auth-campo-error">{errores.correo}</span>
            )}
          </div>

          <div className="auth-campo">
            <label>Contraseña</label>
            <div className="auth-pass-wrap">
              <input
                type={mostrarPass ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className={errores.password ? "input-error" : ""}
                autoComplete={modo === "login" ? "current-password" : "new-password"}
              />
              <button
                type="button"
                className="auth-pass-toggle"
                onClick={() => setMostrarPass(p => !p)}
                tabIndex={-1}
              >
                {mostrarPass ? "🙈" : "👁"}
              </button>
            </div>
            {errores.password && (
              <span className="auth-campo-error">{errores.password}</span>
            )}
            {modo === "registro" && form.password && (
              <div className="auth-pass-strength">
                <div className={`auth-pass-bar ${
                  form.password.length >= 10 ? "fuerte" :
                  form.password.length >= 6  ? "media"  : "debil"
                }`} />
                <span className="auth-pass-label">
                  {form.password.length >= 10 ? "Contraseña fuerte" :
                   form.password.length >= 6  ? "Contraseña aceptable" :
                   "Contraseña débil"}
                </span>
              </div>
            )}
          </div>

          {error && (
            <div className="auth-error">
              <span>⚠️</span> {error}
            </div>
          )}

          <button
            className="auth-btn"
            onClick={modo === "login" ? handleLogin : handleRegistro}
            disabled={loading || Object.keys(errores).length > 0}
          >
            {loading ? (
              <span className="auth-spinner" />
            ) : modo === "login" ? "Iniciar sesión" : "Crear cuenta"}
          </button>

          <p className="auth-switch">
            {modo === "login"
              ? "¿No tienes cuenta?"
              : "¿Ya tienes cuenta?"}
            <button
              className="auth-switch-btn"
              onClick={() => handleModo(modo === "login" ? "registro" : "login")}
            >
              {modo === "login" ? "Regístrate" : "Inicia sesión"}
            </button>
          </p>

        </div>

      </div>
    </div>
  );
}

export default Login;