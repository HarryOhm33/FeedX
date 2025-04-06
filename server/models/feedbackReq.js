const mongoose = require("mongoose");
const Employee = require("./employee");
const Manager = require("./manager");

const feedbackRequestSchema = new mongoose.Schema({
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "targetModel",
  },
  targetModel: {
    type: String,
    required: true,
    enum: ["Employee", "Manager"],
  },
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HR",
    default: null,
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
    required: true,
    enum: ["Employee", "Manager"],
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  },
});

// Auto-set `targetModel` and `responderModel`
feedbackRequestSchema.pre("validate", async function (next) {
  // Auto-detect targetModel
  if (!this.targetModel) {
    const employeeExists = await Employee.exists({ _id: this.targetId });
    const managerExists = await Manager.exists({ _id: this.targetId });

    if (employeeExists) this.targetModel = "Employee";
    else if (managerExists) this.targetModel = "Manager";
    else
      return next(new Error("Invalid targetId: No Employee or Manager found."));
  }

  // Auto-detect responderModel from first responder
  if (!this.responderModel && this.leftResponders.length > 0) {
    const firstResponder = this.leftResponders[0];
    const isEmployee = await Employee.exists({ _id: firstResponder });
    const isManager = await Manager.exists({ _id: firstResponder });

    if (isEmployee) this.responderModel = "Employee";
    else if (isManager) this.responderModel = "Manager";
    else
      return next(
        new Error("Invalid responderId: No Employee or Manager found.")
      );
  }

  next();
});

module.exports = mongoose.model("FeedbackRequest", feedbackRequestSchema);
