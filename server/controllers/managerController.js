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

  const employeeIds = employees.map((e) => e._id);

  const goals = await Goal.find({ managerId }).populate("employeeId", "name");

  const feedbacks = await Feedback.find({
    receiverId: { $in: employeeIds },
    receiverModel: "Employee",
  });

  const completedGoals = goals.filter((g) => g.status === "Completed");
  const pendingGoals = goals.filter((g) => g.status !== "Completed");

  // ----- Feedback Stats Calculation from responses (1-5 scale) -----
  let totalFeedback = 0,
    positive = 0,
    neutral = 0,
    negative = 0,
    totalScore = 0;

  feedbacks.forEach((f) => {
    f.responses.forEach((r) => {
      const rating = parseInt(r.answer);
      if (rating >= 1 && rating <= 5) {
        totalFeedback++;
        totalScore += rating;
        if (rating >= 4) positive++;
        else if (rating === 3) neutral++;
        else negative++;
      }
    });
  });

  const avgFeedbackScore =
    totalFeedback > 0 ? (totalScore / totalFeedback).toFixed(2) : "N/A";

  // ----- Top Performer based on goal completions -----
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
      avgFeedbackScore,
    },
    topPerformer,
  };

  // ----- AI Prompt -----
  const prompt = `
Manager Dashboard Summary:
- Employees: ${data.totalEmployees}
- Goals: ${data.goalsAssigned} (Completed: ${data.goalsCompleted}, Pending: ${
    data.goalsPending
  })
- Feedbacks: Total ${data.feedbackStats.totalFeedback}, Positive: ${
    data.feedbackStats.positive
  }, Neutral: ${data.feedbackStats.neutral}, Negative: ${
    data.feedbackStats.negative
  }
- Average Feedback Score: ${avgFeedbackScore}
- Top Performer: ${topPerformer?.name || "N/A"} (Goals Completed: ${
    topPerformer?.completed || 0
  })

Write 2–3 short sentences summarizing the team's performance based on goals and feedback.
Then, write a personalized appreciation message for ${
    topPerformer?.name || "the top performer"
  } based on goal achievement.
Finally, suggest one improvement area for the manager's team in the coming month.
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
