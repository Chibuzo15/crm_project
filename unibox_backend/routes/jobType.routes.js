// File: routes/jobType.routes.js
const express = require("express");
const router = express.Router();
const jobTypeController = require("../controllers/jobType.controller");
const { validateJobType } = require("../middleware/validators");
const { authenticateJWT } = require("../middleware/auth.middleware");

// @route   GET /api/job-types
// @desc    Get all job types
// @access  Private
router.get("/", authenticateJWT, jobTypeController.getAllJobTypes);

// @route   GET /api/job-types/:id
// @desc    Get a job type by ID
// @access  Private
router.get("/:id", authenticateJWT, jobTypeController.getJobTypeById);

// @route   POST /api/job-types
// @desc    Create a new job type
// @access  Private
router.post(
  "/",
  authenticateJWT,
  validateJobType,
  jobTypeController.createJobType
);

// @route   PUT /api/job-types/:id
// @desc    Update a job type
// @access  Private
router.put(
  "/:id",
  authenticateJWT,
  validateJobType,
  jobTypeController.updateJobType
);

// @route   DELETE /api/job-types/:id
// @desc    Delete a job type
// @access  Private
router.delete("/:id", authenticateJWT, jobTypeController.deleteJobType);

module.exports = router;
