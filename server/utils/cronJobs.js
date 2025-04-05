const cron = require("node-cron");
const Employee = require("../models/employee");
const Manager = require("../models/manager");
const Goal = require("../models/goal");
const FeedbackRequest = require("../models/feedbackReq");
const Notification = require("../models/notification");
const sendEmail = require("../utils/sendEmail");
const {
  pendingGoalTemplate,
  pendingFeedbackTemplate,
} = require("../utils/mailTemplates");

// Runs every at 9:00 AM
cron.schedule("0 9 * * *", async () => {
  console.log("🔔 Running scheduled job to notify users...");

  try {
    // ✅ Notify pending goals
    const goals = await Goal.find({ status: "Pending" }).populate("employeeId");

    for (const goal of goals) {
      const user = goal.employeeId;
      if (!user || !user.email) continue;

      await Notification.create({
        userId: user._id,
        message: `You have a pending goal: "${goal.title}"`,
      });

      const { subject, html } = pendingGoalTemplate(user.name, goal.title);
      await sendEmail(user.email, subject, html);
    }

    // ✅ Notify feedback left responders
    const feedbacks = await FeedbackRequest.find();

    for (const request of feedbacks) {
      for (const responderId of request.leftResponders) {
        let responder =
          (await Employee.findById(responderId)) ||
          (await Manager.findById(responderId));

        if (!responder || !responder.email) continue;

        await Notification.create({
          userId: responder._id,
          message: `You have a pending feedback to submit for session "${request.sessionName}".`,
        });

        const { subject, html } = pendingFeedbackTemplate(
          responder.name,
          request.sessionName
        );
        await sendEmail(responder.email, subject, html);
      }
    }

    console.log("✅ Notifications and emails sent to left responders.");
  } catch (err) {
    console.error("❌ Cron job error:", err.message);
  }
});
