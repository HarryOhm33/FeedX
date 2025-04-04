const mongoose = require("mongoose");

const GoalSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Employee",
  },
  managerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Manager",
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  deadline: {
    // ✅ Changed from dueDate → deadline
    type: Date,
    required: true,
  },
  status: {
    // ✅ Added "Pending Approval" to match the controller
    type: String,
    enum: ["Pending", "Pending Approval", "Completed"],
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Goal", GoalSchema);
