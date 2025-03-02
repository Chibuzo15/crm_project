// File: routes/analytics.routes.js
const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analytics.controller");
const { authenticateJWT } = require("../middleware/auth.middleware");

// @route   GET /api/analytics/user-performance
// @desc    Get user performance metrics
// @access  Private
router.get(
  "/user-performance",
  authenticateJWT,
  analyticsController.getUserPerformance
);

// @route   GET /api/analytics/job-stats
// @desc    Get statistics about job postings and responses
// @access  Private
router.get("/job-stats", authenticateJWT, analyticsController.getJobStats);

// @route   GET /api/analytics/platform-stats
// @desc    Get statistics by platform
// @access  Private
router.get(
  "/platform-stats",
  authenticateJWT,
  analyticsController.getPlatformStats
);

// @route   GET /api/analytics/daily-activity
// @desc    Get daily activity metrics
// @access  Private
router.get(
  "/daily-activity",
  authenticateJWT,
  analyticsController.getDailyActivity
);

module.exports = router;
