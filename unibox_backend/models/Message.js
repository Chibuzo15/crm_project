// File: models/Message.js
const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
      required: true,
    },
    isFromUs: {
      type: Boolean,
      default: false,
    },
    attachments: [
      {
        filename: String,
        originalName: String,
        mimetype: String,
        path: String,
        size: Number,
      },
    ],
    externalId: {
      type: String, // Message ID from external platform
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Update chat's lastMessageDate when a new message is created
MessageSchema.post("save", async function (doc) {
  try {
    const Chat = mongoose.model("Chat");
    const chat = await Chat.findById(doc.chat);

    if (chat) {
      chat.lastMessageDate = doc.createdAt;

      // Update unread count if message is from candidate
      if (!doc.isFromUs) {
        chat.unreadCount += 1;
      }

      await chat.save();
    }
  } catch (error) {
    console.error("Error updating chat after message save:", error);
  }
});

const Message = mongoose.model("Message", MessageSchema);
module.exports = Message;
