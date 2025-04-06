module.exports = {
  employeeToEmployee: {
    objective: [
      "How well does your colleague collaborate with the team? (1-5)",
      "How dependable is your colleague in completing tasks? (1-5)",
      "How effective is your colleague's communication? (1-5)",
    ],
    subjective: [
      "Have you faced any issues working with this colleague? (Type 'No' if not)",
      "Do you have any suggestions to help your colleague improve? (Type 'No' if not)",
    ],
  },

  employeeToManager: {
    objective: [
      "How well does your manager support your work? (1-5)",
      "How approachable is your manager when you need help? (1-5)",
      "How effective is your manager's feedback? (1-5)",
    ],
    subjective: [
      "Have you faced any issues working under this manager? (Type 'No' if not)",
      "Do you have any suggestions for your manager's improvement? (Type 'No' if not)",
    ],
  },

  managerToEmployee: {
    objective: [
      "How effectively does the employee take ownership of tasks? (1-5)",
      "How well does the employee communicate with peers? (1-5)",
      "How reliable is the employee in meeting deadlines? (1-5)",
    ],
    subjective: [
      "Have you faced any issues while managing this employee? (Type 'No' if not)",
      "Do you have any suggestions to help the employee improve? (Type 'No' if not)",
    ],
  },
};
