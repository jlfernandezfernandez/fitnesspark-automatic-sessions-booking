"use client";

import { useState } from "react";
import CustomInput from "@/components/CustomInput";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error("Failed to register:", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white p-4">
      <div className="rounded w-full max-w-md">
        <h1 className="text-3xl font-bold mb-10 text-center text-black">
          Crear una cuenta
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <CustomInput
              label="Email"
              name="email"
              type="email"
              bgColor="bg-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-8">
            <CustomInput
              label="Password"
              name="password"
              type="password"
              bgColor="bg-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-fitnesspark text-gray-fitnesspark font-semibold py-4 px-5 rounded focus:outline-none focus:shadow-outline"
          >
            Continuar
          </button>
        </form>
      </div>
    </div>
  );
}
