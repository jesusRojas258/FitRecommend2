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

conectarDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
  });
});

// En server.js, después de conectarDB():
conectarDB().then(() => {
  console.log("MONGO_URI:", process.env.MONGO_URI); // ← verifica que no sea undefined
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
  });
});