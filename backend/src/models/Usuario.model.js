const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  correo: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  verificado: {
    type: Boolean,
    default: false
  },
  tokenVerificacion: {
    type: String
  },
  creadoEn: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Usuario", usuarioSchema, "usuarios");