import type { AuctionRequest, AuctionResult } from "@/app/api/auctions/route";
import { useCallback, useEffect, useRef, useState } from "react";

const useAuctions = (timeout: number) => {

  const [results, setResults] = useState<AuctionResult[]>([]);
  const [auctions, setAuctions] = useState<AuctionRequest[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [lastSuccessAt, setLastSuccessAt] = useState<Date | null>(null);
  const [revenueTotal, setRevenueTotal] = useState(0);

  const increaseRevenueTotal = (result: AuctionResult) => {
    setRevenueTotal(prev => prev + (result.status === 'winning' && result.cpm || 0));
  };

  const auctionsRef = useRef<AuctionRequest[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const addAuction = useCallback((newAuction: AuctionRequest) => setAuctions(prev => [newAuction, ...prev]), [setAuctions]);

  const cancelAuctions = () => {
    console.log('cancelling...'); //Later some debug information
    setAuctions([]);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  // Returns the parsed results on success, or null on any failure (network, bad status, unexpected shape).
  // Never throws — update() can always await it safely.
  const sendAuctions = useCallback(async (): Promise<AuctionResult[] | null> => {
    try {
      const res = await fetch('api/auctions',
        { method: 'POST', body: JSON.stringify({ auctions: auctionsRef.current }) });
      const body = await res.json();

      if (!res.ok || !body.results) {
        setError(body?.error ?? `Request failed with status ${res.status}`);
        return null;
      }

      setError(null);
      setLastSuccessAt(new Date());
      return body.results as AuctionResult[];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error contacting /api/auctions');
      return null;
    }
  }, []);



  useEffect(() => {
    auctionsRef.current = auctions;
  }, [auctions]);

  useEffect(() => {
    const update = async () => {
      const res = await sendAuctions();
      if (res) {
        res.forEach(val => increaseRevenueTotal(val));
        setResults(res);
        setAuctions([]); // only clear the queue once the server actually processed it
      }
      timerRef.current = setTimeout(update, timeout);
    };

    timerRef.current = setTimeout(update, timeout);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [sendAuctions, timeout]);

  return {
    latestResults: results,
    addAuction,
    flush: sendAuctions,
    cancelAuctions,
    error,
    lastSuccessAt,
    revenueTotal
  }
};
export default useAuctions;
