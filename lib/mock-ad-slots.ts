export const AD_SLOT_STATUSES = ["winning", "nofill", "pending", "error"] as const;
export type AdSlotStatus = (typeof AD_SLOT_STATUSES)[number];

export const STATUS_LABELS: Record<AdSlotStatus, string> = {
  winning: "Winning",
  nofill: "No Fill",
  pending: "Pending",
  error: "Error",
};

export type AdSlot = {
  id: string;
  name: string;
  size: string; // "300x250, "728x90", etc. format IAB standard
  status: AdSlotStatus;
  floorPrice:number
}
// Make a type of name with discriminated union and string both 
export const mockAdSlots: AdSlot[] = [
  { id: "slot-1", name: "Leaderboard", size: "728x90", status: "winning", floorPrice: 10 },
  { id: "slot-2", name: "Medium Rectangle", size: "300x250", status: "nofill", floorPrice: 5 },
  { id: "slot-3", name: "Large Rectangle", size: "336x280", status: "winning", floorPrice: 7 },
  { id: "slot-4", name: "Skyscraper", size: "160x600", status: "winning",  floorPrice: 6 },
  { id: "slot-5", name: "Hero", size: "160x600", status: "error", floorPrice: 4 },
  { id: "slot-6", name: "Footer", size: "160x600", status: "pending", floorPrice: 3 }
];

export const getAdSlot = (id: string): AdSlot | undefined => { 
 
  return mockAdSlots.find(slot => slot.id === id);
  
}
