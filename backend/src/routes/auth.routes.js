const express = require("express");
const router  = express.Router();
const { registro, verificarCorreo, login, guardarPerfil, obtenerPerfil } = require("../controllers/auth.controller");
const { verificarToken } = require("../middleware/auth.middleware");

router.post("/perfil",  verificarToken, guardarPerfil);
router.get("/perfil",   verificarToken, obtenerPerfil);

router.post("/registro",          registro);
router.get("/verificar/:token",   verificarCorreo);
router.post("/login",             login);
router.post("/perfil",  verificarToken, guardarPerfil);
router.get("/perfil",   verificarToken, obtenerPerfil);

module.exports = router;