const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  name: { type: String, required: true }, // User's name
  password: { type: String, required: true }, // Hashed password
  role: {
    type: String,
    required: true,
    enum: ["employee", "hr", "manager"],
    default: "hr",
  }, // Role field
  organisation: { type: String, required: true }, // Organisation name
  organisationId: { type: String, required: true }, // Simple organisation ID as a string
  createdAt: { type: Date, default: Date.now },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 600 * 1000), // 10 min expiration
    index: { expires: 600 }, // TTL index for automatic deletion
  },
});

module.exports = mongoose.model("OTP", otpSchema);
