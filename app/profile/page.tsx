"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useUser } from "@/providers/UserContext";
import { CarouselModal } from "@/components/carousel-modal";
import DeactivationForm from "@/components/deactivation-form";
import WeeklyView from "@/components/WeeklyView";
import LoadingSpinner from "@/components/ui/loading-spinner";
import Card from "@/components/ui/card";
import FailedReservationsList from "@/components/failed-reservations-list";
import {
  checkFitnessParkLink,
  loginToFitnessPark,
  unlinkFromFitnessPark,
} from "@/services/FitnessParkService";
import { UserProps } from "@/model/UserData";
import Footer from "@/components/ui/footer";
import Modal from "@/components/Modal";

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
        <div className="flex flex-col flex-grow w-full p-4 sm:p-8">
          <div className="flex-grow flex items-center justify-center mb-4">
            <Card title="Planning Semanal">
              <WeeklyView reservations={reservations} userId={user.id} />
            </Card>
          </div>
          <div className="flex-grow flex items-center justify-center mb-4">
            <Card title="Reservas Fallidas">
              <FailedReservationsList userId={user.id} />
            </Card>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-4">
            <Card title="Ajustes de Fitness Park">
              <button
                onClick={handleUnlinkFitnessPark}
                className="w-fit px-4 py-2 text-sm rounded-lg border border-yellow-500 shadow-sm bg-yellow-500 text-white hover:bg-yellow-600 transition duration-300"
              >
                Desvincular
              </button>
            </Card>
            <Card title="Ajustes de la Cuenta">
              <div className="flex flex-col space-y-2">
                <button
                  onClick={logout}
                  className="w-fit px-4 py-2 text-sm rounded-lg border border-gray-300 shadow-sm bg-white text-gray-700 hover:bg-gray-200 transition duration-300"
                >
                  Desconectar
                </button>
                <button
                  onClick={handleOpenConfirmationModal}
                  className="w-fit px-4 py-2 text-sm rounded-lg border border-red-500 shadow-sm bg-red-500 text-white hover:bg-red-600 transition duration-300"
                >
                  Borrar cuenta
                </button>
              </div>
            </Card>
          </div>
          <CarouselModal
            isOpen={isModalOpen}
            setIsOpen={setModalOpen}
            error={error}
            handleLinkFitnessPark={handleLinkFitnessPark}
          />
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
        </div>
      )}
      <Footer isLinked={user?.isLinked} />
    </div>
  );
}
