const Feedback = require("../models/feedback");
const FeedbackRequest = require("../models/feedbackReq");
const Employee = require("../models/employee");
const Manager = require("../models/manager");
const questionsByRole = require("../utils/questions");
const questions = require("../utils/questions");

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
  const { targetId, responses, rating } = req.body;
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
        "You are not authorized to submit feedback or have already responded.",
    });
  }

  const giverModel = (await Employee.exists({ _id: giverId }))
    ? "Employee"
    : "Manager";
  const receiverModel = (await Employee.exists({ _id: targetId }))
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

  for (let i = 0; i < expectedQuestions.length; i++) {
    const expected = expectedQuestions[i].trim().toLowerCase();
    const received = responses[i]?.question?.trim().toLowerCase();

    if (
      !received ||
      expected !== received ||
      typeof responses[i].answer !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: `Invalid or mismatched response at index ${i}.`,
      });
    }
  }

  const feedback = new Feedback({
    feedbackRequestId: feedbackRequest._id,
    giverId,
    giverModel,
    receiverId: targetId,
    receiverModel,
    responses,
    rating,
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

  return res.status(201).json({
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
  })
    .populate("targetId", "name") // Get target's name
    .populate("requestedBy", "name"); // Get requester's name

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

  const totalRating = feedbacks.reduce((sum, fb) => sum + fb.rating, 0);
  const avgRating = totalRating / totalFeedbacks;

  // Optional: analyze response answers by question
  const questionStats = {};
  feedbacks.forEach((fb) => {
    fb.responses.forEach((response) => {
      const q = response.question;
      if (!questionStats[q]) questionStats[q] = [];
      questionStats[q].push(response.answer);
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

  let giverModel = null;
  let targetModel = null;

  if (await Employee.exists({ _id: giverId })) giverModel = "employee";
  else if (await Manager.exists({ _id: giverId })) giverModel = "manager";

  if (await Employee.exists({ _id: targetId })) targetModel = "Employee";
  else if (await Manager.exists({ _id: targetId })) targetModel = "Manager";

  if (!giverModel || !targetModel) {
    return res.status(404).json({
      success: false,
      message: "Giver or target user not found.",
    });
  }

  const roleKey = `${giverModel}To${targetModel}`;
  const questionSet = questions[roleKey];

  if (!questionSet) {
    return res.status(400).json({
      success: false,
      message: "Invalid feedback relationship.",
    });
  }

  res.json({
    success: true,
    roleRelation: roleKey,
    questions: questionSet,
  });
};
