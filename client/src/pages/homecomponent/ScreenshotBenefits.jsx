import React from "react";
import Button from "./Button";
import CheckItem from "./CheckItem";
import image from "../../assets/image.png";

const ScreenshotBenefits = () => {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 relative">
            <div className="bg-orange-200 w-full h-full absolute -top-4 -left-4 rounded-lg"></div>
            <div className="relative z-10 bg-white p-4 rounded-lg shadow-xl">
              <img
                src={image}
                alt="Dashboard Screenshot"
                className="rounded w-full"
              />
            </div>
          </div>
          <div className="lg:w-1/2 lg:pl-16 mt-12 lg:mt-0">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Centralized Employee Data, Streamline Profiles, Scale with Your
              Team
            </h2>
            <CheckItem>Effortlessly bulk upload employee data</CheckItem>
            <CheckItem>Access Employee documents instantly</CheckItem>
            <CheckItem>Enjoy mobile-friendly Employee Self-Service</CheckItem>
            <CheckItem>Easily track Employee History</CheckItem>
            <CheckItem>
              Generate actionable insights from feedback data
            </CheckItem>
            <Button className="mt-8 bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-500 hover:to-blue-600 text-white px-6 py-3 rounded-md font-medium">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScreenshotBenefits;
