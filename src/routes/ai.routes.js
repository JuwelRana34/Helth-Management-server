const express = require("express");
const { Ai } = require("../controllers/ai.controller");

const router = express.Router();

router.post("/ai", Ai);

module.exports = router;