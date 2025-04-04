const mongoose = require("mongoose");

const organisationSchema = new mongoose.Schema(
  {
    organisationId: { type: String, unique: true, required: true }, // UUID
    name: { type: String, required: true },
    hrs: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // HRs
    managers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Managers
    employees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Employees
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

module.exports = mongoose.model("Organisation", organisationSchema);
