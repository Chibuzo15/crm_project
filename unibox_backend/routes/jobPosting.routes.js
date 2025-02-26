// File: routes/jobPosting.routes.js
const express = require("express");
const router = express.Router();
const jobPostingController = require("../controllers/jobPosting.controller");
const { validateJobPosting } = require("../middleware/validators");

// @route   GET /api/job-postings
// @desc    Get all job postings
// @access  Private
router.get("/", jobPostingController.getAllJobPostings);

// @route   GET /api/job-postings/:id
// @desc    Get a job posting by ID
// @access  Private
router.get("/:id", jobPostingController.getJobPostingById);

// @route   POST /api/job-postings
// @desc    Create a new job posting
// @access  Private
router.post("/", validateJobPosting, jobPostingController.createJobPosting);

// @route   PUT /api/job-postings/:id
// @desc    Update a job posting
// @access  Private
router.put("/:id", validateJobPosting, jobPostingController.updateJobPosting);

// @route   DELETE /api/job-postings/:id
// @desc    Delete a job posting
// @access  Private
router.delete("/:id", jobPostingController.deleteJobPosting);

// @route   GET /api/job-postings/:id/chats
// @desc    Get chats related to a job posting
// @access  Private
router.get("/:id/chats", jobPostingController.getJobPostingChats);

module.exports = router;
