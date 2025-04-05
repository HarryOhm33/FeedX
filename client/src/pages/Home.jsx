import React, { useState } from "react";

import CallToAction from "./homecomponent/CallToAction";
import ContactUs from "./homecomponent/ContactUs";
import FAQ from "./homecomponent/FAQ";
import Features from "./homecomponent/Features";
import GradientCTA from "./homecomponent/GradientCTA";
import Hero from "./homecomponent/Hero";
import HowItWorks from "./homecomponent/HowItWorks";
import ScreenshotBenefits from "./homecomponent/ScreenshotBenefits";
import Testimonials from "./homecomponent/Testimonials";

const HomePage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setFormStatus("sending");

    setTimeout(() => {
      setFormStatus("success");

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      setTimeout(() => {
        setFormStatus(null);
      }, 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white relative overflow-x-hidden">
      {/* <AnimatedBackground /> */}

      <div className="absolute z-0 inset-0 overflow-hidden">
        <div className="absolute -left-16 top-40 w-64 h-64 bg-orange-300 rounded-full opacity-70"></div>

        <div className="absolute -right-20 top-80 w-72 h-72 overflow-hidden">
          <div className="w-[300px] h-[300px] border-4 border-green-300 rounded-full opacity-70"></div>
        </div>

        <div className="absolute right-0 top-80 w-[300px] h-[300px] overflow-hidden  rotate-[130deg]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 200 200"
            className="w-full h-full"
          >
            <path
              d="M 30 170 C 80 100, 160 100, 170 180"
              stroke="#F4A261"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />

            <path
              d="M 40 180 C 90 110, 150 110, 160 190"
              stroke="#F4A261"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      <div className="relative z-10">
        <Hero />
        <Features />
        <GradientCTA />
        <ScreenshotBenefits />
        <HowItWorks />
        <Testimonials />
        <FAQ />
        <CallToAction />
        <ContactUs
          formData={formData}
          formStatus={formStatus}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default HomePage;
