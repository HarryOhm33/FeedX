import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FeedbackForm = ({ targetId, onClose, onSubmitSuccess }) => {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState({
    objective: [],
    subjective: [],
  });
  const [roleRelation, setRoleRelation] = useState("");
  const [responses, setResponses] = useState({
    objective: {},
    subjective: {},
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = Cookies.get("markAuth");
        const response = await axios.get(
          `https://feedx-y6pk.onrender.com/api/feedback/form/${targetId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setQuestions({
          objective: response.data.objectiveQuestions || [],
          subjective: response.data.subjectiveQuestions || [],
        });
        setRoleRelation(response.data.roleRelation || "");
        setLoading(false);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load questions");
        onClose();
      }
    };

    fetchQuestions();
  }, [targetId, onClose]);

  const calculateCompletion = () => {
    const totalQuestions =
      questions.objective.length + questions.subjective.length;
    let answeredQuestions = 0;

    // Count answered objective questions
    answeredQuestions += Object.keys(responses.objective).length;

    // Count answered subjective questions (only if not empty)
    answeredQuestions += Object.values(responses.subjective).filter(
      (answer) => answer && answer.trim() !== ""
    ).length;

    return totalQuestions > 0
      ? Math.round((answeredQuestions / totalQuestions) * 100)
      : 0;
  };

  const handleObjectiveResponse = (question, value) => {
    setResponses((prev) => ({
      ...prev,
      objective: {
        ...prev.objective,
        [question]: parseInt(value),
      },
    }));
  };

  const handleSubjectiveResponse = (question, answer) => {
    setResponses((prev) => ({
      ...prev,
      subjective: {
        ...prev.subjective,
        [question]: answer,
      },
    }));
  };

  const handleSubmit = async () => {
    // Check if all objective questions are answered
    if (
      Object.keys(responses.objective).length !== questions.objective.length
    ) {
      toast.error("Please rate all objective questions");
      return;
    }

    // Check if all subjective questions are answered (non-empty)
    const allSubjectiveAnswered = questions.subjective.every(
      (question) =>
        responses.subjective[question] &&
        responses.subjective[question].trim() !== ""
    );

    if (!allSubjectiveAnswered) {
      toast.error("Please answer all subjective questions");
      return;
    }

    try {
      setSubmitting(true);
      const token = Cookies.get("markAuth");

      const payload = {
        targetId,
        objectiveResponses: responses.objective,
        subjectiveResponses: questions.subjective.map((question) => ({
          question,
          answer: responses.subjective[question] || "",
        })),
        roleRelation,
      };

      await axios.post(
        "https://feedx-y6pk.onrender.com/api/feedback/submit",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Feedback submitted successfully");
      onSubmitSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit feedback");
    } finally {
      setSubmitting(false);
    }
  };

  // Color mapping for each rating
  const getRatingColor = (rating, selectedRating) => {
    const baseColors = {
      1: "bg-red-500",
      2: "bg-orange-500",
      3: "bg-yellow-500",
      4: "bg-blue-500",
      5: "bg-green-500",
    };

    const isSelected = selectedRating === rating;
    const baseColor = baseColors[rating] || "bg-gray-200";

    return isSelected
      ? `${baseColor} text-white scale-110`
      : "bg-gray-200 text-gray-700 hover:bg-gray-300";
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const completionPercentage = calculateCompletion();

  return (
    <div className="fixed inset-0 bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-2.5 sticky top-0 z-10">
          <div
            className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2.5 transition-all duration-300 ease-out"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>

        <div className="p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
            aria-label="Close"
          >
            ×
          </button>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Feedback Form
          </h2>
          <p className="text-gray-600 mb-6">({roleRelation})</p>

          <div className="space-y-8">
            {/* Objective Questions Section */}
            {questions.objective?.length > 0 && (
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Rating Questions
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    (1 = Strongly Disagree, 5 = Strongly Agree)
                  </span>
                </h3>
                <div className="space-y-6">
                  {questions.objective.map((question, index) => (
                    <div key={`obj-${index}`}>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        {question}
                      </label>
                      <div className="flex items-center justify-between">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <React.Fragment key={rating}>
                            <input
                              type="radio"
                              id={`${question}-${rating}`}
                              name={question}
                              value={rating}
                              checked={responses.objective[question] === rating}
                              onChange={() =>
                                handleObjectiveResponse(question, rating)
                              }
                              className="hidden"
                            />
                            <label
                              htmlFor={`${question}-${rating}`}
                              className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full cursor-pointer transition-all duration-200 ${getRatingColor(
                                rating,
                                responses.objective[question]
                              )}`}
                              title={
                                rating === 1
                                  ? "Strongly Disagree"
                                  : rating === 2
                                  ? "Disagree"
                                  : rating === 3
                                  ? "Neutral"
                                  : rating === 4
                                  ? "Agree"
                                  : "Strongly Agree"
                              }
                            >
                              {rating}
                            </label>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Subjective Questions Section */}
            {questions.subjective?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Written Feedback
                </h3>
                <div className="space-y-5">
                  {questions.subjective.map((question, index) => (
                    <div key={`subj-${index}`}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {question}
                      </label>
                      <textarea
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all"
                        rows={4}
                        value={responses.subjective[question] || ""}
                        onChange={(e) => {
                          handleSubjectiveResponse(question, e.target.value);
                        }}
                        onBlur={(e) => {
                          if (e.target.value.trim() === "") {
                            // Clear the response if empty
                            handleSubjectiveResponse(question, "");
                          }
                        }}
                        placeholder="Type your response here..."
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting || completionPercentage < 100}
              className={`px-5 py-2.5 rounded-lg text-white ${
                completionPercentage < 100
                  ? "bg-blue-400"
                  : "bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
              } transition-colors disabled:opacity-70`}
            >
              {submitting ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  Submitting...
                </span>
              ) : (
                `Submit Feedback (${completionPercentage}%)`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;
