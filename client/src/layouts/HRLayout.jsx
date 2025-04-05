import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import HRSidebar from "../pages/hr/HRSidebar";

const HRLayout = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative min-h-screen flex">
      <div
        className={`fixed top-0 left-0 h-full z-48 transition-all duration-300 ${
          isExpanded ? "w-64" : "w-16"
        }`}
      >
        <HRSidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      </div>

      <div className="flex-1">
        <Outlet />
      </div>

      {isExpanded && (
        <div
          className="fixed inset-0 bg-transparent z-40"
          onClick={() => setIsExpanded(false)}
        ></div>
      )}
    </div>
  );
};

export default HRLayout;
