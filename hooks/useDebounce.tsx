import { useEffect, useState } from "react";

const useDebounce = (query: string, delay: number) => {

  const [debouncedQuery, setDebouncedQuery] = useState<string>(query);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);
    return () => clearTimeout(timer);
  }, [query, delay]);

  return debouncedQuery;
};

export default useDebounce;
