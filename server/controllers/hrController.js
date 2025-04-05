const bcrypt = require("bcryptjs");
const Organisation = require("../models/organisation");
const { userCreationTemplate } = require("../utils/mailTemplates");
const sendEmail = require("../utils/sendEmail");
const Manager = require("../models/manager");
const Employee = require("../models/employee");
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

  // Check if the email is already registered
  const existingUser =
    (await Manager.findOne({ email })) || (await Employee.findOne({ email }));

  if (existingUser) {
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
        preserveNullAndEmptyArrays: true, // Keep document if employee not found
      },
    },
    {
      $project: {
        employeeId: "$_id",
        name: { $ifNull: ["$employee.name", "Unknown"] }, // Fallback to "Unknown"
        completed: 1,
      },
    },
  ]);

  const topPerformer = employeeGoalStats.length ? employeeGoalStats[0] : null;

  const data = {
    totalEmployees: employees,
    totalManagers: managers,
    goalStats: {
      total: goals.length,
      completed: goals.filter((g) => g.status === "Completed").length,
      pending: goals.filter((g) => g.status !== "Completed").length,
    },
    feedbackStats: {
      positive: feedbacks.filter((f) => f.rating >= 4).length,
      neutral: feedbacks.filter((f) => f.rating === 3).length,
      negative: feedbacks.filter((f) => f.rating <= 2).length,
    },
    topPerformer: employeeGoalStats.length ? employeeGoalStats[0] : null,
  };

  const aiInsights = await analyzePerformance(data);

  res.json({ data, aiInsights });
};

module.exports.getEmployeeList = async (req, res) => {
  try {
    const employees = await Employee.find(
      { organisationId: req.user.organisationId },
      { _id: 1, name: 1, email: 1, role: 1 }
    ).sort({ createdAt: -1 });

    res.status(200).json({ employees });
  } catch (err) {
    console.error("Error fetching employee list:", err);
    res.status(500).json({ message: "Server error while fetching employees" });
  }
};

module.exports.getManagerList = async (req, res) => {
  try {
    const managers = await Manager.find(
      { organisationId: req.user.organisationId },
      { _id: 1, name: 1, email: 1, role: 1 }
    ).sort({ createdAt: -1 });

    res.status(200).json({ managers });
  } catch (err) {
    console.error("Error fetching manager list:", err);
    res.status(500).json({ message: "Server error while fetching managers" });
  }
};


