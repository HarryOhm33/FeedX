import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TriggerFeedback = ({ employeeId, onClose }) => {
  const [sessionName, setSessionName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = Cookies.get("markAuth");
      if (!token) {
        toast.error("Authentication required. Please login again.");
        return;
      }

      await axios.post(
        "https://feedx-y6pk.onrender.com/api/feedback/trigger",
        {
          targetId: employeeId,
          sessionName: sessionName,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Feedback session triggered successfully!");
      handleClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to trigger feedback");
      console.error("Error triggering feedback:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 transition-all duration-300 ${
        isVisible ? "bg-black/10" : "bg-transparent pointer-events-none"
      }`}
      onClick={handleClose}
    >
      <div
        className={`bg-white rounded-xl shadow-xl p-6 w-full max-w-md transform transition-all duration-300 ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        } border border-gray-200`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Request Feedback
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Session Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="e.g., Quarterly Review"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              This will notify {employeeId} to submit feedback
            </p>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-70"
              disabled={loading}
            >
              {loading ? "Sending..." : "Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TriggerFeedback;
