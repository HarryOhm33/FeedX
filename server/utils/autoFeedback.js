const cron = require("node-cron");
const Employee = require("../models/employee");
const Manager = require("../models/manager");
const FeedbackRequest = require("../models/feedbackReq");

// ⏰ Runs every minute for testing (change to '0 9 * * *' for 9 AM daily in production)
cron.schedule("0 9 * * *", async () => {
  const today = new Date();
  const tenDaysAgo = new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000);

  console.log("⏱️ Cron job started at:", today.toLocaleString());

  try {
    console.log("🔍 Checking eligible employees and managers...");

    const [eligibleEmployees, eligibleManagers] = await Promise.all([
      Employee.find({
        autoTriggerFeedback: true,
        autoTriggerDate: { $lte: tenDaysAgo },
      }),
      Manager.find({
        autoTriggerFeedback: true,
        autoTriggerDate: { $lte: tenDaysAgo },
      }),
    ]);

    const eligibleUsers = [...eligibleEmployees, ...eligibleManagers];

    if (eligibleUsers.length === 0) {
      console.log("✅ No eligible users for auto feedback today.");
      return;
    }

    console.log(
      `📋 Found ${eligibleUsers.length} eligible user(s) for feedback.`
    );

    for (const user of eligibleUsers) {
      const isEmployee = user instanceof Employee;
      const targetId = user._id;

      console.log(
        `🔎 Checking existing feedback for ${
          isEmployee ? "Employee" : "Manager"
        }: ${targetId}`
      );

      const existing = await FeedbackRequest.findOne({
        targetId,
        expiresAt: { $gte: new Date() },
      });

      if (existing) {
        console.log(`⚠️ Feedback already exists for ${targetId}, skipping.`);
        continue;
      }

      const employees = await Employee.find({ _id: { $ne: targetId } }, "_id");
      const managers = await Manager.find({ _id: { $ne: targetId } }, "_id");

      const responders = [...employees, ...managers];

      console.log(
        `✏️ Creating feedback request for ${targetId} with ${responders.length} responders.`
      );

      await FeedbackRequest.create({
        targetId,
        requestedBy: null, // system-triggered
        leftResponders: responders.map((r) => r._id),
        respondedBy: [],
        sessionName: `Auto Feedback - ${today.toLocaleDateString()}`,
      });

      // ✅ Update last auto trigger date
      if (isEmployee) {
        await Employee.findByIdAndUpdate(targetId, { autoTriggerDate: today });
      } else {
        await Manager.findByIdAndUpdate(targetId, { autoTriggerDate: today });
      }

      console.log(
        `✅ Auto feedback triggered for ${
          isEmployee ? "Employee" : "Manager"
        }: ${targetId}`
      );
    }
  } catch (err) {
    console.error("❌ Error in auto feedback cron job:", err);
  }
});
