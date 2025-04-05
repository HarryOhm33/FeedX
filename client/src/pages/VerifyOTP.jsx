import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const VerifyOtp = () => {
  const { verifyOtp } = useAuth();
  const [otp, setOtp] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await verifyOtp(otp);
    } catch (error) {
      console.error("OTP Verification failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center relative overflow-hidden p-20">
      <div className="absolute w-[50rem] h-[50rem] rounded-full bg-orange-300 opacity-60 -top-70 -left-40 z-0"></div>
      <div className="absolute w-[50rem] h-[50rem] rounded-full bg-orange-300 opacity-40 -bottom-80 -right-40 z-0"></div>

      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 md:p-8">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            Verify OTP
          </h1>
          <p className="text-gray-500 text-sm md:text-base mt-2">
            Enter the OTP sent to your email
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              One Time Password (OTP)
            </label>
            <input
              type="text"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              className="w-full pl-4 pr-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all text-center tracking-widest text-lg"
              maxLength={6}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white py-2 md:py-3 px-4 rounded-lg font-medium transition-all"
          >
            Verify OTP
          </button>

          <p className="text-center text-sm text-gray-600">
            Didn’t receive the code?{" "}
            <a
              href="#"
              className="text-green-400 hover:text-blue-700 font-medium"
            >
              Resend
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;
