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
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const result = await response.json();
        if (response.status === 400) {
          setError("El usuario ya existe.");
          return;
        }
        throw new Error(result.error || "Algo ha salido mal.");
      }

      const result = await response.json();
      login({ ...result.user });
      router.push("/profile");
    } catch (error: any) {
      setError(error.message || "Algo ha salido mal.");
    }
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
