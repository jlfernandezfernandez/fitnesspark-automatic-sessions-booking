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
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const result = await response.json();
        if (response.status === 404) {
          setError("El usuario no existe.");
          return;
        }
        throw new Error(result.error || "Algo ha salido mal.");
      }

      const result = await response.json();
      login({ email: result.user.email, isLinked: result.user.isLinked });
      router.push("/profile");
    } catch (error) {
      setError("Algo ha salido mal.");
    }
  };

  return (
    <UserForm
      onSubmit={handleLogin}
      formTitle="Bienvenido de nuevo"
      submitButtonLabel="Continuar"
      error={error}
    />
  );
}
