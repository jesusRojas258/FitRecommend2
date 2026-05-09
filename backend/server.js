/**
 * @file:       server.js
 * @project:    FitRecommend
 * @brief:      Punto de arranque del servidor
 * @author:     Jesus Rojas
 * @date:       25-02-2026
 */

require("dotenv").config();

const app = require("./src/app");
const conectarDB = require("./src/config/db");

const PORT = process.env.PORT || 3000;

conectarDB()
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error conectando DB:", err);
    // ✅ Levanta el servidor aunque falle la DB
    // (opcional, depende si tu app puede funcionar sin DB)
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Servidor corriendo en puerto ${PORT} (sin DB)`);
    });
  });