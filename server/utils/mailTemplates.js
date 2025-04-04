module.exports.generateOtpEmail = (otp, name) => {
  return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>FeedX OTP Verification</title>
          <style>
              body {
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
                  font-family: 'Arial', sans-serif;
                  background-color: #f0f4f8;
                  line-height: 1.5;
              }
  
              .container {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  min-height: 100vh;
                  padding: 20px;
              }
  
              .email-content {
                  background: white;
                  padding: 40px;
                  border-radius: 20px;
                  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
                  border: 1px solid #00d2ff;
                  max-width: 550px;
                  width: 100%;
                  transition: transform 0.3s ease;
              }
  
              .email-content:hover {
                  transform: translateY(-5px);
              }
  
              h1 {
                  font-size: 32px;
                  text-align: center;
                  margin-bottom: 25px;
                  background: linear-gradient(to right, #00d2ff, #3a7bd5);
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                  font-weight: bold;
                  letter-spacing: 1px;
              }
  
              p {
                  color: #4a5568;
                  line-height: 1.7;
                  font-size: 16px;
                  margin: 15px 0;
              }
  
              .otp {
                  background: linear-gradient(135deg, #00d2ff, #3a7bd5);
                  color: white;
                  font-size: 24px;
                  font-weight: 600;
                  padding: 15px 20px;
                  border-radius: 10px;
                  text-align: center;
                  margin: 25px 0;
                  letter-spacing: 4px;
                  box-shadow: 0 4px 15px rgba(0, 210, 255, 0.3);
                  transition: transform 0.2s ease, box-shadow 0.2s ease;
              }
  
              .otp:hover {
                  transform: scale(1.05);
                  box-shadow: 0 6px 20px rgba(0, 210, 255, 0.4);
              }
  
              .highlight {
                  color: #3a7bd5;
                  font-weight: 600;
              }
  
              .footer {
                  text-align: center;
                  margin-top: 30px;
                  font-size: 13px;
                  color: #a0aec0;
                  border-top: 1px solid #e2e8f0;
                  padding-top: 15px;
              }
  
              @media (max-width: 600px) {
                  .email-content {
                      padding: 25px;
                      margin: 10px;
                  }
                  h1 {
                      font-size: 28px;
                  }
                  .otp {
                      font-size: 20px;
                      padding: 12px 15px;
                  }
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="email-content">
                  <h1>OTP Verification</h1>
                  <p>Hello <strong>${name}</strong>,</p>
                  <p>Your one-time password (OTP) for verifying your <span class="highlight">FeedX</span> account is ready. Use it within <span class="highlight">5 minutes</span> to complete the process:</p>
                  <div class="otp">${otp}</div>
                  <p>If you didn’t request this code, please ignore this email or contact our support team.</p>
                  <div class="footer">© 2025 FeedX. All rights reserved.</div>
              </div>
          </div>
      </body>
      </html>
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
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                background: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
            }
            .header {
                background: linear-gradient(to right, #0099cc, #005bb5);
                color: white;
                padding: 15px;
                text-align: center;
                font-size: 22px;
                font-weight: bold;
                border-radius: 8px 8px 0 0;
            }
            .content {
                padding: 20px;
                font-size: 16px;
                color: #333;
            }
            .credentials {
                background-color: #f9f9f9;
                padding: 15px;
                border-radius: 5px;
                margin-top: 15px;
                font-size: 16px;
                line-height: 1.5;
            }
            .credentials p {
                margin: 5px 0;
            }
            .role-label {
                background: linear-gradient(to right, #00a3e0, #0073e6);
                color: white;
                padding: 10px;
                display: inline-block;
                border-radius: 5px;
                font-size: 16px;
                font-weight: bold;
                margin-top: 10px;
            }
            .button {
                display: block;
                width: 100%;
                max-width: 200px;
                margin: 20px auto;
                padding: 12px;
                text-align: center;
                background: linear-gradient(to right, #00a3e0, #0073e6);
                color: white;
                text-decoration: none;
                font-size: 18px;
                border-radius: 5px;
                transition: background 0.3s ease;
            }
            .button:hover {
                background: linear-gradient(to right, #0073e6, #005bb5);
            }
            .footer {
                text-align: center;
                font-size: 14px;
                color: #888;
                padding: 15px;
                margin-top: 10px;
                border-top: 1px solid #ddd;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">Welcome to <span style="color: #ffcc00;">FeedX</span>!</div>
            <div class="content">
                <p>Hello <strong>${name}</strong>,</p>
                <p>We are thrilled to have you on board at FeedX! Your account has been successfully created.</p>
                
                <div class="credentials">
                    <p><strong>Login Credentials:</strong></p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Password:</strong> ${password}</p>
                </div>
  
                <p class="role-label">Your Role: ${
                  role.charAt(0).toUpperCase() + role.slice(1)
                }</p>
  
                <p>You can log in using the button below:</p>
                <a class="button" href="http://yourdomain.com/login">Login Now</a>
  
                <p>If you have any issues, feel free to contact support.</p>
            </div>
            <div class="footer">
                © 2025 FeedX. All rights reserved.
            </div>
        </div>
    </body>
    </html>`;
};
