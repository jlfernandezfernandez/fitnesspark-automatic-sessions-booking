"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@/providers/UserContext";
import UserForm from "@/components/UserForm";
import Modal from "@/components/Modal";
import loginToFitnessPark from "@/domain/FitnessParkLink";

export default function ProfilePage() {
  const { user, logout } = useUser();
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setModalOpen(!!user && !user.isLinked);
  }, [user]);

  const handleLinkFitnessPark = async (email: string, password: string) => {
    try {
      const isLinked = await loginToFitnessPark(email, password);
      if (isLinked) {
        setModalOpen(false);
        // Actualizar el estado isLinked del usuario según la respuesta de la API
      } else {
        throw new Error("No se pudo vincular la cuenta");
      }
    } catch (error) {
      console.error("Error al vincular la cuenta:", error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      {user ? (
        <div>
          <h1 className="text-2xl font-bold">Bienvenido, {user.email}</h1>
          <h2 className="text-lg font-semibold mt-2">
            {user.isLinked ? "Conectado con FitnessPark" : "No conectado"}
          </h2>
          <button
            className="mt-4 px-4 py-2 rounded border border-gray-300 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            onClick={logout}
          >
            Cerrar sesión
          </button>
          <Modal isOpen={isModalOpen}>
            <UserForm
              onSubmit={handleLinkFitnessPark}
              formTitle="Conectar con FitnessPark"
              submitButtonLabel="Conectar"
            />
          </Modal>
        </div>
      ) : (
        <p>No hay usuario conectado.</p>
      )}
    </div>
  );
}
