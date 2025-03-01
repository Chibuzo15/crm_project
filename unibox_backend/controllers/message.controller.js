// File: controllers/message.controller.js
const Message = require("../models/Message");
const Chat = require("../models/Chat");
const UserActivity = require("../models/UserActivity");
const fs = require("fs");
const path = require("path");

const socketInstance = require("../socket/socketInstance");
const {
  NEW_MESSAGE,
  MESSAGES_READ,
  CHAT_UPDATED,
} = require("../utils/socketEvents");

exports.getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { limit = 50, before } = req.query;

    // Build query
    const query = { chat: chatId };

    if (before) {
      query.createdAt = { $lt: new Date(before) };
    }

    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate("sender", "name");

    // Update unread count for the chat if there are unread messages
    await Chat.findByIdAndUpdate(chatId, { unreadCount: 0 });

    res.json(messages.reverse());
  } catch (error) {
    console.error("Error in getMessages:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    // Check if chat exists
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Process attachments if any
    const attachments = [];

    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        attachments.push({
          filename: file.filename,
          originalName: file.originalname,
          mimetype: file.mimetype,
          path: file.path.replace("uploads/", ""), // Store relative path
          size: file.size,
        });
      });
    }

    // Create message
    const message = new Message({
      chat: chatId,
      sender: userId,
      content,
      isFromUs: true,
      attachments,
      isRead: true,
    });

    await message.save();

    // Update chat's lastMessageDate (handled by post-save hook in Message model)

    // Track user activity
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get user's max response time
    const { maxResponseTime } = req.user;

    // Check if response is on time (based on followUpDate)
    const isOnTime = !chat.followUpDate || new Date() <= chat.followUpDate;

    // Find or create user activity record for today
    let activity = await UserActivity.findOne({
      user: userId,
      date: today,
    });

    if (!activity) {
      activity = new UserActivity({
        user: userId,
        date: today,
        messagesOnTime: 0,
        messagesOffTime: 0,
        totalMessages: 0,
        chatsInteracted: [],
      });
    }

    // Update activity counters
    if (isOnTime) {
      activity.messagesOnTime += 1;
    } else {
      activity.messagesOffTime += 1;
    }

    activity.totalMessages += 1;

    // Add chat to interacted chats if not already present
    if (!activity.chatsInteracted.includes(chatId)) {
      activity.chatsInteracted.push(chatId);
    }

    await activity.save();

    // Populate sender for response
    const populatedMessage = await Message.findById(message._id).populate(
      "sender",
      "name"
    );

    // Emit message to all users in the chat room
    const io = socketInstance.getIO();
    io.to(chatId).emit(NEW_MESSAGE, populatedMessage);

    // Also emit chat updated event
    io.emit(CHAT_UPDATED, { chatId });

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { isRead } = req.body;

    // Only allow updating isRead status
    const message = await Message.findByIdAndUpdate(
      id,
      { isRead },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Emit messages read event
    const io = socketInstance.getIO();
    io.to(message.chat).emit(MESSAGES_READ, { chatId: message.chat });

    res.json(message);
  } catch (error) {
    console.error("Error in updateMessage:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await Message.findById(id);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Delete attachments if any
    if (message.attachments && message.attachments.length > 0) {
      message.attachments.forEach((attachment) => {
        const filePath = path.join(__dirname, "../uploads", attachment.path);

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    await message.remove();

    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error in deleteMessage:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.addAttachments = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await Message.findById(id);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Process new attachments
    if (req.files && req.files.length > 0) {
      const newAttachments = req.files.map((file) => ({
        filename: file.filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        path: file.path.replace("uploads/", ""),
        size: file.size,
      }));

      // Add new attachments to existing ones
      message.attachments = [...message.attachments, ...newAttachments];
      await message.save();
    }

    res.json(message);
  } catch (error) {
    console.error("Error in addAttachments:", error);
    res.status(500).json({ message: "Server error" });
  }
};
