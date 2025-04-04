const jwt = require("jsonwebtoken");
const Session = require("../models/session");
const Manager = require("../models/manager");
const Employee = require("../models/employee");
const HR = require("../models/hr");

const authenticate = async (req, res, next) => {
  try {
    let token = req.cookies?.token || req.header("Authorization");

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // ✅ Handle "Bearer " prefix in Authorization header
    if (token.startsWith("Bearer ")) {
      token = token.slice(7);
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // ✅ Check if session exists in DB
    const session = await Session.findOne({ userId: decoded.id, token });
    if (!session) {
      return res
        .status(401)
        .json({ message: "Session expired, please log in again" });
    }

    // ✅ Check user in all models
    let user =
      (await Manager.findById(decoded.id).select("-password")) ||
      (await Employee.findById(decoded.id).select("-password")) ||
      (await HR.findById(decoded.id).select("-password"));

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth Error:", error.message);
    return res.status(401).json({ message: "Authentication failed" });
  }
};

module.exports = authenticate;
