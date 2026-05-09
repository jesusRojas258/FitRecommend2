const express = require("express");
const cors = require("cors");

const app = express();

// 1. CORS PRIMERO (obligatorio)
app.use(cors());

// 2. JSON
app.use(express.json());

// 3. OPTIONS global (IMPORTANTE)
app.options("*", cors());

// 4. rutas después
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api", require("./routes/global.routes"));
app.use("/api", require("./routes/chat.routes"));

app.get("/", (req, res) => {
  res.send("Backend funcionando");
});

module.exports = app;