const express = require("express");
const { User } = require("../controllers/data.controller");

const router = express.Router();

router.get("/users", User);

module.exports = router;