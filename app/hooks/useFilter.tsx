import type { AdSlot, AdSlotStatus } from "@/lib/mock-ad-slots";

export type FilterType = AdSlotStatus | "all";

const useFilter = (elements: AdSlot[], filter: FilterType) => {
  return elements.filter((element) => {
    if (filter === "all") return true;
    return element.status === filter;
  });
};

export default useFilter;
