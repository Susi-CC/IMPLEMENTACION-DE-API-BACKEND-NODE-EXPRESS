const express = require("express");
const { signup, signin, getUserWithBootcamps, getAllUsersWithBootcamps, updateUserById, deleteUserById } = require("../controllers/user.controller");
const { verifyToken } = require("../middlewares/auth");
const router = express.Router();

router.post("/user/signup", signup);
router.post("/signin", signin);
router.get("/user/:userId", verifyToken, getUserWithBootcamps);
router.get("/user", verifyToken, getAllUsersWithBootcamps);
router.put("/user/:userId", verifyToken, updateUserById);
router.delete("/user/:userId", verifyToken, deleteUserById);

module.exports = router;
