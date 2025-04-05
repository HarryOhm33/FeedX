const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const {
  getManagerDashboardData,
  getEmployeesByManager,
} = require("../controllers/managerController");
const CheckManager = require("../middleware/checkManager");

router.get("/dashboard", authenticate, CheckManager, getManagerDashboardData);

router.get("/get-employees", authenticate, CheckManager, getEmployeesByManager);

module.exports = router;
