import { useEffect, useRef, useState } from "react";
import useDebounce from "./useDebounce";

const DELAY = 250;

type TypeaheadResponse<T> = {
  results: T[];
  total: number;
};

type TypeaheadState<T> =
  | { status: 'idle' }
  | { status: 'loading'; query: string }
  | { status: 'results'; query: string; items: T[]; total: number }
  | { status: 'empty'; query: string }
  | { status: 'error'; query: string; message: string };

const MIN_CHARS = 2;

const useTypeAhead = (url: string, limit: number) => {

  const [state, setState] = useState<TypeaheadState<string>>({ status: "idle" })
  const [query, setQuery] = useState<string>("");
  const debouncedQuery = useDebounce(query, DELAY);
  const activeIndex = 0;
  const controllerRef = useRef<AbortController | null>(null);

  const handleQueryChange = (value: string) => {
    setQuery(value);

    if (value.trim().length < MIN_CHARS) {
      controllerRef.current?.abort();
      setState({ status: 'idle' });
    }
  };

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
    search();
    return () => controller.abort();

  }, [debouncedQuery, url, limit])




  return { state, setQuery: handleQueryChange }
};

export default useTypeAhead;