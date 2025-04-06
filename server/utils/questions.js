// feedbackQuestions.js
module.exports = {
  employeeToEmployee: {
    objective: [
      "How well does your colleague collaborate with the team? (1-5)",
      "How dependable is your colleague in completing tasks? (1-5)",
      "How effective is your colleague's communication? (1-5)",
    ],
    subjective: [
      "What is one strength you admire in your colleague?",
      "What is one area your colleague can improve upon?",
    ],
  },

  employeeToManager: {
    objective: [
      "How well does your manager support your work? (1-5)",
      "How approachable is your manager when you need help? (1-5)",
      "How effective is your manager's feedback? (1-5)",
    ],
    subjective: [
      "What do you appreciate most about your manager?",
      "What suggestions would you offer to your manager for improvement?",
    ],
  },

  managerToEmployee: {
    objective: [
      "How effectively does the employee take ownership of tasks? (1-5)",
      "How well does the employee communicate with peers? (1-5)",
      "How reliable is the employee in meeting deadlines? (1-5)",
    ],
    subjective: [
      "What is one thing the employee is doing really well?",
      "Where could the employee improve to contribute more effectively?",
    ],
  },
};
