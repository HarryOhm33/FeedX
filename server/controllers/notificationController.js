const Notification = require("../models/notification");

// GET all notifications for a specific user
exports.getUserNotifications = async (req, res) => {
  const { userId } = req.params;
  const notifications = await Notification.find({ userId }).sort({
    createdAt: -1,
  });
  res.status(200).json(notifications);
};

// DELETE a specific notification
exports.deleteNotification = async (req, res) => {
  const { notificationId } = req.params;
  const deleted = await Notification.findByIdAndDelete(notificationId);

  if (!deleted) {
    return res.status(404).json({ message: "Notification not found" });
  }

  res.status(200).json({ message: "Notification deleted successfully" });
};
