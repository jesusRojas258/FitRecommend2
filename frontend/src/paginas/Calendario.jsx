import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./css/Calendario.css";

function Calendario() {

  const navigate    = useNavigate();
  const [diaVisto, setDiaVisto]       = useState(null);
  const [series, setSeries]           = useState({});
  const [timer, setTimer]             = useState(null);
  const [timerActivo, setTimerActivo] = useState(false);
  const intervalRef = useRef(null);

  const cargada     = JSON.parse(localStorage.getItem("rutinaCalendario") || "null");
  const descansoSeg = Number(cargada?.descanso || 60);

  const [rutina, setRutina] = useState(() => cargada?.rutina ?? null);

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const rutinaFiltrada = rutina?.filter((dia) => {
    if (!dia.fecha) return false;
    const fecha = new Date(dia.fecha + "T00:00:00");
    return (
      fecha.getMonth()    === hoy.getMonth()    &&
      fecha.getFullYear() === hoy.getFullYear() &&
      fecha >= hoy
    );
  }) ?? [];

  const calcularOffset = () => {
    if (!rutinaFiltrada.length || !rutinaFiltrada[0]?.fecha) return 0;
    const fecha     = new Date(rutinaFiltrada[0].fecha + "T00:00:00");
    const diaSemana = fecha.getDay();
    return diaSemana === 0 ? 6 : diaSemana - 1;
  };

  const nombreMes = hoy.toLocaleDateString("es-MX", { month: "long", year: "numeric" });

  const handleLimpiar = () => {
    if (!confirm("¿Quitar la rutina del calendario?")) return;
    localStorage.removeItem("rutinaCalendario");
    setRutina(null);
  };

  const parsearEjercicio = (ejStr) => {
    const match = ejStr.match(/^(.+?)\s*-\s*(\d+)x(\d+)(.*)$/);
    if (match) return {
      nombre: match[1].trim(),
      series: Number(match[2]),
      reps:   Number(match[3]),
      extra:  match[4].trim()
    };
    return { nombre: ejStr, series: 3, reps: 10, extra: "" };
  };

  const handleSerie = (ejIdx, serieIdx) => {
    const key          = `${ejIdx}-${serieIdx}`;
    const yaCompletada = series[key];
    setSeries(prev => ({ ...prev, [key]: !yaCompletada }));
    if (!yaCompletada) iniciarTimer();
    else cancelarTimer();
  };

  const iniciarTimer = () => {
    clearInterval(intervalRef.current);
    setTimer(descansoSeg);
    setTimerActivo(true);
    intervalRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setTimerActivo(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const cancelarTimer = () => {
    clearInterval(intervalRef.current);
    setTimerActivo(false);
    setTimer(null);
  };

  const cerrarModal = () => {
    cancelarTimer();
    setSeries({});
    setDiaVisto(null);
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  // Progreso del entrenamiento en el modal
  const calcularProgreso = () => {
    if (!diaVisto) return { completadas: 0, total: 0, pct: 0 };
    let total = 0, completadas = 0;
    diaVisto.ejercicios.forEach((ejStr, ejIdx) => {
      const ej = parsearEjercicio(ejStr);
      for (let si = 0; si < ej.series; si++) {
        total++;
        if (series[`${ejIdx}-${si}`]) completadas++;
      }
    });
    return { completadas, total, pct: total ? Math.round((completadas / total) * 100) : 0 };
  };

  const progreso = calcularProgreso();

  // Estado vacío — sin rutina
  if (!rutina) return (
    <div className="calendario-container">
      <main className="calendario-main">
        <div className="cal-empty">
          <div className="cal-empty-icono">📅</div>
          <h3>Sin rutina cargada</h3>
          <p>Ve a Mis Rutinas, elige una rutina y cárgala en el calendario.</p>
          <div className="cal-empty-pasos">
            <div className="cal-empty-paso">
              <span>1</span> Genera una rutina
            </div>
            <div className="cal-empty-paso">
              <span>2</span> Ve a Mis Rutinas
            </div>
            <div className="cal-empty-paso">
              <span>3</span> Carga en calendario
            </div>
          </div>
          <button className="calendario-btn" onClick={() => navigate("/mis-rutinas")}>
            📋 Ir a Mis Rutinas
          </button>
        </div>
      </main>
    </div>
  );

  // Estado vacío — mes terminado
  if (rutinaFiltrada.length === 0) return (
    <div className="calendario-container">
      <main className="calendario-main">
        <div className="cal-empty">
          <div className="cal-empty-icono">🎉</div>
          <h3>¡Mes completado!</h3>
          <p>No quedan días de entrenamiento este mes. ¡Buen trabajo!</p>
          <button className="calendario-btn" onClick={() => navigate("/rutinas")}>
            ⚡ Nueva rutina
          </button>
        </div>
      </main>
    </div>
  );

  const timerPct = timerActivo ? ((descansoSeg - timer) / descansoSeg) * 100 : 0;
  const circumference = 2 * Math.PI * 36;

  return (
    <div className="calendario-container">
      <main className="calendario-main">

        <div className="calendario-titulo-row">
          <div>
            <h2>{nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1)}</h2>
            <p className="calendario-sub">
              {rutinaFiltrada.filter(d => d.ejercicios?.length).length} días de entrenamiento restantes
            </p>
          </div>
          <div className="calendario-acciones">
            <button className="calendario-btn-sm" onClick={() => navigate("/mis-rutinas")}>
              🔄 Cambiar
            </button>
            <button className="calendario-btn-sm danger" onClick={handleLimpiar}>
              🗑 Limpiar
            </button>
          </div>
        </div>

        <div className="calendario-header">
          {["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"].map((d, i) => (
            <div key={i} className="calendario-day-header">{d}</div>
          ))}
        </div>

        <div className="calendario-grid">
          {Array.from({ length: calcularOffset() }).map((_, i) => (
            <div key={`empty-${i}`} className="calendario-card empty" />
          ))}

          {rutinaFiltrada.map((dia, index) => {
            const fecha      = new Date(dia.fecha + "T00:00:00");
            const esHoy      = fecha.getTime() === hoy.getTime();
            const esDescanso = !dia.ejercicios?.length;

            return (
              <div
                key={index}
                className={`calendario-card
                  ${esDescanso ? "calendario-rest-day" : ""}
                  ${esHoy      ? "calendario-hoy"      : ""}
                `}
              >
                <div className="calendario-card-top">
                  <span className="calendario-fecha">
                    {fecha.toLocaleDateString("es-MX", { day: "numeric", month: "short" })}
                  </span>
                  {esHoy && <span className="hoy-badge">Hoy</span>}
                </div>

                <h3>{dia.nombreDia || dia.dia}</h3>
                <h4>{dia.titulo}</h4>

                {esDescanso ? (
                  <p className="calendario-descanso">💤 Descanso</p>
                ) : (
                  <button
                    className={`calendario-ver-btn ${esHoy ? "calendario-ver-btn-hoy" : ""}`}
                    onClick={() => setDiaVisto(dia)}
                  >
                    {esHoy ? "⚡ Entrenar hoy" : "Ver rutina"}
                  </button>
                )}
              </div>
            );
          })}
        </div>

      </main>

      {/* MODAL */}
      {diaVisto && (
        <div className="calendario-modal-overlay" onClick={cerrarModal}>
          <div className="calendario-modal" onClick={(e) => e.stopPropagation()}>

            {/* HEADER */}
            <div className="calendario-modal-header">
              <div>
                <h3>{diaVisto.titulo}</h3>
                <span className="calendario-modal-sub">
                  {diaVisto.nombreDia} — {new Date(diaVisto.fecha + "T00:00:00")
                    .toLocaleDateString("es-MX", { day: "numeric", month: "long" })}
                </span>
              </div>
              <button className="calendario-modal-close" onClick={cerrarModal}>✕</button>
            </div>

            {/* BARRA DE PROGRESO */}
            <div className="cal-progreso">
              <div className="cal-progreso-info">
                <span className="cal-progreso-label">Progreso</span>
                <span className="cal-progreso-num">
                  {progreso.completadas}/{progreso.total} series
                </span>
              </div>
              <div className="cal-progreso-bar">
                <div
                  className="cal-progreso-fill"
                  style={{ width: `${progreso.pct}%` }}
                />
              </div>
              {progreso.pct === 100 && (
                <p className="cal-progreso-exito">🎉 ¡Entrenamiento completado!</p>
              )}
            </div>

            {/* TIMER */}
            {(timerActivo || timer === 0) && (
              <div className={`calendario-timer ${timer === 0 ? "timer-listo" : ""}`}>
                {timer === 0 ? (
                  <p className="timer-listo-txt">✅ ¡Siguiente serie!</p>
                ) : (
                  <>
                    <div className="timer-circulo-wrap">
                      <svg width="100" height="100" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="36"
                          fill="none" stroke="#1E293B" strokeWidth="6" />
                        <circle cx="50" cy="50" r="36"
                          fill="none" stroke="#3B82F6" strokeWidth="6"
                          strokeLinecap="round"
                          strokeDasharray={circumference}
                          strokeDashoffset={circumference - (circumference * timerPct / 100)}
                          transform="rotate(-90 50 50)"
                          style={{ transition: "stroke-dashoffset 1s linear" }}
                        />
                      </svg>
                      <div className="timer-centro">
                        <span className="timer-seg">{timer}</span>
                        <span className="timer-seg-label">seg</span>
                      </div>
                    </div>
                    <p className="timer-texto">Descansando...</p>
                    <button className="timer-skip" onClick={cancelarTimer}>
                      Saltar ↗
                    </button>
                  </>
                )}
              </div>
            )}

            {/* EJERCICIOS */}
            <div className="calendario-modal-ejercicios">
              {diaVisto.ejercicios.map((ejStr, ejIdx) => {
                const ej = parsearEjercicio(ejStr);
                const todasCompletadas = Array.from({ length: ej.series })
                  .every((_, si) => series[`${ejIdx}-${si}`]);

                return (
                  <div
                    key={ejIdx}
                    className={`cal-ej ${todasCompletadas ? "cal-ej-done" : ""}`}
                  >
                    <div className="cal-ej-header">
                      <span className={`cal-ej-num ${todasCompletadas ? "cal-ej-num-done" : ""}`}>
                        {todasCompletadas ? "✓" : ejIdx + 1}
                      </span>
                      <div className="cal-ej-info">
                        <span className="cal-ej-nombre">{ej.nombre}</span>
                        <span className="cal-ej-meta">
                          {ej.series} series × {ej.reps} reps
                          {ej.extra && ` · ${ej.extra}`}
                        </span>
                      </div>
                    </div>

                    <div className="cal-ej-series">
                      {Array.from({ length: ej.series }).map((_, si) => {
                        const key       = `${ejIdx}-${si}`;
                        const completada = !!series[key];
                        return (
                          <button
                            key={si}
                            className={`cal-serie-btn ${completada ? "completada" : ""}`}
                            onClick={() => handleSerie(ejIdx, si)}
                          >
                            <span className="cal-serie-num">Serie {si + 1}</span>
                            <span className="cal-serie-reps">{ej.reps} reps</span>
                            {completada && <span className="cal-serie-check">✓</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default Calendario;