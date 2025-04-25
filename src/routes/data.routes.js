const express = require("express");
const {DeleteUser, User, spcificUser,updateUser ,AllDetails,UserStatus,RemoveStatus} = require("../controllers/data.controller");

const router = express.Router();

router.get("/users", User);
router.get("/user/:email", spcificUser);
router.patch("/users/role/:id", updateUser);
router.patch("/users/status/:email", UserStatus);
router.patch("/users/remove-status/:email", RemoveStatus);
router.delete("/users/:id", DeleteUser);
router.get("/allDetailsAboutWebiste", AllDetails);

module.exports = router; 