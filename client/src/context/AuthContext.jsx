import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState(""); // ✅ Store email for OTP verification
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      const token = Cookies.get("markAuth");
      if (token) {
        axios
          .post(
            "http://localhost:8001/api/auth/verify-session",
            {}, // POST requires a body, even if empty
            {
              headers: { Authorization: `Bearer ${token}` },
              withCredentials: true,
            }
          )
          .then((res) => {
            setUser(res.data.user);
            // toast.success(`Welcome back ${res.data.user.name}`);
          })
          .catch(() => {
            setUser(null);
            Cookies.remove("markAuth");
            toast.error("Session expired, please log in again. ❌");
            navigate("/login");
          })
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    }, 500);
  }, [navigate]);

  // ✅ Signup Function
  const signup = async ({ name, email, password, organisation }, isNewOrg) => {
    try {
      const signupData = {
        name,
        email,
        password,
        ...(isNewOrg ? { organisation } : { organisationId: organisation }), // ✅ Send either organisation name or organisationId
      };

      const res = await axios.post(
        "http://localhost:8001/api/auth/signup",
        signupData,
        {
          withCredentials: true,
        }
      );

      if (
        res.data.message === "OTP sent to email. Verify to complete signup."
      ) {
        setEmail(email); // ✅ Store email for OTP verification
        toast.success(res.data.message);
        navigate("/verify-otp"); // ✅ Redirect to OTP verification page
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed ❌");
      throw error;
    }
  };

  // ✅ Verify OTP Function
  const verifyOtp = async (otp) => {
    try {
      const res = await axios.post(
        "http://localhost:8001/api/auth/verify-otp",
        { email, otp },
        { withCredentials: true }
      );

      toast.success(res.data.message); // ✅ Shows "Signup successful. You can now log in."
      navigate("/login"); // ✅ Redirect to login after OTP verification
    } catch (error) {
      toast.error(
        error.response?.data?.message || "OTP verification failed ❌"
      );
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post(
        "http://localhost:8001/api/auth/login",
        { email, password },
        { withCredentials: true }
      );

      // Determine if we're in a secure (HTTPS) environment
      const isSecure = window.location.protocol === "https:";

      // Set the cookie with js-cookie, expiring in 7 days
      Cookies.set("markAuth", res.data.token, {
        expires: 7, // 7 days expiration
        path: "/", // Available across the entire site
        secure: isSecure, // Secure only for HTTPS, false for localhost (HTTP)
        sameSite: "strict", // Prevents CSRF
      });

      setUser(res.data.user);
      toast.success("Login successful! 🎉");

      if (res.data.user.role === "hr") {
        navigate("/hrDashboard");
      } else if (res.data.user.role === "manager") {
        navigate("/managerDashboard");
      } else {
        navigate("/employeeDashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed ❌");
      throw error;
    }
  };

  const logout = async () => {
    try {
      const token = Cookies.get("markAuth"); // ✅ Get token before sending request
      await axios.post(
        "http://localhost:8001/api/auth/logout",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setUser(null);
      Cookies.remove("markAuth"); // ✅ Remove token after logout
      toast.info("Logged out successfully! 👋");

      navigate("/login"); // ✅ Redirect to login explicitly
    } catch (error) {
      toast.error("Logout failed ❌");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signup, verifyOtp, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
