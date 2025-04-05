import axios from "axios";
import Cookies from "js-cookie";
import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaUser } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../context/AuthContext";

const AddEmployee = ({ onClose }) => {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = Cookies.get("markAuth");
      if (!token) {
        toast.error("Authentication token not found.");
        return;
      }

      const payload = {
        name,
        email,
        password,
        role: "employee",
        organisation: user.organisation,
        organisationId: user.organisationId,
      };

      await axios.post("http://localhost:8001/api/hr/create-user", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      toast.success("Employee added successfully!");
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add employee.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300">
      <div className="w-full h-full flex items-center justify-center px-4">
        <div className="bg-white border border-blue-500 shadow-xl p-8 rounded-2xl w-full max-w-lg text-gray-800 animate-fade-in-down">
          <h2 className="text-2xl font-extrabold text-center mb-6 tracking-wide flex items-center justify-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
            <FaUser className="text-blue-600" />
            Add New Employee
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-700">
                Employee Name
              </label>
              <input
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-gray-100 text-gray-800 placeholder-gray-500 border border-gray-300 focus:ring-2 focus:ring-blue-500 p-3 rounded-lg outline-none"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-700">
                Employee Email
              </label>
              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-100 text-gray-800 placeholder-gray-500 border border-gray-300 focus:ring-2 focus:ring-blue-500 p-3 rounded-lg outline-none"
                required
              />
            </div>

            <div className="flex flex-col relative">
              <label className="mb-1 text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-100 text-gray-800 placeholder-gray-500 border border-gray-300 focus:ring-2 focus:ring-blue-500 p-3 pr-12 rounded-lg outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-[36px] right-3 text-gray-500 hover:text-gray-800 transition"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="flex justify-between gap-4 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="w-full bg-red-100 hover:bg-red-500 hover:text-white text-red-700 font-semibold py-2 rounded-lg transition-all duration-200 shadow-md hover:scale-105"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold py-2 rounded-lg transition-all duration-200 shadow-md hover:scale-105"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Adding..." : "Add Employee"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;
