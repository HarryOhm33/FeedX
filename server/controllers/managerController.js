const Goal = require("../models/goal");
const Employee = require("../models/employee");
const Manager = require("../models/manager");
const Feedback = require("../models/feedback");
const { analyzePerformance } = require("../services/geminiService");

module.exports.getManagerDashboardData = async (req, res) => {
  const managerId = req.user._id;

  const employees = await Employee.find({
    organisationId: req.user.organisationId,
  });

  const goals = await Goal.find({ managerId }).populate("employeeId", "name");

  const feedbacks = await Feedback.find({
    receiverId: { $in: employees.map((e) => e._id) },
    receiverModel: "Employee",
  });

  const completedGoals = goals.filter((g) => g.status === "Completed");
  const pendingGoals = goals.filter((g) => g.status !== "Completed");

  const totalFeedback = feedbacks.length;
  const positive = feedbacks.filter((f) => f.rating >= 4).length;
  const neutral = feedbacks.filter((f) => f.rating === 3).length;
  const negative = feedbacks.filter((f) => f.rating <= 2).length;

  const goalCompletionMap = {};
  completedGoals.forEach((g) => {
    if (g.employeeId && g.employeeId._id) {
      const empId = g.employeeId._id.toString();
      goalCompletionMap[empId] = (goalCompletionMap[empId] || 0) + 1;
    }
  });

  let topPerformerId = null;
  let maxCompleted = 0;

  for (const [empId, count] of Object.entries(goalCompletionMap)) {
    if (count > maxCompleted) {
      maxCompleted = count;
      topPerformerId = empId;
    }
  }

  let topPerformer = null;
  if (topPerformerId) {
    const topEmployeeGoal = completedGoals.find(
      (g) => g.employeeId && g.employeeId._id.toString() === topPerformerId
    );
    topPerformer = {
      _id: topPerformerId,
      name: topEmployeeGoal?.employeeId?.name || "Unknown",
      completed: maxCompleted,
    };
  }

  const recentFeedback = feedbacks.slice(-5).map((f) => ({
    rating: f.rating,
    comments: f.responses.map((r) => r.answer).join("; "),
  }));

  const data = {
    totalEmployees: employees.length,
    goalsAssigned: goals.length,
    goalsCompleted: completedGoals.length,
    goalsPending: pendingGoals.length,
    feedbackStats: {
      totalFeedback,
      positive,
      neutral,
      negative,
    },
    topPerformer,
    recentFeedback,
  };

  const prompt = `
You are an AI performance analyst. Here's the manager's team performance data:

- Total Employees: ${data.totalEmployees}
- Goals Assigned: ${data.goalsAssigned}
- Goals Completed: ${data.goalsCompleted}
- Goals Pending: ${data.goalsPending}
- Feedback Summary:
  - Total: ${data.feedbackStats.totalFeedback}
  - Positive: ${data.feedbackStats.positive}
  - Neutral: ${data.feedbackStats.neutral}
  - Negative: ${data.feedbackStats.negative}
- Top Performer: ${topPerformer?.name || "N/A"} with ${
    topPerformer?.completed || 0
  } goals completed

Recent Feedback Responses:
${data.recentFeedback
  .map((f, i) => `  ${i + 1}. Rating: ${f.rating}, Comments: ${f.responses}`)
  .join("\n")}

Give a concise (max 3 sentences, 30 words) performance insight with key trends and actionable suggestions for the manager.
  `;

  const aiInsights = await analyzePerformance(prompt);

  res.json({ data, aiInsights });
};

module.exports.getEmployeesByManager = async (req, res) => {
  const managerId = req.user._id;
  const organisationId = req.user.organisationId;

  const employees = await Employee.find({ organisationId })
    .select("-password")
    .sort({ createdAt: -1 });

  res.status(200).json({ employees });
};
