const bcrypt = require("bcryptjs");
const Organisation = require("../models/organisation");
const { userCreationTemplate } = require("../utils/mailTemplates");
const sendEmail = require("../utils/sendEmail");
const Manager = require("../models/manager");
const Employee = require("../models/employee");
const HR = require("../models/hr");
const Goal = require("../models/goal");
const Feedback = require("../models/feedback");
const { analyzePerformance } = require("../services/geminiService");

module.exports.createUser = async (req, res) => {
  const { name, email, password, role, organisation, organisationId } =
    req.body;

  // Validate required fields
  if (
    !name ||
    !email ||
    !password ||
    !role ||
    !organisation ||
    !organisationId
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Ensure only HR can create users
  if (req.user.role !== "hr") {
    return res
      .status(403)
      .json({ message: "Unauthorized: Only HR can create users" });
  }

  // 🔒 Check if the email already exists across all user collections
  const existingHr = await HR.findOne({ email });
  const existingManager = await Manager.findOne({ email });
  const existingEmployee = await Employee.findOne({ email });

  if (existingHr || existingManager || existingEmployee) {
    return res
      .status(400)
      .json({ message: "User with this email already exists" });
  }

  // ✅ Hash the password before saving
  const hashedPassword = await bcrypt.hash(password, 10);

  let newUser;
  if (role === "employee") {
    newUser = await Employee.create({
      name,
      email,
      password: hashedPassword,
      role,
      organisation,
      organisationId,
      isVerified: true,
    });
  } else if (role === "manager") {
    newUser = await Manager.create({
      name,
      email,
      password: hashedPassword,
      role,
      organisation,
      organisationId,
      isVerified: true,
    });
  } else {
    return res.status(400).json({ message: "Invalid role specified" });
  }

  // ✅ Push user ID into the correct organisation field
  const organisationRecord = await Organisation.findOne({ organisationId });
  if (organisationRecord) {
    if (role === "employee") {
      organisationRecord.employees.push(newUser._id);
    } else if (role === "manager") {
      organisationRecord.managers.push(newUser._id);
    }
    await organisationRecord.save();
  }

  // ✅ Send login credentials via email
  const emailContent = userCreationTemplate(name, email, password, role);
  await sendEmail(email, "Welcome to Our Organization!", emailContent);

  res.status(201).json({ message: "User created successfully!" });
};

module.exports.getHrDashboardData = async (req, res) => {
  const [employees, managers, goals] = await Promise.all([
    Employee.countDocuments(),
    Manager.countDocuments(),
    Goal.find(),
  ]);

  const completedGoals = goals.filter((g) => g.status === "Completed").length;
  const pendingGoals = goals.length - completedGoals;

  // / ---------- Feedback Stats ----------
  const feedbackStatsAgg = await Feedback.aggregate([
    { $unwind: "$responses" },
    {
      $match: {
        $expr: {
          $regexMatch: {
            input: "$responses.answer",
            regex: "^[1-5]$",
          },
        },
      },
    },
    {
      $addFields: {
        numericAnswer: { $toInt: "$responses.answer" },
      },
    },
    {
      $group: {
        _id: null,
        positive: { $sum: { $cond: [{ $gte: ["$numericAnswer", 4] }, 1, 0] } },
        neutral: { $sum: { $cond: [{ $eq: ["$numericAnswer", 3] }, 1, 0] } },
        negative: { $sum: { $cond: [{ $lte: ["$numericAnswer", 2] }, 1, 0] } },
      },
    },
    {
      $project: {
        _id: 0,
        positive: 1,
        neutral: 1,
        negative: 1,
        total: { $add: ["$positive", "$neutral", "$negative"] },
      },
    },
  ]);

  const feedbackStats = feedbackStatsAgg[0] || {
    positive: 0,
    neutral: 0,
    negative: 0,
    total: 0,
  };

  // ---------- Feedback Score per User ----------
  const feedbackScores = await Feedback.aggregate([
    { $unwind: "$responses" },
    {
      $match: {
        $expr: {
          $regexMatch: {
            input: "$responses.answer",
            regex: "^[1-5]$",
          },
        },
      },
    },
    {
      $group: {
        _id: "$receiverId",
        receiverModel: { $first: "$receiverModel" },
        totalScore: { $sum: { $toInt: "$responses.answer" } },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        receiverId: "$_id",
        receiverModel: 1,
        avgFeedbackScore: { $divide: ["$totalScore", "$count"] },
        _id: 0,
      },
    },
  ]);

  // ---------- Goal Score per User ----------
  const goalMap = {};
  for (let goal of goals) {
    if (goal.status === "Completed") {
      const id = goal.employeeId.toString();
      goalMap[id] = (goalMap[id] || 0) + 1;
    }
  }

  // ---------- Merge Both Scores ----------
  const allScores = feedbackScores.map((f) => {
    const id = f.receiverId.toString();
    const goalScore = goalMap[id] || 0;

    // Normalized score: feedback out of 5, goalScore we keep raw (can normalize if needed)
    const combinedScore = f.avgFeedbackScore * 0.6 + goalScore * 0.4;

    return {
      receiverId: f.receiverId,
      receiverModel: f.receiverModel,
      avgFeedbackScore: f.avgFeedbackScore,
      goalScore,
      combinedScore,
    };
  });

  allScores.sort((a, b) => b.combinedScore - a.combinedScore);
  const top = allScores[0];

  let topPerformer = null;

  if (top) {
    const Model = top.receiverModel === "Employee" ? Employee : Manager;

    const user = await Model.findById(top.receiverId).select("name");
    topPerformer = {
      name: user?.name || "Unknown",
      avgFeedbackScore: top.avgFeedbackScore.toFixed(2),
      goalScore: top.goalScore,
      combinedScore: top.combinedScore.toFixed(2),
    };
  }

  // ---------- AI Summary ----------
  const prompt = `
HR Dashboard Summary:
- Employees: ${employees}, Managers: ${managers}
- Goals: ${
    goals.length
  } (Completed: ${completedGoals}, Pending: ${pendingGoals})
- Feedbacks: Total ${feedbackStats.total}, Positive: ${
    feedbackStats.positive
  }, Neutral: ${feedbackStats.neutral}, Negative: ${feedbackStats.negative}
- Top Performer: ${topPerformer?.name || "N/A"} (Avg Feedback: ${
    topPerformer?.avgFeedbackScore || "N/A"
  }, Goals Completed: ${topPerformer?.goalScore || 0})

Write 2–3 simple sentences summarizing the current employee performance based on goals and feedback.
Then, write one personalized appreciation message for the top performer (${
    topPerformer?.name || "N/A"
  }) based on both their high feedback and goal completion.
Finally, give one improvement suggestion for the team to work on next month.
`;

  const aiInsights = await analyzePerformance(prompt);

  res.json({
    success: true,
    data: {
      totalEmployees: employees,
      totalManagers: managers,
      goalStats: {
        total: goals.length,
        completed: completedGoals,
        pending: pendingGoals,
      },
      feedbackStats,
      topPerformer,
    },
    aiInsights,
  });
};

module.exports.getEmployeeList = async (req, res) => {
  const employees = await Employee.find(
    { organisationId: req.user.organisationId },
    { password: 0 } // exclude password field
  ).sort({ createdAt: -1 });

  res.status(200).json({ employees });
};

module.exports.getManagerList = async (req, res) => {
  const managers = await Manager.find(
    { organisationId: req.user.organisationId },
    { password: 0 }
  ).sort({ createdAt: -1 });

  res.status(200).json({ managers });
};

module.exports.toggleAutoFeedback = async (req, res) => {
  const { userId } = req.params;
  const { enable } = req.body;

  if (req.user.role !== "hr") {
    return res.status(403).json({
      success: false,
      message: "Only HR can toggle auto feedback.",
    });
  }

  // Try to find user in Employee first
  let user = await Employee.findById(userId);
  let model = "Employee";

  if (!user) {
    user = await Manager.findById(userId);
    model = "Manager";
  }

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  user.autoTriggerFeedback = enable;
  user.autoTriggerDate = enable ? new Date() : null;

  await user.save();

  res.json({
    success: true,
    message: `Auto feedback ${enable ? "enabled" : "disabled"} successfully.`,
    user: {
      _id: user._id,
      name: user.name,
      role: model,
      autoTriggerFeedback: user.autoTriggerFeedback,
      autoTriggerDate: user.autoTriggerDate,
    },
  });
};
