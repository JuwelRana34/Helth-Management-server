const express = require("express");

const { addDoctor, getDoctor, deleteDoctor,singleDoctor } = require('../controllers/doctors.controller')


const router = express.Router();

router.post('/doctor', addDoctor)
router.delete('/doctor/:id', deleteDoctor)
router.get('/doctor', getDoctor)
router.get('/doctor/:id',singleDoctor)


module.exports = router;