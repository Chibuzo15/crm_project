// File: models/PlatformAccount.js
const mongoose = require("mongoose");

const PlatformAccountSchema = new mongoose.Schema(
  {
    platform: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Platform",
      required: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    accessToken: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    tokenExpiry: {
      type: Date,
    },
    lastSync: {
      type: Date,
      default: Date.now,
    },
    active: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Encrypt sensitive data before saving
PlatformAccountSchema.pre("save", function (next) {
  // Implement encryption for sensitive fields here
  next();
});

PlatformAccountSchema.pre("find", function () {
  this.where({ isDeleted: { $ne: true } });
});

PlatformAccountSchema.pre("findOne", function () {
  this.where({ isDeleted: { $ne: true } });
});

const PlatformAccount = mongoose.model(
  "PlatformAccount",
  PlatformAccountSchema
);
module.exports = PlatformAccount;
