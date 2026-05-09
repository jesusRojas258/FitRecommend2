const RutinaGlobal = require("../models/RutinaGlobal.model");
const Rutina = require("../models/Rutina.model");

// Compartir una rutina de MisRutinas a rutinasGlobales
const compartirRutina = async (req, res) => {
  try {
    const { rutinaId, descripcion } = req.body;

    console.log("📥 Body recibido:", req.body);  // ← verifica que llegan los datos

    if (!rutinaId || !descripcion) {
      return res.status(400).json({ error: "Faltan datos" });
    }

    const rutina = await Rutina.findById(rutinaId);
    console.log("🔍 Rutina encontrada:", rutina);  // ← verifica que encuentra la rutina

    if (!rutina) {
      return res.status(404).json({ error: "Rutina no encontrada" });
    }

    const nueva = await RutinaGlobal.create({
      autor:       rutina.usuario.nombre,
      descripcion,
      nivel:       rutina.usuario.nivel,
      objetivo:    rutina.usuario.objetivo,
      opciones:    rutina.opciones,
      rutina:      rutina.rutina
    });

    console.log("✅ Guardada en rutinasGlobales:", nueva._id);  // ← verifica que se guardó

    return res.json({ ok: true, id: nueva._id });

  } catch (error) {
    console.error("❌ error compartir:", error.message);
    return res.status(500).json({ error: "Error interno" });
  }
};

// Obtener todas las rutinas globales para el blog
const obtenerRutinasGlobales = async (req, res) => {
  try {
    const rutinas = await RutinaGlobal.find()
      .sort({ creadoEn: -1 })
      // ❌ antes solo traía algunos campos
      // ahora trae todo
    
    return res.json({ rutinas });
  } catch (error) {
    console.error("❌ error obteniendo globales:", error.message);
    return res.status(500).json({ error: "Error interno" });
  }
};
// Obtener rutinas guardadas del usuario (MisRutinas)
const obtenerMisRutinas = async (req, res) => {
  try {
    const rutinas = await Rutina.find({ usuarioId: req.usuario.id })
      .sort({ creadoEn: -1 });
    return res.json({ rutinas });
  } catch (error) {
    console.error("❌ error obteniendo mis rutinas:", error.message);
    return res.status(500).json({ error: "Error interno" });
  }
};

const eliminarRutina = async (req, res) => {
  try {
    const { id } = req.params;
    // Verifica que la rutina pertenece al usuario
    const eliminada = await Rutina.findOneAndDelete({
      _id: id,
      usuarioId: req.usuario.id
    });
    if (!eliminada) {
      return res.status(404).json({ error: "Rutina no encontrada" });
    }
    return res.json({ ok: true });
  } catch (error) {
    console.error("❌ error eliminando:", error.message);
    return res.status(500).json({ error: "Error interno" });
  }
};


const guardarRutinaGlobal = async (req, res) => {
  try {
    const { rutinaGlobalId } = req.body;

    if (!rutinaGlobalId) {
      return res.status(400).json({ error: "Faltan datos" });
    }

    const rutinaGlobal = await RutinaGlobal.findById(rutinaGlobalId);

    if (!rutinaGlobal) {
      return res.status(404).json({ error: "Rutina no encontrada" });
    }

    const nueva = await Rutina.create({
      usuarioId: req.usuario.id,        // ← viene del token
      usuario: {
        nombre:      req.usuario.username,
        edad:        0,
        peso:        0,
        altura:      0,
        objetivo:    rutinaGlobal.objetivo,
        nivel:       rutinaGlobal.nivel,
        dias:        0,
        lesiones:    "",
        fechaInicio: new Date().toISOString().split("T")[0]
      },
      opciones: rutinaGlobal.opciones,
      rutina:   rutinaGlobal.rutina
    });

    return res.json({ ok: true, id: nueva._id });

  } catch (error) {
    console.error("❌ error guardando rutina global:", error.message);
    return res.status(500).json({ error: "Error interno" });
  }
};

module.exports = {
  compartirRutina,
  obtenerRutinasGlobales,
  obtenerMisRutinas,
  eliminarRutina,
  guardarRutinaGlobal
};