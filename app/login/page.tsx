"use client";

import React from "react";
import UserForm from "@/components/UserForm";

export default function LoginPage() {
  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error("Failed to login:", error);
    }
  };

  return (
    <UserForm
      onSubmit={handleLogin}
      formTitle="Bienvenido de nuevo"
      submitButtonLabel="Continuar"
    />
  );
}
