import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const { rows } = await sql`
      SELECT * FROM users WHERE email = ${email} and is_active = true;
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const user = rows[0];

    const passwordIsValid = await bcrypt.compare(password, user.password_hash);

    if (!passwordIsValid) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Login successful", user: { email: user.email } },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
