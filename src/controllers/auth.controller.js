const User = require("../models/user.model");

// Register a User
exports.registerUser = async (req, res) => {
  try {
    const { name, email, photo } = req.body;
    console.log(name)
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.send("Login successfully");
    }

    const newUser = new User({ name, email, img: photo });
    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};
