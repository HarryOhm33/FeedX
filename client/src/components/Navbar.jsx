import {
  FileText,
  Home,
  LogOut,
  Menu,
  MessageSquare,
  X,
  FileQuestion,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { useAuth } from "../context/AuthContext";
import Button from "../pages/homecomponent/Button";

const Navbar = () => {
  const { user, logout, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    setIsLoggingOut(false);
  };

  return (
    <div className="fixed top-0 w-full z-50">
      {/* Navbar */}
      <nav className="flex justify-between items-center py-4 px-6 lg:px-12 bg-white shadow-lg">
        {/* Logo */}
        <Link to="/" className="flex items-center cursor-pointer">
          <img src={Logo} alt="FeedX Logo" className="w-30" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex space-x-10 items-center">
          <NavLink to="/" label="Home" icon={<Home />} />
          <NavLink to="/docs" label="Docs" icon={<FileText />} />
          <NavLink to="/whyfeedx" label="Why FeedX" icon={<FileQuestion />} />
        </div>

        {/* Desktop Auth Section */}
        <div className="hidden lg:flex space-x-4 items-center">
          {loading ? (
            <div className="text-gray-500 px-4 animate-pulse">
              Authenticating...
            </div>
          ) : user ? (
            <>
              <Button
                onClick={() => navigate(`/${user.role}Dashboard`)}
                className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-semibold px-5 py-2 rounded-lg shadow-md transition-all duration-300"
              >
                {capitalize(user.role)} Dashboard
              </Button>
              <Button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2 rounded-lg shadow-md transition-all duration-300 disabled:opacity-70"
              >
                <LogOut className="w-5 h-5 mr-2 inline" />
                {isLoggingOut ? "Logging out..." : "Logout"}
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => navigate("/login")}
                className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-semibold px-5 py-2 rounded-lg shadow-md transition-all duration-300"
              >
                Login
              </Button>
              <Button
                onClick={() => navigate("/signup")}
                className="bg-gradient-to-r from-orange-400 via-yellow-300 to-green-400 text-white font-semibold px-5 py-2 rounded-lg shadow-md transition-all duration-300"
              >
                Signup
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="focus:outline-none p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-blue-600" />
            ) : (
              <Menu className="w-6 h-6 text-blue-600" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        ref={menuRef}
        className={`fixed top-20 right-6 w-72 max-w-xs transition-all duration-300 ease-in-out ${
          isMenuOpen
            ? "translate-x-0 opacity-100 pointer-events-auto"
            : "translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        {/* Menu Content */}
        <div className="bg-white/95 shadow-2xl rounded-xl p-6 border border-gray-100/50">
          <div className="space-y-4">
            <NavLink to="/" label="Home" icon={<Home />} mobile />
            <NavLink to="/blog" label="Blog" icon={<FileText />} mobile />
            <NavLink
              to="/feedback"
              label="Feedback"
              icon={<MessageSquare />}
              mobile
            />

            <div className="pt-4 border-t border-gray-200/50">
              {loading ? (
                <div className="text-center text-gray-600 py-2 animate-pulse">
                  Authenticating...
                </div>
              ) : user ? (
                <>
                  <MobileButton
                    onClick={() => {
                      navigate(`/${user.role}Dashboard`);
                      setIsMenuOpen(false);
                    }}
                    className="bg-blue-100/80 text-blue-700 hover:bg-blue-200/80"
                  >
                    {capitalize(user.role)} Dashboard
                  </MobileButton>
                  <MobileButton
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="bg-red-100/80 text-red-700 hover:bg-red-200/80 disabled:opacity-70"
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </MobileButton>
                </>
              ) : (
                <>
                  <MobileButton
                    onClick={() => {
                      navigate("/login");
                      setIsMenuOpen(false);
                    }}
                    className="bg-teal-100/80 text-teal-700 hover:bg-teal-200/80"
                  >
                    Login
                  </MobileButton>
                  <MobileButton
                    onClick={() => {
                      navigate("/signup");
                      setIsMenuOpen(false);
                    }}
                    className="bg-green-100/80 text-green-700 hover:bg-green-200/80"
                  >
                    Sign Up
                  </MobileButton>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Components
const NavLink = ({ to, label, icon, mobile = false }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center space-x-3 ${
        mobile ? "p-3 rounded-lg" : "px-4 py-2"
      } ${
        isActive
          ? "text-blue-600 bg-blue-50/50 font-semibold"
          : "text-gray-700 hover:bg-gray-100/50"
      } transition-all duration-200 rounded-lg`}
    >
      {icon && React.cloneElement(icon, { className: "w-5 h-5" })}
      <span>{label}</span>
    </Link>
  );
};

const MobileButton = ({ children, className, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 font-medium ${className}`}
  >
    {children}
  </button>
);

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export default Navbar;
