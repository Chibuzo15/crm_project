const Platform = require("../models/Platform");
const PlatformAccount = require("../models/PlatformAccount");
const Chat = require("../models/Chat");
const JobPosting = require("../models/JobPosting");

// Get all platforms
exports.getAllPlatforms = async (req, res) => {
  try {
    const platforms = await Platform.find({ active: true }).sort({ name: 1 });
    res.json(platforms);
  } catch (error) {
    console.error("Error in getAllPlatforms:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a platform by ID
exports.getPlatformById = async (req, res) => {
  try {
    const platform = await Platform.findById(req.params.id);

    if (!platform) {
      return res.status(404).json({ message: "Platform not found" });
    }

    res.json(platform);
  } catch (error) {
    console.error("Error in getPlatformById:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new platform
exports.createPlatform = async (req, res) => {
  try {
    const { name, type, supportsAttachments, apiEndpoint } = req.body;

    // Check if platform with same name already exists
    const existingPlatform = await Platform.findOne({ name });

    if (existingPlatform) {
      return res
        .status(400)
        .json({ message: "Platform with this name already exists" });
    }

    const platform = new Platform({
      name,
      type: type || "both",
      supportsAttachments:
        supportsAttachments !== undefined ? supportsAttachments : true,
      apiEndpoint,
      active: true,
    });

    await platform.save();

    res.status(201).json(platform);
  } catch (error) {
    console.error("Error in createPlatform:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a platform
exports.updatePlatform = async (req, res) => {
  try {
    const { name, type, supportsAttachments, apiEndpoint, active } = req.body;

    // Check if platform exists
    const platform = await Platform.findById(req.params.id);

    if (!platform) {
      return res.status(404).json({ message: "Platform not found" });
    }

    // Check if name is being changed and if new name already exists
    if (name && name !== platform.name) {
      const existingPlatform = await Platform.findOne({ name });

      if (existingPlatform) {
        return res
          .status(400)
          .json({ message: "Platform with this name already exists" });
      }
    }

    // Update fields
    if (name) platform.name = name;
    if (type) platform.type = type;
    if (supportsAttachments !== undefined)
      platform.supportsAttachments = supportsAttachments;
    if (apiEndpoint !== undefined) platform.apiEndpoint = apiEndpoint;
    if (active !== undefined) platform.active = active;

    await platform.save();

    res.json(platform);
  } catch (error) {
    console.error("Error in updatePlatform:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a platform
exports.deletePlatform = async (req, res) => {
  try {
    // Check if platform is used in accounts, chats, or job postings
    const usedInAccounts = await PlatformAccount.findOne({
      platform: req.params.id,
    });
    const usedInChats = await Chat.findOne({ platform: req.params.id });
    const usedInJobPostings = await JobPosting.findOne({
      platform: req.params.id,
    });

    if (usedInAccounts || usedInChats || usedInJobPostings) {
      // If used, mark as inactive instead of deleting
      const platform = await Platform.findByIdAndUpdate(
        req.params.id,
        { active: false },
        { new: true }
      );

      if (!platform) {
        return res.status(404).json({ message: "Platform not found" });
      }

      return res.json({
        message:
          "Platform is in use and cannot be deleted. It has been marked as inactive instead.",
        platform,
      });
    }

    // If not used, delete completely
    const platform = await Platform.findByIdAndDelete(req.params.id);

    if (!platform) {
      return res.status(404).json({ message: "Platform not found" });
    }

    res.json({ message: "Platform deleted successfully" });
  } catch (error) {
    console.error("Error in deletePlatform:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get accounts for a platform
exports.getPlatformAccounts = async (req, res) => {
  try {
    const accounts = await PlatformAccount.find({
      platform: req.params.id,
      active: true,
    });

    res.json(accounts);
  } catch (error) {
    console.error("Error in getPlatformAccounts:", error);
    res.status(500).json({ message: "Server error" });
  }
};
