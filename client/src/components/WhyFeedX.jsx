import { CheckCircle } from "lucide-react";
import React from "react";

const features = [
  "360-Degree Feedback from peers, managers & subordinates",
  "Role-based feedback forms for personalized questions",
  "Live Anonymous Feedback Wall for transparency",
  "Smart Analytics & Category Filters for HR insights",
  "Emoji Sliders & Mood Journals for emotional tracking",
  "AI-suggested phrases to help users write feedback",
  "Instant alerts for sensitive feedback & HR follow-up",
  "Multilingual feedback support to ensure inclusivity",
  "Gamified experience with confetti & rewards",
  "Monthly personalized feedback insights newsletter",
];

const WhyFeedX = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-200 to-green-300 px-4 sm:px-6 py-20 text-gray-800">
      <div className="max-w-5xl mx-auto text-center ">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white drop-shadow-lg mb-4">
          Why Choose FeedX?
        </h1>
        <p className="text-base sm:text-lg text-white/90 mb-10">
          Discover how FeedX transforms traditional employee feedback into a
          powerful, engaging and insightful experience.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/80 rounded-2xl shadow-lg p-4 sm:p-6 flex items-start gap-4 hover:scale-[1.02] transition-all"
            >
              <CheckCircle className="text-green-600 mt-1" size={24} />
              <p className="text-gray-700 font-medium text-sm sm:text-base">
                {feature}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhyFeedX;
