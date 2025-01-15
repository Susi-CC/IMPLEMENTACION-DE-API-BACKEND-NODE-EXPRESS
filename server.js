const express = require("express");
const app = express();
const userRoutes = require("./app/routes/user.routes.js"); 
const bootcampRoutes = require("./app/routes/bootcamp.routes.js");
const db = require("./app/models"); 

app.use(express.json());

app.use("/api", userRoutes);
app.use("/api", bootcampRoutes);

const PORT = process.env.PORT || 3000;
db.sequelize.sync({ force: false }).then(() => {
    console.log("Base de datos sincronizada.");
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto ${PORT}.`);
    });
});