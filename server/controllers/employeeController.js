const Goal = require("../models/goal");
const Employee = require("../models/employee");
const Manager = require("../models/manager");
const Feedback = require("../models/feedback");
const { analyzePerformance } = require("../services/geminiService");

module.exports.getEmployeeDashboardData = async (req, res) => {
  const employeeId = req.user._id;

  const goals = await Goal.find({ employeeId });
  const feedbacks = await Feedback.find({
    receiverId: employeeId,
    receiverModel: "Employee",
  });

  const goalsCompleted = goals.filter((g) => g.status === "Completed");
  const goalsPending = goals.filter((g) => g.status !== "Completed");

  const goalCompletionRate = goals.length
    ? (goalsCompleted.length / goals.length) * 100
    : 0;

  const averageRating = feedbacks.length
    ? feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length
    : 0;

  const data = {
    goalsAssigned: goals.length,
    goalsCompleted: goalsCompleted.length,
    goalsPending: goalsPending.length,
    goalCompletionRate: goalCompletionRate.toFixed(2) + "%",
    feedbackStats: {
      totalFeedback: feedbacks.length,
      positive: feedbacks.filter((f) => f.rating >= 4).length,
      neutral: feedbacks.filter((f) => f.rating === 3).length,
      negative: feedbacks.filter((f) => f.rating <= 2).length,
      averageRating: averageRating.toFixed(2),
    },
    recentGoals: goals.slice(-5).map((goal) => ({
      title: goal.title,
      status: goal.status,
      deadline: goal.deadline,
    })),
    recentFeedback: feedbacks.slice(-5).map((feedback) => ({
      rating: feedback.rating,
      comments: feedback.comments,
    })),
  };

  const aiInsights = await analyzePerformance(data);
  res.json({ data, aiInsights });
};
