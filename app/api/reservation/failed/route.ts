import { NextRequest, NextResponse } from "next/server";
import { getFailedReservations } from "@/services/ReservationService";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = parseInt(searchParams.get("userId") || "0", 10);

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
