import { motion } from "framer-motion";
import React from "react";

const Loader = () => {
  const spinTransition = {
    loop: Infinity,
    ease: "linear",
    duration: 1,
    repeat: Infinity,
  };

  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="relative w-20 h-20">
        {/* Outer spinning ring with gradient */}
        <motion.div
          className="absolute inset-0 rounded-full border-3 border-t-transparent border-l-transparent"
          style={{
            borderRightColor: "#00E0FF", // Aqua
            borderBottomColor: "#00C9FF", // Slightly deeper aqua
          }}
          animate={{ rotate: 360 }}
          transition={spinTransition}
        />

        {/* Inner spinning ring with different gradient */}
        <motion.div
          className="absolute inset-3 rounded-full border-3 border-t-transparent border-r-transparent"
          style={{
            borderLeftColor: "#00FFC2", // Aqua-green
            borderBottomColor: "#00FF88", // Green
          }}
          animate={{ rotate: -360 }}
          transition={spinTransition}
        />

        {/* Loading text with gradient letters */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex space-x-0.5 ml-1">
            {["L", "o", "a", "d", "i", "n", "g", "."].map((char, index) => (
              <motion.span
                key={index}
                className="font-medium text-sm"
                style={{
                  background: `linear-gradient(135deg, #00E0FF ${
                    index * 10
                  }%, #00FF88 100%)`,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
                initial={{ y: 0 }}
                animate={{ y: [0, -3, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  delay: index * 0.1,
                }}
              >
                {char}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Loader;
