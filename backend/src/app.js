/**
 * @file:       app.js
 * @project:    FitRecommend
 * @brief:      Configuración principal de Express
 * @author:     Jesus Rojas
 * @date:       25-02-2026
 */

const express = require("express");
const cors = require("cors");

const app = express();

// Dominios permitidos
const allowedOrigins = [
  "http://localhost:5173",
  "https://fit-recommend2.vercel.app"
];

// Configuración CORS
app.use(cors({
  origin: function (origin, callback) {

    // Permitir requests sin origin (Postman/mobile/etc)
    if (!origin) {
      return callback(null, true);
    }

    // Permitir localhost, dominio principal y previews Vercel
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith(".vercel.app")
    ) {
      return callback(null, true);
    }

    // Bloquear otros dominios
    return callback(new Error("No permitido por CORS"));
  },

  credentials: true
}));

// Middleware JSON
app.use(express.json());

// Importar rutas
const chatRoutes = require("./routes/chat.routes");
const globalRoutes = require("./routes/global.routes");
const authRoutes = require("./routes/auth.routes");

// Rutas API
app.use("/api", globalRoutes);

app.use("/api", chatRoutes);

app.use("/api/auth", authRoutes);

// Ruta raíz
app.get("/", (req, res) => {
  res.send("Backend funcionando");
});

module.exports = app;