const mongoose = require("mongoose");

const managerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ["manager"],
      default: "manager",
    },
    organisation: { type: String, required: true },
    organisationId: { type: String, required: true },
    autoTriggerFeedback: { type: Boolean, default: false },
    autoTriggerDate: { type: Date, default: null }, // last trigger date
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Manager = mongoose.model("Manager", managerSchema);
module.exports = Manager;
