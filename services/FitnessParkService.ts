"use server";

import { UserProps } from "@/model/UserData";
import { sql } from "@vercel/postgres";

// Función para verificar la vinculación con Fitness Park
export async function checkFitnessParkLink(user: UserProps): Promise<boolean> {
  if (!user.fitnesspark_email || !user.fitnesspark_password) {
    return false;
  }

  try {
    const isLinked = await loginToFitnessPark(
      user.fitnesspark_email,
      user.fitnesspark_password
    );

    if (user.isLinked !== isLinked) {
      await updateUserFitnessParkLink(user.id, isLinked);
    }

    return isLinked;
  } catch (error) {
    console.error("Error checking Fitness Park link:", error);
    return false;
  }
}

// Función para iniciar sesión en Fitness Park
export async function loginToFitnessPark(
  username: string,
  password: string
): Promise<boolean> {
  const url = "https://services.virtuagym.com/v2/auth/login";
  const payload = { username, password };
  const headers = { "Content-Type": "application/json" };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
    });

    if (response.status === 401) {
      return false;
    }

    if (!response.ok) {
      throw new Error("Failed to fetch access token");
    }

    const data = await response.json();
    return !!data.accessToken; // Asegura que sea booleano
  } catch (error) {
    console.error("Error logging into Fitness Park:", error);
    throw new Error("Failed to fetch access token");
  }
}

// Función para actualizar el estado de vinculación con Fitness Park
export async function updateUserFitnessParkLink(
  userId: number,
  isLinked: boolean
): Promise<void> {
  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
    await sql`
      UPDATE users
      SET is_linked_with_fitnesspark = ${isLinked}
      WHERE user_id = ${userId} AND is_active = true;
    `;
  } catch (error) {
    console.error("Error updating user Fitness Park link:", error);
    throw new Error("Failed to update user Fitness Park link");
  }
}

// Función para desvincular la cuenta de Fitness Park
export async function unlinkFromFitnessPark(userId: number): Promise<void> {
  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
    await sql`
      UPDATE users
      SET
        fitnesspark_email = NULL,
        fitnesspark_password = NULL,
        is_linked_with_fitnesspark = false
      WHERE user_id = ${userId} AND is_active = true;
    `;
  } catch (error) {
    console.error("Error unlinking from Fitness Park:", error);
    throw new Error("Failed to unlink from Fitness Park");
  }
}
