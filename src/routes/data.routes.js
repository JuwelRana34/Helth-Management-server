const express = require("express");
const {DeleteUser, User, spcificUser,updateUser} = require("../controllers/data.controller");

const router = express.Router();

router.get("/users", User);
router.get("/user/:email", spcificUser);
router.patch("/users/role/:id", updateUser);
router.delete("/users/:id", DeleteUser);

module.exports = router; 