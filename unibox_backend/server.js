// File: server.js
// Main entry point for the application

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const socketio = require("socket.io");
const http = require("http");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const morgan = require("morgan");
const path = require("path");
const socketInstance = require("./socket/socketInstance");

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const platformRoutes = require("./routes/platform.routes");
const accountRoutes = require("./routes/account.routes");
const jobTypeRoutes = require("./routes/jobType.routes");
const jobPostingRoutes = require("./routes/jobPosting.routes");
const chatRoutes = require("./routes/chat.routes");
const messageRoutes = require("./routes/message.routes");
const analyticsRoutes = require("./routes/analytics.routes");

// Import socket handler
const socketHandler = require("./socket/socketHandler");

// Import middleware
const { authenticateJWT } = require("./middleware/auth.middleware");

const CORS_OPTS = {
  origin: [
    process.env.CLIENT_URL,
    "http://localhost:5173",
    "http://localhost:5174",
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

// Initialize express app
const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: CORS_OPTS,
});

// Initialize socket instance for use across the application
socketInstance.init(io);

// Set up socket middleware
io.use((socket, next) => {
  // Check both auth and query for token
  const token = socket.handshake.auth?.token || socket.handshake.query?.token;

  if (!token) {
    console.log("No token found in socket connection");
    return next(new Error("Authentication error: No token provided"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("Token verification failed:", err.message);
      return next(new Error("Authentication error: Invalid token"));
    }

    console.log("Token verified successfully for user:", decoded.id);
    socket.decoded = decoded;
    next();
  });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Middleware
app.use(cors(CORS_OPTS));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Static folder for uploads
app.use(
  "/uploads",
  (req, res, next) => {
    // Add CORS headers specifically for uploads
    res.header("Access-Control-Allow-Origin", CORS_OPTS.origin);
    res.header("Access-Control-Allow-Methods", "GET");
    res.header("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static(path.join(__dirname, "uploads"))
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", authenticateJWT, userRoutes);
app.use("/api/platforms", authenticateJWT, platformRoutes);
app.use("/api/accounts", authenticateJWT, accountRoutes);
app.use("/api/job-types", authenticateJWT, jobTypeRoutes);
app.use("/api/job-postings", authenticateJWT, jobPostingRoutes);
app.use("/api/chats", authenticateJWT, chatRoutes);
app.use("/api/analytics", authenticateJWT, analyticsRoutes);

//no route prefix for message routes
app.use("/api", authenticateJWT, messageRoutes);

// Set up socket handler
socketHandler(io);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = { app, server };
