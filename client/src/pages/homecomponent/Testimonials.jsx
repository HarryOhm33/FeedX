import React from "react";

const Testimonials = () => {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">
          Success Stories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-100 p-8 rounded-lg">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 font-bold text-xl">
                  T
                </div>
              </div>
              <div className="ml-4">
                <p className="text-gray-800 italic mb-4">
                  "Our employee satisfaction scores have improved significantly
                  since we implemented this system. It's easy to use, and we can
                  see the impact in our team morale."
                </p>
                <p className="font-semibold">HR Manager, TechCorp</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-100 p-8 rounded-lg">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 font-bold text-xl">
                  I
                </div>
              </div>
              <div className="ml-4">
                <p className="text-gray-800 italic mb-4">
                  "The ability to collect real-time feedback has allowed us to
                  address issues as they arise, improving retention and overall
                  employee happiness."
                </p>
                <p className="font-semibold">HR Director, Innovate Inc.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
