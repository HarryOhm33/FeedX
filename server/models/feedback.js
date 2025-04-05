const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  feedbackRequestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FeedbackRequest",
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  receiverModel: {
    type: String,
    enum: ["Employee", "Manager"],
    required: true,
  },
  giverId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  giverModel: {
    type: String,
    enum: ["Employee", "Manager"],
    required: true,
  },
  responses: [
    {
      question: { type: String, required: true },
      answer: { type: String, required: true },
    },
  ],
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Feedback", feedbackSchema);
