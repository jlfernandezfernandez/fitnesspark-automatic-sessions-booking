import React from "react";

interface ActivitySelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
}

const ActivitySelect: React.FC<ActivitySelectProps> = ({
  value,
  onChange,
  required = false,
}) => {
  return (
    <select
      id="activities"
      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      value={value}
      onChange={onChange}
      required={required}
    >
      <option value="" disabled>
        Elige una clase
      </option>
      <option value="BODY COMBAT">Body Combat</option>
      <option value="BODY PUMP">Body Pump</option>
      <option value="CYCLE PARK">Cycle Park</option>
      <option value="CROSS TRAINING">Cross Training</option>
      <option value="PILATES">Pilates</option>
    </select>
  );
};

export default ActivitySelect;
