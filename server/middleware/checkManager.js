const CheckManager = (req, res, next) => {
  if (req.user.role !== "manager") {
    return res.status(403).json({ error: "Access Denied: Managers only!" });
  }
  next();
};

module.exports = CheckManager;
