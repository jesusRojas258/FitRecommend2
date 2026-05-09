const express = require("express");
const cors = require("cors");

const app = express();

// CORS primero
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://fit-recommend2.vercel.app"
  ]
}));

// JSON
app.use(express.json());

// ❌ NO app.options("*")

// rutas normales
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api", require("./routes/global.routes"));
app.use("/api", require("./routes/chat.routes"));

// health check
app.get("/", (req, res) => {
  res.send("Backend funcionando");
});

module.exports = app;