"use client";

import React from "react";
import { useUser } from "@/providers/UserContext";

export default function ProfilePage() {
  const { user, logout } = useUser();

  return (
    <div className="flex justify-center items-center min-h-screen bg-white p-4 text-black">
      <div className="text-center">
        {user ? (
          <>
            <h1 className="text-2xl font-bold">Bienvenido, {user.email}</h1>
            <button
              className="mt-4 px-4 py-2 rounded border-black text-black border"
              onClick={logout}
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <p>No hay usuario conectado.</p>
        )}
      </div>
    </div>
  );
}
