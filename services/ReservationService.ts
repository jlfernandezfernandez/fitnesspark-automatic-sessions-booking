"user server";

import { sql } from "@vercel/postgres";

interface Reservation {
  id: number;
  userId: number;
  dayOfWeek: string;
  activity: string;
  time: string;
}

export async function addReservation(reservation: Reservation) {
  try {
    const { userId, dayOfWeek, activity, time } = reservation;
    await sql`
      INSERT INTO reservations (user_id, day_of_week, activity, time)
      VALUES (${userId}, ${dayOfWeek}, ${activity}, ${time});
    `;
    return { message: "Reservation added successfully", status: 200 };
  } catch (error) {
    console.error("Add reservation error:", error);
    return { error: "Failed to add reservation", status: 500 };
  }
}

export async function getAllReservations(userId: number) {
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
    return { error: "Failed to get all reservations", status: 500 };
  }
}
