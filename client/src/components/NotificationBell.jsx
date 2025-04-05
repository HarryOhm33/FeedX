import { Bell } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useAuth } from "../context/AuthContext";

const NotificationBell = () => {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [hasNew, setHasNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);

  // Fetch notifications from API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = Cookies.get("markAuth");
        if (!token || !user?._id) return;

        const response = await axios.get(
          `http://localhost:8001/api/notif/${user._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setNotifications(response.data);
        setHasNew(response.data.length > 0);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user?._id]);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (showNotifications === false && notifications.length > 0) {
      setHasNew(false);
    }
  };

  const dismissNotification = async (notificationId) => {
    try {
      const token = Cookies.get("markAuth");
      if (!token) return;

      await axios.delete(`http://localhost:8001/api/notif/${notificationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotifications((prev) =>
        prev.filter((notification) => notification._id !== notificationId)
      );
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
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
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 shadow-xl rounded-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-4">
            <h3 className="font-semibold text-gray-800 text-lg mb-2">
              Notifications
            </h3>
            {loading ? (
              <p className="text-sm text-gray-500">Loading...</p>
            ) : notifications.length === 0 ? (
              <p className="text-sm text-gray-500">No new notifications.</p>
            ) : (
              <ul className="space-y-2">
                {notifications.map((notification) => (
                  <li
                    key={notification._id}
                    className="flex justify-between items-start bg-gray-50 p-3 rounded hover:bg-gray-100"
                  >
                    <span className="text-sm text-gray-700 flex-1">
                      {notification.message}
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </span>
                    <button
                      onClick={() => dismissNotification(notification._id)}
                      className="text-sm text-red-500 hover:text-red-700 ml-2"
                      aria-label="Dismiss notification"
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
