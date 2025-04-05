import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EmployeeDetailsM = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [goals, setGoals] = useState({
    Pending: [],
    "Pending Approval": [],
    Completed: [],
  });
  const [expandedGoal, setExpandedGoal] = useState(null);
  const [goalForm, setGoalForm] = useState({
    title: "",
    description: "",
    deadline: "",
  });

  useEffect(() => {
    console.log(id);
    const fetchEmployee = async () => {
      try {
        const token = Cookies.get("markAuth");
        if (!token) {
          toast.error("Authentication required. Please login again.");
          navigate("/login");
          return;
        }

        const response = await axios.get(
          "http://localhost:8001/api/manager/get-employees",
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

        console.log(foundEmployee);

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

    const fetchGoals = async () => {
      try {
        const token = Cookies.get("markAuth");
        if (!token) return;

        const response = await axios.get(
          `http://localhost:8001/api/goal/manager/goals/${id}`,
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
      }
    };

    fetchEmployee();
    fetchGoals();
  }, [id, navigate]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleGoalFormChange = (e) => {
    const { name, value } = e.target;
    setGoalForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleGoalSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get("markAuth");
      const response = await axios.post(
        "http://localhost:8001/api/goal/create",
        {
          ...goalForm,
          employeeId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Goal created successfully");
      setShowGoalForm(false);
      setGoalForm({ title: "", description: "", deadline: "" });

      // Refresh goals
      const goalsResponse = await axios.get(
        `http://localhost:8001/api/goal/manager/goals/${id}`,
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

      goalsResponse.data.goals.forEach((goal) => {
        sortedGoals[goal.status].push(goal);
      });

      setGoals(sortedGoals);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create goal");
      console.error("Error creating goal:", err);
    }
  };

  const handleApproveGoal = async (goalId) => {
    try {
      const token = Cookies.get("markAuth");
      await axios.put(
        `http://localhost:8001/api/goal/${goalId}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Goal approved successfully");

      // Refresh goals
      const response = await axios.get(
        `http://localhost:8001/api/goal/manager/goals/${id}`,
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
      toast.error(err.response?.data?.message || "Failed to approve goal");
      console.error("Error approving goal:", err);
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
              <div>
                <h3 className="font-medium text-gray-800">{goal.title}</h3>
                <p className="text-sm text-gray-500">
                  Deadline: {new Date(goal.deadline).toLocaleDateString()}
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
                {status === "Pending Approval" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApproveGoal(goal._id);
                    }}
                    className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full hover:bg-green-200"
                  >
                    Approve
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
                <div className="mb-2">
                  <h4 className="text-sm font-medium text-gray-700">
                    Description
                  </h4>
                  <p className="text-gray-800">{goal.description}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    Created: {new Date(goal.createdAt).toLocaleDateString()}
                  </p>
                  {status === "Pending Approval" && (
                    <button
                      onClick={() => handleApproveGoal(goal._id)}
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                    >
                      Approve Goal
                    </button>
                  )}
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  if (loading) {
    return <Loader />;
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
            onClick={() => setShowGoalForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition-colors"
          >
            Set Goal
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

        {/* Goals Section */}
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Goals</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3">
                  Pending Approval
                </h3>
                {renderGoalList("Pending Approval")}
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3">
                  Pending
                </h3>
                {renderGoalList("Pending")}
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3">
                  Completed
                </h3>
                {renderGoalList("Completed")}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Goal Form Modal */}
      {showGoalForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="fixed inset-0 bg-opacity-50"
            onClick={() => setShowGoalForm(false)}
          ></div>
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative z-10">
            <h2 className="text-xl font-bold mb-4">Set New Goal</h2>
            <form onSubmit={handleGoalSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={goalForm.title}
                  onChange={handleGoalFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={goalForm.description}
                  onChange={handleGoalFormChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deadline
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={goalForm.deadline}
                  onChange={handleGoalFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowGoalForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Set Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDetailsM;
