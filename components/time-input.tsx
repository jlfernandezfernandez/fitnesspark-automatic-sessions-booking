import React, { useState, useRef, useEffect } from "react";

interface TimeInputProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

const TimeInput: React.FC<TimeInputProps> = ({
  value,
  onChange,
  required = false,
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 9; hour <= 21; hour++) {
      const hourStr = hour.toString().padStart(2, "0");
      times.push(`${hourStr}:00`, `${hourStr}:30`);
    }
    return times;
  };

  const times = generateTimeOptions();

  const handleChange = (time: string) => {
    onChange(time);
    setShowOptions(false);
  };

  return (
    <div ref={ref} className="relative w-full">
      <div
        className={`flex items-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus-within:ring-yellow-fitnesspark focus-within:border-yellow-fitnesspark cursor-pointer ${
          showOptions
            ? " ring-yellow-fitnesspark border-yellow-fitnesspark"
            : ""
        }`}
        onClick={() => setShowOptions(!showOptions)}
      >
        <div className="pl-1 flex-1">{value || "Seleccionar hora"}</div>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <svg
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fillRule="evenodd"
              d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      {showOptions && (
        <div className="absolute z-10 mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-32 sm:max-h-48 overflow-y-auto w-full">
          {times.map((time) => (
            <div
              key={time}
              className="cursor-pointer text-sm px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 dark:text-white"
              onMouseDown={(e) => e.preventDefault()} // Prevents the menu from closing immediately on click
              onClick={() => handleChange(time)}
            >
              {time}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TimeInput;
