const express = require("express");
const app = express();
const userRoutes = require("./app/routes/user.routes.js"); // Importar rutas de usuarios
const bootcampRoutes = require("./app/routes/bootcamp.routes.js");
const db = require("./app/models"); // Importar base de datos

// Middleware para parsear JSON
app.use(express.json());

// Configurar las rutas
app.use("/api", userRoutes);
app.use("/api", bootcampRoutes);

// Sincronizar base de datos y luego iniciar servidor
const PORT = process.env.PORT || 3001;
db.sequelize.sync({ force: false }).then(() => {
    console.log("Base de datos sincronizada.");
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto ${PORT}.`);
    });
});