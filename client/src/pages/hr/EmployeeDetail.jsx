import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TriggerFeedback from "./TriggerFeedback";

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTriggerFeedback, setShowTriggerFeedback] = useState(false);
  const [feedbackSessions, setFeedbackSessions] = useState({
    active: [],
    expired: [],
  });
  const [sessionsLoading, setSessionsLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const token = Cookies.get("markAuth");
        if (!token) {
          toast.error("Authentication required. Please login again.");
          navigate("/login");
          return;
        }

        const response = await axios.get(
          "http://localhost:8001/api/hr/employee-list",
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const foundEmployee = response.data.employees.find(
          (emp) => emp._id === id
        );

        if (!foundEmployee) {
          toast.error("Employee not found");
          navigate("/employee");
          return;
        }

        setEmployee(foundEmployee);
      } catch (err) {
        toast.error(err.message || "Failed to fetch employee details");
        console.error("Error fetching employee:", err);
        navigate("/employee");
      } finally {
        setLoading(false);
      }
    };

    const fetchFeedbackSessions = async () => {
      try {
        const token = Cookies.get("markAuth");
        if (!token) return;

        const response = await axios.get(
          `http://localhost:8001/api/feedback/sessions/${id}`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const now = new Date();
        const activeSessions = [];
        const expiredSessions = [];

        response.data.sessions.forEach((session) => {
          const expiresAt = new Date(session.expiresAt);
          if (expiresAt > now) {
            activeSessions.push(session);
          } else {
            expiredSessions.push(session);
          }
        });

        setFeedbackSessions({
          active: activeSessions,
          expired: expiredSessions,
        });
      } catch (err) {
        toast.error("Failed to fetch feedback sessions");
        console.error("Error fetching sessions:", err);
      } finally {
        setSessionsLoading(false);
      }
    };

    fetchEmployee();
    fetchFeedbackSessions();
  }, [id, navigate]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleTriggerFeedback = () => {
    setShowTriggerFeedback(true);
  };

  const handleSessionClick = (sessionId) => {
    navigate(`/hrDashboard/Feedback/${sessionId}`);
  };

  if (loading) {
    return <Loader size="lg" />;
  }

  if (!employee) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="bg-gray-50 p-6 rounded-lg max-w-md text-center">
          <h2 className="text-xl font-semibold text-gray-600 mb-2">
            No Employee Data
          </h2>
          <button
            onClick={handleBackClick}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition-colors"
          >
            Back to Employee List
          </button>
        </div>
      </div>
    );
  }

  const renderSessionList = (sessions, isExpired = false) => {
    if (sessionsLoading) {
      return <Loader size="sm" />;
    }

    if (sessions.length === 0) {
      return (
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <p className="text-gray-500">
            No {isExpired ? "expired" : "active"} feedback sessions
          </p>
        </div>
      );
    }

    return (
      <ul className="space-y-3">
        {sessions.map((session) => (
          <li
            key={session._id}
            onClick={() => handleSessionClick(session._id)}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-800">
                  {session.sessionName}
                </h3>
                <p className="text-sm text-gray-600">
                  Requested by: {session.requestedBy.name || "Unknown"}
                </p>
                <p className="text-sm text-gray-500">
                  Expires: {new Date(session.expiresAt).toLocaleString()}
                </p>
              </div>
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  isExpired
                    ? "bg-red-100 text-red-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {isExpired ? "Expired" : "Active"}
              </span>
            </div>
            <div className="mt-2 text-sm">
              <span className="text-gray-600">
                Responses: {session.respondedBy.length}/
                {session.leftResponders.length + session.respondedBy.length}
              </span>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="min-h-screen bg-white p-6 ml-[50px] mt-16">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handleBackClick}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Employees
          </button>
          <button
            onClick={handleTriggerFeedback}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition-colors"
          >
            Trigger Feedback
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
                {employee.name.charAt(0)}
              </div>
              <div className="ml-6">
                <h1 className="text-2xl font-bold text-gray-800">
                  {employee.name}
                </h1>
                <p className="text-gray-600">{employee.role}</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-medium text-gray-800 mb-4">
                  Personal Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-800">{employee.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Organization</p>
                    <p className="text-gray-800">{employee.organisation}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Employee ID</p>
                    <p className="text-gray-800">{employee._id}</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-medium text-gray-800 mb-4">
                  Employment Details
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Role</p>
                    <p className="text-gray-800">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          employee.role === "manager"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {employee.role}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date Joined</p>
                    <p className="text-gray-800">
                      {new Date(employee.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p className="text-gray-800">
                      {new Date(employee.updatedAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Sessions Section */}
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Feedback Sessions
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3">
                  Active Sessions
                </h3>
                {renderSessionList(feedbackSessions.active)}
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3">
                  Expired Sessions
                </h3>
                {renderSessionList(feedbackSessions.expired, true)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showTriggerFeedback && (
        <TriggerFeedback
          employeeId={employee._id}
          onClose={() => setShowTriggerFeedback(false)}
        />
      )}
    </div>
  );
};

export default EmployeeDetail;
