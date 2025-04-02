const User = require("../models/user.model");
exports.User = async function (req, res) {
  try {
    const users = await User.find()
    res.status(200).json(users)

  } catch (error) {
    res.status(500).json({ message: "Error fetching data from database", error });
  }
}
exports.spcificUser = async function (req, res) {
  try {
    const email = req.params.email
    const user = await User.findOne({email: email})
    res.status(200).json({user: user})

  } catch (error) {
    res.status(500).json({ message: "Error fetching data from database", error });
  }
}