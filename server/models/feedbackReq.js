const mongoose = require("mongoose");
const Employee = require("./employee");
const Manager = require("./manager");

const feedbackRequestSchema = new mongoose.Schema({
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  targetModel: {
    type: String,
    enum: ["Employee", "Manager"],
  },
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HR",
    required: true,
  },
  sessionName: {
    type: String,
    required: true,
  },
  leftResponders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "responderModel",
    },
  ],
  respondedBy: [
    {
      responderId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "responderModel",
        required: true,
      },
      respondedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  responderModel: {
    type: String,
    enum: ["Employee", "Manager"],
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
});

// Auto-assign targetModel
feedbackRequestSchema.pre("save", async function (next) {
  const employeeExists = await Employee.exists({ _id: this.targetId });
  const managerExists = await Manager.exists({ _id: this.targetId });

  if (employeeExists) this.targetModel = "Employee";
  else if (managerExists) this.targetModel = "Manager";
  else
    return next(new Error("Invalid targetId: No Employee or Manager found."));

  next();
});

module.exports = mongoose.model("FeedbackRequest", feedbackRequestSchema);
