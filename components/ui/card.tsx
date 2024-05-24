import React from "react";

interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, className }) => {
  return (
    <div
      className={`w-full p-4 bg-white dark:bg-gray-600 0 rounded-md shadow-md ${className}`}
    >
      <h2 className="text-sm font-semibol text-gray-600 dark:text-white mb-3">
        {title}
      </h2>
      {children}
    </div>
  );
};

export default Card;
