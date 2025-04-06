import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../components/Loader";

const GoalE = () => {
  const [goals, setGoals] = useState({
    Pending: [],
    "Pending Approval": [],
    Completed: [],
  });
  const [loading, setLoading] = useState(true);
  const [expandedGoal, setExpandedGoal] = useState(null);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const token = Cookies.get("markAuth");
        if (!token) {
          toast.error("Authentication required");
          return;
        }

        const response = await axios.get(
          "https://feedx-y6pk.onrender.com/api/goal/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const sortedGoals = {
          Pending: [],
          "Pending Approval": [],
          Completed: [],
        };

        response.data.goals.forEach((goal) => {
          sortedGoals[goal.status].push(goal);
        });

        setGoals(sortedGoals);
      } catch (err) {
        toast.error("Failed to fetch goals");
        console.error("Error fetching goals:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, []);

  const handleRequestCompletion = async (goalId) => {
    try {
      const token = Cookies.get("markAuth");
      await axios.put(
        `https://feedx-y6pk.onrender.com/api/goal/${goalId}/request-completion`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Completion request submitted successfully");

      // Refresh goals
      const response = await axios.get(
        "https://feedx-y6pk.onrender.com/api/goal/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const sortedGoals = {
        Pending: [],
        "Pending Approval": [],
        Completed: [],
      };

      response.data.goals.forEach((goal) => {
        sortedGoals[goal.status].push(goal);
      });

      setGoals(sortedGoals);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to request completion"
      );
      console.error("Error requesting completion:", err);
    }
  };

  const toggleExpandGoal = (goalId) => {
    setExpandedGoal(expandedGoal === goalId ? null : goalId);
  };

  const renderGoalList = (status) => {
    if (loading) {
      return <Loader />;
    }

    if (goals[status].length === 0) {
      return (
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <p className="text-gray-500">No {status.toLowerCase()} goals</p>
        </div>
      );
    }

    return (
      <ul className="space-y-3">
        {goals[status].map((goal) => (
          <li
            key={goal._id}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <div
              className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
              onClick={() => toggleExpandGoal(goal._id)}
            >
              <div className="flex-1">
                <h3 className="font-medium text-gray-800">{goal.title}</h3>
                <p className="text-sm text-gray-500">
                  Manager: {goal.managerId?.name || "Unknown"}
                </p>
              </div>
              <div className="flex items-center">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    status === "Completed"
                      ? "bg-green-100 text-green-800"
                      : status === "Pending Approval"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {status}
                </span>
                {status === "Pending" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRequestCompletion(goal._id);
                    }}
                    className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full hover:bg-green-200"
                  >
                    Mark Complete
                  </button>
                )}
                <svg
                  className={`w-5 h-5 ml-3 text-gray-500 transform transition-transform ${
                    expandedGoal === goal._id ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {expandedGoal === goal._id && (
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">
                    Description
                  </h4>
                  <p className="text-gray-800">{goal.description}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">
                      Deadline
                    </h4>
                    <p className="text-gray-800">
                      {new Date(goal.deadline).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">
                      Created
                    </h4>
                    <p className="text-gray-800">
                      {new Date(goal.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {status === "Pending" && (
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleRequestCompletion(goal._id)}
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                    >
                      Mark as Complete
                    </button>
                  </div>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6 md:ml-[50px] mt-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">My Goals</h1>

        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Pending Approval
            </h2>
            {renderGoalList("Pending Approval")}
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Pending
            </h2>
            {renderGoalList("Pending")}
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Completed
            </h2>
            {renderGoalList("Completed")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalE;
