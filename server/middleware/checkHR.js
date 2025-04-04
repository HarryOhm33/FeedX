const checkHR = (req, res, next) => {
  if (req.user.role !== "hr") {
    return res.status(403).json({ error: "Access Denied: HRs only!" });
  }
  next();
};

module.exports = checkHR;
