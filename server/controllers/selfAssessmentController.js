const SelfAssessment = require("../models/SelfAssessment");
const SelfAssessmentSession = require("../models/SelfAssessmentSession");
const Employee = require("../models/employee");
const Manager = require("../models/manager");
const roleQuestions = require("../utils/selfAssessmentQuestions");

// HR creates a session
module.exports.createSession = async (req, res) => {
  const { sessionName, description } = req.body;

  const session = await SelfAssessmentSession.create({
    sessionName,
    description,
    createdBy: req.user._id,
  });

  res.status(201).json({ message: "Session created", session });
};

// Get all active sessions (for user)
module.exports.getActiveSessions = async (req, res) => {
  const sessions = await SelfAssessmentSession.find({ active: true });
  res.json(sessions);
};

// Submit self-assessment
module.exports.submitSelfAssessment = async (req, res) => {
  const { sessionId, responses } = req.body;
  const userId = req.user._id;

  const session = await SelfAssessmentSession.findById(sessionId);
  if (!session || !session.active)
    return res.status(400).json({ message: "Invalid session" });

  let user = await Employee.findById(userId);
  let userModel = "Employee";
  if (!user) {
    user = await Manager.findById(userId);
    userModel = "Manager";
  }

  const exists = await SelfAssessment.findOne({ sessionId, userId });
  if (exists)
    return res
      .status(400)
      .json({ message: "Already submitted for this session" });

  const assessment = await SelfAssessment.create({
    sessionId,
    userId,
    userModel,
    responses,
  });

  res.status(201).json({ message: "Submitted successfully", assessment });
};

// Get questions for current user
module.exports.getQuestions = async (req, res) => {
  const userId = req.user._id;
  let user = await Employee.findById(userId);
  let role = "Employee";

  if (!user) {
    user = await Manager.findById(userId);
    if (user) role = "Manager";
    else return res.status(400).json({ message: "Invalid user" });
  }

  const questions = roleQuestions[role];
  res.json({ role, questions });
};

// HR view submissions for a session
module.exports.getSessionSubmissions = async (req, res) => {
  const { sessionId } = req.params;

  const assessments = await SelfAssessment.find({ sessionId }).populate(
    "userId"
  );
  res.json(assessments);
};
