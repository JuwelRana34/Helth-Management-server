const BookedDoctor = require('../models/bookedDoctor.model');

exports.addBooked = async (req, res) => {
  try {
    const data = req.body;
    // console.log('[POST] Booking Request Received:', data);


    const newBooking = new BookedDoctor(data);
    const result = await newBooking.save();

    res.status(201).json({
      success: true,
      message: 'Doctor successfully booked.',
      data: result,
    });
  } catch (error) {
    console.error('[ERROR] Booking Failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to book doctor.',
      error: error.message,
    });
  }
};


exports.getBooked = async (req, res) => {
    try {
      const doctors = await BookedDoctor.find();
      res.status(200).json({
        success: true,
        message: 'Booked doctors fetched successfully',
        data: doctors,
      });
    } catch (err) {
      console.error('[ERROR] Fetching Booked Doctors:', err);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch booked doctors',
        error: err.message,
      });
    }
  };
