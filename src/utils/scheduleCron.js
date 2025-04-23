const { CronJob } = require('cron');
const moment = require('moment');
const Doctor = require('../models/doctor.model');
const Schedule = require('../models/Schedule.model');

const timeSlots = [
  '09:00 AM - 11:00 AM',
  '2:00 PM - 4:00 PM',
  '08:00 PM - 10:00 PM'
];

// This function contains your scheduling logic
const runScheduleJob = async () => {
  try {
    const today = moment().startOf('day');
    // -----------------new -------------------
    const fromDate = moment(today).subtract(7, 'days').format('YYYY-MM-DD');
    const toDate = moment(today).add(7, 'days').format('YYYY-MM-DD');
  // ----------------new end -------------------

    // Delete past schedules
    // await Schedule.deleteMany({ date: { $lt: today.format('YYYY-MM-DD') } });

    await Schedule.deleteMany({
      $or: [
        { date: { $lt: fromDate } },
        { date: { $gt: toDate } }
      ]
    });

    const doctors = await Doctor.find();

    // for (let day = 0; day <= 7; day++) {
    for (let day = -2; day <= 7; day++) {
      const targetDate = moment(today).add(day, 'days').format('YYYY-MM-DD');
      
      for (const doctor of doctors) {
        const exists = await Schedule.findOne({
          doctorId: doctor._id,
          date: targetDate
        });

        if (!exists) {
          await Schedule.create({
            doctorId: doctor._id,
            date: targetDate,
            slots: timeSlots.map(time => ({
              time,
              bookedUsers: [],
              maxBookings: 30
            }))
          });
          console.log(`✅ Schedule added for Doctor ${doctor._id} on ${targetDate}`);
        }
      }
    }

    console.log(`✅ Schedule sync complete for ${today.format('YYYY-MM-DD')} to ${moment(today).add(7, 'days').format('YYYY-MM-DD')}`);
  } catch (error) {
    console.error('❌ Error in schedule job:', error);
  }
};

// Define the cron job and export it (optional use)
const scheduleJob = new CronJob(
  '0 0 * * *', // Every day at midnight
  runScheduleJob,
  null,
  false, // Don't auto-start
  'Asia/Dhaka'
);

module.exports = {
  runScheduleJob
};
