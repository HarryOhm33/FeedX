import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedAuth = () => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  // ✅ If user is logged in, redirect to their dashboard instead of login/signup
  if (user) {
    return <Navigate to={`/${user.role}Dashboard`} replace />;
  }

  return <Outlet />;
};

export default ProtectedAuth;
