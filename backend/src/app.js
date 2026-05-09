const express = require("express");
const cors = require("cors");

const app = express();

/**
 * 🔥 CORS GLOBAL FORZADO
 */
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(express.json());

/**
 * RUTAS
 */
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api", require("./routes/global.routes"));
app.use("/api", require("./routes/chat.routes"));

app.get("/", (req, res) => {
  res.send("Backend funcionando");
});

module.exports = app;