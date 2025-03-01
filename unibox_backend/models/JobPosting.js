// File: models/JobPosting.js
const mongoose = require("mongoose");

const JobPostingSchema = new mongoose.Schema(
  {
    jobType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobType",
      required: true,
    },
    platform: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Platform",
      required: true,
    },
    platformAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlatformAccount",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    externalId: {
      type: String, // ID from the external platform
      required: false,
    },
    datePosted: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["draft", "published", "closed", "archived"],
      default: "draft",
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurringDays: {
      type: Number,
      default: 7,
    },
    nextRecurringDate: {
      type: Date,
    },
    candidates: [
      {
        externalId: String, // ID from the external platform
        username: String, // Username on the platform
        name: String, // Full name of the candidate
        profileUrl: String, // Direct link to their profile
        status: String, // Status of their application (e.g., "new", "reviewing", "rejected")
        proposal: String, // Their message/proposal content
        date: Date, // When they submitted the proposal
        isSynced: Boolean, // Whether a chat has been created for this proposal
      },
    ],
  },
  { timestamps: true }
);

const JobPosting = mongoose.model("JobPosting", JobPostingSchema);
module.exports = JobPosting;
