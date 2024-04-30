"use client";

import { useUser } from "@/providers/UserContext";
import UserForm from "@/components/UserForm";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useUser(); // Obtén la función login del contexto de usuario

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
        throw new Error("Something went wrong");
      }

      const result = await response.json();

      login({ email: result.user.email });

      router.push("/profile");
    } catch (error) {
      console.error("Failed to register:", error);
    }
  };

  return (
    <UserForm
      onSubmit={handleRegister}
      formTitle="Crear una cuenta"
      submitButtonLabel="Continuar"
    />
  );
}
