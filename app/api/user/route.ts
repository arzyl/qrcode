import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "This is working",
    id: 1,
    status: "active"
  });
}
