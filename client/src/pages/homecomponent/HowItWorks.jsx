import React from "react";

const HowItWorks = () => {
  return (
    <section className="py-16 px-4 bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-lg relative">
            <div className="w-12 h-12 flex items-center justify-center bg-blue-500 text-white rounded-full font-bold text-xl mb-4">
              1
            </div>
            <h3 className="text-2xl font-semibold text-blue-500">
              Customize Surveys
            </h3>
            <p className="mt-4 text-gray-600">
              Create surveys based on the specific areas you want to gather
              feedback on, such as work-life balance, communication, leadership,
              and more.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-lg relative">
            <div className="w-12 h-12 flex items-center justify-center bg-blue-500 text-white rounded-full font-bold text-xl mb-4">
              2
            </div>
            <h3 className="text-2xl font-semibold text-blue-500">
              Collect Feedback
            </h3>
            <p className="mt-4 text-gray-600">
              Employees can submit their feedback easily via a simple and
              user-friendly interface, with options for both anonymous and
              identified responses.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-lg relative">
            <div className="w-12 h-12 flex items-center justify-center bg-blue-500 text-white rounded-full font-bold text-xl mb-4">
              3
            </div>
            <h3 className="text-2xl font-semibold text-blue-500">
              Analyze and Act
            </h3>
            <p className="mt-4 text-gray-600">
              HR teams can view real-time reports, trends, and insights to
              identify potential issues and take actionable steps to improve the
              work environment.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
