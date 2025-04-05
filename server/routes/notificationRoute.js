const express = require("express");
const router = express.Router();
const {
  getUserNotifications,
  deleteNotification,
} = require("../controllers/notificationController");
const wrapAsync = require("../utils/wrapAsync");
const authenticate = require("../middleware/authenticate");

// All routes protected by authentication
router.get("/:userId", authenticate, wrapAsync(getUserNotifications));
router.delete("/:notificationId", authenticate, wrapAsync(deleteNotification));

module.exports = router;
