require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const db = mongoose.connection.db;
  
  const colecciones = await db.listCollections().toArray();
  console.log("Colecciones en la BD:");
  colecciones.forEach(c => console.log(" -", c.name));

  // Muestra cuántos docs hay en cada una
  for (const col of colecciones) {
    const count = await db.collection(col.name).countDocuments();
    console.log(`   ${col.name}: ${count} documentos`);
  }

  process.exit(0);
});