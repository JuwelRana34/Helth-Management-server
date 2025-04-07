const express = require("express");

const {addDoctor} = require('../controllers/doctors.controller')

const router = express.Router();

router.post('/doctor',addDoctor)


module.exports = router;