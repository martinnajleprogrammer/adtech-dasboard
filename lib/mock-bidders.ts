// lib/mock-bidders.ts
export type Bidder = {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
};

export type MockBidResponse = {
  bidderId: string;
  cpm: number;
  currency: "USD";
  responseTime: number; // ms
};

export const BIDDERS: Bidder[] = [
  { id: "bidder-1", name: "AppNexus", code: "appnexus", isActive: true },
  { id: "bidder-2", name: "Rubicon Project", code: "rubicon", isActive: true },
  { id: "bidder-3", name: "PubMatic", code: "pubmatic", isActive: true },
  { id: "bidder-4", name: "OpenX", code: "openx", isActive: false }, // inactivo: nunca participa
];

export const AUCTION_TIMEOUT_MS = 1000;
const MAX_TIME = 1500;
const DEFAULT_PRICE = 14;
const MIN_PRICE = 0.5;

export function generateBidResponses(bidders: Bidder[] = BIDDERS): MockBidResponse[] {
  return bidders
    .filter((b) => b.isActive)
    .map((bidder) => ({
      bidderId: bidder.id,
      cpm: Number((Math.random() * DEFAULT_PRICE + MIN_PRICE).toFixed(2)), // range $0.50–$15.00
      currency: "USD",
      responseTime: Math.round(Math.random() * MAX_TIME), // 0–1500ms, timeout > 1500ms
    }));
}

// A bid source returns the bids for one ad slot. `generateBidResponses` (random)
// is the production-like source; `generateFixedBidResponses` is its deterministic
// counterpart, used only when a test asks for it (see runAuction).
export type BidSource = (adslotId: string) => MockBidResponse[];

const bid = (bidderId: string, cpm: number, responseTime: number): MockBidResponse =>
  ({ bidderId, cpm, currency: "USD", responseTime });

// Fixed bids per slot, designed so the REAL auction logic (floor price, timeout,
// highest bid wins) produces a known outcome. Floors come from mock-ad-slots.ts
// and the timeout is AUCTION_TIMEOUT_MS (1000ms).
const FIXED_BIDS: Record<string, MockBidResponse[]> = {
  // floor 10 -> WINNING 12.50 (9 is below the floor, 11 answers after the timeout)
  "slot-1": [bid("bidder-1", 12.5, 100), bid("bidder-2", 9, 200), bid("bidder-3", 11, 1200)],
  // floor 5 -> NOFILL (every bid is below the floor)
  "slot-2": [bid("bidder-1", 4.5, 100), bid("bidder-2", 3, 300), bid("bidder-3", 4, 900)],
  // floor 7 -> WINNING 8.00 (7.5 also qualifies but loses; 20 answers after the timeout)
  "slot-3": [bid("bidder-1", 8, 150), bid("bidder-2", 7.5, 300), bid("bidder-3", 20, 1400)],
  // floor 6 -> NOFILL (every bidder answers after the timeout)
  "slot-4": [bid("bidder-1", 9, 1100), bid("bidder-2", 10, 1300), bid("bidder-3", 8, 1500)],
  // floor 4 -> would be WINNING 5.00; the auction-level ERROR for this slot is forced separately
  "slot-5": [bid("bidder-1", 5, 100), bid("bidder-2", 3, 200), bid("bidder-3", 2, 300)],
  // floor 3 -> WINNING 3.25 (a bid equal to the floor does not qualify)
  "slot-6": [bid("bidder-1", 3.25, 100), bid("bidder-2", 2, 50), bid("bidder-3", 3, 200)],
};

export const generateFixedBidResponses: BidSource = (adslotId) => FIXED_BIDS[adslotId] ?? [];
