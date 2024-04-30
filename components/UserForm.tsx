"use client";

import React, { useState } from "react";
import CustomInput from "@/components/CustomInput";

interface UserFormProps {
  onSubmit: (email: string, password: string) => void;
  formTitle: string;
  submitButtonLabel: string;
}

export default function UserForm({
  onSubmit,
  formTitle,
  submitButtonLabel,
}: UserFormProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(email, password);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white p-4">
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            />
          </div>
          <div className="my-2">
            <CustomInput
              label="Password"
              name="password"
              type="password"
              bgColor="bg-white"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
            />
          </div>
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
