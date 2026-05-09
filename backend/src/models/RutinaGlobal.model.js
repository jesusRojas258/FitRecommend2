const mongoose = require("mongoose");

const diaSchema = new mongoose.Schema({
  dia:       String,
  fecha:     String,
  nombreDia: String,
  titulo:    String,
  ejercicios: [String]
});

const rutinaGlobalSchema = new mongoose.Schema({
  autor: String,
  descripcion: String,
  nivel: String,
  objetivo: String,
  opciones: {
    descanso:     String,
    duracion:     String,
    intensidad:   String,
    equipamiento: String
  },
  rutina: [diaSchema],
  creadoEn: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("RutinaGlobal", rutinaGlobalSchema, "rutinasGlobales");