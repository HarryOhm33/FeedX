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
    receiverId: { $in: employees },
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
      name:
        topEmployeeGoal && topEmployeeGoal.employeeId
          ? topEmployeeGoal.employeeId.name
          : "Unknown",
      completed: maxCompleted,
    };
  }

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
  };

  const aiInsights = await analyzePerformance(data);

  res.json({ data, aiInsights });
};
