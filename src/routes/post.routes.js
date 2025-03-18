const express = require("express");
const { createUser,getUsers } = require("../controllers/post.controller");

const router = express.Router();

router.get("/post", getUsers);
router.post("/rahat", createUser);


module.exports = router;