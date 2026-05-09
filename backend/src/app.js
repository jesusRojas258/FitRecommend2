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

// CORS simple y estable
app.use(cors());

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