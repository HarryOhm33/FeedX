const { v4: uuidv4 } = require("uuid"); // Import UUID
const bcrypt = require("../node_modules/bcryptjs/umd");
const jwt = require("jsonwebtoken");
const Session = require("../models/session");
const otpGenerator = require("otp-generator");
const sendEmail = require("../utils/sendEmail");
const OTP = require("../models/otp");
const { generateOtpEmail } = require("../utils/mailTemplates");
const Organisation = require("../models/organisation"); // Import the Organisation model
const Manager = require("../models/manager");
const Employee = require("../models/employee");
const HR = require("../models/hr");

module.exports.signup = async (req, res) => {
  const { name, email, password, organisation, organisationId } = req.body;

  // ✅ Check if user already exists
  const existingHR = await HR.findOne({ email });
  const existingEmployee = await Employee.findOne({ email });
  const existingManager = await Manager.findOne({ email });

  if (existingHR || existingEmployee || existingManager) {
    return res.status(400).json({ message: "Email already exists" });
  }

  // ✅ Generate OTP
  const otp = otpGenerator.generate(6, {
    digits: true,
    upperCaseAlphabets: false, // ❌ Disable uppercase letters
    lowerCaseAlphabets: false, // ❌ Disable lowercase letters
    specialChars: false, // ❌ Disable special characters
  });

  let finalOrganisationId, finalOrganisation;

  if (organisationId) {
    // ✅ If organisationId is provided, check if it exists
    const existingOrganisation = await Organisation.findOne({ organisationId });

    if (!existingOrganisation) {
      return res.status(400).json({ message: "Invalid organisationId" });
    }

    finalOrganisationId = organisationId; // ✅ Use the provided valid organisationId
    finalOrganisation = existingOrganisation.name;
  } else if (organisation) {
    // ✅ If only organisation name is provided, generate a new organisationId
    finalOrganisationId = uuidv4();
    finalOrganisation = organisation;
  } else {
    return res.status(400).json({
      message: "Either organisation name or organisationId must be provided",
    });
  }

  // ✅ Delete old OTP if exists
  await OTP.deleteOne({ email });

  // ✅ Send OTP via email
  const htmlContent = generateOtpEmail(otp);
  await sendEmail(email, "Verify Your Account", htmlContent);

  // ✅ Temporarily store user details (hash password)
  const hashedPassword = await bcrypt.hash(password, 10);
  await OTP.create({
    email,
    otp,
    name,
    password: hashedPassword,
    organisation: finalOrganisation,
    organisationId: finalOrganisationId, // ✅ Store the correct organisationId
  });

  res
    .status(200)
    .json({ message: "OTP sent to email. Verify to complete signup." });
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  // ✅ Search in all models
  let user =
    (await Manager.findOne({ email })) ||
    (await Employee.findOne({ email })) ||
    (await HR.findOne({ email }));

  if (!user) {
    return res.status(400).json({ message: "User not found, Sign Up First!!" });
  }

  if (!user.isVerified) {
    return res
      .status(403)
      .json({ message: "Please verify your account first." });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Incorrect password" });
  }

  // ✅ Generate JWT Token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  // ✅ Store session in MongoDB
  await Session.create({ userId: user._id, token });

  // ✅ Set token in HTTP-only and secure cookies
  res.cookie("token", token, {
    httpOnly: false, // ❌ NOT recommended for authentication tokens
    secure: process.env.NODE_ENV === "production", // ✅ Secure in production
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // ✅ Required for cross-origin
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // ✅ Send response with user details
  res.status(200).json({
    message: "Login successful",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      organisation: user.organisation,
      organisationId: user.organisationId,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    token,
  });
};

module.exports.logout = async (req, res) => {
  // ✅ Delete the session from MongoDB
  await Session.deleteOne({ userId: req.user.id });

  // ✅ Clear the authentication cookie
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({ message: "Logged out successfully" });
};

module.exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  // ✅ Find OTP record
  const storedOTP = await OTP.findOne({ email, otp });
  if (!storedOTP) {
    return res.status(400).json({ message: "Invalid OTP or expired" });
  }

  // ✅ Check if Organisation exists using the `organisationId` stored during signup
  let organisation = await Organisation.findOne({
    organisationId: storedOTP.organisationId,
  });

  // ✅ If Organisation does NOT exist, create a new one with the SAME `organisationId`
  if (!organisation) {
    organisation = await Organisation.create({
      name: storedOTP.organisation,
      organisationId: storedOTP.organisationId, // ✅ Use the same ID generated during signup
      hrs: [],
      managers: [],
      employees: [],
    });
  }

  // ✅ Create User with the SAME `organisationId`
  const newUser = await HR.create({
    name: storedOTP.name,
    email,
    password: storedOTP.password, // ✅ Already hashed
    organisation: storedOTP.organisation, // ✅ Assign organisation name
    organisationId: storedOTP.organisationId, // ✅ Store the same organisationId as in OTP
    isVerified: true,
  });

  // ✅ Add User to the correct role in Organisation
  if (newUser.role === "hr") {
    organisation.hrs.push(newUser._id);
  } else if (newUser.role === "manager") {
    organisation.managers.push(newUser._id);
  } else {
    organisation.employees.push(newUser._id);
  }

  await organisation.save(); // ✅ Save changes in Organisation

  // ✅ Delete OTP after successful verification
  await OTP.deleteOne({ email });

  res.status(200).json({ message: "Signup successful. You can now log in." });
};

module.exports.resendOTP = async (req, res) => {
  const { email } = req.body;

  const existingUser = await OTP.findOne({ email });
  if (!existingUser)
    return res.status(400).json({ message: "No pending verification found." });

  // ✅ Generate new OTP
  const otp = otpGenerator.generate(6, {
    digits: true,
    upperCaseAlphabets: false, // ❌ Disable uppercase letters
    lowerCaseAlphabets: false, // ❌ Disable lowercase letters
    specialChars: false, // ❌ Disable special characters
  });

  // ✅ Update OTP in DB
  await OTP.updateOne({ email }, { otp });

  // ✅ Send OTP via email
  const htmlContent = generateOtpEmail(otp);
  await sendEmail(email, "Resend OTP", htmlContent);

  res.status(200).json({ message: "New OTP sent successfully." });
};

exports.verifySession = async (req, res) => {
  const userId = req.user._id; // `req.user` is already attached by `authenticate.js`

  // Check if a session exists for the user
  const sessionExists = await Session.exists({ userId });

  if (!sessionExists) {
    return res.status(401).json({
      success: false,
      message: "Session not found or expired, Login Again",
    });
  }

  res.status(200).json({
    success: true,
    message: "Session is valid",
    user: req.user,
  });
};
