import React, { useState, InputHTMLAttributes } from "react";

interface CustomInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  bgColor: string;
  error?: string;
}

const CustomInput = ({
  label,
  name,
  type = "text",
  bgColor,
  error,
  onChange,
  ...rest
}: CustomInputProps) => {
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
    if (onChange) {
      onChange(event);
    }
  };

  return (
    <div
      className={`relative border rounded border-yellow-fitnesspark ${
        error ? "border-red-500" : ""
      }`}
    >
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="appearance-none bg-transparent w-full text-gray-700 focus:outline-none py-3 pl-4"
        aria-label={label}
        {...rest}
        required
      />
      <label
        htmlFor={name}
        className={`absolute top-0 left-0 px-1 transition-all ease-in-out duration-300 ${
          focus || value
            ? `text-xs transform -translate-y-3.5 translate-x-3 text-yellow-fitnesspark ${bgColor}`
            : "text-base text-gray-500 pl-3 pt-1"
        }`}
        style={{ top: "6px" }}
      >
        {label}
      </label>
      {error && <p className="text-red-500 text-xs italic">{error}</p>}
    </div>
  );
};

export default CustomInput;
