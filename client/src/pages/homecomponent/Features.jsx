import React from "react";

const Features = () => {
  return (
    <section className="py-16 px-4 bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">
          Key Features of the Feedback System
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold text-blue-500">
              Anonymous Feedback
            </h3>
            <p className="mt-4 text-gray-600">
              Employees can provide feedback anonymously, ensuring honesty and
              openness without fear of retaliation.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold text-blue-500">
              Real-Time Insights
            </h3>
            <p className="mt-4 text-gray-600">
              HR can access real-time feedback and insights, allowing them to
              make timely improvements based on employee sentiments.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold text-blue-500">
              Customizable Surveys
            </h3>
            <p className="mt-4 text-gray-600">
              Tailor surveys to meet the needs of your organization, gathering
              feedback on specific aspects like work culture, management, or
              office environment.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
