// File: models/UserActivity.js
const mongoose = require("mongoose");

const UserActivitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  messagesOnTime: {
    type: Number,
    default: 0,
  },
  messagesOffTime: {
    type: Number,
    default: 0,
  },
  totalMessages: {
    type: Number,
    default: 0,
  },
  chatsInteracted: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
  ],
});

const UserActivity = mongoose.model("UserActivity", UserActivitySchema);
module.exports = UserActivity;
