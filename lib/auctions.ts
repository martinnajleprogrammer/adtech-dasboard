import { randomUUID } from "crypto";
import { generateBidResponses, AUCTION_TIMEOUT_MS, generateFixedBidResponses } from '@/lib/mock-bidders';
import { cache } from "react";        
import { mockAdSlots } from "@/lib/mock-ad-slots";

import type { MockBidResponse } from '@/lib/mock-bidders';

export type AuctionDeps = {
  bidSource: (adslotId: string) => MockBidResponse[];              // source as a function returning an array of BidSource
  shouldFail: (adslotId: string) => boolean; // %5 of error
  newAuctionId: (adslotId: string) => string;
};

const defaultDeps: AuctionDeps = {
  bidSource: () => generateBidResponses(),
  shouldFail: () => Math.random() < AUCTION_ERROR_RATE,
  newAuctionId: () => randomUUID(),
};

export type AuctionRequest = { adslotId: string, floorPrice: number };

type AuctionResultBase = { adslotId: string; auctionId: string };

export type AuctionResult =
  | (AuctionResultBase & { status: 'error' })
  | (AuctionResultBase & { status: 'nofill' })
  | (AuctionResultBase & { status: 'winning'; bidId: string; cpm: number; currency: string });

const AUCTION_ERROR_RATE = 0.05; // 5% chance the mock auction engine "crashes" for this slot



export const resolveAuction = (auction: AuctionRequest, deps = defaultDeps): {
  result: AuctionResult;
  slowestBidderMs: number;
} => {

  const { floorPrice, adslotId } = auction;
  const auctionId = deps.newAuctionId(adslotId);

    // Simulate an auction-level failure (unrelated to any single bidder)
    if (deps.shouldFail(adslotId)) {
      return ({ result: { adslotId, auctionId, status: 'error' }, slowestBidderMs: 0 });
    }

  const bidders = deps.bidSource(adslotId);
  const bidderResponse = Math.max(...bidders.map(bidder => bidder.responseTime));

    const biddersAuction = bidders.filter((bidder) => bidder.responseTime <= AUCTION_TIMEOUT_MS);

    if (biddersAuction.length <= 0) {
      return ({ result: { adslotId, auctionId, status: 'nofill' }, slowestBidderMs: Math.min(bidderResponse, AUCTION_TIMEOUT_MS) });
    }

    const bidderWinners = biddersAuction.filter((bidder) => bidder.cpm > floorPrice);

    if (bidderWinners.length <= 0) {
      return ({ result: { adslotId, auctionId, status: 'nofill' }, slowestBidderMs: Math.min(bidderResponse, AUCTION_TIMEOUT_MS) });
    }

    const winner = bidderWinners.reduce((winner, bidder) => {
      if (bidder.cpm > winner.cpm) return bidder;
      return winner;
    }, bidderWinners[0]);
    // TODO: checking floor buckets
  return ({ result: { adslotId, auctionId, status: 'winning', bidId: winner.bidderId, cpm: winner.cpm, currency: winner.currency }, slowestBidderMs: Math.min(bidderResponse, AUCTION_TIMEOUT_MS) })

}
 
export async function runAuction(slotId: string): Promise<AuctionResult> {

  const fixedDeps: AuctionDeps = {
    bidSource: generateFixedBidResponses,
    shouldFail: (slotId) => slotId === 'slot-5',
    newAuctionId: (slotId) => `fixed-${slotId}`,
  };

  const deps = process.env.E2E_FIXED_AUCTIONS === '1' ? fixedDeps : defaultDeps;
  
  const adslot = mockAdSlots.find(slot => slot.id === slotId);
  if (!adslot) {
    return { adslotId: slotId, auctionId: randomUUID(), status: 'error' };
  }
  const auctionRequest: AuctionRequest = { adslotId: slotId, floorPrice: adslot.floorPrice };
  const { result, slowestBidderMs } = resolveAuction(auctionRequest, deps);
   await new Promise((resolve) => setTimeout(resolve, slowestBidderMs));
  return result;
}



export const getAuctionResult = cache(runAuction);