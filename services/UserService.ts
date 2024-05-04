"use server";

import bcrypt from "bcryptjs";
import { sql } from "@vercel/postgres";
import { UserProps } from "@/model/UserData";

function encodeBase64(value: string | undefined) {
  if (!value) {
    return null;
  }
  return Buffer.from(value).toString("base64");
}

function decodeBase64(value: string | undefined) {
  if (!value) {
    return null;
  }
  return Buffer.from(value, "base64").toString("utf-8");
}

export async function login(email: string, password: string) {
  try {
    const { rows } = await sql`
        SELECT * FROM users WHERE email = ${email} and is_active = true;
      `;

    if (rows.length === 0) {
      return { error: "User not found", status: 404 };
    }

    const user = rows[0];
    const passwordIsValid = await bcrypt.compare(password, user.password_hash);

    if (!passwordIsValid) {
      return { error: "Invalid credentials", status: 401 };
    }

    return {
      message: "Login successful",
      user: {
        id: user.user_id,
        email: user.email,
        isLinked: user.is_linked_with_fitnesspark,
        fitnesspark_email: user.fitnesspark_email,
        fitnesspark_password: decodeBase64(user.fitnesspark_password),
      },
      status: 200,
    };
  } catch (error) {
    console.error("Login error:", error);
    return { error: "Login failed", status: 500 };
  }
}

export async function register(email: string, password: string) {
  try {
    const existingUserQuery =
      await sql`SELECT email FROM users WHERE email = ${email} and is_active = true;`;

    if (existingUserQuery.rows.length > 0) {
      return { error: "User already exists", status: 400 };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const { rows } = await sql`
      INSERT INTO users(email, password_hash) VALUES(${email}, ${hashedPassword}) RETURNING *;
    `;

    const user = rows[0];

    return {
      message: "User created",
      user: {
        id: user.user_id,
        email: user.email,
        isLinked: user.is_linked_with_fitnesspark,
        fitnesspark_email: user.fitnesspark_email,
        fitnesspark_password: decodeBase64(user.fitnesspark_password),
      },
      status: 200,
    };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Registration failed", status: 500 };
  }
}

export async function updateUser(newUserData: Partial<UserProps>) {
  try {
    const existingUserQuery = await sql`
          SELECT * FROM users WHERE user_id = ${newUserData.id} and is_active = true;
        `;

    if (existingUserQuery.rows.length === 0) {
      return { error: "User not found", status: 404 };
    }

    await sql`
          UPDATE users
          SET
            email = ${newUserData.email},
            is_linked_with_fitnesspark = ${newUserData.isLinked},
            fitnesspark_email = ${newUserData.fitnesspark_email},
            fitnesspark_password = ${encodeBase64(
              newUserData.fitnesspark_password
            )}
          WHERE user_id = ${newUserData.id};
        `;

    return { message: "User updated successfully", status: 200 };
  } catch (error) {
    console.error("Update user error:", error);
    return { error: "Failed to update user", status: 500 };
  }
}
