"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@/providers/UserContext";
import UserForm from "@/components/UserForm";
import Modal from "@/components/Modal";
import Footer from "@/components/Footer";
import {
  checkFitnessParkLink,
  loginToFitnessPark,
} from "@/services/FitnessParkService";
import { UserProps } from "@/model/UserData";
import DeactivationForm from "@/components/DesactivationForm";
import SessionsView from "@/components/SessionsView";

export default function ProfilePage() {
  const [error, setError] = useState<string>("");
  const { user, logout, updateUserData } = useUser();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      checkFitnessParkLink(user).then((isLinked) => {
        setModalOpen(!isLinked);
        updateUserData({ ...user, isLinked });
      });
    }
  }, [user?.isLinked]);

  const handleLinkFitnessPark = async (
    fitnesspark_email: string,
    fitnesspark_password: string
  ) => {
    try {
      const isLinked = await loginToFitnessPark(
        fitnesspark_email,
        fitnesspark_password
      );
      if (isLinked) {
        handleSuccessfulLink(fitnesspark_email, fitnesspark_password);
      } else {
        setError("Revisa las credenciales.");
      }
    } catch (error) {
      setError("Algo ha salido mal.");
    }
  };

  const handleSuccessfulLink = async (
    fitnesspark_email: string,
    fitnesspark_password: string
  ) => {
    if (user) {
      try {
        const newUserData = {
          ...user,
          isLinked: true,
          fitnesspark_email,
          fitnesspark_password,
        };
        updateUserOnServer(newUserData);
        updateUserData(newUserData);
        setModalOpen(false);
      } catch (error) {
        setError("No se pudo actualizar el usuario.");
      }
    }
  };

  const updateUserOnServer = async (newUserData: UserProps) => {
    const response = await fetch("/api/user", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newUserData,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update user");
    }
  };

  const handleOpenConfirmationModal = () => {
    setConfirmationModalOpen(true);
  };

  const handleCloseConfirmationModal = () => {
    setConfirmationModalOpen(false);
  };

  const handleConfirmDeactivation = async () => {
    if (user) {
      try {
        await deactivateUserOnServer(user.id);
        handleCloseConfirmationModal();
        logout();
      } catch (error) {
        setError(
          "No se pudo desactivar la cuenta. Por favor, verifica tu contraseña."
        );
      }
    }
  };

  const deactivateUserOnServer = async (userId: number) => {
    const response = await fetch("/api/user/deactivate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to deactivate user");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 w-full">
      {user ? (
        <div className="flex flex-grow w-full relative">
          <div className="flex flex-col space-y-4 p-4 w-full">
            <header className="flex items-center space-x-8 w-full">
              <h1 className="text-3xl font-bold flex-grow">
                ¡Bienvenido, {user.email}!
              </h1>
              <button
                className="px-4 py-2 rounded-lg border border-gray-300 shadow-sm bg-white text-gray-700 hover:bg-gray-200 transition-colors duration-300"
                onClick={logout}
              >
                Cerrar sesión
              </button>
            </header>
            <div className="flex flex-grow justify-center items-center w-full">
              <SessionsView
                sessions={{ mon: [], tue: [], wed: [], thu: [], fri: [] }}
              />
            </div>
          </div>
          <Modal isOpen={isModalOpen}>
            <UserForm
              onSubmit={handleLinkFitnessPark}
              formTitle="Vincula tu cuenta de FitnessPark"
              submitButtonLabel="Conectar"
              error={error}
            />
          </Modal>
          <Modal
            isOpen={isConfirmationModalOpen}
            closeButtonActive
            onClose={handleCloseConfirmationModal}
          >
            <h2>Confirmar desactivación de cuenta</h2>
            <DeactivationForm
              onSubmit={handleConfirmDeactivation}
              formTitle="Ingresa tu contraseña para confirmar"
              submitButtonLabel="Confirmar"
              error={error}
            />
          </Modal>
          <div className="absolute bottom-0 right-0 p-4">
            <button
              onClick={handleOpenConfirmationModal}
              className="px-4 py-2 rounded-lg border border-red-500 shadow-sm bg-red-500 text-white hover:bg-red-600 transition-colors duration-300"
            >
              Desactivar cuenta
            </button>
          </div>
        </div>
      ) : (
        <h1 className="text-3xl font-bold p-4 w-full">Cargando...</h1>
      )}
      <Footer isLinked={user?.isLinked} />
    </div>
  );
}
