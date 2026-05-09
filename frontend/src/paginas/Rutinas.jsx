import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";
import "./css/Rutinas.css";

const OPCIONES_CONFIG = [
  {
    name:  "descanso",
    label: "Descanso entre series",
    icon:  "⏱",
    opciones: [
      { value: "30",  label: "30 segundos" },
      { value: "60",  label: "1 minuto"    },
      { value: "90",  label: "1:30 min"    },
      { value: "120", label: "2 minutos"   },
      { value: "180", label: "3 minutos"   },
    ]
  },
  {
    name:  "duracion",
    label: "Duración de sesión",
    icon:  "🕐",
    opciones: [
      { value: "30", label: "30 minutos"  },
      { value: "45", label: "45 minutos"  },
      { value: "60", label: "1 hora"      },
      { value: "75", label: "1:15 horas"  },
      { value: "90", label: "1:30 horas"  },
    ]
  },
  {
    name:  "intensidad",
    label: "Intensidad (RPE)",
    icon:  "🔥",
    opciones: [
      { value: "baja",     label: "Baja — RPE 4-5"    },
      { value: "moderada", label: "Moderada — RPE 6-7" },
      { value: "alta",     label: "Alta — RPE 8-9"     },
      { value: "maxima",   label: "Máxima — RPE 10"    },
    ]
  },
  {
    name:  "equipamiento",
    label: "Equipamiento",
    icon:  "🏋️",
    opciones: [
      { value: "gimnasio",   label: "Gimnasio completo" },
      { value: "casa",       label: "En casa"           },
      { value: "mancuernas", label: "Mancuernas"        },
      { value: "bandas",     label: "Bandas elásticas"  },
      { value: "calistenia", label: "Calistenia"        },
    ]
  }
];

function Rutinas() {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [exito,   setExito]   = useState(false);
  const [progreso, setProgreso] = useState("");

  const [opciones, setOpciones] = useState({
    descanso:     "60",
    duracion:     "45",
    intensidad:   "moderada",
    equipamiento: "gimnasio"
  });

  const perfil = (() => {
    const p = localStorage.getItem("perfil");
    return p ? JSON.parse(p) : null;
  })();

  const handleOpciones = (e) => {
    setOpciones(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const generarRutina = async () => {
    if (!perfil) {
      alert("Primero debes completar tu perfil");
      return;
    }

    const body = {
      nombre:       perfil.nombre,
      edad:         Number(perfil.edad),
      peso:         Number(perfil.peso),
      altura:       Number(perfil.altura),
      objetivo:     perfil.objetivo,
      nivel:        perfil.nivel,
      dias:         Number(perfil.dias),
      lesiones:     perfil.lesiones || "",
      fechaInicio:  perfil.fechaInicio || new Date().toISOString().split("T")[0],
      descanso:     opciones.descanso,
      duracion:     opciones.duracion,
      intensidad:   opciones.intensidad,
      equipamiento: opciones.equipamiento
    };

    try {
      setLoading(true);
      setExito(false);

      // Mensajes de progreso
      const mensajes = [
        "Analizando tu perfil...",
        "Seleccionando ejercicios...",
        "Distribuyendo grupos musculares...",
        "Ajustando intensidad y series...",
        "Construyendo tu rutina mensual..."
      ];
      let idx = 0;
      setProgreso(mensajes[0]);
      const interval = setInterval(() => {
        idx = Math.min(idx + 1, mensajes.length - 1);
        setProgreso(mensajes[idx]);
      }, 2500);

      const res = await apiFetch("/chat", {
        method: "POST",
        body:   JSON.stringify(body)
      });

      clearInterval(interval);

      if (!res.ok) throw new Error("Error en el servidor");
      const data = await res.json();
      localStorage.setItem("rutinaGenerada", JSON.stringify(data));
      setExito(true);

    } catch (error) {
      console.error(error);
      alert("Error generando la rutina. Intenta de nuevo.");
    } finally {
      setLoading(false);
      setProgreso("");
    }
  };

  const objetivoLabel = {
    musculo:      "Ganar músculo",
    perder_grasa: "Perder grasa",
    resistencia:  "Resistencia"
  };

  return (
    <div className="rutina-container">
      <main className="rutina-main">

        <div className="rutina-header">
          <div>
            <h2>Genera tu rutina</h2>
            <p className="rutina-sub">
              Personaliza los parámetros y la IA creará una rutina de 30 días para ti.
            </p>
          </div>

          {/* RESUMEN DEL PERFIL */}
          {perfil && (
            <div className="rutina-perfil-chip">
              <div className="rutina-perfil-avatar">
                {perfil.nombre.charAt(0).toUpperCase()}
              </div>
              <div className="rutina-perfil-datos">
                <span className="rutina-perfil-nombre">{perfil.nombre}</span>
                <span className="rutina-perfil-info">
                  {objetivoLabel[perfil.objetivo] || perfil.objetivo}
                  {" · "}{perfil.nivel}
                  {" · "}{perfil.dias} días/sem
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ADVERTENCIA SI NO HAY PERFIL */}
        {!perfil && (
          <div className="rutina-aviso">
            <span>⚠️</span>
            <p>Completa tu perfil antes de generar una rutina.</p>
          </div>
        )}

        {/* FORMULARIO */}
        <div className="opciones-form">
          <p className="opciones-titulo">Parámetros de entrenamiento</p>

          <div className="opciones-grid">
            {OPCIONES_CONFIG.map((config) => (
              <div key={config.name} className="opcion-grupo">
                <label>
                  <span className="opcion-icon">{config.icon}</span>
                  {config.label}
                </label>
                <select
                  name={config.name}
                  value={opciones[config.name]}
                  onChange={handleOpciones}
                >
                  {config.opciones.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <button
            className="btn-generar"
            onClick={generarRutina}
            disabled={loading || !perfil}
          >
            {loading
              ? <><span className="btn-spinner" /> Generando...</>
              : "⚡ Generar rutina"}
          </button>

        </div>

        {/* PROGRESO */}
        {loading && (
          <div className="rutina-progreso">
            <div className="rutina-progreso-bar">
              <div className="rutina-progreso-fill" />
            </div>
            <p className="rutina-progreso-texto">{progreso}</p>
          </div>
        )}

        {/* ÉXITO */}
        {exito && !loading && (
          <div className="exito-card">
            <div className="exito-icono-wrap">
              <span className="exito-icono">✓</span>
            </div>
            <h3>¡Rutina generada!</h3>
            <p>Tu rutina mensual está lista en Mis Rutinas.</p>
            <div className="exito-acciones">
              <button
                className="btn-generar"
                onClick={() => navigate("/mis-rutinas")}
              >
                📋 Ver mis rutinas
              </button>
              <button
                className="btn-generar btn-generar-secundario"
                onClick={() => { setExito(false); }}
              >
                ⚡ Generar otra
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default Rutinas;