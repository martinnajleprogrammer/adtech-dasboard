// components/ad-slot-container.tsx
"use client";

import { useEffect, useState } from "react";
import { AdSlot } from "@/lib/mock-ad-slots";
import Card from "./card";
import AdSlotSkeleton from "./ad-slot-skeleton";

export default function AdSlotContainer({ adSlot }: { adSlot: AdSlot }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const delay = 500 + Math.random() * 1000; // simula latencia de la "subasta"
    const timer = setTimeout(() => setIsLoading(false), delay);
    return () => clearTimeout(timer); // cleanup si el componente se desmonta antes
  }, []);

  if (isLoading) return <AdSlotSkeleton />;

  return (
    <div className="opacity-100 transition-opacity duration-1000 starting:opacity-0">
      <Card adSlot={adSlot} />
    </div>
  );
}