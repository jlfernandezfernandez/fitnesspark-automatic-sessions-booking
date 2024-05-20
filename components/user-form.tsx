import React, { useState, useCallback } from "react";
import CustomInput from "@/components/CustomInput";
import Link from "next/link";

interface UserFormProps {
  onSubmit: (email: string, password: string) => void;
  formTitle?: string;
  submitButtonLabel: string;
  error?: string;
  isRegisterForm?: boolean;
}

export default function UserForm({
  onSubmit,
  formTitle,
  submitButtonLabel,
  error,
  isRegisterForm = false,
}: UserFormProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value),
    []
  );

  const handlePasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value),
    []
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(email, password);
  };

  return (
    <div className="mx-auto max-w-md bg-white dark:bg-gray-800 dark:text-white text-black p-6 rounded-lg shadow-lg">
      {formTitle && (
        <h1 className="text-3xl font-semibold mb-6 text-center">{formTitle}</h1>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <CustomInput
          label="Email"
          name="email"
          type="email"
          bgColor="bg-white dark:bg-gray-800"
          value={email}
          required
          inputMode="email"
          autoFocus
          autoComplete="email"
          onChange={handleEmailChange}
        />
        {error && <p className="text-red-500 text-sm">🔺 {error}</p>}
        <CustomInput
          label="Password"
          name="password"
          type="password"
          bgColor="bg-white dark:bg-gray-800"
          value={password}
          required
          autoComplete={isRegisterForm ? "new-password" : "current-password"}
          onChange={handlePasswordChange}
        />
        {isRegisterForm && (
          <p className="text-center text-sm dark:text-white text-gray-600">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/login" className="text-blue-500 hover:text-blue-600">
              Iniciar sesión
            </Link>
          </p>
        )}
        <button
          type="submit"
          className={`bg-yellow-fitnesspark text-black font-bold py-3 rounded focus:outline-none focus:shadow-outline ${
            !email || !password ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={!email || !password}
        >
          {submitButtonLabel}
        </button>
      </form>
    </div>
  );
}
