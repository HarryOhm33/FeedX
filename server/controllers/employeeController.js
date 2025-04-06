const Goal = require("../models/goal");
const Employee = require("../models/employee");
const Manager = require("../models/manager");
const Feedback = require("../models/feedback");
const { analyzePerformance } = require("../services/geminiService");

module.exports.getEmployeeDashboardData = async (req, res) => {
  try {
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

    // Extract numeric responses (1-5) only
    const numericRatings = feedbacks.flatMap((f) =>
      f.responses
        .map((r) => parseInt(r.answer))
        .filter((a) => !isNaN(a) && a >= 1 && a <= 5)
    );

    const averageRating =
      numericRatings.length > 0
        ? (
            numericRatings.reduce((sum, r) => sum + r, 0) /
            numericRatings.length
          ).toFixed(2)
        : "0.00";

    const feedbackStats = {
      totalFeedback: feedbacks.length,
      positive: numericRatings.filter((r) => r >= 4).length,
      neutral: numericRatings.filter((r) => r === 3).length,
      negative: numericRatings.filter((r) => r <= 2).length,
      averageRating,
    };

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
      feedbackStats,
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
  - Total: ${feedbackStats.totalFeedback}
  - Positive: ${feedbackStats.positive}
  - Neutral: ${feedbackStats.neutral}
  - Negative: ${feedbackStats.negative}
  - Average Rating: ${feedbackStats.averageRating}

### 2. Improvement Suggestions (Max 1 sentence, action-oriented):
Give one constructive suggestion the employee can focus on to improve next month.
`;

    const aiInsights = await analyzePerformance(prompt);

    res.json({ success: true, data, aiInsights });
  } catch (err) {
    console.error("Error in getEmployeeDashboardData:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
