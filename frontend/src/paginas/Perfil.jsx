import "../paginas/css/Perfil.css";
import { useState, useEffect } from "react";
import { apiFetch } from "../utils/api";

function Perfil({ onGuardado }) {

  const [form, setForm] = useState({
    nombre:   "",
    edad:     "",
    peso:     "",
    altura:   "",
    objetivo: "",
    nivel:    "",
    dias:     "",
    lesiones: ""
  });

  const [guardado, setGuardado]   = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [exito, setExito]         = useState(false);
  const [cargando, setCargando]   = useState(true);

  useEffect(() => {
    // Primero intenta cargar desde la BD
    apiFetch("/auth/perfil")
      .then(r => r.json())
      .then(data => {
        if (data.perfil) {
          const d = data.perfil;
          const perfil = {
            nombre:   d.nombre   || "",
            edad:     d.edad     || "",
            peso:     d.peso     || "",
            altura:   d.altura   || "",
            objetivo: d.objetivo || "",
            nivel:    d.nivel    || "",
            dias:     d.dias     || "",
            lesiones: d.lesiones || ""
          };
          setForm(perfil);
          localStorage.setItem("perfil", JSON.stringify(perfil));
          setGuardado(true);
        } else {
          // Fallback a localStorage
          const local = localStorage.getItem("perfil");
          if (local) {
            const d = JSON.parse(local);
            setForm({
              nombre:   d.nombre   || "",
              edad:     d.edad     || "",
              peso:     d.peso     || "",
              altura:   d.altura   || "",
              objetivo: d.objetivo || "",
              nivel:    d.nivel    || "",
              dias:     d.dias     || "",
              lesiones: d.lesiones || ""
            });
            setGuardado(true);
          }
        }
      })
      .catch(() => {
        // Fallback a localStorage si falla la BD
        const local = localStorage.getItem("perfil");
        if (local) {
          const d = JSON.parse(local);
          setForm({
            nombre:   d.nombre   || "",
            edad:     d.edad     || "",
            peso:     d.peso     || "",
            altura:   d.altura   || "",
            objetivo: d.objetivo || "",
            nivel:    d.nivel    || "",
            dias:     d.dias     || "",
            lesiones: d.lesiones || ""
          });
          setGuardado(true);
        }
      })
      .finally(() => setCargando(false));
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (guardado) {
      setGuardado(false);
      setExito(false);
      return;
    }

    setGuardando(true);

    const perfil = {
      ...form,
      fechaInicio: new Date().toISOString().split("T")[0]
    };

    try {
      // Guarda en BD
      await apiFetch("/auth/perfil", {
        method: "POST",
        body:   JSON.stringify(perfil)
      });

      // Sincroniza localStorage
      localStorage.setItem("perfil", JSON.stringify(perfil));

      setGuardado(true);
      setExito(true);
      setTimeout(() => setExito(false), 3000);
      if (onGuardado) onGuardado(perfil);

    } catch {
      alert("Error guardando el perfil");
    } finally {
      setGuardando(false);
    }
  };

  const campos = [
    { name: "nombre",   label: "Nombre completo", type: "text",   placeholder: "Tu nombre", icon: "👤" },
    { name: "edad",     label: "Edad",            type: "number", placeholder: "Años",      icon: "🎂", min: "1",  max: "120" },
    { name: "peso",     label: "Peso",            type: "number", placeholder: "kg",        icon: "⚖️", min: "1",  max: "300" },
    { name: "altura",   label: "Altura",          type: "number", placeholder: "cm",        icon: "📏", min: "50", max: "250" },
    { name: "dias",     label: "Días por semana", type: "number", placeholder: "1 - 7",     icon: "📆", min: "1",  max: "7"   },
    { name: "lesiones", label: "Lesiones",        type: "text",   placeholder: "Ninguna",   icon: "🩹", required: false },
  ];

  if (cargando) return (
    <div className="perfil-container">
      <div className="perfil-titulo">
        <h2>Cargando perfil...</h2>
        <p className="perfil-sub">Obteniendo tus datos</p>
      </div>
    </div>
  );

  return (
    <div className="perfil-container">

      <div className="perfil-titulo">
        <h2>{guardado ? "Tu perfil" : "Completa tu perfil"}</h2>
        <p className="perfil-sub">
          {guardado
            ? "Tus datos se usan para personalizar tu rutina"
            : "Necesitamos estos datos para generar tu rutina perfecta"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="perfil-form">

        <div className="perfil-grid">
          {campos.map((campo) => (
            <div key={campo.name} className="perfil-campo">
              <label>
                <span className="perfil-campo-icon">{campo.icon}</span>
                {campo.label}
              </label>
              <input
                type={campo.type}
                name={campo.name}
                placeholder={campo.placeholder}
                value={form[campo.name]}
                onChange={handleChange}
                disabled={guardado}
                required={campo.required !== false}
                min={campo.min}
                max={campo.max}
                onKeyDown={(e) => {
                  if (campo.type === "number" && ["-", "+", "e", "E"].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
            </div>
          ))}
        </div>

        <div className="perfil-selects">

          <div className="perfil-campo">
            <label><span className="perfil-campo-icon">🎯</span> Objetivo</label>
            <div className="perfil-opciones">
              {[
                { value: "musculo",      label: "Ganar músculo", icon: "💪" },
                { value: "perder_grasa", label: "Perder grasa",  icon: "🔥" },
                { value: "resistencia",  label: "Resistencia",   icon: "🏃" },
              ].map((op) => (
                <button
                  key={op.value}
                  type="button"
                  className={`perfil-opcion ${form.objetivo === op.value ? "selected" : ""}`}
                  onClick={() => !guardado && setForm(prev => ({ ...prev, objetivo: op.value }))}
                  disabled={guardado}
                >
                  <span>{op.icon}</span>
                  <span>{op.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="perfil-campo">
            <label><span className="perfil-campo-icon">📊</span> Nivel</label>
            <div className="perfil-opciones">
              {[
                { value: "principiante", label: "Principiante", icon: "🌱" },
                { value: "intermedio",   label: "Intermedio",   icon: "⚡" },
                { value: "avanzado",     label: "Avanzado",     icon: "🏆" },
              ].map((op) => (
                <button
                  key={op.value}
                  type="button"
                  className={`perfil-opcion ${form.nivel === op.value ? "selected" : ""}`}
                  onClick={() => !guardado && setForm(prev => ({ ...prev, nivel: op.value }))}
                  disabled={guardado}
                >
                  <span>{op.icon}</span>
                  <span>{op.label}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {exito && (
          <div className="perfil-exito">
            ✅ Perfil guardado correctamente
          </div>
        )}

        <button
          type="submit"
          className={`perfil-btn ${guardado ? "perfil-btn-editar" : ""}`}
          disabled={guardando}
        >
          {guardando
            ? <><span className="perfil-spinner" /> Guardando...</>
            : guardado ? "✏️ Editar perfil" : "💾 Guardar perfil"}
        </button>

      </form>
    </div>
  );
}

export default Perfil;