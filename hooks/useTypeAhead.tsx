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
      fetch(`${url}?q=${encodeURIComponent(normalized)}&limit=${limit}`, { signal: controller.signal });
    };
    search();
    return () => controller.abort();

  }, [debouncedQuery, url, limit])




  return {}
};

export default useTypeAhead;