"use client";

import React, { useState, useCallback } from "react";
import UserForm from "@/components/user-form";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useRouter } from "next/navigation";
import { useUser } from "@/providers/UserContext";

export default function LoginPage() {
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false); // Estado de carga
  const { login } = useUser();
  const router = useRouter();

  const loginRequest = useCallback(async (email: string, password: string) => {
    return await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
  }, []);

  const handleError = useCallback((response: Response) => {
    if (response.status === 404) {
      setError("Usuario no encontrado.");
    } else {
      setError("Algo ha salido mal.");
    }
    setIsLoading(false); // Termina la carga en caso de error
  }, []);

  const handleSuccessfulLogin = useCallback(
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

  const handleLoginError = useCallback(() => {
    setError("Algo ha salido mal.");
    setIsLoading(false); // Termina la carga en caso de error
  }, []);

  const handleLogin = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true); // Comienza la carga
      try {
        const response = await loginRequest(email, password);

        if (!response.ok) {
          handleError(response);
          return;
        }

        const userData = await response.json();
        handleSuccessfulLogin(userData);
      } catch (error) {
        handleLoginError();
      }
    },
    [loginRequest, handleError, handleSuccessfulLogin, handleLoginError]
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-800 dark:text-white">
      {isLoading ? ( // Muestra el spinner si está cargando
        <LoadingSpinner size={80} />
      ) : (
        <UserForm
          onSubmit={handleLogin}
          formTitle="Bienvenido de nuevo"
          submitButtonLabel="Continuar"
          error={error}
        />
      )}
    </div>
  );
}
