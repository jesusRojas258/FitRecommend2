const mongoose = require("mongoose");

const perfilSchema = new mongoose.Schema({
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
    unique: true
  },
  nombre:      String,
  edad:        Number,
  peso:        Number,
  altura:      Number,
  objetivo:    String,
  nivel:       String,
  dias:        Number,
  lesiones:    String,
  fechaInicio: String,
  actualizadoEn: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Perfil", perfilSchema, "perfiles");