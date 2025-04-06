const express = require("express");
const router = express.Router();
const {
  createSession,
  getActiveSessions,
  submitSelfAssessment,
  getQuestions,
  getSessionSubmissions,
} = require("../controllers/selfAssessmentController");
const wrapAsync = require("../utils/wrapAsync");
const authenticate = require("../middleware/authenticate");
const checkHR = require("../middleware/checkHR");

router.use(authenticate);

// HR: create session
router.post("/session", checkHR, wrapAsync(createSession));

// HR: get all submissions for a session
router.get(
  "/session/:sessionId/responses",
  checkHR,
  wrapAsync(getSessionSubmissions)
);

// User: view active sessions
router.get("/sessions", wrapAsync(getActiveSessions));

// User: view questions
router.get("/questions", wrapAsync(getQuestions));

// User: submit response
router.post("/submit", wrapAsync(submitSelfAssessment));

module.exports = router;
