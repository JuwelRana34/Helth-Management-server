const express = require("express");
const { User, spcificUser} = require("../controllers/data.controller");

const router = express.Router();

router.get("/users", User);
router.get("/user/:email", spcificUser);

module.exports = router;