const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const { getManagerDashboardData } = require("../controllers/managerController");
const CheckManager = require("../middleware/checkManager");

router.get("/dashboard", authenticate, CheckManager, getManagerDashboardData);

module.exports = router;
