import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const existingUserQuery =
      await sql`SELECT email FROM users WHERE email = ${email} and is_active = true;`;
    if (existingUserQuery.rows.length > 0) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const { rows } = await sql`
      INSERT INTO users(email, password_hash) VALUES(${email}, ${hashedPassword}) RETURNING email;
    `;

    return NextResponse.json({ user: rows[0] }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
