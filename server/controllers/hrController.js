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
  const employees = await Employee.countDocuments();
  const managers = await Manager.countDocuments();
  const goals = await Goal.find();
  const feedbacks = await Feedback.find();

  const employeeGoalStats = await Goal.aggregate([
    {
      $group: {
        _id: "$employeeId",
        completed: {
          $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] },
        },
      },
    },
    { $sort: { completed: -1 } },
    { $limit: 1 },
    {
      $lookup: {
        from: "employees",
        localField: "_id",
        foreignField: "_id",
        as: "employee",
      },
    },
    {
      $unwind: {
        path: "$employee",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        employeeId: "$_id",
        name: { $ifNull: ["$employee.name", "Unknown"] },
        completed: 1,
      },
    },
  ]);

  const topPerformer = employeeGoalStats.length ? employeeGoalStats[0] : null;

  const completedGoals = goals.filter((g) => g.status === "Completed").length;
  const pendingGoals = goals.filter((g) => g.status !== "Completed").length;

  const data = {
    totalEmployees: employees,
    totalManagers: managers,
    goalStats: {
      total: goals.length,
      completed: completedGoals,
      pending: pendingGoals,
    },
    feedbackStats: {
      total: feedbacks.length,
      positive: feedbacks.filter((f) => f.rating >= 4).length,
      neutral: feedbacks.filter((f) => f.rating === 3).length,
      negative: feedbacks.filter((f) => f.rating <= 2).length,
    },
    topPerformer,
  };

  const prompt = `
You are an AI assisting HR to assess company-wide performance. Here’s the summary:

- Total Employees: ${employees}
- Total Managers: ${managers}
- Goals: ${
    goals.length
  } (Completed: ${completedGoals}, Pending: ${pendingGoals})
- Feedbacks: ${feedbacks.length} (Positive: ${
    data.feedbackStats.positive
  }, Neutral: ${data.feedbackStats.neutral}, Negative: ${
    data.feedbackStats.negative
  })
- Top Performer: ${
    topPerformer
      ? `${topPerformer.name} (${topPerformer.completed} goals completed)`
      : "No data"
  }

Give a short, sharp insight (max 3 sentences, 30 words) with trends + advice for HR to improve performance tracking and engagement.
`;

  const aiInsights = await analyzePerformance(prompt);

  res.json({ data, aiInsights });
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
