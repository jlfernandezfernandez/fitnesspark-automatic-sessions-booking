import React, { useState } from "react";
import CustomInput from "@/components/CustomInput";
import Link from "next/link";

interface UserFormProps {
  onSubmit: (email: string, password: string) => void;
  formTitle: string;
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(email, password);
  };

  return (
    <div className="mx-auto max-w-md bg-white p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-black">
        {formTitle}
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <CustomInput
          label="Email"
          name="email"
          type="email"
          bgColor="bg-white"
          value={email}
          inputMode="email"
          autoFocus
          autoComplete="email"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
        />
        {error && <p className="text-red-500 text-sm">🔺 {error}</p>}
        <CustomInput
          label="Password"
          name="password"
          type="password"
          bgColor="bg-white"
          value={password}
          autoComplete={isRegisterForm ? "new-password" : "current-password"}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
        />
        {isRegisterForm && (
          <p className="text-center text-sm text-gray-600">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/login" className="text-blue-500 hover:text-blue-600">
              Iniciar sesión
            </Link>
          </p>
        )}
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
