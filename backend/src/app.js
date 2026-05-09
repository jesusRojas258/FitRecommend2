/**
 * @file: app.js
 * @project: FitRecommend
 */

const express = require("express");
const cors = require("cors");

const app = express();

/**
 * CORS estable
 */
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const allowed = [
      "http://localhost:5173",
      "https://fit-recommend2.vercel.app"
    ];

    if (
      allowed.includes(origin) ||
      origin.endsWith(".vercel.app")
    ) {
      return callback(null, true);
    }

    return callback(null, false);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ❌ ELIMINADO: app.options("*", cors())

app.use(express.json());

/**
 * RUTAS
 */
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