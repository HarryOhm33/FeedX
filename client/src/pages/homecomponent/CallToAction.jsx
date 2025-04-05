import React from "react";
import Button from "./Button";

const CallToAction = () => {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Ready to Improve Your Workplace?
        </h2>
        <p className="text-gray-600 max-w-3xl mx-auto mb-8">
          Join hundreds of companies that have transformed their workplace
          culture with our employee feedback system.
        </p>
        <Button className="bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-500 hover:to-blue-600 text-white px-8 py-3 rounded-md text-lg font-medium">
          Get Started Today
        </Button>
        <p className="mt-4 text-sm text-gray-500">
          No credit card required • Free 14-day trial
        </p>
      </div>
    </section>
  );
};

export default CallToAction;
