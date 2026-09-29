import { NextResponse } from "next/server";

export async function GET() {
  const revenue = Number((Math.random() * 1500).toFixed(2));
  const today = new Date();
  return NextResponse.json({
    date: today.toISOString().substring(0, 10), totalRevenue: revenue, currency:'USD'})
};