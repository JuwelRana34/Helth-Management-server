const express = require("express");

const {addDoctor, getDoctor, deleteDoctor} = require('../controllers/doctors.controller')


const router = express.Router();

router.post('/doctor',addDoctor)
router.delete('/doctor/:id',deleteDoctor)
router.get('/doctor',getDoctor)


module.exports = router;