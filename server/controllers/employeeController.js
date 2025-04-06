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

  const goalCompletionRate =
    goals.length > 0
      ? ((goalsCompleted.length / goals.length) * 100).toFixed(2)
      : "0.00";

  const averageRating =
    feedbacks.length > 0
      ? (
          feedbacks.reduce((sum, f) => sum + (f.rating || 0), 0) /
          feedbacks.length
        ).toFixed(2)
      : "0.00";

  const recentGoals = goals.slice(-5).map((goal) => ({
    title: goal.title,
    status: goal.status,
    deadline: goal.deadline,
  }));

  const data = {
    goalsAssigned: goals.length,
    goalsCompleted: goalsCompleted.length,
    goalsPending: goalsPending.length,
    goalCompletionRate: `${goalCompletionRate}%`,
    feedbackStats: {
      totalFeedback: feedbacks.length,
      positive: feedbacks.filter((f) => f.rating >= 4).length,
      neutral: feedbacks.filter((f) => f.rating === 3).length,
      negative: feedbacks.filter((f) => f.rating <= 2).length,
      averageRating,
    },
    recentGoals,
  };

  const prompt = `
You are an AI performance coach. Analyze the following employee performance data and provide insights in two parts.

### 1. Performance Summary (Max 2 sentences, simple and clear):
- Goals Assigned: ${data.goalsAssigned}
- Goals Completed: ${data.goalsCompleted}
- Goals Pending: ${data.goalsPending}
- Goal Completion Rate: ${data.goalCompletionRate}
- Feedback Stats:
  - Total: ${data.feedbackStats.totalFeedback}
  - Positive: ${data.feedbackStats.positive}
  - Neutral: ${data.feedbackStats.neutral}
  - Negative: ${data.feedbackStats.negative}
  - Average Rating: ${data.feedbackStats.averageRating}

### 2. Improvement Suggestions (Max 1 sentence, action-oriented):
Give one constructive suggestion the employee can focus on to improve next month.
`;

  const aiInsights = await analyzePerformance(prompt);

  res.json({ success: true, data, aiInsights });
};
