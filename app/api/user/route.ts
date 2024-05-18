import { NextResponse } from "next/server";
import { updateUser } from "@/services/UserService";

export async function PUT(request: Request) {
  try {
    const newUserData = await request.json();

    if (!newUserData) {
      console.error("New user data is required but not provided:", newUserData);
      return NextResponse.json({ error: "No data" }, { status: 500 });
    }

    if (!newUserData.id) {
      console.error("User ID is required but not provided:", newUserData);
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const result = await updateUser(newUserData);

    return NextResponse.json(result, { status: result.status });
  } catch (error) {
    console.error("Error in PUT /api/user:", error);
    return NextResponse.json({ error: "Failed to update user", status: 500 });
  }
}
