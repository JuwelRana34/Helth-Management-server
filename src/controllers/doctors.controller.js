const Doctor = require('../models/doctor.model');

exports.addDoctor = async (req, res) => {
    try {
        // Validate request body to ensure all required fields are present
        const { name, dob, image, gender, specialty, brief, phone, email } = req.body;

        // if (!name || !image || !gender || !specialty || !brief || !phone || !email) {
        //     return res.status(400).json({ message: "All fields are required!" });
        // }

        const newDoctor = await Doctor.create({
            name,
            dob: dob || Date.now(), // Ensure date is handled properly
            image,
            gender,
            specialty,
            brief,
            phone,
            email
        });
        // console.log(newDoctor, 'server')

        // const savedDoctor = await newDoctor.save();
        res.status(201).send('successfully added')

    } catch (err) {
        res.status(500).json({
            message: "Error from doctor server",
            error: err.message // Include error details for debugging
        });
    }
};


exports.getDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.find();
        res.status(200).json(doctor)
    }
    catch (err) {
        res.status(500).json(err.message)
    }
}


exports.deleteDoctor = async (req, res) => {
    const { id } = req.params

    try {
        await Doctor.findByIdAndDelete(id)
        res.status(200).json({ message: "Doctor deleted successfully" });

    } catch (error) {
        res.status(500).json(error.message)
    }
}

exports.singleDoctor = async (req, res) => {
    const { id } = req.params;

    try {
        const singleDoctor = await Doctor.findById(id)
        res.status(200).json(singleDoctor);
    } catch (error) {
        console.error('Error fetching session:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}