const express = require("express");

const {
  addActivity,
  getMyActivities,
  getActivityById,
  getDashboardStats,
  getAdminDashboardStats,
  getExecutiveActivities,
  updateActivity,
  deleteActivity
} = require("../controllers/activityController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const router = express.Router();

// ==========================================
// EXECUTIVE ROUTES
// ==========================================

// Add activity
router.post("/", protect, addActivity);

// Get logged-in executive's activities
router.get("/my", protect, getMyActivities);

// Get executive dashboard statistics
router.get("/dashboard-stats", protect, getDashboardStats);


// ==========================================
// ADMIN ROUTES
// ==========================================

// Get admin dashboard statistics
router.get(
  "/admin-dashboard-stats",
  protect,
  adminOnly,
  getAdminDashboardStats
);

// Get activities of selected executive
router.get(
  "/admin/executive/:executiveId",
  protect,
  adminOnly,
  getExecutiveActivities
);


// ==========================================
// ACTIVITY ID ROUTES
// ==========================================

// Get single activity
router.get("/:id", protect, getActivityById);

// Update own activity
router.put("/:id", protect, updateActivity);

// Delete own activity
router.delete("/:id", protect, deleteActivity);


module.exports = router;