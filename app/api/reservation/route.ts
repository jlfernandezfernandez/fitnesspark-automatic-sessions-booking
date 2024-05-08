import { NextResponse } from "next/server";
import {
  addReservation,
  getAllReservations,
} from "@/services/ReservationService";

export async function POST(request: Request) {
  try {
    const { reservation } = await request.json();
    const result = await addReservation(reservation);

    return NextResponse.json(result, { status: result.status });
  } catch (error) {
    return NextResponse.json({
      error: "Failed to add reservation",
      status: 500,
    });
  }
}

export async function GET(request: Request) {
  try {
    const { userId } = await request.json();
    const result = await getAllReservations(userId);

    return NextResponse.json(result, { status: result.status });
  } catch (error) {
    return NextResponse.json({
      error: "Failed to get reservations",
      status: 500,
    });
  }
}
