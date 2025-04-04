import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user && !allowedRoles.includes(user.role)) {
      const timer = setTimeout(() => {
        navigate(`/${user.role}Dashboard`); // ✅ Correct path
      }, 3000);

      return () => clearTimeout(timer); // ✅ Cleanup timeout on unmount
    }
  }, [loading, user, allowedRoles, navigate]);

  if (loading) return <p>Loading...</p>;

  // ✅ If user is not logged in, redirect to login instead of /unauthorized
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ✅ If user is logged in but lacks the required role, show a message before redirecting
  if (!allowedRoles.includes(user.role)) {
    return (
      <p style={{ textAlign: "center", fontSize: "18px", color: "red" }}>
        ❌ You are not authorized to view this page. Redirecting...
      </p>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
