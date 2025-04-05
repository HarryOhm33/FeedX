const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (email, subject, htmlContent) => {
  await transporter.sendMail({
    from: `"FeedX" <${process.env.EMAIL_USER}>`,
    to: email,
    subject,
    html: htmlContent, // Send HTML instead of plain text
  });
};

module.exports = sendEmail;
