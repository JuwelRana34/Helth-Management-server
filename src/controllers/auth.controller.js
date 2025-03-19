const User = require("../models/user.model");

// Register a User
exports.registerUser = async (req, res) => {
  try {
    const { name, email, photo } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
       console.log("User already registered ");
      return res.send("Login successfully");
    }
    const newUser = await  User.create({ name, email, img: photo });

    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};
