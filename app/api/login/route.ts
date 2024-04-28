export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  console.log(request.body);
  return NextResponse.json(
    { message: "Hello World register" },
    { status: 200 }
  );
}
