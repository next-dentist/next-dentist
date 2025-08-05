import { db } from "@/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const headersList = await headers();
  const referer = headersList.get("referer");
  const apiKey = headersList.get("x-api-key");

  const isValidOrigin =
    referer && new URL(referer).origin === process.env.NEXT_PUBLIC_APP_URL;
  const hasValidApiKey = apiKey === process.env.API_SECRET_KEY;

  if (!isValidOrigin && !hasValidApiKey) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }
  try {
    const count = await db.dentist.count();
    return NextResponse.json({ success: true, count });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json(
      { success: false, error: "Database connection failed" },
      { status: 500 }
    );
  }
}
