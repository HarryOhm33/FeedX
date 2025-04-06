if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const connectDB = require("./config/db");
connectDB();
require("./utils/cronJobs");

const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

const port = process.env.PORT; // Default port agar PORT env mein nahi hai

const ExpressError = require("./utils/ExpressError");

// Routes
const authRoute = require("./routes/authRoute");
const hrRoute = require("./routes/hrRoute");
const feedbackRoute = require("./routes/feedbackRoute");
const goalRoute = require("./routes/goalRoute");
const managerRoute = require("./routes/managerRoute");
const employeeRoute = require("./routes/employeeRoute");
const notificationRoute = require("./routes/notificationRoute");
const selfAssessmentRoutes = require("./routes/selfAssessmentRoutes");

const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5174"], // Tumhare frontend origins
  credentials: true, // Cookies aur auth headers allow karne ke liye
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Sab methods allow
  allowedHeaders: ["Content-Type", "Authorization"], // Required headers
  exposedHeaders: ["Authorization"], // Frontend ko headers access karne ke liye
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options("*", cors(corsOptions));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser()); // Cookie handling ke liye

// Routes
app.use("/api/auth", authRoute);
app.use("/api/hr", hrRoute);
app.use("/api/feedback", feedbackRoute);
app.use("/api/goal", goalRoute);
app.use("/api/manager", managerRoute);
app.use("/api/employee", employeeRoute);
app.use("/api/notif", notificationRoute);
app.use("/api/self", selfAssessmentRoutes);

// 404 Handler
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!!"));
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  let { status = 500, message = "Something Went Wrong!!" } = err;
  res.status(status).json({ error: message });
});

app.listen(port, () => {
  console.log(`App Listening To Port ${port}`);
});
