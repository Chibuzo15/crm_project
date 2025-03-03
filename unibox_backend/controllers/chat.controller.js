// File: controllers/chat.controller.js
const Chat = require("../models/Chat");
const Message = require("../models/Message");
const mongoose = require("mongoose");

const socketInstance = require("../socket/socketInstance");
const { CHAT_UPDATED } = require("../utils/socketEvents");

exports.getChats = async (req, res) => {
  try {
    const {
      search,
      platform,
      platformAccount,
      jobType,
      status,
      followUp,
      jobPosting,
      pendingReplies,
      followUpStartDate,
      followUpEndDate,
      limit = 50,
      skip = 0,
    } = req.query;

    // Build filter
    const filter = {};

    if (search) {
      filter.$or = [
        { candidateName: { $regex: search, $options: "i" } },
        { candidateUsername: { $regex: search, $options: "i" } },
        { notes: { $regex: search, $options: "i" } },
      ];
    }

    //
    if (platform && platform.trim() !== "") {
      filter.platform = new mongoose.Types.ObjectId(platform);
    }

    if (platformAccount && platformAccount.trim() !== "") {
      filter.platformAccount = new mongoose.Types.ObjectId(platformAccount);
    }

    if (jobType && jobType.trim() !== "") {
      filter.jobType = new mongoose.Types.ObjectId(jobType);
    }

    if (status && status.trim() !== "") {
      filter.status = status;
    }

    if (followUp === "true") {
      filter.followUpDate = { $lte: new Date() };
    }

    // Pending replies filter (unread messages)
    if (pendingReplies === "true") {
      filter.unreadCount = { $gt: 0 };
    }

    if (jobPosting && jobPosting.trim() !== "") {
      filter.jobPosting = new mongoose.Types.ObjectId(jobPosting);
    }

    // Follow-up date range filter
    if (followUpStartDate && followUpEndDate) {
      filter.followUpDate = {
        $gte: new Date(followUpStartDate),
        $lte: new Date(followUpEndDate),
      };
    } else if (followUpStartDate) {
      filter.followUpDate = { $gte: new Date(followUpStartDate) };
    } else if (followUpEndDate) {
      filter.followUpDate = { $lte: new Date(followUpEndDate) };
    }

    // Get chats with populated references and latest message
    const chats = await Chat.find(filter)
      .populate("platform", "name")
      .populate("platformAccount", "username")
      .populate("jobType", "title")
      .populate("jobPosting", "title")
      .sort({ lastMessageDate: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    // Get last message for each chat
    const chatsWithLastMessage = await Promise.all(
      chats.map(async (chat) => {
        const lastMessage = await Message.findOne({ chat: chat._id })
          .sort({ createdAt: -1 })
          .limit(1)
          .select("content createdAt isFromUs");

        return {
          ...chat.toObject(),
          lastMessage: lastMessage ? lastMessage.content : null,
          lastMessageDate: lastMessage ? lastMessage.createdAt : chat.createdAt,
        };
      })
    );

    res.json(chatsWithLastMessage);
  } catch (error) {
    console.error("Error in getChats:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getChatById = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id)
      .populate("platform", "name")
      .populate("platformAccount", "username")
      .populate("jobType", "title")
      .populate("jobPosting", "title");

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.json(chat);
  } catch (error) {
    console.error("Error in getChatById:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.createChat = async (req, res) => {
  try {
    const {
      platform,
      platformAccount,
      jobPosting,
      jobType,
      candidateUsername,
      candidateName,
      externalId,
      status,
      followUpInterval,
      notes,
    } = req.body;

    // Check if chat already exists with same candidate and platform
    const existingChat = await Chat.findOne({
      platform,
      candidateUsername,
      platformAccount,
    });

    if (existingChat) {
      return res
        .status(400)
        .json({ message: "Chat already exists with this candidate" });
    }

    const chat = new Chat({
      platform,
      platformAccount,
      jobPosting,
      jobType,
      candidateUsername,
      candidateName,
      externalId,
      status: status || "active",
      followUpInterval: followUpInterval || 2,
      notes,
    });

    await chat.save();

    // Populate references for response
    const populatedChat = await Chat.findById(chat._id)
      .populate("platform", "name")
      .populate("platformAccount", "username")
      .populate("jobType", "title")
      .populate("jobPosting", "title");

    res.status(201).json(populatedChat);
  } catch (error) {
    console.error("Error in createChat:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateChat = async (req, res) => {
  try {
    const updateFields = {};

    console.log(" req ", req.body);

    // Dynamically add fields from request body
    Object.keys(req.body).forEach((key) => {
      if (req.body[key] !== undefined) {
        updateFields[key] =
          key === "followUpDate" ? new Date(req.body[key]) : req.body[key];
      }
    });

    const chat = await Chat.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
      runValidators: true,
    })
      .populate("platform", "name")
      .populate("platformAccount", "username")
      .populate("jobType", "title")
      .populate("jobPosting", "title");

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Get io instance and emit event
    const io = socketInstance.getIO();
    io.to(chat?._id).emit(CHAT_UPDATED, { chatId: chat?._id });

    res.json(chat);
  } catch (error) {
    console.error("Error in updateChat:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
exports.deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Delete all messages in the chat
    await Message.deleteMany({ chat: chat._id });

    // Delete the chat
    await chat.remove();

    res.json({ message: "Chat deleted successfully" });
  } catch (error) {
    console.error("Error in deleteChat:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getPendingChats = async (req, res) => {
  try {
    // Find chats with followUpDate in the past
    const pendingChats = await Chat.find({
      followUpDate: { $lte: new Date() },
      status: { $ne: "archived" },
    })
      .populate("platform", "name")
      .populate("platformAccount", "username")
      .populate("jobType", "title")
      .populate("jobPosting", "title")
      .sort({ followUpDate: 1 });

    res.json(pendingChats);
  } catch (error) {
    console.error("Error in getPendingChats:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateChatStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const chat = await Chat.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.json(chat);
  } catch (error) {
    console.error("Error in updateChatStatus:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateChatJobType = async (req, res) => {
  try {
    const { jobType } = req.body;

    if (!jobType) {
      return res.status(400).json({ message: "Job type is required" });
    }

    const chat = await Chat.findByIdAndUpdate(
      req.params.id,
      { jobType },
      { new: true }
    ).populate("jobType", "title");

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.json(chat);
  } catch (error) {
    console.error("Error in updateChatJobType:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateFollowUpInterval = async (req, res) => {
  try {
    const { followUpInterval } = req.body;

    if (followUpInterval === undefined) {
      return res
        .status(400)
        .json({ message: "Follow up interval is required" });
    }

    const chat = await Chat.findById(req.params.id);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    chat.followUpInterval = followUpInterval;

    // Recalculate followUpDate based on last message
    if (chat.lastMessageDate) {
      const followUpDate = new Date(chat.lastMessageDate);
      followUpDate.setDate(followUpDate.getDate() + followUpInterval);
      chat.followUpDate = followUpDate;
    }

    await chat.save();

    res.json(chat);
  } catch (error) {
    console.error("Error in updateFollowUpInterval:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateChatNotes = async (req, res) => {
  try {
    const { notes } = req.body;

    if (notes === undefined) {
      return res.status(400).json({ message: "Notes field is required" });
    }

    const chat = await Chat.findByIdAndUpdate(
      req.params.id,
      { notes },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.json(chat);
  } catch (error) {
    console.error("Error in updateChatNotes:", error);
    res.status(500).json({ message: "Server error" });
  }
};
