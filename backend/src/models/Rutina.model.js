const mongoose = require("mongoose");

const diaSchema = new mongoose.Schema({
  dia:        String,
  fecha:      String,
  nombreDia:  String,
  titulo:     String,
  ejercicios: [String]
});

const rutinaSchema = new mongoose.Schema({
  usuarioId: {                          // ← nuevo
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true
  },
  usuario: {
    nombre:      String,
    edad:        Number,
    peso:        Number,
    altura:      Number,
    objetivo:    String,
    nivel:       String,
    dias:        Number,
    lesiones:    String,
    fechaInicio: String
  },
  opciones: {
    descanso:     String,
    duracion:     String,
    intensidad:   String,
    equipamiento: String
  },
  rutina:   [diaSchema],
  creadoEn: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Rutina", rutinaSchema, "MisRutinas");