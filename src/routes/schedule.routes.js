const express = require("express");
const router = express.Router();
const { getBookedSchedule, bookSchedule, getScheduleByDoctorAndDate} = require("../controllers/schedule.controller");

router.get("/schedule/:userId",getBookedSchedule)
router.post("/bookSchedule",bookSchedule )
router.get("/schedule",getScheduleByDoctorAndDate )

module.exports = router;