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
  const [email, setEmail] = useState(""); // Store email for OTP-related actions
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      const token = Cookies.get("markAuth");
      if (token) {
        axios
          .post(
            "https://feedx-y6pk.onrender.com/api/auth/verify-session",
            {},
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

  // Signup Function
  const signup = async ({ name, email, password, organisation }, isNewOrg) => {
    try {
      const signupData = {
        name,
        email,
        password,
        ...(isNewOrg ? { organisation } : { organisationId: organisation }),
      };

      const res = await axios.post(
        "https://feedx-y6pk.onrender.com/api/auth/signup",
        signupData,
        { withCredentials: true }
      );

      if (
        res.data.message === "OTP sent to email. Verify to complete signup."
      ) {
        setEmail(email); // Store email for OTP verification and resend
        toast.success(res.data.message);
        navigate("/verify-otp");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed ❌");
      throw error;
    }
  };

  // Verify OTP Function
  const verifyOtp = async (otp) => {
    try {
      const res = await axios.post(
        "https://feedx-y6pk.onrender.com/api/auth/verify-otp",
        { email, otp },
        { withCredentials: true }
      );

      toast.success(res.data.message);
      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "OTP verification failed ❌"
      );
      throw error;
    }
  };

  // Resend OTP Function
  const resendOtp = async () => {
    try {
      const res = await axios.post(
        "https://feedx-y6pk.onrender.com/api/auth/resend-otp",
        { email },
        { withCredentials: true }
      );
      toast.success(res.data.message || "OTP resent successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP ❌");
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post(
        "https://feedx-y6pk.onrender.com/api/auth/login",
        { email, password },
        { withCredentials: true }
      );

      const isSecure = window.location.protocol === "https:";
      Cookies.set("markAuth", res.data.token, {
        expires: 7,
        path: "/",
        secure: isSecure,
        sameSite: "strict",
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
      const token = Cookies.get("markAuth");
      await axios.post(
        "https://feedx-y6pk.onrender.com/api/auth/logout",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setUser(null);
      Cookies.remove("markAuth");
      toast.info("Logged out successfully! 👋");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed ❌");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signup,
        verifyOtp,
        resendOtp,
        login,
        logout,
        email,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
