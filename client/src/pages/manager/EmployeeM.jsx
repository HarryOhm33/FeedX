import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EmployeeM = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = Cookies.get("markAuth");
        if (!token) {
          toast.error("Authentication required. Please login again.");
          navigate("/login");
          return;
        }

        const response = await axios.get(
          "https://feedx-y6pk.onrender.com/api/manager/get-employees",
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setEmployees(response.data.employees);
        setFilteredEmployees(response.data.employees);
      } catch (err) {
        toast.error(err.message || "Failed to fetch employees");
        console.error("Error fetching employees:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [navigate]);

  useEffect(() => {
    const filterEmployees = () => {
      try {
        if (searchTerm.trim() === "") {
          setFilteredEmployees(employees);
          return;
        }

        const filtered = employees.filter(
          (employee) =>
            employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.role.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setFilteredEmployees(filtered);

        if (filtered.length === 0) {
          toast.info("No employees match your search criteria");
        }
      } catch (err) {
        toast.error("Error filtering employees");
        console.error("Error in search:", err);
      }
    };

    const debounceTimer = setTimeout(() => {
      filterEmployees();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, employees]);

  const handleEmployeeClick = (id) => {
    navigate(`/managerDashboard/employees/${id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-6 ml-[60px] mt-16">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 gap-3">
          <div className="mb-3 sm:mb-0">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">
              Employee Management
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              {employees.length} employee{employees.length !== 1 ? "s" : ""} in
              your organization
            </p>
          </div>
        </div>

        {/* Search and Table Container */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          {/* Search Bar */}
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
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Table - Mobile Cards */}
          <div className="block sm:hidden">
            {filteredEmployees.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {filteredEmployees.map((employee) => (
                  <div
                    key={employee._id}
                    className="p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleEmployeeClick(employee._id)}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                        {employee.name.charAt(0)}
                      </div>
                      <div className="ml-3 flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {employee.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {employee.email}
                        </p>
                        <div className="mt-1 flex items-center">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              employee.role === "manager"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {employee.role}
                          </span>
                          <span className="ml-2 text-xs text-gray-500">
                            {new Date(employee.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-gray-500">
                No employees found matching your search
              </div>
            )}
          </div>

          {/* Table - Desktop */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Role
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee) => (
                    <tr
                      key={employee._id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleEmployeeClick(employee._id)}
                    >
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                            {employee.name.charAt(0)}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {employee.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {employee.email}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            employee.role === "manager"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {employee.role}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(employee.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-4 py-4 text-center text-sm text-gray-500"
                    >
                      No employees found matching your search
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeM;
