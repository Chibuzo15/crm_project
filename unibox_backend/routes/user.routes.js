// File: routes/user.routes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { checkAdmin } = require("../middleware/auth.middleware");
const {
  validateUserCreate,
  validateUserUpdate,
} = require("../middleware/validators");
const { authenticateJWT } = require("../middleware/auth.middleware");

// @route   GET /api/users
// @desc    Get all users
// @access  Private/Admin
router.get("/", authenticateJWT, checkAdmin, userController.getAllUsers);

// @route   GET /api/users/:id
// @desc    Get a user by ID
// @access  Private/Admin or Self
router.get("/:id", authenticateJWT, userController.getUserById);

// @route   POST /api/users
// @desc    Create a new user
// @access  Private/Admin
router.post("/", checkAdmin, validateUserCreate, userController.createUser);

// @route   PUT /api/users/:id
// @desc    Update a user
// @access  Private/Admin or Self
router.put(
  "/:id",
  authenticateJWT,
  validateUserUpdate,
  userController.updateUser
);

// @route   DELETE /api/users/:id
// @desc    Delete a user
// @access  Private/Admin
router.delete("/:id", authenticateJWT, checkAdmin, userController.deleteUser);

// @route   GET /api/users/:id/activity
// @desc    Get user activity
// @access  Private/Admin or Self
router.get("/:id/activity", authenticateJWT, userController.getUserActivity);

module.exports = router;
