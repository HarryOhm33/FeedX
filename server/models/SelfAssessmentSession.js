const mongoose = require("mongoose");

const selfAssessmentSessionSchema = new mongoose.Schema(
  {
    sessionName: {
      type: String,
      required: true,
      unique: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HR",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "SelfAssessmentSession",
  selfAssessmentSessionSchema
);
