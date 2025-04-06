import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddManager = ({ onClose }) => {
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
        role: "manager",
        organisation: user.organisation,
        organisationId: user.organisationId,
      };

      await axios.post(
        "https://feedx-y6pk.onrender.com/api/hr/create-user",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      toast.success("Manager added successfully!");
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add manager.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen flex items-center justify-center bg-black/50 backdrop-blur-md z-50">
      <div className="w-full h-full flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg p-6 rounded-lg w-full max-w-md">
          <h2 className="text-xl font-bold text-white mb-4 text-center">
            Add New Manager
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Manager Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-400 p-2 rounded-md bg-transparent text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <input
              type="email"
              placeholder="Manager Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-400 p-2 rounded-md bg-transparent text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Temporary Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-400 p-2 rounded-md bg-transparent text-white placeholder-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-300 hover:text-white transition"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md transition-all duration-200"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md transition-all duration-200"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Adding..." : "Add Manager"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddManager;
