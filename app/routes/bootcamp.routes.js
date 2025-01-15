const express = require("express");
const { createBootcamp } = require("../controllers/bootcamp.controller.js");
const { verifyToken } = require("../middlewares/auth.js");
const router = express.Router();

// Crear un bootcamp
router.post("/bootcamp", verifyToken, createBootcamp);

module.exports = router;
