import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../components/Loader";

const Feedback = () => {
  const { feedbackRequestId } = useParams();
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState([]);
  const [expandedFeedback, setExpandedFeedback] = useState(null);

  useEffect(() => {
    const fetchFeedbackResponses = async () => {
      try {
        const token = Cookies.get("markAuth");
        if (!token) {
          toast.error("Authentication required");
          return;
        }

        const response = await axios.get(
          `https://feedx-y6pk.onrender.com/api/feedback/responses/${feedbackRequestId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setFeedbacks(response.data.feedbacks || []);
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Failed to fetch feedback responses"
        );
        console.error("Error fetching feedback responses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbackResponses();
  }, [feedbackRequestId]);

  const toggleExpandFeedback = (feedbackId) => {
    setExpandedFeedback(expandedFeedback === feedbackId ? null : feedbackId);
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-xl ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-white p-6 ml-[55px] mt-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Feedback Responses
        </h1>

        {feedbacks.length === 0 ? (
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <p className="text-gray-500">No feedback responses found</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {feedbacks.map((feedback) => (
              <li
                key={feedback._id}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <div
                  className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleExpandFeedback(feedback._id)}
                >
                  <div>
                    <h3 className="font-medium text-gray-800">
                      Feedback from: {feedback.giverId?.name || "Anonymous"} [
                      {feedback.giverId?.role.charAt(0).toUpperCase() +
                        feedback.giverId?.role.slice(1)}
                      ]
                    </h3>
                    <p className="text-sm text-gray-500">
                      Submitted:{" "}
                      {new Date(feedback.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center">
                    {renderStars(feedback.rating)}
                    <svg
                      className={`w-5 h-5 ml-3 text-gray-500 transform transition-transform ${
                        expandedFeedback === feedback._id ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                {expandedFeedback === feedback._id && (
                  <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <div className="space-y-4">
                      {feedback.responses.map((response, index) => (
                        <div key={response._id} className="mb-4">
                          <h4 className="font-medium text-gray-700 mb-1">
                            {index + 1}. {response.question}
                          </h4>
                          <p className="text-gray-800 pl-4">
                            {response.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Feedback;
