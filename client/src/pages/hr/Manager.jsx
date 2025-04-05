import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddManager from "./AddManager";
import Loader from "../../components/Loader";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Manager = () => {
  const navigate = useNavigate();
  const [showAddManager, setShowAddManager] = useState(false);
  const [managers, setManagers] = useState([]);
  const [filteredManagers, setFilteredManagers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchManagers = async () => {
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

        setManagers(response.data.managers);
        setFilteredManagers(response.data.managers);
      } catch (err) {
        toast.error(err.message || "Failed to fetch managers");
        console.error("Error fetching managers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchManagers();
  }, [navigate]);

  useEffect(() => {
    const filterManagers = () => {
      try {
        if (searchTerm.trim() === "") {
          setFilteredManagers(managers);
          return;
        }

        const filtered = managers.filter(
          (manager) =>
            manager.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            manager.email.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setFilteredManagers(filtered);

        if (filtered.length === 0) {
          toast.info("No managers match your search criteria");
        }
      } catch (err) {
        toast.error("Error filtering managers");
        console.error("Error in search:", err);
      }
    };

    const debounceTimer = setTimeout(() => {
      filterManagers();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, managers]);

  const handleManagerClick = (id) => {
    navigate(`/hrDashboard/manager/${id}`);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-6 md:ml-[50px] mt-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 gap-3">
          <div className="mb-3 sm:mb-0">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">
              Manager Management
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              {managers.length} manager{managers.length !== 1 ? "s" : ""} in
              your organization
            </p>
          </div>
          <button
            onClick={() => setShowAddManager(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm md:text-base font-medium py-2 px-3 md:py-2 md:px-4 rounded-lg shadow-sm transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 md:h-5 md:w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add Manager
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="p-3 md:p-4 border-b border-gray-200">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-4 w-4 md:h-5 md:w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full pl-9 pr-3 py-2 md:pl-10 md:pr-4 md:py-2 text-sm md:text-base border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search managers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="block sm:hidden">
            {filteredManagers.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {filteredManagers.map((manager) => (
                  <div
                    key={manager._id}
                    className="p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleManagerClick(manager._id)}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-medium">
                        {manager.name.charAt(0)}
                      </div>
                      <div className="ml-3 flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {manager.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {manager.email}
                        </p>
                        <div className="mt-1">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                            Manager
                          </span>
                          <span className="ml-2 text-xs text-gray-500">
                            {new Date(manager.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-gray-500">
                No managers found matching your search
              </div>
            )}
          </div>

          <div className="hidden sm:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredManagers.length > 0 ? (
                  filteredManagers.map((manager) => (
                    <tr
                      key={manager._id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleManagerClick(manager._id)}
                    >
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-medium">
                            {manager.name.charAt(0)}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {manager.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {manager.email}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                          Manager
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(manager.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-4 py-4 text-center text-sm text-gray-500"
                    >
                      No managers found matching your search
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showAddManager && (
        <AddManager
          onClose={() => setShowAddManager(false)}
          onManagerAdded={(newManager) => {
            setManagers([newManager, ...managers]);
            setFilteredManagers([newManager, ...filteredManagers]);
          }}
        />
      )}
    </div>
  );
};

export default Manager;
