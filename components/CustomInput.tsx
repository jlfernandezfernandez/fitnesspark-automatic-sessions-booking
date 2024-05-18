import React, { useState, useCallback } from "react";

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

  const handleFocus = useCallback(() => setFocus(true), []);
  const handleBlur = useCallback(() => {
    if (!value) {
      setFocus(false);
    }
  }, [value]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue(event.target.value);
      if (rest.onChange) {
        rest.onChange(event);
      }
    },
    [rest]
  );

  return (
    <div
      className={`relative border rounded ${bgColor} dark:text-white ${
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
        aria-invalid={!!error}
        aria-describedby={error ? `${rest.name}-error` : undefined}
        className={`appearance-none bg-transparent w-full dark:text-white text-gray-700 focus:outline-none py-3 px-4 ${rest.className}`}
      />
      <label
        htmlFor={rest.name}
        className={`absolute top-0 left-0 px-1 transition-all ease-in-out duration-300 ${
          focus || value
            ? `text-xs transform -translate-y-3.5 translate-x-3 text-yellow-fitnesspark ${bgColor}`
            : "text-base dark:text-white text-gray-500 pl-5 pt-1"
        }`}
        style={{ top: "6px" }}
      >
        {label}
      </label>
      {error && (
        <p id={`${rest.name}-error`} className="text-red-500 text-xs italic">
          {error}
        </p>
      )}
    </div>
  );
}
