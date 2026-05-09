const express = require("express");
const cors = require("cors");

const app = express();

const corsOptions = {
  origin: function (origin, callback) {
    // Permite cualquier subdominio de vercel.app o sin origin (Postman, etc.)
    if (!origin || origin.endsWith(".vercel.app")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
// ❌ Borra el app.options(...) — no lo necesitas

app.use(express.json());

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api", require("./routes/global.routes"));
app.use("/", require("./routes/chat.routes"));

app.get("/", (req, res) => {
  res.send("Backend funcionando");
});

module.exports = app;