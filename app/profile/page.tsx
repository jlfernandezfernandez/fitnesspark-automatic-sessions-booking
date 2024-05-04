"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@/providers/UserContext";
import UserForm from "@/components/UserForm";
import Modal from "@/components/Modal";
import loginToFitnessPark from "@/domain/FitnessParkLink";
import Footer from "@/components/Footer";

export default function ProfilePage() {
  const { user, logout, setIsLinked } = useUser();
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setModalOpen(!!user && !user.isLinked);
  }, [user]);

  const handleLinkFitnessPark = async (email: string, password: string) => {
    try {
      const isLinked = await loginToFitnessPark(email, password);
      if (isLinked) {
        setModalOpen(false);
        setIsLinked(true);
      } else {
        throw new Error("No se pudo vincular la cuenta");
      }
    } catch (error) {
      console.error("Error al vincular la cuenta:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-grow justify-center items-center">
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
                formTitle="Vincula tu cuenta de FitnessPark"
                submitButtonLabel="Conectar"
              />
            </Modal>
          </div>
        ) : (
          <p>No hay usuario conectado.</p>
        )}
      </div>
      <Footer>
        <h2>
          {user && user.isLinked ? (
            <span className="text-green-600">
              🟢 Conectado con Fitness Park
            </span>
          ) : (
            <span className="text-red-600">
              🔴 Desconectado de Fitness Park
            </span>
          )}
        </h2>
      </Footer>
    </div>
  );
}
