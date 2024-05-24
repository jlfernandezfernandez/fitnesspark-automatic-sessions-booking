// pages/api/classes.ts

import { NextResponse } from "next/server";
import { getAvailableClasses } from "@/services/SessionsService";

export async function GET(request: Request) {
  try {
    const classes = await getAvailableClasses();
    return NextResponse.json(classes, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      error: "Failed to fetch available classes",
      status: 500,
    });
  }
}
