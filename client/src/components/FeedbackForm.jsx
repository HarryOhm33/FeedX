import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FeedbackForm = ({ targetId, onClose, onSubmitSuccess }) => {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [roleRelation, setRoleRelation] = useState("");
  const [responses, setResponses] = useState({});
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = Cookies.get("markAuth");
        const response = await axios.get(
          `http://localhost:8001/api/feedback/form/${targetId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setQuestions(response.data.questions);
        setRoleRelation(response.data.roleRelation);
        setLoading(false);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load questions");
        onClose();
      }
    };

    fetchQuestions();
  }, [targetId, onClose]);

  const handleResponseChange = (question, answer) => {
    setResponses((prev) => ({ ...prev, [question]: answer }));
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please provide a rating");
      return;
    }

    const formattedResponses = questions.map((question) => ({
      question,
      answer: responses[question] || "",
    }));

    // Ensure all answers are filled
    if (formattedResponses.some((res) => !res.answer.trim())) {
      toast.error("Please provide an answer for all questions");
      return;
    }

    try {
      setSubmitting(true);
      const token = Cookies.get("markAuth");
      const payload = { targetId, rating, responses: formattedResponses };
      await axios.post("http://localhost:8001/api/feedback/submit", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Feedback submitted successfully");
      onSubmitSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit feedback");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-transparent flex justify-center items-center z-50">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-grey flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 max-h-[80vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
          aria-label="Close"
        >
          ×
        </button>

        <h2 className="text-xl font-bold mb-4">
          Feedback Form ({roleRelation})
        </h2>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Overall Rating (1–5)
          </label>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`text-2xl ${
                  star <= rating ? "text-yellow-400" : "text-gray-300"
                }`}
              >
                ★
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-600">{rating}/5</span>
          </div>
        </div>

        <div className="space-y-6">
          {questions.map((question, index) => (
            <div key={index} className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {question}
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                value={responses[question] || ""}
                onChange={(e) => handleResponseChange(question, e.target.value)}
                placeholder="Your answer..."
              />
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Feedback"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;
