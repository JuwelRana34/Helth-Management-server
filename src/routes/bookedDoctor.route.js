const express = require('express');
const router = express.Router();


const { addBooked,getBooked } = require('../controllers/bookedDoctor.controller');

router.post('/booked-doctor', addBooked);
router.get('/booked-doctor', getBooked);

module.exports = router;
