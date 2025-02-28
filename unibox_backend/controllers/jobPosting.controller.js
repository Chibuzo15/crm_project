const JobPosting = require("../models/JobPosting");
const Chat = require("../models/Chat");

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
