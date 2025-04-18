const Doctor = require("../models/doctor.model");
const Schedule = require("../models/Schedule.model");
const mongoose = require('mongoose');
const User  = require("../models/user.model");
const sendConfirmationEmail = require("../utils/sendEmail");
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
exports.getALLBookedSchedule = async (req, res) => {
  try {
    const schedules = await Schedule.find({})
      .populate('doctorId')
      .populate('slots.bookedUsers');

    // Filter out slots with no booked users
    const filteredSchedules = schedules.map(schedule => {
      const filteredSlots = schedule.slots.filter(slot => 
        slot.bookedUsers && slot.bookedUsers.length > 0
      );
      return {
        ...schedule.toObject(),
        slots: filteredSlots,
      };
    }).filter(schedule => schedule.slots.length > 0); // remove schedules with no booked slots

    res.status(200).json(filteredSchedules);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch booked schedules' });
  }
};


exports.bookSchedule = async (req, res) => {
  const { doctorId, userId, date, time } = req.body;
  const schedule = await Schedule.findOne({ doctorId, date });
  const doctor = await Doctor.findById(doctorId)

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
          $inc: { ticket: -1 }
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
      return res.status(402).json({ error: "Subscription expired or you have no ticket." });
    }
  
  } else {
    return res.status(402).json({ error: "You need to purchase a subscription" });
  }
  
  const mailOptions = {
    from: '"Health Care" <rk370613@gmail.com>',
    to: user.email,
    subject: "📅 Booking Confirmation - Health Care Appointment",
    html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f6f8;">
      <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        
        <!-- Header -->
        <div style="background-color: #00796b; padding: 20px; text-align: center;">
          <img src="https://cdn-icons-png.flaticon.com/128/4326/4326328.png" alt="Health Care" style="height: 50px;" />
          <h2 style="color: #ffffff; margin-top: 10px;">Booking Confirmed</h2>
        </div>
  
        <!-- Body -->
        <div style="padding: 30px;">
          <p style="font-size: 16px; color: #333333;">Dear ${user.name || "Customer"},</p>
          <p style="font-size: 16px; color: #333333;">
            Your appointment has been successfully booked through Health Care. Below are the details of your booking:
          </p>
  
          <hr style="margin: 20px 0;" />
  
          <p style="font-size: 16px; color: #333333;"><strong>Doctor Name:</strong> ${doctor.name}</p>
          <p style="font-size: 16px; color: #333333;"><strong>Appointment Date:</strong> ${date}</p>
          <p style="font-size: 16px; color: #333333;"><strong>Time Slot:</strong> ${slot.time}</p>
    
          <hr style="margin: 20px 0;" />
  
          <p style="font-size: 16px; color: #333333;"><strong>Plan:</strong> ${user.subscriptionPlan}</p>
          <p style="font-size: 16px; color: #333333;"><strong>Remaining Tickets:</strong> ${user.ticket}</p>
          <p style="font-size: 16px; color: #333333;"><strong>Plan Valid Until:</strong> ${user.subscriptionPlan === 'basic'? " unlimited" : user.subscriptions}</p>
  
          <hr style="margin: 20px 0;" />
  
          <p style="font-size: 14px; color: #666666;">
            If you need to reschedule or cancel, please log in to your account.
          </p>
          <p style="font-size: 14px; color: #666666;">
            Thank you for choosing <strong>Health Care</strong>. We’re here to support your well-being.
          </p>
        </div>
  
        <!-- Footer -->
        <div style="background-color: #f1f1f1; text-align: center; padding: 15px; font-size: 13px; color: #999;">
          © ${new Date().getFullYear()} Health Care. All rights reserved.
        </div>
      </div>
    </div>
    `,
  };
  
  
  await sendConfirmationEmail(mailOptions)

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

