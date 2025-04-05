const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const {
  getEmployeeDashboardData,
} = require("../controllers/employeeController");

router.get("/dashboard", authenticate, getEmployeeDashboardData);

module.exports = router;
