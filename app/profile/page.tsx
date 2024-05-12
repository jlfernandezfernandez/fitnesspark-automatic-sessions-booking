"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@/providers/UserContext";
import UserForm from "@/components/UserForm";
import Modal from "@/components/Modal";
import Footer from "@/components/Footer";
import DeactivationForm from "@/components/DesactivationForm";
import WeeklyView from "@/components/WeeklyView";
import {
  checkFitnessParkLink,
  loginToFitnessPark,
} from "@/services/FitnessParkService";
import { UserProps } from "@/model/UserData";

export default function ProfilePage() {
  const [error, setError] = useState<string>("");
  const { user, logout, updateUserData, reservations } = useUser();
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
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-800 dark:text-white w-full">
      {user ? (
        <div className="flex flex-col flex-grow w-full px-4">
          <header className="flex items-center justify-between py-4 mb-4">
            <h1 className="m-2 flex-grow text-gray-400">
              <span className="text-3xl md:text-5xl font-bold italic animate-text bg-gradient-to-r from-teal-500 via-purple-500 to-orange-500 bg-clip-text text-transparent pr-2">
                Autobooking
              </span>
            </h1>
            <button
              className="px-4 py-2 text-sm rounded-lg border border-gray-300 shadow-sm bg-white text-gray-700 hover:bg-gray-200 transition duration-300"
              onClick={logout}
            >
              Desconectar
            </button>
          </header>
          <div className="flex-grow flex items-center justify-center mb-2">
            <WeeklyView reservations={reservations} userId={user.id} />
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
          <div className="flex justify-end px-4 py-2 mb-2">
            <button
              onClick={handleOpenConfirmationModal}
              className="px-4 py-2 text-sm rounded-lg border border-red-500 shadow-sm bg-red-500 text-white hover:bg-red-600 transition duration-300"
            >
              Desactivar cuenta
            </button>
          </div>
        </div>
      ) : (
        <h1 className="flex flex-grow items-center justify-center text-3xl font-bold px-4 py-2 w-full">
          Cargando...
        </h1>
      )}
      <Footer isLinked={user?.isLinked} />
    </div>
  );
}
