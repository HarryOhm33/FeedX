import {
  faBuilding,
  faEnvelope,
  faEye,
  faEyeSlash,
  faLock,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const SignUp = () => {
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    organisation: "",
  });
  const [isNewOrg, setIsNewOrg] = useState(false);
  const [errors, setErrors] = useState({
    name: false,
    email: false,
    organisation: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleOrgSelection = (e) => {
    const isNew = e.target.value === "new";
    setIsNewOrg(isNew);
    setFormData((prev) => ({ ...prev, organisation: "" }));
  };

  const validateForm = () => {
    const newErrors = {
      name: !formData.name.trim(),
      email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email),
      organisation: !formData.organisation.trim(),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await signup(formData, isNewOrg); // signup handles email setting and navigation
      setFormData({
        name: "",
        email: "",
        password: "",
        organisation: "",
      });
      setIsLoading(false);
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        email: true, // Highlight email field on error
      }));
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center relative overflow-hidden p-20">
      <div className="absolute w-[50rem] h-[50rem] rounded-full bg-orange-300 opacity-60 -top-70 -left-40 z-0"></div>
      <div className="absolute w-[50rem] h-[50rem] rounded-full bg-orange-300 opacity-50 -bottom-60 -right-40 z-0"></div>

      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 md:p-8">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Create Account
          </h1>
          <p className="text-gray-500 text-sm md:text-base mt-2">
            Join our community today
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon
                  icon={faUser}
                  className="text-gray-400 text-sm"
                />
              </div>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2 md:py-3 border ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all`}
                disabled={isLoading}
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-xs md:text-sm mt-1">
                Name is required
              </p>
            )}
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="text-gray-400 text-sm"
                />
              </div>
              <input
                type="email"
                name="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2 md:py-3 border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all`}
                disabled={isLoading}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs md:text-sm mt-1">
                Invalid email format
              </p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon
                  icon={faLock}
                  className="text-gray-400 text-sm"
                />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-12 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                disabled={isLoading}
              >
                <FontAwesomeIcon
                  icon={showPassword ? faEyeSlash : faEye}
                  className="text-gray-400 hover:text-gray-500 text-sm"
                />
              </button>
            </div>
          </div>

          {/* Organization Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Organization Type
            </label>
            <div className="flex flex-col md:flex-row gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="orgType"
                  value="existing"
                  checked={!isNewOrg}
                  onChange={handleOrgSelection}
                  className="h-4 w-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                  disabled={isLoading}
                />
                <span className="text-gray-700 text-sm md:text-base">
                  Existing Organization
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="orgType"
                  value="new"
                  checked={isNewOrg}
                  onChange={handleOrgSelection}
                  className="h-4 w-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                  disabled={isLoading}
                />
                <span className="text-gray-700 text-sm md:text-base">
                  New Organization
                </span>
              </label>
            </div>
          </div>

          {/* Organization Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {isNewOrg ? "Organization Name" : "Organization ID"}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon
                  icon={faBuilding}
                  className="text-gray-400 text-sm"
                />
              </div>
              <input
                type="text"
                name="organisation"
                placeholder={isNewOrg ? "Organization Name" : "ORG-123456"}
                value={formData.organisation}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2 md:py-3 border ${
                  errors.organisation ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all`}
                disabled={isLoading}
              />
            </div>
            {errors.organisation && (
              <p className="text-red-500 text-xs md:text-sm mt-1">
                {isNewOrg
                  ? "Organization name is required"
                  : "Organization ID is required"}
              </p>
            )}
          </div>

          {/* Submit Button with Loader */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white py-2 md:py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Signing up...
              </>
            ) : (
              "Create Account"
            )}
          </button>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-green-400 hover:text-blue-700 font-medium"
            >
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
