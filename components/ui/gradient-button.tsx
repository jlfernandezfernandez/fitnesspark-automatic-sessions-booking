import React from "react";

interface GradientButtonProps {
  onClick: () => void;
  text: string | React.ReactNode;
  disabled?: boolean;
}

const GradientButton: React.FC<GradientButtonProps> = ({
  onClick,
  text,
  disabled = false,
}) => {
  return (
    <button
      className={`relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium rounded-lg group 
        ${
          disabled
            ? "cursor-not-allowed opacity-50 border border-gray-300"
            : "text-gray-900 bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800"
        }`}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      <span
        className={`relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md ${
          disabled ? "" : "group-hover:bg-opacity-0"
        }`}
      >
        {text}
      </span>
    </button>
  );
};

export default GradientButton;
