import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../components/Loader";

const ManagerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [manager, setManager] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchManager = async () => {
      try {
        const token = Cookies.get("markAuth");
        if (!token) {
          toast.error("Authentication required. Please login again.");
          navigate("/login");
          return;
        }

        const response = await axios.get(
          "http://localhost:8001/api/hr/manager-list",
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const foundManager = response.data.managers.find(
          (mgr) => mgr._id === id
        );

        if (!foundManager) {
          toast.error("Manager not found");
          navigate("/hrDashboard/managers");
          return;
        }

        setManager(foundManager);
      } catch (err) {
        toast.error(err.message || "Failed to fetch manager details");
        console.error("Error fetching manager:", err);
        navigate("/hrDashboard/managers");
      } finally {
        setLoading(false);
      }
    };

    fetchManager();
  }, [id, navigate]);

  const handleBackClick = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Loader size="lg" />
      </div>
    );
  }

  if (!manager) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="bg-gray-50 p-6 rounded-lg max-w-md text-center">
          <h2 className="text-xl font-semibold text-gray-600 mb-2">
            No Manager Data
          </h2>
          <button
            onClick={handleBackClick}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition-colors"
          >
            Back to Manager List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-6 md:ml-[50px] mt-16">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={handleBackClick}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
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
          Back to Managers
        </button>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-purple-50">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-2xl font-bold">
                {manager.name.charAt(0)}
              </div>
              <div className="ml-6">
                <h1 className="text-2xl font-bold text-gray-800">
                  {manager.name}
                </h1>
                <p className="text-purple-600 font-medium">Manager</p>
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
                    <p className="text-gray-800">{manager.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Organization</p>
                    <p className="text-gray-800">{manager.organisation}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Manager ID</p>
                    <p className="text-gray-800">{manager._id}</p>
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
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                        Manager
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date Joined</p>
                    <p className="text-gray-800">
                      {new Date(manager.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p className="text-gray-800">
                      {new Date(manager.updatedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDetail;
