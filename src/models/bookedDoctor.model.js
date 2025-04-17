const mongoose = require('mongoose');

const BookedDoctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    dob: { type: Date },
    image: { type: String, default: '' },
    gender: { type: String, required: true },
    specialty: { type: String, required: true }, // Doctor's specialization
    brief: { type: String, required: true },     // Short description
    phone: { type: String, required: true },     // Contact number
    email: { type: String, required: true },     // Doctor email
    patientEmail: { type: String, required: true }, // Patient email
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected'],
      default: 'Pending',
    },
  },
  {
    timestamps: true, // ✅ Automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model('BookedDoctor', BookedDoctorSchema);
