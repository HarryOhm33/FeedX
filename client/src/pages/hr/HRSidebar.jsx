import React from "react";
import {
  FaArrowLeft,
  FaBars,
  FaTachometerAlt,
  FaUsers,
  FaUserTie,
} from "react-icons/fa";
import { NavLink, useLocation } from "react-router-dom";

const HRSidebar = ({ isExpanded, setIsExpanded }) => {
  const location = useLocation();
  const currentPath = location.pathname.toLowerCase(); // Normalize to lowercase for comparison

  // Check if the current path belongs to a specific section
  const isActiveRoute = (basePath) => {
    const normalizedBasePath = basePath.toLowerCase();

    // For dashboard, only active on exact match
    if (normalizedBasePath === "/hrdashboard") {
      return currentPath === "/hrdashboard";
    }

    // For employees section - handle both singular and plural forms
    if (normalizedBasePath === "/hrdashboard/employees") {
      return (
        currentPath.startsWith("/hrdashboard/employee") ||
        currentPath.startsWith("/hrdashboard/employees") ||
        currentPath.startsWith("/hrdashboard/feedback")
      );
    }

    // For managers section
    if (normalizedBasePath === "/hrdashboard/managers") {
      return (
        currentPath.startsWith("/hrdashboard/manager") ||
        currentPath.startsWith("/hrdashboard/managers")
      );
    }

    // Default case
    return currentPath.startsWith(normalizedBasePath);
  };

  return (
    <div
      className={`fixed left-0 top-15 h-full bg-white text-black transition-all shadow-lg ${
        isExpanded ? "w-64" : "w-16"
      }`}
    >
      {/* Toggle Button */}
      <div className="p-4 flex justify-end">
        <button
          className="text-black hover:bg-gray-200 p-2 rounded-md transition"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <FaArrowLeft size={24} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-4 p-4">
        {/* Dashboard Link */}
        <div
          className={`flex items-center ${
            isExpanded ? "gap-3 p-3" : "justify-center p-2"
          } rounded-md transition font-medium ${
            isActiveRoute("/hrDashboard")
              ? "bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-lg"
              : "hover:bg-gray-200"
          }`}
        >
          <NavLink to="/hrDashboard" className="flex items-center w-full" end>
            <FaTachometerAlt size={isExpanded ? 28 : 32} />
            {isExpanded && <span className="ml-2">Dashboard</span>}
          </NavLink>
        </div>

        {/* Employees Link */}
        <div
          className={`flex items-center ${
            isExpanded ? "gap-3 p-3" : "justify-center p-2"
          } rounded-md transition font-medium ${
            isActiveRoute("/hrDashboard/employees")
              ? "bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-lg"
              : "hover:bg-gray-200"
          }`}
        >
          <NavLink
            to="/hrDashboard/employees"
            className="flex items-center w-full"
          >
            <FaUsers size={isExpanded ? 28 : 32} />
            {isExpanded && <span className="ml-2">Employees</span>}
          </NavLink>
        </div>

        {/* Managers Link */}
        <div
          className={`flex items-center ${
            isExpanded ? "gap-3 p-3" : "justify-center p-2"
          } rounded-md transition font-medium ${
            isActiveRoute("/hrDashboard/managers")
              ? "bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-lg"
              : "hover:bg-gray-200"
          }`}
        >
          <NavLink
            to="/hrDashboard/managers"
            className="flex items-center w-full"
          >
            <FaUserTie size={isExpanded ? 28 : 32} />
            {isExpanded && <span className="ml-2">Managers</span>}
          </NavLink>
        </div>
      </nav>
    </div>
  );
};

export default HRSidebar;
