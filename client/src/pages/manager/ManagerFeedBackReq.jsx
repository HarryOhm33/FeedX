import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../components/Loader";

const ManagerFeedbackRequests = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [feedbackRequests, setFeedbackRequests] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [completedRequests, setCompletedRequests] = useState([]);

  useEffect(() => {
    const fetchFeedbackRequests = async () => {
      try {
        const token = Cookies.get("markAuth");
        if (!token) {
          toast.error("Authentication required");
          return;
        }

        const response = await axios.get(
          "http://localhost:8001/api/feedback/requests",
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setFeedbackRequests(response.data?.feedbackRequests || []);
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Failed to fetch feedback requests"
        );
        console.error("Error fetching feedback requests:", err);
        setFeedbackRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbackRequests();
  }, [user]);

  useEffect(() => {
    if (user && feedbackRequests.length > 0) {
      const pending = [];
      const completed = [];

      feedbackRequests.forEach((request) => {
        // Check if manager is in leftResponders (pending) or respondedBy (completed)
        const isPending = request.leftResponders?.includes(user._id);
        const isCompleted = request.respondedBy?.includes(user._id);

        if (isPending) {
          pending.push(request);
        } else if (isCompleted) {
          completed.push(request);
        }
      });

      setPendingRequests(pending);
      setCompletedRequests(completed);
    } else {
      setPendingRequests([]);
      setCompletedRequests([]);
    }
  }, [user, feedbackRequests]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader size="lg" />
      </div>
    );
  }

  const getTargetDisplay = (request) => {
    if (request.targetId) {
      return `${request.targetId.name || "Unknown"} (${request.targetModel})`;
    }
    return "General Feedback";
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-6 md:ml-[50px] mt-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Your Feedback Requests
        </h1>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Pending Feedback Requests ({pendingRequests.length})
          </h2>
          {pendingRequests.length > 0 ? (
            <ul className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200">
              {pendingRequests.map((request) => (
                <li key={request._id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium">{getTargetDisplay(request)}</p>
                      <p className="text-sm text-gray-600">
                        Requested by: {request.requestedBy?.name || "Unknown"}
                      </p>
                      <p className="text-sm text-gray-500">
                        Session: {request.sessionName || "No session specified"}
                      </p>
                      {request.expiresAt && (
                        <p className="text-sm text-gray-500">
                          Due: {new Date(request.expiresAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full mb-2">
                        Pending
                      </span>
                      <button
                        className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                        onClick={() => {
                          // Add your feedback submission logic here
                          toast.info("Redirecting to feedback form...");
                        }}
                      >
                        Give Feedback
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <p className="text-gray-500">No pending feedback requests</p>
              <p className="text-sm text-gray-400 mt-1">
                You're all caught up!
              </p>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Completed Feedback ({completedRequests.length})
          </h2>
          {completedRequests.length > 0 ? (
            <ul className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200">
              {completedRequests.map((request) => (
                <li key={request._id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{getTargetDisplay(request)}</p>
                      <div className="flex flex-wrap gap-x-4">
                        <p className="text-sm text-gray-600">
                          Requested by: {request.requestedBy?.name || "Unknown"}
                        </p>
                        <p className="text-sm text-gray-500">
                          Session:{" "}
                          {request.sessionName || "No session specified"}
                        </p>
                        <p className="text-sm text-gray-500">
                          Completed:{" "}
                          {request.updatedAt
                            ? new Date(request.updatedAt).toLocaleDateString()
                            : "Unknown date"}
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Completed
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <p className="text-gray-500">No completed feedback yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Your completed feedback will appear here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerFeedbackRequests;
