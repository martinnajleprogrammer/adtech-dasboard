import { NextRequest, NextResponse } from "next/server";

import { generateBidResponses, AUCTION_TIMEOUT_MS } from '../../../lib/mock-bidders';
import { randomUUID } from "crypto";
export type AuctionRequest = { adslotId: string, floorPrice: number };

type AuctionResultBase = { adslotId: string; auctionId: string };
export type AuctionResult =
  | (AuctionResultBase & { status: 'error' })
  | (AuctionResultBase & { status: 'nofill' })
  | (AuctionResultBase & { status: 'winning'; bidId: string; cpm: number; currency: string });


const AUCTION_ERROR_RATE = 0.05; // 5% chance the mock auction engine "crashes" for this slot

export async function POST(req: NextRequest) {
  try {

    const body = await req.json(); // Read incoming 
    
    const { auctions } = body;

    if (!auctions || auctions.length <= 0) {
      return NextResponse.json({ error: "Malformed request" }, { status: 400 });
    }
    
    const results: AuctionResult[] = auctions.map((auction: AuctionRequest): AuctionResult => { 
      const { floorPrice, adslotId } = auction;
      const auctionId = randomUUID();

      // Simulate an auction-level failure (unrelated to any single bidder)
      if (Math.random() < AUCTION_ERROR_RATE) {
        return ({ adslotId, auctionId, status: 'error' });
      }

      const bidders = generateBidResponses();

      const biddersAuction = bidders.filter((bidder) => bidder.responseTime <= AUCTION_TIMEOUT_MS);

      if (biddersAuction.length <= 0) {
        return ({ adslotId, auctionId, status: 'nofill' });
      }

      const bidderWinners = biddersAuction.filter((bidder) => bidder.cpm > floorPrice);

      if (bidderWinners.length <= 0) {
        return ({ adslotId, auctionId, status: 'nofill' });
      }

      const winner = bidderWinners.reduce((winner, bidder) => {
        if (bidder.cpm > winner.cpm) return bidder;
        return winner;
      }, bidderWinners[0]);
      // TODO: checking floor buckets
      return ({ adslotId, auctionId, status: 'winning', bidId: winner.bidderId, cpm: winner.cpm, currency: winner.currency })
      
    });

    return NextResponse.json({ success: true, results }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
