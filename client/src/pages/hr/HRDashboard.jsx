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
import { useEffect, useState } from "react";
import { Bar, Doughnut, Pie } from "react-chartjs-2";
import Loader from "../../components/Loader";
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

const HRDashboard = () => {
  const { user, loading } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = Cookies.get("markAuth");
        if (!token) throw new Error("No authentication token found!");

        const response = await axios.get(
          "http://localhost:8001/api/hr/dashboard",
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setDashboardData(response.data);
      } catch (err) {
        setError(err.message || "Error fetching dashboard data");
        console.error("Dashboard fetch error:", err);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <Loader className="pl-10" />;

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 p-6 rounded-lg max-w-md text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );

  if (!dashboardData || !dashboardData.data)
    return <Loader className="pl-10" />;

  const {
    totalEmployees,
    totalManagers,
    goalStats,
    feedbackStats,
    topPerformer,
  } = dashboardData.data;
  const { aiInsights } = dashboardData;

  // Chart Data Configurations
  const goalChartData = {
    labels: ["Completed", "Pending"],
    datasets: [
      {
        data: [goalStats.completed, goalStats.pending],
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

  const employeeManagerChartData = {
    labels: ["Employees", "Managers"],
    datasets: [
      {
        label: "Count",
        data: [totalEmployees, totalManagers],
        backgroundColor: ["#60a5fa", "#818cf8"],
        borderColor: ["#3b82f6", "#6366f1"],
        borderWidth: 1,
        hoverBackgroundColor: ["#2563eb", "#4f46e5"],
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
    <div className="p-8 md:p-8 ml-[50px] md:ml-[50px] min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
            HR Dashboard
          </h1>
          <p className="text-slate-500 mt-2">
            Overview of your organization's performance and metrics
          </p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Employees Card */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Employees
                </p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">
                  {totalEmployees}
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
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Managers Card */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Managers
                </p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">
                  {totalManagers}
                </h3>
              </div>
              <div className="p-3 rounded-lg bg-indigo-50 text-indigo-600">
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
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Goals Card */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Goals
                </p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">
                  {goalStats.total}
                </h3>
              </div>
              <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600">
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
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Feedback
                </p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">
                  {feedbackStats.positive +
                    feedbackStats.neutral +
                    feedbackStats.negative}
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
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">
                Team Overview
              </h2>
              <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                Employees vs Managers
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
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">
                Goals Status
              </h2>
              <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                Completion Rate
              </span>
            </div>
            <div className="h-72 relative">
              <Doughnut data={goalChartData} options={chartOptions} />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-700">
                    {Math.round((goalStats.completed / goalStats.total) * 100)}%
                  </p>
                  <p className="text-xs text-slate-500">Completion</p>
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

        {/* Top Performer and AI Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Performer Card */}
          {topPerformer && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-800">
                  Top Performer
                </h2>
                <span className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded-full">
                  Employee of the month
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-amber-100 to-amber-50 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-amber-500"
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
                  <h3 className="font-medium text-slate-800">
                    {topPerformer.name || "anonymous"}
                  </h3>
                  <p className="text-sm text-slate-500 mb-2">
                    Highest goal completion rate
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full">
                      {topPerformer.completed} goals completed
                    </span>
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                      {Math.round(
                        (topPerformer.completed / goalStats.total) * 100
                      )}
                      % success
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI Insights Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">
                AI Insights
              </h2>
              <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                Powered by AI
              </span>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <p className="text-slate-700 leading-relaxed">{aiInsights}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;
