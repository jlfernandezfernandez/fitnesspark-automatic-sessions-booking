"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/providers/UserContext";
import UserForm from "@/components/UserForm";
import LoadingSpinner from "@/components/ui/loading-spinner";

export default function RegisterPage() {
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { login } = useUser();

  const handleRegister = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      try {
        const response = await registerRequest(email, password);

        if (!response.ok) {
          handleError(response);
          return;
        }

        const userData = await response.json();
        handleSuccessfulRegister(userData);
      } catch (error) {
        handleRegisterError();
      }
    },
    [login]
  );

  const registerRequest = useCallback(
    async (email: string, password: string) => {
      return await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
    },
    []
  );

  const handleError = useCallback((response: Response) => {
    if (response.status === 404) {
      setError("Usuario no encontrado.");
    } else {
      setError("Algo ha salido mal.");
    }
    setIsLoading(false);
  }, []);

  const handleSuccessfulRegister = useCallback(
    (userData: any) => {
      if (userData.user) {
        login({ ...userData.user });
        router.push("/profile");
      } else {
        setIsLoading(false);
      }
    },
    [login, router]
  );

  const handleRegisterError = useCallback(() => {
    setError("Algo ha salido mal.");
    setIsLoading(false);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-800 dark:text-white">
      {isLoading ? (
        <LoadingSpinner size={80} />
      ) : (
        <UserForm
          onSubmit={handleRegister}
          formTitle="Crear una cuenta"
          submitButtonLabel="Continuar"
          isRegisterForm
          error={error}
        />
      )}
    </div>
  );
}
