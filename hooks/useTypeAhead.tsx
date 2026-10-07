import { useEffect, useRef, useState } from "react";
import useDebounce from "./useDebounce";

const DELAY = 250;

type TypeAheadResponse<T> = {
  results: T[];
  total: number;
};

export type TypeAheadState<T> =
  | { status: 'idle' }
  | { status: 'loading'; query: string }
  | { status: 'results'; query: string; items: T[]; total: number }
  | { status: 'empty'; query: string }
  | { status: 'error'; query: string; message: string };

const MIN_CHARS = 2;

const useTypeAhead = (url: string, limit: number) => {

  const [state, setState] = useState<TypeAheadState<string>>({ status: "idle" })
  const [query, setQuery] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  const debouncedQuery = useDebounce(query, DELAY);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const selectedItem = useRef<string | null>(null);

  const handleQueryChange = (value: string) => {
    setQuery(value);

    if (value.trim().length < MIN_CHARS) {
      controllerRef.current?.abort();
      setState({ status: 'idle' });
    }
    selectedItem.current = null;

  };


  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (state.status !== 'results') return;
    if (e.key === 'ArrowDown') {

      e.preventDefault();
      setIsOpen(true);
      if (activeIndex !== null) {
        setActiveIndex((activeIndex + 1) % state.items.length);
      } else setActiveIndex(0)

    } else if (e.key === 'ArrowUp') {

      e.preventDefault();
      setIsOpen(true);
      if (activeIndex !== null) {
        setActiveIndex((activeIndex - 1 + state.items.length) % state.items.length);
      } else setActiveIndex(0)

    } else if (e.key === 'Enter') {

      if (activeIndex === null) return;
      select(state.items[activeIndex]);

    } else if (e.key === 'Escape') {

      setIsOpen(false);
      setActiveIndex(null);

    }
  }


  const select = (item: string | null) => {
    const normalizedItem = item?.trim().toLowerCase();
    if (normalizedItem !== undefined) {
      handleQueryChange(normalizedItem);
    }
    selectedItem.current = normalizedItem ?? null;

    setState({ status: 'idle' });
  }

  useEffect(() => {
    const normalized = debouncedQuery.trim().toLowerCase();
    controllerRef.current?.abort();
    if (normalized.length < MIN_CHARS) return;

    const controller = new AbortController();
    controllerRef.current = controller;

    const search = async () => {
      setState({ status: 'loading', query: normalized });
      try {
        const res = await fetch(`${url}?q=${encodeURIComponent(normalized)}&limit=${limit}`, { signal: controller.signal });
        const data = await res.json();

        if (!res.ok || !data.results) {
          const msg = data?.error ?? `Request failed with status ${res.status}`;
          setState({ status: 'error', query: normalized, message: msg });
          return null;
        }
        if (data.results.length <= 0) {
          setState({ status: "empty", query: normalized });
        } else {
          setActiveIndex(null);
          setIsOpen(true);
          setState({ status: "results", query: normalized, items: data.results, total: data.total });
        }
      } catch (error: unknown) {
        if (error instanceof Error && error.name === 'AbortError') return;
        setState({
          status: 'error',
          query: normalized,
          message: 'Unknown error contacting /api/search'
        });
        return null;
      }
    };
    if (selectedItem.current && selectedItem.current === normalized) {
      return;
    };
    search();
    return () => controller.abort();

  }, [debouncedQuery, url, limit])




  return { state, setQuery: handleQueryChange, query, select, activeIndex, onKeyDown, isOpen }
};

export default useTypeAhead;