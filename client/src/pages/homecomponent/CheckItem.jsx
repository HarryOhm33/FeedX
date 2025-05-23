import React from "react";

const CheckItem = ({ children }) => {
  return (
    <div className="flex items-start mb-4">
      <div className="flex-shrink-0 mt-1">
        <svg
          className="w-5 h-5 text-blue-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          ></path>
        </svg>
      </div>
      <p className="ml-3 text-gray-600">{children}</p>
    </div>
  );
};

export default CheckItem;
