const UserActivity = require("../models/UserActivity");
const Chat = require("../models/Chat");
const Message = require("../models/Message");
const JobPosting = require("../models/JobPosting");

// Get user performance metrics
exports.getUserPerformance = async (req, res) => {
  try {
    const { startDate, endDate, userId } = req.query;

    // Build filter
    const filter = {};

    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else if (startDate) {
      filter.date = { $gte: new Date(startDate) };
    } else if (endDate) {
      filter.date = { $lte: new Date(endDate) };
    }

    if (userId && userId !== "all") {
      filter.user = userId;
    }

    const userActivity = await UserActivity.find(filter)
      .sort({ date: 1 })
      .populate("user", "name email")
      .lean();

    res.json(userActivity);
  } catch (error) {
    console.error("Error in getUserPerformance:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get job statistics
exports.getJobStats = async (req, res) => {
  try {
    const { startDate, endDate, jobType } = req.query;

    // Build filter
    const filter = {};

    if (startDate && endDate) {
      filter.datePosted = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else if (startDate) {
      filter.datePosted = { $gte: new Date(startDate) };
    } else if (endDate) {
      filter.datePosted = { $lte: new Date(endDate) };
    }

    if (jobType) {
      filter.jobType = jobType;
    }

    // Get job postings
    const jobPostings = await JobPosting.find(filter)
      .populate("jobType", "title")
      .populate("platform", "name")
      .sort({ datePosted: -1 })
      .lean();

    // Count chats per job posting
    const jobStats = await Promise.all(
      jobPostings.map(async (job) => {
        const chatsCount = await Chat.countDocuments({ jobPosting: job._id });
        const candidatesCount = job.candidates ? job.candidates.length : 0;

        return {
          ...job,
          chatsCount,
          candidatesCount,
        };
      })
    );

    res.json(jobStats);
  } catch (error) {
    console.error("Error in getJobStats:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get platform statistics
exports.getPlatformStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Build date filter
    const dateFilter = {};

    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else if (startDate) {
      dateFilter.createdAt = { $gte: new Date(startDate) };
    } else if (endDate) {
      dateFilter.createdAt = { $lte: new Date(endDate) };
    }

    // Get platform stats through aggregation
    const platformStats = await Chat.aggregate([
      {
        $match: dateFilter,
      },
      {
        $lookup: {
          from: "platforms",
          localField: "platform",
          foreignField: "_id",
          as: "platformData",
        },
      },
      {
        $unwind: "$platformData",
      },
      {
        $group: {
          _id: "$platform",
          platformName: { $first: "$platformData.name" },
          totalChats: { $sum: 1 },
          activeChats: {
            $sum: {
              $cond: [{ $eq: ["$status", "active"] }, 1, 0],
            },
          },
          archivedChats: {
            $sum: {
              $cond: [{ $eq: ["$status", "archived"] }, 1, 0],
            },
          },
          starredChats: {
            $sum: {
              $cond: [{ $eq: ["$status", "starred"] }, 1, 0],
            },
          },
        },
      },
      {
        $sort: { platformName: 1 },
      },
    ]);

    // Add message counts
    const platformStatsWithMessages = await Promise.all(
      platformStats.map(async (platform) => {
        const messageCount = await Message.countDocuments({
          chat: {
            $in: await Chat.find({ platform: platform._id }).distinct("_id"),
          },
          ...dateFilter,
        });

        return {
          ...platform,
          messageCount,
        };
      })
    );

    res.json(platformStatsWithMessages);
  } catch (error) {
    console.error("Error in getPlatformStats:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get daily activity metrics
exports.getDailyActivity = async (req, res) => {
  try {
    const { startDate, endDate, userId } = req.query;

    // Build filter
    const dateFilter = {};

    if (startDate && endDate) {
      dateFilter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else if (startDate) {
      dateFilter.date = { $gte: new Date(startDate) };
    } else if (endDate) {
      dateFilter.date = { $lte: new Date(endDate) };
    } else {
      // Default to last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      dateFilter.date = { $gte: thirtyDaysAgo };
    }

    // Add user filter if provided
    if (userId && userId !== "all") {
      dateFilter.user = userId;
    }

    // Get user activity
    const userActivity = await UserActivity.find(dateFilter)
      .sort({ date: 1 })
      .populate("user", "name")
      .lean();

    // Group by date for daily results
    const dailyResults = userActivity.reduce((acc, activity) => {
      const dateString = activity.date.toISOString().split("T")[0];

      if (!acc[dateString]) {
        acc[dateString] = {
          date: dateString,
          totalMessages: 0,
          messagesOnTime: 0,
          messagesOffTime: 0,
          uniqueChats: new Set(),
          newLeads: 0,
          userId: activity.user ? activity.user._id : null,
          userName: activity.user ? activity.user.name : null,
        };
      }

      acc[dateString].totalMessages += activity.totalMessages || 0;
      acc[dateString].messagesOnTime += activity.messagesOnTime || 0;
      acc[dateString].messagesOffTime += activity.messagesOffTime || 0;

      // Add unique chats
      if (activity.chatsInteracted) {
        activity.chatsInteracted.forEach((chatId) => {
          acc[dateString].uniqueChats.add(chatId.toString());
        });
      }

      return acc;
    }, {});

    // Convert to array and calculate additional metrics
    const results = Object.values(dailyResults).map((day) => ({
      date: day.date,
      totalMessages: day.totalMessages,
      messagesOnTime: day.messagesOnTime,
      messagesOffTime: day.messagesOffTime,
      uniqueChatsCount: day.uniqueChats.size,
      responseRate:
        day.totalMessages > 0
          ? Math.round((day.messagesOnTime / day.totalMessages) * 100)
          : 0,
      userId: day.userId,
      userName: day.userName,
    }));

    res.json(results);
  } catch (error) {
    console.error("Error in getDailyActivity:", error);
    res.status(500).json({ message: "Server error" });
  }
};
