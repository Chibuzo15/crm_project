// File: models/Platform.js
const mongoose = require("mongoose");

const PlatformSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["job-posting", "scouting", "both"],
      required: true,
    },
    supportsAttachments: {
      type: Boolean,
      default: true,
    },
    apiEndpoint: {
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

const Platform = mongoose.model("Platform", PlatformSchema);
module.exports = Platform;
