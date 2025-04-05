import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ProtectedAuth from "./components/ProtectedAuth";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import EmployeeLayout from "./layouts/EmployeeLayout";
import HRLayout from "./layouts/HRLayout";
import ManagerLayout from "./layouts/ManagerLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyOtp from "./pages/VerifyOTP";
import EmployeeDashboard from "./pages/employee/employeeDashboard";
import Employee from "./pages/hr/Employee";
import HRDashboard from "./pages/hr/HRDashboard";
import Manager from "./pages/hr/Manager";
import ManagerDashboard from "./pages/manager/managerDashboard";
import NotFound from "./components/NotFound";
import EmployeeDetail from "./pages/hr/EmployeeDetail";
import ManagerDetail from "./pages/hr/ManagerDetail";
import FeedbackRequests from "./pages/employee/FeedbackRequests";
import ManagerFeedbackRequests from "./pages/manager/ManagerFeedBackReq";

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
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["manager"]} />}>
            <Route path="/managerDashboard/*" element={<ManagerLayout />}>
              <Route index element={<ManagerDashboard />} />
              <Route path="Feedbacks" element={<ManagerFeedbackRequests />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["employee"]} />}>
            <Route path="/employeeDashboard/*" element={<EmployeeLayout />}>
              <Route index element={<EmployeeDashboard />} />
              <Route path="Feedbacks" element={<FeedbackRequests />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
