const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");
const authenticate = require("../middleware/authenticate");

const {
  signup,
  login,
  logout,
  verifyOTP,
  resendOTP,
  verifySession,
} = require("../controllers/authController");

// ✅ User Signup
router.post("/signup", wrapAsync(signup));

router.post("/verify-otp", wrapAsync(verifyOTP));

router.post("/resend-otp", wrapAsync(resendOTP));

// ✅ User Login
router.post("/login", wrapAsync(login));

router.post("/logout", authenticate, wrapAsync(logout));

// Route to verify session
router.post("/verify-session", authenticate, wrapAsync(verifySession));

module.exports = router;
