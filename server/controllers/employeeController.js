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

  const recentGoals = goals.slice(-5).map((goal) => ({
    title: goal.title,
    status: goal.status,
    deadline: goal.deadline,
  }));

  const recentFeedback = feedbacks.slice(-5).map((feedback) => ({
    rating: feedback.rating,
    responses: feedback.responses
      .map((r) => `${r.question}: ${r.answer}`)
      .join("; "),
  }));

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
    recentGoals,
    recentFeedback,
  };

  const prompt = `
You are an AI performance coach. Here's an employee's performance summary:

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

Recent Goals:
${recentGoals
  .map(
    (g, i) =>
      `  ${i + 1}. ${g.title} - ${
        g.status
      } (Deadline: ${g.deadline.toDateString()})`
  )
  .join("\n")}

Recent Feedback:
${recentFeedback
  .map((f, i) => `  ${i + 1}. Rating: ${f.rating}, Responses: ${f.responses}`)
  .join("\n")}

Give a short and precise (max 3 sentences, 30 words) performance insight with key observations and actionable suggestions for the employee.
  `;

  const aiInsights = await analyzePerformance(prompt);

  res.json({ data, aiInsights });
};
