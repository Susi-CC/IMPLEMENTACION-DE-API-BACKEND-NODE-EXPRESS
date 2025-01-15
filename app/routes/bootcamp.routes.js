const express = require("express");
const { createBootcamp, addUser } = require("../controllers/bootcamp.controller.js");
const { verifyToken } = require("../middlewares/auth.js");
const router = express.Router();


router.post("/bootcamp", verifyToken, createBootcamp);
router.post("/bootcamp/adduser", verifyToken, addUser);

module.exports = router;
