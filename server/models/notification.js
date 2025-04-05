// models/Notification.js
const mongoose = require("mongoose");
const Employee = require("./employee");
const Manager = require("./manager");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "userModel",
    },
    userModel: {
      type: String,
      enum: ["Employee", "Manager"],
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Auto-detect userModel based on userId
notificationSchema.pre("validate", async function (next) {
  if (!this.userModel && this.userId) {
    const isEmployee = await Employee.exists({ _id: this.userId });
    const isManager = await Manager.exists({ _id: this.userId });

    if (isEmployee) this.userModel = "Employee";
    else if (isManager) this.userModel = "Manager";
    else
      return next(
        new Error("Invalid userId: Not found in Employee or Manager.")
      );
  }
  next();
});

module.exports = mongoose.model("Notification", notificationSchema);
