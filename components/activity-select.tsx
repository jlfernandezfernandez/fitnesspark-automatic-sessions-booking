import { ChevronDownIcon } from "lucide-react";
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
    <div className="relative">
      <select
        id="activities"
        className="appearance-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-yellow-fitnesspark focus:border-yellow-fitnesspark block w-full p-2.5 pl-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-yellow-fitnesspark dark:focus:border-yellow-fitnesspark"
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
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
        <ChevronDownIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
      </div>
    </div>
  );
};

export default ActivitySelect;
