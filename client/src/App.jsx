import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import NotFound from "./components/NotFound";
import ProtectedAuth from "./components/ProtectedAuth";
import ProtectedRoute from "./components/ProtectedRoute";
import WhyFeedX from "./pages/WhyFeedX";
import { AuthProvider } from "./context/AuthContext";
import EmployeeLayout from "./layouts/EmployeeLayout";
import HRLayout from "./layouts/HRLayout";
import ManagerLayout from "./layouts/ManagerLayout";
import Techdocx from "./pages/Docs";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import FeedbackRequests from "./pages/employee/FeedbackRequests";
import GoalE from "./pages/employee/GoalE";
import Home from "./pages/Home";
import Employee from "./pages/hr/Employee";
import EmployeeDetail from "./pages/hr/EmployeeDetail";
import Feedback from "./pages/hr/FeedBack";
import HRDashboard from "./pages/hr/HRDashboard";
import Manager from "./pages/hr/Manager";
import ManagerDetail from "./pages/hr/ManagerDetail";
import Login from "./pages/Login";
import EmployeeDetailsM from "./pages/manager/EmployeeDetailsM";
import EmployeeM from "./pages/manager/EmployeeM";
import Goals from "./pages/manager/Goals";
import ManagerDashboard from "./pages/manager/managerDashboard";
import ManagerFeedbackRequests from "./pages/manager/ManagerFeedBackReq";
import ProfileSection from "./pages/ProfileSection";
import Signup from "./pages/Signup";
import VerifyOtp from "./pages/VerifyOTP";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />

        <Routes>
          <Route
            path="/"
            element={
              <>
                <Home />
                <Footer />
              </>
            }
          />

          <Route element={<ProtectedAuth />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["hr"]} />}>
            <Route path="/hrDashboard/*" element={<HRLayout />}>
              <Route index element={<HRDashboard />} />
              <Route path="Employees" element={<Employee />} />
              <Route path="employee/:id" element={<EmployeeDetail />} />
              <Route path="Managers" element={<Manager />} />
              <Route path="manager/:id" element={<ManagerDetail />} />
              <Route
                path="Feedback/:feedbackRequestId"
                element={<Feedback />}
              />
              <Route path="Profile" element={<ProfileSection />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["manager"]} />}>
            <Route path="/managerDashboard/*" element={<ManagerLayout />}>
              <Route index element={<ManagerDashboard />} />
              <Route path="Feedbacks" element={<ManagerFeedbackRequests />} />
              <Route path="Employees" element={<EmployeeM />} />
              <Route path="employees/:id" element={<EmployeeDetailsM />} />
              <Route path="Goals" element={<Goals />} />
              <Route path="Profile" element={<ProfileSection />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["employee"]} />}>
            <Route path="/employeeDashboard/*" element={<EmployeeLayout />}>
              <Route index element={<EmployeeDashboard />} />
              <Route path="Feedbacks" element={<FeedbackRequests />} />
              <Route path="Goals" element={<GoalE />} />
              <Route path="Profile" element={<ProfileSection />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Route>
          <Route path="/docs" element={<Techdocx />} />
          <Route path="/whyfeedx" element={<WhyFeedX />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
