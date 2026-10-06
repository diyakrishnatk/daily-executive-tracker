const Activity = require("../models/Activity");

// Add new activity
const addActivity = async (req, res) => {
  try {
    const {
      date,
      dealerName,
      location,
      activity,
      cases,
      salesAmount,
      collectionAmount,
      remarks,
      nextFollowUp
    } = req.body;

    const newActivity = await Activity.create({
      executive: req.user.id,
      date,
      dealerName,
      location,
      activity,
      cases: cases || 0,
      salesAmount: salesAmount || 0,
      collectionAmount: collectionAmount || 0,
      remarks,
      nextFollowUp
    });

    res.status(201).json({
      message: "Activity added successfully",
      activity: newActivity
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add activity",
      error: error.message
    });
  }
};

// Get logged-in executive's activities
const getMyActivities = async (req, res) => {
  try {
    const activities = await Activity.find({
      executive: req.user.id
    }).sort({ date: -1 });

    res.json(activities);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch activities",
      error: error.message
    });
  }
};

// Get single activity by ID
const getActivityById = async (req, res) => {
  try {
    const filter = req.user.role === "admin"
      ? { _id: req.params.id }
      : { _id: req.params.id, executive: req.user.id };

    const activity = await Activity.findOne(filter);

    if (!activity) {
      return res.status(404).json({
        message: "Activity not found"
      });
    }

    res.json(activity);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch activity",
      error: error.message
    });
  }
};

// Update own activity
const updateActivity = async (req, res) => {
  try {
    const filter = req.user.role === "admin"
      ? { _id: req.params.id }
      : { _id: req.params.id, executive: req.user.id };

    const activity = await Activity.findOne(filter);

    if (!activity) {
      return res.status(404).json({
        message: "Activity not found"
      });
    }

    const {
      date,
      dealerName,
      location,
      activity: activityName,
      cases,
      salesAmount,
      collectionAmount,
      remarks,
      nextFollowUp
    } = req.body;

    activity.date = date;
    activity.dealerName = dealerName;
    activity.location = location;
    activity.activity = activityName;
    activity.cases = cases || 0;
    activity.salesAmount = salesAmount || 0;
    activity.collectionAmount = collectionAmount || 0;
    activity.remarks = remarks;
    activity.nextFollowUp = nextFollowUp;

    await activity.save();

    res.json({
      message: "Activity updated successfully",
      activity
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update activity",
      error: error.message
    });
  }
};

// Delete own activity
const deleteActivity = async (req, res) => {
  try {
    const filter = req.user.role === "admin"
      ? { _id: req.params.id }
      : { _id: req.params.id, executive: req.user.id };

    const activity = await Activity.findOne(filter);

    if (!activity) {
      return res.status(404).json({
        message: "Activity not found"
      });
    }

    await activity.deleteOne();

    res.json({
      message: "Activity deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete activity",
      error: error.message
    });
  }
};
// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const activities = await Activity.find({
      executive: req.user.id
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayActivities = activities.filter((item) => {
      const activityDate = new Date(item.date);

      return activityDate >= today && activityDate < tomorrow;
    });

    // Today's visits
    const totalVisits = todayActivities.length;
    // Total cases from all activities
    const totalCases = activities.reduce(
      (sum, item) => sum + (item.cases || 0),
      0
    );

    // Total sales from all activities
    const totalSales = activities.reduce(
      (sum, item) => sum + (item.salesAmount || 0),
      0
    );

    // Total collection from all activities
    const totalCollection = activities.reduce(
      (sum, item) => sum + (item.collectionAmount || 0),
      0
    );

    const pendingFollowUps = activities
      .filter(
        (item) =>
          item.nextFollowUp &&
          new Date(item.nextFollowUp) >= today
      )
      .sort(
        (a, b) =>
          new Date(a.nextFollowUp) - new Date(b.nextFollowUp)
      )
      .map((item) => ({
        id: item._id,
        dealerName: item.dealerName,
        nextFollowUp: item.nextFollowUp
      }));

    res.json({
      totalVisits,
      totalCases,
      totalSales,
      totalCollection,
      pendingFollowUps
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch dashboard statistics",
      error: error.message
    });
  }
};

// Get admin dashboard statistics
const getAdminDashboardStats = async (req, res) => {
  try {
    const User = require("../models/User");

    const totalExecutives = await User.countDocuments({
      role: "executive"
    });

    const executives = await User.find({
      role: "executive"
    }).select("_id name email");

    const activities = await Activity.find();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayActivities = activities.filter((item) => {
      const activityDate = new Date(item.date);

      return activityDate >= today && activityDate < tomorrow;
    });

    // Check Updated / Not Updated status
    const executivesWithStatus = executives.map((executive) => {
      const hasUpdatedToday = todayActivities.some(
        (activity) =>
          activity.executive.toString() ===
          executive._id.toString()
      );

      return {
        _id: executive._id,
        name: executive.name,
        email: executive.email,
        status: hasUpdatedToday
          ? "Updated"
          : "Not Updated"
      };
    });

    const updatedExecutiveIds = [
      ...new Set(
        todayActivities.map((item) =>
          item.executive.toString()
        )
      )
    ];

    const updatedToday = updatedExecutiveIds.length;

    const notUpdatedToday =
      totalExecutives - updatedToday;

    const totalVisits = todayActivities.length;

    const totalCases = activities.reduce(
      (sum, item) => sum + (item.cases || 0),
      0
    );

    const totalSales = activities.reduce(
      (sum, item) => sum + (item.salesAmount || 0),
      0
    );

    const totalCollection = activities.reduce(
      (sum, item) =>
        sum + (item.collectionAmount || 0),
      0
    );

    res.json({
      totalExecutives,
      updatedToday,
      notUpdatedToday,
      totalVisits,
      totalCases,
      totalSales,
      totalCollection,
      executives: executivesWithStatus
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch admin dashboard statistics",
      error: error.message
    });
  }
};
// Get activities of a selected executive
const getExecutiveActivities = async (req, res) => {
  try {
    const activities = await Activity.find({
      executive: req.params.executiveId
    }).sort({ date: -1 });

    res.json(activities);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch executive activities",
      error: error.message
    });
  }
};

module.exports = {
  addActivity,
  getMyActivities,
  getActivityById,
  getDashboardStats,
  getAdminDashboardStats,
  getExecutiveActivities,
  updateActivity,
  deleteActivity
};