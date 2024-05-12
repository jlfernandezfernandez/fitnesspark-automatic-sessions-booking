import React, { useState } from "react";
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(password);
  };

  return (
    <div className="mx-auto max-w-md bg-white dark:bg-gray-800 dark:text-white p-4">
      <h1 className="text-2xl font-bold mb-6 text-center ">{formTitle}</h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <CustomInput
          label="Password"
          name="password"
          type="password"
          bgColor="bg-white dark:bg-gray-800"
          value={password}
          required
          autoComplete="current-password"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
        />
        {error && <p className="text-red-500 text-sm">🔺 {error}</p>}
        <button
          type="submit"
          className="bg-yellow-fitnesspark text-black font-bold py-3 rounded focus:outline-none focus:shadow-outline"
        >
          {submitButtonLabel}
        </button>
      </form>
    </div>
  );
}
