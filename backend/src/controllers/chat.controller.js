/**
 * @file:       chat.controller.js
 * @project:    FitRecommend
 * @brief:      Controlador encargado de generar rutinas utilizando la API local de Ollama
 * @author:     Jesus Rojas
 * @date:       25-02-2026
 */

const axios = require("axios");
const Rutina = require("../models/Rutina.model");
const ejerciciosDB = require("../data/ejercicios.js");

// 🔧 1. Crear plantilla fija (tú controlas estructura)
const crearPlantilla = (fechaInicio) => {
  const diasSemana = ["Domingo","Lunes","Martes","Miercoles",
                      "Jueves","Viernes","Sabado"];
  const plantilla = [];
  const inicio = new Date(fechaInicio + "T00:00:00"); // evita bugs de timezone

  for (let i = 0; i < 30; i++) {
    const fecha = new Date(inicio);
    fecha.setDate(inicio.getDate() + i);

    plantilla.push({
      dia: `Día ${i + 1}`,
      fecha: fecha.toISOString().split("T")[0],     // "2026-04-20"
      nombreDia: diasSemana[fecha.getDay()],
      titulo: "",
      ejercicios: []
    });
  }

  return plantilla;
};

// 🔧 2. Limpiar respuesta IA
const limpiarTexto = (texto) => {
  return texto
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
};

// 🔧 3. Integrar respuesta IA con plantilla (tolerante)
const integrarRutina = (plantilla, respuestaIA, dias) => {
  if (!Array.isArray(respuestaIA)) return null;

  // Mapear la respuesta de la IA por día de semana (0=Dom, 1=Lun...)
  // La IA devuelve índice 0-6, necesitas saber qué día de semana
  // es el primer día de la plantilla para alinear correctamente
  const offsetInicio = new Date(plantilla[0].fecha + "T00:00:00").getDay();

  return plantilla.map((dia) => {
    const fecha = new Date(dia.fecha + "T00:00:00");
    // Índice dentro del patrón semanal de la IA (ajustado al día de inicio)
    const idxIA = (fecha.getDay() - offsetInicio + 7) % 7;
    const ia = respuestaIA[idxIA];

    if (!ia || ia.titulo === "Descanso") {
      return { dia: dia.dia, fecha: dia.fecha, nombreDia: dia.nombreDia, titulo: "Descanso" };
    }

    let ejercicios = Array.isArray(ia.ejercicios)
      ? ia.ejercicios.filter(e => typeof e === "string").slice(0, 5)
      : [];

    return {
      dia: dia.dia,
      fecha: dia.fecha,
      nombreDia: dia.nombreDia,
      titulo: ia.titulo || "Entrenamiento",
      ejercicios
    };
  });
};

// 🔧 4. Controller principal
const generateRoutine = async (req, res) => {
  try {

    

    const { nombre, edad, peso, altura, objetivo, nivel, dias,
        lesiones, fechaInicio, descanso, duracion, intensidad, equipamiento } = req.body;

        // Agregar a la validación:
      if (!fechaInicio || isNaN(new Date(fechaInicio).getTime())) {
        return res.status(400).json({ error: "Fecha de inicio inválida" });
      }
    // ... resto igual

    // 🔴 Validación entrada
    if (
      typeof nombre !== "string" ||
      typeof objetivo !== "string" ||
      typeof nivel !== "string" ||
      typeof lesiones !== "string" ||
      isNaN(edad) || edad <= 0 ||
      isNaN(peso) || peso <= 0 ||
      isNaN(altura) || altura <= 0 ||
      isNaN(dias) || dias < 1 || dias > 7
    ) {
      return res.status(400).json({ error: "Datos inválidos" });
    }

    const plantilla = crearPlantilla(fechaInicio);

    const eq = equipamiento || "gimnasio";
    const pool = ejerciciosDB[eq] || ejerciciosDB["gimnasio"];

    const listaEjercicios = `
      PUSH disponibles: ${pool.push.join(" | ")}
      PULL disponibles: ${pool.pull.join(" | ")}
      LEGS disponibles: ${pool.legs.join(" | ")}
      CORE disponibles: ${pool.core.join(" | ")}
    `;

    const prompt = `
      Tu única tarea es devolver un ARRAY JSON válido.
      NO expliques nada.
      NO agregues texto antes o después.
      NO uses markdown.
      NO uses comentarios.
      La salida DEBE poder ejecutarse con JSON.parse sin errores.

      FORMATO:
      - Empieza con: [
      - Termina con: ]
      - EXACTAMENTE 7 objetos

      ESTRUCTURA día de entrenamiento:
      {
        "titulo": "Push" | "Pull" | "Legs" | "Core" | "Full Body",
        "ejercicios": ["Ejercicio exacto de la lista - NxM", ...]
      }

      ESTRUCTURA día de descanso:
      {
        "titulo": "Descanso"
      }

      ═══════════════════════════════════
      EJERCICIOS DISPONIBLES
      (copia nombre y series/reps EXACTAMENTE)
      ═══════════════════════════════════
      ${listaEjercicios}

      ═══════════════════════════════════
      REGLAS DE EJERCICIOS
      ═══════════════════════════════════
      - EXACTAMENTE 5 ejercicios por día de entrenamiento
      - Copia cada ejercicio EXACTAMENTE como aparece en la lista
      - NO inventes ejercicios fuera de la lista
      - Selecciona ejercicios del grupo muscular correspondiente al título del día
      - Varía los ejercicios entre sesiones del mismo grupo muscular

      ═══════════════════════════════════
      DISTRIBUCIÓN SEGÚN DÍAS
      ═══════════════════════════════════
      1-2 días → Full Body
      3 días   → Push / Pull / Legs
      4 días   → Push / Pull / Legs / Full Body
      5 días   → Push / Pull / Legs / Core / Full Body
      6 días   → Push / Pull / Legs / Push / Pull / Legs
      7 días   → Push / Pull / Legs / Push / Pull / Legs / Core

      Los días de descanso deben distribuirse de forma inteligente,
      NO juntar todos al final de la semana.

      ═══════════════════════════════════
      AJUSTE POR NIVEL
      ═══════════════════════════════════
      principiante → Series: 3 | Reps: 12-15 | Ejercicios básicos
      intermedio   → Series: 3-4 | Reps: 8-12 | Compuestos + isolación
      avanzado     → Series: 4-5 | Reps: 4-12 | Compuestos pesados + isolación

      ═══════════════════════════════════
      AJUSTE POR OBJETIVO
      ═══════════════════════════════════
      musculo      → Reps: 8-12 | Enfoque en tensión muscular
      perder_grasa → Reps: 12-20 | Mayor volumen
      resistencia  → Reps: 15-20 | Poco descanso

      ═══════════════════════════════════
      DATOS DEL USUARIO
      ═══════════════════════════════════
      nombre:       ${nombre}
      edad:         ${edad} años
      peso:         ${peso} kg
      altura:       ${altura} cm
      nivel:        ${nivel}
      objetivo:     ${objetivo}
      lesiones:     ${lesiones}
      equipamiento: ${equipamiento}
      días/semana:  ${dias}
      descanso:     ${descanso} seg entre series
      duración:     ${duracion} min por sesión
      intensidad:   ${intensidad}

      ═══════════════════════════════════
      REGLAS GLOBALES
      ═══════════════════════════════════
      - EXACTAMENTE ${dias} objetos deben ser entrenamiento
      - El resto deben ser Descanso
      - Un día de entrenamiento con menos de 5 ejercicios es INVÁLIDO
      - NO usar null, undefined ni valores vacíos
      - NO usar comas finales

      SI NO PUEDES CUMPLIR TODAS LAS REGLAS EXACTAMENTE:
      Devuelve: []
      `;

    let parsed = null;

    // 🔁 Reintentos
    for (let i = 0; i < 3; i++) {

      try {

        const response = await axios.post(
          "http://localhost:11434/api/generate",
          {
            model: "llama3",
            prompt,
            stream: false
          }
        );

        const raw = response.data.response;
        console.log("RAW IA:", raw);

        const limpio = limpiarTexto(raw);

        try {
          parsed = JSON.parse(limpio);
          break;
        } catch (e) {
          console.log("❌ error parseando:", e.message);
        }

      } catch (err) {
        console.log("❌ error en petición:", err.message);
      }
    }

    if (!parsed) {
      return res.status(500).json({
        error: "La IA no devolvió un formato válido"
      });
    }

    const rutinaFinal = integrarRutina(plantilla, parsed, dias);

    if (!rutinaFinal) {
      return res.status(500).json({
        error: "No se pudo construir la rutina"
      });
    }

    // ✔️ respuesta final consistente
    // Al final de generateRoutine, reemplaza el Rutina.create:
    const rutinaGuardada = await Rutina.create({
      usuarioId: req.usuario.id,     // ← viene del token
      usuario: {
        nombre, edad, peso, altura,
        objetivo, nivel, dias, lesiones, fechaInicio
      },
      opciones: {
        descanso:     req.body.descanso     || "",
        duracion:     req.body.duracion     || "",
        intensidad:   req.body.intensidad   || "",
        equipamiento: req.body.equipamiento || ""
      },
      rutina: rutinaFinal
    });

  return res.json({
    id:     rutinaGuardada._id,
    rutina: rutinaFinal
  });

  } catch (error) {
    console.error("❌ error general:", error.message);
    return res.status(500).json({
      error: "Error interno del servidor"
    });
  }
};

module.exports = { generateRoutine };