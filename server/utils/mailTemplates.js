module.exports.generateOtpEmail = (otp) => {
  return `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border-radius: 10px; background: white; text-align: center; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); border: 1px solid #ddd;">
        <h2 style="color: #005bb5;">🔐 Your OTP Code</h2>
        <p style="color: #333; font-size: 16px;">Use the following OTP to complete your verification. This OTP is valid for only <strong>5 minutes</strong>.</p>
        <div style="font-size: 22px; font-weight: bold; padding: 12px 20px; background: linear-gradient(to right, #00a3e0, #0073e6); color: white; display: inline-block; border-radius: 5px; letter-spacing: 2px;">
          ${otp}
        </div>
        <p style="margin-top: 20px; font-size: 14px; color: #666;">If you did not request this, please ignore this email.</p>
        <p style="font-size: 12px; color: #888;">© 2025 FeedX. All rights reserved.</p>
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
