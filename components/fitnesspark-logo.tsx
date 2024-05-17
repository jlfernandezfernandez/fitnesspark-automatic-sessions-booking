import React from "react";

interface FitnessParkLogoProps {
  size?: string;
  underlineOffset?: string;
}

const FitnessParkLogo: React.FC<FitnessParkLogoProps> = ({
  size = "text-base",
  underlineOffset = "underline-offset-4",
}) => {
  return (
    <span
      className={`italic font-semibold text-gray-fitnesspark font-cactus underline decoration-yellow-fitnesspark ${size} ${underlineOffset}`}
    >
      FITNESS PARK
    </span>
  );
};

export default FitnessParkLogo;
