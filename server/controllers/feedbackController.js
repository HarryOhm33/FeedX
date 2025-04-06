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
  try {
    const { targetId, objectiveResponses, subjectiveResponses } = req.body;
    const giverId = req.user._id;

    // Validate required fields
    if (!targetId || !objectiveResponses || !subjectiveResponses) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: targetId, objectiveResponses, or subjectiveResponses",
      });
    }

    // Check feedback request validity
    const feedbackRequest = await FeedbackRequest.findOne({
      targetId,
      expiresAt: { $gte: new Date() },
    });

    if (!feedbackRequest) {
      return res.status(400).json({
        success: false,
        message: "No active feedback request found for this user",
      });
    }

    // Check authorization
    if (!feedbackRequest.leftResponders.some((id) => id.equals(giverId))) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to submit feedback or have already responded",
      });
    }

    // Determine user roles using dynamic reference pattern
    const [giverEmployee, giverManager, targetEmployee, targetManager] =
      await Promise.all([
        Employee.findById(giverId),
        Manager.findById(giverId),
        Employee.findById(targetId),
        Manager.findById(targetId),
      ]);

    const giverModel = giverEmployee
      ? "Employee"
      : giverManager
      ? "Manager"
      : null;
    const receiverModel = targetEmployee
      ? "Employee"
      : targetManager
      ? "Manager"
      : null;

    if (!giverModel || !receiverModel) {
      return res.status(400).json({
        success: false,
        message: "Invalid giver or receiver role",
      });
    }

    const roleKey = `${giverModel.toLowerCase()}To${receiverModel}`;
    const expectedQuestions = questionsByRole[roleKey];

    if (!expectedQuestions) {
      return res.status(400).json({
        success: false,
        message: "No question set defined for this feedback relationship",
      });
    }

    // Validate response counts match expected questions
    const expectedObjectiveCount = expectedQuestions.objective.length;
    const expectedSubjectiveCount = expectedQuestions.subjective.length;

    if (
      Object.keys(objectiveResponses).length !== expectedObjectiveCount ||
      subjectiveResponses.length !== expectedSubjectiveCount
    ) {
      return res.status(400).json({
        success: false,
        message: `Expected ${expectedObjectiveCount} objective and ${expectedSubjectiveCount} subjective responses`,
      });
    }

    // Prepare responses array for schema
    const formattedResponses = [
      // Format objective responses (ratings 1-5)
      ...expectedQuestions.objective.map((question) => ({
        question,
        answer: objectiveResponses[question].toString(),
        type: "objective",
      })),

      // Format subjective responses (text answers)
      ...expectedQuestions.subjective.map((question, index) => ({
        question,
        answer: subjectiveResponses[index].answer,
        type: "subjective",
      })),
    ];

    // Create feedback document
    const feedback = new Feedback({
      feedbackRequestId: feedbackRequest._id,
      receiverId: targetId,
      receiverModel,
      giverId,
      giverModel,
      responses: formattedResponses,
      roleRelation: roleKey,
    });

    // Update feedback request
    feedbackRequest.leftResponders.pull(giverId);
    feedbackRequest.respondedBy.push({
      responderId: giverId,
      respondedAt: new Date(),
    });

    // Save both in transaction
    await Promise.all([feedback.save(), feedbackRequest.save()]);

    return res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      data: {
        feedbackId: feedback._id,
        receiver: {
          id: targetId,
          model: receiverModel,
        },
        questionsAnswered: formattedResponses.length,
      },
    });
  } catch (error) {
    console.error("Feedback submission error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while processing feedback",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
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
  try {
    const giverId = req.user._id;
    const targetId = req.params.targetId;

    // Validate input
    if (!giverId || !targetId) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameters",
      });
    }

    // Determine user roles
    let giverModel = null;
    let targetModel = null;

    // Check both collections for both users (more flexible approach)
    const [isGiverEmployee, isGiverManager] = await Promise.all([
      Employee.exists({ _id: giverId }),
      Manager.exists({ _id: giverId }),
    ]);

    const [isTargetEmployee, isTargetManager] = await Promise.all([
      Employee.exists({ _id: targetId }),
      Manager.exists({ _id: targetId }),
    ]);

    if (isGiverEmployee) giverModel = "employee";
    else if (isGiverManager) giverModel = "manager";

    if (isTargetEmployee) targetModel = "Employee";
    else if (isTargetManager) targetModel = "Manager";

    // Validate roles were determined
    if (!giverModel || !targetModel) {
      return res.status(404).json({
        success: false,
        message: "Giver or target user not found or invalid role",
      });
    }

    const roleKey = `${giverModel}To${targetModel}`;
    const questionSet = questions[roleKey];

    // Validate question set exists
    if (!questionSet) {
      return res.status(400).json({
        success: false,
        message: "No question set defined for this feedback relationship",
      });
    }

    // Return structured response with separate question types
    res.json({
      success: true,
      roleRelation: roleKey,
      objectiveQuestions: questionSet.objective || [],
      subjectiveQuestions: questionSet.subjective || [],
    });
  } catch (error) {
    console.error("Error in getFeedbackForm:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching feedback form",
    });
  }
};

// ✅ Controller to get all sessions for a certain targetId
module.exports.getSessionsByTarget = async (req, res) => {
  const { targetId } = req.params;

  const sessions = await FeedbackRequest.find({ targetId })
    .populate("targetId", "name") // populating with name and email fields
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: sessions.length,
    sessions,
  });
};

// ✅ Controller to get all feedbacks for a feedbackRequestId
module.exports.getFeedbacksByRequestId = async (req, res) => {
  const { feedbackRequestId } = req.params;

  const feedbacks = await Feedback.find({ feedbackRequestId }).populate({
    path: "giverId",
    select: "name role", // fields to include
    strictPopulate: false, // allows dynamic refPath
  });

  res.status(200).json({
    success: true,
    count: feedbacks.length,
    feedbacks,
  });
};
