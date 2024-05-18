"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useUser } from "@/providers/UserContext";
import UserForm from "@/components/user-form";
import Modal from "@/components/Modal";
import DeactivationForm from "@/components/deactivation-form";
import WeeklyView from "@/components/WeeklyView";
import LoadingSpinner from "@/components/ui/loading-spinner";
import {
  checkFitnessParkLink,
  loginToFitnessPark,
  unlinkFromFitnessPark,
} from "@/services/FitnessParkService";
import { UserProps } from "@/model/UserData";
import Footer from "@/components/ui/footer";

export default function ProfilePage() {
  const [error, setError] = useState<string>("");
  const { user, logout, updateUserData, reservations } = useUser();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const updateUserOnServer = useCallback(async (newUserData: UserProps) => {
    const response = await fetch("/api/user", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUserData),
    });

    if (!response.ok) {
      throw new Error("Failed to update user");
    }
  }, []);

  const handleSuccessfulLink = useCallback(
    async (fitnesspark_email: string, fitnesspark_password: string) => {
      setIsLoading(true);
      setError("");
      if (user) {
        try {
          const newUserData = {
            ...user,
            isLinked: true,
            fitnesspark_email,
            fitnesspark_password,
          };
          await updateUserOnServer(newUserData);
          updateUserData(newUserData);
          setModalOpen(false);
        } catch (error) {
          setError("No se pudo actualizar el usuario.");
        } finally {
          setIsLoading(false);
        }
      }
    },
    [user, updateUserData, updateUserOnServer]
  );

  const handleLinkFitnessPark = useCallback(
    async (fitnesspark_email: string, fitnesspark_password: string) => {
      setIsLoading(true);
      setError("");
      try {
        const isLinked = await loginToFitnessPark(
          fitnesspark_email,
          fitnesspark_password
        );
        if (isLinked) {
          await handleSuccessfulLink(fitnesspark_email, fitnesspark_password);
        } else {
          setError("Revisa las credenciales.");
        }
      } catch (error) {
        setError("Algo ha salido mal.");
      } finally {
        setIsLoading(false);
      }
    },
    [handleSuccessfulLink]
  );

  const handleUnlinkFitnessPark = useCallback(async () => {
    setIsLoading(true);
    setError("");
    if (user) {
      try {
        await unlinkFromFitnessPark(user.id);
        updateUserData({
          ...user,
          isLinked: false,
          fitnesspark_email: "",
          fitnesspark_password: "",
        });
        alert("Cuenta de Fitness Park desvinculada.");
      } catch (error) {
        setError("No se pudo desvincular la cuenta de Fitness Park.");
        alert("No se pudo desvincular la cuenta de Fitness Park.");
      } finally {
        setIsLoading(false);
      }
    }
  }, [user, updateUserData]);

  const deactivateUserOnServer = useCallback(async (userId: number) => {
    const response = await fetch("/api/user/deactivate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error("Failed to deactivate user");
    }
  }, []);

  const handleOpenConfirmationModal = useCallback(() => {
    setConfirmationModalOpen(true);
  }, []);

  const handleCloseConfirmationModal = useCallback(() => {
    setConfirmationModalOpen(false);
  }, []);

  const handleConfirmDeactivation = useCallback(async () => {
    setIsLoading(true);
    setError("");
    if (user) {
      try {
        await deactivateUserOnServer(user.id);
        handleCloseConfirmationModal();
        logout();
      } catch (error) {
        setError(
          "No se pudo desactivar la cuenta. Por favor, verifica tu contraseña."
        );
        alert(
          "No se pudo desactivar la cuenta. Por favor, verifica tu contraseña."
        );
      } finally {
        setIsLoading(false);
      }
    }
  }, [user, logout, deactivateUserOnServer, handleCloseConfirmationModal]);

  useEffect(() => {
    if (user) {
      checkFitnessParkLink(user).then((isLinked) => {
        setModalOpen(!isLinked);
        if (user.isLinked !== isLinked) {
          updateUserData({ ...user, isLinked });
        }
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, [user, updateUserData]);

  useEffect(() => {
    if (user) {
      setIsLoading(false);
    }
  }, [user]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-800 dark:text-white w-full">
      {isLoading || !user ? (
        <div className="flex flex-grow items-center justify-center">
          <LoadingSpinner size={80} />
        </div>
      ) : (
        <div className="flex flex-col flex-grow w-full px-4 sm:px-8">
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
              formTitle="Vincula tu cuenta de Fitness Park"
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
          <div className="flex justify-end px-4 py-2 mb-2 space-x-2">
            <button
              onClick={handleUnlinkFitnessPark}
              className="px-4 py-2 text-sm rounded-lg border border-yellow-500 shadow-sm bg-yellow-500 text-white hover:bg-yellow-600 transition duration-300"
            >
              Desconectar de Fitness Park
            </button>
            <button
              onClick={handleOpenConfirmationModal}
              className="px-4 py-2 text-sm rounded-lg border border-red-500 shadow-sm bg-red-500 text-white hover:bg-red-600 transition duration-300"
            >
              Borrar cuenta
            </button>
          </div>
        </div>
      )}
      <Footer isLinked={user?.isLinked} />
    </div>
  );
}
