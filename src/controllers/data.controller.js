const User = require("../models/user.model");

exports.User = async function (req, res) {
  try {
    const users = await User.find()
    res.status(200).json(users)

  } catch (error) {
    res.status(500).json({ message: "Error fetching data from database", error });
  }
}