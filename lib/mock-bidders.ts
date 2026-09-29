// lib/mock-bidders.ts
export type Bidder = {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
};

export const BIDDERS: Bidder[] = [
  { id: "bidder-1", name: "AppNexus", code: "appnexus", isActive: true },
  { id: "bidder-2", name: "Rubicon Project", code: "rubicon", isActive: true },
  { id: "bidder-3", name: "PubMatic", code: "pubmatic", isActive: true },
  { id: "bidder-4", name: "OpenX", code: "openx", isActive: false }, // inactivo: nunca participa
];

export const AUCTION_TIMEOUT_MS = 1000;

type MockBidResponse = {
  bidderId: string;
  cpm: number;
  currency: "USD";
  responseTime: number; // ms
};

export function generateBidResponses(bidders: Bidder[] = BIDDERS): MockBidResponse[] {
  return bidders
    .filter((b) => b.isActive)
    .map((bidder) => ({
      bidderId: bidder.id,
      cpm: Number((Math.random() * 14 + 0.5).toFixed(2)), // range $0.50–$15.00
      currency: "USD",
      responseTime: Math.round(Math.random() * 1500), // 0–1500ms, timeout > 1500ms
    }));
}