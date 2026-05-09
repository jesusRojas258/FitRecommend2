const express = require("express");
const router  = express.Router();
const { verificarToken } = require("../middleware/auth.middleware");
const {
  compartirRutina,
  obtenerRutinasGlobales,
  obtenerMisRutinas,
  eliminarRutina,
  guardarRutinaGlobal
} = require("../controllers/global.controller");

// Pública
router.get("/globales", obtenerRutinasGlobales);

// Protegidas
router.get("/mis-rutinas",        verificarToken, obtenerMisRutinas);
router.delete("/mis-rutinas/:id", verificarToken, eliminarRutina);
router.post("/compartir",         verificarToken, compartirRutina);
router.post("/guardar-global",    verificarToken, guardarRutinaGlobal);

module.exports = router;