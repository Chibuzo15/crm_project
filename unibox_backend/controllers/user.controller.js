const User = require("../models/User");
const UserActivity = require("../models/UserActivity");
const Message = require("../models/Message");
const bcrypt = require("bcryptjs");

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    // Only return non-sensitive user data
    const users = await User.find().select("-password").sort({ name: 1 });

    res.json(users);
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a user by ID
exports.getUserById = async (req, res) => {
  try {
    // Check if user is requesting their own data or is an admin
    if (req.user.role !== "admin" && req.params.id !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to access this user data" });
    }

    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error in getUserById:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, maxResponseTime } = req.body;

    // Check if user with email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      role: role || "user",
      maxResponseTime: maxResponseTime || 24,
      createdAt: Date.now(),
      lastActive: Date.now(),
    });

    await user.save();

    // Don't return the password in the response
    const userData = user.toObject();
    delete userData.password;

    res.status(201).json(userData);
  } catch (error) {
    console.error("Error in createUser:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a user
exports.updateUser = async (req, res) => {
  try {
    // Check if user is updating their own data or is an admin
    if (req.user.role !== "admin" && req.params.id !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this user" });
    }

    const { name, email, password, role, maxResponseTime } = req.body;

    // Get the user
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if email is being changed and if new email already exists
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res
          .status(400)
          .json({ message: "User with this email already exists" });
      }
    }

    // Non-admin users cannot change their role
    if (role && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to change role" });
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (role && req.user.role === "admin") user.role = role;
    if (maxResponseTime) user.maxResponseTime = maxResponseTime;

    // Only update password if provided
    if (password) {
      // Password will be hashed in the pre-save middleware in the model
      user.password = password;
    }

    await user.save();

    // Don't return the password in the response
    const userData = user.toObject();
    delete userData.password;

    res.json(userData);
  } catch (error) {
    console.error("Error in updateUser:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    // Only admin can delete users
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to delete users" });
    }

    // Prevent deleting self
    if (req.params.id === req.user.id) {
      return res
        .status(400)
        .json({ message: "Cannot delete your own account" });
    }

    // Check if the user is admin (prevent deleting admin accounts)
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // if (user.role === "admin") {
    //   return res.status(400).json({ message: "Cannot delete admin accounts" });
    // }

    // If not used, mark as deleted
    user.isDeleted = true;
    await user.save();

    // Delete user activity data
    // await UserActivity.deleteMany({ user: req.params.id });

    // Remove user ID from messages (but keep messages)
    // await Message.updateMany(
    //   { sender: req.params.id },
    //   { $unset: { sender: 1 } }
    // );

    // Delete the user
    // await User.findByIdAndDelete(req.params.id);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error in deleteUser:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user activity
exports.getUserActivity = async (req, res) => {
  try {
    // Check if user is requesting their own data or is an admin
    if (req.user.role !== "admin" && req.params.id !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to access this user activity data" });
    }

    const { startDate, endDate } = req.query;

    // Build filter
    const filter = { user: req.params.id };

    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else if (startDate) {
      filter.date = { $gte: new Date(startDate) };
    } else if (endDate) {
      filter.date = { $lte: new Date(endDate) };
    }

    const userActivity = await UserActivity.find(filter).sort({ date: -1 });

    res.json(userActivity);
  } catch (error) {
    console.error("Error in getUserActivity:", error);
    res.status(500).json({ message: "Server error" });
  }
};
