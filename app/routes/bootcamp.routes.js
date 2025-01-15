const express = require("express");
const { createBootcamp, addUser, getAllBootcamps, getBootcampById } = require("../controllers/bootcamp.controller.js");
const { verifyToken } = require("../middlewares/auth.js");
const router = express.Router();


router.post("/bootcamp", verifyToken, createBootcamp);
router.post("/bootcamp/adduser", verifyToken, addUser);
router.get("/bootcamp", getAllBootcamps);
router.get("/bootcamp/:id", verifyToken, getBootcampById);

module.exports = router;
