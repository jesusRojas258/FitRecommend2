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

const allowedOrigins = [
  "http://localhost:5173",
  "https://fit-recommend2.vercel.app"
];

app.use(cors({
  origin: (origin, callback) => {

    // Permitir requests sin origin
    if (!origin) {
      return callback(null, true);
    }

    // Permitir dominio principal
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Permitir previews Vercel
    if (
      typeof origin === "string" &&
      origin.includes(".vercel.app")
    ) {
      return callback(null, true);
    }

    return callback(new Error("No permitido por CORS"));
  },

  credentials: true
}));

app.use(express.json());

const chatRoutes = require("./routes/chat.routes");
const globalRoutes = require("./routes/global.routes");
const authRoutes = require("./routes/auth.routes");

app.use("/api", globalRoutes);
app.use("/api", chatRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Backend funcionando");
});

module.exports = app;