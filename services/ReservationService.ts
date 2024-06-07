"use server";

import { sql } from "@vercel/postgres";
import Joi from "joi";

interface Reservation {
  id: number;
  userId: number;
  dayOfWeek: string;
  activity: string;
  time: string;
}

interface NewReservation {
  userId: number;
  dayOfWeek: string;
  activity: string;
  time: string;
}

interface GetAllReservationsResponse {
  reservations: Reservation[];
  error?: string;
  status: number;
}

interface FailedReservation {
  id: number;
  userId: number;
  reservationId: number;
  dateOfFailure: string;
  errorMessage: string;
  sessionActivity: string;
  sessionTime: string;
}

interface GetAllFailedReservationsResponse {
  failedReservations: FailedReservation[];
  error?: string;
  status: number;
}

const reservationSchema = Joi.object({
  userId: Joi.number().integer().required(),
  dayOfWeek: Joi.string().valid("mon", "tue", "wed", "thu", "fri").required(),
  activity: Joi.string().max(255).required(),
  time: Joi.string()
    .pattern(/^\d{2}:\d{2}$/)
    .required(), // e.g., 14:30
});

export async function addReservation(reservation: NewReservation): Promise<{
  message?: string;
  reservation?: Reservation;
  error?: string;
  status: number;
}> {
  const { error } = reservationSchema.validate(reservation);
  if (error) {
    return { error: error.details[0].message, status: 400 };
  }

  try {
    const { userId, dayOfWeek, activity, time } = reservation;
    const { rows } = await sql`
      INSERT INTO reservations (user_id, day_of_week, activity, time)
      VALUES (${userId}, ${dayOfWeek}, ${activity}, ${time})
      RETURNING *;
    `;

    const createdReservation = rows[0];

    return {
      message: "Reservation added successfully",
      reservation: {
        id: createdReservation.id,
        userId: createdReservation.user_id,
        dayOfWeek: createdReservation.day_of_week,
        activity: createdReservation.activity,
        time: createdReservation.time,
      },
      status: 200,
    };
  } catch (error) {
    console.error("Add reservation error:", error);
    return { error: "Failed to add reservation", status: 500 };
  }
}

export async function deleteReservation(reservationId: number) {
  if (typeof reservationId !== "number") {
    return { error: "Invalid reservation ID", status: 400 };
  }

  try {
    await sql`
      DELETE FROM reservations
      WHERE id = ${reservationId};
    `;
    return { message: "Reservation deleted successfully", status: 200 };
  } catch (error) {
    console.error("Delete reservation error:", error);
    return { error: "Failed to delete reservation", status: 500 };
  }
}

export async function getAllReservations(
  userId: number
): Promise<GetAllReservationsResponse> {
  if (typeof userId !== "number") {
    return { reservations: [], error: "Invalid user ID", status: 400 };
  }

  try {
    const { rows } = await sql`
      SELECT * FROM reservations WHERE user_id = ${userId};
    `;
    const reservations = rows.map((row: any) => ({
      id: row.id,
      userId: row.user_id,
      dayOfWeek: row.day_of_week,
      activity: row.activity,
      time: row.time,
    }));
    return { reservations, status: 200 };
  } catch (error) {
    console.error("Get all reservations error:", error);
    return {
      reservations: [],
      error: "Failed to get all reservations",
      status: 500,
    };
  }
}

export async function getFailedReservations(
  userId: number
): Promise<FailedReservation[]> {
  if (typeof userId !== "number") {
    throw new Error("Invalid user ID");
  }

  try {
    const { rows } = await sql`
      SELECT 
        id, 
        user_id, 
        reservation_id, 
        date_of_failure, 
        error_message, 
        session_activity, 
        session_time 
      FROM failed_reservations 
      WHERE user_id = ${userId}
      ORDER BY date_of_failure DESC;
    `;
    return rows.map((row: any) => ({
      id: row.id,
      userId: row.user_id,
      reservationId: row.reservation_id,
      dateOfFailure: row.date_of_failure,
      errorMessage: row.error_message,
      sessionActivity: row.session_activity,
      sessionTime: row.session_time,
    }));
  } catch (error) {
    console.error("Get failed reservations error:", error);
    throw new Error("Failed to get failed reservations");
  }
}
