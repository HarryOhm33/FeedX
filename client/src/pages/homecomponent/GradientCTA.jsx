import React from "react";
import Button from "./Button";

const animationCSS = `
@keyframes float1 {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(20px) rotate(5deg); }
}

@keyframes float2 {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-30px) rotate(-8deg); }
}

@keyframes float3 {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(15px) rotate(10deg); }
}

@keyframes float4 {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(15deg); }
}

.animate-float1 {
  animation: float1 15s ease-in-out infinite;
}

.animate-float2 {
  animation: float2 20s ease-in-out infinite;
}

.animate-float3 {
  animation: float3 12s ease-in-out infinite;
}

.animate-float4 {
  animation: float4 18s ease-in-out infinite;
}
`;

const GradientCTA = () => {
  return (
    <>
      <style>{animationCSS}</style>

      <section className="w-full bg-gradient-to-r from-teal-400 via-blue-500 to-blue-600 py-12 sm:py-16 lg:py-24 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 sm:w-48 sm:h-48 md:w-64 md:h-64 border-4 border-white/20 rounded-full animate-float1"></div>
          <div className="absolute top-1/2 -right-20 sm:w-72 sm:h-72 md:w-96 md:h-96 border-4 border-white/10 rounded-full animate-float2"></div>
          <div className="absolute -bottom-32 left-1/4 sm:w-56 sm:h-56 md:w-72 md:h-72 border-2 border-white/15 rounded-full animate-float3"></div>

          <div className="absolute bottom-1/4 right-1/4 animate-float4">
            <div
              className="w-0 h-0 
                 border-l-[30px] sm:border-l-[40px] md:border-l-[50px] border-l-transparent
                 border-b-[52px] sm:border-b-[70px] md:border-b-[86px] border-b-white/20
                 border-r-[30px] sm:border-r-[40px] md:border-r-[50px] border-r-transparent"
            ></div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-6">
            Take advantage of our irresistible early-bird offers!
          </h2>
          <p className="text-white text-base sm:text-lg mb-2 max-w-3xl mx-auto">
            Enjoy flexible, pay-as-you-go pricing with no surprises or
            commitments.
          </p>
          <p className="text-white text-base sm:text-lg mb-8 max-w-3xl mx-auto">
            Cancel anytime with no hassle.
          </p>
          <Button className="bg-white text-blue-600 hover:bg-gray-100 px-6 sm:px-8 py-2 sm:py-3 rounded-md text-base sm:text-lg font-medium">
            Grab the Offer
          </Button>
        </div>
      </section>
    </>
  );
};

export default GradientCTA;
