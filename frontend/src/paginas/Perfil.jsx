import "../paginas/css/Perfil.css";
import { useState, useEffect } from "react";

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

  useEffect(() => {
    const perfilGuardado = localStorage.getItem("perfil");
    if (perfilGuardado) {
      const datos = JSON.parse(perfilGuardado);
      setForm({
        nombre:   datos.nombre   || "",
        edad:     datos.edad     || "",
        peso:     datos.peso     || "",
        altura:   datos.altura   || "",
        objetivo: datos.objetivo || "",
        nivel:    datos.nivel    || "",
        dias:     datos.dias     || "",
        lesiones: datos.lesiones || ""
      });
      setGuardado(true);
    }
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
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

    localStorage.setItem("perfil", JSON.stringify(perfil));

    setTimeout(() => {
      setGuardado(true);
      setGuardando(false);
      setExito(true);
      setTimeout(() => setExito(false), 3000);
      if (onGuardado) onGuardado(perfil);
    }, 400);
  };

  const campos = [
    { name: "nombre",  label: "Nombre completo",  type: "text",   placeholder: "Tu nombre",   icon: "👤" },
    { name: "edad",    label: "Edad",              type: "number", placeholder: "Años",         icon: "🎂" },
    { name: "peso",    label: "Peso",              type: "number", placeholder: "kg",           icon: "⚖️" },
    { name: "altura",  label: "Altura",            type: "number", placeholder: "cm",           icon: "📏" },
    { name: "dias",    label: "Días por semana",   type: "number", placeholder: "1 - 7",        icon: "📆", min: "1", max: "7" },
    { name: "lesiones",label: "Lesiones",          type: "text",   placeholder: "Ninguna",      icon: "🩹", required: false },
  ];

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

        {/* CAMPOS DE TEXTO Y NÚMERO */}
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
              />
            </div>
          ))}
        </div>

        {/* SELECTS */}
        <div className="perfil-selects">

          <div className="perfil-campo">
            <label><span className="perfil-campo-icon">🎯</span> Objetivo</label>
            <div className="perfil-opciones">
              {[
                { value: "musculo",      label: "Ganar músculo",  icon: "💪" },
                { value: "perder_grasa", label: "Perder grasa",   icon: "🔥" },
                { value: "resistencia",  label: "Resistencia",    icon: "🏃" },
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

        {/* MENSAJE ÉXITO */}
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