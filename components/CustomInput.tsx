import React, { useState, useEffect } from "react";

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  bgColor: string;
  error?: string;
}

export default function CustomInput({
  label,
  bgColor,
  error,
  ...rest
}: CustomInputProps) {
  const [focus, setFocus] = useState(false);
  const [value, setValue] = useState(rest.value || "");

  const handleFocus = () => setFocus(true);
  const handleBlur = () => {
    if (!value) {
      setFocus(false);
    }
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    if (rest.onChange) {
      rest.onChange(event);
    }
  };

  return (
    <div
      className={`relative border rounded ${bgColor} ${
        error ? "border-red-500" : "border-yellow-fitnesspark"
      }`}
    >
      <input
        {...rest}
        value={value}
        spellCheck="false"
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`appearance-none bg-transparent w-full text-gray-700 focus:outline-none py-3 px-4 ${rest.className}`}
      />
      <label
        htmlFor={rest.name}
        className={`absolute top-0 left-0 px-1 transition-all ease-in-out duration-300 ${
          focus || value
            ? `text-xs transform -translate-y-3.5 translate-x-3 text-yellow-fitnesspark ${bgColor}`
            : "text-base text-gray-500 pl-5 pt-1"
        }`}
        style={{ top: "6px" }}
      >
        {label}
      </label>
      {error && <p className="text-red-500 text-xs italic">{error}</p>}
    </div>
  );
}
