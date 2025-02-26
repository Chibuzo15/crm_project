const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { validateLogin, validateRegister } = require("../middleware/validators");

// @route   POST /api/auth/register
// @desc    Register a new user (admin only)
// @access  Private/Admin
router.post("/register", validateRegister, authController.register);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post("/login", validateLogin, authController.login);

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get("/me", authController.getMe);

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post("/logout", authController.logout);

module.exports = router;
