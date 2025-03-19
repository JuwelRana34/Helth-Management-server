require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB  = require("./src/config/db");
const authRoutes = require("./src/routes/auth.routes");
const User = require("./src/routes/data.routes");
const Post = require("./src/routes/post.routes");


const app = express();
connectDB ();
// Middleware
app.use(cors(
    { origin:[ "http://localhost:5173","https://healthcarebd2.netlify.app"],
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
    }  
))
app.use(express.json());


// Routes
app.use("/api/auth", authRoutes);
app.use("/api", User);
app.use("/api", Post)
// Server Start ataurwd
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
