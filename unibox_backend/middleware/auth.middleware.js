// File: middleware/auth.middleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Authentication middleware to verify JWT token
exports.authenticateJWT = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ message: "No authentication token, access denied" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Token is not valid" });
    }

    // Set user in request
    req.user = user;

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ message: "Token is not valid" });
  }
};

// Admin check middleware
exports.checkAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admin only" });
  }

  next();
};

// Owner or admin check middleware
exports.checkOwnerOrAdmin = (req, res, next) => {
  if (req.user.role !== "admin" && req.params.id !== req.user.id) {
    return res
      .status(403)
      .json({ message: "Access denied: Owner or admin only" });
  }

  next();
};
