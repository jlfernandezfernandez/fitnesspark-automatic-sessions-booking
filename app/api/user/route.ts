import { NextResponse } from "next/server";
import { updateUser } from "@/services/UserService";

export async function PUT(request: Request) {
  try {
    const { newUserData } = await request.json();
    const result = await updateUser(newUserData);

    return NextResponse.json(result, { status: result.status });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update user", status: 500 });
  }
}
