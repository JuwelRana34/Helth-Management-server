const mongoose = require('mongoose');

const DoctorScheduleSchema = new mongoose.Schema({
  doctorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Doctor", 
    required: true 
  },
  date: { 
    type: Date, // Changed to Date type for better querying and comparisons
    required: true 
  }, 
  slots: [
    {
      time: { 
        type: String, 
        required: true 
      }, 
      bookedUsers: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
      }],
      maxBookings: { 
        type: Number, 
        default: 30 
      },
    },
  ],
});

module.exports = mongoose.model('Schedule', DoctorScheduleSchema);
