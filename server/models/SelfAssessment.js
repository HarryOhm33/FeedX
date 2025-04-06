const mongoose = require("mongoose");
const Employee = require("./employee");
const Manager = require("./manager");

const selfAssessmentSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SelfAssessmentSession",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "userModel",
    },
    userModel: {
      type: String,
      required: true,
      enum: ["Employee", "Manager"],
    },
    responses: [
      {
        question: String,
        answer: String,
      },
    ],
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Auto-detect userModel
selfAssessmentSchema.pre("validate", async function (next) {
  if (!this.userModel) {
    const isEmployee = await Employee.exists({ _id: this.userId });
    const isManager = await Manager.exists({ _id: this.userId });

    if (isEmployee) this.userModel = "Employee";
    else if (isManager) this.userModel = "Manager";
    else
      return next(
        new Error("Invalid userId: no matching Employee or Manager.")
      );
  }

  next();
});

module.exports = mongoose.model("SelfAssessment", selfAssessmentSchema);
