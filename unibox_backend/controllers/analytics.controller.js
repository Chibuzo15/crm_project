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
    const userFilter = userId && userId !== "all" ? { user: userId } : {};

    // Aggregate job postings
    const jobPostingsAggregation = await JobPosting.aggregate([
      {
        $match: {
          datePosted: {
            $gte: dateFilter.date.$gte,
            $lte: dateFilter.date.$lte || new Date(),
          },
          ...(userFilter.user ? { createdBy: userFilter.user } : {}),
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$datePosted",
            },
          },
          jobPostings: { $sum: 1 },
        },
      },
    ]);

    // Aggregate chats for leads and conversions
    const chatsAggregation = await Chat.aggregate([
      {
        $match: {
          createdAt: {
            $gte: dateFilter.date.$gte,
            $lte: dateFilter.date.$lte || new Date(),
          },
          ...(userFilter.user ? { createdBy: userFilter.user } : {}),
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          newLeads: { $sum: 1 },
          conversions: {
            $sum: {
              $cond: [{ $eq: ["$status", "converted"] }, 1, 0],
            },
          },
        },
      },
    ]);

    // Get user activity
    const userActivity = await UserActivity.find({
      ...dateFilter,
      ...userFilter,
    })
      .sort({ date: 1 })
      .populate("user", "name")
      .lean();

    // Create a results map to combine all metrics
    const resultsMap = {};

    // Process user activity
    userActivity.forEach((activity) => {
      const dateString = activity.date.toISOString().split("T")[0];

      if (!resultsMap[dateString]) {
        resultsMap[dateString] = {
          date: dateString,
          totalMessages: 0,
          messagesOnTime: 0,
          messagesOffTime: 0,
          uniqueChats: new Set(),
          userId: activity.user ? activity.user._id : null,
          userName: activity.user ? activity.user.name : null,
          jobPostings: 0,
          newLeads: 0,
          conversions: 0,
        };
      }

      resultsMap[dateString].totalMessages += activity.totalMessages || 0;
      resultsMap[dateString].messagesOnTime += activity.messagesOnTime || 0;
      resultsMap[dateString].messagesOffTime += activity.messagesOffTime || 0;

      if (activity.chatsInteracted) {
        activity.chatsInteracted.forEach((chatId) => {
          resultsMap[dateString].uniqueChats.add(chatId.toString());
        });
      }
    });

    // Add job postings to results
    jobPostingsAggregation.forEach((item) => {
      if (!resultsMap[item._id]) {
        resultsMap[item._id] = {
          date: item._id,
          totalMessages: 0,
          messagesOnTime: 0,
          messagesOffTime: 0,
          uniqueChats: new Set(),
          jobPostings: 0,
          newLeads: 0,
          conversions: 0,
        };
      }
      resultsMap[item._id].jobPostings = item.jobPostings;
    });

    // Add chats (leads and conversions) to results
    chatsAggregation.forEach((item) => {
      if (!resultsMap[item._id]) {
        resultsMap[item._id] = {
          date: item._id,
          totalMessages: 0,
          messagesOnTime: 0,
          messagesOffTime: 0,
          uniqueChats: new Set(),
          jobPostings: 0,
          newLeads: 0,
          conversions: 0,
        };
      }
      resultsMap[item._id].newLeads = item.newLeads;
      resultsMap[item._id].conversions = item.conversions;
    });

    // Convert to array and calculate additional metrics
    const results = Object.values(resultsMap).map((day) => ({
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
      jobPostings: day.jobPostings,
      newLeads: day.newLeads,
      conversions: day.conversions,
    }));

    // Sort results by date
    results.sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json(results);
  } catch (error) {
    console.error("Error in getDailyActivity:", error);
    res.status(500).json({ message: "Server error" });
  }
};
