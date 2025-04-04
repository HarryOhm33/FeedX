const mongoose = require("mongoose");
const Employee = require("./employee");
const Manager = require("./manager");

const feedbackSchema = new mongoose.Schema({
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  receiverModel: {
    type: String,
    enum: ["Employee", "Manager"],
  },
  giverId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  giverModel: {
    type: String,
    enum: ["Employee", "Manager"],
  },
  comments: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  isAnonymous: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Automatically determine receiverModel before saving
feedbackSchema.pre("save", async function (next) {
  const receiverIsEmployee = await Employee.exists({ _id: this.receiverId });
  const receiverIsManager = await Manager.exists({ _id: this.receiverId });

  if (receiverIsEmployee) {
    this.receiverModel = "Employee";
  } else if (receiverIsManager) {
    this.receiverModel = "Manager";
  } else {
    return next(new Error("Invalid receiverId: No Employee or Manager found."));
  }

  const giverIsEmployee = await Employee.exists({ _id: this.giverId });
  const giverIsManager = await Manager.exists({ _id: this.giverId });

  if (giverIsEmployee) {
    this.giverModel = "Employee";
  } else if (giverIsManager) {
    this.giverModel = "Manager";
  } else {
    return next(new Error("Invalid giverId: No Employee or Manager found."));
  }

  next();
});

module.exports = mongoose.model("Feedback", feedbackSchema);
