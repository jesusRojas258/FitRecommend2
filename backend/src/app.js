/**
 * @file:       app.js
 * @project:    FitRecommend
 * @brief:      Configuración principal de la aplicación Express y registro de rutas
 * @author:     Jesus Rojas
 * @date:       25-02-2026
 */


const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: "http://localhost:5173"
}));

app.use(express.json());

const chatRoutes = require("./routes/chat.routes");
const globalRoutes = require("./routes/global.routes");
const authRoutes = require("./routes/auth.routes");


app.use("/api", globalRoutes);

app.use("/api", chatRoutes);

app.use("/api/auth", authRoutes);

module.exports = app;
