const JobPosting = require("../models/JobPosting");
const Platform = require("../models/Platform");
const Chat = require("../models/Chat");
const PlatformAccount = require("../models/PlatformAccount");
const Message = require("../models/Message");

// Get all job postings
exports.getAllJobPostings = async (req, res) => {
  try {
    const { platform, status, jobType, search } = req.query;

    // Build filter
    const filter = {};

    if (platform) {
      filter.platform = platform;
    }

    if (status) {
      filter.status = status;
    }

    if (jobType) {
      filter.jobType = jobType;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const jobPostings = await JobPosting.find(filter)
      .populate("jobType", "title")
      .populate("platform", "name")
      .populate("platformAccount", "username")
      .sort({ datePosted: -1 });

    res.json(jobPostings);
  } catch (error) {
    console.error("Error in getAllJobPostings:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a job posting by ID
exports.getJobPostingById = async (req, res) => {
  try {
    const jobPosting = await JobPosting.findById(req.params.id)
      .populate("jobType", "title")
      .populate("platform", "name")
      .populate("platformAccount", "username");

    if (!jobPosting) {
      return res.status(404).json({ message: "Job posting not found" });
    }

    res.json(jobPosting);
  } catch (error) {
    console.error("Error in getJobPostingById:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new job posting
exports.createJobPosting = async (req, res) => {
  try {
    const {
      jobTypeId,
      platformId,
      platformAccountId,
      title,
      description,
      externalId,
      datePosted,
      status,
      isRecurring,
      recurringDays,
      nextRecurringDate,
      candidates,
    } = req.body;

    const jobPosting = new JobPosting({
      jobType: jobTypeId,
      platform: platformId,
      platformAccount: platformAccountId,
      title,
      description,
      externalId,
      datePosted: datePosted || Date.now(),
      status: status || "draft",
      isRecurring: isRecurring || false,
      recurringDays: recurringDays || 7,
      nextRecurringDate,
      candidates: candidates || [],
    });

    await jobPosting.save();

    // Populate references for response
    const populatedJobPosting = await JobPosting.findById(jobPosting._id)
      .populate("jobType", "title")
      .populate("platform", "name")
      .populate("platformAccount", "username");

    res.status(201).json(populatedJobPosting);
  } catch (error) {
    console.error("Error in createJobPosting:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a job posting
exports.updateJobPosting = async (req, res) => {
  try {
    const {
      jobType,
      platform,
      platformAccount,
      title,
      description,
      externalId,
      datePosted,
      status,
      isRecurring,
      recurringDays,
      nextRecurringDate,
      candidates,
    } = req.body;

    // Build update object with only the fields that are provided
    const updateFields = {};

    if (jobType) updateFields.jobType = jobType;
    if (platform) updateFields.platform = platform;
    if (platformAccount) updateFields.platformAccount = platformAccount;
    if (title) updateFields.title = title;
    if (description !== undefined) updateFields.description = description;
    if (externalId !== undefined) updateFields.externalId = externalId;
    if (datePosted) updateFields.datePosted = datePosted;
    if (status) updateFields.status = status;
    if (isRecurring !== undefined) updateFields.isRecurring = isRecurring;
    if (recurringDays) updateFields.recurringDays = recurringDays;
    if (nextRecurringDate) updateFields.nextRecurringDate = nextRecurringDate;
    if (candidates) updateFields.candidates = candidates;

    const jobPosting = await JobPosting.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    )
      .populate("jobType", "title")
      .populate("platform", "name")
      .populate("platformAccount", "username");

    if (!jobPosting) {
      return res.status(404).json({ message: "Job posting not found" });
    }

    res.json(jobPosting);
  } catch (error) {
    console.error("Error in updateJobPosting:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a job posting
exports.deleteJobPosting = async (req, res) => {
  try {
    // Check if job posting is used in any chats
    const usedInChats = await Chat.findOne({ jobPosting: req.params.id });

    if (usedInChats) {
      // If used in chats, just mark as archived instead of deleting
      const jobPosting = await JobPosting.findByIdAndUpdate(
        req.params.id,
        { status: "archived" },
        { new: true }
      );

      if (!jobPosting) {
        return res.status(404).json({ message: "Job posting not found" });
      }

      return res.json({
        message:
          "Job posting is linked to chats and cannot be deleted. It has been archived instead.",
        jobPosting,
      });
    }

    // If not used in chats, delete completely
    const jobPosting = await JobPosting.findByIdAndDelete(req.params.id);

    if (!jobPosting) {
      return res.status(404).json({ message: "Job posting not found" });
    }

    res.json({ message: "Job posting deleted successfully" });
  } catch (error) {
    console.error("Error in deleteJobPosting:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get chats related to a job posting
exports.getJobPostingChats = async (req, res) => {
  try {
    const chats = await Chat.find({ jobPosting: req.params.id })
      .populate("platform", "name")
      .populate("platformAccount", "username")
      .populate("jobType", "title")
      .sort({ lastMessageDate: -1 });

    res.json(chats);
  } catch (error) {
    console.error("Error in getJobPostingChats:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Add candidate to job posting
exports.addCandidate = async (req, res) => {
  try {
    const { externalId, name, profileUrl, status } = req.body;

    if (!externalId && !name) {
      return res
        .status(400)
        .json({ message: "Either externalId or name is required" });
    }

    const jobPosting = await JobPosting.findById(req.params.id);

    if (!jobPosting) {
      return res.status(404).json({ message: "Job posting not found" });
    }

    // Check if candidate already exists
    const candidateExists = jobPosting.candidates.some(
      (c) =>
        (externalId && c.externalId === externalId) ||
        (name && c.name === name && profileUrl && c.profileUrl === profileUrl)
    );

    if (candidateExists) {
      return res
        .status(400)
        .json({ message: "Candidate already exists in this job posting" });
    }

    // Add candidate
    jobPosting.candidates.push({
      externalId,
      name,
      profileUrl,
      status: status || "new",
    });

    await jobPosting.save();

    res.json(jobPosting);
  } catch (error) {
    console.error("Error in addCandidate:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update candidate status
exports.updateCandidateStatus = async (req, res) => {
  try {
    const { candidateId, status } = req.body;

    if (!candidateId || !status) {
      return res
        .status(400)
        .json({ message: "Candidate ID and status are required" });
    }

    const jobPosting = await JobPosting.findById(req.params.id);

    if (!jobPosting) {
      return res.status(404).json({ message: "Job posting not found" });
    }

    // Find and update candidate
    const candidateIndex = jobPosting.candidates.findIndex(
      (c) => c._id.toString() === candidateId
    );

    if (candidateIndex === -1) {
      return res
        .status(404)
        .json({ message: "Candidate not found in this job posting" });
    }

    jobPosting.candidates[candidateIndex].status = status;

    await jobPosting.save();

    res.json(jobPosting);
  } catch (error) {
    console.error("Error in updateCandidateStatus:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Upwork job proposals for a specific account
exports.getUpworkJobProposals = async (req, res) => {
  try {
    const { accountId } = req.query;

    if (!accountId) {
      return res.status(400).json({
        success: false,
        message: "Account ID is required",
      });
    }

    // Find all job postings for this account on Upwork platform
    const platform = await Platform.findOne({ name: "Upwork" });

    if (!platform) {
      return res.status(404).json({
        success: false,
        message: "Upwork platform not found",
      });
    }

    const jobPostings = await JobPosting.find({
      platform: platform._id,
      platformAccount: accountId,
    }).populate("jobType", "title");

    /**
     * implementation to get chat id of each proposal; if available
     */
    // First, gather all candidateUsernames we need to look up
    const candidateUsernames = [];
    const platformIds = new Set();

    jobPostings.forEach((posting) => {
      if (posting.candidates && posting.candidates.length > 0) {
        platformIds.add(posting.platform.toString());
        posting.candidates.forEach((candidate) => {
          candidateUsernames.push(candidate.username);
        });
      }
    });

    // Find all chats for these candidates
    const chats = await Chat.find({
      platform: { $in: Array.from(platformIds) },
      candidateUsername: { $in: candidateUsernames },
    });

    // Create a lookup map for quick access
    const chatLookup = {};
    chats.forEach((chat) => {
      // Use candidateUsername as the key
      chatLookup[chat.candidateUsername] = chat._id;
    });

    // Extract all candidates from job postings
    let proposals = [];

    jobPostings.forEach((posting) => {
      if (posting.candidates && posting.candidates.length > 0) {
        proposals = proposals.concat(
          posting.candidates.map((candidate) => ({
            id: candidate.externalId,
            jobPostingId: posting._id,
            jobTitle: posting.title,
            jobType: posting.jobType ? posting.jobType.title : "Unknown",
            candidateName: candidate.name,
            candidateUsername: candidate.username,
            profileUrl: candidate.profileUrl,
            status: candidate.status,
            proposal: candidate.proposal,
            date: candidate.date,
            isSynced: candidate.isSynced,
            syncedAt: candidate.syncedAt,
            chatId: chatLookup[candidate.username] || null, // Add the chatId if it exists
          }))
        );
      }
    });

    proposals.sort((a, b) => {
      if (!a.date) return 1; // Move items without dates to the end
      if (!b.date) return -1; // Move items without dates to the end
      return new Date(b.date) - new Date(a.date);
    });

    return res.status(200).json(proposals);
  } catch (error) {
    console.error("Error fetching Upwork proposals:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Sync an Upwork job proposal (create a chat from a proposal)
exports.syncUpworkJobProposal = async (req, res) => {
  try {
    const { accountId, proposalId } = req.body;

    if (!accountId || !proposalId) {
      return res.status(400).json({
        success: false,
        message: "Account ID and Proposal ID are required",
      });
    }

    // Find the platform
    const platform = await Platform.findOne({ name: "Upwork" });
    if (!platform) {
      return res.status(404).json({
        success: false,
        message: "Upwork platform not found",
      });
    }

    // Find the account
    const account = await PlatformAccount.findById(accountId);
    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Platform account not found",
      });
    }

    // Find the job posting that contains this proposal
    const jobPosting = await JobPosting.findOne({
      platform: platform._id,
      platformAccount: accountId,
      "candidates.externalId": proposalId,
    }).populate("jobType");

    if (!jobPosting) {
      return res.status(400).json({
        success: false,
        message: "Job posting with this proposal not found",
      });
    }

    // Find the candidate in the job posting
    const candidate = jobPosting.candidates.find(
      (c) => c.externalId === proposalId
    );

    if (!candidate) {
      return res.status(400).json({
        success: false,
        message: "Candidate not found in job posting",
      });
    }

    // Check if chat already exists
    const existingChat = await Chat.findOne({
      platformId: platform._id,
      platformAccountId: accountId,
      jobPostingId: jobPosting._id,
      candidateUsername: candidate.username,
    });

    if (existingChat) {
      return res.status(400).json({
        success: false,
        message: "Chat already exists for this candidate",
      });
    }

    // Create a new chat
    const chat = new Chat({
      platform: platform._id,
      platformAccount: accountId,
      jobPosting: jobPosting._id,
      jobType: jobPosting.jobType._id,
      createdAt: new Date(),
      lastMessageDate: candidate.date || new Date(),
      followUpDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      followUpInterval: 2, // Default 2 days
      status: "new",
      candidateUsername: candidate.username,
      candidateName: candidate.name,
      notes: `Applied for: ${jobPosting.title}\nProfile: ${candidate.profileUrl}`,
    });

    await chat.save();

    // Create the first message from the candidate
    const message = new Message({
      chat: chat._id,
      content: candidate.proposal || "I'm interested in your job posting.",
      isFromUs: false,
      hasAttachment: false,
      timestamp: candidate.date || new Date(),
      isRead: false,
    });

    await message.save();

    // Mark the candidate as synced
    candidate.isSynced = true;
    candidate.syncedAt = new Date();

    await jobPosting.save();

    return res.status(200).json({
      success: true,
      message: "Proposal synchronized successfully",
      chat: chat,
    });
  } catch (error) {
    console.error("Error syncing proposal:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// For testing: Add mock proposals to a job posting
exports.addMockUpworkProposals = async (req, res) => {
  try {
    const { jobPostingId, count = 3 } = req.body;

    const jobPosting = await JobPosting.findById(jobPostingId).populate(
      "platform",
      "name"
    );

    if (!jobPosting) {
      return res.status(404).json({
        success: false,
        message: "Job posting not found",
      });
    }

    // Generate mock candidates
    const mockCandidates = [];
    const names = [
      "John Smith",
      "Sarah Lee",
      "Michael Wong",
      "Emma Davis",
      "Robert Chen",
      "Jet Li",
      "Jackie Chan",
      "Warrior Wukong",
      "Mighty Thor",
    ];
    const proposals = [
      "Hello, I'm very interested in this position and have 5+ years of relevant experience.",
      "I'd love to discuss this opportunity. I have worked on similar projects before.",
      "I believe I'm a perfect fit for this role given my background and skills.",
      "Your job posting caught my attention. I have the expertise you're looking for.",
      "I'm excited about this role and would appreciate the opportunity to discuss it further.",
    ];

    // Platform name for URL formatting
    const platformName = jobPosting.platform.name.toLowerCase();

    // Create mock candidates
    for (let i = 0; i < count; i++) {
      const randomName = names[Math.floor(Math.random() * names.length)];
      const username =
        randomName.toLowerCase().replace(" ", "") +
        Math.floor(Math.random() * 1000);

      // Platform-specific profile URL
      let profileUrl = "";

      switch (platformName) {
        case "upwork":
          profileUrl = `https://www.upwork.com/freelancers/${username}`;
          break;
        case "fiverr":
          profileUrl = `https://www.fiverr.com/${username}`;
          break;
        case "behance":
          profileUrl = `https://www.behance.net/${username}`;
          break;
        case "pinterest":
          profileUrl = `https://www.pinterest.com/${username}`;
          break;
        default:
          profileUrl = `https://example.com/${username}`;
      }

      mockCandidates.push({
        externalId: "mock_" + Math.random().toString(36).substring(2, 10),
        username: username,
        name: randomName,
        profileUrl: profileUrl,
        status: "new",
        proposal: proposals[Math.floor(Math.random() * proposals.length)],
        date: new Date(
          Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)
        ), // Random date within last week
        isSynced: false,
      });
    }

    // Add candidates to job posting
    if (!jobPosting.candidates) {
      jobPosting.candidates = [];
    }

    jobPosting.candidates = [...jobPosting.candidates, ...mockCandidates];
    await jobPosting.save();

    return res.status(200).json({
      success: true,
      message: `Added ${count} mock proposals to job posting`,
      data: mockCandidates,
    });
  } catch (error) {
    console.error("Error adding mock proposals:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
