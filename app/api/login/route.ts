import { NextResponse } from "next/server";
import { login } from "@/services/UserService";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const response = await login(email, password);

    return NextResponse.json(response, { status: response.status });
  } catch (error) {
    return NextResponse.json({ error: "Login route failed" }, { status: 500 });
  }
}
