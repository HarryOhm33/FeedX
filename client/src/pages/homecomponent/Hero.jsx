import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import { useAuth } from "../../context/AuthContext";

const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // assume `user` is null or defined

  const handleClick = () => {
    if (user) {
      navigate("/login");
    } else {
      navigate("/signup");
    }
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-center mt-30 px-4 text-center">
      <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight max-w-4xl">
        <span className="block mb-2">Transform Your Workplace</span>
        <span className="text-blue-500">with Employee Feedback</span>
      </h1>
      <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mt-2 max-w-4xl">
        Improve satisfaction, productivity, and engagement
      </h2>
      <p className="mt-8 text-lg text-gray-600 max-w-2xl">
        Our Employee Feedback System helps businesses collect, analyze, and act
        on feedback to enhance the work environment and employee experience.
      </p>
      <Button
        className="mt-10 bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-500 hover:to-blue-600 text-white px-8 py-3 rounded-md text-lg font-medium"
        onClick={handleClick}
      >
        {user ? "Login Now" : "Get Started Today"}
      </Button>
      <br />
      <br />
    </div>
  );
};

export default Hero;
