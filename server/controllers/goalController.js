const Goal = require("../models/goal");

/**
 * Manager assigns a goal to an employee.
 */
module.exports.createGoal = async (req, res) => {
  const { title, description, deadline, employeeId } = req.body;

  if (req.user.role !== "manager") {
    return res.status(403).json({ error: "Only managers can set goals." });
  }

  const newGoal = new Goal({
    employeeId,
    managerId: req.user._id,
    title,
    description,
    deadline,
  });

  await newGoal.save();
  res
    .status(201)
    .json({ message: "Goal assigned successfully", goal: newGoal });
};

/**
 * Employee fetches their assigned goals.
 */
module.exports.getEmployeeGoals = async (req, res) => {
  if (req.user.role !== "employee") {
    return res
      .status(403)
      .json({ error: "Only employees can view their goals." });
  }

  const goals = await Goal.find({ employeeId: req.user._id })
    .populate("employeeId", "name ")
    .populate("managerId", "name ");
  res.json({ goals });
};

/**
 * Manager fetches all goals they have assigned.
 */
module.exports.getManagerGoals = async (req, res) => {
  if (req.user.role !== "manager") {
    return res
      .status(403)
      .json({ error: "Only managers can view assigned goals." });
  }

  const goals = await Goal.find({ managerId: req.user._id }).populate(
    "employeeId",
    "name "
  );

  res.json({ goals });
};

/**
 * Manager fetches goals assigned to a specific employee.
 */
module.exports.getEmployeeGoalsForManager = async (req, res) => {
  const { employeeId } = req.params;

  if (req.user.role !== "manager") {
    return res
      .status(403)
      .json({ error: "Only managers can fetch employee goals." });
  }

  const goals = await Goal.find({ managerId: req.user._id, employeeId });

  res.json({ goals });
};

/**
 * Employee requests goal completion.
 */
module.exports.requestGoalCompletion = async (req, res) => {
  const { goalId } = req.params;

  const goal = await Goal.findById(goalId);
  if (!goal) {
    return res.status(404).json({ error: "Goal not found." });
  }

  if (goal.employeeId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ error: "Unauthorized request." });
  }

  goal.status = "Pending Approval";
  await goal.save();

  res.json({ message: "Goal completion request sent.", goal });
};

/**
 * Manager approves goal completion.
 */
module.exports.approveGoalCompletion = async (req, res) => {
  const { goalId } = req.params;

  if (req.user.role !== "manager") {
    return res.status(403).json({ error: "Only managers can apporove goals" });
  }

  const goal = await Goal.findById(goalId);
  if (!goal) {
    return res.status(404).json({ error: "Goal not found." });
  }

  if (goal.managerId.toString() !== req.user._id.toString()) {
    return res
      .status(403)
      .json({ error: "Only assigned managers can approve." });
  }

  if (goal.status !== "Pending Approval") {
    return res.status(400).json({ error: "Goal is not pending approval." });
  }

  goal.status = "Completed";
  await goal.save();

  res.json({ message: "Goal marked as completed.", goal });
};

module.exports.getEmployeeGoalAnalytics = async (req, res) => {
  const { employeeId } = req.params;

  if (req.user.role !== "manager") {
    return res.status(403).json({
      error: "Only managers can view employee performance analytics.",
    });
  }

  const goals = await Goal.find({ employeeId });

  if (goals.length === 0) {
    return res.json({
      message: "No goals found for this employee.",
      analytics: {},
    });
  }

  const totalGoals = goals.length;
  const pendingGoals = goals.filter((goal) => goal.status === "Pending").length;
  const pendingApproval = goals.filter(
    (goal) => goal.status === "Pending Approval"
  ).length;
  const completedGoals = goals.filter(
    (goal) => goal.status === "Completed"
  ).length;
  const completionRate = ((completedGoals / totalGoals) * 100).toFixed(2) + "%";

  const analytics = {
    totalGoals,
    pendingGoals,
    pendingApproval,
    completedGoals,
    completionRate,
  };

  res.json({ message: "Employee goal analytics retrieved.", analytics });
};
