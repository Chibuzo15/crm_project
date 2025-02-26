const JobType = require("../models/JobType");
const Chat = require("../models/Chat");
const JobPosting = require("../models/JobPosting");

// Get all job types
exports.getAllJobTypes = async (req, res) => {
  try {
    const jobTypes = await JobType.find({ active: true }).sort({ title: 1 });
    res.json(jobTypes);
  } catch (error) {
    console.error("Error in getAllJobTypes:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a job type by ID
exports.getJobTypeById = async (req, res) => {
  try {
    const jobType = await JobType.findById(req.params.id);

    if (!jobType) {
      return res.status(404).json({ message: "Job type not found" });
    }

    res.json(jobType);
  } catch (error) {
    console.error("Error in getJobTypeById:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new job type
exports.createJobType = async (req, res) => {
  try {
    const { title, description } = req.body;

    // Check if job type with same title already exists
    const existingJobType = await JobType.findOne({ title });

    if (existingJobType) {
      return res
        .status(400)
        .json({ message: "Job type with this title already exists" });
    }

    const jobType = new JobType({
      title,
      description,
      active: true,
    });

    await jobType.save();

    res.status(201).json(jobType);
  } catch (error) {
    console.error("Error in createJobType:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a job type
exports.updateJobType = async (req, res) => {
  try {
    const { title, description, active } = req.body;

    // Check if job type exists
    const jobType = await JobType.findById(req.params.id);

    if (!jobType) {
      return res.status(404).json({ message: "Job type not found" });
    }

    // Check if title is being changed and if new title already exists
    if (title && title !== jobType.title) {
      const existingJobType = await JobType.findOne({ title });

      if (existingJobType) {
        return res
          .status(400)
          .json({ message: "Job type with this title already exists" });
      }
    }

    // Update fields
    if (title) jobType.title = title;
    if (description !== undefined) jobType.description = description;
    if (active !== undefined) jobType.active = active;

    await jobType.save();

    res.json(jobType);
  } catch (error) {
    console.error("Error in updateJobType:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a job type
exports.deleteJobType = async (req, res) => {
  try {
    // Check if job type is used in any chats or job postings
    const usedInChats = await Chat.findOne({ jobType: req.params.id });
    const usedInJobPostings = await JobPosting.findOne({
      jobType: req.params.id,
    });

    if (usedInChats || usedInJobPostings) {
      // If used, mark as inactive instead of deleting
      const jobType = await JobType.findByIdAndUpdate(
        req.params.id,
        { active: false },
        { new: true }
      );

      if (!jobType) {
        return res.status(404).json({ message: "Job type not found" });
      }

      return res.json({
        message:
          "Job type is in use and cannot be deleted. It has been marked as inactive instead.",
        jobType,
      });
    }

    // If not used, delete completely
    const jobType = await JobType.findByIdAndDelete(req.params.id);

    if (!jobType) {
      return res.status(404).json({ message: "Job type not found" });
    }

    res.json({ message: "Job type deleted successfully" });
  } catch (error) {
    console.error("Error in deleteJobType:", error);
    res.status(500).json({ message: "Server error" });
  }
};
