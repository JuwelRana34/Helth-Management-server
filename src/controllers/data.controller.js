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
exports.updateUser = async function (req, res) {
  const userId = req.params.id;
  const { role } = req.body;

  try {
    if (!role) {
      return res.status(400).json({ message: "Role is required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
};
exports.DeleteUser = async function (req, res) {
  const userId = req.params.id;
  try {
    if (!userId) {
      return res.status(400).json({ message: "Role is required" });
    }

  await User.findByIdAndDelete(userId);

    res.status(200).json({ user: "user successfully deleted" });
  } catch (error) {
    console.error("Error updating user:", error);
    res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }

};
