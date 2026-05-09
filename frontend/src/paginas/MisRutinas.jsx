import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";
import "./css/MisRutinas.css";

function MisRutinas() {

  const navigate = useNavigate();
  const [rutinas, setRutinas]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [descripcion, setDescripcion] = useState({});
  const [compartiendo, setCompartiendo] = useState({});
  const [exito, setExito]             = useState({});
  const [rutinaVista, setRutinaVista] = useState(null);
  const [eliminando, setEliminando]   = useState({});

  useEffect(() => {
    apiFetch("/mis-rutinas")
      .then(r => r.json())
      .then(data => setRutinas(data.rutinas || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleCargarEnCalendario = (rutina) => {
    localStorage.setItem("rutinaCalendario", JSON.stringify({
      rutina:   rutina.rutina,
      descanso: rutina.opciones.descanso
    }));
    navigate("/calendario");
  };

  const handleEliminar = async (id) => {
    if (!confirm("¿Eliminar esta rutina? Esta acción no se puede deshacer.")) return;
    setEliminando(prev => ({ ...prev, [id]: true }));
    try {
      const res = await apiFetch(`/mis-rutinas/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setRutinas(prev => prev.filter(r => r._id !== id));
    } catch {
      alert("Error al eliminar la rutina");
    } finally {
      setEliminando(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleCompartir = async (rutina) => {
    const desc = descripcion[rutina._id];
    if (!desc?.trim()) {
      alert("Escribe una descripción antes de compartir");
      return;
    }
    setCompartiendo(prev => ({ ...prev, [rutina._id]: true }));
    try {
      const res = await apiFetch("/compartir", {
        method: "POST",
        body:   JSON.stringify({ rutinaId: rutina._id, descripcion: desc })
      });
      if (!res.ok) throw new Error();
      setExito(prev => ({ ...prev, [rutina._id]: true }));
    } catch {
      alert("Error al compartir");
    } finally {
      setCompartiendo(prev => ({ ...prev, [rutina._id]: false }));
    }
  };

  const objetivoLabel = {
    musculo:      "Ganar músculo",
    perder_grasa: "Perder grasa",
    resistencia:  "Resistencia"
  };

  const formatFecha = (iso) =>
    new Date(iso).toLocaleDateString("es-MX", {
      day: "numeric", month: "long", year: "numeric"
    });

  const agruparEjercicios = (rutina) => {
    const grupos = {};
    rutina?.forEach((dia) => {
      if (dia.titulo === "Descanso" || !dia.ejercicios?.length) return;
      if (!grupos[dia.titulo]) grupos[dia.titulo] = dia.ejercicios;
    });
    return grupos;
  };

  // SKELETON LOADER
  if (loading) return (
    <div className="misrutinas-container">
      <div className="misrutinas-header">
        <h2>Mis rutinas</h2>
      </div>
      <div className="misrutinas-grid">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="misrutinas-skeleton">
            <div className="sk-row">
              <div className="sk-badge" />
              <div className="sk-badge" />
              <div className="sk-line sk-short" style={{ marginLeft: "auto" }} />
            </div>
            <div className="sk-chips">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="sk-chip" />
              ))}
            </div>
            <div className="sk-btns">
              <div className="sk-btn" />
              <div className="sk-btn" />
              <div className="sk-btn sk-btn-sm" />
            </div>
            <div className="sk-divider" />
            <div className="sk-line" />
            <div className="sk-line sk-short" />
            <div className="sk-btn-full" />
          </div>
        ))}
      </div>
    </div>
  );

  // ESTADO VACÍO
  if (rutinas.length === 0) return (
    <div className="misrutinas-container">
      <div className="misrutinas-empty">
        <div className="misrutinas-empty-icono">📭</div>
        <h3>Sin rutinas guardadas</h3>
        <p>Genera tu primera rutina personalizada con IA y aparecerá aquí.</p>
        <div className="misrutinas-empty-pasos">
          <div className="mr-paso"><span>1</span> Completa tu perfil</div>
          <div className="mr-paso"><span>2</span> Ve a Rutinas</div>
          <div className="mr-paso"><span>3</span> Genera tu rutina</div>
        </div>
        <button className="mr-btn-primary" onClick={() => navigate("/rutinas")}>
          ⚡ Generar mi primera rutina
        </button>
      </div>
    </div>
  );

  return (
    <div className="misrutinas-container">

      <div className="misrutinas-header">
        <div>
          <h2>Mis rutinas</h2>
          <p className="misrutinas-sub">
            {rutinas.length} rutina{rutinas.length !== 1 ? "s" : ""} guardada{rutinas.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button className="mr-btn-primary" onClick={() => navigate("/rutinas")}>
          ⚡ Nueva rutina
        </button>
      </div>

      <div className="misrutinas-grid">
        {rutinas.map((rutina, idx) => (
          <div
            key={rutina._id}
            className={`misrutinas-card ${eliminando[rutina._id] ? "eliminando" : ""}`}
            style={{ animationDelay: `${idx * 0.06}s` }}
          >

            {/* HEADER */}
            <div className="misrutinas-card-header">
              <div className="misrutinas-card-badges">
                <span className="misrutinas-badge">
                  {objetivoLabel[rutina.usuario.objetivo] || rutina.usuario.objetivo}
                </span>
                <span className="misrutinas-badge nivel">
                  {rutina.usuario.nivel}
                </span>
              </div>
              <span className="misrutinas-fecha">{formatFecha(rutina.creadoEn)}</span>
            </div>

            {/* DETALLES */}
            <div className="misrutinas-detalles">
              <span>⏱ {rutina.opciones.descanso}s</span>
              <span>🕐 {rutina.opciones.duracion} min</span>
              <span>🔥 {rutina.opciones.intensidad}</span>
              <span>🏋️ {rutina.opciones.equipamiento}</span>
            </div>

            {/* ACCIONES */}
            <div className="misrutinas-acciones">
              <button
                className="misrutinas-btn-accion cargar"
                onClick={() => handleCargarEnCalendario(rutina)}
                title="Cargar en el calendario"
              >
                📅 Cargar
              </button>
              <button
                className="misrutinas-btn-accion ver"
                onClick={() => setRutinaVista(rutina)}
                title="Ver ejercicios"
              >
                👁 Ver
              </button>
              <button
                className="misrutinas-btn-accion eliminar"
                onClick={() => handleEliminar(rutina._id)}
                disabled={eliminando[rutina._id]}
                title="Eliminar rutina"
              >
                {eliminando[rutina._id] ? "..." : "🗑"}
              </button>
            </div>

            <div className="misrutinas-divider" />

            {/* COMPARTIR */}
            {exito[rutina._id] ? (
              <div className="misrutinas-exito">
                <span>✅</span>
                <span>Compartida en la comunidad</span>
              </div>
            ) : (
              <div className="misrutinas-compartir">
                <textarea
                  className="misrutinas-textarea"
                  placeholder="Describe tu rutina para compartirla con la comunidad..."
                  value={descripcion[rutina._id] || ""}
                  onChange={(e) => setDescripcion(prev => ({
                    ...prev, [rutina._id]: e.target.value
                  }))}
                  maxLength={280}
                />
                {descripcion[rutina._id] && (
                  <span className="misrutinas-char-count">
                    {descripcion[rutina._id].length}/280
                  </span>
                )}
                <button
                  className="misrutinas-btn"
                  onClick={() => handleCompartir(rutina)}
                  disabled={compartiendo[rutina._id]}
                >
                  {compartiendo[rutina._id]
                    ? <><span className="mr-spinner" /> Compartiendo...</>
                    : "🌐 Compartir en comunidad"}
                </button>
              </div>
            )}

          </div>
        ))}
      </div>

      {/* MODAL */}
      {rutinaVista && (
        <div className="misrutinas-modal-overlay" onClick={() => setRutinaVista(null)}>
          <div className="misrutinas-modal" onClick={(e) => e.stopPropagation()}>

            <div className="misrutinas-modal-header">
              <div>
                <h3>Rutina completa</h3>
                <span className="misrutinas-modal-fecha">
                  {formatFecha(rutinaVista.creadoEn)}
                </span>
              </div>
              <button
                className="misrutinas-modal-close"
                onClick={() => setRutinaVista(null)}
              >✕</button>
            </div>

            <div className="misrutinas-modal-badges">
              <span className="misrutinas-badge">
                {objetivoLabel[rutinaVista.usuario.objetivo] || rutinaVista.usuario.objetivo}
              </span>
              <span className="misrutinas-badge nivel">{rutinaVista.usuario.nivel}</span>
              <span className="misrutinas-badge">⏱ {rutinaVista.opciones.descanso}s</span>
              <span className="misrutinas-badge">🕐 {rutinaVista.opciones.duracion} min</span>
              <span className="misrutinas-badge">🔥 {rutinaVista.opciones.intensidad}</span>
              <span className="misrutinas-badge">🏋️ {rutinaVista.opciones.equipamiento}</span>
            </div>

            <div className="misrutinas-modal-grupos">
              {Object.entries(agruparEjercicios(rutinaVista.rutina)).map(([titulo, ejercicios]) => (
                <div key={titulo} className="misrutinas-modal-grupo">
                  <h4 className="misrutinas-modal-grupo-titulo">{titulo}</h4>
                  <ul className="misrutinas-modal-grupo-lista">
                    {ejercicios.map((ej, i) => (
                      <li key={i} className="misrutinas-modal-grupo-item">
                        <span className="misrutinas-modal-grupo-num">{i + 1}</span>
                        {ej}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default MisRutinas;