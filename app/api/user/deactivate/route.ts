import { NextResponse } from "next/server";
import { deactivateAccount } from "@/services/UserService";

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();
    const result = await deactivateAccount(userId);

    return NextResponse.json(result, { status: result.status });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update user", status: 500 });
  }
}
