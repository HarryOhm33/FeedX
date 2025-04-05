import axios from "axios";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { Doughnut, Pie } from "react-chartjs-2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../components/Loader";
import NotificationBell from "../../components/NotificationBell";
import { useAuth } from "../../context/AuthContext";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const EmployeeDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = Cookies.get("markAuth");
        if (!token) {
          toast.error("Authentication required. Please login again.");
          return;
        }

        const response = await axios.get(
          "http://localhost:8001/api/employee/dashboard",
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setDashboardData(response.data);
      } catch (err) {
        setError(err.message || "Error fetching dashboard data");
        toast.error("Failed to load dashboard data");
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (authLoading || loading) {
    return <Loader size="lg" />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-red-50 p-6 rounded-lg max-w-md text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!dashboardData || !dashboardData.data) {
    return <Loader size="lg" />;
  }

  const {
    goalsAssigned,
    goalsCompleted,
    goalsPending,
    goalCompletionRate,
    feedbackStats,
    recentGoals,
    recentFeedback,
  } = dashboardData.data;
  const { aiInsights } = dashboardData;

  // Chart Data Configurations
  const goalChartData = {
    labels: ["Completed", "Pending"],
    datasets: [
      {
        data: [goalsCompleted, goalsPending],
        backgroundColor: ["#4ade80", "#f87171"],
        borderColor: ["#22c55e", "#ef4444"],
        borderWidth: 1,
        hoverBackgroundColor: ["#16a34a", "#dc2626"],
      },
    ],
  };

  const feedbackChartData = {
    labels: ["Positive", "Neutral", "Negative"],
    datasets: [
      {
        data: [
          feedbackStats.positive,
          feedbackStats.neutral,
          feedbackStats.negative,
        ],
        backgroundColor: ["#4ade80", "#94a3b8", "#f87171"],
        borderColor: ["#22c55e", "#64748b", "#ef4444"],
        borderWidth: 1,
        hoverBackgroundColor: ["#16a34a", "#475569", "#dc2626"],
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 13,
            family: "'Inter', sans-serif",
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.95)",
        titleFont: { size: 14, weight: "bold" },
        bodyFont: { size: 13 },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        boxPadding: 4,
        callbacks: {
          label: (context) => {
            const label = context.label || "";
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    elements: {
      arc: {
        borderWidth: 0,
      },
      bar: {
        borderWidth: 0,
      },
    },
    layout: {
      padding: {
        top: 20,
        bottom: 20,
        left: 20,
        right: 20,
      },
    },
  };

  return (
    <div className="p-4 md:p-8 ml-0 ml-[55px] min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 mt-14">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              Welcome, {user?.name} 👋
            </h1>
            <p className="text-gray-500 mt-2">
              Your performance dashboard and insights
            </p>
          </div>

          <div className="mt-1 relative">
            <NotificationBell />
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Goals Assigned Card */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Goals Assigned
                </p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">
                  {goalsAssigned}
                </h3>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Goals Completed Card */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Goals Completed
                </p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">
                  {goalsCompleted}
                </h3>
              </div>
              <div className="p-3 rounded-lg bg-green-50 text-green-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Completion Rate Card */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Completion Rate
                </p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">
                  {goalCompletionRate}
                </h3>
              </div>
              <div className="p-3 rounded-lg bg-purple-50 text-purple-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Average Rating Card */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Avg. Feedback Rating
                </p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">
                  {feedbackStats.averageRating}
                </h3>
              </div>
              <div className="p-3 rounded-lg bg-amber-50 text-amber-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Goals Doughnut Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">
                Goals Progress
              </h2>
              <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                Completion Status
              </span>
            </div>
            <div className="h-72 relative">
              <Doughnut data={goalChartData} options={chartOptions} />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-700">
                    {goalCompletionRate}
                  </p>
                  <p className="text-xs text-slate-500">Completion Rate</p>
                </div>
              </div>
            </div>
          </div>

          {/* Feedback Pie Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">
                Feedback Sentiment
              </h2>
              <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                Positive/Neutral/Negative
              </span>
            </div>
            <div className="h-72">
              <Pie data={feedbackChartData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Goals */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              Recent Goals
            </h2>
            {recentGoals.length > 0 ? (
              <ul className="space-y-3">
                {recentGoals.map((goal, index) => (
                  <li key={index} className="flex items-start">
                    <span
                      className={`inline-block h-2 w-2 rounded-full mt-2 mr-2 ${
                        goal.status === "completed"
                          ? "bg-green-500"
                          : "bg-yellow-500"
                      }`}
                    ></span>
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {goal.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        {goal.status === "completed" ? "Completed" : "Pending"}{" "}
                        • Due {new Date(goal.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">No recent goals found</p>
            )}
          </div>

          {/* Recent Feedback */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              Recent Feedback
            </h2>
            {recentFeedback.length > 0 ? (
              <ul className="space-y-3">
                {recentFeedback.map((feedback, index) => (
                  <li key={index} className="flex items-start">
                    <span
                      className={`inline-block h-2 w-2 rounded-full mt-2 mr-2 ${
                        feedback.sentiment === "positive"
                          ? "bg-green-500"
                          : feedback.sentiment === "negative"
                          ? "bg-red-500"
                          : "bg-gray-500"
                      }`}
                    ></span>
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {feedback.comment || "No comment provided"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {feedback.sentiment} •{" "}
                        {new Date(feedback.date).toLocaleDateString()}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">No recent feedback found</p>
            )}
          </div>
        </div>

        {/* AI Insights Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            AI Insights
          </h2>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <p className="text-slate-700 leading-relaxed">{aiInsights}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
