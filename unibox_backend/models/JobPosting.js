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
        externalId: String,
        name: String,
        profileUrl: String,
        status: String,
      },
    ],
  },
  { timestamps: true }
);

const JobPosting = mongoose.model("JobPosting", JobPostingSchema);
module.exports = JobPosting;
