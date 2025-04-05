import { Bell } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const NotificationBell = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    "Meeting at 3PM with HR.",
    "Your feedback report is ready.",
    "New training module available.",
  ]);
  const [hasNew, setHasNew] = useState(true);

  const dropdownRef = useRef(null);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setHasNew(false);
  };

  const dismissNotification = (index) => {
    const updated = [...notifications];
    updated.splice(index, 1);
    setNotifications(updated);
  };

  // Handle click outside to close notification box
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Bell Icon */}
      <button
        onClick={toggleNotifications}
        className="relative p-2"
        aria-label="Notification Bell"
      >
        <Bell className="h-6 w-6 text-gray-700" />
        {hasNew && (
          <>
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
          </>
        )}
      </button>

      {/* Notification Popover */}
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 shadow-xl rounded-lg z-50">
          <div className="p-4">
            <h3 className="font-semibold text-gray-800 text-lg mb-2">
              Notifications
            </h3>
            {notifications.length === 0 ? (
              <p className="text-sm text-gray-500">No new notifications.</p>
            ) : (
              <ul className="space-y-2">
                {notifications.map((note, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-gray-50 p-2 rounded hover:bg-gray-100"
                  >
                    <span className="text-sm text-gray-700">{note}</span>
                    <button
                      onClick={() => dismissNotification(index)}
                      className="text-sm text-red-500 hover:text-red-700"
                    >
                      ✖
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
