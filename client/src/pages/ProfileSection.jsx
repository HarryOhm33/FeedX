import { useAuth } from "../context/AuthContext";
import { format } from "date-fns";
import Loader from "../components/Loader";
import { useState } from "react";
import { FiCopy, FiCheck } from "react-icons/fi";

const ProfileSection = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(user.organisationId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (!user) {
    return (
      <div className="text-cyan-600">
        <Loader />
      </div>
    );
  }

  return (
    <div className="ml-[55px] mt-[90px] px-6 py-4">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-md border border-cyan-100 p-8 hover:shadow-lg transition-all max-w-6xl mx-auto">
        {/* Organization Info on Top */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-xl font-semibold text-cyan-800">
              Organization: {user.organisation}
            </h2>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-cyan-600">ID:</span>
            <span className="font-mono text-xs bg-cyan-50 px-2 py-1 rounded border border-cyan-100">
              {user.organisationId}
            </span>
            <button
              onClick={handleCopy}
              className="text-cyan-600 hover:text-cyan-800 transition"
              title="Copy to clipboard"
            >
              {copied ? <FiCheck className="text-green-600" /> : <FiCopy />}
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Avatar and Basic Info */}
          <div className="flex flex-col items-center md:w-1/3">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-cyan-200 to-blue-200 flex items-center justify-center mb-4 shadow-inner">
              <span className="text-4xl font-bold text-cyan-800">
                {user.name.charAt(0)}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-cyan-900">{user.name}</h2>
            <span className="mt-2 px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm capitalize shadow-sm">
              {user.role}
            </span>
          </div>

          {/* Detailed Info */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-cyan-800">
                Account Information
              </h3>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium text-cyan-600">Email:</span>{" "}
                  {user.email}
                </p>
                <p>
                  <span className="font-medium text-cyan-600">
                    Member Since:
                  </span>{" "}
                  {format(new Date(user.createdAt), "MMM d, yyyy")}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-cyan-800">
                Last Update
              </h3>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium text-cyan-600">
                    Last Updated:
                  </span>{" "}
                  {format(new Date(user.updatedAt), "MMM d, yyyy h:mm a")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
