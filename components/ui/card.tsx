import React from "react";

interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, className }) => {
  return (
    <div
      className={`p-4 bg-white dark:bg-gray-600 dark:text-white 0 rounded-md shadow-md ${className}`}
    >
      <h2 className="font-semibold mb-3">{title}</h2>
      {children}
    </div>
  );
};

export default Card;
