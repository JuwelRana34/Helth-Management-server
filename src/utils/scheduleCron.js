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
// const runScheduleJob = async () => {
//   try {
//     const today = moment().startOf('day');
//     // -----------------new -------------------
//     const fromDate = moment(today).subtract(7, 'days').format('YYYY-MM-DD');
//     const toDate = moment(today).add(7, 'days').format('YYYY-MM-DD');
//   // ----------------new end -------------------

//     // Delete past schedules
//     // await Schedule.deleteMany({ date: { $lt: today.format('YYYY-MM-DD') } });

//     await Schedule.deleteMany({
//       $or: [
//         { date: { $lt: fromDate } },
//         { date: { $gt: toDate } }
//       ]
//     });

//     const doctors = await Doctor.find();

//     // for (let day = 0; day <= 7; day++) {
//     for (let day = -2; day <= 7; day++) {
//       const targetDate = moment(today).add(day, 'days').format('YYYY-MM-DD');
      
//       for (const doctor of doctors) {
//         const exists = await Schedule.findOne({
//           doctorId: doctor._id,
//           date: targetDate
//         });

//         if (!exists) {
//           await Schedule.create({
//             doctorId: doctor._id,
//             date: targetDate,
//             slots: timeSlots.map(time => ({
//               time,
//               bookedUsers: [],
//               maxBookings: 30
//             }))
//           });
//           console.log(`✅ Schedule added for Doctor ${doctor._id} on ${targetDate}`);
//         }
//       }
//     }

//     console.log(`✅ Schedule sync complete for ${today.format('YYYY-MM-DD')} to ${moment(today).add(7, 'days').format('YYYY-MM-DD')}`);
//   } catch (error) {
//     console.error('❌ Error in schedule job:', error);
//   }
// };

const runScheduleJob = async () => {
  console.time('ScheduleJobExecutionTime'); // Start timing

  try {
    const today = moment().startOf('day');
    const fromDate = moment(today).subtract(1, 'days').format('YYYY-MM-DD');
    const toDate = moment(today).add(7, 'days').format('YYYY-MM-DD');

    await Schedule.deleteMany({
      $or: [
        { date: { $lt: fromDate } },
        { date: { $gt: toDate } }
      ]
    });

    const doctors = await Doctor.find();
    const targetDates = [];
    for (let day = -2; day <= 7; day++) {
      targetDates.push(moment(today).add(day, 'days').format('YYYY-MM-DD'));
    }

    const BATCH_SIZE = 50;

    for (let i = 0; i < doctors.length; i += BATCH_SIZE) {
      const batch = doctors.slice(i, i + BATCH_SIZE);

      const existing = await Schedule.find({
        doctorId: { $in: batch.map(doc => doc._id) },
        date: { $in: targetDates }
      });

      const existingSet = new Set(existing.map(s => `${s.doctorId}-${s.date}`));
      const bulkOps = [];

      for (const doctor of batch) {
        for (const date of targetDates) {
          const key = `${doctor._id}-${date}`;
          if (!existingSet.has(key)) {
            bulkOps.push({
              insertOne: {
                document: {
                  doctorId: doctor._id,
                  date,
                  slots: timeSlots.map(time => ({
                    time,
                    bookedUsers: [],
                    maxBookings: 30
                  }))
                }
              }
            });
          }
        }
      }

      if (bulkOps.length) {
        await Schedule.bulkWrite(bulkOps);
      }

      await new Promise(r => setTimeout(r, 200)); // Optional delay
    }

    console.log(`✅ Scheduling completed for ${doctors.length} doctors`);
  } catch (error) {
    console.error('❌ Scheduling failed:', error);
  }

  console.timeEnd('ScheduleJobExecutionTime'); // End timing
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
