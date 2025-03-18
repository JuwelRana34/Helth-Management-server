const Post = require("../models/post.model");

// Get all users
exports.getUsers = async function (req, res) {
  try {
    const users = await Post.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data from database", error });
  }
};

// Create a new user
exports.createUser = async function (req, res) {
  try {
    const newUser = new Post(req.body);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ message: "Error saving data to database", error });
  }
};
