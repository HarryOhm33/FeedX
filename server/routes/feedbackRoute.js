const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const wrapAsync = require("../utils/wrapAsync");
const {
  triggerFeedback,
  submitFeedback,
  getFeedbackRequests,
  getFeedbackAnalytics,
  getFeedbackForm,
} = require("../controllers/feedbackController");

const checkHR = require("../middleware/checkHR");

// ✅ HR triggers feedback for an individual employee or manager
router.post("/trigger", authenticate, checkHR, wrapAsync(triggerFeedback));

// ✅ Employees/Managers submit feedback
router.post("/submit", authenticate, wrapAsync(submitFeedback));

// ✅ Get pending feedback requests for the user
router.get("/requests", authenticate, wrapAsync(getFeedbackRequests));

// Fedback Analytics
router.get(
  "/analytics/:id",
  authenticate,
  checkHR,
  wrapAsync(getFeedbackAnalytics)
);

router.get("/form/:targetId", authenticate, getFeedbackForm);

module.exports = router;
