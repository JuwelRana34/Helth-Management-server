const express = require("express");
const router = express.Router();
const { getBookedSchedule, bookSchedule, getScheduleByDoctorAndDate, getALLBookedSchedule} = require("../controllers/schedule.controller");

router.get("/schedule/:userId",getBookedSchedule)
router.post("/bookSchedule",bookSchedule )
router.get("/schedule",getScheduleByDoctorAndDate )
router.get("/AllSchedule",getALLBookedSchedule )

module.exports = router;