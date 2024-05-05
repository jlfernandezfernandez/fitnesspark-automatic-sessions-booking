"use client";

import React, { useState } from "react";
import UserForm from "@/components/UserForm";
import { useRouter } from "next/navigation";
import { useUser } from "@/providers/UserContext";

export default function LoginPage() {
  const [error, setError] = useState<string>("");
  const { login } = useUser();
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await loginRequest(email, password);

      if (!response.ok) {
        handleError(response);
      }

      const userData = await response.json();
      handleSuccessfulLogin(userData);
    } catch (error) {
      handleLoginError();
    }
  };

  const loginRequest = async (email: string, password: string) => {
    return await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
  };

  const handleError = async (response: Response) => {
    if (response.status === 400) {
      setError("Usuario no encontrado.");
    } else {
      setError("Algo ha salido mal.");
    }
  };

  const handleSuccessfulLogin = (userData: any) => {
    login({ ...userData.user });
    router.push("/profile");
  };

  const handleLoginError = () => {
    setError("Algo ha salido mal.");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <UserForm
        onSubmit={handleLogin}
        formTitle="Bienvenido de nuevo"
        submitButtonLabel="Continuar"
        error={error}
      />
    </div>
  );
}
