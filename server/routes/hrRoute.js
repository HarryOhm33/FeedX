const express = require("express");
const {
  createUser,
  getHrDashboardData,
  getEmployeeList,
  getManagerList,
  toggleAutoFeedback,
} = require("../controllers/hrController");
const authenticate = require("../middleware/authenticate");
const checkHR = require("../middleware/checkHR"); // ✅ Import checkHR middleware
const wrapAsync = require("../utils/wrapAsync");

const router = express.Router();

// ✅ Only HRs can create users
router.post("/create-user", authenticate, checkHR, wrapAsync(createUser));

router.get("/dashboard", authenticate, checkHR, getHrDashboardData);

// List Routes
router.get("/employee-list", authenticate, checkHR, wrapAsync(getEmployeeList));
router.get("/manager-list", authenticate, checkHR, wrapAsync(getManagerList));

router.put(
  "/toggle-auto-feedback/:userId",
  authenticate,
  wrapAsync(toggleAutoFeedback)
);

module.exports = router;
