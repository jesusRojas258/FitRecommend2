const express = require("express");
const router  = express.Router();
const { registro, verificarCorreo, login } = require("../controllers/auth.controller");

router.post("/registro",          registro);
router.get("/verificar/:token",   verificarCorreo);
router.post("/login",             login);

module.exports = router;