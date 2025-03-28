require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const connectDB  = require("./src/config/db");
const authRoutes = require("./src/routes/auth.routes");
const User = require("./src/routes/data.routes");
const Post = require("./src/routes/post.routes");
const Doctor = require("./src/routes/doctors.routes")
const Notification = require("./src/routes/notification.routes");
const Ai = require("./src/routes/ai.routes");


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
    origin:[ "http://localhost:5173","https://healthcarebd2.netlify.app"],
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
   
    },
  });
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
app.use("/api", Doctor)
app.use("/api", Notification)
app.use("/api", Ai)




// Socket.io
const ADMIN_EMAIL = "rk370613@gmail.com"; // Hardcoded Admin Email
let users = {}; // Store users with socket IDs
let activeUsers = []; // Store active users with name & photo
let adminSocket = null;
let messages = {};

io.on("connection", (socket) => {
  socket.on("userJoined", (user) => {
    users[user.email] = { id: socket.id, name: user.name, photo: user.photo };

    if (!activeUsers.some((u) => u.email === user.email)) {
      activeUsers.push(user);
    }

    io.emit("updateActiveUsers", activeUsers);

    if (user.email === ADMIN_EMAIL) {
      adminSocket = socket.id;
    }
  });

  socket.on("sendMessageToAdmin", ({ sender, message }) => {
    if (!messages[sender]) {
      messages[sender] = [];
    }
    messages[sender].push({ sender, message });

    if (adminSocket) {
      io.to(adminSocket).emit("newMessage", { sender });
    } else {
      console.log("Admin is not online");
    }
  });

  socket.on("selectUser", (userEmail) => {
    if (messages[userEmail]) {
      io.to(adminSocket).emit("loadMessages", messages[userEmail]);
    } else {
      io.to(adminSocket).emit("loadMessages", []);
    }
  });

  socket.on("sendMessageToUser", ({ receiver, message }) => {
    if (!messages[receiver]) {
      messages[receiver] = [];
    }
    messages[receiver].push({ sender: ADMIN_EMAIL, message });

    if (users[receiver]) {
      io.to(users[receiver].id).emit("receiveMessage", { sender: ADMIN_EMAIL, message });
    }
  });

  socket.on("disconnect", () => {
    activeUsers = activeUsers.filter((u) => u.email !== users[socket.id]?.email);
    io.emit("updateActiveUsers", activeUsers);
  });
});




// Socket.io
const ADMIN_EMAIL = "rk370613@gmail.com"; // Hardcoded Admin Email
let users = {}; // Store users with socket IDs
let activeUsers = []; // Store active users with name & photo
let adminSocket = null;
let messages = {};

io.on("connection", (socket) => {
  socket.on("userJoined", (user) => {
    users[user.email] = { id: socket.id, name: user.name, photo: user.photo };

    if (!activeUsers.some((u) => u.email === user.email)) {
      activeUsers.push(user);
    }

    io.emit("updateActiveUsers", activeUsers);

    if (user.email === ADMIN_EMAIL) {
      adminSocket = socket.id;
    }
  });

  socket.on("sendMessageToAdmin", ({ sender, message }) => {
    if (!messages[sender]) {
      messages[sender] = [];
    }
    messages[sender].push({ sender, message });

    if (adminSocket) {
      io.to(adminSocket).emit("newMessage", { sender });
    } else {
      console.log("Admin is not online");
    }
  });

  socket.on("selectUser", (userEmail) => {
    if (messages[userEmail]) {
      io.to(adminSocket).emit("loadMessages", messages[userEmail]);
    } else {
      io.to(adminSocket).emit("loadMessages", []);
    }
  });

  socket.on("sendMessageToUser", ({ receiver, message }) => {
    if (!messages[receiver]) {
      messages[receiver] = [];
    }
    messages[receiver].push({ sender: ADMIN_EMAIL, message });

    if (users[receiver]) {
      io.to(users[receiver].id).emit("receiveMessage", { sender: ADMIN_EMAIL, message });
    }
  });

  socket.on("disconnect", () => {
    activeUsers = activeUsers.filter((u) => u.email !== users[socket.id]?.email);
    io.emit("updateActiveUsers", activeUsers);
  });
});

// Server Start ataurwd
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
