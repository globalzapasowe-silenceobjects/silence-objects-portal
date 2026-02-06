import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    connected: false,
    org_id: "82569452",
    message: "LinkedIn integration stub — connect via OAuth to activate",
  });
}
