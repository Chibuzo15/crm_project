// File: controllers/chat.controller.js
const Chat = require("../models/Chat");
const Message = require("../models/Message");
const mongoose = require("mongoose");

exports.getChats = async (req, res) => {
  try {
    const {
      search,
      platform,
      jobType,
      status,
      followUp,
      jobPosting,
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

    if (platform) {
      filter.platform = mongoose.Types.ObjectId(platform);
    }

    if (jobType) {
      filter.jobType = mongoose.Types.ObjectId(jobType);
    }

    if (status) {
      filter.status = status;
    }

    if (followUp === "true") {
      filter.followUpDate = { $lte: new Date() };
    }

    if (jobPosting) {
      filter.jobPosting = mongoose.Types.ObjectId(jobPosting);
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
    const {
      jobPosting,
      jobType,
      candidateName,
      status,
      followUpInterval,
      notes,
      followUpDate,
    } = req.body;

    // Fields that can be updated
    const updateFields = {};

    if (jobPosting !== undefined) updateFields.jobPosting = jobPosting;
    if (jobType !== undefined) updateFields.jobType = jobType;
    if (candidateName !== undefined) updateFields.candidateName = candidateName;
    if (status !== undefined) updateFields.status = status;
    if (followUpInterval !== undefined)
      updateFields.followUpInterval = followUpInterval;
    if (notes !== undefined) updateFields.notes = notes;
    if (followUpDate !== undefined)
      updateFields.followUpDate = new Date(followUpDate);

    const chat = await Chat.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
    })
      .populate("platform", "name")
      .populate("platformAccount", "username")
      .populate("jobType", "title")
      .populate("jobPosting", "title");

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.json(chat);
  } catch (error) {
    console.error("Error in updateChat:", error);
    res.status(500).json({ message: "Server error" });
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
