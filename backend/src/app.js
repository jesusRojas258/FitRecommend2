const express = require("express");
const cors = require("cors");

const app = express();

// ✅ Usa el paquete cors CON opciones explícitas
const corsOptions = {
  origin: "*", // o pon tu dominio de Vercel específico
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200, // importante para preflight
};

app.use(cors(corsOptions));

// ✅ Maneja preflight de forma explícita para TODAS las rutas
app.options("*", cors(corsOptions));

app.use(express.json());

// RUTAS
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api", require("./routes/global.routes"));
app.use("/api", require("./routes/chat.routes"));

app.get("/", (req, res) => {
  res.send("Backend funcionando");
});