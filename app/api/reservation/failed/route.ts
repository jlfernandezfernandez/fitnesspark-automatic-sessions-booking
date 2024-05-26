import { NextResponse } from "next/server";
import { getFailedReservations } from "@/services/ReservationService";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = parseInt(url.searchParams.get("userId") || "0", 10);
    if (isNaN(userId) || userId <= 0) {
      return NextResponse.json({
        error: "Invalid user ID",
        status: 400,
      });
    }
    const result = await getFailedReservations(userId);

    return NextResponse.json(result, { status: result.status });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({
      error: "Failed to get failed reservations",
      status: 500,
    });
  }
}
