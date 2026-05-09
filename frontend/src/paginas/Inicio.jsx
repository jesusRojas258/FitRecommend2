import { useState, useEffect } from "react";
import "./css/Inicio.css";
import { apiFetch } from "../utils/api";

function Inicio() {

  const [rutinas, setRutinas]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(false);
  const [guardando, setGuardando] = useState({});
  const [guardado, setGuardado]   = useState({});
  const [rutinaVista, setRutinaVista] = useState(null);

  const [filtroObjetivo,     setFiltroObjetivo]     = useState("todos");
  const [filtroNivel,        setFiltroNivel]        = useState("todos");
  const [filtroEquipamiento, setFiltroEquipamiento] = useState("todos");
  const [busqueda,           setBusqueda]           = useState("");

  const usuario = (() => {
    const u = localStorage.getItem("usuario");
    return u ? JSON.parse(u) : null;
  })();

  useEffect(() => {
    fetch("http://localhost:3000/api/globales")
      .then(r => r.json())
      .then(data => setRutinas(data.rutinas || []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const handleGuardar = async (rutina) => {
    setGuardando(prev => ({ ...prev, [rutina._id]: true }));
    try {
      const res = await apiFetch("/guardar-global", {
        method: "POST",
        body: JSON.stringify({ rutinaGlobalId: rutina._id })
      });
      if (!res.ok) throw new Error();
      setGuardado(prev => ({ ...prev, [rutina._id]: true }));
    } catch {
      alert("Error al guardar la rutina");
    } finally {
      setGuardando(prev => ({ ...prev, [rutina._id]: false }));
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

  const rutinasFiltradas = rutinas.filter(r => {
    const matchObjetivo     = filtroObjetivo     === "todos" || r.objetivo === filtroObjetivo;
    const matchNivel        = filtroNivel        === "todos" || r.nivel === filtroNivel;
    const matchEquipamiento = filtroEquipamiento === "todos" || r.opciones?.equipamiento === filtroEquipamiento;
    const matchBusqueda     = busqueda === "" ||
      r.autor?.toLowerCase().includes(busqueda.toLowerCase()) ||
      r.descripcion?.toLowerCase().includes(busqueda.toLowerCase());
    return matchObjetivo && matchNivel && matchEquipamiento && matchBusqueda;
  });

  const limpiarFiltros = () => {
    setFiltroObjetivo("todos");
    setFiltroNivel("todos");
    setFiltroEquipamiento("todos");
    setBusqueda("");
  };

  const hayFiltros = filtroObjetivo !== "todos" ||
    filtroNivel !== "todos" ||
    filtroEquipamiento !== "todos" ||
    busqueda !== "";

  const agruparEjercicios = (rutina) => {
    const grupos = {};
    rutina?.forEach((dia) => {
      if (dia.titulo === "Descanso" || !dia.ejercicios?.length) return;
      if (!grupos[dia.titulo]) grupos[dia.titulo] = dia.ejercicios;
    });
    return grupos;
  };

  return (
    <div className="inicio-container">

      {/* HERO */}
      <div className="inicio-hero">
        <div className="inicio-hero-texto">
          <p className="inicio-saludo">
            👋 Bienvenido, <span>{usuario?.username ?? "atleta"}</span>
          </p>
          <h1>Descubre rutinas de la <span>comunidad</span></h1>
          <p className="inicio-hero-sub">
            Rutinas generadas con IA, compartidas por atletas como tú.
            Guárdalas y úsalas en tu calendario.
          </p>
        </div>
        <div className="inicio-hero-stats">
          <div className="inicio-stat">
            <span className="inicio-stat-num">{rutinas.length}</span>
            <span className="inicio-stat-label">Rutinas compartidas</span>
          </div>
          <div className="inicio-stat">
            <span className="inicio-stat-num">
              {[...new Set(rutinas.map(r => r.autor))].length}
            </span>
            <span className="inicio-stat-label">Atletas activos</span>
          </div>
        </div>
      </div>

      <div className="inicio-blog">

        <div className="inicio-blog-header">
          <h2>Rutinas de la comunidad</h2>
          {!loading && !error && (
            <span className="inicio-resultado">
              {rutinasFiltradas.length} resultado{rutinasFiltradas.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* FILTROS */}
        <div className="inicio-filtros">
          <div className="inicio-busqueda-wrap">
            <span className="inicio-busqueda-icon">🔍</span>
            <input
              className="inicio-busqueda"
              type="text"
              placeholder="Buscar por autor o descripción..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            {busqueda && (
              <button
                className="inicio-busqueda-clear"
                onClick={() => setBusqueda("")}
              >✕</button>
            )}
          </div>

          <div className="inicio-filtros-row">
            <select className="inicio-select" value={filtroObjetivo} onChange={(e) => setFiltroObjetivo(e.target.value)}>
              <option value="todos">🎯 Todos los objetivos</option>
              <option value="musculo">Ganar músculo</option>
              <option value="perder_grasa">Perder grasa</option>
              <option value="resistencia">Resistencia</option>
            </select>
            <select className="inicio-select" value={filtroNivel} onChange={(e) => setFiltroNivel(e.target.value)}>
              <option value="todos">📊 Todos los niveles</option>
              <option value="principiante">Principiante</option>
              <option value="intermedio">Intermedio</option>
              <option value="avanzado">Avanzado</option>
            </select>
            <select className="inicio-select" value={filtroEquipamiento} onChange={(e) => setFiltroEquipamiento(e.target.value)}>
              <option value="todos">🏋️ Todo el equipamiento</option>
              <option value="gimnasio">Gimnasio</option>
              <option value="casa">En casa</option>
              <option value="mancuernas">Mancuernas</option>
              <option value="bandas">Bandas elásticas</option>
              <option value="calistenia">Calistenia</option>
            </select>
            {hayFiltros && (
              <button className="inicio-limpiar" onClick={limpiarFiltros}>
                ✕ Limpiar
              </button>
            )}
          </div>
        </div>

        {/* SKELETON LOADER */}
        {loading && (
          <div className="inicio-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="inicio-skeleton">
                <div className="skeleton-top">
                  <div className="skeleton-avatar" />
                  <div className="skeleton-lines">
                    <div className="skeleton-line w-60" />
                    <div className="skeleton-line w-40" />
                  </div>
                </div>
                <div className="skeleton-line w-100" />
                <div className="skeleton-line w-80" />
                <div className="skeleton-badges">
                  <div className="skeleton-badge" />
                  <div className="skeleton-badge" />
                </div>
                <div className="skeleton-btn" />
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="inicio-empty">
            <span>⚠️</span>
            <h3>Error al cargar</h3>
            <p>No se pudieron cargar las rutinas. Verifica tu conexión.</p>
            <button
              className="inicio-limpiar-empty"
              onClick={() => window.location.reload()}
            >
              Reintentar
            </button>
          </div>
        )}

        {!loading && !error && rutinasFiltradas.length === 0 && (
          <div className="inicio-empty">
            <span>{hayFiltros ? "🔍" : "🏋️"}</span>
            <h3>{hayFiltros ? "Sin resultados" : "Sin rutinas aún"}</h3>
            <p>
              {hayFiltros
                ? "Ninguna rutina coincide con los filtros seleccionados."
                : "Aún no hay rutinas compartidas. ¡Sé el primero!"}
            </p>
            {hayFiltros && (
              <button className="inicio-limpiar-empty" onClick={limpiarFiltros}>
                Limpiar filtros
              </button>
            )}
          </div>
        )}

        {!loading && !error && rutinasFiltradas.length > 0 && (
          <div className="inicio-grid">
            {rutinasFiltradas.map((r, idx) => (
              <div
                key={r._id}
                className="inicio-card"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className="inicio-card-top">
                  <div className="inicio-avatar">
                    {r.autor?.charAt(0).toUpperCase() ?? "?"}
                  </div>
                  <div>
                    <span className="inicio-autor">{r.autor ?? "Anónimo"}</span>
                    <span className="inicio-fecha">
                      {r.creadoEn ? formatFecha(r.creadoEn) : ""}
                    </span>
                  </div>
                </div>

                <p className="inicio-descripcion">{r.descripcion ?? ""}</p>

                <div className="inicio-badges">
                  <span className="inicio-badge">
                    {objetivoLabel[r.objetivo] ?? r.objetivo ?? ""}
                  </span>
                  <span className="inicio-badge nivel">{r.nivel ?? ""}</span>
                </div>

                <div className="inicio-detalles">
                  <span>⏱ {r.opciones?.descanso ?? "-"}s</span>
                  <span>🕐 {r.opciones?.duracion ?? "-"} min</span>
                  <span>🔥 {r.opciones?.intensidad ?? "-"}</span>
                  <span>🏋️ {r.opciones?.equipamiento ?? "-"}</span>
                </div>

                <div className="inicio-card-acciones">
                  <button
                    className="inicio-btn-ver"
                    onClick={() => setRutinaVista(r)}
                  >
                    👁 Ver rutina
                  </button>

                  {guardado[r._id] ? (
                    <span className="inicio-guardado">✅ Guardada</span>
                  ) : (
                    <button
                      className="inicio-btn-guardar"
                      onClick={() => handleGuardar(r)}
                      disabled={guardando[r._id]}
                    >
                      {guardando[r._id]
                        ? <span className="inicio-btn-spinner" />
                        : "💾 Guardar"}
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* MODAL */}
      {rutinaVista && (
        <div className="inicio-modal-overlay" onClick={() => setRutinaVista(null)}>
          <div className="inicio-modal" onClick={(e) => e.stopPropagation()}>

            <div className="inicio-modal-header">
              <div>
                <h3>Rutina de {rutinaVista.autor}</h3>
                <span className="inicio-modal-sub">{rutinaVista.descripcion}</span>
              </div>
              <button
                className="inicio-modal-close"
                onClick={() => setRutinaVista(null)}
              >✕</button>
            </div>

            <div className="inicio-modal-badges">
              <span className="inicio-badge">
                {objetivoLabel[rutinaVista.objetivo] || rutinaVista.objetivo}
              </span>
              <span className="inicio-badge nivel">{rutinaVista.nivel}</span>
              <span className="inicio-badge">⏱ {rutinaVista.opciones?.descanso}s</span>
              <span className="inicio-badge">🕐 {rutinaVista.opciones?.duracion} min</span>
              <span className="inicio-badge">🔥 {rutinaVista.opciones?.intensidad}</span>
              <span className="inicio-badge">🏋️ {rutinaVista.opciones?.equipamiento}</span>
            </div>

            <div className="inicio-modal-grupos">
              {Object.entries(agruparEjercicios(rutinaVista.rutina)).map(([titulo, ejercicios]) => (
                <div key={titulo} className="inicio-modal-grupo">
                  <h4 className="inicio-modal-grupo-titulo">{titulo}</h4>
                  <ul className="inicio-modal-grupo-lista">
                    {ejercicios.map((ej, i) => (
                      <li key={i} className="inicio-modal-grupo-item">
                        <span className="inicio-modal-grupo-num">{i + 1}</span>
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

export default Inicio;