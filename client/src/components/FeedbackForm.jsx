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
          `http://localhost:8001/api/feedback/form/${targetId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Ensure we always have arrays for questions
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

    // Check if all subjective questions are answered
    if (
      Object.keys(responses.subjective).length !== questions.subjective.length
    ) {
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
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
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

        <div className="space-y-6">
          {/* Objective Questions Section */}
          {questions.objective?.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">
                Rating Questions (1-5)
              </h3>
              {questions.objective.map((question, index) => (
                <div key={`obj-${index}`} className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {question}
                  </label>
                  <div className="flex items-center">
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
                          className={`mx-1 w-8 h-8 flex items-center justify-center rounded-full cursor-pointer ${
                            responses.objective[question] === rating
                              ? "bg-blue-500 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          {rating}
                        </label>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Subjective Questions Section */}
          {questions.subjective?.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Written Feedback</h3>
              {questions.subjective.map((question, index) => (
                <div key={`subj-${index}`} className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {question}
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    value={responses.subjective[question] || ""}
                    onChange={(e) =>
                      handleSubjectiveResponse(question, e.target.value)
                    }
                    placeholder="Your answer..."
                  />
                </div>
              ))}
            </div>
          )}
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
