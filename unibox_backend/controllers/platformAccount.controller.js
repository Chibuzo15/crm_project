const PlatformAccount = require("../models/PlatformAccount");
const Platform = require("../models/Platform");
const Chat = require("../models/Chat");
const JobPosting = require("../models/JobPosting");
const bcrypt = require("bcryptjs");

// Get all platform accounts
exports.getAllAccounts = async (req, res) => {
  try {
    const { platform } = req.query;

    // Build filter
    const filter = {};

    if (platform) {
      filter.platform = platform;
    }

    const accounts = await PlatformAccount.find(filter)
      .populate("platform", "name type")
      .sort({ username: 1 });

    // Get chat count for each account
    const accountsWithChatCount = await Promise.all(
      accounts.map(async (account) => {
        const chatCount = await Chat.countDocuments({
          platformAccount: account._id,
        });

        // Don't return the password or sensitive tokens
        const accountData = account.toObject();
        delete accountData.password;
        delete accountData.accessToken;
        delete accountData.refreshToken;

        return {
          ...accountData,
          chatCount,
        };
      })
    );

    res.json(accountsWithChatCount);
  } catch (error) {
    console.error("Error in getAllAccounts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get an account by ID
exports.getAccountById = async (req, res) => {
  try {
    const account = await PlatformAccount.findById(req.params.id).populate(
      "platform",
      "name type"
    );

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    // Don't return the password or sensitive tokens
    const accountData = account.toObject();
    delete accountData.password;
    delete accountData.accessToken;
    delete accountData.refreshToken;

    res.json(accountData);
  } catch (error) {
    console.error("Error in getAccountById:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new platform account
exports.createAccount = async (req, res) => {
  try {
    const { platformId, username, password } = req.body;

    // Check if platform exists
    const platformExists = await Platform.findById(platformId);

    if (!platformExists) {
      return res.status(400).json({ message: "Platform not found" });
    }

    // Check if account with same username already exists for this platform
    const existingAccount = await PlatformAccount.findOne({
      platform: platformId,
      username,
    });

    console.log("existingAccount ", existingAccount);

    if (existingAccount) {
      return res.status(400).json({
        message: "Account with this username already exists for this platform",
      });
    }

    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);

    const account = new PlatformAccount({
      platform: platformId,
      username,
      password: encryptedPassword,
      active: true,
      lastSync: null,
    });

    await account.save();

    // Don't return the password in the response
    const accountData = account.toObject();
    delete accountData.password;

    res.status(201).json({
      ...accountData,
      platform: platformExists,
    });
  } catch (error) {
    console.error("Error in createAccount:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a platform account
exports.updateAccount = async (req, res) => {
  try {
    const {
      username,
      password,
      active,
      accessToken,
      refreshToken,
      tokenExpiry,
    } = req.body;

    // Check if account exists
    const account = await PlatformAccount.findById(req.params.id);

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    // Check if username is being changed and if new username already exists for this platform
    if (username && username !== account.username) {
      const existingAccount = await PlatformAccount.findOne({
        platform: account.platform,
        username,
      });

      if (existingAccount) {
        return res.status(400).json({
          message:
            "Account with this username already exists for this platform",
        });
      }
    }

    // Update fields
    if (username) account.username = username;

    if (password) {
      // Encrypt new password
      const salt = await bcrypt.genSalt(10);
      account.password = await bcrypt.hash(password, salt);
    }

    if (active !== undefined) account.active = active;
    if (accessToken !== undefined) account.accessToken = accessToken;
    if (refreshToken !== undefined) account.refreshToken = refreshToken;
    if (tokenExpiry !== undefined) account.tokenExpiry = tokenExpiry;

    await account.save();

    // Don't return the password or sensitive tokens in the response
    const accountData = account.toObject();
    delete accountData.password;
    delete accountData.accessToken;
    delete accountData.refreshToken;

    res.json(accountData);
  } catch (error) {
    console.error("Error in updateAccount:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a platform account
exports.deleteAccount = async (req, res) => {
  try {
    // Check if account is used in chats or job postings
    const usedInChats = await Chat.findOne({ platformAccount: req.params.id });
    const usedInJobPostings = await JobPosting.findOne({
      platformAccount: req.params.id,
    });

    if (usedInChats || usedInJobPostings) {
      // If used, mark as inactive instead of deleting
      const account = await PlatformAccount.findByIdAndUpdate(
        req.params.id,
        { active: false },
        { new: true }
      );

      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }

      return res.json({
        message:
          "Account is in use and cannot be deleted. It has been marked as inactive instead.",
      });
    }

    // If not used, delete completely
    const account = await PlatformAccount.findByIdAndDelete(req.params.id);

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error in deleteAccount:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update last sync time for an account
exports.updateLastSync = async (req, res) => {
  try {
    const account = await PlatformAccount.findByIdAndUpdate(
      req.params.id,
      { lastSync: new Date() },
      { new: true }
    );

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    // Don't return the password or sensitive tokens in the response
    const accountData = account.toObject();
    delete accountData.password;
    delete accountData.accessToken;
    delete accountData.refreshToken;

    res.json(accountData);
  } catch (error) {
    console.error("Error in updateLastSync:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Sync account with external platform (placeholder for platform-specific implementation)
exports.syncAccount = async (req, res) => {
  try {
    const account = await PlatformAccount.findById(req.params.id).populate(
      "platform",
      "name type apiEndpoint"
    );

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    // This would need to be implemented for each platform specifically
    // For now, just update the lastSync time
    account.lastSync = new Date();
    await account.save();

    res.json({
      message: `Account ${account.username} on ${account.platform.name} synced successfully`,
      lastSync: account.lastSync,
    });
  } catch (error) {
    console.error("Error in syncAccount:", error);
    res.status(500).json({ message: "Server error" });
  }
};
