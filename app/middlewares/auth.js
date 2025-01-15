const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");

exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; 

    if (!token) {
        return res.status(401).send({ message: "Token no proporcionado" });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: "No autorizado" });
        }
        req.userId = decoded.id; 
        next();
    });
};