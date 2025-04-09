const Doctor = require("../models/doctor.model");
const Schedule = require("../models/Schedule.model");
const mongoose = require('mongoose');
const User  = require("../models/user.model");
exports.getBookedSchedule = async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  let objectUserId;
  try {
    objectUserId = new mongoose.Types.ObjectId(userId);
  } catch (err) {
    return res.status(400).json({ error: 'Invalid User ID format' });
  }

  const schedules = await Schedule.find({
    'slots.bookedUsers': objectUserId
  })
    .populate('doctorId', 'name')
    .exec();

  const userBookings = [];

  schedules.forEach(schedule => {
    schedule.slots.forEach(slot => {
      if (slot.bookedUsers.some(id => id.equals(objectUserId))) {
        userBookings.push({
          date: schedule.date,
          time: slot.time,
          doctorName: schedule.doctorId.name
        });
      }
    });
  });


  res.json(userBookings);
};

exports.bookSchedule = async (req, res) => {
  const { doctorId, userId, date, time } = req.body;

  const schedule = await Schedule.findOne({ doctorId, date });

   console.log( " line48" , schedule)

  if (!schedule) return res.status(404).json({ msg: "Schedule not found" });

  const slot = schedule.slots.find((s) => s.time === time);
  if (!slot) return res.status(400).json({ msg: "Slot not found" });

  if (slot.bookedUsers.includes(userId)) {
    return res.status(400).json({ msg: "Already booked" });
  }

  if (slot.bookedUsers.length >= slot.maxBookings) {
    return res.status(400).json({ msg: "Slot full" });
  }
  
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  
  // Check if the user has a subscription plan
  if (user.subscriptionPlan !== "") {
  
    // BASIC PLAN: must have at least 1 ticket
    if (user.subscriptionPlan === "basic" && user.ticket > 0) {
      slot.bookedUsers.push(userId);
      await schedule.save();
  
      await User.findByIdAndUpdate(
        userId,
        {
          $inc: { ticket: -1 } // 👈 fix: subtract 1, don't use `ticket - 1`
        },
        { new: true, runValidators: true }
      );

      
    }
  
    // FAMILY or PREMIUM PLAN: check if subscription is still active
    else if (
      (user.subscriptionPlan === "family" || user.subscriptionPlan === "premium") &&
      user.subscriptions > new Date()
    ) {
      slot.bookedUsers.push(userId);
      await schedule.save();
    }
  
    // EXPIRED or NO TICKET
    else {
      return res.status(403).json({ error: "Subscription expired or no ticket available" });
    }
  
  } else {
    return res.status(403).json({ error: "You need to purchase a subscription" });
  }



  res.json({ msg: "Appointment booked successfully" });
};

exports.getScheduleByDoctorAndDate = async (req, res) => {
  const { doctorId, date } = req.query;
  // Validate the input parameters
  if (!doctorId || !date) {
    return res.status(400).json({ msg: 'doctorId and date are required' });
  }

  const schedule = await Schedule.findOne({ doctorId, date });
  if (!schedule) return res.status(404).json({ msg: 'No schedule found' });
  return res.json(schedule);
};

