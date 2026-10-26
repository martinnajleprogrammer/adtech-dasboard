import { AUCTION_ERROR_RATE, resolveAuction } from "@/lib/auctions";
import type { AuctionDeps, AuctionResult } from "@/lib/auctions";
import type { AdSlot } from "@/lib/mock-ad-slots";
import { BIDDERS, generateBidResponses } from "@/lib/mock-bidders";
import { createRng } from "@/lib/seeded-random";

export type HistoryRow = AuctionResult & { round: number };

// Same seed -> same rng sequence -> same auction. Order of calls inside
// resolveAuction (id, failure, bids) is part of the contract.
const seededDeps = (seed: string): AuctionDeps => {
  const rng = createRng(seed);
  return {
    bidSource: () => generateBidResponses(BIDDERS, rng),
    shouldFail: () => rng() < AUCTION_ERROR_RATE,
    newAuctionId: () => seed,
  };
};

// Simulated history: rounds are numbered 1..N and returned newest first.
export const getSlotHistory = (slot: AdSlot, rounds = 10): HistoryRow[] => {
  const history: HistoryRow[] = [];
  for (let round = rounds; round >= 1; round--) {
    const { result } = resolveAuction(
      { adslotId: slot.id, floorPrice: slot.floorPrice },
      seededDeps(`${slot.id}:${round}`),
    );
    history.push({ ...result, round });
  }
  return history;
};
