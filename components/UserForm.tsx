"use client";

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      <div className="rounded w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-black">
          {formTitle}
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="my-2">
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
            {error && <p className="text-red-500 text-sm mt-2">🔺 {error}</p>}
          </div>
          <div className="my-2">
            <CustomInput
              label="Password"
              name="password"
              type="password"
              bgColor="bg-white"
              value={password}
              autoComplete={
                isRegisterForm ? "new-password" : "current-password"
              }
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
            />
          </div>
          {isRegisterForm && (
            <p className="mt-4 text-center text-sm text-gray-600">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/login" className="text-blue-500 hover:text-blue-600">
                Iniciar sesión
              </Link>
            </p>
          )}
          <button
            type="submit"
            className="mt-6 w-full bg-yellow-fitnesspark text-black font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {submitButtonLabel}
          </button>
        </form>
      </div>
    </div>
  );
}
