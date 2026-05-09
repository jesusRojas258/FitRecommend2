const bcrypt    = require("bcryptjs");
const jwt       = require("jsonwebtoken");
const crypto    = require("crypto");
const Usuario   = require("../models/Usuario.model");
const { enviarVerificacion } = require("../config/email");



// REGISTRO
const registro = async (req, res) => {
  try {
    const { username, correo, password } = req.body;

    if (!username || !correo || !password) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
    }

    // Verificar duplicados
    const existeUsername = await Usuario.findOne({ username });
    if (existeUsername) {
      return res.status(400).json({ error: "El nombre de usuario ya está en uso" });
    }

    const existeCorreo = await Usuario.findOne({ correo });
    if (existeCorreo) {
      return res.status(400).json({ error: "El correo ya está registrado" });
    }

    const hash  = await bcrypt.hash(password, 10);
    const token = crypto.randomBytes(32).toString("hex");

    await Usuario.create({
      username,
      correo,
      password: hash,
      tokenVerificacion: token
    });

    await enviarVerificacion(correo, username, token);

    return res.json({ ok: true, mensaje: "Revisa tu correo para verificar tu cuenta" });

  } catch (error) {
    console.error("❌ error registro:", error.message);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

// VERIFICAR CORREO
const verificarCorreo = async (req, res) => {
  try {
        const { token } = req.params;

    console.log("Token recibido:", token);
    console.log("Longitud token:", token.length);

    // Buscar todos los usuarios con tokenVerificacion para comparar
    const todos = await Usuario.find({ tokenVerificacion: { $exists: true } });
    console.log("Usuarios con token pendiente:", todos.map(u => ({
      username: u.username,
      token: u.tokenVerificacion,
      longitud: u.tokenVerificacion?.length
    })));

    const usuario = await Usuario.findOne({ tokenVerificacion: token });
    console.log("Usuario encontrado:", usuario ? usuario.username : "ninguno");

    if (!usuario) {
      return res.status(400).json({ error: "Token inválido o expirado" });
    }

    usuario.verificado = true;
    usuario.tokenVerificacion = undefined;
    await usuario.save();

    return res.json({ ok: true, mensaje: "Cuenta verificada correctamente" });

  } catch (error) {
    console.error("❌ error verificación:", error.message);
    return res.status(500).json({ error: "Error interno" });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const usuario = await Usuario.findOne({ correo });

    if (!usuario) {
      return res.status(401).json({ error: "Correo o contraseña incorrectos" });
    }

    if (!usuario.verificado) {
      return res.status(401).json({ error: "Debes verificar tu correo antes de iniciar sesión" });
    }

    const valido = await bcrypt.compare(password, usuario.password);
    if (!valido) {
      return res.status(401).json({ error: "Correo o contraseña incorrectos" });
    }

    const token = jwt.sign(
      { id: usuario._id, username: usuario.username, correo: usuario.correo },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      ok: true,
      token,
      usuario: {
        id:       usuario._id,
        username: usuario.username,
        correo:   usuario.correo
      }
    });

  } catch (error) {
    console.error("❌ error login:", error.message);
    return res.status(500).json({ error: "Error interno" });
  }
};

module.exports = { registro, verificarCorreo, login };