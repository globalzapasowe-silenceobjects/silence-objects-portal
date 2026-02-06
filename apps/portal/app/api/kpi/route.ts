import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    arr: 104000,
    mrr: 8667,
    dau: 342,
    churn: 2.1,
    ltv_cac: 4.2,
    conversion: 12.8,
    runway_months: 18,
    nrr: 108,
    currency: "PLN",
  });
}
