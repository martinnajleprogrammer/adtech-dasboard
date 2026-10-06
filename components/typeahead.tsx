import useTypeAhead from '../hooks/useTypeAhead';

const TypeAhead = (limit: number, url: string) => {


  const { state, query, activeIndex, setQuery, onKeyDown, select } = useTypeAhead(url, limit);

  if (state === 'loading') return <div>Loading...</div>;
  return <>
    <div>SearchInput</div>
    {(state === 'results') && <div>ResultsList</div>}
    <div aria-live='assertive'>StatusMessage</div>
    <div aria-live='assertive'>ErrorMessage</div>
    {(state === 'empty') && <div aria-live='assertive'>No results.</div>}
  </>;
};

export default TypeAhead;