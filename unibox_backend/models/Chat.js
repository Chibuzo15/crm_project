// File: models/Chat.js
const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema(
  {
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
    jobPosting: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobPosting",
    },
    jobType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobType",
    },
    candidateUsername: {
      type: String,
      required: true,
    },
    candidateName: {
      type: String,
    },
    externalId: {
      type: String, // External chat ID from the platform
    },
    status: {
      type: String,
      default: "active",
    },
    followUpInterval: {
      type: Number,
      default: 2, // Days
    },
    lastMessageDate: {
      type: Date,
    },
    followUpDate: {
      type: Date,
    },
    notes: {
      type: String,
    },
    unreadCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Calculate follow-up date when last message date or follow-up interval changes
ChatSchema.pre("save", function (next) {
  // Check if either lastMessageDate or followUpInterval is modified
  if (
    (this.isModified("lastMessageDate") ||
      this.isModified("followUpInterval")) &&
    this.lastMessageDate
  ) {
    const followUpDate = new Date(this.lastMessageDate);
    followUpDate.setDate(followUpDate.getDate() + (this.followUpInterval || 2));
    this.followUpDate = followUpDate;
  }
  next();
});

const Chat = mongoose.model("Chat", ChatSchema);
module.exports = Chat;
