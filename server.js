require("dotenv").config();
const express = require("express");
 const {runScheduleJob } =require('./src/utils/scheduleCron');
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
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const schedule = require('./src/routes/schedule.routes');
const { verifyToken } = require("./src/utils/jwt");
const Schedule= require("./src/models/Schedule.model");
const booked = require('./src/routes/bookedDoctor.route')


const app = express();
const server = http.createServer(app);
// Initialize Socket.io
initializeSocket(server);

connectDB ();
// Middleware
// ✅ CORS CONFIG - Allow cookies to be sent
app.use(
    cors({
      origin: ['http://localhost:5173', 'https://healthcarebd2.netlify.app'],
      credentials: true, // ✅ must be true to send cookies
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      optionSuccessStatus: 200,
    })
  );

  app.get("/api/auto-cron", async(req , res)=>{
   await runScheduleJob()
   res.send("success")
})
  
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  
  
  // ✅ Middleware to verify JWT token
  // const verifyToken = (req, res, next) => {
  //   const token = req.cookies.token;
  //   if (!token) {
  //     return res.status(401).send({ message: 'unauthorized access' });
  //   }
  
  //   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
  //     if (err) {
  //       return res.status(403).send({ message: 'forbidden access' }); // changed 401 to 403 for expired/invalid token
  //     }
  //     req.user = decoded;
  //     next();
  //   });
  // };
  
  
  // ✅ JWT Issuer Endpoint
  app.post('/jwt', async (req, res) => {
    const user = req.body;

    // You can add extra validation here if needed
  
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '1d',
    });
  
    res
      .cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // only true in production
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Strict',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      })
      .send({ success: true });
  });
  
  
  // ✅ Logout route - clears the cookie
  app.post('/logout', (req, res) => {
    res
      .clearCookie('token', {
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Strict',
      })
      .send({ success: true });
  });

// Routes
app.use("/api", booked)
app.use("/api/auth", authRoutes);
app.use("/api", User);
app.use("/api", Post)
app.use("/api", Doctor)
app.use("/api", Notification)
app.use("/api", Ai)
app.use("/api",verifyToken, Payment)
app.use("/api", contact)
app.use("/api",verifyToken, schedule)






// Server Start
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
