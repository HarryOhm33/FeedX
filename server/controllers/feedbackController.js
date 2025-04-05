const Feedback = require("../models/feedback");
const FeedbackRequest = require("../models/feedbackReq");
const Employee = require("../models/employee");
const Manager = require("../models/manager");
const questionsByRole = require("../utils/questions");

// ✅ HR triggers feedback for an Employee or Manager
module.exports.triggerFeedback = async (req, res) => {
  const { targetId, sessionName } = req.body;

  if (req.user.role !== "hr") {
    return res.status(403).json({
      success: false,
      message: "Only HR can trigger feedback.",
    });
  }

  const targetEmployee = await Employee.findById(targetId);
  const targetManager = await Manager.findById(targetId);

  if (!targetEmployee && !targetManager) {
    return res.status(404).json({
      success: false,
      message: "Target user not found.",
    });
  }

  const existingRequest = await FeedbackRequest.findOne({
    targetId,
    expiresAt: { $gte: new Date() },
  });

  if (existingRequest) {
    return res.status(400).json({
      success: false,
      message: "Feedback request already exists for this person.",
    });
  }

  const employees = await Employee.find({ _id: { $ne: targetId } }, "_id");
  const managers = await Manager.find({ _id: { $ne: targetId } }, "_id");

  const allResponders = [...employees, ...managers];

  const feedbackRequest = new FeedbackRequest({
    targetId,
    requestedBy: req.user._id,
    leftResponders: allResponders.map((user) => user._id),
    respondedBy: [],
    sessionName,
  });

  await feedbackRequest.save();

  res.status(201).json({
    success: true,
    message: "Feedback request created successfully",
    feedbackRequest,
  });
};

// ✅ Submit Feedback (Only if feedback was requested)
module.exports.submitFeedback = async (req, res) => {
  const { targetId, responses, sessionName } = req.body;
  const giverId = req.user._id;

  const feedbackRequest = await FeedbackRequest.findOne({
    targetId,
    expiresAt: { $gte: new Date() },
  });

  if (!feedbackRequest) {
    return res.status(400).json({
      success: false,
      message: "No active feedback request for this person.",
    });
  }

  if (!feedbackRequest.leftResponders.includes(giverId)) {
    return res.status(403).json({
      success: false,
      message:
        "You are not authorized to submit feedback or already responded.",
    });
  }

  // Determine giverModel
  let giverModel = (await Employee.exists({ _id: giverId }))
    ? "Employee"
    : "Manager";
  let receiverModel = (await Employee.exists({ _id: targetId }))
    ? "Employee"
    : "Manager";

  const roleKey = `${giverModel.toLowerCase()}To${receiverModel}`;
  const expectedQuestions = questionsByRole[roleKey];

  if (!expectedQuestions || responses.length !== expectedQuestions.length) {
    return res.status(400).json({
      success: false,
      message: `Responses must match the number of predefined questions for ${roleKey}.`,
    });
  }

  const feedback = new Feedback({
    giverId,
    receiverId: targetId,
    giverModel,
    receiverModel,
    responses,
    sessionName: feedbackRequest.sessionName,
  });

  await feedback.save();

  feedbackRequest.leftResponders = feedbackRequest.leftResponders.filter(
    (id) => id.toString() !== giverId.toString()
  );
  feedbackRequest.respondedBy.push({
    responderId: giverId,
    respondedAt: new Date(),
  });

  await feedbackRequest.save();

  res.status(201).json({
    success: true,
    message: "Feedback submitted successfully",
    feedback,
  });
};

// ✅ Get Pending Feedback Requests (For Dashboard Notifications)
module.exports.getFeedbackRequests = async (req, res) => {
  const requests = await FeedbackRequest.find({
    leftResponders: req.user._id,
    expiresAt: { $gte: new Date() },
  }).populate("targetId", "name role");

  res.json({
    success: true,
    feedbackRequests: requests,
  });
};

// ✅ Feedback Analytics
module.exports.getFeedbackAnalytics = async (req, res) => {
  const { id } = req.params;

  const feedbacks = await Feedback.find({ receiverId: id });

  if (feedbacks.length === 0) {
    return res.json({ message: "No feedback available for this user." });
  }

  const totalFeedbacks = feedbacks.length;

  // Average rating (sum of all responses / # of questions / # of feedbacks)
  const totalResponses = feedbacks.reduce((sum, fb) => {
    return sum + fb.responses.reduce((a, b) => a + b, 0);
  }, 0);
  const totalQuestions = feedbacks[0].responses.length;

  const avgRating = totalResponses / (totalFeedbacks * totalQuestions);

  // Rating breakdown per question
  const questionStats = {};
  feedbacks.forEach((fb) => {
    fb.responses.forEach((rating, index) => {
      if (!questionStats[index]) questionStats[index] = {};
      questionStats[index][rating] = (questionStats[index][rating] || 0) + 1;
    });
  });

  res.json({
    totalFeedbacks,
    avgRating: avgRating.toFixed(2),
    questionStats,
  });
};

module.exports.getFeedbackForm = async (req, res) => {
  const giverId = req.user._id;
  const targetId = req.params.targetId;

  // Get giver role
  const giverModel = (await Employee.findById(giverId))
    ? "employee"
    : (await Manager.findById(giverId))
    ? "manager"
    : null;

  // Get target role
  const targetModel = (await Employee.findById(targetId))
    ? "employee"
    : (await Manager.findById(targetId))
    ? "manager"
    : null;

  if (!giverModel || !targetModel) {
    return res.status(404).json({
      success: false,
      message: "Giver or target user not found.",
    });
  }

  let questionSet;

  // Determine relationship
  if (giverModel === "employee" && targetModel === "employee") {
    questionSet = questions.employeeToEmployee;
  } else if (giverModel === "employee" && targetModel === "manager") {
    questionSet = questions.employeeToManager;
  } else if (giverModel === "manager" && targetModel === "employee") {
    questionSet = questions.managerToEmployee;
  } else {
    return res.status(400).json({
      success: false,
      message: "Invalid feedback relationship.",
    });
  }

  res.json({
    success: true,
    roleRelation: `${giverModel}To${targetModel
      .charAt(0)
      .toUpperCase()}${targetModel.slice(1)}`,
    questions: questionSet,
  });
};
