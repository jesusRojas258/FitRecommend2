/**
 * @file: app.js
 * @project: FitRecommend
 */

const express = require("express");
const cors = require("cors");

const app = express();

// JSON primero
app.use(express.json());

// CORS GLOBAL SIMPLE (sin lógica)
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));

// forzar preflight
app.options("*", cors());

// health check
app.get("/", (req, res) => {
  res.send("Backend funcionando");
});

// rutas DESPUÉS
try {
  app.use("/api", require("./routes/global.routes"));
  app.use("/api", require("./routes/chat.routes"));
  app.use("/api/auth", require("./routes/auth.routes"));
} catch (e) {
  console.error("Route import error:", e);
}

module.exports = app;