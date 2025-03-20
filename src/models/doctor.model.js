const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        date: { type: Date, default: Date.now },
        image: { type: String, required: true },
        gender: { type: String, required: true },
        specialty: { type: String, required: true }, // Doctor's specialization
        brief: { type: String, required: true }, // Short description about the doctor
        phone: { type: String, required: true }, // Contact number
        email: { type: String, required: true}, // Email with unique constraint
    },
) 

module.exports = mongoose.model("Doctor", DoctorSchema);