const express = require("express");
const router = express.Router();
const {
  createGoal,
  getEmployeeGoals,
  getManagerGoals,
  getEmployeeGoalsForManager,
  requestGoalCompletion,
  approveGoalCompletion,
  getEmployeeGoalAnalytics,
} = require("../controllers/goalController");
const authenticate = require("../middleware/authenticate");
const wrapAsync = require("../utils/wrapAsync");
const CheckManager = require("../middleware/checkManager");

// Manager assigns a goal to an employee
router.post("/create", authenticate, CheckManager, wrapAsync(createGoal));

// Employee fetches their assigned goals
router.get("/", authenticate, wrapAsync(getEmployeeGoals));

// Manager fetches all goals they have assigned
router.get(
  "/manager/goals",
  authenticate,
  CheckManager,
  wrapAsync(getManagerGoals)
);

// Manager fetches goals assigned to a specific employee
router.get(
  "/manager/goals/:employeeId",
  authenticate,
  CheckManager,
  wrapAsync(getEmployeeGoalsForManager)
);

// Employee requests goal completion
router.put(
  "/:goalId/request-completion",
  authenticate,
  wrapAsync(requestGoalCompletion)
);

// Manager approves goal completion
router.put(
  "/:goalId/approve",
  authenticate,
  CheckManager,
  wrapAsync(approveGoalCompletion)
);

// 📌 Manager fetches performance analysis of a specific employee
router.get(
  "/analytics/:employeeId",
  authenticate,
  CheckManager,
  wrapAsync(getEmployeeGoalAnalytics)
);

module.exports = router;
