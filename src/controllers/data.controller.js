const User = require("../models/user.model");
const Payment = require("../models/payments.model");
const Schedule = require("../models/Schedule.model");


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
    const user = await User.findOne({ email: email })
    res.status(200).json({ user: user })

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


exports.RemoveStatus = async (req, res) => {
  const { email } = req.params;

  try {
    const result = await User.updateOne(
      { email: email },
      { $unset: { status: "true" } }
    )
  }
  catch (error) {
    res.status(500).send({ error: error })
  }
}


exports.UserStatus = async (req, res) => {
  const { email } = req.params;
  console.log("before status", email);

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update only if status is not already set
    if (!user.status) {
      user.status = "pending";
      await user.save();
    }

    res.status(200).json({ message: "User status updated", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update user", error });
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
exports.AllDetails = async function (req, res) {
  try {
    // Aggregating Users Data
    const userStats = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 }
        }
      }
    ]);

    const roleCounts = {};
    userStats.forEach(stat => {
      roleCounts[stat._id] = stat.count;
    });

    // Aggregating Payments Data
    const paymentStats = await Payment.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" }
        }
      }
    ]);

    // Aggregating Schedules Data
    const totalSchedules = await Schedule.countDocuments();

    // Send all data back as a response
    res.status(200).json({
      userStats: roleCounts,
      totalPayments: paymentStats[0]?.totalAmount || 0,
      totalSchedules
    });

  } catch (error) {
    res.status(500).json({ message: "Error fetching data from database", error });
  }
};

