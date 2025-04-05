import React from "react";

const Button = ({ children, className, onClick, type, disabled }) => {
  return (
    <button
      className={`cursor-pointer !important ${className}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
