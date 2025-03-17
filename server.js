require("dotenv").config();
const express = require("express");
// const cors = require("cors");
const connectDB  = require("./src/config/db");
const authRoutes = require("./src/routes/auth.routes");
const User = require("./src/routes/data.routes");

const app = express();
connectDB ();
// Middleware
// app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", User);

// Server Start ataurwd
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
