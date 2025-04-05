import React from "react";
import { FaArrowLeft, FaBars, FaTachometerAlt } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const EmployeeSidebar = ({ isExpanded, setIsExpanded }) => {
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
        <NavLink
          to="/employeeDashboard"
          end
          className={({ isActive }) =>
            `flex items-center ${
              isExpanded ? "gap-3 p-3" : "justify-center p-2"
            } rounded-md transition font-medium ${
              isActive
                ? "bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-lg"
                : "hover:bg-gray-200"
            }`
          }
          title="Dashboard"
        >
          <FaTachometerAlt size={isExpanded ? 28 : 32} />
          {isExpanded && <span>Dashboard</span>}
        </NavLink>

        {/* <NavLink
          to="/hrDashboard/Employees"
          className={({ isActive }) =>
            `flex items-center ${
              isExpanded ? "gap-3 p-3" : "justify-center p-2"
            } rounded-md transition font-medium ${
              isActive
                ? "bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-lg"
                : "hover:bg-gray-200"
            }`
          }
          title="Employees"
        >
          <FaUsers size={isExpanded ? 28 : 32} />
          {isExpanded && <span>Employees</span>}
        </NavLink> */}

        {/* <NavLink
          to="/hrDashboard/Managers"
          className={({ isActive }) =>
            `flex items-center ${
              isExpanded ? "gap-3 p-3" : "justify-center p-2"
            } rounded-md transition font-medium ${
              isActive
                ? "bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-lg"
                : "hover:bg-gray-200"
            }`
          }
          title="Managers"
        >
          <FaUserTie size={isExpanded ? 28 : 32} />
          {isExpanded && <span>Managers</span>}
        </NavLink> */}
      </nav>
    </div>
  );
};

export default EmployeeSidebar;
