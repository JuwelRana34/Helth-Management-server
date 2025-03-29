const express = require("express");

const {addDoctor, getDoctor, deleteDoctor} = require('../controllers/doctors.controller')

const router = express.Router();

router.post('/doctor',addDoctor)
router.get('/doctor',getDoctor)
router.delete('/doctor/:id',deleteDoctor)


module.exports = router;