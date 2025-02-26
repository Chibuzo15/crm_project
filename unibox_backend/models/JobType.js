// File: models/JobType.js
const mongoose = require("mongoose");

const JobTypeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const JobType = mongoose.model("JobType", JobTypeSchema);
module.exports = JobType;
