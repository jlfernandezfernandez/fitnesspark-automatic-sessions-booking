"use server";

import { UserProps } from "@/model/UserData";
import { sql } from "@vercel/postgres";

export async function checkFitnessParkLink(user: UserProps): Promise<boolean> {
  if (!user.fitnesspark_email || !user.fitnesspark_email) {
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
    return data.accessToken !== null;
  } catch (error) {
    throw new Error("Failed to fetch access token");
  }
}

export async function updateUserFitnessParkLink(
  userId: number,
  isLinked: boolean
): Promise<void> {
  try {
    await sql`
        UPDATE users
        SET is_linked_with_fitnesspark = ${isLinked}
        WHERE user_id = ${userId};
      `;
  } catch (error) {
    console.error("Error updating user Fitness Park link:", error);
    throw new Error("Failed to update user Fitness Park link");
  }
}
