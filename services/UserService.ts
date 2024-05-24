"use server";

import bcrypt from "bcryptjs";
import { sql } from "@vercel/postgres";
import Joi from "joi";
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

// Schema de validación para los datos del usuario
const userSchema = Joi.object({
  id: Joi.number().integer().required(),
  email: Joi.string().required(), //  email: Joi.string().email().required(),
  isLinked: Joi.boolean().required(),
  fitnesspark_email: Joi.string().email().allow(null, ""),
  fitnesspark_password: Joi.string().allow(null, ""),
});

export async function login(email: string, password: string) {
  try {
    const { rows } = await sql`
      SELECT * FROM users WHERE email = ${email} AND is_active = true;
    `;

    if (rows.length === 0) {
      return { error: "User not found", status: 404 };
    }

    const user = rows[0];
    const passwordIsValid = await bcrypt.compare(password, user.password_hash);

    if (!passwordIsValid) {
      return { error: "User not found", status: 404 };
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
    const { rows: existingUsers } = await sql`
      SELECT email FROM users WHERE email = ${email} AND is_active = true;
    `;

    if (existingUsers.length > 0) {
      return { error: "User already exists", status: 400 };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const { rows } = await sql`
      INSERT INTO users (email, password_hash) VALUES (${email}, ${hashedPassword})
      RETURNING *;
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
  console.log("Updating user with data:", newUserData); // Agregar esta línea para registrar los datos que se están utilizando para la actualización

  const { error } = userSchema.validate(newUserData);
  if (error) {
    console.error("Validation error:", error.details[0].message);
    return { error: error.details[0].message, status: 400 };
  }

  try {
    const { rows } = await sql`
      SELECT * FROM users WHERE user_id = ${newUserData.id} AND is_active = true;
    `;
    console.log("Selected user:", rows); // Agregar esta línea para registrar el resultado de la consulta SELECT

    if (rows.length === 0) {
      return { error: "User not found", status: 404 };
    }

    await sql`
      UPDATE users
      SET
        is_linked_with_fitnesspark = ${newUserData.isLinked},
        fitnesspark_email = ${newUserData.fitnesspark_email},
        fitnesspark_password = ${encodeBase64(newUserData.fitnesspark_password)}
      WHERE user_id = ${newUserData.id};
    `;
    console.log("User updated successfully"); // Agregar esta línea para registrar que la actualización se realizó correctamente

    return { message: "User updated successfully", status: 200 };
  } catch (error) {
    console.error("Update user error:", error);
    return { error: "Failed to update user", status: 500 };
  }
}

export async function deactivateAccount(userId: number) {
  if (!userId) {
    console.error("User ID is required");
    return { error: "User ID is required", status: 400 };
  }

  try {
    const { rows } = await sql`
      SELECT * FROM users WHERE user_id = ${userId} AND is_active = true;
    `;

    if (rows.length === 0) {
      return { error: "User not found", status: 404 };
    }

    await sql`
      UPDATE users
      SET
        is_active = false,
        is_linked_with_fitnesspark = false,
        fitnesspark_email = NULL,
        fitnesspark_password = NULL
      WHERE user_id = ${userId};
    `;

    return { message: "Account deactivated successfully", status: 200 };
  } catch (error) {
    console.error("Deactivate account error:", error);
    return { error: "Failed to deactivate account", status: 500 };
  }
}
