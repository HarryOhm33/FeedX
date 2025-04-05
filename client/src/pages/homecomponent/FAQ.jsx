import React from "react";

const FAQ = () => {
  return (
    <section className="py-16 px-4 bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">
          Frequently Asked Questions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-blue-500 mb-3">
              How secure is the employee data?
            </h3>
            <p className="text-gray-600">
              We use enterprise-grade security measures to protect all employee
              data. Our platform is fully compliant with data protection
              regulations, ensuring that all information remains secure and
              confidential.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-blue-500 mb-3">
              Can we customize the feedback questions?
            </h3>
            <p className="text-gray-600">
              Yes! Our platform allows you to create custom surveys with
              questions tailored to your organization's specific needs. You can
              also use our pre-built templates as a starting point.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-blue-500 mb-3">
              How often should we collect feedback?
            </h3>
            <p className="text-gray-600">
              We recommend a combination of regular pulse surveys (weekly or
              biweekly) for specific topics and more comprehensive surveys
              quarterly. Our system makes it easy to schedule and automate these
              surveys.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-blue-500 mb-3">
              Can we integrate with other HR systems?
            </h3>
            <p className="text-gray-600">
              Yes, our platform offers seamless integration with popular HRIS,
              payroll, and performance management systems, allowing for a
              unified employee data experience.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
