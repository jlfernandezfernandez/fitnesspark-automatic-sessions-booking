import React, { useState, useCallback } from "react";
import CustomInput from "@/components/CustomInput";

interface DeactivationFormProps {
  onSubmit: (password: string) => void;
  formTitle: string;
  submitButtonLabel: string;
  error?: string;
}

export default function DeactivationForm({
  onSubmit,
  formTitle,
  submitButtonLabel,
  error,
}: DeactivationFormProps) {
  const [password, setPassword] = useState<string>("");

  const handlePasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
    },
    []
  );

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      onSubmit(password);
    },
    [password, onSubmit]
  );

  return (
    <div
      className="mx-auto max-w-md bg-white dark:bg-gray-800 dark:text-white p-4 rounded-lg shadow-lg"
      role="dialog"
      aria-labelledby="deactivation-form-title"
    >
      <h1
        id="deactivation-form-title"
        className="text-2xl font-bold mb-6 text-center"
      >
        {formTitle}
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <CustomInput
          label="Password"
          name="password"
          type="password"
          bgColor="bg-white dark:bg-gray-800"
          value={password}
          required
          autoComplete="current-password"
          onChange={handlePasswordChange}
        />
        {error && (
          <p className="text-red-500 text-sm" role="alert">
            🔺 {error}
          </p>
        )}
        <button
          type="submit"
          className="bg-yellow-fitnesspark text-black font-bold py-3 rounded focus:outline-none focus:shadow-outline"
          aria-busy={!!error}
        >
          {submitButtonLabel}
        </button>
      </form>
    </div>
  );
}
