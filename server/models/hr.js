const mongoose = require("mongoose");

const hrSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ["hr"],
      default: "hr",
    },
    organisation: { type: String, required: true },
    organisationId: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const HR = mongoose.model("HR", hrSchema);
module.exports = HR;
