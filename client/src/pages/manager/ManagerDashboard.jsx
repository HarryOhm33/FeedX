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
import { Bar, Doughnut, Pie } from "react-chartjs-2";
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

const ManagerDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log(user);
    const fetchDashboardData = async () => {
      try {
        const token = Cookies.get("markAuth");
        if (!token) {
          toast.error("Authentication required. Please login again.");
          return;
        }

        const response = await axios.get(
          "https://feedx-y6pk.onrender.com/api/manager/dashboard",
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

  const {
    totalEmployees,
    goalsAssigned,
    goalsCompleted,
    goalsPending,
    feedbackStats,
    topPerformer,
  } = dashboardData.data;
  const { aiInsights } = dashboardData;

  // Chart Data Configurations with Aqua Gradient Theme
  const goalChartData = {
    labels: ["Completed", "Pending"],
    datasets: [
      {
        data: [goalsCompleted, goalsPending],
        backgroundColor: ["#00FFC2", "#00E0FF"],
        borderColor: ["#00D1A9", "#00B8E0"],
        borderWidth: 1,
        hoverBackgroundColor: ["#00E0B0", "#00C9FF"],
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
        backgroundColor: ["#00FFC2", "#7DD3FC", "#00E0FF"],
        borderColor: ["#00D1A9", "#60B5E8", "#00B8E0"],
        borderWidth: 1,
        hoverBackgroundColor: ["#00E0B0", "#6AC4FF", "#00C9FF"],
      },
    ],
  };

  const employeeManagerChartData = {
    labels: ["Employees", "Goals Assigned"],
    datasets: [
      {
        label: "Count",
        data: [totalEmployees, goalsAssigned],
        backgroundColor: ["#00E0FF", "#00B4D8"],
        borderColor: ["#00C9FF", "#0096C7"],
        borderWidth: 1,
        hoverBackgroundColor: ["#00C9FF", "#0096C7"],
        borderRadius: 6,
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
        backgroundColor: "rgba(0, 180, 216, 0.95)",
        titleFont: { size: 14, weight: "bold", color: "#fff" },
        bodyFont: { size: 13, color: "#fff" },
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
    <div className="p-4 md:p-8 ml-0 ml-[55px] min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 mt-14">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-cyan-800">
              Welcome, {user?.name} 👋
            </h1>
            <p className="text-cyan-600 mt-2">
              Your team performance dashboard and insights
            </p>
          </div>

          <div className="mt-1 relative">
            <NotificationBell />
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Employees Managed Card */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-cyan-100 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-cyan-600">
                  Employees Managed
                </p>
                <h3 className="text-2xl font-bold text-cyan-800 mt-1">
                  {totalEmployees}
                </h3>
              </div>
              <div className="p-3 rounded-lg bg-cyan-50 text-cyan-600">
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
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Goals Assigned Card */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-cyan-100 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-cyan-600">
                  Goals Assigned
                </p>
                <h3 className="text-2xl font-bold text-cyan-800 mt-1">
                  {goalsAssigned}
                </h3>
              </div>
              <div className="p-3 rounded-lg bg-teal-50 text-teal-600">
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
          <div className="bg-white p-5 rounded-xl shadow-sm border border-cyan-100 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-cyan-600">
                  Goals Completed
                </p>
                <h3 className="text-2xl font-bold text-cyan-800 mt-1">
                  {goalsCompleted}
                </h3>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-r from-cyan-50 to-teal-50 text-teal-600">
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

          {/* Feedback Card */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-cyan-100 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-cyan-600">
                  Total Feedback
                </p>
                <h3 className="text-2xl font-bold text-cyan-800 mt-1">
                  {feedbackStats.totalFeedback}
                </h3>
                <p className="text-xs text-cyan-500 mt-1">
                  Avg. Score: {feedbackStats.avgFeedbackScore}
                </p>
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
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Team Overview Bar Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-cyan-100 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-cyan-800">
                Team Overview
              </h2>
              <span className="text-xs px-2 py-1 bg-cyan-100 text-cyan-800 rounded-full">
                Employees vs Goals
              </span>
            </div>
            <div className="h-72">
              <Bar
                data={employeeManagerChartData}
                options={{
                  ...chartOptions,
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        drawBorder: false,
                      },
                      ticks: {
                        padding: 10,
                      },
                    },
                    x: {
                      grid: {
                        display: false,
                        drawBorder: false,
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Goals Doughnut Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-cyan-100 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-cyan-800">
                Goals Status
              </h2>
              <span className="text-xs px-2 py-1 bg-cyan-100 text-cyan-800 rounded-full">
                Completion Rate
              </span>
            </div>
            <div className="h-72 relative">
              <Doughnut data={goalChartData} options={chartOptions} />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <p className="text-2xl font-bold text-cyan-700">
                    {goalsAssigned > 0
                      ? Math.round((goalsCompleted / goalsAssigned) * 100)
                      : 0}
                    %
                  </p>
                  <p className="text-xs text-cyan-500">Completion</p>
                </div>
              </div>
            </div>
          </div>

          {/* Feedback Pie Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-cyan-100 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-cyan-800">
                Feedback Sentiment
              </h2>
              <span className="text-xs px-2 py-1 bg-cyan-100 text-cyan-800 rounded-full">
                Positive/Neutral/Negative
              </span>
            </div>
            <div className="h-72">
              <Pie data={feedbackChartData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Top Performer and AI Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Performer Card */}
          {topPerformer && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-cyan-100 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-cyan-800">
                  Top Performer
                </h2>
                <span className="text-xs px-2 py-1 bg-gradient-to-r from-cyan-100 to-teal-100 text-cyan-800 rounded-full">
                  Employee of the month
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-cyan-100 to-teal-100 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-cyan-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-cyan-800">
                    {topPerformer.name}
                  </h3>
                  <p className="text-sm text-cyan-600 mb-2">
                    Highest goal completion rate
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 bg-cyan-50 text-cyan-700 text-xs rounded-full">
                      {topPerformer.completed} goals completed
                    </span>
                    <span className="px-2 py-1 bg-teal-50 text-teal-700 text-xs rounded-full">
                      {goalsAssigned > 0
                        ? Math.round(
                            (topPerformer.completed / goalsAssigned) * 100
                          )
                        : 0}
                      % success rate
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI Insights Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-cyan-100 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-cyan-800">
                AI Insights
              </h2>
              <span className="text-xs px-2 py-1 bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-800 rounded-full">
                Powered by AI
              </span>
            </div>
            <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-200">
              <div className="prose prose-sm text-cyan-700">
                {aiInsights.split("\n\n").map((paragraph, index) => (
                  <p key={index} className="mb-3 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
