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
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setDashboardData(response.data);
        } else {
          throw new Error("Failed to fetch dashboard data");
        }
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
    return <Loader />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="bg-red-50 p-6 rounded-lg max-w-md text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!dashboardData || !dashboardData.data) {
    return <Loader />;
  }

  // Destructure with defaults
  const {
    goalsAssigned = 0,
    goalsCompleted = 0,
    goalsPending = 0,
    goalCompletionRate = "0%",
    feedbackStats = {
      totalFeedback: 0,
      positive: 0,
      neutral: 0,
      negative: 0,
      averageRating: "0.00",
    },
    recentGoals = [],
  } = dashboardData.data;

  const { aiInsights = "" } = dashboardData;

  // Chart data configurations
  const goalProgressData = {
    labels: ["Completed", "Pending"],
    datasets: [
      {
        data: [goalsCompleted, goalsPending],
        backgroundColor: ["#00C9A7", "#00B4D8"],
        borderColor: ["#00A896", "#0096C7"],
        borderWidth: 1,
      },
    ],
  };

  const feedbackSentimentData = {
    labels: ["Positive", "Neutral", "Negative"],
    datasets: [
      {
        data: [
          feedbackStats.positive,
          feedbackStats.neutral,
          feedbackStats.negative,
        ],
        backgroundColor: ["#00C9A7", "#7DD3FC", "#00B4D8"],
        borderColor: ["#00A896", "#6AC4FF", "#0096C7"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: "right",
        labels: {
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
          padding: 16,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 180, 216, 0.95)",
        titleFont: { size: 13, weight: "bold" },
        bodyFont: { size: 12 },
        padding: 10,
        cornerRadius: 6,
        displayColors: true,
        callbacks: {
          label: (context) => {
            const label = context.label || "";
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage =
              total > 0 ? Math.round((value / total) * 100) : 0;
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    elements: {
      arc: {
        borderWidth: 0,
      },
    },
  };

  return (
    <div className="p-4 md:p-8 ml-0 ml-[55px] min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 mt-14">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-cyan-800">
              Welcome, {user?.name || "Employee"} 👋
            </h1>
            <p className="text-cyan-600 mt-2">
              Here's your performance overview
            </p>
          </div>
          <div className="mt-1 relative">
            <NotificationBell />
          </div>
        </header>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Goals Assigned */}
          <MetricCard
            title="Goals Assigned"
            value={goalsAssigned}
            icon={
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
            }
            color="bg-cyan-50 text-cyan-600"
          />

          {/* Goals Completed */}
          <MetricCard
            title="Goals Completed"
            value={goalsCompleted}
            icon={
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
            }
            color="bg-teal-50 text-teal-600"
          />

          {/* Completion Rate */}
          <MetricCard
            title="Completion Rate"
            value={goalCompletionRate}
            icon={
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
            }
            color="bg-blue-50 text-blue-600"
          />

          {/* Avg Rating */}
          <MetricCard
            title="Avg. Rating"
            value={feedbackStats.averageRating}
            subtitle={`${feedbackStats.totalFeedback} feedback`}
            icon={
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
            }
            color="bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-600"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Goals Progress */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-cyan-100 hover:shadow-md transition-all lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-cyan-800">
                Goals Progress
              </h2>
              <span className="text-xs px-2 py-1 bg-cyan-100 text-cyan-800 rounded-full">
                {goalCompletionRate} completion
              </span>
            </div>
            <div className="h-64">
              <Doughnut data={goalProgressData} options={chartOptions} />
            </div>
          </div>

          {/* Recent Goals */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-cyan-100 hover:shadow-md transition-all">
            <h2 className="text-lg font-semibold text-cyan-800 mb-4">
              Recent Goals
            </h2>
            {recentGoals.length > 0 ? (
              <div className="space-y-4">
                {recentGoals.map((goal, index) => (
                  <div key={index} className="flex items-start">
                    <span
                      className={`inline-block h-2 w-2 rounded-full mt-2 mr-2 ${
                        goal.status === "Completed"
                          ? "bg-teal-500"
                          : "bg-amber-400"
                      }`}
                    ></span>
                    <div>
                      <h3 className="text-sm font-medium text-cyan-800">
                        {goal.title}
                      </h3>
                      <p className="text-xs text-cyan-600">
                        {goal.status} • Due{" "}
                        {new Date(goal.deadline).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-cyan-600">No recent goals found</p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Feedback Sentiment */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-cyan-100 hover:shadow-md transition-all">
            <h2 className="text-lg font-semibold text-cyan-800 mb-4">
              Feedback Sentiment
            </h2>
            <div className="h-64">
              {feedbackStats.totalFeedback > 0 ? (
                <Pie data={feedbackSentimentData} options={chartOptions} />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-cyan-600 text-center">
                    No feedback data available
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-cyan-100 hover:shadow-md transition-all lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-cyan-800">
                AI Insights
              </h2>
              <span className="text-xs px-2 py-1 bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-800 rounded-full">
                Powered by AI
              </span>
            </div>
            <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-200">
              {aiInsights ? (
                <div className="prose prose-sm text-cyan-700">
                  {aiInsights.split("\n\n").map((paragraph, index) => (
                    <p key={index} className="mb-3 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-cyan-600">No insights available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Metric Card Component
const MetricCard = ({ title, value, icon, color, subtitle }) => (
  <div className="bg-white p-5 rounded-xl shadow-sm border border-cyan-100 hover:shadow-md transition-all">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-cyan-600">{title}</p>
        <h3 className="text-2xl font-bold text-cyan-800 mt-1">{value}</h3>
        {subtitle && <p className="text-xs text-cyan-500 mt-1">{subtitle}</p>}
      </div>
      <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
    </div>
  </div>
);

export default EmployeeDashboard;
