"use server";

import { sql } from "@vercel/postgres";

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

export async function addReservation(reservation: NewReservation): Promise<{
  message?: string;
  reservation?: Reservation;
  error?: string;
  status: number;
}> {
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
