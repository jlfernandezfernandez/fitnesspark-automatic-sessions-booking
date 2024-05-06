"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/providers/UserContext";
import UserForm from "@/components/UserForm";

export default function RegisterPage() {
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const { login } = useUser();

  const handleRegister = async (email: string, password: string) => {
    try {
      const response = await registerRequest(email, password);

      if (!response.ok) {
        handleError(response);
        return;
      }

      const userData = await response.json();
      handleSuccessfulRegister(userData);
    } catch (error: any) {
      handleRegisterError();
    }
  };

  const registerRequest = async (email: string, password: string) => {
    return await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
  };

  const handleError = async (response: Response) => {
    if (response.status === 404) {
      setError("Usuario no encontrado.");
    } else {
      setError("Algo ha salido mal.");
    }
  };

  const handleSuccessfulRegister = (userData: any) => {
    if (userData.user) {
      login({ ...userData.user });
      router.push("/profile");
    }
  };

  const handleRegisterError = () => {
    setError("Algo ha salido mal.");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <UserForm
        onSubmit={handleRegister}
        formTitle="Crear una cuenta"
        submitButtonLabel="Continuar"
        isRegisterForm
        error={error}
      />
    </div>
  );
}
