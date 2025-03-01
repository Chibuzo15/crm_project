// File: routes/jobPosting.routes.js
const express = require("express");
const router = express.Router();
const jobPostingController = require("../controllers/jobPosting.controller");
const { validateJobPosting } = require("../middleware/validators");
const { authenticateJWT } = require("../middleware/auth.middleware");

// @route   GET /api/job-postings
// @desc    Get all job postings
// @access  Private
router.get("/", authenticateJWT, jobPostingController.getAllJobPostings);

// @route   GET /api/job-postings/:id
// @desc    Get a job posting by ID
// @access  Private
router.get("/:id", authenticateJWT, jobPostingController.getJobPostingById);

// @route   POST /api/job-postings
// @desc    Create a new job posting
// @access  Private
router.post(
  "/",
  authenticateJWT,
  validateJobPosting,
  jobPostingController.createJobPosting
);

// @route   PUT /api/job-postings/:id
// @desc    Update a job posting
// @access  Private
router.put(
  "/:id",
  authenticateJWT,
  validateJobPosting,
  jobPostingController.updateJobPosting
);

// @route   DELETE /api/job-postings/:id
// @desc    Delete a job posting
// @access  Private
router.delete("/:id", authenticateJWT, jobPostingController.deleteJobPosting);

// @route   GET /api/job-postings/:id/chats
// @desc    Get chats related to a job posting
// @access  Private
router.get(
  "/:id/chats",
  authenticateJWT,
  jobPostingController.getJobPostingChats
);

// Upwork-specific routes
// @desc    Get all upwork proposals of HR platform account
router.get(
  "/upwork/proposals",
  authenticateJWT,
  jobPostingController.getUpworkJobProposals
);

// @desc    Start chat with an upwork proposal
router.post(
  "/upwork/sync",
  authenticateJWT,
  jobPostingController.syncUpworkJobProposal
);

// For testing: Add mock proposals to a job posting
router.post(
  "/upwork/mock-proposals",
  authenticateJWT,
  jobPostingController.addMockUpworkProposals
);

module.exports = router;
