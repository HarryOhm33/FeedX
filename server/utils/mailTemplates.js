module.exports.generateOtpEmail = (otp) => {
  return `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 550px; margin: auto; padding: 30px; border-radius: 12px; background: #ffffff; text-align: center; border: 3px solid #00bfff; box-shadow: 0 10px 25px rgba(0, 191, 255, 0.3);">
  
        <!-- Gradient OTP Heading with Lock Icon -->
        <div style="margin-bottom: 25px;">
          <h1 style="
  font-size: 26px; 
  font-weight: 700; 
  margin: 0;
  background: linear-gradient(90deg, #00f0ff, #007bff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
">
  🔒 Your OTP Code
</h1>

        </div>
  
        <!-- Message -->
        <p style="color: #444; font-size: 16px; margin-bottom: 20px;">
          Use the following OTP to complete your login. This OTP will expire in <strong>5 minutes</strong>.
        </p>
  
        <!-- OTP Code Display (No background now) -->
        <div style="margin: 25px 0;">
          <span style="
            font-size: 36px;
            font-weight: bold;
            letter-spacing: 5px;
            background: linear-gradient(to right, #00e0ff, #007bff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            display: inline-block;
          ">
            ${otp}
          </span>
        </div>
  
        <!-- Footer -->
        <p style="margin-top: 30px; font-size: 14px; color: #999;">
          If you didn’t request this code, you can safely ignore this email.
        </p>
  
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #000000;">
          <p style="font-size: 12px; color: #aaa;">© 2025 FeedX. All rights reserved.</p>
        </div>
      </div>
    `;
};

module.exports.userCreationTemplate = (name, email, password, role) => {
  return `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Welcome to FeedX</title>
          <style>
              body {
                  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                  background-color: #ffffff;
                  margin: 0;
                  padding: 0;
                  color: #333333;
              }
              .container {
                  max-width: 700px;
                  margin: 40px auto;
                  background: #ffffff;
                  border-radius: 16px;
                  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
                  overflow: hidden;
              }
              .header {
                  background: linear-gradient(135deg, #0073e6, #00a3e0);
                  padding: 40px 25px;
                  text-align: center;
              }
              .logo {
                  font-size: 36px;
                  font-weight: 800;
                  color: white;
                  margin-bottom: 8px;
              }
              .logo-accent {
                  color: #ffcc00;
              }
              .welcome-text {
                  color: #f5faff;
                  font-size: 18px;
                  margin-top: 5px;
              }
              .content {
                  padding: 40px 40px;
                  font-size: 16px;
                  color: #4a4a4a;
                  line-height: 1.8;
              }
              .greeting {
                  font-size: 24px;
                  font-weight: 700;
                  color: #222;
                  margin-bottom: 20px;
              }
              .credentials-box {
                  margin: 30px 0;
              }
              .credentials-title {
                  font-weight: 700;
                  font-size: 18px;
                  margin-bottom: 16px;
                  color: #0073e6;
              }
              .credential-item {
                  margin: 10px 0;
                  font-size: 16px;
              }
              .role-badge {
                  display: inline-block;
                  background: linear-gradient(135deg, #0073e6, #00a3e0);
                  color: white;
                  padding: 10px 24px;
                  border-radius: 30px;
                  font-size: 16px;
                  font-weight: 600;
                  margin: 20px 0;
                  box-shadow: 0 6px 16px rgba(0, 115, 230, 0.3);
              }
              .login-button {
                  display: block;
                  width: max-content;
                  margin: 40px auto 20px;
                  padding: 14px 28px;
                  text-align: center;
                  background: linear-gradient(135deg, #0073e6, #00a3e0);
                  color: white;
                  text-decoration: none;
                  font-size: 18px;
                  font-weight: 600;
                  border-radius: 10px;
                  transition: all 0.3s ease;
                  box-shadow: 0 6px 16px rgba(0, 115, 230, 0.25);
              }
              .login-button:hover {
                  transform: scale(1.03);
              }
              .support-text {
                  text-align: center;
                  margin-top: 30px;
                  color: #666666;
                  font-size: 14px;
              }
              .footer {
                  text-align: center;
                  font-size: 13px;
                  color: #000000;
                  padding: 18px;
                  background-color: #ffffff;
                  border-top: 1px solid #eaeaea;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <div class="logo">Feed<span class="logo-accent">X</span></div>
                  <div class="welcome-text">Welcome to the future of feedback!</div>
              </div>
              <div class="content">
                  <div class="greeting">Hi ${name},</div>
                  <p>We're thrilled to have you on board at <strong>FeedX</strong>. Here's your account information to get started:</p>
                  
                  <div class="credentials-box">
                      <div class="credentials-title">Your Login Credentials</div>
                      <div class="credential-item"><strong>Email:</strong> ${email}</div>
                      <div class="credential-item"><strong>Password:</strong> ${password}</div>
                  </div>
  
                  <div style="text-align: center;">
                      <div class="role-badge">Role: ${
                        role.charAt(0).toUpperCase() + role.slice(1)
                      }</div>
                  </div>
  
                  <p style="text-align:center;">Click below to log in and explore your dashboard:</p>
                  <a class="login-button" href="http://yourdomain.com/login">Go to Dashboard</a>
  
                  <p class="support-text">Need help? Our team is here for you anytime.</p>
              </div>
              <div class="footer">
                  © 2025 FeedX. All rights reserved.
              </div>
          </div>
      </body>
      </html>
    `;
};

module.exports.pendingGoalTemplate = (name, goalTitle) => {
  return {
    subject: "⏰ Pending Goal Reminder",
    html: `
        <div style="font-family: 'Segoe UI', sans-serif; padding: 20px; background-color: #f0fdfa; color: #064e3b;">
          <h2 style="color: #0d9488;">Reminder: Pending Goal</h2>
          <p>Hi ${name},</p>
          <p>You have a pending goal titled <strong>"${goalTitle}"</strong>.</p>
          <p>Please complete it as soon as possible.</p>
          <br/>
          <p>Stay productive!</p>
          <p><strong>FeedX</strong></p>
        </div>
      `,
  };
};

module.exports.pendingFeedbackTemplate = (name, sessionName) => {
  return {
    subject: "📝 Feedback Submission Pending",
    html: `
        <div style="font-family: 'Segoe UI', sans-serif; padding: 20px; background-color: #fefce8; color: #78350f;">
          <h2 style="color: #ca8a04;">Feedback Needed</h2>
          <p>Hi ${name},</p>
          <p>You still need to submit your feedback for the session <strong>${sessionName}</strong>.</p>
          <p>Please visit your dashboard and complete it soon.</p>
          <br/>
          <p>Thanks for your input!</p>
          <p><strong>FeedX</strong></p>
        </div>
      `,
  };
};
