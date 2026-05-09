/**
 * @file:       chat.routes.js
 * @project:    FitRecommend
 * @brief:      Definición de rutas HTTP para la generación de rutinas mediante el controlador de chat
 * @author:     Jesus Rojas
 * @date:       25-02-2026
*/


const express = require("express");
const router  = express.Router();
const { generateRoutine } = require("../controllers/chat.controller");
const { verificarToken }  = require("../middleware/auth.middleware");

router.post("/chat", verificarToken, generateRoutine);

module.exports = router;
