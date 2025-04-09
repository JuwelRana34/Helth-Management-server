require("dotenv").config();
const express = require("express");
require('./src/utils/scheduleCron');
const http = require("http");
const cors = require("cors");
const connectDB  = require("./src/config/db");
const authRoutes = require("./src/routes/auth.routes");
const User = require("./src/routes/data.routes");
const Post = require("./src/routes/post.routes");
const Doctor = require("./src/routes/doctors.routes")
const Notification = require("./src/routes/notification.routes");
const Ai = require("./src/routes/ai.routes");
const Payment = require("./src/routes/payments.routes");
const initializeSocket = require("./src/utils/socket");
const contact = require('./src/routes/contact.routes');
const schedule = require('./src/routes/schedule.routes');


const app = express();
const server = http.createServer(app);
// Initialize Socket.io
initializeSocket(server);

connectDB ();
// Middleware
app.use(cors(
    { origin:[ "http://localhost:5173","https://healthcarebd2.netlify.app"],
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
    }  
))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", User);
app.use("/api", Post)
app.use("/api", Doctor)
app.use("/api", Notification)
app.use("/api", Ai)
app.use("/api", Payment)
app.use("/api", contact)
app.use("/api", schedule)


// Server Start ataurwd
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
