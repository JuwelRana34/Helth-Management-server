const express = require("express");

const {addDoctor, getDoctor} = require('../controllers/doctors.controller')

const router = express.Router();

router.post('/doctor',addDoctor)
router.get('/doctor',getDoctor)


module.exports = router;