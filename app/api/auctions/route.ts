import { NextRequest, NextResponse } from "next/server";
import { resolveAuction } from "@/lib/auctions";
import type { AuctionRequest } from "@/lib/auctions";

export async function POST(req: NextRequest) {
  try {

    const body = await req.json(); // Read incoming 
    
    const { auctions } = body;

    if (!auctions || auctions.length <= 0) {
        return NextResponse.json({ error: "Malformed request" }, { status: 400 });
    }
    const results = auctions.map((a: AuctionRequest) => resolveAuction(a).result);
    return NextResponse.json({ success: true, results }, { status: 200 } );

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}