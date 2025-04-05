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
  getSessionsByTarget,
  getFeedbacksByRequestId,
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

// ✅ Get all sessions for a specific targetId (HR access)
router.get(
  "/sessions/:targetId",
  authenticate,
  checkHR,
  wrapAsync(getSessionsByTarget)
);

// ✅ Get all feedbacks by feedbackRequestId (HR access)
router.get(
  "/responses/:feedbackRequestId",
  authenticate,
  checkHR,
  wrapAsync(getFeedbacksByRequestId)
);

module.exports = router;
